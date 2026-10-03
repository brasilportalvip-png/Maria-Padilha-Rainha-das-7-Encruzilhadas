import crypto from 'crypto';
import { firestore } from '../_firebaseAdmin.js';
import type { Request, Response, NextFunction } from 'express';
import { getClientIp, type AuthenticatedRequest } from '../middleware/auth.js';

interface MemoryEntry {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, MemoryEntry>();
const isTestEnv = process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);

export function clearRateLimitForUid(uid: string): void {
  const prefixes = [`chat_${uid}`, `read_${uid}`, `love_${uid}`, `pay_${uid}`, uid];
  for (const p of prefixes) {
    memoryStore.delete(p);
  }
}

export async function checkRateLimit(
  identifier: string,
  limit: number = 30,
  windowMs: number = 60 * 1000,
  failClosed: boolean = false
): Promise<{ allowed: boolean; remaining: number; resetInMs: number }> {
  const now = Date.now();

  // In test environment or local development, use memory store. In production, if Firestore is unavailable and failClosed is true, block safely.
  if (isTestEnv || !firestore) {
    if (!isTestEnv && !firestore && failClosed) {
      console.error('[RateLimiter] Firestore unavailable in production for failClosed endpoint:', identifier);
      return { allowed: false, remaining: 0, resetInMs: windowMs };
    }

    const entry = memoryStore.get(identifier);
    if (!entry || now > entry.resetTime) {
      memoryStore.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return { allowed: true, remaining: limit - 1, resetInMs: windowMs };
    }

    if (entry.count >= limit) {
      return { allowed: false, remaining: 0, resetInMs: Math.max(0, entry.resetTime - now) };
    }

    entry.count += 1;
    return {
      allowed: true,
      remaining: limit - entry.count,
      resetInMs: Math.max(0, entry.resetTime - now),
    };
  }

  // Serverless distributed rate limiter via Firestore atomic transaction
  // Use irreversible SHA-256 hash of identifier to prevent storing raw UIDs or IPs in rate limit document IDs
  try {
    const bucketIndex = Math.floor(now / windowMs);
    const hashedId = crypto.createHash('sha256').update(identifier).digest('hex').slice(0, 32);
    const docId = `rl_${hashedId}_${bucketIndex}`;
    const docRef = firestore.collection('rate_limits').doc(docId);
    const resetTime = (bucketIndex + 1) * windowMs;
    const resetInMs = Math.max(0, resetTime - now);

    let allowed = true;
    let remaining = 0;

    await firestore.runTransaction(async (t: any) => {
      const snap = await t.get(docRef);
      let count = 0;

      if (snap.exists) {
        count = snap.data()?.count || 0;
      }

      if (count >= limit) {
        allowed = false;
        remaining = 0;
        return;
      }

      const nextCount = count + 1;
      remaining = Math.max(0, limit - nextCount);

      t.set(docRef, {
        count: nextCount,
        expiresAt: new Date(resetTime),
        expiresAtIso: new Date(resetTime).toISOString(),
      }, { merge: true });
    });

    return { allowed, remaining, resetInMs };
  } catch (e) {
    if (failClosed) {
      console.error('[RateLimiter] Distributed rate limit check failed, failing closed for sensitive endpoint:', e);
      return { allowed: false, remaining: 0, resetInMs: windowMs };
    }
    // Fail-open for general reading queries
    console.warn('[RateLimiter] Distributed rate limit check failed, failing open for general query:', e);
    return { allowed: true, remaining: 1, resetInMs: windowMs };
  }
}

export function rateLimitMiddleware(limit: number = 30, windowMs: number = 60 * 1000) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    const identifier = authReq.user?.uid || getClientIp(req);
    const result = await checkRateLimit(identifier, limit, windowMs);

    res.setHeader('X-RateLimit-Limit', limit.toString());
    res.setHeader('X-RateLimit-Remaining', result.remaining.toString());
    res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetInMs / 1000).toString());

    if (!result.allowed) {
      res.status(429).json({
        error: 'Muitas requisições em curto intervalo. Por favor, aguarde alguns instantes.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfterSeconds: Math.ceil(result.resetInMs / 1000),
      });
      return;
    }

    next();
  };
}
