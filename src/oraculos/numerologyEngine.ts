import type { NumerologyResult } from '../types/spiritual.js';
import { parseAndValidateDate } from '../utils/dateNormalizer.js';

const PYTHAGOREAN_TABLE: Record<string, number> = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9,
};

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

function normalizeText(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');
}

export function reduceToSingleOrMaster(num: number): number {
  let current = Math.abs(num);
  while (current > 9 && current !== 11 && current !== 22 && current !== 33) {
    current = String(current)
      .split('')
      .reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return current || 1;
}

export function parseBirthDateParts(birthDate: string): { day: number; month: number; year: number } {
  const { day, month, year } = parseAndValidateDate(birthDate);
  return { day, month, year };
}

/**
 * Calculates current Personal Year (Ano Pessoal) deterministically:
 * Reduced Day of Birth + Reduced Month of Birth + Reduced Current Year
 */
export function calculatePersonalYear(birthDate: string, currentYear?: number): number {
  const { day, month } = parseAndValidateDate(birthDate);
  const targetYear = currentYear || new Date().getFullYear();

  const daySum = reduceToSingleOrMaster(day);
  const monthSum = reduceToSingleOrMaster(month);
  const yearSum = reduceToSingleOrMaster(
    String(targetYear)
      .split('')
      .reduce((acc, n) => acc + parseInt(n, 10), 0)
  );

  return reduceToSingleOrMaster(daySum + monthSum + yearSum);
}

export function calculateNumerology(fullName: string, birthDate: string, currentYear?: number): NumerologyResult {
  const cleanName = normalizeText(fullName);
  const { day, month, year } = parseAndValidateDate(birthDate);

  // 1. Life Path (Caminho de Vida)
  const daySum = reduceToSingleOrMaster(day);
  const monthSum = reduceToSingleOrMaster(month);
  const yearSum = reduceToSingleOrMaster(
    String(year)
      .split('')
      .reduce((acc, n) => acc + parseInt(n, 10), 0)
  );

  const lifePathNumber = reduceToSingleOrMaster(daySum + monthSum + yearSum);

  // 2. Expression Number (Número de Expressão / Destino)
  let expressionTotal = 0;
  let soulUrgeTotal = 0;

  for (const char of cleanName) {
    const val = PYTHAGOREAN_TABLE[char] || 0;
    expressionTotal += val;
    if (VOWELS.has(char)) {
      soulUrgeTotal += val;
    }
  }

  const expressionNumber = reduceToSingleOrMaster(expressionTotal || 1);
  const soulUrgeNumber = reduceToSingleOrMaster(soulUrgeTotal || 1);
  const karmicLessonNumber = reduceToSingleOrMaster(Math.abs(lifePathNumber - expressionNumber));
  const personalYear = calculatePersonalYear(birthDate, currentYear);

  const summaries: Record<number, string> = {
    1: 'Estrada da liderança pioneira, independência, iniciativa e coragem de desbravar o desconhecido.',
    2: 'Estrada da diplomacia, equilíbrio, parcerias leais, sensibilidade e conciliação pacífica.',
    3: 'Estrada da comunicação brilhante, expressão artística, criatividade, magnetismo social e alegria.',
    4: 'Estrada da construção sólida, ordem, disciplina, trabalho honesto e segurança material duradoura.',
    5: 'Estrada da liberdade, transformação rápida, versatilidade, curiosidade e capacidade de adaptação.',
    6: 'Estrada do afeto acolhedor, responsabilidade com o lar, harmonia familiar, justiça e cura.',
    7: 'Estrada da busca espiritual profunda, sabedoria analítica, estudo dos mistérios e intuição refinada.',
    8: 'Estrada do poder de realização material, justiça prática, visão estratégica, autoridade e prosperidade.',
    9: 'Estrada do amor universal, sabedoria generosa, conclusão de grandes ciclos e desprendimento nobre.',
    11: 'Número Mestre da intuição transcendental, canalização espiritual, iluminação e inspiração de almas.',
    22: 'Número Mestre do grande construtor, poder de erguer projetos grandiosos que beneficiam o coletivo.',
    33: 'Número Mestre do amor incondicional, guia espiritual abnegado e elevação da consciência humana.',
  };

  return {
    lifePathNumber,
    expressionNumber,
    soulUrgeNumber,
    karmicLessonNumber,
    personalYear,
    summary: summaries[lifePathNumber] || summaries[1],
    strengths: [
      `Forte vibração no número ${lifePathNumber}, trazendo poder de manifestação coerente.`,
      `Expressão ${expressionNumber} favorece impacto marcante no ambiente em que atua.`,
      `Desejo da alma ${soulUrgeNumber} guia escolhas autênticas quando alinhadas com a verdade interior.`,
    ],
    challenges: [
      `Vigiar a tendência de carregar cobranças desnecessárias em momentos de transição.`,
      `Harmonizar a pressa do ego com o tempo de maturação cármica da alma.`,
    ],
  };
}
