import crypto from 'crypto';
import { firestore } from '../_firebaseAdmin.js';
import { calculateNumerology } from '../../src/oraculos/numerologyEngine.js';
import { calculateCabala } from '../../src/oraculos/cabalaEngine.js';
import { calculateAstrology } from '../../src/oraculos/astrologyEngine.js';
import { getTemporalContext } from '../../src/oraculos/temporalEngine.js';
import { classifyIntent } from '../../src/oraculos/intentClassifier.js';
import { logger } from './logger.js';
import type {
  UserProfile,
  PermanentSpiritualProfile,
  LivingSpiritualHistory,
  NatalData,
} from '../../src/types/spiritual.js';

// In-memory fallback for test environment
const testSpiritualProfiles = new Map<string, PermanentSpiritualProfile>();
const testSpiritualHistories = new Map<string, LivingSpiritualHistory>();

function getRulingPlanet(sunSign: string): string {
  const signRulers: Record<string, string> = {
    'Áries': 'Marte',
    'Touro': 'Vênus',
    'Gêmeos': 'Mercúrio',
    'Câncer': 'Lua',
    'Leão': 'Sol',
    'Virgem': 'Mercúrio',
    'Libra': 'Vênus',
    'Escorpião': 'Marte',
    'Sagitário': 'Júpiter',
    'Capricórnio': 'Saturno',
    'Aquário': 'Saturno',
    'Peixes': 'Júpiter',
  };

  return signRulers[sunSign] || 'Sol';
}

export function generateNatalSignature(natal: {
  fullName: string;
  birthDate: string;
  birthTime?: string;
  city?: string;
}): string {
  const norm = `${(natal.fullName || '').trim().toLowerCase()}|${(natal.birthDate || '').trim()}|${(natal.birthTime || '').trim()}|${(natal.city || '').trim().toLowerCase()}`;
  return crypto.createHash('sha256').update(norm).digest('hex');
}

/**
 * Derives archetypal resonance, karmic patterns, and Pombo Gira affinity
 * deterministically from calculated numerology, astrology, and cabala.
 */
