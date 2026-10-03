import type { Request, Response } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../serverlib/middleware/auth.js';
import { ChatMessageSchema } from '../serverlib/validation/schemas.js';
import { checkRateLimit } from '../serverlib/services/rateLimiter.js';
import { debitCredits, refundCredits } from '../serverlib/services/creditService.js';
import { executeGeminiWithFallback } from '../serverlib/services/geminiService.js';
import { getTemporalContext } from '../src/oraculos/temporalEngine.js';
import { classifyIntent } from '../src/oraculos/intentClassifier.js';
import { analyzeQuestionRepetition } from '../src/oraculos/antiRepetition.js';
import { drawTarotCards } from '../src/oraculos/tarotEngine.js';
import { saveOracleReading } from '../src/oraculos/readingStorage.js';
import {
  acquireOperation,
  completeOperation,
  failOperation,
} from '../serverlib/services/operationService.js';
import { logger } from '../serverlib/services/logger.js';
import type { NatalData, OracleReadingRecord } from '../src/types/spiritual.js';
import {
  ORACLE_QUESTION_COST,
  ORACLE_FOLLOWUP_COST,
  FREE_GREETING_SUPPORT_COST,
  INSUFFICIENT_CREDITS_MESSAGE,
} from '../src/config/pricing.js';
import {
  assembleSpiritualAIContext,
  recordSpiritualEvent,
} from '../serverlib/services/spiritualProfileService.js';

export type ChatMessageType = 'CONVERSATION' | 'SUPPORT' | 'ORACLE_QUESTION' | 'ORACLE_FOLLOWUP';

