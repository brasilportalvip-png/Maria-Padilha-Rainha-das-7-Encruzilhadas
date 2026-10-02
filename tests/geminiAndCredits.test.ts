import { describe, it, expect } from 'vitest';
import { debitCredits, refundCredits, getUserCredits } from '../api/services/creditService.js';
import { MODEL_CHAIN } from '../api/services/geminiService.js';
import { firestore } from '../api/_firebaseAdmin.js';
import {
  ORACLE_QUESTION_COST,
  POMBO_GIRA_ADVICE_COST,
  READING_CONSULTATION_COST,
} from '../src/config/pricing.js';

describe('Regra dos 5 Créditos e Resiliência Gemini (Decisão Definitiva do Proprietário)', () => {
  it('A constante oficial de consulta deve ser exatamente 5 créditos', () => {
    expect(ORACLE_QUESTION_COST).toBe(5);
    expect(POMBO_GIRA_ADVICE_COST).toBe(5);
    expect(READING_CONSULTATION_COST).toBe(5);
  });

  it('A cadeia de modelos Gemini deve priorizar gemini-3.8-flash conforme especificação oficial', () => {
    expect(MODEL_CHAIN[0]).toBe('gemini-3.8-flash');
    expect(MODEL_CHAIN[1]).toBe('gemini-3.7-flash');
    expect(MODEL_CHAIN[2]).toBe('gemini-3.6-flash');
    expect(MODEL_CHAIN.length).toBe(3);
  });

  it('saldo 10 -> pergunta (5 créditos) -> saldo 5', async () => {
    const testUid = `user_saldo10_${Date.now()}`;
    await firestore.collection('users').doc(testUid).set({ credits: 10 });

    const initial = await getUserCredits(testUid);
    expect(initial).toBe(10);

    const res = await debitCredits({
      uid: testUid,
      amount: ORACLE_QUESTION_COST, // 5
      type: 'chat',
      description: 'Consulta oracular paga com Maria Padilha',
    });

    expect(res.success).toBe(true);
    expect(res.newBalance).toBe(5);
    expect(await getUserCredits(testUid)).toBe(5);
  });

  it('saldo 5 -> pergunta (5 créditos) -> saldo 0', async () => {
    const testUid = `user_saldo5_${Date.now()}`;
    await firestore.collection('users').doc(testUid).set({ credits: 5 });

    const initial = await getUserCredits(testUid);
    expect(initial).toBe(5);

    const res = await debitCredits({
      uid: testUid,
      amount: ORACLE_QUESTION_COST, // 5
      type: 'chat',
      description: 'Consulta oracular com saldo exato',
    });

    expect(res.success).toBe(true);
    expect(res.newBalance).toBe(0);
    expect(await getUserCredits(testUid)).toBe(0);
  });

  it('saldo 4 -> pergunta bloqueada -> saldo continua 4', async () => {
    const testUid = `user_saldo4_${Date.now()}`;
    await firestore.collection('users').doc(testUid).set({ credits: 4 });

    const initial = await getUserCredits(testUid);
    expect(initial).toBe(4);

    await expect(
      debitCredits({
        uid: testUid,
        amount: ORACLE_QUESTION_COST, // 5
        type: 'chat',
        description: 'Tentativa de consulta com saldo insuficiente',
      })
    ).rejects.toThrow('INSUFFICIENT_CREDITS');

    // Balance remains intact at 4
    expect(await getUserCredits(testUid)).toBe(4);
  });

  it('mesma idempotencyKey chamada duas vezes -> somente 5 créditos debitados', async () => {
    const testUid = `idempotent_user_${Date.now()}`;
    await firestore.collection('users').doc(testUid).set({ credits: 10 });

    const idKey = `key_retry_${Date.now()}`;

    const first = await debitCredits({
      uid: testUid,
      amount: 5,
      type: 'chat',
      description: 'Consulta oracular idempotente',
      idempotencyKey: idKey,
    });

    expect(first.newBalance).toBe(5);

    const second = await debitCredits({
      uid: testUid,
      amount: 5,
      type: 'chat',
      description: 'Retry ou duplo clique da mesma consulta',
      idempotencyKey: idKey,
    });

    // Saldo continua 5 (não cobrou 10!)
    expect(second.newBalance).toBe(5);
    expect(first.ledgerId).toBe(second.ledgerId);
    expect(await getUserCredits(testUid)).toBe(5);
  });

  it('Gemini falha totalmente após débito -> 5 créditos estornados uma única vez', async () => {
    const testUid = `fail_refund_user_${Date.now()}`;
    await firestore.collection('users').doc(testUid).set({ credits: 10 });

    // 1. Debita 5 créditos
    const debitRes = await debitCredits({
      uid: testUid,
      amount: 5,
      type: 'chat',
      description: 'Consulta antes da falha simulada',
    });

    expect(debitRes.newBalance).toBe(5);

    // 2. Todos os modelos falharam -> Estorna exatamente 5 créditos
    const refundRes = await refundCredits({
      uid: testUid,
      amount: 5,
      referenceId: debitRes.ledgerId,
      reason: 'Oscilação técnica na IA - estorno automático integral',
    });

    expect(refundRes.success).toBe(true);
    expect(refundRes.newBalance).toBe(10);
    expect(await getUserCredits(testUid)).toBe(10);
  });

  it('Pombo Gira conselho pago -> debita exatamente 5 créditos', async () => {
    const testUid = `pg_user_${Date.now()}`;
    await firestore.collection('users').doc(testUid).set({ credits: 10 });

    const res = await debitCredits({
      uid: testUid,
      amount: POMBO_GIRA_ADVICE_COST, // 5 créditos
      type: 'chat',
      description: 'Conselho exclusivo canalizado de Maria Mulambo das 7 Encruzilhadas',
    });

    expect(res.success).toBe(true);
    expect(res.newBalance).toBe(5);
  });
});
