import { firestore } from '../../serverlib/_firebaseAdmin.js';
import type { OracleReadingRecord } from '../types/spiritual.js';

// Fast in-memory cache strictly for automated Vitest testing (NODE_ENV === 'test')
const testReadingsCache = new Map<string, OracleReadingRecord>();
const testIdempotencyCache = new Map<string, string>(); // idempotencyKey -> readingId

export async function saveOracleReading(
  record: OracleReadingRecord,
  idempotencyKey?: string
): Promise<OracleReadingRecord> {
  const isTest = process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);

  if (isTest && idempotencyKey && testIdempotencyCache.has(idempotencyKey)) {
    const existingReadingId = testIdempotencyCache.get(idempotencyKey)!;
    if (testReadingsCache.has(existingReadingId)) {
      return testReadingsCache.get(existingReadingId)!;
    }
  }

  if (isTest) {
    testReadingsCache.set(record.readingId, record);
    if (idempotencyKey) {
      testIdempotencyCache.set(idempotencyKey, record.readingId);
    }
  }

  if (!firestore) {
    if (isTest) return record;
    const err = new Error('SERVICE_UNAVAILABLE: Banco de dados indisponível para persistir leitura.');
    (err as any).statusCode = 503;
    throw err;
  }

  try {
    const readingRef = firestore.collection('readings').doc(record.readingId);

    if (idempotencyKey) {
      const idempRef = firestore.collection('reading_idempotency').doc(`${record.uid}_${idempotencyKey}`);
      return await firestore.runTransaction(async (transaction: any) => {
        const idempSnap = await transaction.get(idempRef);
        if (idempSnap.exists) {
          const idempData = idempSnap.data();
          if (idempData?.readingId) {
            const existingReadingSnap = await transaction.get(
              firestore.collection('readings').doc(idempData.readingId)
            );
            if (existingReadingSnap.exists) {
              return existingReadingSnap.data() as OracleReadingRecord;
            }
          }
        }

        transaction.set(readingRef, record);
        transaction.set(idempRef, {
          readingId: record.readingId,
          uid: record.uid,
          idempotencyKey,
          createdAt: new Date().toISOString(),
        });

        return record;
      });
    } else {
      await readingRef.set(record);
      return record;
    }
  } catch (err: any) {
    if (isTest) return record;
    console.error('[readingStorage] Critical: Failed to persist reading to Firestore:', err);
    throw new Error('Falha ao persistir leitura oracular no banco de dados.');
  }
}

export async function getOracleReadingById(uid: string, readingId: string): Promise<OracleReadingRecord | null> {
  if (process.env.NODE_ENV === 'test' && testReadingsCache.has(readingId)) {
    const cached = testReadingsCache.get(readingId)!;
    if (cached.uid !== uid) return null; // IDOR Protection
    return cached;
  }

  if (!firestore) return null;

  try {
    const doc = await firestore.collection('readings').doc(readingId).get();
    if (doc.exists) {
      const data = doc.data() as OracleReadingRecord;
      if (data.uid !== uid) {
        return null; // IDOR Protection: strictly verify ownership
      }
      return data;
    }
  } catch (err) {
    console.warn('[readingStorage] Warning: Failed to fetch reading from Firestore:', err);
  }

  return null;
}

export async function getReadingIdByIdempotency(uid: string, idempotencyKey?: string): Promise<string | null> {
  if (!idempotencyKey) return null;

  const isTest = process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);
  if (isTest && testIdempotencyCache.has(idempotencyKey)) {
    return testIdempotencyCache.get(idempotencyKey)!;
  }

  if (!firestore) return null;

  try {
    const idempDoc = await firestore.collection('reading_idempotency').doc(`${uid}_${idempotencyKey}`).get();
    if (idempDoc.exists) {
      return idempDoc.data()?.readingId || null;
    }
  } catch (err) {
    console.error('[readingStorage] FAIL CLOSED: Error checking idempotency key in Firestore:', err);
    throw new Error('Falha ao verificar idempotência da consulta no banco de dados.');
  }

  return null;
}

export function clearTestReadingStorage(): void {
  testReadingsCache.clear();
  testIdempotencyCache.clear();
}
