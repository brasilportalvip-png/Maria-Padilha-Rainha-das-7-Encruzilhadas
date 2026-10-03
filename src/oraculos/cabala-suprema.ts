export interface CabalaInput {
  fullName: string;
  birthDate: string;
  question?: string;
}

const ANJOS = [
  'Vehuiah', 'Jeliel', 'Sitael', 'Elemiah', 'Mahasiah', 'Lelahel',
  'Achaiah', 'Cahetel', 'Haziel', 'Aladiah', 'Lauviah', 'Hahaiah',
  'Mebahel', 'Hariel', 'Hekamiah', 'Caliel', 'Leuviah', 'Pahaliah',
  'Nelchael', 'Ieiaiel', 'Melahel', 'Haheuiah', 'Nith-Haiah', 'Haaiah'
];

const SEPHIROT = [
  {
    nome: 'Kether',
    traducao: 'Coroa',
    luz: 'conexão espiritual elevada, comando interno e chamado de alma.',
    sombra: 'orgulho espiritual, isolamento e dificuldade de aceitar orientação.',
    missao: 'usar a força espiritual com humildade e direção.'
  },
  {
    nome: 'Chokmah',
    traducao: 'Sabedoria',
    luz: 'visão ampla, inspiração, intuição e força criadora.',
    sombra: 'impulso sem planejamento e excesso de confiança.',
    missao: 'transformar inspiração em atitude com consciência.'
  },
  {
    nome: 'Binah',
    traducao: 'Entendimento',
    luz: 'maturidade, limite, responsabilidade e sabedoria profunda.',
    sombra: 'rigidez, tristeza escondida e cobrança excessiva.',
    missao: 'amadurecer sem endurecer o coração.'
  },
  {
    nome: 'Chesed',
    traducao: 'Misericórdia',
    luz: 'generosidade, expansão, proteção e abertura de caminhos.',
    sombra: 'exagero, promessa demais e falta de limite.',
    missao: 'ajudar sem se perder nem alimentar abuso.'
  },
  {
    nome: 'Geburah',
    traducao: 'Força',
    luz: 'corte, justiça, coragem, defesa espiritual e firmeza.',
    sombra: 'dureza, raiva, julgamento pesado e briga desnecessária.',
    missao: 'usar a força para proteger, não para ferir.'
  },
  {
    nome: 'Tiphereth',
    traducao: 'Beleza',
    luz: 'equilíbrio, coração, brilho, cura e harmonia espiritual.',
    sombra: 'vaidade, necessidade de aprovação e medo de rejeição.',
    missao: 'brilhar com verdade sem depender do olhar dos outros.'
  },
  {
    nome: 'Netzach',
    traducao: 'Vitória',
    luz: 'amor, desejo, conquista, magnetismo e força afetiva.',
    sombra: 'ciúme, apego, disputa e dependência emocional.',
    missao: 'vencer no amor sem perder a própria dignidade.'
  },
  {
    nome: 'Hod',
    traducao: 'Glória',
    luz: 'comunicação, inteligência, estratégia e clareza mental.',
    sombra: 'mentira, confusão, ansiedade e palavra usada sem firmeza.',
    missao: 'usar a palavra para abrir caminhos, não para criar nós.'
  },
  {
    nome: 'Yesod',
    traducao: 'Fundamento',
    luz: 'sonhos, memória espiritual, intuição, mediunidade e base emocional.',
    sombra: 'ilusão, medo, devaneios e apego a lembranças antigas.',
    missao: 'separar intuição verdadeira de medo emocional.'
  },
  {
    nome: 'Malkuth',
    traducao: 'Reino',
    luz: 'realização, corpo, dinheiro, trabalho, casa e manifestação concreta.',
    sombra: 'apego material, medo da escassez e prisão na rotina.',
    missao: 'trazer espiritualidade para a vida prática.'
  }
];

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

function somaTexto(texto: string): number {
  return String(texto || '')
    .split('')
    .reduce((soma, char) => soma + char.charCodeAt(0), 0);
}

function reduzirParaIndice(valor: number, tamanho: number): number {
  return Math.abs(valor) % tamanho;
}

function detectarTema(pergunta: string): string {
  const t = normalizar(pergunta);

  if (t.includes('amor') || t.includes('ex') || t.includes('relacionamento')) return 'amor';
  if (t.includes('dinheiro') || t.includes('trabalho') || t.includes('prosperidade')) return 'prosperidade';
  if (t.includes('espiritual') || t.includes('guia') || t.includes('entidade')) return 'espiritualidade';
  if (t.includes('familia') || t.includes('filho') || t.includes('casa')) return 'família';
  if (t.includes('justica') || t.includes('processo') || t.includes('verdade')) return 'justiça';

  return 'geral';
}

function selecionarAnjo(nome: string, nascimento: string, pergunta: string): string {
  const base = somaTexto(limparNome(nome)) + somaTexto(nascimento) + somaTexto(normalizar(pergunta));
  return ANJOS[reduzirParaIndice(base, ANJOS.length)];
}

function selecionarSephirah(nome: string, nascimento: string, pergunta: string) {
  const base = somaTexto(nascimento + limparNome(nome)) + somaTexto(normalizar(pergunta)) + 9;
  return SEPHIROT[reduzirParaIndice(base, SEPHIROT.length)];
}

function selecionarCorrecao(sephirah: any, tema: string): string {
  if (tema === 'amor') {
    return `No amor, a correção passa por ${sephirah.missao}`;
  }

  if (tema === 'prosperidade') {
    return `Na prosperidade, a correção passa por colocar ordem, limite e atitude prática onde existe dispersão.`;
  }

  if (tema === 'espiritualidade') {
    return `Na espiritualidade, a correção passa por fortalecer fé, disciplina e escuta lúcida dos sinais sem ilusões.`;
  }

  return `A correção principal passa por ${sephirah.missao}`;
}

export function buildCabalaSuprema(input: CabalaInput) {
  const nome = input.fullName || '';
  const nascimento = input.birthDate || '';
  const pergunta = input.question || '';

  const tema = detectarTema(pergunta);

  const anjoGuardiao = selecionarAnjo(nome, nascimento, pergunta);
  const sephirah = selecionarSephirah(nome, nascimento, pergunta);
  const correcaoEspiritual = selecionarCorrecao(sephirah, tema);

  const resumoParaMariaPadilha = `
CABALA PREMIUM SUPREMA

Tema detectado: ${tema}

ANJO GUARDIÃO ENERGÉTICO:
${anjoGuardiao}

SEPHIRAH DOMINANTE:
${sephirah.nome} — ${sephirah.traducao}

Luz: ${sephirah.luz}
Sombra: ${sephirah.sombra}
Missão: ${sephirah.missao}

Correção espiritual:
${correcaoEspiritual}

ORIENTAÇÃO PARA A VOZ DE MARIA PADILHA:
Use a Cabala como bastidor espiritual.
Não fale como relatório técnico.
Não diga que calculou.
Não diga que sorteou.
Não transforme em aula.
Use como leitura de missão, correção, proteção, equilíbrio, justiça, força e evolução.
Fale com firmeza, clareza, espiritualidade e linguagem popular.
`.trim();

  return {
    entrada: {
      fullName: nome,
      birthDate: nascimento,
      question: pergunta
    },

    tema,

    cabala: {
      anjoGuardiao,
      sephirah,
      correcaoEspiritual
    },

    resumoParaMariaPadilha
  };
}

export default buildCabalaSuprema;