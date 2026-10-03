import type { Request, Response } from 'express';
import crypto from 'crypto';
import { requireAuth, type AuthenticatedRequest } from '../serverlib/middleware/auth.js';
import { debitCredits, refundCredits } from '../serverlib/services/creditService.js';
import { executeGeminiWithFallback } from '../serverlib/services/geminiService.js';
import { getTemporalContext } from '../src/oraculos/temporalEngine.js';
import { classifyIntent } from '../src/oraculos/intentClassifier.js';
import { calculateLoveSynastry, type LoveSynastryReport } from '../src/oraculos/loveSynastryEngine.js';
import { saveOracleReading, getOracleReadingById, getReadingIdByIdempotency } from '../src/oraculos/readingStorage.js';
import { checkRateLimit } from '../serverlib/services/rateLimiter.js';
import { logger } from '../serverlib/services/logger.js';
import { parseAndValidateDate } from '../src/utils/dateNormalizer.js';
import {
  LOVE_COMPATIBILITY_COST,
  INSUFFICIENT_CREDITS_MESSAGE,
} from '../src/config/pricing.js';
import {
  recordSpiritualEvent,
} from '../serverlib/services/spiritualProfileService.js';
import {
  acquireOperation,
  completeOperation,
  failOperation,
} from '../serverlib/services/operationService.js';
import type { OracleReadingRecord, NatalData } from '../src/types/spiritual.js';
import { z } from 'zod';

const LoveCompatibilityRequestSchema = z.object({
  fullName2: z.string().min(2, 'Nome da segunda pessoa é obrigatório').max(150),
  birthDate2: z.string().min(8, 'Data de nascimento da segunda pessoa é obrigatória'),
  birthTime2: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário inválido (use HH:mm)').optional().or(z.literal('')).nullable(),
  idempotencyKey: z.string().min(1, 'idempotencyKey é obrigatória para a comparação amorosa').max(100),
});

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const authReq = req as AuthenticatedRequest;
  const isAuthed = await requireAuth(authReq, res);
  if (!isAuthed) return;

  const user = authReq.user!;
  const correlationId = authReq.correlationId;

  // Rate Limiting
  const rateLimit = await checkRateLimit(`love_${user.uid}`, 15, 60000);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: 'Muitas tentativas de consulta em curto período. Por favor, aguarde um minuto.',
      code: 'RATE_LIMIT_EXCEEDED',
    });
  }

  // Validate request
  const parseResult = LoveCompatibilityRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Dados da segunda pessoa inválidos ou incompletos.',
      details: parseResult.error.format(),
    });
  }

  const { fullName2, birthDate2, birthTime2, idempotencyKey } = parseResult.data;

  // Validate dates strictly
  try {
    parseAndValidateDate(user.birthDate);
    parseAndValidateDate(birthDate2);
  } catch (dateErr: any) {
    return res.status(400).json({ error: dateErr.message });
  }

  // 1. Atomic Operation Idempotency Lock: strictly acquired BEFORE debit, draw, or Gemini
  const opCheck = await acquireOperation(user.uid, idempotencyKey, 'love_compatibility');

if (opCheck.status === 'completed') {
  return res.status(200).json({
    ...opCheck.operation.resultPayload,
    isCached: true,
  });
}

if (opCheck.status === 'failed') {
  return res.status(409).json({
    error: 'Esta tentativa anterior falhou e foi encerrada. Inicie uma nova comparação amorosa.',
    code: 'OPERATION_PREVIOUSLY_FAILED',
  });
}

