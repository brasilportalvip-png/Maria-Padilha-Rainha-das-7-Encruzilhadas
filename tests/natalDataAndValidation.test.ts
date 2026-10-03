import { describe, it, expect } from 'vitest';
import { parseAndValidateDate, isValidDateString } from '../src/utils/dateNormalizer.js';
import { calculateAstrology } from '../src/oraculos/astrologyEngine.js';
import { RegisterRequestSchema } from '../serverlib/validation/schemas.js';

describe('Regra dos Dados Natais & Date Normalizer (P0 / Produção)', () => {
  it('deve aceitar datas estritas nos formatos YYYY-MM-DD e DD/MM/AAAA', () => {
    const d1 = parseAndValidateDate('1983-02-02');
    expect(d1).toEqual({ year: 1983, month: 2, day: 2, isoDate: '1983-02-02' });

    const d2 = parseAndValidateDate('02/02/1983');
    expect(d2).toEqual({ year: 1983, month: 2, day: 2, isoDate: '1983-02-02' });

    const d3 = parseAndValidateDate('2000-02-29');
    expect(d3).toEqual({ year: 2000, month: 2, day: 29, isoDate: '2000-02-29' });
  });

  it('deve rejeitar datas impossíveis e não inventar dias ou meses silenciosamente', () => {
    expect(() => parseAndValidateDate('1983-02-30')).toThrow(/Dia inválido/);
    expect(() => parseAndValidateDate('31/02/1985')).toThrow(/Dia inválido/);
    expect(() => parseAndValidateDate('1900-02-29')).toThrow(/Dia inválido/); // 1900 não foi bissexto
    expect(() => parseAndValidateDate('')).toThrow(/obrigatória/);
    expect(() => parseAndValidateDate('data-invalida')).toThrow(/Formato de data inválido/);

    expect(isValidDateString('31/02/1990')).toBe(false);
    expect(isValidDateString('15/08/1990')).toBe(true);
  });

  it('astrologia sem hora deve marcar hora como desconhecida sem inventar 00:00 ou 12:00', () => {
    const astroSemHora = calculateAstrology('1983-02-02', undefined);
    expect(astroSemHora.hourKnown).toBe(false);
    expect(astroSemHora.planetaryHourRuler).toBeNull();
    expect(astroSemHora.sunSign).toBe('Aquário');

    const astroComHora = calculateAstrology('1983-02-02', '14:30');
    expect(astroComHora.hourKnown).toBe(true);
    expect(astroComHora.planetaryHourRuler).toBeDefined();
    expect(typeof astroComHora.planetaryHourRuler).toBe('string');
  });

  it('RegisterRequestSchema não exige cidade e aceita hora de nascimento opcional', () => {
    const validDataSemHora = {
      email: 'maria.consulente@example.com',
      password: 'SenhaForte123@Segura',
      fullName: 'Maria da Silva',
      birthDate: '1985-05-15',
    };

    const parsed = RegisterRequestSchema.safeParse(validDataSemHora);
    expect(parsed.success).toBe(true);

    const validDataComHora = {
      ...validDataSemHora,
      birthTime: '08:45',
    };
    const parsedComHora = RegisterRequestSchema.safeParse(validDataComHora);
    expect(parsedComHora.success).toBe(true);
  });
});