function deriveArchetypesAndKarmicPatterns(
  numerology: ReturnType<typeof calculateNumerology>,
  cabala: ReturnType<typeof calculateCabala>,
  astrology: ReturnType<typeof calculateAstrology>
) {
  const lp = numerology.lifePathNumber;
  const sun = astrology.sunSign.toLowerCase();

  let pomboGiraAffinity = 'Maria Padilha Rainha das 7 Encruzilhadas';
  let primaryArchetype = 'A Guardiã Soberana dos Caminhos';
  let shadowArchetype = 'O Orgulho e a Ansiedade de Controle';
  let soulMission = 'Harmonizar poder pessoal, discernimento espiritual e lealdade ao próprio destino.';
  let relationshipDynamic = 'Busca reciprocidade profunda, tolerando pouco joguetes ou falsidade emocional.';

  if (lp === 1 || sun.includes('áries') || sun.includes('leão')) {
    pomboGiraAffinity = 'Maria Padilha da Estrada e do Fogo';
    primaryArchetype = 'A Pioneira Corajosa e Desbravadora';
    shadowArchetype = 'Impulsividade e Impaciência com o Tempo dos Outros';
    soulMission = 'Liderar com retidão moral e abrir clareiras onde outros recuam.';
    relationshipDynamic = 'Intensidade magnética que necessita de espaço e admiração mútua sincera.';
  } else if (lp === 2 || lp === 6 || sun.includes('touro') || sun.includes('câncer') || sun.includes('libra')) {
    pomboGiraAffinity = 'Maria Padilha do Cruzeiro e das Almas';
    primaryArchetype = 'A Pacificadora Amorosa e Protetora dos Laços';
    shadowArchetype = 'Apego excessivo, dependência de aprovação e mágoa guardada';
    soulMission = 'Curar feridas do coração e ancorar harmonia nos relacionamentos.';
    relationshipDynamic = 'Devoção afetiva e necessidade de segurança emocional inegociável.';
  } else if (lp === 3 || lp === 5 || sun.includes('gêmeos') || sun.includes('sagitário') || sun.includes('aquário')) {
    pomboGiraAffinity = 'Maria Padilha da Figueira e do Cabaré';
    primaryArchetype = 'A Mensageira Luminosa da Liberdade e Encanto';
    shadowArchetype = 'Dispersão de energia e hesitação em assumir compromissos perenes';
    soulMission = 'Inspirar entusiasmo, quebrar prisões mentais e comunicar verdades.';
    relationshipDynamic = 'Afinidade através de trocas intelectuais ricas e entusiasmo recíproco.';
  } else if (lp === 4 || lp === 7 || lp === 8 || lp === 9 || lp === 11 || lp === 22 || sun.includes('virgem') || sun.includes('escorpião') || sun.includes('capricórnio') || sun.includes('peixes')) {
    pomboGiraAffinity = 'Maria Padilha Rainha dos 7 Cruzeiros da Calunga';
    primaryArchetype = 'A Mística Silenciosa e Estrategista da Sabedoria Oculta';
    shadowArchetype = 'Isolamento defensivo, ceticismo excessivo ou rigor implacável';
    soulMission = 'Construir bases indestrutíveis e revelar o propósito sagrado por trás dos ciclos.';
    relationshipDynamic = 'Lealdade eterna e exigência de integridade espiritual sem subterfúgios.';
  }

  const recurrentLessons = [
    `Equilibrar a força de ${cabala.sephirahName} com a virtude de ${cabala.guardianAngel.virtue}.`,
    `Superar o desafio numerológico do caminho ${lp} sem ceder à vitimização.`,
    `Aprender a discernir entre intuição genuína e projeções da carência afetiva.`,
  ];

  const reincarnationThemes = [
    `Resgate de compromissos kármicos assumidos sob a égide de ${getRulingPlanet(astrology.sunSign)}.`,
    `Transformação de antigas mágoas em autoridade e liderança espiritual compassiva.`,
    `Alinhamento das escolhas materiais com o propósito primordial da alma.`,
  ];

  const personalityPatterns = [
    `Inteligência perceptiva aguçada sob o regente ${getRulingPlanet(astrology.sunSign)}.`,
    `Sensibilidade às vibrações do ambiente e forte ligação com a ancestralidade.`,
    `Resistência perseverante diante de obstáculos que desanimam pessoas comuns.`,
  ];

  const relationshipPatterns = [
    relationshipDynamic,
    `Necessidade de transparência radical na comunicação do casal.`,
    `Vulnerabilidade seletiva: demora para entregar o coração, mas quando entrega é por inteiro.`,
  ];

  const spiritualStrengths = [
    `Proteção do Arcanjo ${cabala.rulingArchangel} e auxílio do anjo ${cabala.guardianAngel.name}.`,
    `Intuição afiada e visão clara dos caminhos mais favoráveis.`,
    `Capacidade inata de resiliência e regeneração após tempestades emocionais.`,
  ];

  const spiritualChallenges = [
    `Não carregar o fardo alheio como se fosse dever exclusivo seu.`,
    `Moderar o julgamento severo quando as expectativas não são atendidas.`,
    `Silenciar o ruído mental para escutar os sussurros de Maria Padilha.`,
  ];

  return {
    pomboGiraAffinity,
    primaryArchetype,
    shadowArchetype,
    soulMission,
    relationshipDynamic,
    recurrentLessons,
    reincarnationThemes,
    personalityPatterns,
    relationshipPatterns,
    spiritualStrengths,
    spiritualChallenges,
  };
}

/**
 * Calculates or retrieves the authoritative Permanent Spiritual Profile.
 * Deterministic parts stay stable as long as natal data hasn't changed.
 * Only recalculates and bumps natalProfileVersion if natal data is explicitly modified.
 */
