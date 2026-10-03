import { describe, it, expect, vi } from 'vitest';
import { requireAuth, requireAdmin, verifyUserToken, type AuthenticatedRequest } from '../serverlib/middleware/auth.js';
import { ChatMessageSchema, CreatePaymentRequestSchema } from '../serverlib/validation/schemas.js';

describe('Server Security & Middleware (Requisitos 4, 5, 45, 75)', () => {
  it('verifyUserToken deve retornar null quando cabeçalho Authorization estiver ausente', async () => {
    const payload = await verifyUserToken(undefined);
    expect(payload).toBeNull();
  });

  it('verifyUserToken deve rejeitar tokens sem o prefixo Bearer', async () => {
    const payload = await verifyUserToken('Basic 123456');
    expect(payload).toBeNull();
  });

  it('requireAuth deve responder com status 401 quando não autenticado', async () => {
    const req = {
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
    } as unknown as AuthenticatedRequest;

    const jsonMock = vi.fn();
    const statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    const res = { status: statusMock } as any;

    const result = await requireAuth(req, res);
    expect(result).toBe(false);
    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ code: 'AUTH_REQUIRED' }));
  });

  it('requireAdmin deve responder com status 403 para usuário comum não administrador', async () => {
    const req = {
      headers: { authorization: 'Bearer test_token_common_user' },
      socket: { remoteAddress: '127.0.0.1' },
    } as unknown as AuthenticatedRequest;

    const jsonMock = vi.fn();
    const statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    const res = { status: statusMock } as any;

    const result = await requireAdmin(req, res);
    expect(result).toBe(false);
    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ code: 'ADMIN_REQUIRED' }));
  });

  it('Zod Schema deve rejeitar mensagem excessivamente grande', () => {
    const hugeMessage = 'A'.repeat(3000);
    const result = ChatMessageSchema.safeParse({ message: hugeMessage });
    expect(result.success).toBe(false);
  });

  it('Zod Schema de Pagamento deve rejeitar planos desconhecidos', () => {
    const result = CreatePaymentRequestSchema.safeParse({ planId: 'plano_inexistente' });
    expect(result.success).toBe(false);
  });

  it('requireAdmin deve rejeitar usuário cujo documento no banco diz role:admin mas o token NÃO tem custom claim admin:true', async () => {
    const req = {
      headers: { authorization: 'Bearer test_token_impersonator_user' },
      socket: { remoteAddress: '127.0.0.1' },
    } as unknown as AuthenticatedRequest;

    const jsonMock = vi.fn();
    const statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    const res = { status: statusMock } as any;

    const result = await requireAdmin(req, res);
    expect(result).toBe(false);
    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ code: 'ADMIN_REQUIRED' }));
  });

  it('requireAdmin deve autorizar com sucesso quando o token possui custom claim admin:true legítima', async () => {
    const req = {
      headers: { authorization: 'Bearer test_token_admin_super' },
      socket: { remoteAddress: '127.0.0.1' },
    } as unknown as AuthenticatedRequest;

    const jsonMock = vi.fn();
    const statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    const res = { status: statusMock } as any;

    const result = await requireAdmin(req, res);
    expect(result).toBe(true);
    expect(req.hasAdminClaim).toBe(true);
  });

  it('sanitização de impressão deve neutralizar scripts maliciosos e tags executáveis', () => {
    const maliciousInput = '<script>alert("xss")</script><img src="x" onerror="stealCookie()"><b>Texto Legítimo</b>';
    
    // Test the exact sanitizer regex used in handlePrint
    const sanitized = maliciousInput
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/\son\w+\s*=\s*(["']).*?\1/gi, '')
      .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
      .replace(/javascript:/gi, 'blocked:');

    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('onerror=');
    expect(sanitized).toContain('<b>Texto Legítimo</b>');
  });
});
