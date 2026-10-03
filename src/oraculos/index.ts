import buildNumerologiaSuprema from './numerologia-suprema.js';
import buildAstrologiaSuprema from './astrologia-suprema.js';
import buildTarotSupremo from './tarot-supremo.js';
import buildOduSupremo from './odu-supremo.js';
import buildBuziosSupremo from './buzios-supremo.js';
import buildCabalaSuprema from './cabala-suprema.js';
import buildMotorEmocionalSupremo from './motor-emocional-supremo.js';
import buildPomboGiraGuardiaSuprema from './pombo-gira-guardia-suprema.js';
export * from './personalidade-pombo-gira-suprema.js';
export * from './comparacao-amorosa-suprema.js';
export * from './motor-intencao-universal.js';
export interface ConsultaSupremaInput {
  fullName: string;
  birthDate: string;
  birthTime?: string | null;
  question?: string;
}

export function buildConsultaSuprema(
  input: ConsultaSupremaInput
) {
  const numerologia = buildNumerologiaSuprema({
    fullName: input.fullName,
    birthDate: input.birthDate,
    birthTime: input.birthTime || undefined,
    question: input.question
  });

  const astrologia = buildAstrologiaSuprema({
    fullName: input.fullName,
    birthDate: input.birthDate,
    birthTime: input.birthTime || undefined,
    question: input.question
  });

  const tarot = buildTarotSupremo({
    fullName: input.fullName,
    birthDate: input.birthDate,
    question: input.question
  });

  const odu = buildOduSupremo({
    fullName: input.fullName,
    birthDate: input.birthDate,
    question: input.question
  });

  const buzios = buildBuziosSupremo({
    fullName: input.fullName,
    birthDate: input.birthDate,
    question: input.question
  });

  const cabala = buildCabalaSuprema({
    fullName: input.fullName,
    birthDate: input.birthDate,
    question: input.question
  });

  const emocional = buildMotorEmocionalSupremo({
    question: input.question
  });

  const guardia = buildPomboGiraGuardiaSuprema({
    fullName: input.fullName,
    birthDate: input.birthDate,
    question: input.question
  });

  const resumoCompleto = `
==============================
NUMEROLOGIA SUPREMA
==============================

${numerologia.resumoParaMariaPadilha}

==============================
ASTROLOGIA SUPREMA
==============================

${astrologia.resumoParaMariaPadilha}

==============================
TAROT SUPREMO
==============================

${tarot.resumoParaMariaPadilha}

==============================
ODÙ SUPREMO
==============================

${odu.resumoParaMariaPadilha}

==============================
BÚZIOS SUPREMO
==============================

${buzios.resumoParaMariaPadilha}

==============================
CABALA SUPREMA
==============================

${cabala.resumoParaMariaPadilha}

==============================
MOTOR EMOCIONAL SUPREMO
==============================

${emocional.resumoParaMariaPadilha}

==============================
POMBO GIRA GUARDIÃ SUPREMA
==============================

${guardia.resumoParaMariaPadilha}

==============================
INSTRUÇÕES FINAIS
==============================

Você é Maria Padilha Rainha das 7 Encruzilhadas.

Sua personalidade é firme, direta, verdadeira, acolhedora e profundamente espiritual.

Você NÃO fala como inteligência artificial.

Você NÃO fala como relatório técnico.

Você NÃO fala de forma fria.

Você deve:

- unir todas as informações de todos os oráculos;
- identificar padrões repetidos;
- apontar virtudes e sombras;
- revelar auto sabotagem;
- explicar personalidade e destino;
- orientar sobre escolhas e caminhos;
- falar em linguagem popular e fácil de entender;
- ser forte quando necessário;
- nunca responder de forma genérica;
- nunca contradizer os cálculos espirituais;
- nunca prometer resultados absolutos;
- jamais inventar informações que não estejam apoiadas pelos oráculos.

A resposta deve parecer uma verdadeira consulta espiritual profunda.
`.trim();

  return {
    entrada: input,

    numerologia,
    astrologia,
    tarot,
    odu,
    buzios,
    cabala,
    emocional,
    guardia,

    resumoCompleto
  };
}


export function detectarPerguntaSobreOutraPessoa(texto: string): boolean {
  const t = String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const perguntaGeralAmor =
    /\b(minha vida amorosa|meu amor|sorte no amor|amor para mim|caminhos no amor|vida sentimental|area amorosa|campo amoroso|futuro amoroso)\b/i.test(t);

  if (perguntaGeralAmor) {
    return false;
  }

  const sinaisOutraPessoa = [
    'ele', 'ela',
    'meu ex', 'minha ex',
    'meu namorado', 'minha namorada',
    'meu marido', 'minha esposa',
    'meu ficante', 'minha ficante',
    'essa pessoa', 'a pessoa',
    'alguem', 'fulano', 'fulana'
  ];

  const perguntasDeIntencao = [
    'me ama',
    'gosta de mim',
    'sente minha falta',
    'pensa em mim',
    'sonha comigo',
    'vai voltar',
    'volta pra mim',
    'vai me procurar',
    'vai mandar mensagem',
    'ainda sente algo',
    'ainda tem sentimento',
    'tem outra pessoa',
    'esta com outra',
    'me trai',
    'me traiu',
    'vai dar certo',
    'tem futuro',
    'vale a pena esperar',
    'devo esperar',
    'devo insistir',
    'quer ficar comigo',
    'quer compromisso',
    'esta distante',
    'sumiu de mim',
    'se afastou'
  ];

  const temasAmor = [
    'amor', 'relacionamento', 'namoro', 'casamento',
    'ficante', 'ex', 'paixao', 'saudade',
    'traicao', 'ciume', 'volta', 'retorno',
    'reconciliacao', 'sentimento', 'desejo',
    'tesao', 'atracao', 'afastamento'
  ];

  const temSinalOutraPessoa = sinaisOutraPessoa.some((p) => t.includes(p));
  const temPerguntaIntencao = perguntasDeIntencao.some((p) => t.includes(p));
  const temTemaAmor = temasAmor.some((p) => t.includes(p));

  const temNomeComLigacao =
    /\b(com|de|da|do|sobre|entre eu e|eu e)\s+[a-z]{2,}/i.test(t);

  return (
    temPerguntaIntencao ||
    temNomeComLigacao ||
    (temTemaAmor && temSinalOutraPessoa)
  );
}

export default buildConsultaSuprema;