import type { Request, Response, NextFunction } from 'express';
import { adminAuth, firestore, FieldValue } from '../_firebaseAdmin.js';
import type { UserProfile } from '../../src/types/spiritual.js';

export interface AuthenticatedRequest extends Request {
  user?: UserProfile;
  authToken?: string;
  correlationId?: string;
  clientIp?: string;
  hasAdminClaim?: boolean;
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  return req.socket?.remoteAddress || '127.0.0.1';
}

export async function verifyUserToken(authHeader?: string): Promise<{ uid: string; email?: string; admin?: boolean } | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7).trim();
  if (!token) return null;

  try {
    // If Firebase Admin has verified credentials, verify token using Admin SDK
    if (adminAuth && typeof adminAuth.verifyIdToken === 'function') {
      const decoded = await adminAuth.verifyIdToken(token);
      return {
        uid: decoded.uid,
        email: decoded.email,
        admin: Boolean(decoded.admin),
      };
    }
  } catch (err: any) {
    console.warn('[Auth Middleware] Firebase ID Token verification failed:', err?.message || err);
  }

  // Strictly isolated to Vitest unit/integration testing
  const isTestEnv = process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);
  if (isTestEnv && token.startsWith('test_token_')) {
    const uid = token.replace('test_token_', '');
    const isAdmin = uid.includes('admin');
    return { uid, email: `${uid}@portal.com`, admin: isAdmin };
  }

  return null;
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next?: NextFunction): Promise<boolean> {
  const isTestEnv = process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);
  req.clientIp = getClientIp(req);
  req.correlationId = (req.headers['x-correlation-id'] as string) || `req_${crypto.randomUUID()}`;

  const authHeader = req.headers['authorization'];
  const tokenPayload = await verifyUserToken(authHeader);

  if (!tokenPayload) {
    res.status(401).json({
      error: 'Autenticação necessária. Token ausente ou inválido.',
      code: 'AUTH_REQUIRED',
      correlationId: req.correlationId,
    });
    return false;
  }

  if (!firestore) {
    res.status(503).json({
      error: 'Serviço de dados do Firebase Admin indisponível no servidor.',
      code: 'SERVICE_UNAVAILABLE',
      correlationId: req.correlationId,
    });
    return false;
  }

  try {
    const userDoc = await firestore.collection('users').doc(tokenPayload.uid).get();
    let data: UserProfile;

    if (userDoc.exists) {
      const rawData = (userDoc.data() || {}) as any;
      if ('city' in rawData) {
        delete rawData.city;
        if (typeof userDoc.ref?.update === 'function') {
          userDoc.ref.update({ city: FieldValue?.delete ? FieldValue.delete() : null }).catch(() => {});
        }
      }
      data = rawData as UserProfile;
    } else if (isTestEnv && authHeader?.includes('test_token_')) {
      data = {
        uid: tokenPayload.uid,
        fullName: 'Test User',
        email: `${tokenPayload.uid}@portal.com`,
        phone: '',
        birthDate: '1990-01-01',
        birthTime: '12:00',
        timezone: 'America/Sao_Paulo',
        credits: 10,
        isBlocked: false,
        isVerified: false,
        emailVerified: false,
        phoneVerified: false,
        mfaEnabled: false,
        antiFraudScore: 0,
        deviceFingerprint: 'test',
        role: tokenPayload.admin ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
      };
    } else {
      res.status(404).json({
        error: 'Perfil de usuário não encontrado no Firestore.',
        code: 'USER_NOT_FOUND',
        correlationId: req.correlationId,
      });
      return false;
    }

    if (data.isBlocked) {
      res.status(403).json({
        error: 'Acesso negado. Esta conta foi bloqueada por razões de segurança.',
        code: 'USER_BLOCKED',
        correlationId: req.correlationId,
      });
      return false;
    }

    // Role is authoritative: custom claims take precedence, followed by verified firestore record
    if (tokenPayload.admin) {
      data.role = 'admin';
    }

    req.user = data;
    req.hasAdminClaim = Boolean(tokenPayload.admin);
  } catch (error: any) {
    console.error('[requireAuth] Error fetching user doc:', error);
    res.status(500).json({
      error: 'Erro interno ao validar perfil do usuário.',
      code: 'INTERNAL_ERROR',
      correlationId: req.correlationId,
    });
    return false;
  }

  if (next) {
    next();
  }
  return true;
}

export async function requireAdmin(req: AuthenticatedRequest, res: Response, next?: NextFunction): Promise<boolean> {
  const isAuthed = await requireAuth(req, res);
  if (!isAuthed) return false;

  // Admin autorizado por Custom Claim OU role=admin verificado diretamente no Firestore pelo servidor.
  // O cliente não pode alterar o campo role pelas regras do Firestore.
  const isAdmin = req.hasAdminClaim === true || req.user?.role === 'admin';

  if (!isAdmin) {
    res.status(403).json({
      error: 'Acesso restrito. Privilégios administrativos necessários.',
      code: 'ADMIN_REQUIRED',
      correlationId: req.correlationId,
    });
    return false;
  }

  if (next) {
    next();
  }
  return true;
}
