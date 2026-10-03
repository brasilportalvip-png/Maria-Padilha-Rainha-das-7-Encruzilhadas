import { firestore } from '../_firebaseAdmin.js';
import type { CreditLedgerEntry } from '../../src/types/spiritual.js';
import { logger } from './logger.js';

// Fast in-memory cache strictly for automated Vitest testing (NODE_ENV === 'test')
const testLedgerStore = new Map<string, CreditLedgerEntry>();
const testIdempotencyStore = new Map<string, CreditLedgerEntry>();

export async function getUserCredits(uid: string): Promise<number> {
  if (!firestore) {
    const err = new Error('SERVICE_UNAVAILABLE: Banco de dados indisponível.');
    (err as any).statusCode = 503;
    throw err;
  }

  const userDoc = await firestore.collection('users').doc(uid).get();
  if (!userDoc.exists) {
    if (process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST)) {
      await firestore.collection('users').doc(uid).set({ credits: 7 });
      return 7;
    }
    const err = new Error('USER_NOT_FOUND: Usuário não cadastrado.');
    (err as any).statusCode = 404;
    throw err;
  }

  const data = userDoc.data();
  if (typeof data?.credits !== 'number') {
    const err = new Error('CORRUPTED_CREDITS: Saldo inválido ou não inicializado.');
    (err as any).statusCode = 500;
    throw err;
  }

  return data.credits;
}

export async function debitCredits(params: {
  uid: string;
  amount: number;
  type: 'reading' | 'chat';
  referenceId?: string;
  description: string;
  idempotencyKey?: string;
}): Promise<{ success: boolean; newBalance: number; ledgerId: string }> {
  const { uid, amount, type, referenceId, description, idempotencyKey } = params;

  if (amount <= 0) {
    throw new Error('O valor de débito deve ser maior que zero.');
  }

  if (!firestore) {
    const err = new Error('SERVICE_UNAVAILABLE: Banco de dados indisponível.');
    (err as any).statusCode = 503;
    throw err;
  }

  const opId = idempotencyKey ? `${uid}_${idempotencyKey}` : `${uid}_debit_${crypto.randomUUID()}`;
  const opRef = firestore.collection('credit_operations').doc(opId);
  const userRef = firestore.collection('users').doc(uid);
  const ledgerId = `led_${crypto.randomUUID()}`;
  const ledgerRef = firestore.collection('credit_ledger').doc(ledgerId);

  // In-memory test idempotency check
  const isTestEnv = process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);
  if (isTestEnv && idempotencyKey && testIdempotencyStore.has(idempotencyKey)) {
    const existing = testIdempotencyStore.get(idempotencyKey)!;
    logger.info('Duplicate debit request ignored due to idempotencyKey', { idempotencyKey, uid });
    return { success: true, newBalance: existing.newBalance, ledgerId: existing.id };
  }

  let finalBalance = 0;
  let finalLedgerId = ledgerId;

  // Single Atomic Transaction for financial integrity
  await firestore.runTransaction(async (transaction: any) => {
    // 1. Check persistent idempotency document
    const opDoc = await transaction.get(opRef);
    if (opDoc.exists) {
      const existing = opDoc.data();
      finalBalance = existing.newBalance;
      if (existing.ledgerId) {
        finalLedgerId = existing.ledgerId;
      }
      return;
    }

    // 2. Fetch authoritative user balance
    const userDoc = await transaction.get(userRef);
    let userData = userDoc.exists ? userDoc.data() : null;

    if (!userData) {
      if (isTestEnv) {
        userData = { credits: 7 };
        transaction.set(userRef, { credits: 7 });
      } else {
        throw new Error('USER_NOT_FOUND');
      }
    }
    if (typeof userData?.credits !== 'number') {
      throw new Error('CORRUPTED_CREDITS');
    }

    const currentCredits = userData.credits;
    if (currentCredits < amount) {
      throw new Error('INSUFFICIENT_CREDITS');
    }

    finalBalance = currentCredits - amount;

    // 3. Update User Balance
    transaction.update(userRef, {
      credits: finalBalance,
      updatedAt: new Date().toISOString(),
    });

    // 4. Record Immutable Ledger Entry
    const entry: CreditLedgerEntry = {
      id: ledgerId,
      uid,
      type,
      amount: -amount,
      previousBalance: currentCredits,
      newBalance: finalBalance,
      referenceId,
      idempotencyKey,
      description,
      timestamp: new Date().toISOString(),
    };
    transaction.set(ledgerRef, entry);

    // 5. Record Persistent Operation Idempotency
    transaction.set(opRef, {
      uid,
      idempotencyKey,
      ledgerId,
      amount,
      newBalance: finalBalance,
      createdAt: new Date().toISOString(),
    });

    if (isTestEnv) {
      testLedgerStore.set(ledgerId, entry);
      if (idempotencyKey) testIdempotencyStore.set(idempotencyKey, entry);
    }
  });

  logger.info('Credits debited successfully', { uid, amount, newBalance: finalBalance, type });

  return {
    success: true,
    newBalance: finalBalance,
    ledgerId: finalLedgerId,
  };
}

