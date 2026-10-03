import { calculateNumerology } from './numerologyEngine.js';
import { calculateCabala, type CabalaResult } from './cabalaEngine.js';
import { calculateAstrology, type AstrologyResult } from './astrologyEngine.js';
import { drawTarotCards } from './tarotEngine.js';
import { parseAndValidateDate } from '../utils/dateNormalizer.js';
import type { NumerologyResult, TarotDrawPosition } from '../types/spiritual.js';

export interface PersonSpiritualProfileData {
  name: string;
  birthDate: string;
  birthTime?: string | null;
  numerology: NumerologyResult;
  cabala: CabalaResult;
  astrology: AstrologyResult;
}

export interface LoveSynastryReport {
  person1: PersonSpiritualProfileData;
  person2: PersonSpiritualProfileData;
  elementalDynamic: {
    element1: string;
    element2: string;
    description: string;
    harmonyType: 'harmonica' | 'complementar' | 'desafiadora_transformadora';
  };
  numerologicalResonance: {
    lifePath1: number;
    lifePath2: number;
    resonanceScore: number;
    relationshipVibration: string;
    karmicLessonShared: string;
  };
  cabalisticAlignment: {
    sefira1: string;
    sefira2: string;
    pillarDynamic: string;
    spiritualBondLevel: string;
  };
  tarotSpread: TarotDrawPosition[];
  qualitativeIndicators: {
    spiritualAffinity: {
      label: string;
      level: 'Alta' | 'Muito Alta' | 'Transformadora' | 'Moderada';
      index: number;
    };
    emotionalResonance: {
      label: string;
      level: 'Profunda' | 'Magnética' | 'Em Construção' | 'Intensa';
      index: number;
    };
    practicalHarmony: {
      label: string;
      level: 'Sólida' | 'Dinâmica' | 'Exige Diálogo' | 'Evolutiva';
      index: number;
    };
  };
  overallSynthesis: string;
}

// Elemental relationship rules
function analyzeElements(el1: string, el2: string): {
  description: string;
  harmonyType: 'harmonica' | 'complementar' | 'desafiadora_transformadora';
  elementScore: number;
} {
  const e1 = el1.toLowerCase();
  const e2 = el2.toLowerCase();

  if (e1 === e2) {
    return {
      description: `Ambos compartilham o elemento ${el1}, gerando compreensão imediata e afinidade natural de vibração, com o cuidado de não intensificar excessos mútuos.`,
      harmonyType: 'harmonica',
      elementScore: 88,
    };
  }

  const complementary =
    (e1 === 'fogo' && e2 === 'ar') ||
    (e1 === 'ar' && e2 === 'fogo') ||
    (e1 === 'terra' && e2 === 'água') ||
    (e1 === 'água' && e2 === 'terra');

  if (complementary) {
    return {
      description: `Combinação sinérgica de ${el1} e ${el2}: enquanto um nutre ou sopra inspiração, o outro ancora ou expande a chama do amor.`,
      harmonyType: 'complementar',
      elementScore: 92,
    };
  }

  return {
    description: `Encontro dinâmico entre ${el1} e ${el2}: polos magnéticos distintos que convidam ambos ao amadurecimento, flexibilidade e transcendência do ego.`,
    harmonyType: 'desafiadora_transformadora',
    elementScore: 74,
  };
}

// Numerological Life Path Resonance Matrix
function analyzeLifePaths(lp1: number, lp2: number): {
  score: number;
  vibration: string;
  karmicLesson: string;
} {
  const pair = [lp1, lp2].sort((a, b) => a - b).join('-');
  const resonanceScores: Record<string, number> = {
    '1-1': 82, '1-2': 86, '1-3': 90, '1-4': 76, '1-5': 88, '1-6': 80, '1-7': 84, '1-8': 80, '1-9': 85,
    '2-2': 90, '2-3': 82, '2-4': 92, '2-5': 74, '2-6': 95, '2-7': 86, '2-8': 89, '2-9': 84,
    '3-3': 88, '3-4': 72, '3-5': 92, '3-6': 91, '3-7': 79, '3-8': 83, '3-9': 94,
    '4-4': 86, '4-5': 70, '4-6': 90, '4-7': 84, '4-8': 92, '4-9': 75,
    '5-5': 91, '5-6': 77, '5-7': 89, '5-8': 79, '5-9': 87,
    '6-6': 94, '6-7': 80, '6-8': 88, '6-9': 96,
    '7-7': 92, '7-8': 81, '7-9': 90,
    '8-8': 85, '8-9': 83,
    '9-9': 93,
  };

  const baseScore = resonanceScores[pair] || 80;
  const vibration = `Vibração ${lp1} & ${lp2}: Laço com potencial de crescimento mútuo e propósito sagrado.`;
  const karmicLesson = `Cultivar a paciência ativa e valorizar as diferenças como caminhos de enriquecimento da alma.`;

  return { score: baseScore, vibration, karmicLesson };
}

