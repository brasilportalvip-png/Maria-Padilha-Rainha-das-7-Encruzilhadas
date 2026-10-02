import type { Request, Response } from 'express';
import { requireAuth, type AuthenticatedRequest } from './middleware/auth.js';
import { OracleReadingRequestSchema } from './validation/schemas.js';
import { debitCredits, refundCredits } from './services/creditService.js';
import { executeGeminiWithFallback } from './services/geminiService.js';
import { getTemporalContext } from '../src/oraculos/temporalEngine.js';
import { classifyIntent } from '../src/oraculos/intentClassifier.js';
import { drawTarotCards } from '../src/oraculos/tarotEngine.js';
import { throwBuzios } from '../src/oraculos/buziosEngine.js';
import { calculateNumerology } from '../src/oraculos/numerologyEngine.js';
import { calculateCabala } from '../src/oraculos/cabalaEngine.js';
import { calculateAstrology } from '../src/oraculos/astrologyEngine.js';
import { saveOracleReading, getOracleReadingById, getReadingIdByIdempotency } from '../src/oraculos/readingStorage.js';
import { checkRateLimit } from './services/rateLimiter.js';
import { logger } from './services/logger.js';
import type { OracleReadingRecord, OracleRawResult, NatalData } from '../src/types/spiritual.js';
import {
  READING_CONSULTATION_COST,
  INSUFFICIENT_CREDITS_MESSAGE,
} from '../src/config/pricing.js';
import {
  assembleSpiritualAIContext,
  recordSpiritualEvent,
} from './services/spiritualProfileService.js';

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

  const { type, question, specificName, specificDate, idempotencyKey, readingId } = parseResult.data;

  // 1. Check if readingId or idempotencyKey already exists (F5 or reload should NOT redraw cards!)
  if (readingId) {
    const existing = await getOracleReadingById(readingId);
    if (existing) {
      return res.status(200).json({
        reading: existing.interpretationHtml,
        readingRecord: existing,
        type: existing.oracleType,
        aiUsed: existing.modelUsed !== 'offline-local-simulator',
        isCached: true,
      });
    }
  }

  const existingId = await getReadingIdByIdempotency(user.uid, idempotencyKey);
  if (existingId) {
    const existing = await getOracleReadingById(existingId);
    if (existing) {
      return res.status(200).json({
        reading: existing.interpretationHtml,
        readingRecord: existing,
        type: existing.oracleType,
        aiUsed: existing.modelUsed !== 'offline-local-simulator',
        isCached: true,
      });
    }
  }

  // REGRA DO PROPRIETÁRIO: Cada consulta oracular paga custa exatamente 5 créditos
  const creditCost = READING_CONSULTATION_COST; // 5 créditos

  // Pre-check balance before execution
  if (user.credits < creditCost) {
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
      idempotencyKey: idempotencyKey || `read_${user.uid}_${crypto.randomUUID()}`,
    });
  } catch (err: any) {
    if (err.message === 'INSUFFICIENT_CREDITS') {
      return res.status(402).json({
        error: INSUFFICIENT_CREDITS_MESSAGE,
        code: 'INSUFFICIENT_CREDITS',
      });
    }
    logger.error('Credit debit failure in reading', err, correlationId);
    return res.status(500).json({ error: 'Falha ao debitar créditos da leitura.' });
  }

  // 3. Prepare Context & Real Oracle Execution
  const userTimezone = user.timezone || 'America/Sao_Paulo';
  const temporal = getTemporalContext(userTimezone);
  const userQuestion = question || `Consulta aos oráculos sagrados na modalidade ${type}`;
  const intent = classifyIntent(userQuestion, userTimezone);

  // Authoritative consulente natal data from database ONLY (client cannot override)
  const natalSnapshot: NatalData = {
    fullName: user.fullName || 'Consulente',
    birthDate: user.birthDate || '',
    birthTime: user.birthTime || '',
    city: user.city || '',
    timezone: userTimezone,
  };

  // Distinct participant structure for third parties (does not mutate consulente natal record)
  if (specificName) {
    const existingParticipant = intent.participants.find((p) => p.name.toLowerCase() === specificName.toLowerCase());
    if (existingParticipant) {
      if (specificDate && !existingParticipant.birthDate) existingParticipant.birthDate = specificDate;
    } else {
      intent.participants.push({
        name: specificName,
        birthDate: specificDate,
        role: intent.isRomantic ? 'parceiro_amoroso' : 'outro',
        relationshipContext: intent.isRomantic ? 'amor' : 'consulta',
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
  const spiritualAI = await assembleSpiritualAIContext({
    user,
    question: userQuestion,
    rawOracleResult: rawResult,
    partnerData: specificName ? { name: specificName, birthDate: specificDate } : undefined,
  });

  // 5. Gemini Interpretation of the REAL Oracle Result
  const systemInstruction = `
Você é Maria Padilha Rainha das 7 Encruzilhadas interpretando um sorteio sagrado real para o consulente.
Aja com respeito, dignidade, sabedoria espiritual e livre-arbítrio.
Você recebeu os resultados VERDADEIROS calculados pelo sistema. Não invente cartas nem búzios diferentes dos enviados.
Explique o significado de cada carta/queda/número/esfera e sintetize uma orientação prática e espiritual.
Use parágrafos claros, estruturados e respeitosos. Jamais faça previsões fatais de saúde ou morte.

${spiritualAI.systemContext}
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
      maxTokens: type === 'premium_complete' ? 2200 : 1200,
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

  await saveOracleReading(readingRecord, idempotencyKey);

  recordSpiritualEvent({
    uid: user.uid,
    category: type,
    readingId: newReadingId,
    summary: `${type}: ${userQuestion}`,
    partnerName: specificName,
  }).catch(() => {});

  return res.status(200).json({
    reading: interpretationHtml,
    readingRecord,
    type,
    aiUsed: modelUsed !== 'offline-local-simulator',
    newCreditsBalance: debitResult.newBalance,
  });
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
    Hora Planetária Regente: <strong>${raw.astrology.planetaryHourRuler}</strong></p>`;
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
