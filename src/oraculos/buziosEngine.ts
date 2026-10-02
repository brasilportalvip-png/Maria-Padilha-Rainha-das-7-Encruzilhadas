import type { BuziosResult } from '../types/spiritual.js';
import crypto from 'crypto';

interface OduData {
  number: number;
  name: string;
  energy: string;
  advice: string;
  shadow: string;
}

export const MERINDILOGUN_ODUS: Record<number, OduData> = {
  0: {
    number: 0,
    name: 'Òpìrà',
    energy: 'Fechamento momentâneo, silêncio absoluto e necessidade de proteção.',
    advice: 'Não tome decisões precipitadas nem revele seus planos. O momento pede recolhimento e respeito aos limites da vida.',
    shadow: 'Teimosia, cegueira voluntária e desobediência a avisos espirituais.'
  },
  1: {
    number: 1,
    name: 'Òkànràn',
    energy: 'Fogo, contestação, verdade cortante e revelação de disputas.',
    advice: 'Fale apenas o estritamente necessário. O que incomoda deve ser enfrentado com cabeça fria e palavras limpas.',
    shadow: 'Brigas impulsivas, ciúme explosivo e teimosia em disputar o que não vale a pena.'
  },
  2: {
    number: 2,
    name: 'Èjìòkò',
    energy: 'Dualidade, aliança, decisão entre dois caminhos e equilíbrio.',
    advice: 'Busque acordos justos. A vida pede que você não carregue o mundo sozinho; divida o peso com quem é leal.',
    shadow: 'Indecisão paralisante e apego a quem não demonstra reciprocidade.'
  },
  3: {
    number: 3,
    name: 'Ètá Ògúndá',
    energy: 'Trabalho, força de corte, avanço com luta e ferramenta na mão.',
    advice: 'A vitória só vem pelo movimento prático. Pare de aguardar sinais miraculosos e execute o plano.',
    shadow: 'Cansaço excessivo, agressividade e insistência em batalhas estéreis.'
  },
  4: {
    number: 4,
    name: 'Ìrosùn',
    energy: 'Ancestralidade, sangue, visão espiritual e profundidade emocional.',
    advice: 'Honre sua história e seus antepassados, mas não repita sofrimentos antigos como se fossem sua sina.',
    shadow: 'Mágoa guardada, ressentimento e desconfiança exagerada.'
  },
  5: {
    number: 5,
    name: 'Òsé',
    energy: 'Águas doces, encanto, fertilidade, amor e magnetismo.',
    advice: 'Cuide da sua autoestima e da sua imagem. O encanto é uma força sagrada quando aliada à dignidade.',
    shadow: 'Carência que se humilha, ilusões amorosas e dependência afetiva.'
  },
  6: {
    number: 6,
    name: 'Òbàrà',
    energy: 'Prosperidade, fartura, palavra forte e virada de sorte.',
    advice: 'Sua palavra atrai caminhos. Não fale em miséria nem se diminua para agradar quem não vibra com seu sucesso.',
    shadow: 'Soberba, ostentação e promessas que a boca faz e o bolso não cumpre.'
  },
  7: {
    number: 7,
    name: 'Òdí',
    energy: 'Defesa, muralha, firmeza espiritual e fechamento de corpo.',
    advice: 'Selecione quem entra na sua casa e na sua intimidade. Proteger-se também é saber fechar portas com educação.',
    shadow: 'Isolamento amargo e resistência em pedir ajuda.'
  },
  8: {
    number: 8,
    name: 'Èjì Ogbè',
    energy: 'Luz pura, nascimento de novos horizontes e clareza de visão.',
    advice: 'Confie na sua clareza de pensamento. O caminho abre quando você para de duvidar da sua capacidade.',
    shadow: 'Ansiedade pelo amanhã e excesso de confiança em promessas fáceis.'
  },
  9: {
    number: 9,
    name: 'Òsá',
    energy: 'Ventos, mudanças imprevistas, força feminina e virada de ciclo.',
    advice: 'Aceite o vento que limpa a poeira. Algumas despedidas são o melhor presente que o destino pode te dar.',
    shadow: 'Instabilidade emocional e medo de abraçar o novo.'
  },
  10: {
    number: 10,
    name: 'Òfún',
    energy: 'Paz, maturidade, encerramento de velhas dores e respeito ao sagrado.',
    advice: 'Mantenha a pureza e o respeito nas suas ações. A tranquilidade vale mais do que qualquer vitória suja.',
    shadow: 'Negação do tempo e teimosia em revirar o passado.'
  },
  11: {
    number: 11,
    name: 'Òwónrín',
    energy: 'Encruzilhada, movimento de troca e oportunidade rápida.',
    advice: 'Esteja atento às oportunidades que surgem sem aviso. A sorte favorece quem está pronto para agir.',
    shadow: 'Desatenção, desperdício e caminhos trocados por afobação.'
  },
  12: {
    number: 12,
    name: 'Èjìlá Seborà',
    energy: 'Justiça rápida, honra, vitória sobre calúnias e firmeza.',
    advice: 'Não tema intrigas alheias. Quem anda com a verdade no peito não tropeça na mentira dos outros.',
    shadow: 'Sentimento de perseguição e desejo de vingança.'
  },
  13: {
    number: 13,
    name: 'Òyèkú',
    energy: 'Paciência, ancestralidade profunda e renovação através da calma.',
    advice: 'Não force a brotar o que ainda está sob a terra fria. Respeite os tempos de descanso e regeneração.',
    shadow: 'Melancolia e apego a perdas do passado.'
  },
  14: {
    number: 14,
    name: 'Ìká',
    energy: 'Vigilância, astúcia sábia e corte de ilusões perigosas.',
    advice: 'Abra os olhos diante de elogios fáceis. Sabedoria é saber discernir o mel da cilada.',
    shadow: 'Maldade, manipulação ou paranoia sem fundamento.'
  },
  15: {
    number: 15,
    name: 'Òbèògúndá',
    energy: 'Superação de desafios, cura de feridas e persistência com fé.',
    advice: 'Você já sobreviveu a dores maiores. Aproxime-se da sua fé e continue caminhando com firmeza.',
    shadow: 'Autossabotagem e desânimo antes da hora da colheita.'
  },
  16: {
    number: 16,
    name: 'Àlàáfíà',
    energy: 'Bênção total, céu aberto, confirmação positiva e serenidade.',
    advice: 'Agradeça pelo que já tem e receba as boas novas com coração aberto. Mantenha os pés no chão e viva com alegria.',
    shadow: 'Acomodação ingênua e desleixo com as obrigações da matéria.'
  },
};

export function throwBuzios(): BuziosResult {
  const shellsCount = 16;
  const shellsOpenIndices: number[] = [];
  const shellsClosedIndices: number[] = [];

  for (let i = 0; i < shellsCount; i++) {
    // 50% cryptographic chance per shell
    const isOpen = crypto.randomInt(0, 2) === 1;
    if (isOpen) {
      shellsOpenIndices.push(i + 1);
    } else {
      shellsClosedIndices.push(i + 1);
    }
  }

  const openCount = shellsOpenIndices.length;
  const odu = MERINDILOGUN_ODUS[openCount] || MERINDILOGUN_ODUS[8];

  return {
    openCount,
    closedCount: shellsClosedIndices.length,
    oduName: odu.name,
    oduEnergy: odu.energy,
    oduAdvice: odu.advice,
    oduShadow: odu.shadow,
    shellsOpenIndices,
    shellsClosedIndices,
  };
}
