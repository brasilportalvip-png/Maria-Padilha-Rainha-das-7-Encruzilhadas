import { describe, it, expect } from 'vitest';
import { getTemporalContext, resolveTemporalReferenceInText } from '../src/oraculos/temporalEngine.js';

describe('Temporal Engine & Timezone (Requisitos 18, 19, 74)', () => {
  it('deve calcular corretamente a saudação baseada na hora local em America/Sao_Paulo', () => {
    // 09:00 UTC is 06:00 in America/Sao_Paulo (UTC-3) -> Bom dia
    const morningDate = new Date('2026-10-02T09:00:00.000Z');
    const morningCtx = getTemporalContext('America/Sao_Paulo', morningDate);
    expect(morningCtx.greeting).toBe('Bom dia');
    expect(morningCtx.periodOfDay).toBe('manha');

    // 18:00 UTC is 15:00 in America/Sao_Paulo (UTC-3) -> Boa tarde
    const afternoonDate = new Date('2026-10-02T18:00:00.000Z');
    const afternoonCtx = getTemporalContext('America/Sao_Paulo', afternoonDate);
    expect(afternoonCtx.greeting).toBe('Boa tarde');
    expect(afternoonCtx.periodOfDay).toBe('tarde');

    // 23:30 UTC is 20:30 in America/Sao_Paulo (UTC-3) -> Boa noite
    const nightDate = new Date('2026-10-02T23:30:00.000Z');
    const nightCtx = getTemporalContext('America/Sao_Paulo', nightDate);
    expect(nightCtx.greeting).toBe('Boa noite');
    expect(nightCtx.periodOfDay).toBe('noite');
  });

  it('deve resolver "amanhã" e "hoje" com base no relógio do servidor', () => {
    const fixedDate = new Date('2026-10-02T14:00:00.000Z'); // 02/10/2026
    const ctx = getTemporalContext('America/Sao_Paulo', fixedDate);

    const refAmanha = resolveTemporalReferenceInText('Tenho uma entrevista amanhã. Vai dar certo?', ctx);
    expect(refAmanha.resolvedTerm).toBe('amanhã');
    expect(refAmanha.resolvedDate).toBe(ctx.temporalExpressions.amanha);
    expect(refAmanha.resolvedDate).toBe('03/10/2026');

    const refHoje = resolveTemporalReferenceInText('Vai dar tudo certo hoje?', ctx);
    expect(refHoje.resolvedTerm).toBe('hoje');
    expect(refHoje.resolvedDate).toBe('02/10/2026');
  });
});
