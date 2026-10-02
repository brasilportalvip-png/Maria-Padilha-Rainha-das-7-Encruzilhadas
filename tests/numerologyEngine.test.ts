import { describe, it, expect } from 'vitest';
import { calculateNumerology, reduceToSingleOrMaster } from '../src/oraculos/numerologyEngine.js';

describe('Numerology Deterministic Engine (Requisitos 30, 88)', () => {
  it('deve reduzir números preservando números mestres 11, 22, 33', () => {
    expect(reduceToSingleOrMaster(11)).toBe(11);
    expect(reduceToSingleOrMaster(22)).toBe(22);
    expect(reduceToSingleOrMaster(33)).toBe(33);
    expect(reduceToSingleOrMaster(15)).toBe(6); // 1 + 5 = 6
    expect(reduceToSingleOrMaster(29)).toBe(11); // 2 + 9 = 11 (Master)
  });

  it('deve calcular de forma estritamente determinística o Caminho de Vida e Expressão', () => {
    const res1 = calculateNumerology('Maria Padilha', '15/05/1990');
    const res2 = calculateNumerology('Maria Padilha', '15/05/1990');

    // Deterministic: Identical inputs MUST yield identical outputs
    expect(res1.lifePathNumber).toBe(res2.lifePathNumber);
    expect(res1.expressionNumber).toBe(res2.expressionNumber);
    expect(res1.soulUrgeNumber).toBe(res2.soulUrgeNumber);
    expect(res1.summary).toBe(res2.summary);
  });
});
