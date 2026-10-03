import { firestore } from '../_firebaseAdmin.js';
import { logger } from './logger.js';

export interface OracleOperationRecord {
  opId: string;
  uid: string;
  idempotencyKey: string;
  type: 'reading' | 'chat' | 'love_compatibility';
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  readingId?: string;
  ledgerId?: string;
  rawOracleResult?: any;
  resultPayload?: any;
  error?: string;
}

// In-memory operation store for automated test suites
const testOperationsStore = new Map<string, OracleOperationRecord>();

export type AcquireResult =
  | { status: 'acquired' }
  | { status: 'completed'; operation: OracleOperationRecord }
  | { status: 'processing'; operation: OracleOperationRecord }
  | { status: 'failed'; operation: OracleOperationRecord };

/**
 * Acquire operation lock atomically BEFORE debiting, drawing oracle cards, or calling Gemini.
 * Strictly FAIL CLOSED if database query fails.
 */
export async function acquireOperation(
  uid: string,
  idempotencyKey: string,
  type: 'reading' | 'chat' | 'love_compatibility'
): Promise<AcquireResult> {
  if (!idempotencyKey || typeof idempotencyKey !== 'string' || idempotencyKey.trim().length === 0) {
    throw new Error('idempotencyKey é obrigatória para operações oraculares pagas.');
  }

  const opId = `${uid}_${idempotencyKey}`;
  const isTestEnv = process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);

  // In test environment, prioritize synchronous fast in-memory deterministic lock
if (isTestEnv && testOperationsStore.has(opId)) {
  const existing = testOperationsStore.get(opId)!;

  if (existing.status === 'completed') {
    return { status: 'completed', operation: existing };
  }

  if (existing.status === 'failed') {
    return { status: 'failed', operation: existing };
  }

  if (existing.status === 'processing') {
    return { status: 'processing', operation: existing };
  }
}

  if (!firestore) {
    if (isTestEnv) {
      const newOp: OracleOperationRecord = {
        opId,
        uid,
        idempotencyKey,
        type,
        status: 'processing',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      testOperationsStore.set(opId, newOp);
      return { status: 'acquired' };
    }
    const err = new Error('SERVICE_UNAVAILABLE: Banco de dados indisponível para controle de operações.');
    (err as any).statusCode = 503;
    throw err;
  }

  const opRef = firestore.collection('oracle_operations').doc(opId);

  try {
    return await firestore.runTransaction(async (transaction: any) => {
      const snap = await transaction.get(opRef);

     

if (snap.exists) {
  const data = snap.data() as OracleOperationRecord;

  if (data.status === 'completed') {
    return { status: 'completed', operation: data };
  }

  if (data.status === 'failed') {
    return { status: 'failed', operation: data };
  }

 if (data.status === 'processing') {
  return { status: 'processing', operation: data };
}
}




      const now = new Date().toISOString();
      const opRecord: OracleOperationRecord = {
        opId,
        uid,
        idempotencyKey,
        type,
        status: 'processing',
        createdAt: snap.exists && snap.data()?.createdAt ? snap.data().createdAt : now,
        updatedAt: now,
      };

      transaction.set(opRef, opRecord);

      if (isTestEnv) {
        testOperationsStore.set(opId, opRecord);
      }

      return { status: 'acquired' };
    });
  } catch (err: any) {
    logger.error('FAIL CLOSED: Error checking atomic operation idempotency', err);
    throw new Error('Falha de verificação transacional da operação oracular.');
  }
}

/**
 * Persist final completed state with the exact same drawing, reading and returned payload.
 */
export async function completeOperation(
  uid: string,
  idempotencyKey: string,
  data: {
    readingId?: string;
    ledgerId?: string;
    rawOracleResult?: any;
    resultPayload?: any;
  }
): Promise<void> {
  const opId = `${uid}_${idempotencyKey}`;
  const now = new Date().toISOString();
  const isTestEnv = process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);

  if (isTestEnv && testOperationsStore.has(opId)) {
    const existing = testOperationsStore.get(opId)!;
    existing.status = 'completed';
    existing.updatedAt = now;
    if (data.readingId) existing.readingId = data.readingId;
    if (data.ledgerId) existing.ledgerId = data.ledgerId;
    if (data.rawOracleResult) existing.rawOracleResult = data.rawOracleResult;
    if (data.resultPayload) existing.resultPayload = data.resultPayload;
  }

  if (!firestore) return;

  try {
    const opRef = firestore.collection('oracle_operations').doc(opId);
    await opRef.set(
      {
        status: 'completed',
        updatedAt: now,
        ...data,
      },
      { merge: true }
    );
  } catch (err) {
    logger.error('Failed to complete oracle operation document', err);
  }
}

/**
 * Mark operation as failed so retries or subsequent requests can proceed cleanly.
 */
export async function failOperation(
  uid: string,
  idempotencyKey: string,
  errorMsg: string,
  ledgerId?: string
): Promise<void> {
  const opId = `${uid}_${idempotencyKey}`;
  const now = new Date().toISOString();
  const isTestEnv = process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);

  if (isTestEnv && testOperationsStore.has(opId)) {
    const existing = testOperationsStore.get(opId)!;
    existing.status = 'failed';
    existing.error = errorMsg;
    if (ledgerId) existing.ledgerId = ledgerId;
    existing.updatedAt = now;
  }

  if (!firestore) return;

  try {
    const opRef = firestore.collection('oracle_operations').doc(opId);
    await opRef.set(
      {
        status: 'failed',
        error: errorMsg,
        ledgerId: ledgerId || null,
        updatedAt: now,
      },
      { merge: true }
    );
  } catch (err) {
    logger.error('Failed to update failed operation status', err);
  }
}
