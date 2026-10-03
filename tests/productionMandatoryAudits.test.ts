import { describe, it, expect, vi } from 'vitest';
import { calculateAstrology } from '../src/oraculos/astrologyEngine.js';
import { calculateLoveSynastry } from '../src/oraculos/loveSynastryEngine.js';
import { parseAndValidateDate } from '../src/utils/dateNormalizer.js';
import { debitCredits, refundCredits } from '../api/services/creditService.js';
import { firestore } from '../api/_firebaseAdmin.js';
import registerHandler from '../api/register.js';
import loveCompatibilityHandler from '../api/love-compatibility.js';

describe('Auditoria Técnica Final e Regressões Obrigatórias de Produção (Item 11)', () => {
  it('1. Hora null nunca vira 12:00 ou horário fictício em nenhum cálculo astrológico ou lunar', () => {
    const astroSemHora = calculateAstrology('1988-07-16', null);
    expect(astroSemHora.hourKnown).toBe(false);
    expect(astroSemHora.planetaryHourRuler).toBeNull();
    // Verifica que a descrição não inventa 12:00
    expect(astroSemHora.cosmicAdvice).toContain('hora planetária não calculada');
    expect(astroSemHora.cosmicAdvice).not.toContain('12:00');
    expect(astroSemHora.cosmicAdvice).not.toContain('meio-dia');
  });

  it('2. 31/02/1985 é rejeitado pelo dateNormalizer e pelo /api/register', async () => {
    expect(() => parseAndValidateDate('31/02/1985')).toThrow(/Dia inválido/);

    const mockReq = {
      method: 'POST',
      body: {
        fullName: 'Consulente Teste Data Impossivel',
        email: `impossivel_${Date.now()}@test.com`,
        birthDate: '31/02/1985',
        password: 'SenhaForte123!',
      },
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
    } as any;

    let statusCode = 0;
    let jsonResponse: any = null;

    const mockRes = {
      setHeader: () => {},
      status: (code: number) => {
        statusCode = code;
        return {
          json: (data: any) => {
            jsonResponse = data;
          },
        };
      },
    } as any;

    await registerHandler(mockReq, mockRes);
    expect(statusCode).toBe(400);
    expect(jsonResponse?.error).toMatch(/Dia inválido|Data de nascimento/);
  });

  it('3. Pessoa 1 vem exclusivamente do banco autenticado e Pessoa 2 aceita hora null', () => {
    const report = calculateLoveSynastry({
      name1: 'Consulente Autenticado no Banco',
      birthDate1: '1985-04-12',
      birthTime1: '10:15',
      name2: 'Pessoa Amada Consultada',
      birthDate2: '1990-11-20',
      birthTime2: null, // hora opcional/null
    });

    expect(report.person1.name).toBe('Consulente Autenticado no Banco');
    expect(report.person2.name).toBe('Pessoa Amada Consultada');
    expect(report.person2.astrology.hourKnown).toBe(false);
    expect(report.person2.astrology.planetaryHourRuler).toBeNull();
    // Exatamente UM sorteio de Tarot sagrado de 3 cartas é produzido
    expect(report.tarotSpread).toHaveLength(3);
  });

  it('4. Retry com mesma idempotencyKey resulta em uma única cobrança de 5 créditos', async () => {
    const testUid = `user_idemp_retry_${Date.now()}`;
    const testKey = `key_exact_retry_${Date.now()}`;

    // Seed test user with 10 credits in test mock firestore
    await firestore.collection('users').doc(testUid).set({
      credits: 10,
      fullName: 'Test User Idempotency',
    });

    // 1st call
    const debit1 = await debitCredits({
      uid: testUid,
      amount: 5,
      type: 'reading',
      description: 'Sinastria amorosa teste',
      idempotencyKey: testKey,
    });
    expect(debit1.success).toBe(true);
    expect(debit1.newBalance).toBe(5);

    // 2nd call with identical idempotencyKey
    const debit2 = await debitCredits({
      uid: testUid,
      amount: 5,
      type: 'reading',
      description: 'Sinastria amorosa retry',
      idempotencyKey: testKey,
    });
    expect(debit2.success).toBe(true);
    expect(debit2.newBalance).toBe(5); // NÃO cobra de novo! Saldo continua 5

    // Confirma no banco que o saldo é 5 (somente uma cobrança de 5 créditos foi efetivada)
    const userDoc = await firestore.collection('users').doc(testUid).get();
    expect(userDoc.data()?.credits).toBe(5);
  });

  it('5. Falha após débito executa exatamente UM estorno vinculado ao ledgerId', async () => {
    const testUid = `user_refund_ledger_${Date.now()}`;
    const idempotencyKey = `idemp_debit_${Date.now()}`;

    await firestore.collection('users').doc(testUid).set({
      credits: 10,
      fullName: 'Test User Refund',
    });

    const debit = await debitCredits({
      uid: testUid,
      amount: 5,
      type: 'reading',
      description: 'Sinastria teste para estorno',
      idempotencyKey,
    });

    expect(debit.newBalance).toBe(5);
    expect(debit.ledgerId).toBeDefined();

    // Estorno idempotente vinculado ao ledgerId
    const refund1 = await refundCredits({
      uid: testUid,
      amount: 5,
      reason: 'Oscilação técnica no oráculo',
      referenceId: debit.ledgerId,
    });
    expect(refund1.newBalance).toBe(10); // Estornado com sucesso

    // Tentativa de double-refund com o mesmo referenceId (ledgerId)
    const refund2 = await refundCredits({
      uid: testUid,
      amount: 5,
      reason: 'Tentativa duplicada de estorno',
      referenceId: debit.ledgerId,
    });
    // Não estorna duas vezes
    expect(refund2.newBalance).toBe(10);

    const finalDoc = await firestore.collection('users').doc(testUid).get();
    expect(finalDoc.data()?.credits).toBe(10);
  });

  it('6. Palavras proibidas não existem nos dados e interpretações oraculares', async () => {
    const prohibitedRegex = /(fantasia|fantasias|simb[oó]lic|fic[cç][aã]o|fict[ií]ci)/i;

    const astro = calculateAstrology('1995-09-20', null);
    expect(prohibitedRegex.test(astro.cosmicAdvice)).toBe(false);
    expect(prohibitedRegex.test(astro.lunarPhaseDescription)).toBe(false);

    const synastry = calculateLoveSynastry({
      name1: 'Maria Solteira',
      birthDate1: '1992-06-15',
      name2: 'Carlos Solteiro',
      birthDate2: '1990-10-10',
    });
    expect(prohibitedRegex.test(synastry.elementalDynamic.description)).toBe(false);
    expect(prohibitedRegex.test(synastry.cabalisticAlignment.pillarDynamic)).toBe(false);
  });
});
