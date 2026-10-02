export interface OduInput {
  fullName: string;
  birthDate: string;
  question?: string;
}


const ODUS = [
  {
    numero: 1,
    nome: 'EJIOGBE',
    nomeMeji: 'OGBE-MEJI',
    traducao:
      'Ejiogbe representa a cabeça, a luz, o princípio da vida organizada e a abertura do destino. Na obra, sua revelação mais importante é a cabeça como divindade, mostrando que Orí conduz a existência.',
    significado:
      'Odù de nascimento, cabeça, direção, clareza, prosperidade, liderança, vitória sobre dificuldades, proteção do destino e início correto dos caminhos.',
    luz:
      'abertura de caminhos, progresso, prosperidade, vitória, fertilidade, proteção da cabeça, liderança, tranquilidade mental e força para vencer inimigos.',
    sombra:
      'orgulho, desobediência aos avisos espirituais, conflito com autoridades, denúncia, perseguição, perda de tranquilidade e risco de queda por não ouvir orientação.',
    missao:
      'aprender a cuidar do próprio Orí, seguir os avisos espirituais e usar a liderança com sabedoria.',
    ensinamento:
      'Ejiogbe ensina que a cabeça é divindade. Quando o Orí está alinhado, a pessoa encontra direção, prosperidade e proteção. Quando ignora os avisos, o caminho se complica.',
    conselho:
      'fortaleça sua cabeça, respeite os sinais e não caminhe apenas pela pressa. A vitória vem quando há alinhamento entre destino, paciência e orientação espiritual.',
    alerta:
      'não despreze conselhos espirituais. Evite orgulho, confronto desnecessário e decisões tomadas sem consultar sua própria cabeça.',
    orixas: ['Orí', 'Ọrúnmìlá', 'Ifá', 'Esu', 'Ògún'],
    palavrasChave: [
      'cabeça',
      'destino',
      'abertura',
      'luz',
      'prosperidade',
      'liderança',
      'proteção',
      'vitória'
    ]
  },
  {
    numero: 2,
    nome: 'OYEKU',
    nomeMeji: 'OYEKU MEJI',
    traducao:
      'Oyeku representa o retorno, o recolhimento, a ancestralidade e o contato com aquilo que vem depois do fim de um ciclo.',
    significado:
      'Odù de profundidade espiritual, silêncio, morte simbólica, encerramentos, retorno das forças antigas, proteção ancestral e transformação pelo recolhimento.',
    luz:
      'proteção dos ancestrais, sabedoria antiga, encerramento necessário, cura pelo silêncio, força espiritual profunda, recebimento de benefícios e superação de perigos ligados à morte.',
    sombra:
      'medo, tristeza profunda, apego ao passado, perda, bloqueio emocional, energia parada, risco de repetição de sofrimento e influência pesada da ancestralidade não cuidada.',
    missao:
      'aprender a respeitar os ciclos da vida, honrar os mortos, aceitar encerramentos e transformar perda em maturidade espiritual.',
    ensinamento:
      'Oyeku ensina que nem todo fim é destruição. Muitas vezes o caminho se fecha para que a alma seja protegida, recolhida e preparada para um novo retorno.',
    conselho:
      'recolha-se antes de agir. Escute seus ancestrais, respeite os sinais e não insista em caminhos que já chegaram ao fim.',
    alerta:
      'cuidado com tristeza acumulada, luto mal resolvido, medo de mudança e situações que drenam sua força espiritual.',
    orixas: ['Ikú', 'Egungun', 'Ifá', 'Ọrúnmìlá'],
    palavrasChave: [
      'ancestralidade',
      'recolhimento',
      'fim de ciclo',
      'retorno',
      'morte simbólica',
      'proteção espiritual',
      'silêncio',
      'renascimento'
    ]
  },
  {
    numero: 3,
    nome: 'IWORI',
    nomeMeji: 'IWORI MEJI',
    traducao:
      'Iwori representa a visão interior, a descoberta dos mistérios e o conhecimento oculto.',
    significado:
      'Odù ligado à intuição, inteligência espiritual, revelações, mistérios, segredos, sabedoria e desenvolvimento da consciência.',
    luz:
      'grande percepção espiritual, mediunidade, sabedoria, intuição aguçada, facilidade para aprender, proteção espiritual e capacidade de antecipar acontecimentos.',
    sombra:
      'confusão mental, excesso de pensamentos, paranoia, dúvidas constantes, ilusão, enganos e dificuldade para distinguir intuição de medo.',
    missao:
      'desenvolver a sabedoria interior e aprender a confiar na própria percepção sem se perder nos pensamentos.',
    ensinamento:
      'Iwori ensina que a verdadeira visão nasce do equilíbrio entre razão e espiritualidade. Quem aprende a escutar a própria alma encontra respostas antes dos acontecimentos.',
    conselho:
      'silencie a mente, observe os sinais e não ignore sua intuição. Nem tudo precisa ser revelado imediatamente.',
    alerta:
      'cuidado com excesso de preocupação, pensamentos repetitivos, desconfiança exagerada e influência mental negativa.',
    orixas: ['Ọrúnmìlá', 'Ifá', 'Oxóssi', 'Egungun'],
    palavrasChave: [
      'intuição',
      'mistério',
      'sabedoria',
      'visão espiritual',
      'revelação',
      'segredos',
      'conhecimento',
      'consciência'
    ]
  },
  {
    numero: 4,
    nome: 'ODI',
    nomeMeji: 'IDI MEJI',
    traducao:
      'Idi representa fechamento, proteção, contenção e construção de bases seguras.',
    significado:
      'Odù relacionado à proteção, segurança, estrutura, preservação, segredos profundos, recolhimento e fortalecimento interno.',
    luz:
      'grande capacidade de proteção, estabilidade, construção de patrimônio, firmeza emocional, resistência espiritual e segurança nos caminhos.',
    sombra:
      'isolamento excessivo, teimosia, medo de mudanças, bloqueios emocionais, aprisionamento interior e excesso de rigidez.',
    missao:
      'aprender a construir bases sólidas sem se fechar completamente para a vida.',
    ensinamento:
      'Idi ensina que toda construção duradoura exige paciência, proteção e alicerces fortes. Quem se fortalece internamente suporta melhor as tempestades externas.',
    conselho:
      'proteja seus projetos, fortaleça sua espiritualidade e não exponha seus planos antes do tempo.',
    alerta:
      'cuidado para não transformar proteção em isolamento. O excesso de defesa pode impedir o crescimento.',
    orixas: ['Obaluayê', 'Nanã', 'Ifá', 'Egungun'],
    palavrasChave: [
      'proteção',
      'estrutura',
      'segurança',
      'estabilidade',
      'recolhimento',
      'segredo',
      'resistência',
      'fortaleza'
    ]
    },
  {
    numero: 5,
    nome: 'OBARA',
    nomeMeji: 'OBARA MEJI',
    traducao:
      'Obara representa prosperidade, palavra forte, expansão material, negociação e a difícil travessia da riqueza para o mundo.',
    significado:
      'Odù ligado à prosperidade, comunicação, inteligência prática, crescimento, reconhecimento, chefia e conquista material depois de esforço.',
    luz:
      'riqueza, abertura financeira, oportunidades, boa fala, negociação, crescimento profissional, título, reconhecimento e superação de inimigos.',
    sombra:
      'orgulho, ingratidão, conflito, desentendimento, vaidade, excesso de promessa, uso errado da palavra e dificuldade em sustentar a prosperidade.',
    missao:
      'aprender a usar a palavra, o dinheiro e o poder com responsabilidade, humildade e gratidão.',
    ensinamento:
      'Obara ensina que a prosperidade pode atravessar caminhos difíceis antes de chegar. Quem quer riqueza precisa ter cabeça, palavra firme e respeito às forças que abriram o caminho.',
    conselho:
      'fale com sabedoria, cuide das oportunidades e não deixe o orgulho destruir aquilo que está crescendo.',
    alerta:
      'cuidado com ingratidão, falsas promessas, desperdício e conflitos causados pela própria fala.',
    orixas: ['Ifá', 'Ọrúnmìlá', 'Èşu', 'Sàngó'],
    palavrasChave: [
      'prosperidade',
      'riqueza',
      'fala',
      'negociação',
      'crescimento',
      'reconhecimento',
      'chefia',
      'oportunidade'
    ]
   },
  {
    numero: 6,
    nome: 'OKÀRÁN',
    nomeMeji: 'OKONRON MEJI',

    traducao:
      'Okonron representa movimento, transformação, pequenos começos, sobrevivência e capacidade de crescer mesmo diante das dificuldades.',

    significado:
      'Odù ligado ao trabalho, à adaptação, à mudança de sorte, à resistência, à estratégia e à prosperidade construída passo a passo.',

    luz:
      'superação, inteligência prática, crescimento gradual, liderança, vitória após dificuldades, proteção espiritual e mudança positiva de destino.',

    sombra:
      'instabilidade, conflitos, inveja, perseguições, inimigos ocultos, dificuldades materiais e necessidade constante de vigilância espiritual.',

    missao:
      'aprender a crescer sem desistir diante das dificuldades e usar a estratégia antes da força.',

    ensinamento:
      'Okonron ensina que nenhum começo deve ser desprezado. Aquilo que parece pequeno pode prosperar e se tornar grande quando existe disciplina, persistência e proteção espiritual.',

    conselho:
      'não abandone seus projetos por dificuldades iniciais. Trabalhe, organize-se e mantenha seus caminhos limpos espiritualmente.',

    alerta:
      'cuidado com inveja, falsidade, conflitos desnecessários e decisões tomadas por impulso.',

    orixas: ['Èşu', 'Ògún', 'Ifá', 'Sàngó'],

    palavrasChave: [
      'transformação',
      'sobrevivência',
      'trabalho',
      'estratégia',
      'prosperidade',
      'crescimento',
      'resistência',
      'mudança de sorte'
    ]
   },
{
numero: 7,
nome: 'IROSUN',
nomeMeji: 'IROSUN MEJI',

traducao:
'Irosun representa sangue, ancestralidade, revelação e manifestação dos mistérios ocultos.',

significado:
'Odù ligado à ancestralidade, à revelação espiritual, à fertilidade, à continuidade da vida e aos segredos transmitidos pelos antigos.',

luz:
'forte proteção ancestral, revelações espirituais, fertilidade, prosperidade, mediunidade e fortalecimento familiar.',

sombra:
'fofocas, segredos revelados de forma dolorosa, conflitos familiares, sofrimento emocional e influência espiritual negativa.',

missao:
'honrar a ancestralidade e utilizar a verdade para construir, nunca para destruir.',

ensinamento:
'Irosun ensina que os ancestrais sempre deixam sinais. Quem aprende a ouvir os antigos evita muitos sofrimentos.',

conselho:
'fortaleça sua ligação espiritual e respeite os ensinamentos dos mais velhos.',

alerta:
'cuidado com intrigas, fofocas e exposição excessiva da vida pessoal.',

orixas: ['Egungun', 'Oyá', 'Ọrúnmìlá', 'Ifá'],

palavrasChave: [
'ancestralidade',
'sangue',
'fertilidade',
'revelação',
'mediunidade',
'família',
'mistério',
'verdade'
]
},

{
numero: 8,
nome: 'OWANRIN',
nomeMeji: 'OWANRIN MEJI',

traducao:
'Owanrin representa movimento, mudança repentina, transformação e instabilidade.',

significado:
'Odù ligado às mudanças bruscas, viagens, deslocamentos, transformações inesperadas e renovação.',

luz:
'capacidade de adaptação, criatividade, renovação, inteligência rápida e abertura para novos caminhos.',

sombra:
'instabilidade, impulsividade, perdas repentinas, ansiedade e dificuldade de manter constância.',

missao:
'aprender a mudar sem perder a própria essência.',

ensinamento:
'A vida está em constante movimento. Resistir excessivamente às mudanças gera sofrimento.',

conselho:
'aceite as mudanças necessárias e não permaneça preso ao passado.',

alerta:
'evite decisões precipitadas e mudanças impulsivas.',

orixas: ['Èşu', 'Oyá', 'Ọrúnmìlá'],

palavrasChave: [
'mudança',
'movimento',
'viagem',
'transformação',
'renovação',
'adaptação',
'instabilidade',
'caminhos'
]
},

{
numero: 9,
nome: 'ÒGÚNDA',
nomeMeji: 'ÒGÚNDA MEJI',

traducao:
'Ògúnda representa luta, conquista, trabalho, ferro e vitória através do esforço.',

significado:
'Odù ligado ao trabalho, à guerra, ao esforço contínuo, à conquista e à superação de obstáculos.',

luz:
'força, coragem, liderança, abertura de caminhos, vitória e capacidade de realização.',

sombra:
'agressividade, conflitos, teimosia, impulsividade e desgaste excessivo.',

missao:
'usar a força para construir e não para destruir.',

ensinamento:
'Toda conquista exige disciplina, coragem e perseverança.',

conselho:
'lute pelas causas certas e evite guerras desnecessárias.',

alerta:
'cuidado com explosões emocionais e confrontos desnecessários.',

orixas: ['Ògún', 'Èşu', 'Sàngó', 'Ifá'],

palavrasChave: [
'luta',
'trabalho',
'conquista',
'ferro',
'coragem',
'guerra',
'força',
'vitória'
]
},

{
numero: 10,
nome: 'OSA',
nomeMeji: 'OSA MEJI',

traducao:
'Osa representa transformação espiritual, magia, ventos e poder oculto.',

significado:
'Odù ligado à espiritualidade profunda, aos mistérios, às mudanças espirituais e à atuação das forças invisíveis.',

luz:
'mediunidade elevada, proteção espiritual, intuição forte, transformação positiva e sabedoria oculta.',

sombra:
'instabilidade emocional, influência espiritual negativa, ilusões e desequilíbrio energético.',

missao:
'desenvolver a espiritualidade com responsabilidade e equilíbrio.',

ensinamento:
'Grandes poderes exigem grande disciplina espiritual.',

conselho:
'fortaleça sua espiritualidade e mantenha seus pensamentos elevados.',

alerta:
'evite ambientes e pessoas energeticamente negativas.',

orixas: ['Oyá', 'Yemanjá', 'Egungun', 'Ọrúnmìlá'],

palavrasChave: [
'espiritualidade',
'magia',
'mistério',
'transformação',
'mediunidade',
'vento',
'intuição',
'energia'
]
  },
{
numero: 11,
nome: 'ETURA',
nomeMeji: 'ETURA MEJI',

traducao:
'Etura representa iluminação, elevação espiritual, paz e compreensão superior.',

significado:
'Odù ligado à sabedoria, à paz, à evolução espiritual e ao equilíbrio entre o mundo material e espiritual.',

luz:
'clareza, paz interior, proteção divina, sabedoria, crescimento espiritual e boa orientação.',

sombra:
'ilusões espirituais, excesso de idealização, ingenuidade e dificuldade para agir na realidade.',

missao:
'unir espiritualidade e vida prática de forma equilibrada.',

ensinamento:
'A verdadeira sabedoria espiritual deve ser aplicada na vida diária.',

conselho:
'escute sua espiritualidade, mas mantenha os pés firmes na realidade.',

alerta:
'evite fugir da realidade através de fantasias ou ilusões.',

orixas: ['Ọrúnmìlá', 'Obatalá', 'Ifá'],

palavrasChave: [
'sabedoria',
'elevação',
'paz',
'espiritualidade',
'clareza',
'evolução',
'equilíbrio',
'luz'
]
},

{
numero: 12,
nome: 'IRETE',
nomeMeji: 'IRETE MEJI',

traducao:
'Irete representa perseverança, reconstrução e vitória através da resistência.',

significado:
'Odù ligado ao esforço contínuo, à reconstrução, à paciência e ao amadurecimento.',

luz:
'persistência, superação, reconstrução, força interior e crescimento gradual.',

sombra:
'teimosia, repetição de erros, desgaste emocional e excesso de resistência.',

missao:
'aprender a persistir com inteligência e flexibilidade.',

ensinamento:
'Nem toda demora é negativa. Algumas vitórias exigem tempo.',

conselho:
'continue avançando, mas revise suas estratégias quando necessário.',

alerta:
'não insista indefinidamente em caminhos claramente esgotados.',

orixas: ['Ògún', 'Ọrúnmìlá', 'Ifá'],

palavrasChave: [
'persistência',
'reconstrução',
'superação',
'paciência',
'resistência',
'esforço',
'amadurecimento',
'vitória'
]
},

{
numero: 13,
nome: 'EKAN',
nomeMeji: 'EKAN MEJI',

traducao:
'Ekan representa provas, desafios, prudência e necessidade de vigilância.',

significado:
'Odù ligado às provas da vida, aos desafios espirituais e à necessidade de estratégia.',

luz:
'prudência, estratégia, discernimento, proteção e capacidade de superar obstáculos.',

sombra:
'medo excessivo, insegurança, isolamento e desconfiança exagerada.',

missao:
'desenvolver coragem sem perder a prudência.',

ensinamento:
'Todo desafio traz consigo uma oportunidade de crescimento.',

conselho:
'observe antes de agir e não revele todos os seus planos.',

alerta:
'cuidado com traições, falsas amizades e excesso de confiança.',

orixas: ['Èşu', 'Ọrúnmìlá', 'Ifá'],

palavrasChave: [
'prova',
'desafio',
'estratégia',
'prudência',
'proteção',
'discernimento',
'vigilância',
'superação'
]
},

{
numero: 14,
nome: 'OLOGBON',
nomeMeji: 'OLOGBON MEJI',

traducao:
'Ologbon representa sabedoria ancestral, profundidade e maturidade.',

significado:
'Odù ligado ao conhecimento profundo, à experiência, à maturidade e à ancestralidade.',

luz:
'sabedoria, maturidade, prudência, conhecimento e estabilidade.',

sombra:
'rigidez, isolamento, excesso de cautela e apego ao passado.',

missao:
'usar a experiência adquirida para orientar e construir.',

ensinamento:
'A verdadeira sabedoria nasce da experiência e da humildade.',

conselho:
'valorize a experiência dos mais velhos e aprenda continuamente.',

alerta:
'evite endurecer emocionalmente ou resistir excessivamente às mudanças.',

orixas: ['Nanã', 'Ọrúnmìlá', 'Egungun'],

palavrasChave: [
'sabedoria',
'maturidade',
'ancestralidade',
'experiência',
'conhecimento',
'prudência',
'profundidade',
'estabilidade'
]
},

{
numero: 15,
nome: 'OSE',
nomeMeji: 'OSE MEJI',

traducao:
'Ose representa amor, fertilidade, prosperidade, beleza e harmonia.',

significado:
'Odù ligado ao amor, à abundância, à fertilidade e à energia da prosperidade.',

luz:
'amor, harmonia, prosperidade, fertilidade, encanto e proteção afetiva.',

sombra:
'carência, vaidade excessiva, dependência emocional e ilusões amorosas.',

missao:
'amar sem perder a própria identidade.',

ensinamento:
'O amor verdadeiro fortalece, não aprisiona.',

conselho:
'cultive relações saudáveis e preserve seu amor-próprio.',

alerta:
'evite dependência emocional e expectativas irreais.',

orixas: ['Oxum', 'Ọrúnmìlá', 'Ifá'],

palavrasChave: [
'amor',
'fertilidade',
'harmonia',
'prosperidade',
'beleza',
'encanto',
'afeto',
'abundância'
]
},

{
numero: 16,
nome: 'OFUN',
nomeMeji: 'OFUN MEJI',

traducao:
'Ofun representa conclusão, sabedoria suprema, limpeza espiritual e fechamento de ciclos.',

significado:
'Odù ligado à conclusão, à purificação, à sabedoria adquirida e ao encerramento de processos.',

luz:
'grande sabedoria, bênçãos espirituais, limpeza, renovação e proteção elevada.',

sombra:
'rigidez, excesso de cobrança, apego ao passado e dificuldade de aceitar encerramentos.',

missao:
'encerrar ciclos com maturidade e preparar-se para novos começos.',

ensinamento:
'Todo final prepara um novo início.',

conselho:
'aceite os encerramentos necessários e mantenha sua espiritualidade fortalecida.',

alerta:
'não prolongue situações que já cumpriram seu propósito.',

orixas: ['Obatalá', 'Ọrúnmìlá', 'Ifá'],

palavrasChave: [
'conclusão',
'sabedoria',
'purificação',
'renovação',
'limpeza',
'proteção',
'espiritualidade',
'ciclos'
]
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

function detectarTema(pergunta: string): string {
  const t = normalizar(pergunta);

  if (t.includes('amor') || t.includes('ex') || t.includes('relacionamento') || t.includes('volta')) return 'amor';
  if (t.includes('dinheiro') || t.includes('trabalho') || t.includes('emprego') || t.includes('prosperidade')) return 'prosperidade';
  if (t.includes('espiritual') || t.includes('guia') || t.includes('entidade') || t.includes('demanda')) return 'espiritualidade';
  if (t.includes('familia') || t.includes('filho') || t.includes('casa')) return 'família';
  if (t.includes('inveja') || t.includes('olho gordo') || t.includes('proteção') || t.includes('protecao')) return 'proteção';

  return 'geral';
}

function selecionarOduPrincipal(nome: string, data: string, pergunta: string) {
  const base = somaTexto(limparNome(nome)) + somaTexto(data) + somaTexto(normalizar(pergunta));
  return ODUS[base % ODUS.length];
}

function selecionarOduComplementar(nome: string, data: string, pergunta: string) {
  const base = somaTexto(data + limparNome(nome)) + somaTexto(normalizar(pergunta)) + 7;
  return ODUS[base % ODUS.length];
}

function selecionarOduSombra(nome: string, data: string, pergunta: string) {
  const base = somaTexto(normalizar(pergunta)) + somaTexto(limparNome(nome)) + somaTexto(data) + 13;
  return ODUS[base % ODUS.length];
}

export function buildOduSupremo(input: OduInput) {
  const nome = input.fullName || '';
  const nascimento = input.birthDate || '';
  const pergunta = input.question || '';

  const tema = detectarTema(pergunta);

  const principal = selecionarOduPrincipal(nome, nascimento, pergunta);
  const complementar = selecionarOduComplementar(nome, nascimento, pergunta);
  const sombra = selecionarOduSombra(nome, nascimento, pergunta);

  
const resumoParaMariaPadilha = `
ODÙ PREMIUM SUPREMO

Tema detectado: ${tema}

═══════════════════════
ODÙ PRINCIPAL
═══════════════════════

Nome: ${principal.nome}
Nome Completo: ${principal.nomeMeji}

Tradução:
${principal.traducao}

Significado:
${principal.significado}

Luz:
${principal.luz}

Sombra:
${principal.sombra}

Missão:
${principal.missao}

Ensinamento:
${principal.ensinamento}

Conselho:
${principal.conselho}

Alerta:
${principal.alerta}

Orixás:
${principal.orixas.join(', ')}

═══════════════════════
ODÙ COMPLEMENTAR
═══════════════════════

Nome: ${complementar.nome}
Nome Completo: ${complementar.nomeMeji}

Significado:
${complementar.significado}

Luz:
${complementar.luz}

Missão:
${complementar.missao}

═══════════════════════
ODÙ DE SOMBRA
═══════════════════════

Nome: ${sombra.nome}

Sombra:
${sombra.sombra}

Alerta:
${sombra.alerta}

═══════════════════════
INSTRUÇÕES PARA MARIA PADILHA
═══════════════════════

Você é Maria Padilha Rainha das 7 Encruzilhadas.

Interprete os Odùs de forma profunda, espiritual e acolhedora.

Nunca fale como relatório técnico.

Nunca diga que sorteou ou calculou.

Explique:

• o que favorece;
• o que bloqueia;
• qual a missão espiritual;
• quais padrões precisam ser transformados;
• qual direção deve ser seguida.

Fale sempre como entidade espiritual.

Não invente novos Odùs.
`.trim();



  return {
    entrada: {
      fullName: nome,
      birthDate: nascimento,
      question: pergunta
    },

    tema,

    odu: {
      principal,
      complementar,
      sombra
    },

    resumoParaMariaPadilha
  };
}

export default buildOduSupremo;