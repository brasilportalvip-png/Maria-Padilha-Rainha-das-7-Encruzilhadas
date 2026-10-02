import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { verifyMercadoPagoSignature } from '../api/mercadopago-webhook.js';

describe('Mercado Pago Webhook Security & Signature Validation (Requisitos 6, 7)', () => {
  const secretKey = 'test_webhook_secret_key_123';
  const dataId = '1234567890';
  const xRequestId = '550e8400-e29b-41d4-a716-446655440000';
  const ts = Math.floor(Date.now() / 1000).toString();

  it('deve validar com sucesso uma assinatura HMAC-SHA256 autêntica', () => {
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
    const v1Hash = crypto.createHmac('sha256', secretKey).update(manifest).digest('hex');
    const xSignature = `ts=${ts},v1=${v1Hash}`;

    const isValid = verifyMercadoPagoSignature(xSignature, xRequestId, dataId, secretKey);
    expect(isValid).toBe(true);
  });

  it('deve rejeitar uma assinatura HMAC adulterada ou inválida', () => {
    const invalidSignature = `ts=${ts},v1=deadbeef1234567890abcdef`;
    const isValid = verifyMercadoPagoSignature(invalidSignature, xRequestId, dataId, secretKey);
    expect(isValid).toBe(false);
  });

  it('deve rejeitar quando cabeçalhos x-signature ou x-request-id estiverem ausentes', () => {
    expect(verifyMercadoPagoSignature(undefined, xRequestId, dataId, secretKey)).toBe(false);
    expect(verifyMercadoPagoSignature(`ts=${ts},v1=abc`, undefined, dataId, secretKey)).toBe(false);
    expect(verifyMercadoPagoSignature(`ts=${ts},v1=abc`, xRequestId, dataId, '')).toBe(false);
  });
});
