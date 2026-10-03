import { parseAndValidateDate } from '../utils/dateNormalizer.js';

export interface AstrologyResult {
  methodVersion: string;
  sunSign: string;
  element: 'Fogo' | 'Terra' | 'Ar' | 'Água';
  modality: 'Cardinal' | 'Fixo' | 'Mutável';
  planetaryHourRuler: string | null;
  hourKnown: boolean;
  lunarPhase: string; // Fase Lunar do Nascimento
  lunarPhaseDescription: string;
  cosmicAdvice: string;
}

const CHALDEAN_PLANETS = ['Saturno', 'Júpiter', 'Marte', 'Sol', 'Vênus', 'Mercúrio', 'Lua'];

export function calculateAstrology(birthDateStr: string, birthTimeStr?: string | null, timezone: string = 'America/Sao_Paulo'): AstrologyResult {
  const { year, month, day } = parseAndValidateDate(birthDateStr);

  let hour: number | null = null;
  let hourKnown = false;

  if (birthTimeStr && typeof birthTimeStr === 'string' && birthTimeStr.trim() !== '') {
    const timeMatch = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(birthTimeStr.trim());
    if (timeMatch) {
      hour = parseInt(timeMatch[1], 10);
      hourKnown = true;
    }
  }

  // 1. Sun Sign calculation (deterministic based solely on birth date)
  let sunSign = 'Áries';
  let element: 'Fogo' | 'Terra' | 'Ar' | 'Água' = 'Fogo';
  let modality: 'Cardinal' | 'Fixo' | 'Mutável' = 'Cardinal';

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    sunSign = 'Áries'; element = 'Fogo'; modality = 'Cardinal';
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    sunSign = 'Touro'; element = 'Terra'; modality = 'Fixo';
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    sunSign = 'Gêmeos'; element = 'Ar'; modality = 'Mutável';
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    sunSign = 'Câncer'; element = 'Água'; modality = 'Cardinal';
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    sunSign = 'Leão'; element = 'Fogo'; modality = 'Fixo';
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    sunSign = 'Virgem'; element = 'Terra'; modality = 'Mutável';
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    sunSign = 'Libra'; element = 'Ar'; modality = 'Cardinal';
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    sunSign = 'Escorpião'; element = 'Água'; modality = 'Fixo';
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    sunSign = 'Sagitário'; element = 'Fogo'; modality = 'Mutável';
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    sunSign = 'Capricórnio'; element = 'Terra'; modality = 'Cardinal';
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    sunSign = 'Aquário'; element = 'Ar'; modality = 'Fixo';
  } else {
    sunSign = 'Peixes'; element = 'Água'; modality = 'Mutável';
  }

  // 2. Planetary Hour Ruler (STRICTLY when birth time is authentically known; NEVER default to 12:00)
  let planetaryHourRuler: string | null = null;
  if (hourKnown && hour !== null) {
    const dateObj = new Date(year, month - 1, day, hour);
    const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
    const dayRulers = [3, 6, 2, 5, 1, 4, 0]; // Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn in Chaldean array
    const dayRulerIndex = dayRulers[dayOfWeek];
    const hourIndex = (dayRulerIndex + (hour % 7)) % 7;
    planetaryHourRuler = CHALDEAN_PLANETS[hourIndex];
  }

  // 3. Natal Moon Phase calculation (synodic cycle: 29.53058867 days, relative to 2000-01-06 18:14 UTC reference)
  // When hour is unknown, DO NOT invent 12:00 or any fictive time.
  // Evaluate the calendar date boundary: if the phase transitions during the day and hour is unknown,
  // clearly indicate the transition due to absence of birth time.
  const refTime = new Date('2000-01-06T18:14:00Z').getTime();
  const synodicMonth = 29.53058867;

  const getPhaseData = (cycleDays: number) => {
    const cycle = ((cycleDays % synodicMonth) + synodicMonth) % synodicMonth;
    if (cycle < 1.84) {
      return { phase: 'Lua Nova', desc: 'Momento sagrado de plantar sementes silenciosas e focar nos desejos essenciais.' };
    } else if (cycle < 7.38) {
      return { phase: 'Lua Crescente', desc: 'Fase de expansão, força de vontade, coragem e superação dos primeiros obstáculos.' };
    } else if (cycle < 11.07) {
      return { phase: 'Quarto Crescente', desc: 'Momento de decisão firme, alinhamento de compromissos e consolidação de planos.' };
    } else if (cycle < 16.61) {
      return { phase: 'Lua Cheia', desc: 'Apogeu de luz e magnetismo, clareza total, fertilidade e realização de propósitos.' };
    } else if (cycle < 22.15) {
      return { phase: 'Lua Disseminadora / Minguante', desc: 'Fase de colheita consciente, partilha de sabedoria e limpeza do que já não serve.' };
    } else if (cycle < 25.84) {
      return { phase: 'Quarto Minguante', desc: 'Tempo de purificação profunda, corte de amarras e liberação de pesos espirituais.' };
    } else {
      return { phase: 'Lua Balsâmica', desc: 'Ciclo de renovação da alma, descanso sagrado e preparação para o novo ciclo.' };
    }
  };

  let lunarPhase: string;
  let lunarPhaseDescription: string;

  if (hourKnown && hour !== null) {
    // Exact birth hour provided
    const exactBirthMs = new Date(year, month - 1, day, hour).getTime();
    const diffDays = (exactBirthMs - refTime) / (1000 * 60 * 60 * 24);
    const data = getPhaseData(diffDays);
    lunarPhase = data.phase;
    lunarPhaseDescription = data.desc;
  } else {
    // Birth hour unknown: evaluate calendar day without assuming any specific hour
    const startDiff = (new Date(year, month - 1, day, 0, 0, 0).getTime() - refTime) / (1000 * 60 * 60 * 24);
    const endDiff = (new Date(year, month - 1, day, 23, 59, 59).getTime() - refTime) / (1000 * 60 * 60 * 24);
    const startData = getPhaseData(startDiff);
    const endData = getPhaseData(endDiff);

    if (startData.phase === endData.phase) {
      lunarPhase = startData.phase;
      lunarPhaseDescription = `${startData.desc} (Fase constante ao longo de todo o dia de nascimento).`;
    } else {
      lunarPhase = `Transição Lunar (${startData.phase} para ${endData.phase})`;
      lunarPhaseDescription = `No dia do seu nascimento a Lua transitou de ${startData.phase} para ${endData.phase}. Como o horário exato de nascimento não foi informado, a vibração lunar integra essa transição sagrada.`;
    }
  }

  const hourText = planetaryHourRuler
    ? `hora planetária natal de ${planetaryHourRuler}`
    : 'hora planetária não calculada (hora de nascimento não informada)';

  const cosmicAdvice = `Nascido(a) sob a força do Sol em ${sunSign} (Elemento ${element}, Modo ${modality}), com vibração natal da ${lunarPhase} e ${hourText}. Para que seus caminhos fluam com a força de Maria Padilha, use a energia do seu elemento ${element} com sabedoria e honre os ritmos da Lua em suas decisões.`;

  return {
    methodVersion: 'Astrologia-Horaria-Calc-v1',
    sunSign,
    element,
    modality,
    planetaryHourRuler,
    hourKnown,
    lunarPhase,
    lunarPhaseDescription,
    cosmicAdvice,
  };
}
