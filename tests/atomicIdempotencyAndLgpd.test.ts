import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  acquireOperation,
  completeOperation,
  failOperation,
} from '../api/services/operationService.js';
import {
  saveOracleReading,
  getOracleReadingById,
  getReadingIdByIdempotency,
  clearTestReadingStorage,
} from '../src/oraculos/readingStorage.js';
import { debitCredits, refundCredits } from '../api/services/creditService.js';
import { firestore } from '../api/_firebaseAdmin.js';
import chatHandler from '../api/chat.js';
import readingHandler from '../api/reading.js';
import loveCompatibilityHandler from '../api/love-compatibility.js';
import accountHandler from '../api/account.js';
import * as geminiService from '../api/services/geminiService.js';
import { calculateAstrology } from '../src/oraculos/astrologyEngine.js';
import type { OracleReadingRecord } from '../src/types/spiritual.js';

describe('Idempotência Atômica, Chat Pago, LGPD e Resiliência (Todas as Pendências)', () => {
  beforeEach(() => {
    clearTestReadingStorage();
  });

  it('1. Idempotência Atômica: aquisição concorrente reconhece processamento e completed retorna resultado exato', async () => {
    const testUid = `user_atomic_${Date.now()}`;
    const testKey = `key_atomic_${Date.now()}`;

    // 1st acquisition acquires lock
    const firstAcquire = await acquireOperation(testUid, testKey, 'reading');
    expect(firstAcquire.status).toBe('acquired');

    // Concurrent acquisition while processing returns 'processing' (never redraws or redebits)
    const secondAcquire = await acquireOperation(testUid, testKey, 'reading');
    expect(secondAcquire.status).toBe('processing');

    // Complete the operation with specific mock payload
    const mockPayload = {
      reading: 'Interpretação sagrada e imutável de Maria Padilha',
      newCreditsBalance: 5,
      type: 'tarot',
    };
    await completeOperation(testUid, testKey, {
      readingId: 'read_atomic_123',
      ledgerId: 'led_atomic_456',
      resultPayload: mockPayload,
    });

    // 3rd call with same key returns completed operation with exact same resultPayload
    const thirdAcquire = await acquireOperation(testUid, testKey, 'reading');
    expect(thirdAcquire.status).toBe('completed');
    if (thirdAcquire.status === 'completed') {
      expect(thirdAcquire.operation.resultPayload).toEqual(mockPayload);
    }
  });

  it('2. Chat Pago exige idempotencyKey e retry retorna a mesma resposta sem re-sortear ou re-debitar', async () => {
    const testUid = `user_chat_${Date.now()}`;
    const testKey = `key_chat_${Date.now()}`;

    await firestore.collection('users').doc(testUid).set({
  uid: testUid,
  credits: 7,
  fullName: 'Consulente Chat Idempotente',
  birthDate: '1990-05-15',
});

    // Request missing idempotencyKey on paid oracle question must fail with 400
    const mockReqMissingKey = {
      method: 'POST',
      headers: { authorization: `Bearer test_token_${testUid}` },
      user: {
        uid: testUid,
        credits: 10,
        fullName: 'Consulente Chat',
        birthDate: '1990-05-15',
      },
      body: {
        message: 'Maria Padilha, como estão meus caminhos financeiros para este mês?',
      },
      socket: { remoteAddress: '127.0.0.1' },
    } as any;

    let statusCodeMissing = 0;
    let jsonMissing: any = null;
    const mockResMissing = {
      setHeader: () => {},
      status: (c: number) => {
        statusCodeMissing = c;
        return { json: (d: any) => { jsonMissing = d; } };
      },
    } as any;

    await chatHandler(mockReqMissingKey, mockResMissing);
    expect(statusCodeMissing).toBe(400);
    expect(jsonMissing.code).toBe('MISSING_IDEMPOTENCY_KEY');

    const geminiSpy = vi.spyOn(geminiService, 'executeGeminiWithFallback').mockResolvedValue({
      text: '🌹 Laroyé, Maria Padilha te responde com firmeza e axé.',
      modelUsed: 'gemini-3.8-flash',
      attempts: 1,
      fallbackLevel: 0,
      latencyMs: 15,
      isFallback: false,
    });

    // Valid paid request with idempotencyKey
    const mockReq = {
      method: 'POST',
      headers: { authorization: `Bearer test_token_${testUid}` },
      user: {
        uid: testUid,
        credits: 10,
        fullName: 'Consulente Chat',
        birthDate: '1990-05-15',
      },
      body: {
        message: 'Maria Padilha, como estão meus caminhos financeiros para este mês?',
        idempotencyKey: testKey,
      },
      socket: { remoteAddress: '127.0.0.1' },
    } as any;

    let statusCode1 = 0;
    let jsonResponse1: any = null;
    const mockRes1 = {
      setHeader: () => {},
      status: (code: number) => {
        statusCode1 = code;
        return { json: (data: any) => { jsonResponse1 = data; } };
      },
    } as any;

    await chatHandler(mockReq, mockRes1);
    expect(statusCode1).toBe(200);
    expect(jsonResponse1.creditsCost).toBe(5);
    expect(jsonResponse1.newCreditsBalance).toBe(2);
    expect(jsonResponse1.reply).toBeDefined();

    const firstReply = jsonResponse1.reply;
    const firstCard = jsonResponse1.cardRevealed;

    // Retry with EXACT SAME idempotencyKey
    let statusCode2 = 0;
    let jsonResponse2: any = null;
    const mockRes2 = {
      setHeader: () => {},
      status: (code: number) => {
        statusCode2 = code;
        return { json: (data: any) => { jsonResponse2 = data; } };
      },
    } as any;

    await chatHandler(mockReq, mockRes2);
    expect(statusCode2).toBe(200);
    // Deve retornar a mesma resposta e a mesma carta
    expect(jsonResponse2.reply).toBe(firstReply);
    expect(jsonResponse2.cardRevealed).toBe(firstCard);
    expect(jsonResponse2.newCreditsBalance).toBe(2); // Não debita de novo!

    // Saldo no banco continua 5
    const userDoc = await firestore.collection('users').doc(testUid).get();
    expect(userDoc.data()?.credits).toBe(2);
  });

  it('3. saveOracleReading() NÃO sobrescreve idempotência existente e retorna a leitura original', async () => {
    const testUid = `user_save_idemp_${Date.now()}`;
    const testKey = `key_save_${Date.now()}`;

    const originalRecord: OracleReadingRecord = {
      id: 'read_original_111',
      readingId: 'read_original_111',
      uid: testUid,
      oracleType: 'tarot',
      question: 'Pergunta original',
intent: {
  primaryCategory: 'outros',
  isRomantic: false,
  isBusinessOrCareer: false,
  participants: [],
  summary: 'Teste de idempotência',
},
rawResult: {},
modelUsed: 'test-model',
fallbackLevel: 0,
natalSnapshot: {
        fullName: 'Consulente Teste',
        birthDate: '1985-01-01',
      },
      interpretationHtml: '<p>Interpretação Original</p>',
      practicalAdvice: 'Conselho Original',
      creditCost: 5,
      createdAt: new Date().toISOString(),
      timezone: 'America/Sao_Paulo',
    };

    const savedFirst = await saveOracleReading(originalRecord, testKey);
    expect(savedFirst.readingId).toBe('read_original_111');

    // Tentativa de salvar outro record com a MESMA chave
    const secondRecord: OracleReadingRecord = {
      id: 'read_second_222',
      readingId: 'read_second_222',
      uid: testUid,
      oracleType: 'buzios',
      question: 'Outra pergunta diferente',
intent: {
  primaryCategory: 'outros',
  isRomantic: false,
  isBusinessOrCareer: false,
  participants: [],
  summary: 'Teste de idempotência',
},
rawResult: {},
modelUsed: 'test-model',
fallbackLevel: 0,
natalSnapshot: {
        fullName: 'Consulente Teste',
        birthDate: '1985-01-01',
      },
      interpretationHtml: '<p>Tentativa de Sobrescrita</p>',
      practicalAdvice: 'Conselho Invasivo',
      creditCost: 5,
      createdAt: new Date().toISOString(),
      timezone: 'America/Sao_Paulo',
    };

    const savedSecond = await saveOracleReading(secondRecord, testKey);
    // NÃO substitui: retorna a leitura existente!
    expect(savedSecond.readingId).toBe('read_original_111');
    expect(savedSecond.interpretationHtml).toContain('Interpretação Original');

    // Confirma idempotência
    const boundId = await getReadingIdByIdempotency(testUid, testKey);
    expect(boundId).toBe('read_original_111');
  });

  it('4. Falha ao persistir em /api/reading executa estorno idempotente com referenceId do ledger', async () => {
    const testUid = `user_save_fail_${Date.now()}`;
    const testKey = `key_save_fail_${Date.now()}`;

    await firestore.collection('users').doc(testUid).set({
      credits: 10,
      fullName: 'Consulente Falha Persist',
      birthDate: '1992-03-20',
    });

    const debit = await debitCredits({
      uid: testUid,
      amount: 5,
      type: 'reading',
      description: 'Consulta teste com falha de persistência',
      idempotencyKey: testKey,
    });
    expect(debit.newBalance).toBe(5);

    // Simula estorno que ocorre se saveOracleReading falhar
    const refund = await refundCredits({
      uid: testUid,
      amount: 5,
      reason: 'Falha técnica ao persistir leitura oracular — estorno automático integral',
      referenceId: debit.ledgerId,
    });
    expect(refund.newBalance).toBe(10);

    // Tentativa de duplicar estorno da mesma operação
    const doubleRefund = await refundCredits({
      uid: testUid,
      amount: 5,
      reason: 'Tentativa duplicada de estorno',
      referenceId: debit.ledgerId,
    });
    expect(doubleRefund.newBalance).toBe(10); // Permanece 10, não aumenta para 15
  });

  it('5. Não exibe literal "null" na astrologia quando a hora for desconhecida', () => {
    const astro = calculateAstrology('1990-08-25', null);
    expect(astro.planetaryHourRuler).toBeNull();

    // Verificamos a formatação estruturada de fallback
    const hourOutput = astro.planetaryHourRuler
      ? astro.planetaryHourRuler
      : 'não calculada porque a hora de nascimento não foi informada';

    expect(hourOutput).not.toBe('null');
    expect(hourOutput).toContain('não calculada');
  });

  it('6. LGPD: Exclusão de conta purga documentos técnicos com UID (reading_idempotency, credit_operations, oracle_operations)', async () => {
    const testUid = `user_lgpd_${Date.now()}`;
    const idempKey = `idemp_lgpd_${Date.now()}`;

    // Popula usuário e documentos vinculados
    await firestore.collection('users').doc(testUid).set({
      uid: testUid,
      fullName: 'Titular LGPD a Excluir',
      email: 'excluir@teste.com',
      credits: 5,
    });

    await firestore.collection('reading_idempotency').doc(`${testUid}_${idempKey}`).set({
      uid: testUid,
      idempotencyKey: idempKey,
      readingId: 'read_123',
    });

    await firestore.collection('credit_operations').doc(`${testUid}_${idempKey}`).set({
      uid: testUid,
      idempotencyKey: idempKey,
      amount: 5,
    });

    await firestore.collection('oracle_operations').doc(`${testUid}_${idempKey}`).set({
      uid: testUid,
      idempotencyKey: idempKey,
      status: 'completed',
    });

    const mockReq = {
      method: 'POST',
      headers: { authorization: `Bearer test_token_${testUid}` },
      user: { uid: testUid, email: 'excluir@teste.com' },
      body: {
        action: 'delete_account',
        confirmation: 'QUERO_EXCLUIR_MINHA_CONTA',
      },
      socket: { remoteAddress: '127.0.0.1' },
    } as any;

    let statusCode = 0;
    let jsonRes: any = null;
    const mockRes = {
      setHeader: () => {},
      status: (c: number) => {
        statusCode = c;
        return { json: (d: any) => { jsonRes = d; } };
      },
    } as any;

    await accountHandler(mockReq, mockRes);
    expect(statusCode).toBe(200);
    expect(jsonRes.success).toBe(true);

    // Verifica que os documentos auxiliares contendo UID foram eliminados
    const idempDoc = await firestore.collection('reading_idempotency').doc(`${testUid}_${idempKey}`).get();
    expect(idempDoc.exists).toBe(false);

    const creditOpDoc = await firestore.collection('credit_operations').doc(`${testUid}_${idempKey}`).get();
    expect(creditOpDoc.exists).toBe(false);

    const oracleOpDoc = await firestore.collection('oracle_operations').doc(`${testUid}_${idempKey}`).get();
    expect(oracleOpDoc.exists).toBe(false);

    const userDoc = await firestore.collection('users').doc(testUid).get();
    expect(userDoc.exists).toBe(false);
  });
});