export async function getOrCreateSpiritualProfile(user: UserProfile): Promise<PermanentSpiritualProfile> {
  const currentSignature = generateNatalSignature({
    fullName: user.fullName,
    birthDate: user.birthDate,
    birthTime: user.birthTime,
    city: user.city,
  });

  const isTestEnv = process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);

  // Check in-memory store in tests or if Firestore is unavailable
  if (isTestEnv && testSpiritualProfiles.has(user.uid)) {
    const cached = testSpiritualProfiles.get(user.uid)!;
    if (cached.natalSignature === currentSignature) {
      return cached;
    }
  }

  // Check persistent Firestore document
  if (firestore) {
    try {
      const docRef = firestore.collection('spiritual_profiles').doc(user.uid);
      const snapshot = await docRef.get();
      if (snapshot.exists) {
        const existing = snapshot.data() as PermanentSpiritualProfile;
        if (existing.natalSignature === currentSignature) {
          if (isTestEnv) testSpiritualProfiles.set(user.uid, existing);
          return existing;
        }
      }
    } catch (err) {
      logger.warn('Failed to read spiritual_profiles from firestore, will compute fresh', err);
    }
  }

  // Natal data has changed or first calculation: Deterministic recalculation
  const numerology = calculateNumerology(user.fullName, user.birthDate);
  const cabala = calculateCabala(user.birthDate);
  const astrology = calculateAstrology(
    user.birthDate,
    user.birthTime,
    user.timezone || 'America/Sao_Paulo'
  );
  const derived = deriveArchetypesAndKarmicPatterns(numerology, cabala, astrology);

  // Check if there was an earlier version to bump
  let previousVersion = 0;
  if (isTestEnv && testSpiritualProfiles.has(user.uid)) {
    previousVersion = testSpiritualProfiles.get(user.uid)!.natalProfileVersion;
  } else if (firestore) {
    try {
      const snapshot = await firestore.collection('spiritual_profiles').doc(user.uid).get();
      if (snapshot.exists) {
        previousVersion = snapshot.data()?.natalProfileVersion || 0;
      }
    } catch {
      // ignore
    }
  }

  const newProfile: PermanentSpiritualProfile = {
    uid: user.uid,
    natalProfileVersion: previousVersion + 1,
    natalSignature: currentSignature,
    numerology: {
      lifePath: numerology.lifePathNumber,
      expression: numerology.expressionNumber,
      soulUrge: numerology.soulUrgeNumber,
      karmicLessons: numerology.karmicLessonNumber ? [numerology.karmicLessonNumber] : [],
      personalYear: (numerology as any).personalYear || 1,
      summary: numerology.summary,
    },
    cabala: {
      sephirahNumber: cabala.sephirahNumber,
      sephirahName: cabala.sephirahName,
      divineAttribute: cabala.divineAttribute,
      rulingArchangel: cabala.rulingArchangel,
      guardianAngelName: cabala.guardianAngel.name,
      guardianAngelChoir: cabala.guardianAngel.choir,
      virtue: cabala.guardianAngel.virtue,
      spiritualGuidance: cabala.spiritualGuidance,
    },
    astrology: {
      sunSign: astrology.sunSign,
      element: astrology.element,
      rulingPlanet: getRulingPlanet(astrology.sunSign),
      lunarPhase: astrology.lunarPhase,
      planetaryHour: astrology.planetaryHourRuler,
      astrologicalGuidance: astrology.cosmicAdvice,
    },
    karmicPatterns: {
      karmicLessons: derived.recurrentLessons,
      soulMission: derived.soulMission,
      relationshipDynamic: derived.relationshipDynamic,
    },
    spiritualCycles: {
      personalYear: (numerology as any).personalYear || 1,
      cycleTheme: `Ano Pessoal ${(numerology as any).personalYear || 1} regido pela energia de ${getRulingPlanet(astrology.sunSign)}`,
      spiritualPhase: `Ciclo de ${cabala.sephirahName}`,
    },
    archetypes: {
      primaryArchetype: derived.primaryArchetype,
      shadowArchetype: derived.shadowArchetype,
      pomboGiraAffinity: derived.pomboGiraAffinity,
    },
    recurrentLessons: derived.recurrentLessons,
    reincarnationThemes: derived.reincarnationThemes,
    personalityPatterns: derived.personalityPatterns,
    relationshipPatterns: derived.relationshipPatterns,
    spiritualStrengths: derived.spiritualStrengths,
    spiritualChallenges: derived.spiritualChallenges,
    updatedAt: new Date().toISOString(),
    methodVersions: {
      numerology: 'pythagorean-v2',
      cabala: 'sephiroth-72angels-v2',
      astrology: 'tropical-placidus-v2',
      archetypes: 'pombogira-guardia-v2',
    },
  };

  if (isTestEnv) {
    testSpiritualProfiles.set(user.uid, newProfile);
  }

  if (firestore) {
    try {
      await firestore.collection('spiritual_profiles').doc(user.uid).set(newProfile);
    } catch (err) {
      logger.error('Failed to save spiritual profile to Firestore', err);
    }
  }

  return newProfile;
}

/**
 * Retrieves living spiritual history (recurring themes, past readings, reported life shifts)
 */
