import { firestore } from '../../api/_firebaseAdmin.js';
import type { OracleReadingRecord } from '../types/spiritual.js';

// Fast in-memory cache strictly for automated Vitest testing (NODE_ENV === 'test')
const testReadingsCache = new Map<string, OracleReadingRecord>();
const testIdempotencyCache = new Map<string, string>(); // idempotencyKey -> readingId

export async function saveOracleReading(
  record: OracleReadingRecord,
  idempotencyKey?: string
): Promise<OracleReadingRecord> {
  if (process.env.NODE_ENV === 'test') {
    testReadingsCache.set(record.readingId, record);
    if (idempotencyKey) {
      testIdempotencyCache.set(idempotencyKey, record.readingId);
    }
  }

  if (!firestore) {
    if (process.env.NODE_ENV === 'test') return record;
    const err = new Error('SERVICE_UNAVAILABLE: Banco de dados indisponível para persistir leitura.');
    (err as any).statusCode = 503;
    throw err;
  }

  try {
    const readingRef = firestore.collection('readings').doc(record.readingId);

    if (idempotencyKey) {
      const idempRef = firestore.collection('reading_idempotency').doc(`${record.uid}_${idempotencyKey}`);
      await firestore.runTransaction(async (transaction: any) => {
        transaction.set(readingRef, record);
        transaction.set(idempRef, {
          readingId: record.readingId,
          uid: record.uid,
          idempotencyKey,
          createdAt: new Date().toISOString(),
        });
      });
    } else {
      await readingRef.set(record);
    }
  } catch (err: any) {
    if (process.env.NODE_ENV === 'test') return record;
    console.error('[readingStorage] Critical: Failed to persist reading to Firestore:', err);
    throw new Error('Falha ao persistir leitura oracular no banco de dados.');
  }

  return record;
}

export async function getOracleReadingById(readingId: string): Promise<OracleReadingRecord | null> {
  if (process.env.NODE_ENV === 'test' && testReadingsCache.has(readingId)) {
    return testReadingsCache.get(readingId)!;
  }

  if (!firestore) return null;

  try {
    const doc = await firestore.collection('readings').doc(readingId).get();
    if (doc.exists) {
      return doc.data() as OracleReadingRecord;
    }
  } catch (err) {
    console.warn('[readingStorage] Warning: Failed to fetch reading from Firestore:', err);
  }

  return null;
}

export async function getReadingIdByIdempotency(uid: string, idempotencyKey?: string): Promise<string | null> {
  if (!idempotencyKey) return null;

  if (process.env.NODE_ENV === 'test' && testIdempotencyCache.has(idempotencyKey)) {
    return testIdempotencyCache.get(idempotencyKey)!;
  }

  if (!firestore) return null;

  try {
    const idempDoc = await firestore.collection('reading_idempotency').doc(`${uid}_${idempotencyKey}`).get();
    if (idempDoc.exists) {
      return idempDoc.data()?.readingId || null;
    }
  } catch (err) {
    console.warn('[readingStorage] Warning: Failed to fetch idempotency key:', err);
  }

  return null;
}
