export interface AstrologyResult {
  methodVersion: string;
  sunSign: string;
  element: 'Fogo' | 'Terra' | 'Ar' | 'Água';
  modality: 'Cardinal' | 'Fixo' | 'Mutável';
  planetaryHourRuler: string;
  lunarPhase: string;
  lunarPhaseDescription: string;
  cosmicAdvice: string;
}

const CHALDEAN_PLANETS = ['Saturno', 'Júpiter', 'Marte', 'Sol', 'Vênus', 'Mercúrio', 'Lua'];

export function calculateAstrology(birthDateStr: string, birthTimeStr?: string, timezone: string = 'America/Sao_Paulo'): AstrologyResult {
  let day = 1;
  let month = 1;
  let year = 1990;
  let hour = 12;

  if (birthDateStr) {
    const parts = birthDateStr.split('-');
    if (parts.length === 3) {
      year = parseInt(parts[0], 10) || 1990;
      month = parseInt(parts[1], 10) || 1;
      day = parseInt(parts[2], 10) || 1;
    }
  }

  if (birthTimeStr) {
    const timeParts = birthTimeStr.split(':');
    hour = parseInt(timeParts[0], 10) || 12;
  }

  // 1. Sun Sign calculation
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

  // 2. Planetary Hour Ruler (Chaldean sequence based on day of week + hour)
  const dateObj = new Date(year, month - 1, day, hour);
  const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  const dayRulers = [3, 6, 2, 5, 1, 4, 0]; // Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn in Chaldean array
  const dayRulerIndex = dayRulers[dayOfWeek];
  const hourIndex = (dayRulerIndex + (hour % 7)) % 7;
  const planetaryHourRuler = CHALDEAN_PLANETS[hourIndex];

  // 3. Moon Phase calculation (synodic cycle: 29.53058867 days)
  // Known reference new moon: 2000-01-06 18:14 UTC
  const refTime = new Date('2000-01-06T18:14:00Z').getTime();
  const birthTimeMs = dateObj.getTime();
  const diffDays = (birthTimeMs - refTime) / (1000 * 60 * 60 * 24);
  const synodicMonth = 29.53058867;
  const phaseCycle = ((diffDays % synodicMonth) + synodicMonth) % synodicMonth;

  let lunarPhase = 'Lua Nova';
  let lunarPhaseDescription = 'Tempo de semeadura, introspecção e novos inícios.';
  if (phaseCycle < 1.84) {
    lunarPhase = 'Lua Nova';
    lunarPhaseDescription = 'Momento sagrado de plantar sementes silenciosas e focar nos desejos essenciais.';
  } else if (phaseCycle < 7.38) {
    lunarPhase = 'Lua Crescente';
    lunarPhaseDescription = 'Fase de expansão, força de vontade, coragem e superação dos primeiros obstáculos.';
  } else if (phaseCycle < 11.07) {
    lunarPhase = 'Quarto Crescente';
    lunarPhaseDescription = 'Momento de decisão firme, alinhamento de compromissos e consolidação de planos.';
  } else if (phaseCycle < 16.61) {
    lunarPhase = 'Lua Cheia';
    lunarPhaseDescription = 'Apogeu de luz e magnetismo, clareza total, fertilidade e realização de propósitos.';
  } else if (phaseCycle < 22.15) {
    lunarPhase = 'Lua Disseminadora / Minguante';
    lunarPhaseDescription = 'Fase de colheita consciente, partilha de sabedoria e limpeza do que já não serve.';
  } else if (phaseCycle < 25.84) {
    lunarPhase = 'Quarto Minguante';
    lunarPhaseDescription = 'Tempo de purificação profunda, corte de amarras e liberação de pesos espirituais.';
  } else {
    lunarPhase = 'Lua Balsâmica';
    lunarPhaseDescription = 'Ciclo de renovação da alma, descanso sagrado e preparação para o novo ciclo.';
  }

  const cosmicAdvice = `Nascido(a) sob a força do Sol em ${sunSign} (Elemento ${element}, Modo ${modality}), com regência da ${lunarPhase} e hora planetária de ${planetaryHourRuler}. Para que seus caminhos fluam com a força de Maria Padilha, use a energia do seu elemento ${element} com sabedoria e honre os ritmos da Lua em suas decisões.`;

  return {
    methodVersion: 'Astrologia-Horaria-Calc-v1',
    sunSign,
    element,
    modality,
    planetaryHourRuler,
    lunarPhase,
    lunarPhaseDescription,
    cosmicAdvice,
  };
}
