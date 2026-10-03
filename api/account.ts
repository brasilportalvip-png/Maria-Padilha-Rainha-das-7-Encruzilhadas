import type { Request, Response } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../serverlib/middleware/auth.js';
import { DeleteAccountSchema } from '../serverlib/validation/schemas.js';
import { firestore, adminAuth } from '../serverlib/_firebaseAdmin.js';
import { logger } from '../serverlib/services/logger.js';
import { clearRateLimitForUid } from '../serverlib/services/rateLimiter.js';

export default async function handler(req: Request, res: Response) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  const authReq = req as AuthenticatedRequest;
  const isAuthed = await requireAuth(authReq, res);
  if (!isAuthed) return;

  const user = authReq.user!;
  const action = (req.query?.action as string) || req.body?.action || 'export_data';

  try {
    if (action === 'export_data') {
      // LGPD: Data portability / access
      const readingsSnap = await firestore.collection('readings').where('uid', '==', user.uid).get();
      const readings = readingsSnap.docs.map((d: any) => d.data());

      const ledgerSnap = await firestore.collection('credit_ledger').where('uid', '==', user.uid).get();
      const ledger = ledgerSnap.docs.map((d: any) => d.data());

      const diarySnap = await firestore.collection('diary').where('userId', '==', user.uid).get();
      const diary = diarySnap.docs.map((d: any) => d.data());

      const ordersSnap = await firestore.collection('payment_orders').where('uid', '==', user.uid).get();
      const orders = ordersSnap.docs.map((d: any) => {
        const o = d.data();
        return {
          orderId: o.orderId,
          planName: o.planName,
          expectedAmount: o.expectedAmount,
          currency: o.currency,
          status: o.status,
          createdAt: o.createdAt,
        };
      });

      let spiritualProfile = null;
      try {
        const sDoc = await firestore.collection('spiritual_profiles').doc(user.uid).get();
        if (sDoc.exists) spiritualProfile = sDoc.data();
      } catch {
        // ignore
      }

      let spiritualHistory = null;
      try {
        const hDoc = await firestore.collection('spiritual_history').doc(user.uid).get();
        if (hDoc.exists) spiritualHistory = hDoc.data();
      } catch {
        // ignore
      }

      return res.status(200).json({
        userProfile: {
          fullName: user.fullName,
          email: user.email,
          birthDate: user.birthDate,
          birthTime: user.birthTime || null,
          credits: user.credits,
          createdAt: user.createdAt,
        },
        spiritualProfile,
        spiritualHistory,
        readings,
        creditLedger: ledger,
        diaryEntries: diary,
        paymentOrders: orders,
        exportedAt: new Date().toISOString(),
      });
    }

    if (action === 'delete_account' && req.method === 'POST') {
      const parseResult = DeleteAccountSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          error: 'Para confirmar a exclusão, envie exatamente a frase de confirmação: QUERO_EXCLUIR_MINHA_CONTA',
        });
      }

      // 1. Delete personal diary entries
      const diaryDocs = await firestore.collection('diary').where('userId', '==', user.uid).get();
      for (const d of diaryDocs.docs) {
        await d.ref.delete();
      }

      // 2. Delete all oracle readings and interpretations to purge personal questions and natal data
      const readingsDocs = await firestore.collection('readings').where('uid', '==', user.uid).get();
      for (const r of readingsDocs.docs) {
        await r.ref.delete();
      }

      // 3. Delete spiritual profiles and living history
      try {
        await firestore.collection('spiritual_profiles').doc(user.uid).delete();
        await firestore.collection('spiritual_history').doc(user.uid).delete();
      } catch {
        // ignore
      }

      // 3b. LGPD: Permanently purge technical idempotency and operation documents carrying user UID
      try {
        const idempDocs = await firestore.collection('reading_idempotency').where('uid', '==', user.uid).get();
        for (const doc of idempDocs.docs) {
          await doc.ref.delete();
        }
      } catch {
        // ignore
      }

      try {
        const creditOpDocs = await firestore.collection('credit_operations').where('uid', '==', user.uid).get();
        for (const doc of creditOpDocs.docs) {
          await doc.ref.delete();
        }
      } catch {
        // ignore
      }

      try {
        const oracleOpDocs = await firestore.collection('oracle_operations').where('uid', '==', user.uid).get();
        for (const doc of oracleOpDocs.docs) {
          await doc.ref.delete();
        }
      } catch {
        // ignore
      }

      clearRateLimitForUid(user.uid);

      // 4. True anonymization of tax/financial records (Art. 16, I e II da LGPD):
      // Retain financial ledger entries strictly for tax compliance, but detach the user UID and PII irreversibly.
      const paymentDocs = await firestore.collection('payment_orders').where('uid', '==', user.uid).get();
      for (const p of paymentDocs.docs) {
        await p.ref.set({
          uid: '[TITULAR_EXCLUIDO_LGPD]',
          userEmail: '[anonimizado@lgpd.invalid]',
          anonymizedAt: new Date().toISOString(),
        }, { merge: true });
      }

      const ledgerDocs = await firestore.collection('credit_ledger').where('uid', '==', user.uid).get();
      for (const l of ledgerDocs.docs) {
        await l.ref.set({
          uid: '[TITULAR_EXCLUIDO_LGPD]',
          description: '[Registro Fiscal/Contábil Retido por Lei - Identidade Pessoal Excluída]',
          metadata: {},
        }, { merge: true });
      }

      // 5. Permanently delete user document from firestore
      await firestore.collection('users').doc(user.uid).delete();

      // 6. Delete authentication credential from Firebase Auth
      if (adminAuth && typeof adminAuth.deleteUser === 'function') {
        try {
          await adminAuth.deleteUser(user.uid);
        } catch (e) {
          logger.warn('Failed to delete auth user from Firebase Auth:', { uid: user.uid });
        }
      }

      logger.security('Account and personal data permanently purged under LGPD (tax records detached of identity)', { uid: user.uid });

      return res.status(200).json({
        success: true,
        message: 'Sua conta, histórico de consultas, diário e dados de identificação foram excluídos permanentemente. Registros fiscais foram desvinculados de sua identidade e anonimizados conforme exigência legal.',
      });
    }

    return res.status(400).json({ error: 'Ação não reconhecida.' });
  } catch (err: any) {
    logger.error('Account management error', err);
    return res.status(500).json({ error: 'Erro ao processar solicitação de conta.' });
  }
}