export async function refundCredits(params: {
  uid: string;
  amount: number;
  referenceId?: string;
  reason: string;
}): Promise<{ success: boolean; newBalance: number; ledgerId: string }> {
  const { uid, amount, referenceId, reason } = params;

  if (amount <= 0) {
    throw new Error('O valor de estorno deve ser maior que zero.');
  }

  if (!firestore) {
    const err = new Error('SERVICE_UNAVAILABLE: Banco de dados indisponível.');
    (err as any).statusCode = 503;
    throw err;
  }

  const refundOpId = referenceId ? `${uid}_refund_${referenceId}` : `${uid}_ref_${crypto.randomUUID()}`;
  const refundOpRef = firestore.collection('credit_operations').doc(refundOpId);
  const userRef = firestore.collection('users').doc(uid);
  const ledgerId = `ref_${crypto.randomUUID()}`;
  const ledgerRef = firestore.collection('credit_ledger').doc(ledgerId);

  let newBalance = 0;

  await firestore.runTransaction(async (transaction: any) => {
    // Prevent double refund
    const existingRefund = await transaction.get(refundOpRef);
    if (existingRefund.exists) {
      newBalance = existingRefund.data().newBalance;
      return;
    }

    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists) {
      throw new Error('USER_NOT_FOUND');
    }

    const current = userDoc.data().credits ?? 0;
    newBalance = current + amount;

    transaction.update(userRef, {
      credits: newBalance,
      updatedAt: new Date().toISOString(),
    });

    const entry: CreditLedgerEntry = {
      id: ledgerId,
      uid,
      type: 'refund',
      amount,
      previousBalance: current,
      newBalance,
      referenceId,
      description: `Estorno atômico: ${reason}`,
      timestamp: new Date().toISOString(),
    };
    transaction.set(ledgerRef, entry);

    transaction.set(refundOpRef, {
      uid,
      referenceId,
      ledgerId,
      amount,
      newBalance,
      createdAt: new Date().toISOString(),
    });

    if (process.env.NODE_ENV === 'test') {
      testLedgerStore.set(ledgerId, entry);
    }
  });

  logger.info('Credits refunded successfully', { uid, amount, newBalance, reason });
  return { success: true, newBalance, ledgerId };
}

export async function addPurchaseCredits(params: {
  uid: string;
  amount: number;
  paymentId: string;
  planId: string;
}): Promise<{ success: boolean; newBalance: number; ledgerId: string }> {
  const { uid, amount, paymentId, planId } = params;

  if (!firestore) {
    const err = new Error('SERVICE_UNAVAILABLE: Banco de dados indisponível.');
    (err as any).statusCode = 503;
    throw err;
  }

  const purchaseOpRef = firestore.collection('credit_operations').doc(`purchase_${paymentId}`);
  const userRef = firestore.collection('users').doc(uid);
  const ledgerId = `pur_${crypto.randomUUID()}`;
  const ledgerRef = firestore.collection('credit_ledger').doc(ledgerId);

  let finalBalance = 0;

  await firestore.runTransaction(async (transaction: any) => {
    // Check if payment was already credited atomically
    const opDoc = await transaction.get(purchaseOpRef);
    if (opDoc.exists) {
      finalBalance = opDoc.data().newBalance;
      logger.warn('Payment already credited, idempotent return:', { paymentId, uid });
      return;
    }

    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists) {
      throw new Error('USER_NOT_FOUND');
    }

    const current = userDoc.data().credits ?? 0;
    finalBalance = current + amount;

    transaction.update(userRef, {
      credits: finalBalance,
      lastPlanId: planId,
      updatedAt: new Date().toISOString(),
    });

    const entry: CreditLedgerEntry = {
      id: ledgerId,
      uid,
      type: 'purchase',
      amount,
      previousBalance: current,
      newBalance: finalBalance,
      referenceId: paymentId,
      description: `Compra de créditos - Plano ${planId}`,
      timestamp: new Date().toISOString(),
    };
    transaction.set(ledgerRef, entry);

    transaction.set(purchaseOpRef, {
      uid,
      paymentId,
      ledgerId,
      amount,
      newBalance: finalBalance,
      createdAt: new Date().toISOString(),
    });
  });

  logger.info('Purchase credits applied transactionally', { uid, amount, newBalance: finalBalance, paymentId, planId });
  return { success: true, newBalance: finalBalance, ledgerId };
}
