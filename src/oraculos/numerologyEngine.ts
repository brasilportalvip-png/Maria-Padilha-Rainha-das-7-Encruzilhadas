import type { NumerologyResult } from '../types/spiritual.js';

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
  const digits = String(birthDate || '').replace(/[^\d]/g, '');

  if (birthDate.includes('-')) {
    const parts = birthDate.split('-');
    if (parts.length >= 3) {
      return {
        year: parseInt(parts[0], 10) || 2000,
        month: parseInt(parts[1], 10) || 1,
        day: parseInt(parts[2], 10) || 1,
      };
    }
  }

  if (birthDate.includes('/')) {
    const parts = birthDate.split('/');
    if (parts.length >= 3) {
      return {
        day: parseInt(parts[0], 10) || 1,
        month: parseInt(parts[1], 10) || 1,
        year: parseInt(parts[2], 10) || 2000,
      };
    }
  }

  // Fallback to substring
  if (digits.length >= 8) {
    const d = parseInt(digits.substring(0, 2), 10) || 1;
    const m = parseInt(digits.substring(2, 4), 10) || 1;
    const y = parseInt(digits.substring(4, 8), 10) || 2000;
    return { day: d, month: m, year: y };
  }

  return { day: 1, month: 1, year: 2000 };
}

export function calculateNumerology(fullName: string, birthDate: string): NumerologyResult {
  const cleanName = normalizeText(fullName);
  const { day, month, year } = parseBirthDateParts(birthDate);

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
    33: 'Número Mestre do amor incondicional, guia espiritual abnegado e elevação da consciência humana.'
  };

  return {
    lifePathNumber,
    expressionNumber,
    soulUrgeNumber,
    karmicLessonNumber,
    summary: summaries[lifePathNumber] || summaries[1],
    strengths: [
      `Forte vibração no número ${lifePathNumber}, trazendo poder de manifestação coerente.`,
      `Expressão ${expressionNumber} favorece impacto marcante no ambiente em que atua.`,
      `Desejo da alma ${soulUrgeNumber} guia escolhas autênticas quando alinhadas com a verdade interior.`
    ],
    challenges: [
      `Vigiar a tendência de carregar cobranças desnecessárias em momentos de transição.`,
      `Harmonizar a pressa do ego com o tempo de maturação cármica da alma.`
    ]
  };
}
