import type { Request, Response } from 'express';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { requireAuth, type AuthenticatedRequest } from './middleware/auth.js';
import { CreatePaymentRequestSchema } from './validation/schemas.js';
import { firestore } from './_firebaseAdmin.js';
import { logger } from './services/logger.js';
import { checkRateLimit } from './services/rateLimiter.js';
import type { PaymentOrder } from '../src/types/spiritual.js';

export const SERVER_PLANS: Record<string, { id: string; name: string; price: number; credits: number }> = {
  prata: { id: 'prata', name: 'Plano Prata — 30 Créditos', price: 50, credits: 30 },
  ouro: { id: 'ouro', name: 'Plano Ouro — 65 Créditos', price: 100, credits: 65 },
  diamante: { id: 'diamante', name: 'Plano Diamante — 110 Créditos', price: 150, credits: 110 },
};

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const authReq = req as AuthenticatedRequest;
  const isAuthed = await requireAuth(authReq, res);
  if (!isAuthed) return;

  const user = authReq.user!;

  // Distributed Rate Limiting: 10 payment intents per minute per user
  const rateLimit = await checkRateLimit(`pay_${user.uid}`, 10, 60000);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: 'Muitas tentativas de criação de pagamento. Aguarde um minuto.',
      code: 'RATE_LIMIT_EXCEEDED',
    });
  }

  // Validate request body
  const parseResult = CreatePaymentRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Plano inválido ou parâmetros incorretos.',
      details: parseResult.error.format(),
    });
  }

  const { planId, idempotencyKey } = parseResult.data;
  const plan = SERVER_PLANS[planId];

  if (!plan) {
    return res.status(400).json({ error: 'Plano selecionado não existe na tabela do servidor.' });
  }

  if (!firestore) {
    return res.status(503).json({
      error: 'Banco de dados indisponível para registro financeiro.',
      code: 'SERVICE_UNAVAILABLE',
    });
  }

  // Check payment idempotency: if order with this idempotencyKey exists for user, return it
  if (idempotencyKey) {
    try {
      const existingSnap = await firestore
        .collection('payment_orders')
        .where('uid', '==', user.uid)
        .where('idempotencyKey', '==', idempotencyKey)
        .limit(1)
        .get();

      if (!existingSnap.empty) {
        const existingOrder = existingSnap.docs[0].data() as PaymentOrder;
        logger.info('Returning existing payment order due to idempotencyKey', { idempotencyKey, orderId: existingOrder.orderId });
        return res.status(200).json({
          orderId: existingOrder.orderId,
          init_point: existingOrder.initPoint || existingOrder.sandboxInitPoint,
          sandbox_init_point: existingOrder.sandboxInitPoint,
          isExisting: true,
        });
      }
    } catch (e) {
      logger.error('FAIL-CLOSED: Failed to verify payment idempotency in database', e);
      return res.status(500).json({
        error: 'Falha temporária ao verificar integridade do pedido. O pagamento foi interrompido com segurança.',
        code: 'IDEMPOTENCY_CHECK_FAILED',
      });
    }
  }

  const orderId = `ord_${crypto.randomUUID()}`;
  const orderRecord: PaymentOrder = {
    orderId,
    uid: user.uid,
    userEmail: user.email,
    planId: plan.id,
    planName: plan.name,
    expectedAmount: plan.price,
    currency: 'BRL',
    expectedCredits: plan.credits,
    status: 'pending',
    idempotencyKey: idempotencyKey || orderId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Fail-closed: Internal order MUST be persisted before creating gateway payment
  try {
    await firestore.collection('payment_orders').doc(orderId).set(orderRecord);
  } catch (err: any) {
    logger.error('FAIL-CLOSED: Payment order could not be saved to Firestore', { orderId, error: String(err) });
    return res.status(500).json({
      error: 'Não foi possível registrar o pedido no banco de dados. O pagamento foi interrompido com segurança.',
      code: 'ORDER_PERSISTENCE_FAILED',
    });
  }

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const siteUrl = process.env.PUBLIC_SITE_URL || process.env.APP_BASE_URL || 'http://localhost:3000';
  const isTestEnv = process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);
  const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';

  if (!accessToken || accessToken === 'MY_ACCESS_TOKEN') {
    // REGRA DE SEGURANÇA ABSOLUTA: MOCK É TERMINANTEMENTE PROIBIDO EM PRODUÇÃO
    if (!isProduction && (isTestEnv || process.env.ENABLE_MOCK_PAYMENT === 'true')) {
      logger.warn('MERCADO_PAGO_ACCESS_TOKEN not configured in test/local mode. Returning sandbox init_point.');
      return res.status(200).json({
        orderId,
        init_point: `${siteUrl}/credits?mock_order=${orderId}&plan=${plan.id}`,
        sandbox_init_point: `${siteUrl}/credits?mock_order=${orderId}&plan=${plan.id}`,
        isMock: true,
      });
    }

    logger.error('PRODUCTION FAIL-CLOSED: MERCADO_PAGO_ACCESS_TOKEN is missing or placeholder in production.', new Error('MISSING_ACCESS_TOKEN'));
    return res.status(503).json({
      error: 'Gateway de pagamentos do Mercado Pago temporariamente indisponível no servidor.',
      code: 'GATEWAY_CONFIG_MISSING',
    });
  }

  try {
    const mpClient = new MercadoPagoConfig({ accessToken });
    const preferenceClient = new Preference(mpClient);

    const preferenceBody = {
      items: [
        {
          id: plan.id,
          title: plan.name,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: plan.price,
        },
      ],
      payer: {
        email: user.email,
        name: user.fullName || 'Consulente',
      },
      metadata: {
        orderId,
        userId: user.uid,
        userEmail: user.email,
        planId: plan.id,
        expectedAmount: plan.price,
        expectedCredits: plan.credits,
      },
      external_reference: orderId,
      notification_url: `${siteUrl}/api/mercadopago-webhook`,
      back_urls: {
        success: `${siteUrl}/credits?status=success&orderId=${orderId}`,
        failure: `${siteUrl}/credits?status=failure&orderId=${orderId}`,
        pending: `${siteUrl}/credits?status=pending&orderId=${orderId}`,
      },
      auto_return: 'approved',
    };

    const mpRes = await preferenceClient.create({ body: preferenceBody });

    // Update order with provider preference ID and links
    await firestore.collection('payment_orders').doc(orderId).set({
      providerPreferenceId: mpRes.id,
      initPoint: mpRes.init_point,
      sandboxInitPoint: mpRes.sandbox_init_point,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return res.status(200).json({
      orderId,
      id: mpRes.id,
      init_point: mpRes.init_point,
      sandbox_init_point: mpRes.sandbox_init_point,
    });
  } catch (err: any) {
    logger.error('Error creating Mercado Pago preference', err);
    return res.status(500).json({
      error: 'Não foi possível gerar a preferência de pagamento no momento. Tente novamente mais tarde.',
    });
  }
}