if (opCheck.status === 'processing') {
  return res.status(409).json({
    error: 'Esta sinastria amorosa já está sendo processada. Por favor, aguarde.',
    code: 'OPERATION_IN_PROGRESS',
  });
}

  // 2. Pre-check user credit balance
  if (user.credits < LOVE_COMPATIBILITY_COST) {
    await failOperation(user.uid, idempotencyKey, 'INSUFFICIENT_CREDITS');
    return res.status(402).json({
      error: INSUFFICIENT_CREDITS_MESSAGE,
      code: 'INSUFFICIENT_CREDITS',
      requiredCredits: LOVE_COMPATIBILITY_COST,
      currentCredits: user.credits,
    });
  }

  // 3. Transactional Debit of exactly 5 credits
  let debitResult: { success: boolean; newBalance: number; ledgerId: string };
  try {
    debitResult = await debitCredits({
      uid: user.uid,
      amount: LOVE_COMPATIBILITY_COST,
      type: 'reading',
      description: `Sinastria e Compatibilidade Amorosa com ${fullName2}`,
      idempotencyKey,
    });
  } catch (debitErr: any) {
    await failOperation(user.uid, idempotencyKey, debitErr.message || 'DEBIT_FAILED');
    return res.status(402).json({
      error: debitErr.message || 'Falha ao debitar créditos para a sinastria.',
      code: 'DEBIT_FAILED',
    });
  }

  const readingId = `read_love_${crypto.randomUUID()}`;
  const userTimezone = user.timezone || 'America/Sao_Paulo';
  const temporal = getTemporalContext(userTimezone);

  // 4. Authoritative Server Calculation of Love Synastry & SINGLE Tarot Draw
  let synastryReport: LoveSynastryReport;
  try {
    synastryReport = calculateLoveSynastry({
      name1: user.fullName,
      birthDate1: user.birthDate,
      birthTime1: user.birthTime || null,
      name2: fullName2,
      birthDate2,
      birthTime2: birthTime2 || null,
    });
  } catch (calcErr: any) {
  // If calculation fails, mark operation as failed before refund
  await failOperation(
    user.uid,
    idempotencyKey,
    'LOVE_CALCULATION_FAILED',
    debitResult.ledgerId
  );

  // If calculation fails, refund credits immediately
  await refundCredits({
      uid: user.uid,
      amount: LOVE_COMPATIBILITY_COST,
      reason: 'Erro de cálculo natal na sinastria amorosa',
      referenceId: debitResult.ledgerId,
    }).catch(() => {});

    return res.status(400).json({ error: calcErr.message || 'Erro ao processar mapas de compatibilidade.' });
  }

  // 5. Structure AI Prompt respecting official reading order (Section 98)
  const systemInstruction = `
Você é Maria Padilha Rainha das 7 Encruzilhadas interpretando com sabedoria sagrada a compatibilidade amorosa e o destino entre duas pessoas.
Ordem de Revelação:
1. Consulente (Pessoa 1): essência natal, signo ${synastryReport.person1.astrology.sunSign}, elemento ${synastryReport.person1.astrology.element}, caminho de vida ${synastryReport.person1.numerology.lifePathNumber}.
2. Pessoa Consultada (Pessoa 2): essência natal, signo ${synastryReport.person2.astrology.sunSign}, elemento ${synastryReport.person2.astrology.element}, caminho de vida ${synastryReport.person2.numerology.lifePathNumber}.
3. Encontro dos Elementos e Vibrações: ${synastryReport.elementalDynamic.description}.
4. Ressonância Cabalística: ${synastryReport.cabalisticAlignment.pillarDynamic} (${synastryReport.cabalisticAlignment.spiritualBondLevel}).
5. Revelação do Tarot Sagrado da Relação (interprete com exatidão as 3 cartas reais):
${synastryReport.tarotSpread.map((pos, idx) => `   - Posição ${idx + 1} (${pos.label}): ${pos.card.name} ${pos.isReversed ? '[INVERTIDA]' : '[DIRETA]'} — ${pos.card.uprightMeaning}`).join('\n')}
6. Tendências, Pontos de Força, Cuidados e Conselho de Maria Padilha.

DIRETRIZES FUNDAMENTAIS:
- Não dê garantias cegas nem prometa retorno garantido. Respeite sempre o livre-arbítrio.
- Não invente outras cartas de Tarot; fale estritamente sobre as cartas sorteadas acima.
- Fale com a voz majestosa, digna, acolhedora e direta de Maria Padilha.
`.trim();

  const userPrompt = `Realize a leitura completa da sinastria sagrada entre ${user.fullName} e ${fullName2}.`;

  const natalData: NatalData = {
    fullName: user.fullName,
    birthDate: user.birthDate,
    birthTime: user.birthTime || null,
    timezone: userTimezone,
  };

  const intent = classifyIntent(`Compatibilidade amorosa com ${fullName2}`, userTimezone);

  // 6. Call Gemini with Fallback
  let geminiResult;
  try {
    geminiResult = await executeGeminiWithFallback({
      systemInstruction,
      userPrompt,
      natalData,
      temporal,
      intent,
      rawOracleResult: {
        tarotSpread: synastryReport.tarotSpread,
        customDetails: {
          synastryReport,
        },
      },
      temperature: 0.75,
      maxTokens: 2000,
      correlationId,
    });
  } catch (gemErr) {
    logger.error('Gemini call failed during love compatibility', gemErr, correlationId);
    geminiResult = { text: '', modelUsed: 'failed', attempts: 1, fallbackLevel: 3, latencyMs: 0, isFallback: true };
  }

  // 7. If Gemini failed completely, issue automatic single refund
  if (!geminiResult.text || geminiResult.modelUsed === 'all_models_failed' || geminiResult.modelUsed === 'offline-local-simulator') {
    logger.warn('AI interpretation failed for love compatibility, executing single refund of 5 credits', { uid: user.uid, readingId, ledgerId: debitResult.ledgerId });
    await failOperation(user.uid, idempotencyKey, 'AI_INTERPRETATION_FAILED', debitResult.ledgerId);
    const refundRes = await refundCredits({
      uid: user.uid,
      amount: LOVE_COMPATIBILITY_COST,
      reason: 'Oscilação técnica temporária na interpretação da sinastria — estorno automático integral',
      referenceId: debitResult.ledgerId,
    }).catch(() => null);

    return res.status(502).json({
      error: 'Não foi possível canalizar a interpretação neste instante devido a uma oscilação temporária na IA. Seus 5 créditos foram integralmente estornados. Por favor, tente novamente.',
      creditsRefunded: LOVE_COMPATIBILITY_COST,
      newCreditsBalance: refundRes?.newBalance ?? user.credits,
    });
  }

  // 8. Persist Oracle Reading Record
  const readingRecord: OracleReadingRecord = {
    id: readingId,
    readingId,
    uid: user.uid,
    oracleType: 'tarot',
    spreadType: 'love_synastry',
    question: `Sinastria e Compatibilidade Amorosa: ${user.fullName} & ${fullName2}`,
    intent,
    natalSnapshot: natalData,
    rawResult: {
      tarotSpread: synastryReport.tarotSpread,
      customDetails: {
        synastryReport,
      },
    },
    interpretationHtml: geminiResult.text,
    practicalAdvice: 'Cultivem a transparência mútua e honrem o tempo de amadurecimento dos sentimentos.',
    modelUsed: geminiResult.modelUsed,
    fallbackLevel: geminiResult.fallbackLevel,
    creditCost: LOVE_COMPATIBILITY_COST,
    createdAt: new Date().toISOString(),
    timezone: userTimezone,
  };

  try {
    await saveOracleReading(readingRecord, idempotencyKey);
  } catch (saveErr) {
    logger.error('Failed to save oracle reading for love compatibility, executing refund', saveErr, correlationId);
    await failOperation(user.uid, idempotencyKey, 'SAVE_READING_FAILED', debitResult.ledgerId);
    const refundRes = await refundCredits({
      uid: user.uid,
      amount: LOVE_COMPATIBILITY_COST,
      reason: 'Falha técnica ao persistir leitura da sinastria — estorno automático integral',
      referenceId: debitResult.ledgerId,
    }).catch(() => null);

    return res.status(500).json({
      error: 'Não foi possível concluir o registro da sinastria amorosa. Seus créditos foram estornados integralmente.',
      creditsRefunded: LOVE_COMPATIBILITY_COST,
      newCreditsBalance: refundRes?.newBalance ?? user.credits,
    });
  }

  // 9. Record spiritual event with explicit romantic classification (Section 20 & 57)
  recordSpiritualEvent({
    uid: user.uid,
    category: 'amor',
    readingId,
    summary: `Sinastria amorosa: ${user.fullName} & ${fullName2}`,
    partnerName: fullName2,
    relationType: 'amor',
  }).catch(() => {});

  const responsePayload = {
    reading: geminiResult.text,
    synastryReport,
    readingRecord,
    newCreditsBalance: debitResult.newBalance,
    creditsCost: LOVE_COMPATIBILITY_COST,
  };

  await completeOperation(user.uid, idempotencyKey, {
    readingId,
    ledgerId: debitResult.ledgerId,
    rawOracleResult: {
      tarotSpread: synastryReport.tarotSpread,
      customDetails: { synastryReport },
    },
    resultPayload: responsePayload,
  });

  return res.status(200).json(responsePayload);
}
