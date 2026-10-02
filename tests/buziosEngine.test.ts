import { describe, it, expect } from 'vitest';
import { throwBuzios, MERINDILOGUN_ODUS } from '../src/oraculos/buziosEngine.js';

describe('Búzios Engine (Requisitos 28, 88)', () => {
  it('deve realizar um lançamento com 16 búzios', () => {
    const result = throwBuzios();
    expect(result.openCount + result.closedCount).toBe(16);
    expect(result.openCount).toBeGreaterThanOrEqual(0);
    expect(result.openCount).toBeLessThanOrEqual(16);
    expect(result.shellsOpenIndices.length).toBe(result.openCount);
    expect(result.shellsClosedIndices.length).toBe(result.closedCount);
  });

  it('deve mapear corretamente o número de búzios abertos para o Odù correspondente', () => {
    const result = throwBuzios();
    const expectedOdu = MERINDILOGUN_ODUS[result.openCount];
    expect(result.oduName).toBe(expectedOdu.name);
    expect(result.oduEnergy).toBe(expectedOdu.energy);
    expect(result.oduAdvice).toBe(expectedOdu.advice);
  });
});
