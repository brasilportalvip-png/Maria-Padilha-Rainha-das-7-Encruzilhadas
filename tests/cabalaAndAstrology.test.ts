import { describe, it, expect } from 'vitest';
import { calculateCabala } from '../src/oraculos/cabalaEngine.js';
import { calculateAstrology } from '../src/oraculos/astrologyEngine.js';

describe('Cabala & Astrologia Deterministic Oracles (Requisitos 29, 30, 31)', () => {
  it('calculateCabala deve calcular de forma determinística a Sephirah e o Anjo Guardião', () => {
    const res1 = calculateCabala('1985-04-12');
    const res2 = calculateCabala('1985-04-12');

    expect(res1).toEqual(res2);
    expect(res1.sephirahNumber).toBeGreaterThanOrEqual(1);
    expect(res1.sephirahNumber).toBeLessThanOrEqual(10);
    expect(res1.sephirahName).toBeDefined();
    expect(res1.rulingArchangel).toBeDefined();
    expect(res1.guardianAngel.number).toBeGreaterThanOrEqual(1);
    expect(res1.guardianAngel.number).toBeLessThanOrEqual(72);
    expect(res1.guardianAngel.name).toBeDefined();
    expect(res1.methodVersion).toBe('Cabala-Hermetica-72-Anjos-v1');
    expect(res1.spiritualGuidance).toContain(res1.sephirahName);
  });

  it('calculateAstrology deve calcular determinísticamente o Signo Solar, Fase Lunar e Hora Planetária', () => {
    const astro1 = calculateAstrology('1990-03-25', '14:30');
    const astro2 = calculateAstrology('1990-03-25', '14:30');

    expect(astro1).toEqual(astro2);
    expect(astro1.sunSign).toBe('Áries');
    expect(astro1.element).toBe('Fogo');
    expect(astro1.modality).toBe('Cardinal');
    expect(astro1.lunarPhase).toBeDefined();
    expect(astro1.planetaryHourRuler).toBeDefined();
    expect(astro1.methodVersion).toBe('Astrologia-Horaria-Calc-v1');
  });

  it('diferentes datas devem gerar signos e cálculos consistentes', () => {
    const touro = calculateAstrology('1990-05-10', '08:00');
    expect(touro.sunSign).toBe('Touro');
    expect(touro.element).toBe('Terra');

    const peixes = calculateAstrology('1990-03-05', '22:00');
    expect(peixes.sunSign).toBe('Peixes');
    expect(peixes.element).toBe('Água');
  });
});
