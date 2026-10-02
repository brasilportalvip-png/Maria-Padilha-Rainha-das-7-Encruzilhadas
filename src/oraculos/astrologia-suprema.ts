export interface AstrologiaInput {
  fullName: string;
  birthDate: string;
  birthTime?: string;
  city?: string;
  question?: string;
}

function normalizar(texto: string): string {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function extrairData(data: string) {
  const partes = String(data || '').split(/[\/\-]/).map(Number);

  return {
    dia: partes[0] || 0,
    mes: partes[1] || 0,
    ano: partes[2] || 0
  };
}

function somaDigitos(texto: string): number {
  return String(texto || '')
    .replace(/\D/g, '')
    .split('')
    .reduce((soma, digito) => soma + Number(digito), 0);
}

function reduzirNumero(n: number): number {
  while (n > 9 && ![11, 22, 33, 44].includes(n)) {
    n = String(n)
      .split('')
      .reduce((soma, digito) => soma + Number(digito), 0);
  }

  return n;
}

function calcularSignoSolar(data: string): string {
  const { dia, mes } = extrairData(data);

  if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) return 'Áries';
  if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) return 'Touro';
  if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) return 'Gêmeos';
  if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) return 'Câncer';
  if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) return 'Leão';
  if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) return 'Virgem';
  if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) return 'Libra';
  if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) return 'Escorpião';
  if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) return 'Sagitário';
  if ((mes === 12 && dia >= 22) || (mes === 1 && dia <= 19)) return 'Capricórnio';
  if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) return 'Aquário';

  return 'Peixes';
}

const SIGNOS: Record<string, any> = {
  Áries: {
    elemento: 'Fogo',
    planeta: 'Marte',
    luz: 'coragem, atitude, força de início e impulso para vencer.',
    sombra: 'impaciência, explosão emocional, orgulho e dificuldade de esperar.',
    missao: 'aprender a agir com coragem sem destruir o que ainda está nascendo.'
  },
  Touro: {
    elemento: 'Terra',
    planeta: 'Vênus',
    luz: 'firmeza, sensualidade, estabilidade, paciência e força de construção.',
    sombra: 'teimosia, apego, medo de perder segurança e resistência à mudança.',
    missao: 'aprender a construir sem ficar preso ao medo de mudar.'
  },
  Gêmeos: {
    elemento: 'Ar',
    planeta: 'Mercúrio',
    luz: 'comunicação, inteligência, movimento mental e facilidade de adaptação.',
    sombra: 'ansiedade, dispersão, indecisão e excesso de pensamento.',
    missao: 'usar a palavra com clareza e não se perder em dúvidas.'
  },
  Câncer: {
    elemento: 'Água',
    planeta: 'Lua',
    luz: 'intuição, proteção, memória, cuidado e força emocional.',
    sombra: 'apego ao passado, carência, medo de abandono e excesso de defesa.',
    missao: 'aprender a amar sem viver preso à dor antiga.'
  },
  Leão: {
    elemento: 'Fogo',
    planeta: 'Sol',
    luz: 'brilho, liderança, magnetismo, nobreza e poder de presença.',
    sombra: 'orgulho, vaidade, necessidade de atenção e dificuldade de aceitar crítica.',
    missao: 'brilhar com verdade sem precisar dominar todos ao redor.'
  },
  Virgem: {
    elemento: 'Terra',
    planeta: 'Mercúrio',
    luz: 'organização, análise, trabalho, cuidado e inteligência prática.',
    sombra: 'crítica excessiva, perfeccionismo, cobrança e medo de errar.',
    missao: 'servir com sabedoria sem se maltratar pela busca da perfeição.'
  },
  Libra: {
    elemento: 'Ar',
    planeta: 'Vênus',
    luz: 'harmonia, beleza, diplomacia, parceria e senso de justiça.',
    sombra: 'indecisão, dependência de aprovação e medo de confronto.',
    missao: 'buscar equilíbrio sem se anular para agradar os outros.'
  },
  Escorpião: {
    elemento: 'Água',
    planeta: 'Plutão e Marte',
    luz: 'profundidade, magnetismo, força espiritual, transformação e percepção oculta.',
    sombra: 'controle, ciúme, intensidade destrutiva, desconfiança e rancor.',
    missao: 'transformar dor em poder espiritual e não em prisão emocional.'
  },
  Sagitário: {
    elemento: 'Fogo',
    planeta: 'Júpiter',
    luz: 'fé, expansão, liberdade, visão espiritual e coragem de seguir caminhos novos.',
    sombra: 'exagero, fuga, impulsividade e dificuldade de compromisso.',
    missao: 'usar a liberdade com propósito e responsabilidade.'
  },
  Capricórnio: {
    elemento: 'Terra',
    planeta: 'Saturno',
    luz: 'disciplina, maturidade, responsabilidade, estratégia e força de realização.',
    sombra: 'frieza, dureza, medo de fracassar e excesso de cobrança.',
    missao: 'construir autoridade sem endurecer o coração.'
  },
  Aquário: {
    elemento: 'Ar',
    planeta: 'Urano e Saturno',
    luz: 'originalidade, visão de futuro, independência e pensamento livre.',
    sombra: 'distanciamento emocional, rebeldia, frieza e dificuldade com vínculos.',
    missao: 'ser livre sem se desligar das pessoas que importam.'
  },
  Peixes: {
    elemento: 'Água',
    planeta: 'Netuno e Júpiter',
    luz: 'sensibilidade, mediunidade, compaixão, sonho e conexão espiritual.',
    sombra: 'fuga, ilusão, vitimismo, confusão emocional e absorção de energias.',
    missao: 'transformar sensibilidade em fé, proteção e clareza.'
  }
};

