import type { Request, Response } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../serverlib/middleware/auth.js';
import { OracleReadingRequestSchema } from '../serverlib/validation/schemas.js';
import { debitCredits, refundCredits } from '../serverlib/services/creditService.js';
import { executeGeminiWithFallback } from '../serverlib/services/geminiService.js';
import { getTemporalContext } from '../src/oraculos/temporalEngine.js';
import { classifyIntent } from '../src/oraculos/intentClassifier.js';
import { drawTarotCards } from '../src/oraculos/tarotEngine.js';
import { throwBuzios } from '../src/oraculos/buziosEngine.js';
import { calculateNumerology } from '../src/oraculos/numerologyEngine.js';
import { calculateCabala } from '../src/oraculos/cabalaEngine.js';
import { calculateAstrology } from '../src/oraculos/astrologyEngine.js';
import {
  saveOracleReading,
  getOracleReadingById,
  getReadingIdByIdempotency,
} from '../src/oraculos/readingStorage.js';
import {
  acquireOperation,
  completeOperation,
  failOperation,
} from '../serverlib/services/operationService.js';
import { checkRateLimit } from '../serverlib/services/rateLimiter.js';
import { logger } from '../serverlib/services/logger.js';
import type { OracleReadingRecord, OracleRawResult, NatalData, ParticipantRole } from '../src/types/spiritual.js';
import {
  READING_CONSULTATION_COST,
  INSUFFICIENT_CREDITS_MESSAGE,
} from '../src/config/pricing.js';
import {
  assembleSpiritualAIContext,
  recordSpiritualEvent,
} from '../serverlib/services/spiritualProfileService.js';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const authReq = req as AuthenticatedRequest;
  const isAuthed = await requireAuth(authReq, res);
  if (!isAuthed) return;

  const user = authReq.user!;
  const correlationId = authReq.correlationId;

  // Rate Limiting: max 15 readings per minute per user
  const rateLimit = await checkRateLimit(`read_${user.uid}`, 15, 60000);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: 'Muitas consultas solicitadas em curto período. Por favor, aguarde um minuto.',
      code: 'RATE_LIMIT_EXCEEDED',
    });
  }

  // Validate request
  const parseResult = OracleReadingRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Parâmetros da consulta inválidos.',
      code: 'INVALID_REQUEST',
      details: parseResult.error.format(),
    });
  }

  const {
    type,
    question,
    specificName,
    specificDate,
    relationshipContext,
    participantRelation,
    participantRole,
    idempotencyKey,
    readingId,
  } = parseResult.data;

  // 1. Check if readingId was provided (historical reading retrieval - free, no draw, no debit)
  if (readingId) {
    const existing = await getOracleReadingById(user.uid, readingId);
    if (existing) {
      return res.status(200).json({
        reading: existing.interpretationHtml,
        readingRecord: existing,
        type: existing.oracleType,
        aiUsed: existing.modelUsed !== 'offline-local-simulator',
        isCached: true,
      });
    } else {
      return res.status(404).json({
        error: 'Consulta não encontrada ou acesso não autorizado.',
        code: 'NOT_FOUND',
      });
    }
  }

  // IdempotencyKey is strictly mandatory for any new paid reading consultation
  if (!idempotencyKey || typeof idempotencyKey !== 'string' || idempotencyKey.trim().length === 0) {
    return res.status(400).json({
      error: 'idempotencyKey é obrigatória para realizar uma consulta oracular.',
      code: 'MISSING_IDEMPOTENCY_KEY',
    });
  }

  // Atomic Operation Lock acquired BEFORE debit, draw, or Gemini
  const opCheck = await acquireOperation(user.uid, idempotencyKey, 'reading');

if (opCheck.status === 'completed') {
  return res.status(200).json({
    ...opCheck.operation.resultPayload,
    isCached: true,
  });
}

if (opCheck.status === 'failed') {
  return res.status(409).json({
    error: 'Esta tentativa anterior falhou e foi encerrada. Inicie uma nova consulta.',
    code: 'OPERATION_PREVIOUSLY_FAILED',
  });
}

