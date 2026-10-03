import type { Request, Response } from 'express';
import { adminAuth, firestore } from './_firebaseAdmin.js';
import { RegisterRequestSchema } from './validation/schemas.js';
import { getClientIp } from './middleware/auth.js';
import { checkRateLimit } from './services/rateLimiter.js';
import { logger } from './services/logger.js';
import { parseAndValidateDate } from '../src/utils/dateNormalizer.js';
import type { UserProfile, CreditLedgerEntry } from '../src/types/spiritual.js';

export default async function handler(req: Request, res: Response) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const clientIp = getClientIp(req);
  const rateLimit = await checkRateLimit(`reg_${clientIp}`, 5, 60000, true);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: 'Muitas tentativas de cadastro a partir deste IP. Aguarde um minuto.',
      code: 'RATE_LIMIT_EXCEEDED',
    });
  }

  const parseResult = RegisterRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Dados de cadastro inválidos ou incompletos.',
      details: parseResult.error.format(),
    });
  }

  const data = parseResult.data;
  const normalizedEmail = data.email.toLowerCase().trim();

  // Validate strict calendar existence and normalize to canonical YYYY-MM-DD
  let canonicalBirthDate: string;
  try {
    const validDate = parseAndValidateDate(data.birthDate);
    canonicalBirthDate = validDate.isoDate;
  } catch (dateErr: any) {
    return res.status(400).json({
      error: dateErr.message || 'Data de nascimento impossível ou inválida.',
      code: 'INVALID_BIRTH_DATE',
    });
  }

  try {
    // Check if email already registered in firestore
    const emailSnapshot = await firestore
      .collection('users')
      .where('email', '==', normalizedEmail)
      .limit(1)
      .get();

    if (!emailSnapshot.empty) {
      return res.status(400).json({
        error: 'Este e-mail já está cadastrado em nosso portal.',
      });
    }

    let uid: string;

    if (!adminAuth || typeof adminAuth.createUser !== 'function') {
      return res.status(503).json({
        error: 'Serviço de autenticação temporariamente indisponível no servidor.',
        code: 'SERVICE_UNAVAILABLE',
      });
    }

    try {
      const firebaseUser = await adminAuth.createUser({
        email: normalizedEmail,
        password: data.password,
        displayName: data.fullName,
        emailVerified: false,
      });
      uid = firebaseUser.uid;
    } catch (authErr: any) {
      if (authErr?.code === 'auth/email-already-exists') {
        return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
      }
      logger.error('Firebase Admin createUser failed:', { error: String(authErr) });
      return res.status(500).json({
        error: 'Falha ao criar credencial de autenticação no Firebase.',
        code: 'AUTH_CREATION_FAILED',
      });
    }

    const INITIAL_CREDITS = 7;

    const newUser: UserProfile = {
      uid,
      fullName: data.fullName,
      email: normalizedEmail,
      phone: data.phone,
      birthDate: canonicalBirthDate,
      birthTime: data.birthTime || null,
      timezone: data.timezone || 'America/Sao_Paulo',
      credits: INITIAL_CREDITS,
      isBlocked: false,
      isVerified: false,
      emailVerified: false,
      phoneVerified: false,
      mfaEnabled: false,
      antiFraudScore: 0,
      deviceFingerprint: data.deviceId || 'web',
      role: 'user', // Role is never assigned by email, only via Admin Custom Claim
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save user doc and credit ledger transactionally
    await firestore.runTransaction(async (transaction: any) => {
      const userRef = firestore.collection('users').doc(uid);
      const ledgerId = `led_${crypto.randomUUID()}`;
      const ledgerRef = firestore.collection('credit_ledger').doc(ledgerId);

      const ledgerEntry: CreditLedgerEntry = {
        id: ledgerId,
        uid,
        type: 'promotion',
        amount: INITIAL_CREDITS,
        previousBalance: 0,
        newBalance: INITIAL_CREDITS,
        description: 'Boas-vindas ao Reino de Maria Padilha — 07 créditos iniciais',
        timestamp: new Date().toISOString(),
      };

      transaction.set(userRef, newUser);
      transaction.set(ledgerRef, ledgerEntry);
    });

    logger.info('User successfully registered with real Firebase Auth UID', { uid, email: normalizedEmail, ip: clientIp });

    return res.status(200).json({
      user: newUser,
      creditsGranted: INITIAL_CREDITS,
    });
  } catch (error: any) {
    logger.error('Error during user registration', error);
    return res.status(500).json({
      error: 'Erro interno ao processar cadastro.',
    });
  }
}