function calcularEnergiaLunar(data: string, hora?: string): string {
  const base = reduzirNumero(somaDigitos(`${data}${hora || ''}`));

  const energias: Record<number, string> = {
    1: 'Lua de início emocional e coragem para recomeçar.',
    2: 'Lua de sensibilidade, apego e necessidade de acolhimento.',
    3: 'Lua de fala, expressão, encanto e comunicação afetiva.',
    4: 'Lua de proteção, fechamento emocional e busca por segurança.',
    5: 'Lua de movimento, desejo de liberdade e instabilidade emocional.',
    6: 'Lua de amor, família, cuidado e responsabilidade afetiva.',
    7: 'Lua espiritual, silenciosa, intuitiva e profunda.',
    8: 'Lua de controle emocional, poder interno e cobrança.',
    9: 'Lua de encerramento, saudade, cura e limpeza emocional.',
    11: 'Lua mediúnica, muito sensível, intuitiva e espiritual.',
    22: 'Lua de construção emocional, proteção e responsabilidade pesada.',
    33: 'Lua de cura, amor espiritual e cuidado elevado.',
    44: 'Lua de força, defesa espiritual e grande proteção.'
  };

  return energias[base] || energias[reduzirNumero(base)] || energias[9];
}

function calcularEnergiaVenus(signo: string, pergunta: string): string {
  const t = normalizar(pergunta);
  const base = SIGNOS[signo];

  if (t.includes('amor') || t.includes('relacionamento') || t.includes('ex')) {
    return `Vênus atua com força no campo afetivo: ${base.luz} Porém a sombra pode trazer ${base.sombra}`;
  }

  return `Vênus mostra magnetismo, atração, beleza pessoal e forma de se relacionar. Neste mapa, ela toca ${base.elemento}, trazendo ${base.luz}`;
}

function calcularEnergiaMarte(signo: string): string {
  const base = SIGNOS[signo];

  return `Marte mostra a forma de agir, lutar e reagir. A energia dominante traz ${base.luz} Na sombra, pode aparecer ${base.sombra}`;
}

function calcularEnergiaSaturno(signo: string): string {
  const base = SIGNOS[signo];

  return `Saturno mostra cobrança, amadurecimento e prova espiritual. A lição principal é: ${base.missao}`;
}

