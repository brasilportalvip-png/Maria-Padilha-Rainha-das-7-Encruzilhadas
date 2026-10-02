export interface TarotInput {
  fullName: string;
  birthDate: string;
  question?: string;
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

function somaDigitos(texto: string): number {
  return String(texto || '')
    .replace(/\D/g, '')
    .split('')
    .reduce((soma, digito) => soma + Number(digito), 0);
}

function reduzirNumero(n: number): number {
  while (n > 9 && !NUMEROS_MESTRES.includes(n)) {
    n = String(n)
      .split('')
      .reduce((soma, digito) => soma + Number(digito), 0);
  }

  return n;
}

function calcularBaseNumerica(nome: string, data: string, pergunta: string): number {
  const nomeValor = limparNome(nome)
    .split('')
    .reduce((soma, letra) => soma + letra.charCodeAt(0), 0);

  return reduzirNumero(nomeValor + somaDigitos(data) + somaDigitos(pergunta));
}

const ARCANOS: any[] = [
 {
  id: "maior_00_louco",
  arcano: "maior",
  numero: 0,
  nome: "O Louco",
  entidade: "Exu Tranca Ruas",

  traducao:
    "Representa recomeços, liberdade, coragem e abertura de novos caminhos.",

  significado:
    "Carta ligada à espontaneidade, novas experiências, aventura e fé no desconhecido.",

  luz:
    "liberdade, coragem, novos começos, criatividade e expansão.",

  sombra:
    "imprudência, impulsividade, irresponsabilidade e falta de direção.",

  ensinamento:
    "todo novo caminho exige coragem, mas também consciência.",

  conselho:
    "dê o primeiro passo, mas não caminhe sem direção.",

  alerta:
    "evite agir apenas pelo impulso ou pela emoção momentânea.",

  normal:
    "Novos caminhos, liberdade e recomeços."
},
{
  id: "maior_01_mago",
  arcano: "maior",
  numero: 1,
  nome: "O Mago",
  entidade: "Exu e Crianças",

  traducao:
    "A pessoa é criativa, comunicativa, tem iniciativa, força de vontade, fé e sabedoria. Carta positiva e de incentivo.",

  significado:
    "Representa ação, manifestação, poder pessoal, inteligência e capacidade de transformar ideias em realidade.",

  luz:
    "iniciativa, criatividade, liderança, comunicação, inteligência e abertura de caminhos.",

  sombra:
    "manipulação, impulsividade, promessas vazias, ego e excesso de confiança.",

  ensinamento:
    "todo poder deve ser acompanhado de responsabilidade e consciência.",

  conselho:
    "use seus talentos com sabedoria e transforme intenção em ação concreta.",

  alerta:
    "cuidado para não agir apenas pelo ego ou pela vaidade.",

  normal:
    "Inteligência, vontade, iniciativa e atividade mental consciente."
},

{
  id: "maior_02_papisa",
  arcano: "maior",
  numero: 2,
  nome: "A Papisa",
  entidade: "Iemanjá",

  traducao:
    "Representa a mulher intuitiva, sensível e detentora de grande sabedoria interior.",

  significado:
    "Carta de mistério, silêncio, proteção espiritual, intuição e conhecimento oculto.",

  luz:
    "intuição, sabedoria, espiritualidade, serenidade e proteção.",

  sombra:
    "passividade, segredos excessivos, isolamento e medo de agir.",

  ensinamento:
    "nem tudo precisa ser revelado imediatamente.",

  conselho:
    "escute sua voz interior antes de tomar decisões importantes.",

  alerta:
    "evite permanecer parado esperando respostas externas.",

  normal:
    "Intuição, sabedoria, mistério e força interior."
},

{
  id: "maior_03_imperatriz",
  arcano: "maior",
  numero: 3,
  nome: "A Imperatriz",
  entidade: "Oxum",

  traducao:
    "Representa fertilidade, amor, prosperidade, criatividade e abundância.",

  significado:
    "Carta de crescimento, expansão, beleza, maternidade e materialização.",

  luz:
    "amor, prosperidade, criatividade, abundância e proteção afetiva.",

  sombra:
    "dependência emocional, excesso de conforto e apego.",

  ensinamento:
    "o amor deve nutrir, jamais aprisionar.",

  conselho:
    "cuide do que está crescendo em sua vida.",

  alerta:
    "não espere reconhecimento para seguir seu caminho.",

  normal:
    "Materialização do desejo."
},

{
  id: "maior_04_imperador",
  arcano: "maior",
  numero: 4,
  nome: "O Imperador",
  entidade: "Ogum",

  traducao:
    "Representa autoridade, comando, razão, proteção e firmeza.",

  significado:
    "Carta ligada à estrutura, segurança, liderança e poder de realização.",

  luz:
    "disciplina, estabilidade, proteção, liderança e determinação.",

  sombra:
    "autoritarismo, rigidez, orgulho e excesso de controle.",

  ensinamento:
    "liderar exige firmeza, mas também sabedoria.",

  conselho:
    "assuma responsabilidade pela própria vida.",

  alerta:
    "evite controlar excessivamente pessoas e situações.",

  normal:
    "Atividade, força, poder, comando e justiça."
},

{
  id: "maior_05_papa",
  arcano: "maior",
  numero: 5,
  nome: "O Papa",
  entidade: "Oxalá e Oxalufã",

  traducao:
    "Representa o mestre espiritual, a sabedoria e os ensinamentos superiores.",

  significado:
    "Carta ligada à fé, tradição, orientação e crescimento espiritual.",

  luz:
    "sabedoria, proteção espiritual, fé e amadurecimento.",

  sombra:
    "dogmatismo, medo da mudança e dependência de opiniões.",

  ensinamento:
    "a verdadeira fé liberta, não aprisiona.",

  conselho:
    "busque orientação, mas mantenha sua própria consciência.",

  alerta:
    "não use crenças para justificar o medo.",

  normal:
    "Conhecimento, amadurecimento e superação."
},

{
  id: "maior_06_namorados",
  arcano: "maior",
  numero: 6,
  nome: "Os Namorados",
  entidade: "Erês",

  traducao:
    "Representa amor, escolhas, união e decisões importantes do coração.",

  significado:
    "Carta das relações, afetos, parcerias e decisões emocionais.",

  luz:
    "amor, união, parceria, cumplicidade e felicidade.",

  sombra:
    "indecisão, triângulos amorosos, carência e ilusão.",

  ensinamento:
    "amar também é escolher.",

  conselho:
    "faça escolhas conscientes e sinceras.",

  alerta:
    "não confunda paixão momentânea com destino.",

  normal:
    "Uniões, amor e situações felizes."
},

{
  id: "maior_07_carro",
  arcano: "maior",
  numero: 7,
  nome: "O Carro",
  entidade: "Ogum e Iemanjá",

  traducao:
    "Representa vitória, avanço, conquista e domínio do próprio caminho.",

  significado:
    "Carta de movimento, viagens, progresso e superação.",

  luz:
    "vitória, sucesso, coragem e expansão.",

  sombra:
    "pressa, arrogância e excesso de competitividade.",

  ensinamento:
    "o sucesso exige direção e equilíbrio.",

  conselho:
    "avance, mas mantenha controle emocional.",

  alerta:
    "não tente vencer tudo pela força.",

  normal:
    "Sucesso em conflitos, vitória e avanço."
},

{
  id: "maior_08_justica",
  arcano: "maior",
  numero: 8,
  nome: "A Justiça",
  entidade: "Xangô",

  traducao:
    "Representa equilíbrio, verdade, merecimento e colheita.",

  significado:
    "Carta de justiça divina, karma, responsabilidade e decisões.",

  luz:
    "equilíbrio, verdade, honestidade e merecimento.",

  sombra:
    "culpa, rigidez e julgamento excessivo.",

  ensinamento:
    "toda ação gera consequências.",

  conselho:
    "aja corretamente mesmo quando ninguém estiver olhando.",

  alerta:
    "evite agir movido por vingança.",

  normal:
    "Justiça a favor, equilíbrio e colheita."
},

{
  id: "maior_09_ermitao",
  arcano: "maior",
  numero: 9,
  nome: "O Ermitão",
  entidade: "Ifá",

  traducao:
    "Representa reflexão, prudência, sabedoria e busca interior.",

  significado:
    "Carta de introspecção, estudo, maturidade e descoberta pessoal.",

  luz:
    "sabedoria, prudência, proteção espiritual e clareza.",

  sombra:
    "solidão, isolamento e tristeza oculta.",

  ensinamento:
    "o silêncio também traz respostas.",

  conselho:
    "reserve tempo para ouvir sua alma.",

  alerta:
    "não transforme recolhimento em isolamento.",

  normal:
    "Organização, verdade, prudência e clareza."
},

{
  id: "maior_10_roda_fortuna",
  arcano: "maior",
  numero: 10,
  nome: "Roda da Fortuna",
  entidade: "Iansã",

  traducao:
    "Representa mudanças, ciclos, sorte e movimento do destino.",

  significado:
    "Carta das viradas, oportunidades e transformações inevitáveis.",

  luz:
    "sorte, progresso, oportunidades e expansão.",

  sombra:
    "instabilidade, repetição de padrões e altos e baixos.",

  ensinamento:
    "a vida está em constante movimento.",

  conselho:
    "aproveite as oportunidades quando elas surgirem.",

  alerta:
    "não repita erros antigos.",

  normal:
    "Boa fortuna, sincronia e movimento favorável."
},
{
  id: "maior_11_forca",
  arcano: "maior",
  numero: 11,
  nome: "A Força",
  entidade: "Ogum e Xangô",

  traducao:
    "Representa coragem, domínio interior, magnetismo e controle das emoções.",

  significado:
    "Carta ligada ao autocontrole, resistência, poder pessoal e superação.",

  luz:
    "coragem, domínio emocional, resistência, magnetismo e força espiritual.",

  sombra:
    "orgulho, impulsividade, explosões emocionais e necessidade de controlar tudo.",

  ensinamento:
    "a verdadeira força nasce do domínio sobre si mesmo.",

  conselho:
    "controle as emoções antes de agir.",

  alerta:
    "não use a força para impor sua vontade.",

  normal:
    "Coragem, equilíbrio e força interior."
},

{
  id: "maior_12_enforcado",
  arcano: "maior",
  numero: 12,
  nome: "O Enforcado",
  entidade: "Omulu",

  traducao:
    "Representa pausa, sacrifício, nova visão e amadurecimento espiritual.",

  significado:
    "Carta de espera, mudança de perspectiva e entrega ao tempo divino.",

  luz:
    "sabedoria, compreensão, amadurecimento e renovação interior.",

  sombra:
    "paralisação, vitimismo, atraso e resistência às mudanças.",

  ensinamento:
    "às vezes é preciso parar para enxergar o caminho.",

  conselho:
    "mude a forma de olhar a situação.",

  alerta:
    "não permaneça preso ao sofrimento desnecessário.",

  normal:
    "Reflexão, espera e nova visão."
},

{
  id: "maior_13_morte",
  arcano: "maior",
  numero: 13,
  nome: "A Morte",
  entidade: "Omulu e Nanã",

  traducao:
    "Representa transformação profunda, encerramentos e renascimento.",

  significado:
    "Carta de fim de ciclo, desapego e renovação.",

  luz:
    "renascimento, libertação, transformação e limpeza.",

  sombra:
    "medo da perda, apego e resistência ao novo.",

  ensinamento:
    "todo fim abre espaço para um novo começo.",

  conselho:
    "solte aquilo que já terminou.",

  alerta:
    "não insista em ciclos encerrados.",

  normal:
    "Transformação, mudança e renovação."
},

{
  id: "maior_14_temperanca",
  arcano: "maior",
  numero: 14,
  nome: "A Temperança",
  entidade: "Oxalá",

  traducao:
    "Representa equilíbrio, cura, serenidade e reconciliação.",

  significado:
    "Carta de harmonia, proteção espiritual e paciência.",

  luz:
    "cura, paz, equilíbrio, proteção e entendimento.",

  sombra:
    "acomodação, lentidão excessiva e falta de atitude.",

  ensinamento:
    "equilíbrio é diferente de estagnação.",

  conselho:
    "tenha paciência, mas continue caminhando.",

  alerta:
    "não use a calma como desculpa para não agir.",

  normal:
    "Equilíbrio, paz e proteção."
},

{
  id: "maior_15_diabo",
  arcano: "maior",
  numero: 15,
  nome: "O Diabo",
  entidade: "Exu",

  traducao:
    "Representa desejo, poder material, magnetismo e tentações.",

  significado:
    "Carta das paixões, dos instintos e das prisões emocionais.",

  luz:
    "sedução, magnetismo, prosperidade e força de atração.",

  sombra:
    "obsessão, vícios, ciúmes, manipulação e dependência.",

  ensinamento:
    "nem todo desejo representa um destino.",

  conselho:
    "observe aquilo que está lhe aprisionando.",

  alerta:
    "cuidado com excessos emocionais e materiais.",

  normal:
    "Magnetismo, desejo e tentações."
},

{
  id: "maior_16_torre",
  arcano: "maior",
  numero: 16,
  nome: "A Torre",
  entidade: "Iansã",

  traducao:
    "Representa rupturas, revelações e destruição do que é falso.",

  significado:
    "Carta de mudanças inevitáveis e libertação.",

  luz:
    "verdade, libertação, renovação e quebra de ilusões.",

  sombra:
    "rupturas dolorosas, perdas e crises repentinas.",

  ensinamento:
    "o que cai abre espaço para algo melhor.",

  conselho:
    "aceite as mudanças necessárias.",

  alerta:
    "não sustente estruturas falsas.",

  normal:
    "Ruptura, revelação e mudança."
},

{
  id: "maior_17_estrela",
  arcano: "maior",
  numero: 17,
  nome: "A Estrela",
  entidade: "Oxum",

  traducao:
    "Representa esperança, proteção, inspiração e bênçãos.",

  significado:
    "Carta de fé, cura e renovação espiritual.",

  luz:
    "esperança, proteção, inspiração e prosperidade.",

  sombra:
    "idealização, ingenuidade e espera excessiva.",

  ensinamento:
    "a fé precisa caminhar junto com a ação.",

  conselho:
    "mantenha a esperança e siga em frente.",

  alerta:
    "não viva apenas de sonhos.",

  normal:
    "Esperança, fé e proteção."
},

{
  id: "maior_18_lua",
  arcano: "maior",
  numero: 18,
  nome: "A Lua",
  entidade: "Iemanjá",

  traducao:
    "Representa mistérios, mediunidade, sonhos e emoções profundas.",

  significado:
    "Carta da intuição, do inconsciente e dos segredos.",

  luz:
    "mediunidade, intuição, sensibilidade e percepção espiritual.",

  sombra:
    "medos, ilusões, ansiedade e enganos.",

  ensinamento:
    "nem tudo é o que parece ser.",

  conselho:
    "espere mais informações antes de decidir.",

  alerta:
    "cuidado com ilusões e falsas promessas.",

  normal:
    "Mistério, sonhos e sensibilidade."
},

{
  id: "maior_19_sol",
  arcano: "maior",
  numero: 19,
  nome: "O Sol",
  entidade: "Oxalá",

  traducao:
    "Representa sucesso, clareza, alegria e realização.",

  significado:
    "Carta de prosperidade, crescimento e iluminação.",

  luz:
    "felicidade, vitória, prosperidade e reconhecimento.",

  sombra:
    "orgulho, vaidade e excesso de exposição.",

  ensinamento:
    "a verdadeira luz ilumina a todos.",

  conselho:
    "compartilhe sua luz com humildade.",

  alerta:
    "não permita que o orgulho obscureça sua visão.",

  normal:
    "Sucesso, clareza e realização."
},

{
  id: "maior_20_julgamento",
  arcano: "maior",
  numero: 20,
  nome: "O Julgamento",
  entidade: "Xangô",

  traducao:
    "Representa renascimento, despertar espiritual e decisões definitivas.",

  significado:
    "Carta de transformação, perdão e recomeço.",

  luz:
    "renascimento, libertação, verdade e despertar.",

  sombra:
    "culpa, cobranças e medo do passado.",

  ensinamento:
    "a vida sempre oferece novas oportunidades.",

  conselho:
    "perdoe e siga adiante.",

  alerta:
    "não permaneça preso ao passado.",

  normal:
    "Renascimento, despertar e renovação."
},

{
  id: "maior_21_mundo",
  arcano: "maior",
  numero: 21,
  nome: "O Mundo",
  entidade: "Oxalá",

  traducao:
    "Representa conclusão, realização plena e proteção divina.",

  significado:
    "Carta de sucesso, encerramento e plenitude.",

  luz:
    "vitória, realização, proteção e plenitude.",

  sombra:
    "medo de encerrar ciclos e apego ao passado.",

  ensinamento:
    "todo final prepara um novo início.",

  conselho:
    "celebre suas conquistas e siga para novos desafios.",

  alerta:
    "não permaneça preso ao ciclo que já terminou.",

  normal:
    "Realização, sucesso e conclusão."
},
{
  id: "paus_rei",
  arcano: "menor",
  grupo: "paus",
  nome: "Rei de Paus",
  traducao: "Representa liderança, ação madura, comando e realização.",
  significado: "Carta de autoridade prática, visão, coragem e domínio da ação.",
  luz: "liderança, iniciativa, segurança, coragem e poder de realização.",
  sombra: "autoritarismo, orgulho, impaciência e controle excessivo.",
  ensinamento: "liderar exige atitude e responsabilidade.",
  conselho: "aja com firmeza, mas sem atropelar ninguém.",
  alerta: "evite impor sua vontade pela força.",
  normal: "Homem respeitável e amigável."
},

{
  id: "paus_rainha",
  arcano: "menor",
  grupo: "paus",
  nome: "Rainha de Paus",
  traducao: "Representa magnetismo, coragem, inteligência e ação desejável.",
  significado: "Carta de presença forte, atração, confiança e poder pessoal.",
  luz: "carisma, atitude, beleza, confiança e força de atração.",
  sombra: "vaidade, ciúme, orgulho e desejo de dominar.",
  ensinamento: "o verdadeiro magnetismo nasce da confiança interior.",
  conselho: "use sua presença com sabedoria.",
  alerta: "não confunda poder pessoal com controle.",
  normal: "Mulher atraente e inteligente."
},

{
  id: "paus_cavaleiro",
  arcano: "menor",
  grupo: "paus",
  nome: "Cavaleiro de Paus",
  traducao: "Representa movimento, mudança, deslocamento e ação necessária.",
  significado: "Carta de impulso, viagem, mudança de rumo e decisão rápida.",
  luz: "coragem, movimento, aventura, expansão e atitude.",
  sombra: "pressa, instabilidade, imprudência e ansiedade.",
  ensinamento: "movimento sem direção vira confusão.",
  conselho: "avance, mas saiba para onde está indo.",
  alerta: "evite decisões tomadas no calor do momento.",
  normal: "Troca de residência."
},

{
  id: "paus_valete",
  arcano: "menor",
  grupo: "paus",
  nome: "Valete de Paus",
  traducao: "Representa ação imediata, notícia, entusiasmo e começo.",
  significado: "Carta de boas notícias, impulso inicial, criatividade e oportunidade.",
  luz: "entusiasmo, novidade, comunicação, coragem e inspiração.",
  sombra: "imaturidade, precipitação e falta de constância.",
  ensinamento: "todo começo precisa de continuidade.",
  conselho: "receba a novidade, mas mantenha disciplina.",
  alerta: "não abandone o caminho no primeiro obstáculo.",
  normal: "Chegada de boas notícias."
},

{
  id: "paus_10",
  arcano: "menor",
  grupo: "paus",
  numero: 10,
  nome: "Dez de Paus",
  traducao: "Representa peso, opressão, excesso de responsabilidade e limite.",
  significado: "Carta de sobrecarga, esforço pesado e necessidade de aliviar fardos.",
  luz: "resistência, responsabilidade, força e conclusão de tarefa.",
  sombra: "cansaço, opressão, peso emocional e excesso de cobrança.",
  ensinamento: "nem todo peso precisa ser carregado sozinho.",
  conselho: "organize suas responsabilidades e peça ajuda se necessário.",
  alerta: "não transforme obrigação em prisão.",
  normal: "Opressão."
},

{
  id: "paus_09",
  arcano: "menor",
  grupo: "paus",
  numero: 9,
  nome: "Nove de Paus",
  traducao: "Representa defesa, resistência, conhecimento especial e força psíquica.",
  significado: "Carta de proteção, vigilância, experiência e força depois das lutas.",
  luz: "proteção, perseverança, sabedoria adquirida e resistência.",
  sombra: "desconfiança, cansaço, defesa excessiva e medo de novo ataque.",
  ensinamento: "a experiência protege, mas não deve aprisionar.",
  conselho: "mantenha-se firme, mas não viva em guerra.",
  alerta: "evite se fechar por causa de feridas antigas.",
  normal: "Conhecimentos especiais."
},

{
  id: "paus_08",
  arcano: "menor",
  grupo: "paus",
  numero: 8,
  nome: "Oito de Paus",
  traducao: "Representa rapidez, notícias, imprevistos e movimento acelerado.",
  significado: "Carta de acontecimentos rápidos, mensagens e mudanças repentinas.",
  luz: "agilidade, comunicação, oportunidade rápida e avanço.",
  sombra: "ansiedade, pressa, confusão e falta de planejamento.",
  ensinamento: "nem toda velocidade significa progresso.",
  conselho: "aja rápido, mas com consciência.",
  alerta: "não responda no impulso.",
  normal: "Notícias imprevistas e rapidez."
},

{
  id: "paus_07",
  arcano: "menor",
  grupo: "paus",
  numero: 7,
  nome: "Sete de Paus",
  traducao: "Representa valor, coragem, risco e defesa da própria posição.",
  significado: "Carta de luta, resistência, enfrentamento e defesa do que é seu.",
  luz: "coragem, vantagem, força, atitude e superação.",
  sombra: "conflito, desgaste, teimosia e necessidade de provar valor.",
  ensinamento: "defenda seu lugar sem perder a cabeça.",
  conselho: "mantenha postura firme diante da oposição.",
  alerta: "não entre em briga por orgulho.",
  normal: "Atividades arriscadas."
},

{
  id: "paus_06",
  arcano: "menor",
  grupo: "paus",
  numero: 6,
  nome: "Seis de Paus",
  traducao: "Representa vitória, reconhecimento e esforços compensados.",
  significado: "Carta de conquista, retorno positivo e mérito reconhecido.",
  luz: "vitória, sucesso, apoio, reconhecimento e avanço.",
  sombra: "vaidade, exposição excessiva e orgulho.",
  ensinamento: "a vitória deve fortalecer a humildade.",
  conselho: "receba o reconhecimento sem perder o equilíbrio.",
  alerta: "não deixe o ego comandar a próxima decisão.",
  normal: "Esforços compensados."
},

{
  id: "paus_05",
  arcano: "menor",
  grupo: "paus",
  numero: 5,
  nome: "Cinco de Paus",
  traducao: "Representa disputa, competição, luta pela vida e confronto.",
  significado: "Carta de conflitos, desafios e necessidade de posicionamento.",
  luz: "energia, coragem, força competitiva e crescimento pelo desafio.",
  sombra: "brigas, confusão, rivalidade e desgaste.",
  ensinamento: "nem toda disputa merece sua energia.",
  conselho: "escolha bem suas batalhas.",
  alerta: "evite alimentar conflito sem necessidade.",
  normal: "Luta pela vida e poder."
},

{
  id: "paus_04",
  arcano: "menor",
  grupo: "paus",
  numero: 4,
  nome: "Quatro de Paus",
  traducao: "Representa celebração, estabilidade, união e harmonia.",
  significado: "Carta de conquistas, comemorações, segurança e felicidade compartilhada.",
  luz: "alegria, união, estabilidade, celebração e realização.",
  sombra: "acomodação, excesso de conforto e estagnação.",
  ensinamento: "celebre suas conquistas sem deixar de evoluir.",
  conselho: "aproveite os momentos felizes e fortaleça seus vínculos.",
  alerta: "não se acomode apenas porque chegou até aqui.",
  normal: "Estabilidade e comemorações."
},

{
  id: "paus_03",
  arcano: "menor",
  grupo: "paus",
  numero: 3,
  nome: "Três de Paus",
  traducao: "Representa expansão, oportunidades e crescimento.",
  significado: "Carta de progresso, novos horizontes e desenvolvimento.",
  luz: "crescimento, expansão, visão de futuro e oportunidades.",
  sombra: "ansiedade, excesso de expectativa e precipitação.",
  ensinamento: "o futuro é construído pelas ações de hoje.",
  conselho: "continue avançando com confiança.",
  alerta: "não queira colher antes do tempo.",
  normal: "Expansão e progresso."
},

{
  id: "paus_02",
  arcano: "menor",
  grupo: "paus",
  numero: 2,
  nome: "Dois de Paus",
  traducao: "Representa planejamento, escolha e visão estratégica.",
  significado: "Carta de decisões importantes e novos caminhos.",
  luz: "planejamento, estratégia, visão e iniciativa.",
  sombra: "indecisão, medo de agir e insegurança.",
  ensinamento: "planejar é importante, mas agir também é necessário.",
  conselho: "analise as possibilidades e tome uma decisão.",
  alerta: "não permaneça eternamente no planejamento.",
  normal: "Planejamento e escolha."
},

{
  id: "paus_as",
  arcano: "menor",
  grupo: "paus",
  numero: 1,
  nome: "Ás de Paus",
  traducao: "Representa início, energia criadora, inspiração e novos caminhos.",
  significado: "Carta de nascimento de ideias, oportunidades e impulso criativo.",
  luz: "criatividade, entusiasmo, iniciativa e força de realização.",
  sombra: "impulsividade, entusiasmo passageiro e falta de continuidade.",
  ensinamento: "todo grande caminho começa com uma centelha.",
  conselho: "aproveite a oportunidade que está surgindo.",
  alerta: "não desperdice o impulso inicial.",
  normal: "Novos começos e oportunidades."
},

{
  id: "copas_rei",
  arcano: "menor",
  grupo: "copas",
  nome: "Rei de Copas",
  traducao: "Representa maturidade emocional, proteção e equilíbrio afetivo.",
  significado: "Carta de sabedoria emocional, amor maduro e proteção.",
  luz: "equilíbrio, amor, proteção, compreensão e serenidade.",
  sombra: "frieza emocional, manipulação sentimental e repressão dos sentimentos.",
  ensinamento: "o verdadeiro amor protege sem aprisionar.",
  conselho: "aja com maturidade emocional.",
  alerta: "não esconda excessivamente seus sentimentos.",
  normal: "Proteção emocional e maturidade."
},

{
  id: "copas_rainha",
  arcano: "menor",
  grupo: "copas",
  nome: "Rainha de Copas",
  traducao: "Representa sensibilidade, intuição, amor e acolhimento.",
  significado: "Carta de forte sensibilidade emocional e espiritual.",
  luz: "amor, intuição, carinho, sensibilidade e empatia.",
  sombra: "carência, excesso de sensibilidade e dependência emocional.",
  ensinamento: "amar não significa esquecer de si mesmo.",
  conselho: "escute sua intuição e proteja seu coração.",
  alerta: "evite absorver os problemas dos outros.",
  normal: "Sensibilidade e amor."
},

{
  id: "copas_cavaleiro",
  arcano: "menor",
  grupo: "copas",
  nome: "Cavaleiro de Copas",
  traducao: "Representa romance, propostas, aproximações e emoções em movimento.",
  significado: "Carta de convites, novidades afetivas e sonhos.",
  luz: "romance, sensibilidade, inspiração e movimento amoroso.",
  sombra: "ilusões, promessas vazias e instabilidade emocional.",
  ensinamento: "nem toda promessa representa compromisso.",
  conselho: "permita-se viver o amor, mas mantenha os pés no chão.",
  alerta: "não idealize excessivamente pessoas e situações.",
  normal: "Propostas e novidades afetivas."
},

{
  id: "copas_valete",
  arcano: "menor",
  grupo: "copas",
  nome: "Valete de Copas",
  traducao: "Representa mensagens emocionais, novidades e despertar afetivo.",
  significado: "Carta de notícias amorosas, criatividade e emoções emergentes.",
  luz: "novidades, alegria, inspiração e afetividade.",
  sombra: "imaturidade emocional e ingenuidade.",
  ensinamento: "o coração precisa amadurecer junto com a experiência.",
  conselho: "receba o novo com leveza, mas observe os sinais.",
  alerta: "evite acreditar em tudo imediatamente.",
  normal: "Boas notícias e emoções novas."
},

{
  id: "copas_10",
  arcano: "menor",
  grupo: "copas",
  numero: 10,
  nome: "Dez de Copas",
  traducao: "Representa felicidade, harmonia familiar e realização emocional.",
  significado: "Carta de plenitude, união e felicidade compartilhada.",
  luz: "amor, harmonia, família, felicidade e realização.",
  sombra: "idealização excessiva e expectativas irreais.",
  ensinamento: "a felicidade se constrói diariamente.",
  conselho: "valorize quem caminha ao seu lado.",
  alerta: "não espere perfeição absoluta.",
  normal: "Felicidade e realização afetiva."
},

{
  id: "copas_09",
  arcano: "menor",
  grupo: "copas",
  numero: 9,
  nome: "Nove de Copas",
  traducao: "Representa satisfação, desejos realizados e prazer.",
  significado: "Carta de contentamento e realização pessoal.",
  luz: "satisfação, prazer, abundância e gratidão.",
  sombra: "acomodação, egoísmo e excessos.",
  ensinamento: "aprecie suas conquistas sem perder a humildade.",
  conselho: "agradeça pelas bênçãos recebidas.",
  alerta: "evite excessos emocionais ou materiais.",
  normal: "Desejos realizados."
},

{
  id: "copas_08",
  arcano: "menor",
  grupo: "copas",
  numero: 8,
  nome: "Oito de Copas",
  traducao: "Representa afastamento, desapego e busca de novos sentidos.",
  significado: "Carta de partida emocional e renovação interior.",
  luz: "desapego, amadurecimento e busca espiritual.",
  sombra: "tristeza, abandono e dificuldade para seguir em frente.",
  ensinamento: "algumas partidas são necessárias para crescer.",
  conselho: "deixe para trás aquilo que já não alimenta sua alma.",
  alerta: "não permaneça preso ao passado.",
  normal: "Afastamento e renovação."
},

{
  id: "copas_07",
  arcano: "menor",
  grupo: "copas",
  numero: 7,
  nome: "Sete de Copas",
  traducao: "Representa sonhos, possibilidades e ilusões.",
  significado: "Carta de escolhas emocionais e múltiplas opções.",
  luz: "imaginação, criatividade e oportunidades.",
  sombra: "confusão, ilusão e indecisão.",
  ensinamento: "nem toda possibilidade deve ser escolhida.",
  conselho: "analise a realidade antes de decidir.",
  alerta: "evite fantasias excessivas.",
  normal: "Sonhos e possibilidades."
},

{
  id: "copas_06",
  arcano: "menor",
  grupo: "copas",
  numero: 6,
  nome: "Seis de Copas",
  traducao: "Representa lembranças, nostalgia e reencontros.",
  significado: "Carta ligada ao passado, à infância e às memórias afetivas.",
  luz: "reencontros, carinho, inocência e afeto sincero.",
  sombra: "saudosismo excessivo e apego ao passado.",
  ensinamento: "honre o passado sem viver nele.",
  conselho: "valorize suas raízes, mas siga adiante.",
  alerta: "não permita que a nostalgia impeça seu crescimento.",
  normal: "Reencontros e lembranças."
},

{
  id: "copas_05",
  arcano: "menor",
  grupo: "copas",
  numero: 5,
  nome: "Cinco de Copas",
  traducao: "Representa perdas, decepções e necessidade de superação.",
  significado: "Carta de tristeza passageira e aprendizado emocional.",
  luz: "aprendizado, amadurecimento e reconstrução.",
  sombra: "mágoa, tristeza e arrependimento.",
  ensinamento: "nem tudo está perdido, mesmo após uma decepção.",
  conselho: "olhe para aquilo que ainda permanece em sua vida.",
  alerta: "não alimente sofrimento desnecessário.",
  normal: "Perdas e superação."
},

{
  id: "copas_04",
  arcano: "menor",
  grupo: "copas",
  numero: 4,
  nome: "Quatro de Copas",
  traducao: "Representa introspecção, reflexão e necessidade de renovação emocional.",
  significado: "Carta de pausa emocional e revisão de sentimentos.",
  luz: "autoconhecimento, reflexão e amadurecimento.",
  sombra: "apatia, desânimo e insatisfação.",
  ensinamento: "às vezes é necessário parar para compreender o coração.",
  conselho: "observe novas oportunidades ao seu redor.",
  alerta: "não rejeite aquilo que pode lhe fazer bem.",
  normal: "Reflexão e introspecção."
},

{
  id: "copas_03",
  arcano: "menor",
  grupo: "copas",
  numero: 3,
  nome: "Três de Copas",
  traducao: "Representa celebração, amizade e felicidade compartilhada.",
  significado: "Carta de encontros, comemorações e união.",
  luz: "amizade, alegria, união e celebração.",
  sombra: "excessos, superficialidade e exageros.",
  ensinamento: "a felicidade cresce quando compartilhada.",
  conselho: "valorize as pessoas que celebram suas vitórias.",
  alerta: "evite excessos emocionais ou materiais.",
  normal: "Alegria e comemorações."
},

{
  id: "copas_02",
  arcano: "menor",
  grupo: "copas",
  numero: 2,
  nome: "Dois de Copas",
  traducao: "Representa união, parceria e reciprocidade.",
  significado: "Carta de amor, acordos e conexões verdadeiras.",
  luz: "amor, parceria, equilíbrio e reciprocidade.",
  sombra: "dependência emocional e idealização.",
  ensinamento: "toda relação saudável precisa de equilíbrio.",
  conselho: "cultive relações sinceras e recíprocas.",
  alerta: "não se anule para manter uma relação.",
  normal: "União e parceria."
},

{
  id: "copas_as",
  arcano: "menor",
  grupo: "copas",
  numero: 1,
  nome: "Ás de Copas",
  traducao: "Representa nascimento do amor, renovação emocional e bênçãos afetivas.",
  significado: "Carta de novos sentimentos, amor e abertura emocional.",
  luz: "amor, felicidade, renovação e sensibilidade.",
  sombra: "carência, idealização e expectativas excessivas.",
  ensinamento: "abra o coração sem perder a própria essência.",
  conselho: "permita-se viver novos sentimentos.",
  alerta: "não entregue seu coração sem discernimento.",
  normal: "Novo amor e renovação emocional."
},
{
  id: "espadas_rei",
  arcano: "menor",
  grupo: "espadas",
  nome: "Rei de Espadas",
  traducao: "Representa inteligência, autoridade mental, estratégia e justiça.",
  significado: "Carta de razão, disciplina, liderança intelectual e decisões firmes.",
  luz: "clareza, justiça, inteligência, estratégia e discernimento.",
  sombra: "frieza, rigidez, críticas excessivas e autoritarismo.",
  ensinamento: "a verdade deve ser usada com sabedoria e não como arma.",
  conselho: "analise os fatos antes de decidir.",
  alerta: "evite agir apenas pela razão esquecendo os sentimentos.",
  normal: "Autoridade intelectual e decisões firmes."
},

{
  id: "espadas_rainha",
  arcano: "menor",
  grupo: "espadas",
  nome: "Rainha de Espadas",
  traducao: "Representa independência, inteligência, sinceridade e discernimento.",
  significado: "Carta de lucidez, autonomia e visão clara da realidade.",
  luz: "sabedoria, independência, sinceridade e discernimento.",
  sombra: "frieza emocional, isolamento e excesso de crítica.",
  ensinamento: "a verdade pode ser dita sem destruir.",
  conselho: "confie na sua inteligência e mantenha a objetividade.",
  alerta: "não permita que antigas dores endureçam seu coração.",
  normal: "Lucidez e independência."
},

{
  id: "espadas_cavaleiro",
  arcano: "menor",
  grupo: "espadas",
  nome: "Cavaleiro de Espadas",
  traducao: "Representa ação rápida, coragem, debates e enfrentamentos.",
  significado: "Carta de movimento intenso, desafios e ação direta.",
  luz: "coragem, determinação, rapidez e iniciativa.",
  sombra: "impulsividade, agressividade e conflitos desnecessários.",
  ensinamento: "nem toda batalha precisa ser travada imediatamente.",
  conselho: "pense antes de agir ou responder.",
  alerta: "evite agir movido apenas pela raiva.",
  normal: "Movimento rápido e enfrentamentos."
},

{
  id: "espadas_valete",
  arcano: "menor",
  grupo: "espadas",
  nome: "Valete de Espadas",
  traducao: "Representa vigilância, curiosidade, notícias e novos aprendizados.",
  significado: "Carta de observação, estudo e necessidade de atenção.",
  luz: "aprendizado, atenção, inteligência e curiosidade.",
  sombra: "fofoca, desconfiança excessiva e ansiedade mental.",
  ensinamento: "observar é importante, mas obsessão gera sofrimento.",
  conselho: "busque informações antes de concluir qualquer situação.",
  alerta: "evite alimentar suspeitas sem provas.",
  normal: "Observação e novas informações."
},

{
  id: "espadas_10",
  arcano: "menor",
  grupo: "espadas",
  numero: 10,
  nome: "Dez de Espadas",
  traducao: "Representa fim doloroso, encerramento e libertação através da verdade.",
  significado: "Carta de conclusão difícil, mas necessária.",
  luz: "libertação, encerramento e renascimento.",
  sombra: "dor, sofrimento, perdas e sensação de derrota.",
  ensinamento: "alguns finais são necessários para um novo começo.",
  conselho: "aceite o encerramento e permita-se recomeçar.",
  alerta: "não prolongue sofrimentos já encerrados pela vida.",
  normal: "Fim de ciclo e libertação."
},

{
  id: "espadas_09",
  arcano: "menor",
  grupo: "espadas",
  numero: 9,
  nome: "Nove de Espadas",
  traducao: "Representa preocupações, ansiedade, medos e sofrimento mental.",
  significado: "Carta ligada ao excesso de pensamentos e angústias.",
  luz: "tomada de consciência e busca de ajuda.",
  sombra: "ansiedade, insônia, culpa e sofrimento emocional.",
  ensinamento: "nem todos os medos refletem a realidade.",
  conselho: "procure apoio e não enfrente tudo sozinho.",
  alerta: "evite alimentar pensamentos negativos repetitivos.",
  normal: "Ansiedade e preocupações."
},

{
  id: "espadas_08",
  arcano: "menor",
  grupo: "espadas",
  numero: 8,
  nome: "Oito de Espadas",
  traducao: "Representa bloqueios mentais, limitações e sensação de aprisionamento.",
  significado: "Carta de restrições criadas pelo medo ou pela mente.",
  luz: "percepção da realidade e libertação interior.",
  sombra: "medo, insegurança e autossabotagem.",
  ensinamento: "muitas prisões existem apenas dentro da mente.",
  conselho: "questione seus próprios limites.",
  alerta: "não subestime sua capacidade de superação.",
  normal: "Bloqueios e limitações."
},

{
  id: "espadas_07",
  arcano: "menor",
  grupo: "espadas",
  numero: 7,
  nome: "Sete de Espadas",
  traducao: "Representa estratégia, prudência, segredos e necessidade de atenção.",
  significado: "Carta de inteligência estratégica e cautela.",
  luz: "estratégia, inteligência e discrição.",
  sombra: "enganos, mentiras, traições e manipulação.",
  ensinamento: "agir com inteligência é diferente de agir com desonestidade.",
  conselho: "observe mais e fale menos.",
  alerta: "cuidado com pessoas falsas ou intenções ocultas.",
  normal: "Estratégia e prudência."
},

{
  id: "espadas_06",
  arcano: "menor",
  grupo: "espadas",
  numero: 6,
  nome: "Seis de Espadas",
  traducao: "Representa transição, mudança e afastamento de dificuldades.",
  significado: "Carta de passagem para tempos melhores.",
  luz: "superação, mudança positiva e evolução.",
  sombra: "saudade, dificuldade de desapego e insegurança.",
  ensinamento: "deixar o passado para trás faz parte da cura.",
  conselho: "aceite as mudanças necessárias.",
  alerta: "não carregue dores antigas para novos caminhos.",
  normal: "Mudança e superação."
},

{
  id: "espadas_05",
  arcano: "menor",
  grupo: "espadas",
  numero: 5,
  nome: "Cinco de Espadas",
  traducao: "Representa conflitos, derrotas, orgulho e disputas desgastantes.",
  significado: "Carta de tensões, desentendimentos e necessidade de reflexão.",
  luz: "aprendizado através dos conflitos.",
  sombra: "brigas, ressentimentos e orgulho excessivo.",
  ensinamento: "nem toda vitória vale o preço pago.",
  conselho: "escolha cuidadosamente suas batalhas.",
  alerta: "evite conflitos alimentados apenas pelo ego.",
  normal: "Conflitos e disputas."
},

{
  id: "espadas_04",
  arcano: "menor",
  grupo: "espadas",
  numero: 4,
  nome: "Quatro de Espadas",
  traducao: "Representa descanso, pausa, recuperação e introspecção.",
  significado: "Carta de repouso necessário e reorganização interior.",
  luz: "cura, reflexão, descanso e equilíbrio.",
  sombra: "isolamento excessivo e estagnação.",
  ensinamento: "descansar também faz parte do caminho.",
  conselho: "respeite seus limites físicos e emocionais.",
  alerta: "não transforme descanso em acomodação.",
  normal: "Repouso e recuperação."
},

{
  id: "espadas_03",
  arcano: "menor",
  grupo: "espadas",
  numero: 3,
  nome: "Três de Espadas",
  traducao: "Representa dor, separação, decepção e necessidade de cura.",
  significado: "Carta de sofrimento emocional e aprendizado.",
  luz: "cura, amadurecimento e libertação.",
  sombra: "mágoas, tristeza e sofrimento prolongado.",
  ensinamento: "a dor também ensina e transforma.",
  conselho: "permita-se sentir, mas não permaneça preso ao sofrimento.",
  alerta: "evite alimentar ressentimentos antigos.",
  normal: "Decepções e aprendizados."
},

{
  id: "espadas_02",
  arcano: "menor",
  grupo: "espadas",
  numero: 2,
  nome: "Dois de Espadas",
  traducao: "Representa indecisão, dúvida e necessidade de escolha.",
  significado: "Carta de impasse e busca de equilíbrio.",
  luz: "prudência, reflexão e análise.",
  sombra: "paralisia, medo de decidir e negação da realidade.",
  ensinamento: "não decidir também é uma escolha.",
  conselho: "encare a verdade e tome uma decisão.",
  alerta: "evite fugir de situações inevitáveis.",
  normal: "Dúvidas e decisões."
},

{
  id: "espadas_as",
  arcano: "menor",
  grupo: "espadas",
  numero: 1,
  nome: "Ás de Espadas",
  traducao: "Representa clareza, verdade, justiça e novos entendimentos.",
  significado: "Carta de lucidez mental e revelação.",
  luz: "clareza, verdade, justiça e discernimento.",
  sombra: "rigidez, críticas e excesso de racionalidade.",
  ensinamento: "a verdade liberta quando usada com sabedoria.",
  conselho: "busque clareza antes de agir.",
  alerta: "evite decisões precipitadas baseadas apenas na razão.",
  normal: "Clareza e verdade."
},

{
  id: "ouros_rei",
  arcano: "menor",
  grupo: "ouros",
  nome: "Rei de Ouros",
  traducao: "Representa prosperidade, segurança material, liderança e sucesso financeiro.",
  significado: "Carta de estabilidade, riqueza, responsabilidade e maturidade.",
  luz: "prosperidade, estabilidade, abundância e segurança.",
  sombra: "materialismo, ganância, controle excessivo e apego ao dinheiro.",
  ensinamento: "a verdadeira riqueza inclui equilíbrio espiritual e material.",
  conselho: "administre seus recursos com sabedoria.",
  alerta: "não coloque o dinheiro acima dos valores humanos.",
  normal: "Prosperidade e estabilidade."
},

{
  id: "ouros_rainha",
  arcano: "menor",
  grupo: "ouros",
  nome: "Rainha de Ouros",
  traducao: "Representa fertilidade, segurança, cuidado e prosperidade.",
  significado: "Carta de abundância, proteção familiar e equilíbrio material.",
  luz: "cuidado, prosperidade, acolhimento e estabilidade.",
  sombra: "possessividade, excesso de preocupação e apego material.",
  ensinamento: "prosperidade também é cuidar de quem amamos.",
  conselho: "valorize tanto os recursos quanto os afetos.",
  alerta: "não transforme segurança em controle.",
  normal: "Abundância e proteção."
},

{
  id: "ouros_cavaleiro",
  arcano: "menor",
  grupo: "ouros",
  nome: "Cavaleiro de Ouros",
  traducao: "Representa perseverança, responsabilidade e progresso constante.",
  significado: "Carta de trabalho, disciplina e crescimento gradual.",
  luz: "disciplina, dedicação, segurança e persistência.",
  sombra: "lentidão, teimosia e excesso de rotina.",
  ensinamento: "o progresso sólido exige constância.",
  conselho: "continue avançando, mesmo que lentamente.",
  alerta: "não deixe a rotina apagar seus sonhos.",
  normal: "Trabalho e perseverança."
},

{
  id: "ouros_valete",
  arcano: "menor",
  grupo: "ouros",
  nome: "Valete de Ouros",
  traducao: "Representa novas oportunidades materiais, estudos e crescimento.",
  significado: "Carta de aprendizado, novidades financeiras e oportunidades.",
  luz: "crescimento, aprendizado, oportunidades e prosperidade.",
  sombra: "imaturidade financeira e falta de planejamento.",
  ensinamento: "todo conhecimento pode gerar prosperidade.",
  conselho: "invista no aprendizado e nas novas oportunidades.",
  alerta: "não desperdice boas oportunidades por distração.",
  normal: "Novas oportunidades."
},

{
  id: "ouros_10",
  arcano: "menor",
  grupo: "ouros",
  numero: 10,
  nome: "Dez de Ouros",
  traducao: "Representa riqueza, herança, estabilidade e prosperidade familiar.",
  significado: "Carta de abundância, legado e segurança duradoura.",
  luz: "prosperidade, família, segurança e sucesso material.",
  sombra: "apego excessivo ao patrimônio e conflitos familiares.",
  ensinamento: "o verdadeiro legado vai além do dinheiro.",
  conselho: "valorize tanto a prosperidade quanto os laços familiares.",
  alerta: "não permita que questões materiais destruam relações.",
  normal: "Riqueza e estabilidade."
},

{
  id: "ouros_09",
  arcano: "menor",
  grupo: "ouros",
  numero: 9,
  nome: "Nove de Ouros",
  traducao: "Representa independência, conforto e realização pessoal.",
  significado: "Carta de sucesso conquistado através do esforço próprio.",
  luz: "autonomia, prosperidade, conforto e satisfação.",
  sombra: "isolamento, orgulho e excesso de autossuficiência.",
  ensinamento: "o sucesso é mais valioso quando compartilhado.",
  conselho: "desfrute suas conquistas com gratidão.",
  alerta: "não se isole por excesso de independência.",
  normal: "Realização e independência."
},

{
  id: "ouros_08",
  arcano: "menor",
  grupo: "ouros",
  numero: 8,
  nome: "Oito de Ouros",
  traducao: "Representa dedicação, aperfeiçoamento e aprendizado contínuo.",
  significado: "Carta de trabalho, evolução profissional e disciplina.",
  luz: "dedicação, aperfeiçoamento, crescimento e competência.",
  sombra: "perfeccionismo, excesso de trabalho e desgaste.",
  ensinamento: "a excelência nasce da prática constante.",
  conselho: "continue aperfeiçoando seus talentos.",
  alerta: "não transforme trabalho em obsessão.",
  normal: "Aprendizado e aperfeiçoamento."
},

{
  id: "ouros_07",
  arcano: "menor",
  grupo: "ouros",
  numero: 7,
  nome: "Sete de Ouros",
  traducao: "Representa espera, avaliação e colheita futura.",
  significado: "Carta de paciência, planejamento e resultados graduais.",
  luz: "paciência, perseverança e amadurecimento.",
  sombra: "impaciência, frustração e desistência prematura.",
  ensinamento: "nem toda colheita acontece imediatamente.",
  conselho: "tenha paciência e continue cultivando.",
  alerta: "não abandone um projeto próximo da colheita.",
  normal: "Paciência e crescimento."
},

{
  id: "ouros_06",
  arcano: "menor",
  grupo: "ouros",
  numero: 6,
  nome: "Seis de Ouros",
  traducao: "Representa generosidade, equilíbrio material e ajuda mútua.",
  significado: "Carta de troca justa, solidariedade e apoio.",
  luz: "generosidade, equilíbrio, ajuda e prosperidade compartilhada.",
  sombra: "dependência, orgulho ou desequilíbrio nas trocas.",
  ensinamento: "dar e receber fazem parte da prosperidade.",
  conselho: "compartilhe quando puder e aceite ajuda quando necessário.",
  alerta: "evite relações baseadas apenas em interesses.",
  normal: "Ajuda e equilíbrio."
},

{
  id: "ouros_05",
  arcano: "menor",
  grupo: "ouros",
  numero: 5,
  nome: "Cinco de Ouros",
  traducao: "Representa dificuldades materiais, insegurança e necessidade de apoio.",
  significado: "Carta de desafios financeiros e emocionais temporários.",
  luz: "superação, humildade e aprendizado.",
  sombra: "escassez, medo, perdas e isolamento.",
  ensinamento: "momentos difíceis também passam.",
  conselho: "não tenha medo de pedir ajuda.",
  alerta: "evite enfrentar tudo sozinho.",
  normal: "Dificuldades e superação."
},

{
  id: "ouros_04",
  arcano: "menor",
  grupo: "ouros",
  numero: 4,
  nome: "Quatro de Ouros",
  traducao: "Representa segurança, proteção e necessidade de controle.",
  significado: "Carta de estabilidade material e preservação.",
  luz: "segurança, prudência e estabilidade.",
  sombra: "avareza, apego e medo de perder.",
  ensinamento: "segurança não deve se transformar em prisão.",
  conselho: "proteja o que conquistou sem excessos.",
  alerta: "não permita que o medo impeça seu crescimento.",
  normal: "Segurança e proteção."
},

{
  id: "ouros_03",
  arcano: "menor",
  grupo: "ouros",
  numero: 3,
  nome: "Três de Ouros",
  traducao: "Representa trabalho em equipe, reconhecimento e construção.",
  significado: "Carta de colaboração, desenvolvimento e progresso.",
  luz: "cooperação, reconhecimento, aprendizado e crescimento.",
  sombra: "competição, falta de união e desvalorização.",
  ensinamento: "grandes obras raramente são construídas sozinhas.",
  conselho: "valorize o trabalho em conjunto.",
  alerta: "não subestime a importância das parcerias.",
  normal: "Colaboração e reconhecimento."
},

{
  id: "ouros_02",
  arcano: "menor",
  grupo: "ouros",
  numero: 2,
  nome: "Dois de Ouros",
  traducao: "Representa equilíbrio, adaptação e flexibilidade.",
  significado: "Carta de movimento, organização e ajustes necessários.",
  luz: "adaptabilidade, equilíbrio e dinamismo.",
  sombra: "instabilidade, desorganização e excesso de preocupações.",
  ensinamento: "equilibrar diferentes áreas da vida é essencial.",
  conselho: "organize prioridades e mantenha flexibilidade.",
  alerta: "não tente abraçar tudo ao mesmo tempo.",
  normal: "Equilíbrio e adaptação."
},

{
  id: "ouros_as",
  arcano: "menor",
  grupo: "ouros",
  numero: 1,
  nome: "Ás de Ouros",
  traducao: "Representa prosperidade, oportunidades e novos começos materiais.",
  significado: "Carta de abundância, crescimento financeiro e segurança.",
  luz: "prosperidade, oportunidade, abundância e realização.",
  sombra: "materialismo excessivo e apego ao dinheiro.",
  ensinamento: "toda prosperidade começa com uma oportunidade.",
  conselho: "aproveite as oportunidades que surgirem.",
  alerta: "não desperdice recursos por impulsividade.",
  normal: "Prosperidade e novos começos."
}
];



function detectarTema(pergunta: string): string {
  const t = normalizar(pergunta);

  if (t.includes('amor') || t.includes('ex') || t.includes('relacionamento') || t.includes('volta')) return 'amor';
  if (t.includes('trabalho') || t.includes('dinheiro') || t.includes('emprego') || t.includes('negocio')) return 'prosperidade';
  if (t.includes('espiritual') || t.includes('guia') || t.includes('entidade') || t.includes('caminho')) return 'espiritualidade';
  if (t.includes('familia') || t.includes('casa') || t.includes('filho')) return 'família';

  return 'geral';
}

function cartaPorIndice(base: number, salto: number) {
  return ARCANOS[(base + salto) % ARCANOS.length];
}

export function buildTarotSupremo(input: TarotInput) {
  const nome = input.fullName || '';
  const nascimento = input.birthDate || '';
  const pergunta = input.question || '';

  const base = calcularBaseNumerica(nome, nascimento, pergunta);
  const tema = detectarTema(pergunta);

  const passado = cartaPorIndice(base, 1);
  const presente = cartaPorIndice(base, 4);
  const tendencia = cartaPorIndice(base, 7);
  const obstaculo = cartaPorIndice(base, 10);
  const conselho = cartaPorIndice(base, 13);
  const energiaOculta = cartaPorIndice(base, 16);

  const resumoParaMariaPadilha = `
TAROT PREMIUM SUPREMO

Tema detectado: ${tema}

═══════════════════════
PASSADO
═══════════════════════

Carta: ${passado.nome}

Tradução:
${passado.traducao}

Significado:
${passado.significado}

Luz:
${passado.luz}

Sombra:
${passado.sombra}

Conselho:
${passado.conselho}

═══════════════════════
PRESENTE
═══════════════════════

Carta: ${presente.nome}

Tradução:
${presente.traducao}

Significado:
${presente.significado}

Luz:
${presente.luz}

Sombra:
${presente.sombra}

Conselho:
${presente.conselho}

═══════════════════════
TENDÊNCIA
═══════════════════════

Carta: ${tendencia.nome}

Tradução:
${tendencia.traducao}

Significado:
${tendencia.significado}

Luz:
${tendencia.luz}

Sombra:
${tendencia.sombra}

Conselho:
${tendencia.conselho}

═══════════════════════
OBSTÁCULO
═══════════════════════

Carta: ${obstaculo.nome}

Tradução:
${obstaculo.traducao}

Significado:
${obstaculo.significado}

Luz:
${obstaculo.luz}

Sombra:
${obstaculo.sombra}

Conselho:
${obstaculo.conselho}

═══════════════════════
CONSELHO ESPIRITUAL
═══════════════════════

Carta: ${conselho.nome}

Tradução:
${conselho.traducao}

Significado:
${conselho.significado}

Conselho:
${conselho.conselho}

═══════════════════════
ENERGIA OCULTA
═══════════════════════

Carta: ${energiaOculta.nome}

Tradução:
${energiaOculta.traducao}

Significado:
${energiaOculta.significado}

Luz:
${energiaOculta.luz}

Sombra:
${energiaOculta.sombra}

═══════════════════════
INSTRUÇÕES PARA MARIA PADILHA
═══════════════════════

Você é Maria Padilha Rainha das 7 Encruzilhadas.

Interprete as cartas de forma espiritual, popular, firme e acolhedora.

Nunca diga que sorteou cartas.
Nunca diga que calculou.
Nunca fale como relatório técnico.

Use as cartas como bastidor espiritual.

Explique:

• o que aconteceu no passado;
• o que acontece no presente;
• a tendência futura;
• os obstáculos;
• os bloqueios;
• os caminhos favoráveis;
• a orientação espiritual.

Fale como entidade espiritual.
`.trim();
  return {
    entrada: {
      fullName: nome,
      birthDate: nascimento,
      question: pergunta
    },

    tema,

    tarot: {
      passado,
      presente,
      tendencia,
      obstaculo,
      conselho,
      energiaOculta
    },

    resumoParaMariaPadilha
  };
}

export default buildTarotSupremo;