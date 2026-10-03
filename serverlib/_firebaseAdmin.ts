import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let firestoreInstance: any = null;
let adminAuthInstance: any = null;

try {
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (base64) {
    const jsonText = Buffer.from(base64, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(jsonText);
    if (getApps().length === 0) {
      initializeApp({
        credential: cert(serviceAccount),
      });
    }
    firestoreInstance = getFirestore();
    adminAuthInstance = getAuth();
  }
} catch (e) {
  console.warn('[Firebase Admin] Service account initialization error:', e);
}

const isTestEnv = process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);

// In-memory mock store strictly isolated to automated tests (NODE_ENV === 'test')
const memoryStore = new Map<string, Map<string, any>>();
function getCollectionStore(name: string) {
  if (!memoryStore.has(name)) {
    memoryStore.set(name, new Map());
  }
  return memoryStore.get(name)!;
}

const testMockFirestore = {
  collection: (colName: string) => {
    const store = getCollectionStore(colName);
    return {
      doc: (docId?: string) => {
        const id = docId || 'doc_' + Math.random().toString(36).substring(2, 10);
        return {
          id,
          get: async () => ({
            exists: store.has(id),
            data: () => store.get(id),
          }),
          set: async (data: any, options?: any) => {
            const current = options?.merge ? (store.get(id) || {}) : {};
            store.set(id, { ...current, ...data });
            return { writeTime: new Date() };
          },
          update: async (data: any) => {
            const current = store.get(id) || {};
            store.set(id, { ...current, ...data });
            return { writeTime: new Date() };
          },
          delete: async () => {
            store.delete(id);
            return { writeTime: new Date() };
          },
        };
      },
      add: async (data: any) => {
        const id = 'doc_' + Math.random().toString(36).substring(2, 10);
        store.set(id, data);
        return { id };
      },
      where: (field?: string, op?: string, val?: any) => {
        const filter = () => {
          const results: any[] = [];
          for (const [id, item] of store.entries()) {
            if (!field || (op === '==' && item && item[field] === val)) {
              results.push({
                id,
                ref: {
                  id,
                  delete: async () => store.delete(id),
                  set: async (d: any, opt?: any) => {
                    const current = opt?.merge ? (store.get(id) || {}) : {};
                    store.set(id, { ...current, ...d });
                  },
                },
                data: () => item,
              });
            }
          }
          return { empty: results.length === 0, docs: results };
        };

        return {
          where: () => ({
            limit: () => ({ get: async () => filter() }),
            get: async () => filter(),
          }),
          limit: () => ({
            get: async () => filter(),
          }),
          get: async () => filter(),
        };
      },
    };
  },
  runTransaction: async (cb: any) => {
    const t = {
      get: async (ref: any) => ref.get(),
      set: async (ref: any, data: any) => ref.set(data),
      update: async (ref: any, data: any) => ref.update(data),
      delete: async (ref: any) => ref.delete ? ref.delete() : undefined,
    };
    return cb(t);
  },
};

const testMockAdminAuth = {
  createUser: async (userParams: any) => ({
    uid: 'usr_' + Math.random().toString(36).substring(2, 12),
    email: userParams.email,
    displayName: userParams.displayName,
  }),
  verifyIdToken: async (token: string) => {
    if (token.startsWith('test_token_')) {
      const uid = token.replace('test_token_', '');
      return { uid, email: `${uid}@portal.com`, admin: uid.includes('admin') };
    }
    throw new Error('Invalid token in test mock');
  },
  setCustomUserClaims: async () => {},
};

export function assertFirebaseAdminReady(): void {
  if (!firestoreInstance || !adminAuthInstance) {
    if (isTestEnv) return;
    const err = new Error('FIREBASE_ADMIN_UNAVAILABLE: O serviço de dados do Firebase Admin não está configurado.');
    (err as any).statusCode = 503;
    (err as any).code = 'SERVICE_UNAVAILABLE';
    throw err;
  }
}

export const firestore = firestoreInstance || (isTestEnv ? (testMockFirestore as any) : null);
export const adminAuth = adminAuthInstance || (isTestEnv ? (testMockAdminAuth as any) : null);
export const isFirebaseAdminActive = Boolean(firestoreInstance && adminAuthInstance);
export { FieldValue };
