import { describe, it, expect } from 'vitest';
import { classifyIntent } from '../src/oraculos/intentClassifier.js';

describe('Universal Intent Classifier (Requisitos Críticos 21, 22, 73)', () => {
  it('CASO 1: "Estou abrindo sociedade com Carlos. Teremos sucesso?" deve ser classificado como BUSINESS/PARTNERSHIP, NUNCA LOVE', () => {
    const question = 'Estou abrindo sociedade com Carlos. Teremos sucesso?';
    const result = classifyIntent(question);

    expect(result.isRomantic).toBe(false);
    expect(result.isBusinessOrCareer).toBe(true);
    expect(['sociedade', 'negocios']).toContain(result.primaryCategory);
    expect(result.participants.some((p) => p.name.includes('Carlos') && p.role === 'socio')).toBe(true);
  });

  it('CASO 2: "Maria vai conseguir emprego?" deve ser classificado como CAREER/EMPLOYMENT, NUNCA LOVE', () => {
    const question = 'Maria vai conseguir emprego?';
    const result = classifyIntent(question);

    expect(result.isRomantic).toBe(false);
    expect(result.isBusinessOrCareer).toBe(true);
    expect(result.primaryCategory).toBe('emprego');
  });

  it('CASO 3: "Maria ainda me ama?" deve ser classificado como LOVE/RELATIONSHIP', () => {
    const question = 'Maria ainda me ama?';
    const result = classifyIntent(question);

    expect(result.isRomantic).toBe(true);
    expect(result.isBusinessOrCareer).toBe(false);
    expect(['amor', 'relacionamento']).toContain(result.primaryCategory);
  });

  it('CASO 4: "Meu irmão vai melhorar no trabalho?" deve ser classificado como FAMILY + CAREER, NUNCA LOVE', () => {
    const question = 'Meu irmão vai melhorar no trabalho?';
    const result = classifyIntent(question);

    expect(result.isRomantic).toBe(false);
    expect(result.isBusinessOrCareer).toBe(true);
    expect(['familia', 'emprego']).toContain(result.primaryCategory);
  });

  it('Não deve acionar comparação amorosa quando for apenas parceria com data de nascimento', () => {
    const question = 'Estou abrindo sociedade com Flavio Roberto Ortiz Costa, 02/02/1983. Teremos sucesso?';
    const result = classifyIntent(question);

    expect(result.isRomantic).toBe(false);
    expect(result.isBusinessOrCareer).toBe(true);
    expect(result.participants.some((p) => p.name.includes('Flavio') && p.birthDate === '02/02/1983')).toBe(true);
  });

  it('PARTE 19 - "João Rogério Braga 13/08/1967 vai arrumar emprego?" -> EMPLOYMENT, NUNCA LOVE', () => {
    const question = 'João Rogério Braga 13/08/1967 vai arrumar emprego?';
    const result = classifyIntent(question);

    expect(result.isRomantic).toBe(false);
    expect(result.isBusinessOrCareer).toBe(true);
    expect(result.primaryCategory).toBe('emprego');
    expect(result.participants.some((p) => p.name.includes('João') && p.birthDate === '13/08/1967')).toBe(true);
  });

  it('PARTE 19 - "Minha irmã e eu devemos abrir uma loja?" -> FAMILY + BUSINESS, NUNCA LOVE', () => {
    const question = 'Minha irmã e eu devemos abrir uma loja?';
    const result = classifyIntent(question);

    expect(result.isRomantic).toBe(false);
    expect(result.isBusinessOrCareer).toBe(true);
    expect(['sociedade', 'negocios', 'familia']).toContain(result.primaryCategory);
  });

  it('PARTE 19 - "Carlos ainda me ama?" -> LOVE', () => {
    const question = 'Carlos ainda me ama?';
    const result = classifyIntent(question);

    expect(result.isRomantic).toBe(true);
    expect(result.primaryCategory).toBe('amor');
  });

  it('PARTE 19 - "Meu ex vai voltar?" -> RECONCILIATION', () => {
    const question = 'Meu ex vai voltar?';
    const result = classifyIntent(question);

    expect(result.isRomantic).toBe(true);
    expect(result.primaryCategory).toBe('reconciliacao');
  });

  it('deve classificar "Minha irmã Ana vai conseguir emprego?" como familia/emprego, NUNCA amor', () => {
    const question = 'Minha irmã Ana vai conseguir emprego?';
    const result = classifyIntent(question);

    expect(result.isRomantic).toBe(false);
    expect(result.isBusinessOrCareer).toBe(true);
    expect(['familia', 'emprego']).toContain(result.primaryCategory);
    expect(result.participants.some((p) => p.name.includes('Ana') && p.role === 'familiar')).toBe(true);
  });

  it('deve classificar "Roberto ainda me ama e existe reconciliação?" como amor/reconciliação', () => {
    const question = 'Roberto ainda me ama e existe reconciliação?';
    const result = classifyIntent(question);

    expect(result.isRomantic).toBe(true);
    expect(['amor', 'reconciliacao', 'relacionamento']).toContain(result.primaryCategory);
  });

  it('deve classificar "Meu chefe Carlos vai aprovar meu projeto?" como trabalho/negócios, NUNCA amor', () => {
    const question = 'Meu chefe Carlos vai aprovar meu projeto?';
    const result = classifyIntent(question);

    expect(result.isRomantic).toBe(false);
    expect(result.isBusinessOrCareer).toBe(true);
    expect(['emprego', 'negocios', 'sociedade']).toContain(result.primaryCategory);
    expect(result.participants.some((p) => p.name.includes('Carlos'))).toBe(true);
  });

  it('não deve atribuir a mesma data a todas as pessoas quando houver múltiplas pessoas com datas distintas', () => {
    const question = 'Estou em sociedade com João 10/02/1980 e Carlos 15/04/1975. Vamos prosperar?';
    const result = classifyIntent(question);

    expect(result.isRomantic).toBe(false);
    const joao = result.participants.find((p) => p.name.includes('João'));
    const carlos = result.participants.find((p) => p.name.includes('Carlos'));

    expect(joao?.birthDate).toBe('10/02/1980');
    expect(carlos?.birthDate).toBe('15/04/1975');
  });
});