export async function getLivingSpiritualHistory(uid: string): Promise<LivingSpiritualHistory> {
  const isTestEnv = process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);

  if (isTestEnv && testSpiritualHistories.has(uid)) {
    return testSpiritualHistories.get(uid)!;
  }

  let history: LivingSpiritualHistory = {
    uid,
    recurringThemes: [],
    importantRelations: [],
    reportedEvents: [],
    previousReadings: [],
    lifeShifts: [],
    perceivedPatterns: [],
    updatedAt: new Date().toISOString(),
  };

  if (firestore) {
    try {
      const doc = await firestore.collection('spiritual_history').doc(uid).get();
      if (doc.exists) {
        history = { ...history, ...(doc.data() as LivingSpiritualHistory) };
      }
    } catch {
      // ignore
    }
  }

  if (isTestEnv) {
    testSpiritualHistories.set(uid, history);
  }

  return history;
}

/**
 * Records a spiritual query / reading event into living spiritual history
 */
export async function recordSpiritualEvent(params: {
  uid: string;
  category?: string;
  readingId?: string;
  summary?: string;
  partnerName?: string;
  relationType?: string;
}): Promise<void> {
  const { uid, category, readingId, summary, partnerName, relationType } = params;
  const history = await getLivingSpiritualHistory(uid);

  if (category && !history.recurringThemes.includes(category)) {
    history.recurringThemes.push(category);
    if (history.recurringThemes.length > 10) history.recurringThemes.shift();
  }

  if (partnerName) {
    const existing = history.importantRelations.find(r => r.name.toLowerCase() === partnerName.toLowerCase());
    if (!existing) {
      history.importantRelations.push({
        name: partnerName,
        relationship: relationType || 'parceiro_amoroso',
        updatedAt: new Date().toISOString(),
      });
    }
  }

  if (readingId && summary) {
    history.previousReadings.unshift({
      id: readingId,
      date: new Date().toISOString(),
      oracleType: category || 'consulta',
      summary: summary.slice(0, 200),
    });
    if (history.previousReadings.length > 5) history.previousReadings.pop();
  }

  history.updatedAt = new Date().toISOString();

  const isTestEnv = process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);
  if (isTestEnv) {
    testSpiritualHistories.set(uid, history);
  }

  if (firestore) {
    try {
      await firestore.collection('spiritual_history').doc(uid).set(history, { merge: true });
    } catch {
      // ignore
    }
  }
}

/**
 * Builds the comprehensive spiritual AI prompt context:
 * 1. Consulente natal profile
 * 2. Permanent spiritual profile
 * 3. Living spiritual history
 * 4. Current date, time, timezone, temporal cycle
 * 5. Intent analysis & participants
 * 6. Partner spiritual profile (if available)
 * 7. Real oracle draw result
 * 8. Previous relevant readings
 */