export function calculateLoveSynastry(params: {
  name1: string;
  birthDate1: string;
  birthTime1?: string | null;
  name2: string;
  birthDate2: string;
  birthTime2?: string | null;
  existingTarotSpread?: TarotDrawPosition[];
}): LoveSynastryReport {
  const { name1, birthDate1, birthTime1, name2, birthDate2, birthTime2, existingTarotSpread } = params;

  // Validate dates with canonical normalizer
  const dateNorm1 = parseAndValidateDate(birthDate1);
  const dateNorm2 = parseAndValidateDate(birthDate2);

  // 1. Calculate individual spiritual maps (strictly optional hour)
  const num1 = calculateNumerology(name1, dateNorm1.isoDate);
  const cab1 = calculateCabala(dateNorm1.isoDate);
  const ast1 = calculateAstrology(dateNorm1.isoDate, birthTime1 || null);

  const num2 = calculateNumerology(name2, dateNorm2.isoDate);
  const cab2 = calculateCabala(dateNorm2.isoDate);
  const ast2 = calculateAstrology(dateNorm2.isoDate, birthTime2 || null);

  const person1: PersonSpiritualProfileData = {
    name: name1,
    birthDate: dateNorm1.isoDate,
    birthTime: birthTime1 || null,
    numerology: num1,
    cabala: cab1,
    astrology: ast1,
  };

  const person2: PersonSpiritualProfileData = {
    name: name2,
    birthDate: dateNorm2.isoDate,
    birthTime: birthTime2 || null,
    numerology: num2,
    cabala: cab2,
    astrology: ast2,
  };

  // 2. Cross analysis
  const elemental = analyzeElements(ast1.element, ast2.element);
  const numRes = analyzeLifePaths(num1.lifePathNumber, num2.lifePathNumber);

  // Cabalistic interaction
  const cabDiff = Math.abs(cab1.sephirahNumber - cab2.sephirahNumber);
  let cabScore = 80;
  let pillarDynamic = 'Encontro equilibrado entre esferas da Árvore da Vida';
  if (cab1.sephirahNumber === cab2.sephirahNumber) {
    cabScore = 94;
    pillarDynamic = `Ambos ancorados na mesma esfera (${cab1.sephirahName}): ressonância de alma idêntica.`;
  } else if (cabDiff <= 2) {
    cabScore = 89;
    pillarDynamic = `Esferas vizinhas (${cab1.sephirahName} e ${cab2.sephirahName}): transição harmônica de luz.`;
  } else {
    cabScore = 77;
    pillarDynamic = `Pólos complementares (${cab1.sephirahName} e ${cab2.sephirahName}): atração magnética de opostos.`;
  }

  // 3. Single authoritative Tarot draw: use existing if provided, else draw 3 real cards
  let tarotCards: TarotDrawPosition[];
  if (existingTarotSpread && existingTarotSpread.length >= 3) {
    tarotCards = existingTarotSpread;
  } else {
    tarotCards = drawTarotCards(3);
    if (tarotCards[0]) tarotCards[0].label = 'Raiz Cármica e Origem da Ligação';
    if (tarotCards[1]) tarotCards[1].label = 'Momento Presente e Dinâmica Energética';
    if (tarotCards[2]) tarotCards[2].label = 'Tendência Futura e Conselho de Maria Padilha';
  }

  // 4. Authentic qualitative indices derived deterministically from spiritual foundations
  const spiritualIndex = Math.min(97, Math.max(65, Math.round((cabScore * 0.6) + (numRes.score * 0.4))));
  const emotionalIndex = Math.min(96, Math.max(62, Math.round((elemental.elementScore * 0.55) + (numRes.score * 0.45))));
  const practicalIndex = Math.min(95, Math.max(60, Math.round(((num1.expressionNumber + num2.expressionNumber) % 15) + 80)));

  const spiritualAffinityLevel = spiritualIndex >= 88 ? 'Muito Alta' : spiritualIndex >= 78 ? 'Alta' : 'Transformadora';
  const emotionalResonanceLevel = emotionalIndex >= 88 ? 'Profunda' : emotionalIndex >= 78 ? 'Magnética' : 'Intensa';
  const practicalHarmonyLevel = practicalIndex >= 85 ? 'Sólida' : practicalIndex >= 75 ? 'Dinâmica' : 'Evolutiva';

  const overallSynthesis = `A sinastria entre ${name1} (${ast1.sunSign}, Caminho ${num1.lifePathNumber}) e ${name2} (${ast2.sunSign}, Caminho ${num2.lifePathNumber}) revela uma conexão sob o manto de ${cab1.sephirahName} e ${cab2.sephirahName}. A dinâmica dos elementos (${ast1.element} com ${ast2.element}) indica ${elemental.description} As cartas sagradas (${tarotCards.map(c => c.card.name).join(', ')}) apontam que o destino deste encontro se cumpre através da lealdade e da transparência.`;

  return {
    person1,
    person2,
    elementalDynamic: {
      element1: ast1.element,
      element2: ast2.element,
      description: elemental.description,
      harmonyType: elemental.harmonyType,
    },
    numerologicalResonance: {
      lifePath1: num1.lifePathNumber,
      lifePath2: num2.lifePathNumber,
      resonanceScore: numRes.score,
      relationshipVibration: numRes.vibration,
      karmicLessonShared: numRes.karmicLesson,
    },
    cabalisticAlignment: {
      sefira1: cab1.sephirahName,
      sefira2: cab2.sephirahName,
      pillarDynamic,
      spiritualBondLevel: cabScore >= 85 ? 'Elevado laço de alma' : 'Encontro cármico de aprendizado',
    },
    tarotSpread: tarotCards,
    qualitativeIndicators: {
      spiritualAffinity: {
        label: `Afinidade Espiritual: ${spiritualAffinityLevel}`,
        level: spiritualAffinityLevel,
        index: spiritualIndex,
      },
      emotionalResonance: {
        label: `Ressonância Afetiva: ${emotionalResonanceLevel}`,
        level: emotionalResonanceLevel,
        index: emotionalIndex,
      },
      practicalHarmony: {
        label: `Harmonia Prática: ${practicalHarmonyLevel}`,
        level: practicalHarmonyLevel,
        index: practicalIndex,
      },
    },
    overallSynthesis,
  };
}
