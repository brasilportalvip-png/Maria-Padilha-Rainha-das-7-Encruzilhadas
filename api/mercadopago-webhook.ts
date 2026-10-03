import type { Request, Response } from 'express';
import crypto from 'crypto';
import { firestore } from './_firebaseAdmin.js';
import { addPurchaseCredits } from './services/creditService.js';
import { logger } from './services/logger.js';
import type { PaymentOrder } from '../src/types/spiritual.js';

function extractPaymentId(req: Request): string | null {
  return (
    req.body?.data?.id ||
    req.body?.id ||
    (req.query?.['data.id'] as string) ||
    (req.query?.id as string) ||
    (req.query?.payment_id as string) ||
    null
  );
}

export function verifyMercadoPagoSignature(
  xSignatureHeader: string | undefined,
  xRequestId: string | undefined,
  dataId: string,
  secretKey: string
): boolean {
  if (!xSignatureHeader || !xRequestId || !secretKey) {
    return false;
  }

  // Parse x-signature: "ts=1700000000,v1=abcdef..."
  const parts = xSignatureHeader.split(',');
  let ts = '';
  let v1Hash = '';

  for (const part of parts) {
    const [key, val] = part.trim().split('=');
    if (key === 'ts') ts = val;
    if (key === 'v1') v1Hash = val;
  }

  if (!ts || !v1Hash) {
    return false;
  }

  // Replay protection: verify signature timestamp is within 15-minute window
  const tsNum = parseInt(ts, 10);
  if (!isNaN(tsNum)) {
    const tsMs = tsNum > 1e11 ? tsNum : tsNum * 1000;
    const diff = Math.abs(Date.now() - tsMs);
    if (diff > 15 * 60 * 1000) {
      return false;
    }
  }

  // Mercado Pago manifest format: "id:<data.id>;request-id:<x-request-id>;ts:<ts>;"
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const computedHash = crypto.createHmac('sha256', secretKey).update(manifest).digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(v1Hash, 'hex'));
  } catch {
    return false;
  }
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const paymentId = extractPaymentId(req);
  if (!paymentId) {
    return res.status(200).json({ received: true, ignored: true, reason: 'missing_payment_id' });
  }

  const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  const xSignature = req.headers['x-signature'] as string | undefined;
  const xRequestId = req.headers['x-request-id'] as string | undefined;
  const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';

  // In production: secret is mandatory. Fail closed!
  if (isProduction && (!webhookSecret || webhookSecret === 'MY_WEBHOOK_SECRET')) {
    logger.error('CRITICAL PRODUCTION FAIL-CLOSED: MERCADO_PAGO_WEBHOOK_SECRET is missing or placeholder.');
    return res.status(503).json({ error: 'Configuração de segurança do webhook indisponível.' });
  }

  // Strict signature verification when webhook secret is configured
  if (webhookSecret && webhookSecret !== 'MY_WEBHOOK_SECRET') {
    const isValid = verifyMercadoPagoSignature(xSignature, xRequestId, paymentId, webhookSecret);
    if (!isValid) {
      logger.error('MERCADO PAGO WEBHOOK: Invalid HMAC signature rejected with 401', {
        paymentId,
        xRequestId,
      });
      return res.status(401).json({ error: 'Assinatura inválida do webhook Mercado Pago.' });
    }
  }

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const isTestEnv = process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);

  if (!accessToken || accessToken === 'MY_ACCESS_TOKEN') {
    if (isTestEnv || process.env.ENABLE_MOCK_PAYMENT === 'true') {
      logger.warn('Webhook received in test/mock mode without live MP credentials', { paymentId });
      return res.status(200).json({ received: true, simulated: true });
    }

    logger.error('Webhook received but MERCADO_PAGO_ACCESS_TOKEN is missing in production', new Error('MISSING_ACCESS_TOKEN'));
    return res.status(503).json({ error: 'Serviço de pagamento indisponível.' });
  }

  if (!firestore) {
    return res.status(503).json({ error: 'Banco de dados indisponível.' });
  }

  try {
    // 1. Query Mercado Pago payment details
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const paymentInfo = await mpRes.json();

    if (!mpRes.ok) {
      logger.error('Failed to query Mercado Pago payment API', { status: mpRes.status, paymentId, paymentInfo });
      return res.status(200).json({ received: true, error: 'mp_fetch_failed' });
    }

    // 2. Check payment status
    if (paymentInfo.status !== 'approved') {
      logger.info('Mercado Pago payment not approved yet', { paymentId, status: paymentInfo.status });
      return res.status(200).json({ received: true, status: paymentInfo.status });
    }

    // 3. Extract orderId from external_reference or metadata
    const metadata = paymentInfo.metadata || {};
    const orderId = paymentInfo.external_reference || metadata.order_id || metadata.orderId;

    if (!orderId) {
      logger.error('Mercado Pago reconciliation failed: missing external_reference / orderId', { paymentId });
      return res.status(400).json({ error: 'Identificador do pedido (external_reference) ausente.' });
    }

    // 4. Load internal order from Firestore (Reconciliation requirement)
    const orderDoc = await firestore.collection('payment_orders').doc(orderId).get();
    if (!orderDoc.exists) {
      logger.error('Mercado Pago reconciliation failed: internal order record not found in Firestore', { orderId, paymentId });
      return res.status(400).json({ error: 'Pedido interno não encontrado no portal.' });
    }

    const orderData = orderDoc.data() as PaymentOrder;

    // 5. Verify UID
    const targetUid = orderData.uid;
    if (!targetUid) {
      logger.error('Order missing UID', { orderId });
      return res.status(400).json({ error: 'Pedido sem usuário associado.' });
    }

    // 6. Verify Currency (Must be BRL)
    if (paymentInfo.currency_id !== 'BRL' || orderData.currency !== 'BRL') {
      logger.error('Currency mismatch during payment reconciliation', {
        expected: 'BRL',
        received: paymentInfo.currency_id,
        orderCurrency: orderData.currency,
      });
      return res.status(400).json({ error: 'Moeda não aceita.' });
    }

    // 7. Verify Amount (Transaction amount must match expected amount)
    const transactionAmount = Number(paymentInfo.transaction_amount);
    const expectedAmount = Number(orderData.expectedAmount);
    if (Math.abs(transactionAmount - expectedAmount) > 0.01) {
      logger.error('Amount mismatch during payment reconciliation', {
        orderId,
        paymentId,
        expectedAmount,
        transactionAmount,
      });
      return res.status(400).json({ error: 'Valor pago diverge do valor esperado do plano.' });
    }

    // 8. Verify Credits
    const creditsToGrant = orderData.expectedCredits;
    if (!creditsToGrant || creditsToGrant <= 0) {
      logger.error('Order credits quantity invalid', { orderId, creditsToGrant });
      return res.status(400).json({ error: 'Quantidade de créditos do pedido inválida.' });
    }

    // 9. Check if order was already credited (Idempotent check)
    if (orderData.status === 'credited') {
      logger.info('Order was already credited, idempotent return', { orderId, paymentId });
      return res.status(200).json({ received: true, alreadyCredited: true });
    }

    // 10. Credit user account transactionally
    const creditResult = await addPurchaseCredits({
      uid: targetUid,
      amount: creditsToGrant,
      paymentId: String(paymentId),
      planId: orderData.planId,
    });

    // 11. Mark internal order as credited
    await firestore.collection('payment_orders').doc(orderId).set({
      status: 'credited',
      providerPaymentId: String(paymentId),
      creditedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    logger.security('Payment reconciled and credited successfully', {
      orderId,
      paymentId,
      uid: targetUid,
      creditsGranted: creditsToGrant,
      newBalance: creditResult.newBalance,
    });

    return res.status(200).json({
      received: true,
      credited: true,
      newBalance: creditResult.newBalance,
    });
  } catch (err: any) {
    logger.error('Error processing Mercado Pago webhook', err);
    return res.status(500).json({ error: 'Erro interno ao processar webhook.' });
  }
}
