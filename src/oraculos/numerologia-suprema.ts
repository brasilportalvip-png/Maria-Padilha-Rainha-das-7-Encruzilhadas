export interface NumerologiaInput {
  fullName: string;
  birthDate: string;
  birthTime?: string;
  question?: string;
}

export interface InterpretacaoNumero {
  numero: number;
  luz: string;
  sombra: string;
  missao: string;
}

const NUMEROS_MESTRES = [11, 22, 33, 44];

function normalizar(texto: string): string {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function limparNome(nome: string): string {
  return String(nome || '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z]/g, '');
}

function reduzirNumero(n: number): number {
  while (n > 9 && !NUMEROS_MESTRES.includes(n)) {
    n = String(n)
      .split('')
      .reduce((soma, digito) => soma + Number(digito), 0);
  }

  return n;
}

function somaDigitos(texto: string): number {
  return String(texto || '')
    .replace(/\D/g, '')
    .split('')
    .reduce((soma, digito) => soma + Number(digito), 0);
}

function extrairData(data: string) {
  const partes = String(data || '').split(/[\/\-]/).map(Number);
  const numeros = String(data || '').replace(/\D/g, '');

  let dia = 0;
  let mes = 0;
  let ano = 0;

  if (partes.length >= 3) {
    dia = partes[0] || 0;
    mes = partes[1] || 0;
    ano = partes[2] || 0;
  } else if (numeros.length >= 8) {
    dia = Number(numeros.slice(0, 2));
    mes = Number(numeros.slice(2, 4));
    ano = Number(numeros.slice(4, 8));
  }

  return { dia, mes, ano };
}

const MAPA_PITAGORICO: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

const VOGAIS = ['A', 'E', 'I', 'O', 'U'];

function valorNome(nome: string, filtro?: 'vogais' | 'consoantes'): number {
  const limpo = limparNome(nome);

  let total = 0;

  for (const letra of limpo) {
    const isVogal = VOGAIS.includes(letra);

    if (filtro === 'vogais' && !isVogal) continue;
    if (filtro === 'consoantes' && isVogal) continue;

    total += MAPA_PITAGORICO[letra] || 0;
  }

  return reduzirNumero(total);
}

function calcularCaminhoVida(data: string): number {
  return reduzirNumero(somaDigitos(data));
}

function calcularExpressao(nome: string): number {
  return valorNome(nome);
}

function calcularAlma(nome: string): number {
  return valorNome(nome, 'vogais');
}

function calcularPersonalidade(nome: string): number {
  return valorNome(nome, 'consoantes');
}

function calcularDestino(nome: string, data: string): number {
  return reduzirNumero(calcularExpressao(nome) + calcularCaminhoVida(data));
}

function calcularMaturidade(nome: string, data: string): number {
  return reduzirNumero(calcularExpressao(nome) + calcularCaminhoVida(data));
}

function calcularAnoPessoal(data: string, hoje = new Date()): number {
  const { dia, mes } = extrairData(data);
  const anoAtual = hoje.getFullYear();

  return reduzirNumero(somaDigitos(`${dia}${mes}${anoAtual}`));
}

function calcularMesPessoal(data: string, hoje = new Date()): number {
  return reduzirNumero(calcularAnoPessoal(data, hoje) + hoje.getMonth() + 1);
}

function calcularDiaPessoal(data: string, hoje = new Date()): number {
  return reduzirNumero(calcularMesPessoal(data, hoje) + hoje.getDate());
}

function calcularPinaculos(data: string) {
  const { dia, mes, ano } = extrairData(data);

  const d = reduzirNumero(dia);
  const m = reduzirNumero(mes);
  const a = reduzirNumero(somaDigitos(String(ano)));

  const primeiro = reduzirNumero(d + m);
  const segundo = reduzirNumero(d + a);
  const terceiro = reduzirNumero(primeiro + segundo);
  const quarto = reduzirNumero(m + a);

  return { primeiro, segundo, terceiro, quarto };
}

function calcularDesafios(data: string) {
  const { dia, mes, ano } = extrairData(data);

  const d = reduzirNumero(dia);
  const m = reduzirNumero(mes);
  const a = reduzirNumero(somaDigitos(String(ano)));

  const primeiro = Math.abs(d - m);
  const segundo = Math.abs(d - a);
  const terceiro = Math.abs(primeiro - segundo);
  const quarto = Math.abs(m - a);

  return { primeiro, segundo, terceiro, quarto };
}

function calcularLicoesKarmicas(nome: string): number[] {
  const presentes = new Set<number>();

  for (const letra of limparNome(nome)) {
    const valor = MAPA_PITAGORICO[letra];
    if (valor) presentes.add(valor);
  }

  const ausentes: number[] = [];

  for (let i = 1; i <= 9; i++) {
    if (!presentes.has(i)) ausentes.push(i);
  }

  return ausentes;
}

function calcularDividasKarmicas(nome: string, data: string): number[] {
  const brutos = [
    somaDigitos(data),
    limparNome(nome).split('').reduce((soma, letra) => soma + (MAPA_PITAGORICO[letra] || 0), 0)
  ];

  return [13, 14, 16, 19].filter((divida) => brutos.includes(divida));
}

function calcularNumeroOculto(nome: string): number {
  const limpo = limparNome(nome);

  const total = limpo
    .split('')
    .reduce((soma, letra, index) => soma + letra.charCodeAt(0) + index + 1, 0);

  return reduzirNumero(total);
}

function interpretarNumero(numero: number): InterpretacaoNumero {
  const tabela: Record<number, InterpretacaoNumero> = {
    1: {
      numero: 1,
      luz: 'liderança, coragem, iniciativa e força para começar caminhos.',
      sombra: 'orgulho, impaciência, autoritarismo e dificuldade de ouvir.',
      missao: 'aprender a liderar sem esmagar ninguém.'
    },
    2: {
      numero: 2,
      luz: 'sensibilidade, parceria, intuição e capacidade de unir pessoas.',
      sombra: 'dependência emocional, medo de conflito e excesso de carência.',
      missao: 'aprender a amar sem se abandonar.'
    },
    3: {
      numero: 3,
      luz: 'comunicação, encanto, criatividade e alegria espiritual.',
      sombra: 'dispersão, vaidade, exagero e dificuldade de terminar o que começa.',
      missao: 'usar a palavra com verdade, beleza e responsabilidade.'
    },
    4: {
      numero: 4,
      luz: 'disciplina, construção, trabalho, firmeza e responsabilidade.',
      sombra: 'teimosia, rigidez, excesso de controle e medo de mudar.',
      missao: 'construir base forte sem virar prisioneiro da própria dureza.'
    },
    5: {
      numero: 5,
      luz: 'movimento, liberdade, magnetismo, mudança e adaptação.',
      sombra: 'instabilidade, impulsividade, fuga e dificuldade de compromisso.',
      missao: 'aprender liberdade com consciência.'
    },
    6: {
      numero: 6,
      luz: 'amor, família, cuidado, beleza, proteção e responsabilidade afetiva.',
      sombra: 'culpa, cobrança, apego, ciúme e excesso de sacrifício.',
      missao: 'cuidar sem carregar o mundo nas costas.'
    },
    7: {
      numero: 7,
      luz: 'espiritualidade, sabedoria, análise, silêncio e profundidade.',
      sombra: 'isolamento, desconfiança, frieza emocional e excesso de dúvida.',
      missao: 'transformar solidão em sabedoria e fé.'
    },
    8: {
      numero: 8,
      luz: 'poder, prosperidade, liderança, ambição e força material.',
      sombra: 'controle, orgulho, dureza, cobrança e medo de perder poder.',
      missao: 'usar poder com justiça, equilíbrio e consciência.'
    },
    9: {
      numero: 9,
      luz: 'compaixão, encerramento de ciclos, cura emocional e visão espiritual.',
      sombra: 'drama, apego ao passado, vitimismo e dificuldade de soltar.',
      missao: 'aprender a encerrar ciclos sem perder a fé.'
    },
    11: {
      numero: 11,
      luz: 'intuição elevada, mediunidade, inspiração e visão espiritual.',
      sombra: 'ansiedade, excesso de sensibilidade, medo e confusão interna.',
      missao: 'ser canal de luz sem se perder na própria intensidade.'
    },
    22: {
      numero: 22,
      luz: 'grande construção, missão coletiva, poder de realização e liderança espiritual.',
      sombra: 'peso excessivo, cobrança interna, medo de falhar e rigidez.',
      missao: 'construir algo grande com humildade e firmeza.'
    },
    33: {
      numero: 33,
      luz: 'amor espiritual, cura, serviço, cuidado e proteção elevada.',
      sombra: 'sacrifício exagerado, culpa, dependência de salvar os outros.',
      missao: 'servir com amor sem se destruir pelos outros.'
    },
    44: {
      numero: 44,
      luz: 'força espiritual rara, comando, proteção, construção poderosa e disciplina superior.',
      sombra: 'pressão extrema, controle, dureza, isolamento e cobrança pesada.',
      missao: 'usar força e autoridade para abrir caminhos verdadeiros.'
    }
  };

  return tabela[numero] || tabela[reduzirNumero(numero)] || tabela[9];
}

function detectarEmocoes(pergunta: string): string[] {
  const t = normalizar(pergunta);
  const encontrados: string[] = [];

  const padroes: Record<string, string[]> = {
    orgulho: ['orgulho', 'orgulhoso', 'orgulhosa', 'nao vou atras', 'não vou atras'],
    teimosia: ['teimosia', 'teimoso', 'teimosa', 'insisto', 'insistir'],
    procrastinacao: ['procrastino', 'deixo para depois', 'enrolo', 'adiando'],
    ansiedade: ['ansiedade', 'ansioso', 'ansiosa', 'aflito', 'aflita', 'desespero'],
    medo: ['medo', 'receio', 'inseguro', 'insegura', 'tenho medo'],
    dependenciaEmocional: ['nao vivo sem', 'não vivo sem', 'dependo', 'preciso dele', 'preciso dela'],
    carencia: ['carencia', 'carente', 'sozinho', 'sozinha', 'ninguém me ama', 'ninguem me ama'],
    impulsividade: ['impulso', 'impulsivo', 'impulsiva', 'faço sem pensar', 'faco sem pensar'],
    baixaAutoestima: ['nao sou suficiente', 'não sou suficiente', 'me sinto menor', 'sem valor'],
    vitimismo: ['tudo comigo', 'ninguém me ajuda', 'ninguem me ajuda', 'só sofro', 'so sofro'],
    controle: ['controlar', 'controle', 'quero mandar', 'preciso saber tudo'],
    ciume: ['ciume', 'ciúme', 'ciumento', 'ciumenta'],
    perfeccionismo: ['perfeito', 'perfeccionismo', 'nunca esta bom', 'nunca está bom'],
    resistenciaMudanca: ['nao consigo mudar', 'não consigo mudar', 'tenho dificuldade de mudar'],
    inseguranca: ['insegurança', 'inseguranca', 'inseguro', 'insegura'],
    dificuldadePerdoar: ['nao perdoo', 'não perdoo', 'mágoa', 'magoa', 'ressentimento']
  };

  for (const [emocao, termos] of Object.entries(padroes)) {
    if (termos.some((termo) => t.includes(normalizar(termo)))) {
      encontrados.push(emocao);
    }
  }

  return encontrados;
}

function calcularMissaoEspiritual(caminho: number, alma: number): number {
  return reduzirNumero(caminho + alma);
}

function calcularTendenciaOculta(numeroOculto: number, personalidade: number): number {
  return reduzirNumero(numeroOculto + personalidade);
}

function calcularForcaEspiritual(caminho: number, expressao: number, alma: number): number {
  return reduzirNumero(caminho + expressao + alma);
}

function calcularPotencialFinanceiro(expressao: number, caminho: number, anoPessoal: number): string {
  const base = reduzirNumero(expressao + caminho + anoPessoal);

  if ([8, 22, 44].includes(base)) return 'muito alto, com forte energia de construção, dinheiro e liderança.';
  if ([1, 4].includes(base)) return 'alto, mas depende de disciplina, foco e atitude.';
  if ([3, 5].includes(base)) return 'bom, ligado a comunicação, movimento, vendas e criatividade.';
  if ([2, 6].includes(base)) return 'moderado, cresce com parcerias, cuidado e estabilidade.';
  return 'espiritualizado, melhora quando a pessoa une propósito, sabedoria e estratégia.';
}

function calcularPotencialAmoroso(alma: number, personalidade: number, caminho: number): string {
  const base = reduzirNumero(alma + personalidade + caminho);

  if ([2, 6, 33].includes(base)) return 'forte, afetivo e profundo, mas precisa evitar dependência emocional.';
  if ([5, 3].includes(base)) return 'magnético e intenso, mas precisa de liberdade e maturidade.';
  if ([8, 1].includes(base)) return 'forte, dominante e seletivo, mas precisa controlar orgulho e dureza.';
  if ([7, 11].includes(base)) return 'espiritual e profundo, mas pode ter dificuldade de se abrir.';
  return 'sensível, cármico e transformador, pedindo cura de padrões antigos.';
}

function calcularAutoSabotagem(params: {
  expressao: number;
  alma: number;
  personalidade: number;
  desafios: ReturnType<typeof calcularDesafios>;
  licoesKarmicas: number[];
  dividasKarmicas: number[];
  emocoes: string[];
}): string {
  const pontos: string[] = [];

  if ([1, 8, 44].includes(params.expressao) || params.emocoes.includes('orgulho')) {
    pontos.push('orgulho e necessidade de controlar tudo');
  }

  if ([4].includes(params.personalidade) || params.emocoes.includes('teimosia')) {
    pontos.push('teimosia e resistência para mudar');
  }

  if ([2, 6].includes(params.alma) || params.emocoes.includes('dependenciaEmocional')) {
    pontos.push('dependência emocional e medo de perder afeto');
  }

  if (params.emocoes.includes('ansiedade') || params.emocoes.includes('medo')) {
    pontos.push('ansiedade, medo e antecipação de sofrimento');
  }

  if (params.licoesKarmicas.includes(4)) {
    pontos.push('falta de disciplina ou dificuldade de manter constância');
  }

  if (params.licoesKarmicas.includes(6)) {
    pontos.push('desequilíbrio em amor, família ou responsabilidade afetiva');
  }

  if (params.dividasKarmicas.includes(13)) {
    pontos.push('prova de disciplina, esforço e responsabilidade');
  }

  if (params.dividasKarmicas.includes(14)) {
    pontos.push('prova de liberdade, excessos e instabilidade');
  }

  if (params.dividasKarmicas.includes(16)) {
    pontos.push('prova de orgulho, queda de ilusão e amadurecimento espiritual');
  }

  if (params.dividasKarmicas.includes(19)) {
    pontos.push('prova de ego, independência e humildade');

  }

  return pontos.length
    ? pontos.join('; ')
    : 'auto sabotagem ligada a dúvidas internas, medo de agir e dificuldade de confiar no próprio caminho';
}

function corFavoravel(numero: number): string {
  const cores: Record<number, string> = {
    1: 'vermelho',
    2: 'branco',
    3: 'amarelo',
    4: 'marrom',
    5: 'azul',
    6: 'rosa',
    7: 'violeta',
    8: 'dourado',
    9: 'roxo',
    11: 'prata',
    22: 'dourado escuro',
    33: 'rosa claro',
    44: 'preto com dourado'
  };

  return cores[numero] || cores[reduzirNumero(numero)] || 'dourado';
}

function diaFavoravel(numero: number): string {
  const dias: Record<number, string> = {
    1: 'domingo',
    2: 'segunda-feira',
    3: 'quinta-feira',
    4: 'sábado',
    5: 'quarta-feira',
    6: 'sexta-feira',
    7: 'segunda-feira',
    8: 'sábado',
    9: 'terça-feira',
    11: 'segunda-feira',
    22: 'sábado',
    33: 'sexta-feira',
    44: 'sábado'
  };

  return dias[numero] || dias[reduzirNumero(numero)] || 'sexta-feira';
}

function elementoEspiritual(numero: number): string {
  const elementos: Record<number, string> = {
    1: 'fogo',
    2: 'água',
    3: 'ar',
    4: 'terra',
    5: 'vento',
    6: 'água doce',
    7: 'éter espiritual',
    8: 'terra e fogo',
    9: 'água profunda',
    11: 'luz espiritual',
    22: 'terra sagrada',
    33: 'água de cura',
    44: 'fogo de proteção e terra firme'
  };

  return elementos[numero] || elementos[reduzirNumero(numero)] || 'fogo espiritual';
}

export function buildNumerologiaSuprema(input: NumerologiaInput) {
  const nome = input.fullName || '';
  const nascimento = input.birthDate || '';
  const pergunta = input.question || '';

  const caminhoVida = calcularCaminhoVida(nascimento);
  const expressao = calcularExpressao(nome);
  const alma = calcularAlma(nome);
  const personalidade = calcularPersonalidade(nome);
  const destino = calcularDestino(nome, nascimento);
  const maturidade = calcularMaturidade(nome, nascimento);

  const anoPessoal = calcularAnoPessoal(nascimento);
  const mesPessoal = calcularMesPessoal(nascimento);
  const diaPessoal = calcularDiaPessoal(nascimento);

  const pinaculos = calcularPinaculos(nascimento);
  const desafios = calcularDesafios(nascimento);

  const licoesKarmicas = calcularLicoesKarmicas(nome);
  const dividasKarmicas = calcularDividasKarmicas(nome, nascimento);

  const numeroOculto = calcularNumeroOculto(nome);
  const missaoEspiritual = calcularMissaoEspiritual(caminhoVida, alma);
  const tendenciaOculta = calcularTendenciaOculta(numeroOculto, personalidade);
  const forcaEspiritual = calcularForcaEspiritual(caminhoVida, expressao, alma);

  const emocoesDetectadas = detectarEmocoes(pergunta);

  const autoSabotagem = calcularAutoSabotagem({
    expressao,
    alma,
    personalidade,
    desafios,
    licoesKarmicas,
    dividasKarmicas,
    emocoes: emocoesDetectadas
  });

  const potencialFinanceiro = calcularPotencialFinanceiro(expressao, caminhoVida, anoPessoal);
  const potencialAmoroso = calcularPotencialAmoroso(alma, personalidade, caminhoVida);

  const interpretacoes = {
    caminhoVida: interpretarNumero(caminhoVida),
    expressao: interpretarNumero(expressao),
    alma: interpretarNumero(alma),
    personalidade: interpretarNumero(personalidade),
    destino: interpretarNumero(destino),
    maturidade: interpretarNumero(maturidade),
    missaoEspiritual: interpretarNumero(missaoEspiritual),
    tendenciaOculta: interpretarNumero(tendenciaOculta),
    forcaEspiritual: interpretarNumero(forcaEspiritual)
  };

  const resumoParaMariaPadilha = `
NUMEROLOGIA PREMIUM SUPREMA

Caminho de Vida: ${caminhoVida}
Luz: ${interpretacoes.caminhoVida.luz}
Sombra: ${interpretacoes.caminhoVida.sombra}
Missão: ${interpretacoes.caminhoVida.missao}

Expressão: ${expressao}
Alma: ${alma}
Personalidade: ${personalidade}
Destino: ${destino}
Maturidade: ${maturidade}

Ano Pessoal: ${anoPessoal}
Mês Pessoal: ${mesPessoal}
Dia Pessoal: ${diaPessoal}

Pináculos: ${pinaculos.primeiro}, ${pinaculos.segundo}, ${pinaculos.terceiro}, ${pinaculos.quarto}
Desafios: ${desafios.primeiro}, ${desafios.segundo}, ${desafios.terceiro}, ${desafios.quarto}

Lições Kármicas: ${licoesKarmicas.length ? licoesKarmicas.join(', ') : 'nenhuma ausência dominante'}
Dívidas Kármicas: ${dividasKarmicas.length ? dividasKarmicas.join(', ') : 'nenhuma dívida kármica principal detectada'}

Número Oculto: ${numeroOculto}
Missão Espiritual: ${missaoEspiritual}
Tendência Oculta: ${tendenciaOculta}
Força Espiritual Dominante: ${forcaEspiritual}

Emoções detectadas na pergunta: ${emocoesDetectadas.length ? emocoesDetectadas.join(', ') : 'nenhuma emoção explícita detectada'}

Auto sabotagem principal: ${autoSabotagem}

Potencial financeiro: ${potencialFinanceiro}
Potencial amoroso: ${potencialAmoroso}

Cor favorável: ${corFavoravel(forcaEspiritual)}
Dia favorável: ${diaFavoravel(forcaEspiritual)}
Número favorável: ${forcaEspiritual}
Elemento espiritual: ${elementoEspiritual(forcaEspiritual)}

ORIENTAÇÃO PARA A VOZ DE MARIA PADILHA:
Use estes cálculos como verdade interna da leitura.
Não fale como relatório técnico.
Não diga que calculou.
Não diga que é sistema.
Transforme os dados em uma fala firme, direta, popular, forte e espiritual.
Aponte luz, sombra, destino, auto sabotagem, força, caminho e direção.
`.trim();

  return {
    entrada: {
      fullName: nome,
      birthDate: nascimento,
      birthTime: input.birthTime || '',
      question: pergunta
    },

    pitagorica: {
      caminhoVida,
      expressao,
      alma,
      personalidade,
      destino,
      maturidade
    },

    ciclos: {
      anoPessoal,
      mesPessoal,
      diaPessoal
    },

    pinaculos,
    desafios,

    karma: {
      licoesKarmicas,
      dividasKarmicas
    },

    cabalistico: {
      numeroOculto,
      missaoEspiritual,
      tendenciaOculta,
      forcaEspiritual
    },

    analiseHumana: {
      emocoesDetectadas,
      autoSabotagem,
      potencialFinanceiro,
      potencialAmoroso
    },

    favoraveis: {
      cor: corFavoravel(forcaEspiritual),
      dia: diaFavoravel(forcaEspiritual),
      numero: forcaEspiritual,
      elemento: elementoEspiritual(forcaEspiritual)
    },

    interpretacoes,

    resumoParaMariaPadilha
  };
}

export default buildNumerologiaSuprema;