if (opCheck.status === 'processing') {
  return res.status(409).json({
    error: 'Esta consulta oracular já está sendo processada. Por favor, aguarde.',
    code: 'OPERATION_IN_PROGRESS',
  });
}

  // REGRA DO PROPRIETÁRIO: Cada consulta oracular paga custa exatamente 5 créditos
  const creditCost = READING_CONSULTATION_COST; // 5 créditos

  // Pre-check balance before execution
  if (user.credits < creditCost) {
    await failOperation(user.uid, idempotencyKey, 'INSUFFICIENT_CREDITS');
    return res.status(402).json({
      error: INSUFFICIENT_CREDITS_MESSAGE,
      code: 'INSUFFICIENT_CREDITS',
    });
  }

  // 2. Debit Credits transactionally
  let debitResult: { success: boolean; newBalance: number; ledgerId: string };
  try {
    debitResult = await debitCredits({
      uid: user.uid,
      amount: creditCost,
      type: 'reading',
      description: `Consulta oracular: ${type}`,
      idempotencyKey,
    });
  } catch (err: any) {
    await failOperation(user.uid, idempotencyKey, err.message || 'DEBIT_FAILED');
    if (err.message === 'INSUFFICIENT_CREDITS') {
      return res.status(402).json({
        error: INSUFFICIENT_CREDITS_MESSAGE,
        code: 'INSUFFICIENT_CREDITS',
      });
    }
    logger.error('Credit debit failure in reading', err, correlationId);
    return res.status(500).json({ error: 'Falha ao debitar créditos da leitura.' });
  }
