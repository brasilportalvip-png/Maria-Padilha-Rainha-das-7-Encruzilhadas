import type { Request, Response } from 'express';
import { isFirebaseAdminActive } from './_firebaseAdmin.js';

export default function handler(req: Request, res: Response) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  return res.status(200).json({
    status: 'online',
    service: 'Reino de Maria Padilha',
    version: '2.0.0',
    firebaseAdminReady: isFirebaseAdminActive,
    timestamp: new Date().toISOString(),
  });
}
