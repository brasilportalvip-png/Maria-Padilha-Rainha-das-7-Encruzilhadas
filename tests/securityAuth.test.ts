import { describe, it, expect, vi } from 'vitest';
import { requireAuth, requireAdmin, verifyUserToken, type AuthenticatedRequest } from '../api/middleware/auth.js';
import { ChatMessageSchema, CreatePaymentRequestSchema } from '../api/validation/schemas.js';

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
});
