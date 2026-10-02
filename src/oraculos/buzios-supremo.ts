export interface BuziosInput {
  fullName: string;
  birthDate: string;
  question?: string;
}



const QUEDAS_BUZIOS = [
  {
    queda: 1,
    nome: 'OKÀRÁN',
    nomeIfa: 'OGBÊ',
    significado: 'Odú de movimento forte, abertura difícil, conflito, choque, pressa e caminhos que precisam ser limpos antes de avançar.',
    luz: 'força para romper bloqueios, coragem, reação rápida, proteção de Èsú e abertura depois da limpeza.',
    sombra: 'brigas, impulsividade, acidentes, caminhos fechados, confusão, inimigos e decisões tomadas no calor do momento.',
    conselho: 'não aja por impulso. Primeiro limpe os caminhos, firme a cabeça e só depois avance.',
    traducao: 'Odú ligado à primeira força de movimento, palavra inicial, abertura e choque de caminhos.',
    orixas: ['Èsú'],
    cores: ['vermelho', 'preto', 'branco']
  },

  {
    queda: 2,
    nome: 'EJIOKÔ',
    nomeIfa: 'OYEKÚ',
    significado: 'Odú de dualidade, parceria, oposição, equilíbrio entre duas forças e necessidade de confirmação.',
    luz: 'união, acordo, parceria, apoio espiritual, proteção familiar e possibilidade de conciliação.',
    sombra: 'dúvida, indecisão, dependência, disputa entre duas pessoas ou dois caminhos.',
    conselho: 'observe os dois lados da situação antes de decidir. Nem tudo deve ser resolvido pela força.',
    traducao: 'Representa duas forças atuando juntas ou em oposição.',
    orixas: ['Ibeji', 'Ogum'],
    cores: ['azul', 'branco']
  },

  {
    queda: 3,
    nome: 'ETAOGUNDÁ',
    nomeIfa: 'IWORÍ',
    significado: 'Odú de luta, guerra, ferro, esforço, disputa, trabalho duro e conquista por resistência.',
    luz: 'vitória, coragem, força para vencer demandas, energia de trabalho e capacidade de superar obstáculos.',
    sombra: 'brigas, agressividade, perseguição, cansaço, guerra declarada e excesso de dureza.',
    conselho: 'lute pelo que é seu, mas não transforme tudo em guerra.',
    traducao: 'Representa a força guerreira que corta, abre e enfrenta.',
    orixas: ['Ogum'],
    cores: ['verde', 'azul escuro', 'vermelho']
  },

  {
    queda: 4,
    nome: 'IÒRÓSÚN',
    nomeIfa: 'ODÍ',
    significado: 'Odú de ancestralidade, sangue, mistério, ligação com Egun, profundidade espiritual e cobranças antigas.',
    luz: 'mediunidade, proteção ancestral, sabedoria dos mais velhos, revelação espiritual e força oculta.',
    sombra: 'doença, tristeza, demandas espirituais, peso ancestral, feitiço e energias paradas.',
    conselho: 'honre seus ancestrais e cuide da espiritualidade antes de buscar respostas materiais.',
    traducao: 'Está ligado ao sangue, origem, mistério e ancestralidade.',
    orixas: ['Oyá', 'Omolu', 'Egun'],
    cores: ['vermelho', 'branco', 'preto']
  },

  {
    queda: 5,
    nome: 'OSÊ',
    nomeIfa: 'IÒRÒSÚN',
    significado: 'Odú de fertilidade, encanto, amor, riqueza, vaidade, dinheiro e movimento emocional.',
    luz: 'prosperidade, beleza, amor, fertilidade, ganhos, aproximações afetivas e caminhos doces.',
    sombra: 'vaidade, ilusão amorosa, bruxaria, desperdício, instabilidade emocional e excesso de desejo.',
    conselho: 'use seu encanto com sabedoria. Nem todo desejo merece ser seguido.',
    traducao: 'Representa fertilidade, doçura, prosperidade e poder de atração.',
    orixas: ['Oxum'],
    cores: ['amarelo', 'dourado', 'branco']
  },

  {
    queda: 6,
    nome: 'OBÀRÁ',
    nomeIfa: 'OWÓRIN',
    significado: 'Odú de riqueza, fala, expansão, oportunidade, inteligência prática e crescimento material.',
    luz: 'dinheiro, comunicação, abertura profissional, reconhecimento, negócios e expansão.',
    sombra: 'orgulho, ganância, fala excessiva, promessa vazia e perda por arrogância.',
    conselho: 'a prosperidade vem, mas precisa de humildade e direção.',
    traducao: 'Representa abundância, expansão e poder da palavra.',
    orixas: ['Xangô', 'Èsú'],
    cores: ['vermelho', 'branco', 'marrom']
  },

  {
    queda: 7,
    nome: 'ODÍ',
    nomeIfa: 'OBÀRÁ',
    significado: 'Odú de fechamento, prisão, proteção, segredo, corte, risco e necessidade de resguardo.',
    luz: 'proteção espiritual, quebra de demanda, encerramento necessário e defesa contra inimigos.',
    sombra: 'aprisionamento, feitiço, acidente, perseguição, isolamento, doença e caminhos travados.',
    conselho: 'não force portas fechadas. Proteja-se, limpe-se e espere o momento certo.',
    traducao: 'Representa fechamento, limite, defesa e recolhimento.',
    orixas: ['Èsú', 'Ogum'],
    cores: ['preto', 'vermelho', 'branco']
  },

  {
    queda: 8,
    nome: 'EJIÒNILÊ',
    nomeIfa: 'OKÀRÁN',
    significado: 'Odú de justiça, equilíbrio, verdade, cabeça, clareza e força ligada aos caminhos de Oxalá.',
    luz: 'organização, proteção superior, verdade revelada, justiça, equilíbrio e elevação espiritual.',
    sombra: 'doença, traição, pancadaria, rigidez, frieza e cobrança espiritual.',
    conselho: 'ande com verdade. O que estiver torto será mostrado.',
    traducao: 'Representa equilíbrio, ordem e força clara do alto.',
    orixas: ['Oxalá'],
    cores: ['branco']
  },

  {
    queda: 9,
    nome: 'OSÁ',
    nomeIfa: 'OGUNDÁ',
    significado: 'Odú de magia, sangue, força feminina, poder espiritual, transformação e influência de Egun.',
    luz: 'elevação espiritual, mediunidade, vitória, inteligência, progresso e força de transformação.',
    sombra: 'feitiçaria, quebra de tabu, aborto, trabalho espiritual negativo e instabilidade.',
    conselho: 'respeite seus limites espirituais. Nem toda força deve ser provocada.',
    traducao: 'Representa poder espiritual, sangue, transformação e domínio das forças ocultas.',
    orixas: ['Yemanjá', 'Xangô', 'Obá', 'Obatalá', 'Elegbara', 'Egun'],
    cores: ['vermelho', 'azul', 'branco']
  },

  {
    queda: 10,
    nome: 'ÒFÚN',
    nomeIfa: 'OSÁ',
    significado: 'Odú de pureza, mistério, longevidade, riqueza tardia, elevação e forte ligação com os Funfun.',
    luz: 'aquisição, riqueza, longevidade, aumento de energia, segurança, sucesso e credibilidade.',
    sombra: 'avareza, obsessão por riqueza, traição, desmoralização e perda de respeito público.',
    conselho: 'mantenha limpeza, clareza e humildade. O branco deve fortalecer sua caminhada.',
    traducao: 'Representa pureza, mistério, proibição e elevação espiritual.',
    orixas: ['Obatalá', 'Odùduwá', 'Oxum', 'Elegbara', 'Baba-Egun', 'Iroko'],
    cores: ['branco', 'cores claras']
  },

  {
    queda: 11,
    nome: 'ÒWÓRIN',
    nomeIfa: 'IKÁ',
    significado: 'Odú de instabilidade, perigo, mudança brusca, caminhos de Èsú e Egun, acidente e movimento difícil.',
    luz: 'capacidade de escapar de perigos, transformação rápida, quebra de laços negativos e alerta espiritual.',
    sombra: 'acidente, crime, doença, perda repentina, confusão, perseguição e caminho cercado de perigo.',
    conselho: 'redobre a proteção e não caminhe no escuro. Toda pressa aqui vira risco.',
    traducao: 'Representa movimento perigoso, mudança brusca e instabilidade espiritual.',
    orixas: ['Èsú', 'Egun'],
    cores: ['vermelho', 'preto', 'branco']
  },

  {
    queda: 12,
    nome: 'EJILASÈBORÁ',
    nomeIfa: 'OTURUKPON',
    significado: 'Odú de cobrança espiritual, obrigação de santo, justiça espiritual e necessidade de cuidado religioso.',
    luz: 'chamado espiritual, proteção dos orixás, reorganização da vida religiosa e abertura por obrigação cumprida.',
    sombra: 'cobrança de santo, desequilíbrio espiritual, atraso por negligência religiosa e caminhos suspensos.',
    conselho: 'quando este Odú fala, a espiritualidade pede atenção, obrigação e respeito.',
    traducao: 'Representa cobrança espiritual e chamado das forças sagradas.',
    orixas: ['Xangô', 'Orixás de obrigação'],
    cores: ['branco', 'vermelho', 'marrom']
  },

  {
    queda: 13,
    nome: 'OLÒGBÓN',
    nomeIfa: 'OTURÁ',
    significado: 'Odú de sabedoria antiga, maturidade, doença lenta, ancestralidade pesada e conhecimento profundo.',
    luz: 'sabedoria, visão espiritual, maturidade, prudência e proteção pela experiência.',
    sombra: 'doença prolongada, peso espiritual, tristeza, desgaste lento e influência de Egun.',
    conselho: 'não ignore sinais pequenos. O que demora também cobra.',
    traducao: 'Representa sabedoria ancestral, profundidade e peso do tempo.',
    orixas: ['Nanã', 'Egun'],
    cores: ['roxo', 'branco', 'preto']
  },

  {
    queda: 14,
    nome: 'IKÁ',
    nomeIfa: 'IRETÊ',
    significado: 'Odú de prova, obstáculo, serpente, perigo escondido, resistência e necessidade de cautela.',
    luz: 'superação, estratégia, resistência, inteligência diante do perigo e vitória após prova.',
    sombra: 'traição, armadilha, veneno, falsidade, perseguição e caminho difícil.',
    conselho: 'não confie apenas na aparência. Caminhe com estratégia.',
    traducao: 'Representa perigo oculto, prova e força de sobrevivência.',
    orixas: ['Oxumarê'],
    cores: ['verde', 'amarelo', 'branco']
  },

  {
    queda: 15,
    nome: 'OBEOGUNDÁ',
    nomeIfa: 'OSÊ',
    significado: 'Odú de corte, faca, decisão radical, ruptura, guerra interna e transformação por separação.',
    luz: 'corte de demandas, coragem para finalizar ciclos, libertação e decisão firme.',
    sombra: 'briga, separação dolorosa, violência, impulsividade e perda por falta de controle.',
    conselho: 'corte o que precisa ser cortado, mas não corte por raiva.',
    traducao: 'Representa o corte da espada, a ruptura e a força que separa para transformar.',
    orixas: ['Ogum', 'Obá'],
    cores: ['vermelho', 'preto', 'branco']
  },

  {
    queda: 16,
    nome: 'ALÁFIA',
    nomeIfa: 'OTURÁ MEJI',
    significado: 'Confirmação do pleno êxito, contentamento, felicidade, lucros, herança, viagens prósperas, verdade, sucesso e paz.',
    luz: 'vocação artística, sinceridade no amor, amor correspondido, sabedoria, conquistas, prazeres e acolhimento afetuoso.',
    sombra: 'domínio dos instintos, falta de determinação, duplicidade, duas palavras, ausência de firmeza e pessoa sem palavra.',
    conselho: 'use branco, aja com sinceridade e mantenha firmeza na palavra. A paz precisa ser preservada.',
    traducao: 'OTUWÁ significa “tu estás de volta”; ÒTURÁ MEJI evoca separar, desligar e apartar.',
    orixas: ['Orùnmilá', 'Obàtálá', 'Odùdùwá', 'Elegbá', 'Agê', 'Saluga'],
    cores: ['azul', 'branco', 'dourado'],
    elemento: 'ar sobre fogo'
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
    .reduce((soma, letra) => soma + letra.charCodeAt(0), 0);
}

function detectarTema(pergunta: string): string {
  const t = normalizar(pergunta);

  if (
    t.includes('amor') ||
    t.includes('relacionamento') ||
    t.includes('ex')
  )
    return 'amor';

  if (
    t.includes('trabalho') ||
    t.includes('dinheiro') ||
    t.includes('prosperidade')
  )
    return 'prosperidade';

  if (
    t.includes('espiritual') ||
    t.includes('entidade') ||
    t.includes('guia')
  )
    return 'espiritualidade';

  if (
    t.includes('familia') ||
    t.includes('filho') ||
    t.includes('casa')
  )
    return 'família';

  return 'geral';
}

function calcularQueda(
  nome: string,
  nascimento: string,
  pergunta: string,
  offset = 0
) {
  const valor =
    somaTexto(limparNome(nome)) +
    somaTexto(nascimento) +
    somaTexto(normalizar(pergunta)) +
    offset;

  return QUEDAS_BUZIOS[valor % QUEDAS_BUZIOS.length];
}

export function buildBuziosSupremo(input: BuziosInput) {
  const nome = input.fullName || '';
  const nascimento = input.birthDate || '';
  const pergunta = input.question || '';

  const tema = detectarTema(pergunta);

  const principal = calcularQueda(nome, nascimento, pergunta, 0);
  const complementar = calcularQueda(nome, nascimento, pergunta, 7);
  const alerta = calcularQueda(nome, nascimento, pergunta, 13);

 

const resumoParaMariaPadilha = `
BÚZIOS PREMIUM SUPREMO

Tema detectado: ${tema}

═══════════════════════
QUEDA PRINCIPAL
═══════════════════════

Odú: ${principal.nome}
Nome em Ifá: ${principal.nomeIfa || 'Não informado'}

Tradução:
${principal.traducao || ''}

Significado:
${principal.significado}

Luz:
${principal.luz}

Sombra:
${principal.sombra}

Conselho:
${principal.conselho}

Orixás Regentes:
${principal.orixas?.join(', ') || 'Não informado'}

Cores:
${principal.cores?.join(', ') || 'Não informado'}

═══════════════════════
QUEDA COMPLEMENTAR
═══════════════════════

Odú: ${complementar.nome}
Nome em Ifá: ${complementar.nomeIfa || 'Não informado'}

Significado:
${complementar.significado}

Luz:
${complementar.luz}

Sombra:
${complementar.sombra}

Conselho:
${complementar.conselho}

Orixás:
${complementar.orixas?.join(', ') || 'Não informado'}

═══════════════════════
ALERTA ESPIRITUAL
═══════════════════════

Odú: ${alerta.nome}

Significado:
${alerta.significado}

Sombra:
${alerta.sombra}

Conselho:
${alerta.conselho}

═══════════════════════
INSTRUÇÕES PARA MARIA PADILHA
═══════════════════════

Você é Maria Padilha Rainha das 7 Encruzilhadas.

Interprete os Odús de forma espiritual, profunda e acolhedora.

Nunca fale como relatório técnico.

Nunca diga que realizou cálculos.

Explique claramente:

• o que está favorecido;
• o que está bloqueado;
• quais energias estão atuando;
• quais cuidados espirituais devem ser tomados;
• quais caminhos podem ser abertos.

Fale sempre como entidade espiritual.

Use linguagem popular, firme, amorosa e direta.

Quando houver dificuldades, mostre esperança e direção.

Jamais invente Odús diferentes dos apresentados acima.
`.trim();



  return {
    entrada: {
      fullName: nome,
      birthDate: nascimento,
      question: pergunta
    },

    tema,

    buzios: {
      principal,
      complementar,
      alerta
    },

    resumoParaMariaPadilha
  };
}

export default buildBuziosSupremo;