export function classifyChatMessageType(message: string, historyLength: number = 0): ChatMessageType {
  const norm = message.toLowerCase().trim();
  const unaccented = norm.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Support / Account / Pricing questions
  if (
    norm.includes('quanto custa') ||
    norm.includes('comprar credito') ||
    norm.includes('como funciona') ||
    norm.includes('preço') ||
    norm.includes('valor do credito') ||
    norm.includes('politica de privacidade') ||
    norm.includes('ajuda com a conta') ||
    norm.includes('suporte')
  ) {
    return 'SUPPORT';
  }

  // Oracle Follow-up (requesting explanation of previous draw without new draw)
  if (
    historyLength > 0 &&
    (norm.includes('segunda carta') ||
      norm.includes('primeira carta') ||
      norm.includes('terceira carta') ||
      norm.includes('essa carta') ||
      norm.includes('explique melhor') ||
      norm.includes('o que significa essa') ||
      norm.includes('e sobre essa resposta') ||
      norm.includes('naquela carta'))
  ) {
    return 'ORACLE_FOLLOWUP';
  }

  // Casual greeting without divination question
  const isGreetingOnly =
    /^(oi|ola|bom dia|boa tarde|boa noite|salve|laroye|sarava|tudo bem|como vai|grato|obrigad[oa]|axe)(\s+(maria\s+padilha|rainha|dona\s+maria|minha\s+rainha|padilha|comadre))?[.!? ]*$/i.test(unaccented);
  if (isGreetingOnly) {
    return 'CONVERSATION';
  }

  return 'ORACLE_QUESTION';
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const authReq = req as AuthenticatedRequest;
  const isAuthed = await requireAuth(authReq, res);
  if (!isAuthed) return;

  const user = authReq.user!;
  const correlationId = authReq.correlationId;

  // Distributed Rate Limiting: 25 messages per minute per user
  const rateCheck = await checkRateLimit(`chat_${user.uid}`, 25, 60 * 1000);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      error: 'Muitas mensagens enviadas em pouco tempo. Respire fundo e tente novamente em instantes.',
      code: 'RATE_LIMITED',
      retryAfterMs: rateCheck.resetInMs,
    });
  }

  // Validate payload
  const parseResult = ChatMessageSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Dados da mensagem inválidos.',
      code: 'INVALID_REQUEST',
      details: parseResult.error.format(),
    });
  }

  const { message, history, pomboGiraName, idempotencyKey } = parseResult.data;
  const activeName = pomboGiraName || 'Maria Padilha Rainha das 7 Encruzilhadas';

  // 1. Classify Message Type: CONVERSATION, SUPPORT, ORACLE_QUESTION, ORACLE_FOLLOWUP
  const messageType = classifyChatMessageType(message, history?.length || 0);

  // REGRA DO PROPRIETÁRIO:
  // - SUPPORT / CONVERSATION: 0 créditos
  // - ORACLE_QUESTION / ORACLE_FOLLOWUP / Pombo Gira advice: EXATAMENTE 5 CRÉDITOS
  let requiredCredits = FREE_GREETING_SUPPORT_COST;
  if (messageType === 'ORACLE_QUESTION' || messageType === 'ORACLE_FOLLOWUP') {
    requiredCredits = ORACLE_QUESTION_COST; // 5 créditos
  }

  // IdempotencyKey is MANDATORY for paid oracle chat operations
  if (requiredCredits > 0) {
    if (!idempotencyKey || typeof idempotencyKey !== 'string' || idempotencyKey.trim().length === 0) {
      return res.status(400).json({
        error: 'idempotencyKey é obrigatória para consultas oraculares pagas no chat.',
        code: 'MISSING_IDEMPOTENCY_KEY',
      });
    }

    // Atomic Operation Lock acquired BEFORE debit, draw, or Gemini
    const opCheck = await acquireOperation(user.uid, idempotencyKey, 'chat');

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
  }

  // Pre-check balance before any operations
  if (requiredCredits > 0 && user.credits < requiredCredits) {
    if (idempotencyKey) {
      await failOperation(user.uid, idempotencyKey, 'INSUFFICIENT_CREDITS');
    }
    return res.status(402).json({
      error: INSUFFICIENT_CREDITS_MESSAGE,
      code: 'INSUFFICIENT_CREDITS',
    });
  }

  // 2. Prepare Context (Temporal, Intent, Natal, Repetition)
  const userTimezone = user.timezone || 'America/Sao_Paulo';
  const temporal = getTemporalContext(userTimezone);
  const intent = classifyIntent(message, userTimezone);
  const repetition = analyzeQuestionRepetition(message, history || []);

  const natalData: NatalData = {
    fullName: user.fullName,
    birthDate: user.birthDate,
    birthTime: user.birthTime || null,
    timezone: userTimezone,
  };

  // 3. For Support or Conversation, handle directly or with low token AI without debiting credits
  if (requiredCredits === 0) {
    let supportText = '';
    if (messageType === 'SUPPORT') {
      supportText = `🌹 Olá, ${user.fullName || 'Consulente'}. O Reino de Maria Padilha oferece planos acessíveis de créditos para suas consultas aos oráculos sagrados (Tarot de 78 cartas, Jogo de Búzios, Odù Ifá, Numerologia, Cabala e Astrologia). Cada consulta aos oráculos custa exatamente 5 créditos. Você pode adquirir créditos na aba "Comprar Créditos" a partir de R$ 50 (30 créditos). Suas consultas e histórico ficam salvos em segurança em sua conta.`;
    } else {
      supportText = `🌹 Laroyé, ${user.fullName || 'irmão(ã) de caminhada'}. ${temporal.greeting}! ${activeName} saúda teus passos com respeito e firmeza. Quando desejar abrir teus caminhos ou consultar os oráculos, faça tua pergunta com clareza no coração (cada consulta oracular utiliza 5 créditos).`;
    }

    return res.status(200).json({
      reply: supportText,
      creditsCost: 0,
      newCreditsBalance: user.credits,
      messageType,
      intentCategory: intent.primaryCategory,
      isFallback: false,
    });
  }

  // 4. Debit credits for Oracle consultation (Authoritative 5 Credits)
  let debitResult: { success: boolean; newBalance: number; ledgerId: string };
  try {
    debitResult = await debitCredits({
      uid: user.uid,
      amount: requiredCredits,
      type: 'chat',
      description: `Consulta oracular com ${activeName} (${messageType})`,
      idempotencyKey: idempotencyKey || `chat_${user.uid}_${crypto.randomUUID()}`,
    });
  } catch (err: any) {
    if (idempotencyKey) {
      await failOperation(user.uid, idempotencyKey, err.message || 'DEBIT_FAILED');
    }
    if (err.message === 'INSUFFICIENT_CREDITS') {
      return res.status(402).json({
        error: INSUFFICIENT_CREDITS_MESSAGE,
        code: 'INSUFFICIENT_CREDITS',
      });
    }
    logger.error('Error debiting credits for chat', err, correlationId);
    return res.status(500).json({ error: 'Falha ao debitar créditos da consulta.' });
  }

  // 5. Oracle Execution: REAL DRAW BEFORE GEMINI (GEMINI NEVER INVENTS CARDS)
  let rawOracleResult: any = undefined;
  if (messageType === 'ORACLE_QUESTION') {
    const cardDraw = drawTarotCards(1);
    rawOracleResult = {
      tarotSpread: cardDraw,
      method: 'tarot_one_card',
    };
  }

