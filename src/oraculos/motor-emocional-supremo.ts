export interface MotorEmocionalInput {
  question?: string;
}

function normalizar(texto: string): string {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const PADROES_EMOCIONAIS = [
  {
    chave: 'orgulho',
    termos: ['orgulho', 'orgulhoso', 'orgulhosa', 'não vou atrás', 'nao vou atras'],
    luz: 'força própria, dignidade e capacidade de não se humilhar.',
    sombra: 'dificuldade de ceder, pedir ajuda ou reconhecer erro.',
    orientacao: 'ter postura não é endurecer o coração.'
  },
  {
    chave: 'teimosia',
    termos: ['teimosia', 'teimoso', 'teimosa', 'insisto', 'não largo', 'nao largo'],
    luz: 'persistência, firmeza e resistência.',
    sombra: 'insistir em caminho que já mostrou desgaste.',
    orientacao: 'persistência abre caminho; teimosia repete dor.'
  },
  {
    chave: 'procrastinação',
    termos: ['procrastino', 'deixo para depois', 'adiando', 'enrolo'],
    luz: 'capacidade de pensar antes de agir.',
    sombra: 'medo escondido de começar ou de errar.',
    orientacao: 'comece pequeno, mas comece.'
  },
  {
    chave: 'ansiedade',
    termos: ['ansiedade', 'ansioso', 'ansiosa', 'aflito', 'aflita', 'desespero'],
    luz: 'sensibilidade para perceber movimentos antes dos outros.',
    sombra: 'sofrer antes da hora e imaginar perdas que ainda não aconteceram.',
    orientacao: 'não entregue sua paz para um futuro que ainda não chegou.'
  },
  {
    chave: 'medo',
    termos: ['medo', 'receio', 'tenho medo', 'inseguro', 'insegura'],
    luz: 'instinto de proteção e prudência.',
    sombra: 'paralisação, fuga e fechamento dos caminhos.',
    orientacao: 'medo pode avisar, mas não deve mandar.'
  },
  {
    chave: 'dependência emocional',
    termos: ['não vivo sem', 'nao vivo sem', 'dependo', 'preciso dele', 'preciso dela'],
    luz: 'capacidade de amar profundamente.',
    sombra: 'colocar outra pessoa acima da própria dignidade.',
    orientacao: 'amor não exige que você se abandone.'
  },
  {
    chave: 'carência',
    termos: ['carente', 'carência', 'carencia', 'sozinho', 'sozinha', 'ninguém me ama', 'ninguem me ama'],
    luz: 'necessidade verdadeira de afeto e acolhimento.',
    sombra: 'aceitar pouco por medo de ficar só.',
    orientacao: 'não aceite migalha como se fosse banquete.'
  },
  {
    chave: 'impulsividade',
    termos: ['impulso', 'impulsivo', 'impulsiva', 'faço sem pensar', 'faco sem pensar'],
    luz: 'coragem de agir e romper bloqueios.',
    sombra: 'agir no calor da emoção e depois colher arrependimento.',
    orientacao: 'antes de agir, respire e veja se é força ou descontrole.'
  },
  {
    chave: 'baixa autoestima',
    termos: ['não sou suficiente', 'nao sou suficiente', 'sem valor', 'me sinto menor'],
    luz: 'humildade e sensibilidade.',
    sombra: 'se diminuir e permitir que outros ditem seu valor.',
    orientacao: 'quem não reconhece o próprio valor se entrega barato.'
  },
  {
    chave: 'vitimismo',
    termos: ['tudo comigo', 'só sofro', 'so sofro', 'ninguém me ajuda', 'ninguem me ajuda'],
    luz: 'dor real pedindo acolhimento.',
    sombra: 'ficar preso na dor e perder a força de reagir.',
    orientacao: 'acolha sua dor, mas não faça dela sua morada.'
  },
  {
    chave: 'necessidade de controle',
    termos: ['controlar', 'controle', 'preciso saber tudo', 'quero mandar'],
    luz: 'organização, proteção e busca por segurança.',
    sombra: 'sufocar pessoas, caminhos e oportunidades.',
    orientacao: 'controle demais fecha até porta que estava aberta.'
  },
  {
    chave: 'ciúme',
    termos: ['ciúme', 'ciume', 'ciumento', 'ciumenta'],
    luz: 'desejo de proteger o vínculo.',
    sombra: 'medo de perder, comparação e desconfiança.',
    orientacao: 'ciúme não prova amor; muitas vezes revela insegurança.'
  },
  {
    chave: 'perfeccionismo',
    termos: ['perfeccionismo', 'perfeito', 'nunca está bom', 'nunca esta bom'],
    luz: 'cuidado, zelo e vontade de fazer bem feito.',
    sombra: 'cobrança pesada, atraso e medo de errar.',
    orientacao: 'feito com verdade vale mais que perfeito nunca terminado.'
  },
  {
    chave: 'resistência à mudança',
    termos: ['não consigo mudar', 'nao consigo mudar', 'dificuldade de mudar', 'tenho medo de mudar'],
    luz: 'busca por segurança e estabilidade.',
    sombra: 'ficar preso em ciclo velho por medo do novo.',
    orientacao: 'mudança assusta, mas permanecer onde dói também cobra preço.'
  },
  {
    chave: 'insegurança',
    termos: ['insegurança', 'inseguranca', 'inseguro', 'insegura'],
    luz: 'cuidado antes de decidir.',
    sombra: 'duvidar de si mesmo e entregar poder aos outros.',
    orientacao: 'quando você duvida demais de si, qualquer pessoa te confunde.'
  },
  {
    chave: 'dificuldade de perdoar',
    termos: ['não perdoo', 'nao perdoo', 'mágoa', 'magoa', 'ressentimento'],
    luz: 'memória de dor que tenta proteger você.',
    sombra: 'carregar peso antigo e continuar preso a quem feriu.',
    orientacao: 'perdoar não é aceitar abuso; é parar de carregar o veneno.'
  }
];

export function buildMotorEmocionalSupremo(input: MotorEmocionalInput) {
  const pergunta = input.question || '';
  const texto = normalizar(pergunta);

  const detectados = PADROES_EMOCIONAIS.filter((padrao) =>
    padrao.termos.some((termo) => texto.includes(normalizar(termo)))
  );

  const principal = detectados[0] || {
    chave: 'emoção oculta não explícita',
    luz: 'existe uma emoção escondida por trás da pergunta.',
    sombra: 'a pessoa pode não estar dizendo tudo o que sente.',
    orientacao: 'olhe para o que a pergunta esconde, não apenas para o que ela mostra.'
  };

  const resumoParaMariaPadilha = `
MOTOR EMOCIONAL SUPREMO

Pergunta do consulente:
${pergunta || 'não informada'}

Padrões emocionais detectados:
${detectados.length ? detectados.map((p) => p.chave).join(', ') : 'nenhum padrão explícito detectado'}

Padrão emocional principal:
${principal.chave}

Luz:
${principal.luz}

Sombra:
${principal.sombra}

Orientação:
${principal.orientacao}

ORIENTAÇÃO PARA A VOZ DE MARIA PADILHA:
Use este motor para entender a pergunta escondida atrás da pergunta.
Não fale como relatório técnico.
Não diga que detectou padrão emocional.
Transforme a leitura em fala firme, humana, direta e espiritual.
Aponte auto sabotagem, medo, orgulho, carência, teimosia ou ansiedade quando aparecer.
Fale com verdade, mas sem humilhar o consulente.
`.trim();

  return {
    entrada: {
      question: pergunta
    },

    emocional: {
      detectados,
      principal
    },

    resumoParaMariaPadilha
  };
}

export default buildMotorEmocionalSupremo;