try {

  // 3. Prepare Context & Real Oracle Execution
  const userTimezone = user.timezone || 'America/Sao_Paulo';
  const temporal = getTemporalContext(userTimezone);
  const userQuestion = question?.trim() || `Consulta geral aos oráculos sagrados na modalidade ${type}`;
  const intent = classifyIntent(userQuestion, userTimezone);

  // Authoritative consulente natal data from database ONLY (client cannot override)
  const natalSnapshot: NatalData = {
    fullName: user.fullName || 'Consulente',
    birthDate: user.birthDate || '',
    birthTime: user.birthTime || null,
    timezone: userTimezone,
  };

  // Explicit mapping of relationship context — NEVER assume "parceiro_amoroso" if declared business/family/work
  let assignedRole: ParticipantRole = 'outro';
  let assignedContext = 'consulta';

  if (specificName) {
    const rawRel = (relationshipContext || participantRelation || participantRole || '').toLowerCase().trim();
    if (rawRel === 'sociedade' || rawRel === 'socio') {
      assignedRole = 'socio';
      assignedContext = 'sociedade';
    } else if (['trabalho', 'chefe', 'funcionario', 'cliente'].includes(rawRel)) {
      assignedRole = rawRel === 'chefe' ? 'chefe' : rawRel === 'funcionario' ? 'funcionario' : 'outro';
      assignedContext = 'trabalho';
    } else if (rawRel === 'familia' || rawRel === 'familiar') {
      assignedRole = 'familiar';
      assignedContext = 'familia';
    } else if (rawRel === 'amizade' || rawRel === 'amigo') {
      assignedRole = 'amigo';
      assignedContext = 'amizade';
    } else if (['amor', 'ex', 'conjuge', 'namorado', 'namorada', 'parceiro_amoroso'].includes(rawRel)) {
      assignedRole = rawRel === 'ex' ? 'ex' : 'parceiro_amoroso';
      assignedContext = 'amor';
    } else if (intent.isRomantic) {
      assignedRole = 'parceiro_amoroso';
      assignedContext = 'amor';
    }

    const existingParticipant = intent.participants.find((p) => p.name.toLowerCase() === specificName.toLowerCase());
    if (existingParticipant) {
      if (specificDate && !existingParticipant.birthDate) existingParticipant.birthDate = specificDate;
      existingParticipant.role = assignedRole;
      existingParticipant.relationshipContext = assignedContext;
    } else {
      intent.participants.push({
        name: specificName,
        birthDate: specificDate,
        role: assignedRole,
        relationshipContext: assignedContext,
      });
    }
  }

  const rawResult: OracleRawResult = {};

  // Execute REAL physical/digital oracle calculations
  if (type === 'tarot' || type === 'premium_complete') {
    rawResult.tarotSpread = drawTarotCards(3);
  }

  if (type === 'buzios' || type === 'premium_complete') {
    rawResult.buzios = throwBuzios();
  }

  if (type === 'numerology' || type === 'premium_complete') {
    rawResult.numerology = calculateNumerology(natalSnapshot.fullName, natalSnapshot.birthDate);
  }

  if (type === 'cabala' || type === 'premium_complete') {
    rawResult.cabala = calculateCabala(natalSnapshot.birthDate);
  }

  if (type === 'astrology' || type === 'premium_complete') {
    rawResult.astrology = calculateAstrology(natalSnapshot.birthDate, natalSnapshot.birthTime, userTimezone);
  }

  if (type === 'odu') {
    const buz = throwBuzios();
    rawResult.buzios = buz;
    rawResult.oduCalculated = {
      name: buz.oduName,
      number: buz.openCount,
      description: buz.oduEnergy,
    };
  }

  const newReadingId = `read_${crypto.randomUUID()}`;

  // 4. Assemble deep permanent spiritual profile & AI context
  // If the extended profile fails, the real oracle result must still be delivered.
  let spiritualSystemContext = '';
  try {
    const spiritualAI = await assembleSpiritualAIContext({
      user,
      question: userQuestion,
      rawOracleResult: rawResult,
      partnerData: specificName ? {
        name: specificName,
        birthDate: specificDate,
        role: assignedRole,
        relationshipContext: assignedContext,
      } : undefined,
    });
    spiritualSystemContext = spiritualAI.systemContext;
  } catch (contextErr) {
    logger.warn('Spiritual profile/context unavailable; continuing with real oracle result', { error: String(contextErr) });
    spiritualSystemContext = 'Interprete com profundidade exclusivamente os resultados reais do oráculo fornecidos nesta consulta, respeitando o livre-arbítrio e sem inventar resultados.';
  }

  // 5. Gemini Interpretation of the REAL Oracle Result
  const systemInstruction = `
Você é Maria Padilha Rainha das 7 Encruzilhadas interpretando um sorteio sagrado real para o consulente.
Aja com respeito, dignidade, sabedoria espiritual e livre-arbítrio.
Você recebeu os resultados VERDADEIROS calculados pelo sistema. Não invente cartas nem búzios diferentes dos enviados.
Explique o significado de cada carta/queda/número/esfera e sintetize uma orientação prática e espiritual.
Use parágrafos claros, estruturados e respeitosos. Produza uma interpretação completa, detalhada e aprofundada com aproximadamente 3.000 caracteres. Desenvolva bem o significado do oráculo, a interpretação espiritual e a orientação prática. Não entregue respostas curtas e nunca termine a resposta no meio de uma frase. Jamais faça previsões fatais de saúde ou morte.

${spiritualSystemContext}
`;

  let interpretationHtml = '';
  let modelUsed = 'offline-local-simulator';
  let fallbackLevel = 0;

  try {
    const geminiRes = await executeGeminiWithFallback({
      systemInstruction,
      userPrompt: `Interprete este oráculo (${type}) para a pergunta: "${userQuestion}". Pessoa específica envolvida: ${specificName || 'nenhuma'}.`,
      natalData: natalSnapshot,
      temporal,
      intent,
      rawOracleResult: rawResult,
      temperature: 0.8,
      maxTokens: 2200,
      correlationId,
    });

    if (geminiRes.text) {
      interpretationHtml = geminiRes.text;
      modelUsed = geminiRes.modelUsed;
      fallbackLevel = geminiRes.fallbackLevel;
    }
  } catch (geminiErr) {
    logger.warn('Gemini failed for reading, using structured local interpretation:', { error: String(geminiErr) });
  }

  // If AI generation failed, generate deterministic structured local interpretation based EXCLUSIVELY on real rawResult
  if (!interpretationHtml) {
    interpretationHtml = buildStructuredLocalInterpretation(type, natalSnapshot, rawResult, intent);
    modelUsed = 'offline-local-simulator';
  }

  const readingRecord: OracleReadingRecord = {
    id: newReadingId,
    readingId: newReadingId,
    uid: user.uid,
    oracleType: type as any,
    spreadType: type === 'tarot' ? 'tres_cartas' : undefined,
    question: userQuestion,
    intent,
    natalSnapshot,
    rawResult,
    interpretationHtml,
    practicalAdvice: 'Mantenha a firmeza de pensamento, honre sua palavra e aja com dignidade nos seus passos.',
    modelUsed,
    fallbackLevel,
    creditCost,
    createdAt: new Date().toISOString(),
    timezone: userTimezone,
  };

  try {
    await saveOracleReading(readingRecord, idempotencyKey);
  } catch (saveErr) {
    logger.error('Failed to save oracle reading in /api/reading, executing refund', saveErr, correlationId);
    await failOperation(user.uid, idempotencyKey, 'SAVE_READING_FAILED', debitResult.ledgerId);
    await refundCredits({
      uid: user.uid,
      amount: creditCost,
      reason: 'Falha técnica ao persistir leitura oracular — estorno automático integral',
      referenceId: debitResult.ledgerId,
    }).catch(() => null);

    return res.status(500).json({
      error: 'Não foi possível salvar a leitura oracular. Seus créditos foram estornados integralmente.',
      code: 'SAVE_READING_FAILED',
    });
  }

  recordSpiritualEvent({
    uid: user.uid,
    category: type,
    readingId: newReadingId,
    summary: `${type}: ${userQuestion}`,
    partnerName: specificName,
    relationType: assignedRole,
  }).catch(() => {});

  const responsePayload = {
    reading: interpretationHtml,
    readingRecord,
    type,
    aiUsed: modelUsed !== 'offline-local-simulator',
    newCreditsBalance: debitResult.newBalance,
  };

  await completeOperation(user.uid, idempotencyKey, {
    readingId: newReadingId,
    ledgerId: debitResult.ledgerId,
    rawOracleResult: rawResult,
    resultPayload: responsePayload,
  });

  return res.status(200).json(responsePayload);

} catch (err: any) {
  logger.error(
    'Falha após débito durante execução da consulta, executando estorno',
    err,
    correlationId
  );

  await failOperation(
    user.uid,
    idempotencyKey,
    err?.message || 'READING_EXECUTION_FAILED',
    debitResult.ledgerId
  );

  const refundRes = await refundCredits({
    uid: user.uid,
    amount: creditCost,
    reason: 'Falha técnica durante a execução da consulta — estorno automático integral',
    referenceId: debitResult.ledgerId,
  }).catch(() => null);

  return res.status(500).json({
    error: 'Não foi possível concluir a consulta. Seus créditos foram estornados integralmente.',
    code: 'READING_EXECUTION_FAILED',
    refunded: true,
    newCreditsBalance: refundRes?.newBalance,
  });
}
}

