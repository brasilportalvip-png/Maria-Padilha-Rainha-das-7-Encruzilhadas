import type { Request, Response } from 'express';
import { isFirebaseAdminActive } from '../serverlib/_firebaseAdmin.js';

export default function handler(req: Request, res: Response) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  const isTestEnv = process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);
  const readiness = isFirebaseAdminActive || isTestEnv;
  const isReadinessProbe = req.query?.probe === 'readiness';

  if (isReadinessProbe && !readiness) {
    return res.status(503).json({
      status: 'unready',
      liveness: true,
      readiness: false,
      service: 'Reino de Maria Padilha',
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(200).json({
    status: readiness ? 'online' : 'degraded',
    liveness: true,
    readiness,
    service: 'Reino de Maria Padilha',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
}