function detectarTema(pergunta: string): string {
  const t = normalizar(pergunta);

  if (t.includes('amor') || t.includes('ex') || t.includes('relacionamento')) return 'amor';
  if (t.includes('dinheiro') || t.includes('trabalho') || t.includes('emprego')) return 'prosperidade';
  if (t.includes('espiritual') || t.includes('guia') || t.includes('entidade')) return 'espiritualidade';
  if (t.includes('familia') || t.includes('filho') || t.includes('casa')) return 'família';

  return 'geral';
}

function calcularElementoDominante(signo: string): string {
  return SIGNOS[signo]?.elemento || 'Água';
}

function interpretarElemento(elemento: string): string {
  const tabela: Record<string, string> = {
    Fogo: 'energia de atitude, coragem, impulso, paixão e abertura de caminho.',
    Terra: 'energia de construção, firmeza, trabalho, realidade e estabilidade.',
    Ar: 'energia de pensamento, comunicação, ideias, movimento mental e escolhas.',
    Água: 'energia emocional, espiritual, intuitiva, sensível e profunda.'
  };

  return tabela[elemento] || 'energia espiritual sensível e intuitiva.';
}

export function buildAstrologiaSuprema(input: AstrologiaInput) {
  const signoSolar = calcularSignoSolar(input.birthDate);
  const baseSigno = SIGNOS[signoSolar];

  const tema = detectarTema(input.question || '');
  const elementoDominante = calcularElementoDominante(signoSolar);

  const luaEnergetica = calcularEnergiaLunar(input.birthDate, input.birthTime);
  const venusEnergetica = calcularEnergiaVenus(signoSolar, input.question || '');
  const marteEnergetico = calcularEnergiaMarte(signoSolar);
  const saturnoEnergetico = calcularEnergiaSaturno(signoSolar);

  const ascendente =
    input.birthTime && input.city
      ? 'necessita cálculo astronômico com coordenadas exatas da cidade para precisão total'
      : 'não calculado com segurança por falta de hora/cidade completa';

  const resumoParaMariaPadilha = `
ASTROLOGIA PREMIUM SUPREMA

Signo Solar: ${signoSolar}
Elemento dominante: ${elementoDominante}
Planeta regente: ${baseSigno.planeta}

Luz do signo: ${baseSigno.luz}
Sombra do signo: ${baseSigno.sombra}
Missão espiritual do signo: ${baseSigno.missao}

Lua energética: ${luaEnergetica}

Vênus energética:
${venusEnergetica}

Marte energético:
${marteEnergetico}

Saturno energético:
${saturnoEnergetico}

Tema detectado: ${tema}

Ascendente:
${ascendente}

Interpretação do elemento dominante:
${interpretarElemento(elementoDominante)}

ORIENTAÇÃO PARA A VOZ DE MARIA PADILHA:
Use a astrologia como bastidor da leitura.
Não fale como relatório técnico.
Não diga que calculou.
Não invente ascendente, Lua real ou planeta real sem coordenadas astronômicas.
Use o Sol, elemento, regente, Lua energética, Vênus, Marte e Saturno como forças simbólicas e espirituais da leitura.
Fale com força, clareza, verdade e linguagem popular.
`.trim();

  return {
    entrada: {
      fullName: input.fullName || '',
      birthDate: input.birthDate || '',
      birthTime: input.birthTime || '',
      city: input.city || '',
      question: input.question || ''
    },

    astrologia: {
      signoSolar,
      elementoDominante,
      planetaRegente: baseSigno.planeta,
      luz: baseSigno.luz,
      sombra: baseSigno.sombra,
      missao: baseSigno.missao,
      luaEnergetica,
      venusEnergetica,
      marteEnergetico,
      saturnoEnergetico,
      ascendente
    },

    tema,

    resumoParaMariaPadilha
  };
}

export default buildAstrologiaSuprema;