function buildStructuredLocalInterpretation(
  type: string,
  natal: NatalData,
  raw: OracleRawResult,
  intent: any
): string {
  let body = '';

  if (raw.tarotSpread) {
    body += `<h4>🃏 Cartas do Tarot Reveladas:</h4>`;
    raw.tarotSpread.forEach((pos) => {
      body += `<p><strong>${pos.label}: ${pos.card.name}</strong> (${pos.isReversed ? 'Invertida' : 'Direta'})<br/>
      ${pos.specificInterpretation || pos.card.uprightMeaning}<br/>
      <em>Conselho: ${pos.card.spiritualAdvice}</em></p>`;
    });
  }

  if (raw.buzios) {
    body += `<h4>🐚 Jogo de Búzios:</h4>
    <p>Caída com <strong>${raw.buzios.openCount} búzios abertos</strong> e <strong>${raw.buzios.closedCount} fechados</strong>.<br/>
    Odù Regente: <strong>${raw.buzios.oduName}</strong> — ${raw.buzios.oduEnergy}<br/>
    <em>Conselho do Odù:</em> ${raw.buzios.oduAdvice}</p>`;
  }

  if (raw.numerology) {
    body += `<h4>🔢 Numerologia da Alma:</h4>
    <p>Caminho de Vida: <strong>${raw.numerology.lifePathNumber}</strong> | Expressão: <strong>${raw.numerology.expressionNumber}</strong> | Desejo da Alma: <strong>${raw.numerology.soulUrgeNumber}</strong><br/>
    ${raw.numerology.summary}</p>`;
  }

  if (raw.cabala) {
    body += `<h4>🌌 Cabala Hermética e Anjo Guardião:</h4>
    <p>Esfera da Árvore da Vida: <strong>${raw.cabala.sephirahName}</strong> | Arcanjo Regente: <strong>${raw.cabala.rulingArchangel}</strong><br/>
    Anjo Guardião: <strong>${raw.cabala.guardianAngel.name}</strong> (${raw.cabala.guardianAngel.choir})<br/>
    <em>Virtude:</em> ${raw.cabala.guardianAngel.virtue}</p>`;
  }

  if (raw.astrology) {
    body += `<h4>🌙 Astrologia e Horário Cósmico:</h4>
    <p>Sol em: <strong>${raw.astrology.sunSign}</strong> (Elemento ${raw.astrology.element}, Modo ${raw.astrology.modality})<br/>
    Fase da Lua: <strong>${raw.astrology.lunarPhase}</strong> — ${raw.astrology.lunarPhaseDescription}<br/>
    Hora Planetária Regente: <strong>${raw.astrology.planetaryHourRuler ? raw.astrology.planetaryHourRuler : 'não calculada porque a hora de nascimento não foi informada'}</strong></p>`;
  }

  return `
    <div class="space-y-4">
      <h3>🌹 Revelação dos Oráculos de Maria Padilha</h3>
      <p>Consulente: <strong>${natal.fullName}</strong> — Data de Nascimento: <strong>${natal.birthDate}</strong></p>
      ${body}
      <p><strong>Orientação de Maria Padilha:</strong> A leitura dos teus caminhos mostra que as respostas não dependem de ansiedade, mas de postura e dignidade. A rosa floresce sem pressa, e quem tem olhos firmes reconhece a sua hora de agir.</p>
    </div>
  `;
}