export async function assembleSpiritualAIContext(params: {
  user: UserProfile;
  question: string;
  rawOracleResult?: any;
  partnerData?: { name: string; birthDate?: string; role?: string };
}): Promise<{
  systemContext: string;
  permanentProfile: PermanentSpiritualProfile;
  temporal: ReturnType<typeof getTemporalContext>;
  intent: ReturnType<typeof classifyIntent>;
}> {
  const { user, question, rawOracleResult, partnerData } = params;
  const userTimezone = user.timezone || 'America/Sao_Paulo';

  const temporal = getTemporalContext(userTimezone);
  const intent = classifyIntent(question, userTimezone);
  const permanentProfile = await getOrCreateSpiritualProfile(user);
  const livingHistory = await getLivingSpiritualHistory(user.uid);

  let partnerContext = '';
  if (partnerData?.name) {
    const pNumerology = partnerData.birthDate
      ? calculateNumerology(partnerData.name, partnerData.birthDate)
      : null;
    const pAstrology = partnerData.birthDate
      ? calculateAstrology(partnerData.birthDate, '')
      : null;
    const pCabala = partnerData.birthDate
      ? calculateCabala(partnerData.birthDate)
      : null;

    partnerContext = `
--- DADOS E PERFIL ESPIRITUAL DA PESSOA ENVOLVIDA ---
Nome: ${partnerData.name}
${partnerData.birthDate ? `Nascimento: ${partnerData.birthDate}` : 'Nascimento não informado (análise por vibração onomástica)'}
Papel na vida do consulente: ${partnerData.role || 'parceiro_amoroso'}
${pNumerology ? `Caminho de Vida (Destino): ${pNumerology.lifePathNumber} | Expressão: ${pNumerology.expressionNumber}` : ''}
${pAstrology ? `Signo Solar: ${pAstrology.sunSign} | Elemento: ${pAstrology.element} | Regente: ${getRulingPlanet(pAstrology.sunSign)}` : ''}
${pCabala ? `Sefira Regente: ${pCabala.sephirahName} | Arcanjo: ${pCabala.rulingArchangel}` : ''}
`;
  }

  let oracleDrawContext = '';
  if (rawOracleResult) {
    if (rawOracleResult.tarotSpread) {
      oracleDrawContext = `
--- RESULTADO DO SORTEIO SAGRADO DO TAROT (CARTAS REAIS) ---
${rawOracleResult.tarotSpread
  .map(
    (pos: any, idx: number) =>
      `Posição ${idx + 1} (${pos.label}): ${pos.card.name} (${pos.card.arcana}${pos.card.suit ? ` de ${pos.card.suit}` : ''}) ${pos.isReversed ? '[INVERTIDA]' : '[DIRETA]'}\nSignificado Base: ${pos.card.uprightMeaning}\nConselho Oracular: ${pos.card.spiritualAdvice}`
  )
  .join('\n\n')}
`;
    } else if (rawOracleResult.buzios) {
      oracleDrawContext = `
--- RESULTADO DO JOGO DE BÚZIOS (CAÍDA REAL) ---
Odù Regente Revelado: ${rawOracleResult.buzios.oduName}
Conchas Abertas: ${rawOracleResult.buzios.openCount} / Fechadas: ${rawOracleResult.buzios.closedCount}
Energia do Odù: ${rawOracleResult.buzios.oduEnergy}
Conselho Sagrado dos Orixás: ${rawOracleResult.buzios.oduAdvice}
Sombra / Alerta Espiritual: ${rawOracleResult.buzios.oduShadow}
`;
    }
  }

  const systemContext = `
=== CONTEXTO ESPIRITUAL PROFUNDO DO CONSULENTE ===
Nome: ${user.fullName}
Nascimento: ${user.birthDate}${user.birthTime ? ` às ${user.birthTime}` : ''} (${user.city || 'Brasil'})
Data e Hora da Consulta: ${temporal.referenceIso} (${temporal.userDayOfWeek}, ${temporal.userFormattedTime} — Fuso: ${userTimezone})
Ciclo Temporal Astral: ${temporal.periodOfDay} | Saudação: ${temporal.greeting}
Intenção Principal Detectada: ${intent.primaryCategory.toUpperCase()} (${intent.summary})

--- PERFIL ESPIRITUAL PERMANENTE (VERSÃO ${permanentProfile.natalProfileVersion}) ---
- Numerologia: Caminho ${permanentProfile.numerology.lifePath}, Expressão ${permanentProfile.numerology.expression}, Alma ${permanentProfile.numerology.soulUrge}, Ano Pessoal ${permanentProfile.numerology.personalYear}
- Cabala: Sefira ${permanentProfile.cabala.sephirahName}, Arcanjo ${permanentProfile.cabala.rulingArchangel}, Anjo ${permanentProfile.cabala.guardianAngelName} (${permanentProfile.cabala.guardianAngelChoir})
- Astrologia: Signo ${permanentProfile.astrology.sunSign} (Elemento ${permanentProfile.astrology.element}), Regente ${permanentProfile.astrology.rulingPlanet}, Fase Lunar Atual ${permanentProfile.astrology.lunarPhase}
- Afinidade Espiritual: ${permanentProfile.archetypes.pomboGiraAffinity}
- Arquétipo da Alma: ${permanentProfile.archetypes.primaryArchetype}
- Arquétipo Sombra a Vigiar: ${permanentProfile.archetypes.shadowArchetype}
- Missão Sagrada: ${permanentProfile.karmicPatterns.soulMission}
- Dinâmica de Relacionamento: ${permanentProfile.karmicPatterns.relationshipDynamic}
- Lições Recorrentes: ${permanentProfile.recurrentLessons.join('; ')}
${partnerContext}
${oracleDrawContext}
${
  livingHistory.recurringThemes.length > 0
    ? `--- TEMAS E PADRÕES RECORRENTES DA JORNADA ---\nTemas presentes: ${livingHistory.recurringThemes.join(', ')}`
    : ''
}

DIRETRIZ DE CONDUTA PARA MARIA PADILHA:
- Você tem acesso a todo este mapa espiritual, mas NÃO deve despejar os dados brutos como um relatório mecânico ou lista de tópicos.
- Selecione e teça organicamente os pontos que iluminam a pergunta atual do consulente.
- Fale com a voz, presença, dignidade e respeito sagrado de Maria Padilha.
`;

  return {
    systemContext,
    permanentProfile,
    temporal,
    intent,
  };
}