try {
  // 6. Assemble deep permanent spiritual profile & AI context
  const spiritualContext = await assembleSpiritualAIContext({
    user,
    question: message,
    rawOracleResult,
  });

  const systemInstruction = `
Você é ${activeName} falando como presença espiritual guardiã no Reino de Maria Padilha.
Você conversa com o consulente trazendo leitura e orientação espiritual sobre a vida, sem prometer milagres instantâneos, sem prever fatalidades de saúde ou morte, e respeitando rigorosamente o livre-arbítrio.
${rawOracleResult ? 'O sistema sorteou uma carta sagrada REAL para esta pergunta. Interprete EXATAMENTE a carta sorteada. Não invente cartas diferentes.' : 'Este é um aprofundamento da consulta anterior. Forneça clareza e sabedoria.'}
Fale com sabedoria, acolhimento, elegância, firmeza e verdade. Desenvolva a resposta com profundidade, detalhes e orientação prática. A resposta deve ter entre 700 e 3.000 caracteres em português claro e inspirador, evitando respostas excessivamente curtas ou interrompidas.
Saudação apropriada ao horário: "${temporal.greeting}".
${repetition.isRepeatedQuestion ? `Nota: ${repetition.adviceGuidance}` : ''}

${spiritualContext.systemContext}
`;

  
    const geminiResult = await executeGeminiWithFallback({
      systemInstruction,
      userPrompt: message,
      natalData,
      temporal,
      intent,
      rawOracleResult,
      temperature: 0.8,
      maxTokens: 1800,
      correlationId,
    });

    // Check if AI actually generated a response
    if (!geminiResult.text || geminiResult.modelUsed === 'all_models_failed' || geminiResult.modelUsed === 'offline-local-simulator') {
      throw new Error('AI_GENERATION_FAILED');
    }

    // Persist reading record for both initial oracle question AND paid follow-up
    const chatReadingId = `read_chat_${crypto.randomUUID()}`;
    const readingRecord: OracleReadingRecord = {
      id: chatReadingId,
      readingId: chatReadingId,
      uid: user.uid,
      oracleType: 'tarot',
      spreadType: messageType === 'ORACLE_FOLLOWUP' ? 'chat_followup' : 'uma_carta',
      question: message,
      intent,
      natalSnapshot: natalData,
      rawResult: rawOracleResult || { followup: true, prompt: message },
      interpretationHtml: geminiResult.text,
      practicalAdvice: 'Siga com firmeza e mantenha seu coração sereno.',
      modelUsed: geminiResult.modelUsed,
      fallbackLevel: geminiResult.fallbackLevel,
      creditCost: requiredCredits,
      createdAt: new Date().toISOString(),
      timezone: userTimezone,
    };
    await saveOracleReading(readingRecord, idempotencyKey);

    recordSpiritualEvent({
      uid: user.uid,
      category: intent.primaryCategory,
      summary: message.slice(0, 150),
    }).catch(() => {});

    const responsePayload = {
      reply: geminiResult.text,
      creditsCost: requiredCredits,
      newCreditsBalance: debitResult.newBalance,
      modelUsed: geminiResult.modelUsed,
      intentCategory: intent.primaryCategory,
      messageType,
      isFallback: geminiResult.isFallback,
      cardRevealed: rawOracleResult?.tarotSpread?.[0]?.card?.name,
      readingId: chatReadingId,
    };

    if (idempotencyKey) {
      await completeOperation(user.uid, idempotencyKey, {
        readingId: chatReadingId,
        ledgerId: debitResult.ledgerId,
        rawOracleResult,
        resultPayload: responsePayload,
      });
    }

    return res.status(200).json(responsePayload);
  } catch (err: any) {
    logger.error('Gemini failed for chat message, executing automatic credit refund', err, correlationId);

    if (idempotencyKey) {
      await failOperation(user.uid, idempotencyKey, err.message || 'AI_FAILED', debitResult.ledgerId);
    }

    // Automatic credit refund on failure — NO FAKE LOCAL CHAT RESPONSE
    await refundCredits({
      uid: user.uid,
      amount: requiredCredits,
      referenceId: debitResult.ledgerId,
      reason: 'Falha técnica na geração da resposta da entidade.',
    });

    return res.status(503).json({
      error: 'Houve uma oscilação na conexão com a inteligência oracular. Seus créditos foram estornados integralmente para que você possa tentar novamente.',
      code: 'AI_TEMPORARILY_UNAVAILABLE',
      refunded: true,
      newCreditsBalance: debitResult.newBalance + requiredCredits,
    });
  }
}
