import type { Request, Response } from 'express';
import { requireAdmin, type AuthenticatedRequest } from './middleware/auth.js';
import { UpdateCreditsSchema, BlockUserSchema } from './validation/schemas.js';
import { firestore } from './_firebaseAdmin.js';
import { getUserCredits } from './services/creditService.js';
import { logger } from './services/logger.js';
import type { CreditLedgerEntry } from '../src/types/spiritual.js';

export default async function handler(req: Request, res: Response) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  const authReq = req as AuthenticatedRequest;
  const isAdmin = await requireAdmin(authReq, res);
  if (!isAdmin) return;

  const action = (req.query?.action as string) || req.body?.action || 'list_users';

  try {
    if (action === 'list_users') {
      const snapshot = await firestore.collection('users').limit(50).get();
      const users = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          uid: d.uid,
          fullName: d.fullName,
          email: d.email,
          birthDate: d.birthDate,
          birthTime: d.birthTime,
          credits: d.credits,
          isBlocked: d.isBlocked,
          role: d.role,
          createdAt: d.createdAt,
        };
      });
      return res.status(200).json({ users });
    }

    if (action === 'list_ledger') {
      const snapshot = await firestore.collection('credit_ledger').limit(50).get();
      const entries = snapshot.docs.map((doc) => doc.data());
      return res.status(200).json({ entries });
    }

    if (action === 'update_credits') {
      const parseResult = UpdateCreditsSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: 'Parâmetros inválidos.', details: parseResult.error.format() });
      }

      const { targetUid, creditsDelta, reason } = parseResult.data;
      const ledgerId = `adm_${crypto.randomUUID()}`;
      let newBalance = 0;

      await firestore.runTransaction(async (transaction: any) => {
        const userRef = firestore.collection('users').doc(targetUid);
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists) {
          throw new Error('USER_NOT_FOUND');
        }
        const currentBalance = userSnap.data()?.credits || 0;
        newBalance = Math.max(0, currentBalance + creditsDelta);

        const ledgerEntry: CreditLedgerEntry = {
          id: ledgerId,
          uid: targetUid,
          type: 'admin_adjustment',
          amount: creditsDelta,
          previousBalance: currentBalance,
          newBalance,
          description: `Ajuste administrativo: ${reason}`,
          timestamp: new Date().toISOString(),
        };

        transaction.set(userRef, { credits: newBalance }, { merge: true });
        transaction.set(firestore.collection('credit_ledger').doc(ledgerId), ledgerEntry);
      });

      logger.security('Admin adjusted user credits', { targetUid, delta: creditsDelta, reason, byAdmin: authReq.user?.email });
      return res.status(200).json({ success: true, newBalance });
    }

    if (action === 'block_user') {
      const parseResult = BlockUserSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: 'Parâmetros inválidos.', details: parseResult.error.format() });
      }

      const { targetUid, isBlocked, reason } = parseResult.data;
      await firestore.collection('users').doc(targetUid).set({ isBlocked, updatedAt: new Date().toISOString() }, { merge: true });

      logger.security('Admin toggled user block status', { targetUid, isBlocked, reason, byAdmin: authReq.user?.email });
      return res.status(200).json({ success: true, isBlocked });
    }

    return res.status(400).json({ error: 'Ação administrativa não reconhecida.' });
  } catch (err: any) {
    logger.error('Admin API error', err);
    return res.status(500).json({ error: 'Erro ao executar ação administrativa.' });
  }
}
