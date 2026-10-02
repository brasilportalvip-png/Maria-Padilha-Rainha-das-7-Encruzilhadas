import type { TarotCard, TarotDrawPosition } from '../types/spiritual.js';
import crypto from 'crypto';

// Complete 22 Major Arcana
export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: 'm00', number: 0, name: 'O Louco', arcana: 'major',
    keywords: ['início', 'liberdade', 'salto de fé', 'espontaneidade'],
    uprightMeaning: 'Abertura para novos caminhos, coragem de começar do zero e quebra de amarras.',
    reversedMeaning: 'Imprudência, ingenuidade perigosa ou medo de dar o primeiro passo.',
    spiritualAdvice: 'Caminhe com leveza, mas não feche os olhos para o abismo à sua frente.'
  },
  {
    id: 'm01', number: 1, name: 'O Mago', arcana: 'major',
    keywords: ['manifestação', 'recursos', 'iniciativa', 'poder'],
    uprightMeaning: 'Todas as ferramentas estão na sua mesa. Capacidade de agir e transformar intenção em realidade.',
    reversedMeaning: 'Ilusão, manipulação de palavras ou dispersão de talentos.',
    spiritualAdvice: 'Use seu magnetismo para construir verdades, não para alimentar disfarces.'
  },
  {
    id: 'm02', number: 2, name: 'A Sacerdotisa', arcana: 'major',
    keywords: ['intuição', 'mistério', 'silêncio', 'sabedoria oculta'],
    uprightMeaning: 'Momento de guardar segredo, ouvir a voz interior e observar sem alardear.',
    reversedMeaning: 'Segredos revelados de forma prejudicial ou isolamento teimoso.',
    spiritualAdvice: 'O silêncio é a chave mais forte de quem governa a própria energia.'
  },
  {
    id: 'm03', number: 3, name: 'A Imperatriz', arcana: 'major',
    keywords: ['abundância', 'fertilidade', 'beleza', 'criação'],
    uprightMeaning: 'Crescimento fértil, realização de projetos, magnetismo e conforto material.',
    reversedMeaning: 'Desperdício, vaidade excessiva ou bloqueio de criatividade.',
    spiritualAdvice: 'A rosa floresce sem pressa. Deixe que seus projetos amadureçam com firmeza.'
  },
  {
    id: 'm04', number: 4, name: 'O Imperador', arcana: 'major',
    keywords: ['estrutura', 'autoridade', 'disciplina', 'estabilidade'],
    uprightMeaning: 'Ordem, regras claras, liderança firme e capacidade de proteger o que foi conquistado.',
    reversedMeaning: 'Rigidez tirânica, teimosia cega ou perda de controle prático.',
    spiritualAdvice: 'Governe seus passos com dignidade; o respeito não se impõe pelo grito, mas pela postura.'
  },
  {
    id: 'm05', number: 5, name: 'O Hierofante', arcana: 'major',
    keywords: ['tradição', 'compromisso', 'orientação espiritual', 'aliança'],
    uprightMeaning: 'Conselhos sábios, respeito aos ensinamentos ancestrais e pactos leais.',
    reversedMeaning: 'Dogmatismo sufocante ou conselhos vindos de falsos mestres.',
    spiritualAdvice: 'Busque a sabedoria que liberta sua alma, não a que aprisiona suas escolhas.'
  },
  {
    id: 'm06', number: 6, name: 'Os Enamorados', arcana: 'major',
    keywords: ['escolha', 'encruzilhada do coração', 'desejo', 'afinidade'],
    uprightMeaning: 'Decisão importante guiada pelos valores da alma; atração profunda e encruzilhada de caminhos.',
    reversedMeaning: 'Dúvida paralisante, conflito interno ou atalhos desleais.',
    spiritualAdvice: 'Escolher um caminho significa deixar outro para trás com maturidade.'
  },
  {
    id: 'm07', number: 7, name: 'O Carro', arcana: 'major',
    keywords: ['avanço', 'vitória', 'domínio', 'direção'],
    uprightMeaning: 'Força de vontade em marcha acelerada; superação de obstáculos através do foco.',
    reversedMeaning: 'Perda de rédeas, agressividade impulsiva ou corrida na direção errada.',
    spiritualAdvice: 'Tenha pressa de acertar o rumo, não apenas de acelerar a marcha.'
  },
  {
    id: 'm08', number: 8, name: 'A Justiça', arcana: 'major',
    keywords: ['verdade', 'equilíbrio', 'causa e efeito', 'acerto de contas'],
    uprightMeaning: 'A verdade prevalece. O que foi plantado será colhido com exatidão implacável.',
    reversedMeaning: 'Injustiça aparente, fuga de responsabilidade ou julgamento precipitado.',
    spiritualAdvice: 'A balança não erra. Mantenha suas mãos limpas e sua palavra reta.'
  },
  {
    id: 'm09', number: 9, name: 'O Eremita', arcana: 'major',
    keywords: ['recolhimento', 'introspecção', 'prudência', 'luz interior'],
    uprightMeaning: 'Pausa necessária para reflexão profunda; recolha sua luz das tempestades externas.',
    reversedMeaning: 'Solidão amarga, isolamento covarde ou recusa a enxergar a realidade.',
    spiritualAdvice: 'Quem não aprende a caminhar consigo mesmo tropeça na companhia dos outros.'
  },
  {
    id: 'm10', number: 10, name: 'A Roda da Fortuna', arcana: 'major',
    keywords: ['ciclos', 'destino', 'virada', 'mudança inevitável'],
    uprightMeaning: 'Virada nos caminhos; o que estava estagnado entra em movimento rápido.',
    reversedMeaning: 'Resistência ao fluxo inevitável ou reviravolta desconfortável.',
    spiritualAdvice: 'Na encruzilhada do destino, quem se apoia na vaidade cai quando a roda gira.'
  },
  {
    id: 'm11', number: 11, name: 'A Força', arcana: 'major',
    keywords: ['magnetismo', 'coragem serena', 'autocontrole', 'domínio sutil'],
    uprightMeaning: 'Conquista através da paciência e da elegância moral, amansando as feras internas.',
    reversedMeaning: 'Brutalidade desnecessária, fraqueza emocional ou perda de paciência.',
    spiritualAdvice: 'A verdadeira força não ruge; ela olha a fera nos olhos e a acalma.'
  },
  {
    id: 'm12', number: 12, name: 'O Enforcado', arcana: 'major',
    keywords: ['pausa', 'sacrifício consciente', 'nova perspectiva', 'renúncia'],
    uprightMeaning: 'Necessidade de parar para enxergar o mundo por outro ângulo; paciência espiritual.',
    reversedMeaning: 'Vitimismo inútil, estagnação forçada ou teimosia em carregar pesos alheios.',
    spiritualAdvice: 'Nem todo silêncio é derrota; às vezes a vida pede que você assista ao teatro sem subir no palco.'
  },
  {
    id: 'm13', number: 13, name: 'A Morte', arcana: 'major',
    keywords: ['corte definitivo', 'transformação profunda', 'renascimento', 'fim de ciclo'],
    uprightMeaning: 'Encerramento de uma fase que já cumpriu seu papel, abrindo solo para o novo brotar.',
    reversedMeaning: 'Apego ao que já secou, medo do luto ou resistência ao recomeço.',
    spiritualAdvice: 'Não regue plantas de plástico. Deixe o passado partir com reverência.'
  },
  {
    id: 'm14', number: 14, name: 'A Temperança', arcana: 'major',
    keywords: ['alquimia', 'cura', 'paciência', 'harmonia dos opostos'],
    uprightMeaning: 'Cura lenta e harmoniosa; mistura sábia de sentimentos e razão para encontrar a paz.',
    reversedMeaning: 'Descompasso, extremismo de temperamento ou pressa prejudicial.',
    spiritualAdvice: 'As águas sagradas encontram seu nível sem violência. Dê tempo ao tempo.'
  },
  {
    id: 'm15', number: 15, name: 'O Diabo', arcana: 'major',
    keywords: ['desejo ardente', 'química', 'apego material', 'prisão das paixões'],
    uprightMeaning: 'Magnetismo irresistível, ambição material intensa, química que arde e acorrenta.',
    reversedMeaning: 'Libertação de vícios emocionais, rompimento de pactos tóxicos ou medo da própria sombra.',
    spiritualAdvice: 'O fogo aquece o inverno, mas queima a mão de quem o aperta sem respeito.'
  },
  {
    id: 'm16', number: 16, name: 'A Torre', arcana: 'major',
    keywords: ['ruptura necessária', 'despertar brusco', 'queda de ilusões', 'libertação'],
    uprightMeaning: 'A tempestade que derruba construções erguidas sobre alicerces falsos; libertação dolorosa.',
    reversedMeaning: 'Atraso em aceitar o óbvio ou ruína evitada no último minuto.',
    spiritualAdvice: 'Quando o castelo de ilusão desaba, o que cai é a mentira; sua alma continua inteira.'
  },
  {
    id: 'm17', number: 17, name: 'A Estrela', arcana: 'major',
    keywords: ['esperança', 'bênção cósmica', 'renovação', 'luz no horizonte'],
    uprightMeaning: 'Proteção espiritual límpida, alívio após o vendaval e fé restabelecida.',
    reversedMeaning: 'Desânimo temporário, pessimismo infundado ou falta de fé.',
    spiritualAdvice: 'Olhe para cima: as noites mais escuras mostram as estrelas mais brilhantes.'
  },
  {
    id: 'm18', number: 18, name: 'A Lua', arcana: 'major',
    keywords: ['névoa', 'ilusão', 'intuição profunda', 'medos ocultos'],
    uprightMeaning: 'Território de sombras e miragens; nem tudo o que parece é real. Confie no sexto sentido.',
    reversedMeaning: 'A névoa começa a dissipar-se, revelando o que estava escondido.',
    spiritualAdvice: 'Não decida no escuro da desconfiança. Deixe a maré baixar para enxergar as pedras.'
  },
  {
    id: 'm19', number: 19, name: 'O Sol', arcana: 'major',
    keywords: ['clareza absoluta', 'vitória', 'alegria', 'prosperidade'],
    uprightMeaning: 'Verdade radiante, sucesso comprovado, calor de vida e caminhos escancarados.',
    reversedMeaning: 'Nuvens passageiras diante do brilho ou arrogância temporária.',
    spiritualAdvice: 'Sua luz não precisa pedir licença para brilhar; apenas permaneça na sua verdade.'
  },
  {
    id: 'm20', number: 20, name: 'O Julgamento', arcana: 'major',
    keywords: ['chamado', 'despertar', 'renascimento', 'acerto com o destino'],
    uprightMeaning: 'Hora da chamada; clareza definitiva para assumir seu verdadeiro lugar no mundo.',
    reversedMeaning: 'Culpa inútil, medo do veredito ou adiamento da própria redenção.',
    spiritualAdvice: 'O sino tocou: levante a cabeça e assuma o comando do seu destino.'
  },
  {
    id: 'm21', number: 21, name: 'O Mundo', arcana: 'major',
    keywords: ['plenitude', 'conclusão de ciclo', 'triunfo', 'realização total'],
    uprightMeaning: 'Vitória consumada; a jornada alcança sua coroa de ouro e fecha o círculo com glória.',
    reversedMeaning: 'Pequenos detalhes pendentes para a vitória final.',
    spiritualAdvice: 'Celebre com gratidão: o reino da sua dignidade foi conquistado.'
  },
];

// Complete 56 Minor Arcana (14 per suit: Copas, Ouros, Espadas, Paus)
export const MINOR_CARDS: TarotCard[] = [
  // --- COPAS (Água / Sentimento / Conexão) ---
  { id: 'c_01', number: 1, name: 'Ás de Copas', arcana: 'minor', suit: 'copas', keywords: ['novo amor', 'abundância afetiva', 'cura emocional', 'receptividade'], uprightMeaning: 'Nasce uma nova fonte de afeto puro, perdão e receptividade emocional.', reversedMeaning: 'Bloqueio afetivo, mágoa represada ou carência passageira.', spiritualAdvice: 'Abra a taça da sua alma para o afeto verdadeiro.' },
  { id: 'c_02', number: 2, name: 'Dois de Copas', arcana: 'minor', suit: 'copas', keywords: ['união', 'reciprocidade', 'parceria verdadeira', 'afinidade'], uprightMeaning: 'Sintonia mútua, química equilibrada e acordo sincero entre duas pessoas.', reversedMeaning: 'Descompasso na comunicação, cobranças ou desencontro momentâneo.', spiritualAdvice: 'Cultive a troca justa onde o que você dá é recebido e retribuído.' },
  { id: 'c_03', number: 3, name: 'Três de Copas', arcana: 'minor', suit: 'copas', keywords: ['celebração', 'amizade', 'alegria compartilhada', 'reunião'], uprightMeaning: 'Motivo para comemorar em comunidade; alívio, reencontros e festividade.', reversedMeaning: 'Fofocas, excesso de influências externas ou festividades vazias.', spiritualAdvice: 'Brinde com quem realmente torce pela sua vitória.' },
  { id: 'c_04', number: 4, name: 'Quatro de Copas', arcana: 'minor', suit: 'copas', keywords: ['apatia', 'desânimo', 'oportunidade despercebida', 'tédio'], uprightMeaning: 'Desânimo temporário que impede de ver uma nova taça estendida à sua frente.', reversedMeaning: 'Despertar da letargia, novo ânimo e aceitação de ajuda.', spiritualAdvice: 'Olhe ao redor: a bênção está na sua frente, pare de olhar apenas o passado.' },
  { id: 'c_05', number: 5, name: 'Cinco de Copas', arcana: 'minor', suit: 'copas', keywords: ['luto', 'pesar', 'foco nas perdas', 'esperança restante'], uprightMeaning: 'Tristeza pelo leite derramado; três taças caíram, mas duas continuam de pé.', reversedMeaning: 'Superação do luto, reconciliação com o que restou e recomeço.', spiritualAdvice: 'Vire as costas para o que se quebrou e honre o que permaneceu.' },
  { id: 'c_06', number: 6, name: 'Seis de Copas', arcana: 'minor', suit: 'copas', keywords: ['nostalgia', 'passado', 'inocência', 'reconexão'], uprightMeaning: 'Lembranças do passado, reconexão com raízes afetivas e ternura.', reversedMeaning: 'Preso ao que já passou ou idealização infantil de antigas relações.', spiritualAdvice: 'Visite as doces lembranças, mas viva e construa o hoje.' },
  { id: 'c_07', number: 7, name: 'Sete de Copas', arcana: 'minor', suit: 'copas', keywords: ['ilusões', 'muitas opções', 'devaneios', 'necessidade de escolha'], uprightMeaning: 'Múltiplas opções e castelos no ar; perigo de fantasiar sem concretizar.', reversedMeaning: 'Fim das ilusões, pés no chão e escolha lúcida do caminho viável.', spiritualAdvice: 'Nem todo cálice dourado tem água potável; selecione com critério.' },
  { id: 'c_08', number: 8, name: 'Oito de Copas', arcana: 'minor', suit: 'copas', keywords: ['despedida', 'partida corajosa', 'busca de algo maior', 'desapego'], uprightMeaning: 'Decisão madura de deixar para trás algo que já não alimenta a alma.', reversedMeaning: 'Medo de partir, apego ao comodismo ou andar em círculos.', spiritualAdvice: 'Andar para a montanha exige deixar as taças vazias pelo caminho.' },
  { id: 'c_09', number: 9, name: 'Nove de Copas', arcana: 'minor', suit: 'copas', keywords: ['satisfação', 'desejo realizado', 'contentamento', 'bem-estar'], uprightMeaning: 'Desejo do coração atendido; banquete de satisfação emocional e orgulho sadio.', reversedMeaning: 'Complacência, excesso de vaidade ou busca egoísta por prazer.', spiritualAdvice: 'Saboreie sua conquista com gratidão e coração generoso.' },
  { id: 'c_10', number: 10, name: 'Dez de Copas', arcana: 'minor', suit: 'copas', keywords: ['plenitude familiar', 'paz no lar', 'harmonia duradoura', 'bênção'], uprightMeaning: 'Alegria compartilhada, segurança afetiva familiar e serenidade interior.', reversedMeaning: 'Tensões familiares veladas ou discordâncias domésticas passageiras.', spiritualAdvice: 'A maior riqueza na terra é o sossego dentro da sua própria casa.' },
  { id: 'c_11', number: 11, name: 'Pajem de Copas', arcana: 'minor', suit: 'copas', keywords: ['mensagem carinhosa', 'intuição jovem', 'novidade afetiva', 'doçura'], uprightMeaning: 'Chegada de notícia afetuosa, convite doce ou despertar de sentimento sincero.', reversedMeaning: 'Imaturidade emocional, drama exagerado ou mensagem enganosa.', spiritualAdvice: 'Ouça o sussurro da sua sensibilidade com olhar atento.' },
  { id: 'c_12', number: 12, name: 'Cavaleiro de Copas', arcana: 'minor', suit: 'copas', keywords: ['romantismo', 'proposta', 'aproximação graciosa', 'idealismo'], uprightMeaning: 'Aproximação com proposta sincera, convite sedutor e movimento do coração.', reversedMeaning: 'Promessas vazias, ilusão de príncipe encantado ou fuga da realidade.', spiritualAdvice: 'Aceite o afeto, mas veja se os passos acompanham as palavras.' },
  { id: 'c_13', number: 13, name: 'Rainha de Copas', arcana: 'minor', suit: 'copas', keywords: ['acolhimento', 'sabedoria emocional', 'intuição aguçada', 'cuidado'], uprightMeaning: 'Maturidade nos sentimentos, capacidade de amar sem se anular e intuição afiada.', reversedMeaning: 'Insegurança ciumenta, dependência emocional ou chantagem afetiva.', spiritualAdvice: 'Ame com a profundidade do oceano e a serenidade do porto.' },
  { id: 'c_14', number: 14, name: 'Rei de Copas', arcana: 'minor', suit: 'copas', keywords: ['domínio emocional', 'compreensão', 'diplomacia', 'generosidade'], uprightMeaning: 'Mestre sobre as próprias emoções; equilíbrio entre afeto caloroso e postura firme.', reversedMeaning: 'Frieza calculista, manipulação emocional ou temperamento volúvel.', spiritualAdvice: 'Mantenha a calma mesmo quando a maré estiver revolta ao seu redor.' },

  // --- OUROS (Terra / Trabalho / Finanças / Matéria) ---
  { id: 'o_01', number: 1, name: 'Ás de Ouros', arcana: 'minor', suit: 'ouros', keywords: ['prosperidade', 'semente de riqueza', 'oportunidade material', 'estabilidade'], uprightMeaning: 'Chega uma proposta concreta de dinheiro, trabalho ou projeto estável.', reversedMeaning: 'Atraso em pagamentos, oportunidade perdida ou investimento inseguro.', spiritualAdvice: 'Plante com responsabilidade para colher com fartura.' },
  { id: 'o_02', number: 2, name: 'Dois de Ouros', arcana: 'minor', suit: 'ouros', keywords: ['jogo de cintura', 'malabarismo financeiro', 'adaptação', 'equilíbrio'], uprightMeaning: 'Habilidade para lidar com várias contas ou prioridades ao mesmo tempo.', reversedMeaning: 'Sobrecarga financeira, desorganização ou perda de equilíbrio prático.', spiritualAdvice: 'Mantenha o ritmo sem perder o foco naquilo que é essencial.' },
  { id: 'o_03', number: 3, name: 'Três de Ouros', arcana: 'minor', suit: 'ouros', keywords: ['trabalho em equipe', 'mestria', 'reconhecimento', 'construção'], uprightMeaning: 'Trabalho competente reconhecido por parceiros e superiores; construção sólida.', reversedMeaning: 'Falta de cooperação, atritos em equipe ou execução desleixada.', spiritualAdvice: 'Aprimore seu ofício; a excelência é a melhor garantia de prosperidade.' },
  { id: 'o_04', number: 4, name: 'Quatro de Ouros', arcana: 'minor', suit: 'ouros', keywords: ['retenção', 'apego material', 'segurança', 'medo de gastar'], uprightMeaning: 'Segurança financeira garantida, mas perigo de apego excessivo e rigidez.', reversedMeaning: 'Gastos impulsivos, perda de controle ou libertação do medo da escassez.', spiritualAdvice: 'Guarde seus recursos com sabedoria, mas não tranque sua vida por medo.' },
  { id: 'o_05', number: 5, name: 'Cinco de Ouros', arcana: 'minor', suit: 'ouros', keywords: ['aperto financeiro', 'sensação de exclusão', 'crise passageira', 'busca de refúgio'], uprightMeaning: 'Dificuldade material ou frio na alma; a igreja acolhedora está ao lado.', reversedMeaning: 'Fim do período de escassez, nova fonte de renda e alívio nos fardos.', spiritualAdvice: 'Não passe frio sozinho na calçada; a ajuda está mais perto do que pensa.' },
  { id: 'o_06', number: 6, name: 'Seis de Ouros', arcana: 'minor', suit: 'ouros', keywords: ['generosidade', 'justiça distributiva', 'auxílio mútuo', 'troca justa'], uprightMeaning: 'Equilíbrio entre dar e receber; pagamento justo, ajuda providencial ou retorno.', reversedMeaning: 'Dívidas pendentes, caridade com segundas intenções ou ingratidão.', spiritualAdvice: 'Dê sem humilhar e receba sem subserviência.' },
  { id: 'o_07', number: 7, name: 'Sete de Ouros', arcana: 'minor', suit: 'ouros', keywords: ['paciência', 'colheita pendente', 'avaliação de esforço', 'investimento'], uprightMeaning: 'A semente foi plantada; agora é hora de esperar o tempo natural da colheita.', reversedMeaning: 'Impaciência destruidora, frustração com prazos ou colheita prematura.', spiritualAdvice: 'Não arranque a planta do vaso para ver se a raiz já cresceu.' },
  { id: 'o_08', number: 8, name: 'Oito de Ouros', arcana: 'minor', suit: 'ouros', keywords: ['dedicação', 'aprendizado', 'foco nos detalhes', 'aperfeiçoamento'], uprightMeaning: 'Trabalho minucioso e disciplinado; produção contínua com zelo e método.', reversedMeaning: 'Monotonia estressante, preguiça ou atalhos malfeitos.', spiritualAdvice: 'Cada detalhe bem feito fortalece o edifício da sua estabilidade.' },
  { id: 'o_09', number: 9, name: 'Nove de Ouros', arcana: 'minor', suit: 'ouros', keywords: ['independência financeira', 'luxo merecido', 'segurança própria', 'frutos'], uprightMeaning: 'Fruto do próprio suor colhido em plenitude; conforto, beleza e independência.', reversedMeaning: 'Dependência financeira incômoda ou luxos superficiais sem lastro.', spiritualAdvice: 'Desfrute do que você construiu: sua autonomia é sagrada.' },
  { id: 'o_10', number: 10, name: 'Dez de Ouros', arcana: 'minor', suit: 'ouros', keywords: ['patrimônio sólido', 'legado familiar', 'riqueza material', 'estabilidade longa'], uprightMeaning: 'Construção consolidada para gerações; prosperidade compartilhada no clã.', reversedMeaning: 'Disputas de herança, perdas patrimoniais ou quebra de confiança familiar.', spiritualAdvice: 'Construa alicerces que o vento das incertezas não consiga abalar.' },
  { id: 'o_11', number: 11, name: 'Pajem de Ouros', arcana: 'minor', suit: 'ouros', keywords: ['proposta prática', 'oportunidade de estudo', 'notícia financeira', 'ambição sadia'], uprightMeaning: 'Nova chance de estudo, contrato profissional inicial ou proposta de negócios.', reversedMeaning: 'Falta de disciplina nos estudos, promessas inviáveis ou desperdício.', spiritualAdvice: 'Abrace a oportunidade prática com dedicação de estudante.' },
  { id: 'o_12', number: 12, name: 'Cavaleiro de Ouros', arcana: 'minor', suit: 'ouros', keywords: ['passo firme', 'metódico', 'lealdade', 'progresso seguro'], uprightMeaning: 'Avanço seguro e sem tropeços; o trabalhador incansável que cumpre prazos.', reversedMeaning: 'Lentidão exasperante, teimosia rígida ou comodismo burocrático.', spiritualAdvice: 'O passo constante chega antes do salto estabanado.' },
  { id: 'o_13', number: 13, name: 'Rainha de Ouros', arcana: 'minor', suit: 'ouros', keywords: ['prosperidade acolhedora', 'bom senso', 'praticidade', 'fartura no lar'], uprightMeaning: 'Administração exemplar do dinheiro e do lar; hospitalidade com pés na terra.', reversedMeaning: 'Descontrole doméstico, avareza ou preocupação material doentia.', spiritualAdvice: 'Cuide da sua terra e alimente quem caminha ao seu lado com dignidade.' },
  { id: 'o_14', number: 14, name: 'Rei de Ouros', arcana: 'minor', suit: 'ouros', keywords: ['império material', 'líder próspero', 'segurança total', 'solidez'], uprightMeaning: 'Mestre da estabilidade financeira; empreendedor seguro de suas forças.', reversedMeaning: 'Materialismo cego, corrupção ou uso do dinheiro para intimidar.', spiritualAdvice: 'Seja dono do seu ouro, nunca deixe o ouro ser dono de você.' },

  // --- ESPADAS (Ar / Mente / Decisão / Verdade / Conflito) ---
  { id: 'e_01', number: 1, name: 'Ás de Espadas', arcana: 'minor', suit: 'espadas', keywords: ['clareza mental', 'corte justo', 'vitória da razão', 'verdade revelada'], uprightMeaning: 'A espada da verdade corta mal-entendidos e impõe lucidez definitiva.', reversedMeaning: 'Palavras agressivas, confusão mental ou uso cruel da inteligência.', spiritualAdvice: 'A verdade pode arder na hora, mas salva da neblina da mentira.' },
  { id: 'e_02', number: 2, name: 'Dois de Espadas', arcana: 'minor', suit: 'espadas', keywords: ['impasse', 'olhos vendados', 'dilema difícil', 'trégua tensa'], uprightMeaning: 'Decisão adiada por medo do resultado; momento de retirar a venda dos olhos.', reversedMeaning: 'Tomada de decisão inevitável, revelação de fatos e fim do impasse.', spiritualAdvice: 'Vender os próprios olhos não apaga o caminho à sua frente.' },
  { id: 'e_03', number: 3, name: 'Três de Espadas', arcana: 'minor', suit: 'espadas', keywords: ['desilusão', 'dor do corte', 'coração ferido', 'verdade que dói'], uprightMeaning: 'Dor de ver a realidade sem filtros; desapontamento necessário para curar.', reversedMeaning: 'Recuperação de um trauma, cicatrização de feridas e perdão libertador.', spiritualAdvice: 'A dor ensina quem é de verdade; limpe o ferimento e siga altiva.' },
  { id: 'e_04', number: 4, name: 'Quatro de Espadas', arcana: 'minor', suit: 'espadas', keywords: ['repouso', 'convalescença', 'pausa mental', 'retiro estratégico'], uprightMeaning: 'Pausa forçada para respirar e recompor as forças mentais; silêncio protetor.', reversedMeaning: 'Retorno à atividade após descanso ou esgotamento por não querer parar.', spiritualAdvice: 'Deponha as armas por hoje: guerreiro exausto perde batalha fácil.' },
  { id: 'e_05', number: 5, name: 'Cinco de Espadas', arcana: 'minor', suit: 'espadas', keywords: ['vitória amarga', 'conflito egoico', 'orgulho ferido', 'custo alto'], uprightMeaning: 'Vencer a discussão mas perder a paz ou o aliado; desfecho com sabor amargo.', reversedMeaning: 'Reconhecimento de erros, superação de disputas estéreis e reconciliação.', spiritualAdvice: 'Nem toda briga merece sua espada; às vezes vencer é simplesmente se afastar.' },
  { id: 'e_06', number: 6, name: 'Seis de Espadas', arcana: 'minor', suit: 'espadas', keywords: ['travessia', 'águas calmas', 'transição necessária', 'deixar a tempestade'], uprightMeaning: 'Viagem para águas mais tranquilas; deixando a dor para trás rumo à paz.', reversedMeaning: 'Resistência em sair do tumulto ou bagagens pesadas atrasando a viagem.', spiritualAdvice: 'Navegue para a outra margem; a tempestade já ficou para trás.' },
  { id: 'e_07', number: 7, name: 'Sete de Espadas', arcana: 'minor', suit: 'espadas', keywords: ['estratégia sutil', 'cautela', 'agir pelas sombras', 'evitar traição'], uprightMeaning: 'Agir com discrição cirúrgica; cuidado com armadilhas e conversas fiadas.', reversedMeaning: 'Verdade desmascarada, confissão de culpa ou planos secretos frustrados.', spiritualAdvice: 'Seja prudente como a serpente: nem todos merecem saber seu próximo passo.' },
  { id: 'e_08', number: 8, name: 'Oito de Espadas', arcana: 'minor', suit: 'espadas', keywords: ['prisão mental', 'sensação de impotência', 'bloqueio próprio', 'saída livre'], uprightMeaning: 'Sensação de estar amarrada, mas as cordas estão frouxas; o medo é a prisão.', reversedMeaning: 'Libertação das amarras mentais, clareza para sair do labirinto.', spiritualAdvice: 'Dê o primeiro passo: quem disse que você não tem poder mentiu para você.' },
  { id: 'e_09', number: 9, name: 'Nove de Espadas', arcana: 'minor', suit: 'espadas', keywords: ['ansiedade', 'pesadelo', 'insônia', 'preocupação excessiva'], uprightMeaning: 'Noites mal dormidas por tempestades que a mente inflou; o alívio vem com o dia.', reversedMeaning: 'Superação da angústia, busca de tratamento e retorno da serenidade.', spiritualAdvice: 'A noite assusta com sombras gigantes, mas a alvorada traz a proporção real.' },
  { id: 'e_10', number: 10, name: 'Dez de Espadas', arcana: 'minor', suit: 'espadas', keywords: ['fundo do poço', 'fim definitivo', 'traição superada', 'alvorada chegando'], uprightMeaning: 'O ciclo de sofrimento chegou ao limite máximo; não há como cair mais fundo.', reversedMeaning: 'Ressurgimento das cinzas, melhora gradual e começo de uma nova era.', spiritualAdvice: 'Quando o pior já aconteceu, a única direção que resta é levantar e reinar.' },
  { id: 'e_11', number: 11, name: 'Pajem de Espadas', arcana: 'minor', suit: 'espadas', keywords: ['vigilância', 'curiosidade', 'notícia cortante', 'mente ágil'], uprightMeaning: 'Mente vigilante, investigação de detalhes e necessidade de checar fontes.', reversedMeaning: 'Espionagem mesquinha, boatos maldosos ou comentários impensados.', spiritualAdvice: 'Observe com discrição e pense três vezes antes de redigir sua resposta.' },
  { id: 'e_12', number: 12, name: 'Cavaleiro de Espadas', arcana: 'minor', suit: 'espadas', keywords: ['ataque rápido', 'ímpeto intelectual', 'direto ao ponto', 'coragem ousada'], uprightMeaning: 'Ação rápida e impetuosa para resolver um problema com a força da lógica.', reversedMeaning: 'Impulsividade destrutiva, agressividade verbal ou planos atropelados.', spiritualAdvice: 'Mire bem o alvo antes de soltar a flecha da sua palavra.' },
  { id: 'e_13', number: 13, name: 'Rainha de Espadas', arcana: 'minor', suit: 'espadas', keywords: ['discernimento', 'lucidez fria', 'independência', 'sem ilusões'], uprightMeaning: 'Mulher experiente que enxerga através de qualquer máscara; firmeza e lucidez.', reversedMeaning: 'Amargura excessiva, cinismo destrutivo ou julgamento implacável.', spiritualAdvice: 'Corte a mentira pela raiz com elegância, sem perder sua dignidade.' },
  { id: 'e_14', number: 14, name: 'Rei de Espadas', arcana: 'minor', suit: 'espadas', keywords: ['autoridade justa', 'julgamento reto', 'comando estratégico', 'clareza'], uprightMeaning: 'Liderança justa, inteligência estratégica e domínio incontestável da lei e ordem.', reversedMeaning: 'Tirania fria, manipulação burocrática ou abuso de autoridade.', spiritualAdvice: 'Julgue pela evidência e pelos fatos, nunca pela emoção precipitada.' },

  // --- PAUS (Fogo / Vontade / Ação / Energia Vital / Criatividade) ---
  { id: 'p_01', number: 1, name: 'Ás de Paus', arcana: 'minor', suit: 'paus', keywords: ['chama de ação', 'vitalidade', 'entusiasmo', 'novo projeto'], uprightMeaning: 'Uma nova fagulha de ânimo, força para lutar e paixão criativa acesa.', reversedMeaning: 'Falta de energia, atraso no pontapé inicial ou desânimo temporário.', spiritualAdvice: 'Assopre a brasa enquanto o fogo sagrado pede movimento.' },
  { id: 'p_02', number: 2, name: 'Dois de Paus', arcana: 'minor', suit: 'paus', keywords: ['planejamento', 'visão de futuro', 'globo nas mãos', 'escolha de expansão'], uprightMeaning: 'O mundo nas suas mãos; hora de olhar o horizonte e planejar o próximo grande passo.', reversedMeaning: 'Medo de deixar a zona de conforto ou planejamento indeciso.', spiritualAdvice: 'Olhe além do muro do seu quintal: o horizonte te espera.' },
  { id: 'p_03', number: 3, name: 'Três de Paus', arcana: 'minor', suit: 'paus', keywords: ['navios chegando', 'expansão comercial', 'retorno de esforços', 'confiança'], uprightMeaning: 'Os navios que você despachou começam a trazer frutos; expansão e conquista.', reversedMeaning: 'Atrasos nas respostas externas, frustração de expectativas ou falta de visão.', spiritualAdvice: 'Espere no cais com confiança: quem plantou com afinco recebe a carga.' },
  { id: 'p_04', number: 4, name: 'Quatro de Paus', arcana: 'minor', suit: 'paus', keywords: ['celebração de conquista', 'harmonia no lar', 'marco estável', 'festa'], uprightMeaning: 'Portal enfeitado de flores; celebração de um marco sólido conquistado com garra.', reversedMeaning: 'Instabilidade passageira no ambiente ou comemoração postergada.', spiritualAdvice: 'Agradeça pelo abrigo seguro que sua determinação edificou.' },
  { id: 'p_05', number: 5, name: 'Cinco de Paus', arcana: 'minor', suit: 'paus', keywords: ['competição', 'choque de ideias', 'disputa sadia', 'tumulto'], uprightMeaning: 'Muitas vozes disputando espaço; momento de mostrar seu valor sem perder a compostura.', reversedMeaning: 'Brigas destrutivas, desgaste em discussões inúteis ou resolução pacífica.', spiritualAdvice: 'Não gaste seu bastão em lutas que não levam a lugar nenhum.' },
  { id: 'p_06', number: 6, name: 'Seis de Paus', arcana: 'minor', suit: 'paus', keywords: ['vitória pública', 'reconhecimento', 'triunfo', 'louros da vitória'], uprightMeaning: 'Cavaleiro coroado de louros; seu valor é aplaudido e os caminhos se abrem.', reversedMeaning: 'Soberba precipitada, atraso no reconhecimento ou vitória aparente.', spiritualAdvice: 'Receba os aplausos com a cabeça erguida e o coração humilde perante os orixás.' },
  { id: 'p_07', number: 7, name: 'Sete de Paus', arcana: 'minor', suit: 'paus', keywords: ['resistência', 'defesa de território', 'coragem solitária', 'vantagem no alto'], uprightMeaning: 'Defender sua posição contra investidas adversárias; você está no alto do morro.', reversedMeaning: 'Sentir-se sobrecarregada, desistência prematura ou teimosia sem estratégia.', spiritualAdvice: 'Segure firme o seu bastão: ninguém toma o trono de quem sabe se defender.' },
  { id: 'p_08', number: 8, name: 'Oito de Paus', arcana: 'minor', suit: 'paus', keywords: ['rapidez', 'acontecimentos velozes', 'notícias no ar', 'movimento ágil'], uprightMeaning: 'As flechas voam ligeiras; acontecimentos que se precipitam em ritmo vertiginoso.', reversedMeaning: 'Atrasos burocráticos, mal-entendidos por pressa ou notícias confusas.', spiritualAdvice: 'Esteja pronta: o vento mudou e a resposta vem depressa.' },
  { id: 'p_09', number: 9, name: 'Nove de Paus', arcana: 'minor', suit: 'paus', keywords: ['guarda vigilante', 'última trincheira', 'resiliência', 'força final'], uprightMeaning: 'Guerreiro com faixa na cabeça, ferido mas em guarda; a batalha final está próxima.', reversedMeaning: 'Paranoia exaustiva, teimosia defensiva ou baixar a guarda na hora errada.', spiritualAdvice: 'Você aguentou o pior até aqui; respire e mantenha a guarda só mais um pouco.' },
  { id: 'p_10', number: 10, name: 'Dez de Paus', arcana: 'minor', suit: 'paus', keywords: ['sobrecarga', 'peso nos ombros', 'responsabilidade excessiva', 'fim do fardo'], uprightMeaning: 'Carregar nos ombros um feixe pesado demais; a cidade está à vista para descarregar.', reversedMeaning: 'Colapso por excesso de tarefas, recusa em delegar ou alívio do fardo.', spiritualAdvice: 'Solte os bastões que não são seus; ninguém é obrigado a carregar o mundo.' },
  { id: 'p_11', number: 11, name: 'Pajem de Paus', arcana: 'minor', suit: 'paus', keywords: ['entusiasmo jovem', 'notícia empolgante', 'vontade de criar', 'mensageiro do fogo'], uprightMeaning: 'Convite empolgante, ideia promissora e faísca de aventura renovadora.', reversedMeaning: 'Imaturidade, planos mirabolantes sem sustentação ou indecisão.', spiritualAdvice: 'Alimente o entusiasmo sadio, mas dê um passo por vez com responsabilidade.' },
  { id: 'p_12', number: 12, name: 'Cavaleiro de Paus', arcana: 'minor', suit: 'paus', keywords: ['ousadia', 'paixão impulsiva', 'viagem rápida', 'ação decidida'], uprightMeaning: 'Cavalgada audaciosa, magnetismo impetuoso e coragem para romper a monotonia.', reversedMeaning: 'Arrogância agressiva, quebra de compromissos ou fogo de palha.', spiritualAdvice: 'Abrace a paixão pelo movimento, mas veja onde o cavalo pisa.' },
  { id: 'p_13', number: 13, name: 'Rainha de Paus', arcana: 'minor', suit: 'paus', keywords: ['magnetismo radiante', 'liderança calorosa', 'confiança', 'força feminina'], uprightMeaning: 'Presença magnética que ilumina qualquer encruzilhada; rainha segura e calorosa.', reversedMeaning: 'Ciúme dominador, arrogância explosiva ou sensação de desvalorização.', spiritualAdvice: 'Brilhe sem medo: o fogo da sua presença nasceu para governar caminhos.' },
  { id: 'p_14', number: 14, name: 'Rei de Paus', arcana: 'minor', suit: 'paus', keywords: ['líder visionário', 'comando inspirador', 'coragem realizadora', 'firmeza'], uprightMeaning: 'Comandante nato que transforma projetos audaciosos em vitórias consolidadas.', reversedMeaning: 'Autoritarismo truculento, intolerância a opiniões divergentes ou promessas não cumpridas.', spiritualAdvice: 'Lidere pelo exemplo de coragem e pela retidão do seu comando.' },
];

// Exact and verified complete 78 cards
export const FULL_DECK: TarotCard[] = [...MAJOR_ARCANA, ...MINOR_CARDS];

// Cryptographically secure integer selection [min, max)
function getSecureRandomInt(min: number, max: number): number {
  return crypto.randomInt(min, max);
}

// Fisher-Yates cryptographically secure shuffle
export function secureShuffle<T>(deck: T[]): T[] {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(0, i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Digital cut methodology
export function cutDeck<T>(deck: T[], cutIndex?: number): T[] {
  if (deck.length <= 1) return [...deck];
  const cut = typeof cutIndex === 'number' && cutIndex >= 1 && cutIndex < deck.length
    ? cutIndex
    : getSecureRandomInt(1, deck.length);
  return [...deck.slice(cut), ...deck.slice(0, cut)];
}

export interface TarotDrawOptions {
  deck?: TarotCard[];
  allowReversals?: boolean;
  cutIndex?: number;
  positionLabels?: string[];
}

export function drawTarotCards(
  count: number = 3,
  options: TarotDrawOptions = {}
): TarotDrawPosition[] {
  const deck = options.deck || FULL_DECK;
  const allowReversals = options.allowReversals ?? false;

  if (count > deck.length) {
    throw new Error('A quantidade de cartas solicitada excede o baralho disponível.');
  }

  // 1. Cryptographically secure shuffle
  const shuffled = secureShuffle(deck);

  // 2. Digital cut
  const cutDeckCards = cutDeck(shuffled, options.cutIndex);

  // 3. Draw cards
  const selectedCards = cutDeckCards.slice(0, count);

  const defaultPositionLabels = options.positionLabels || [
    'Passado & Raiz da Situação',
    'Presente & Momento Atual',
    'Tendência Futura & Conselho do Destino',
    'Fator Oculto & Bloqueio',
    'Síntese & Caminho Maior'
  ];

  return selectedCards.map((card, idx) => {
    // Reversal is only active when explicitly allowed
    const isReversed = allowReversals ? getSecureRandomInt(0, 100) < 25 : false;
    return {
      position: idx + 1,
      label: defaultPositionLabels[idx] || `Posição ${idx + 1}`,
      card,
      isReversed,
      specificInterpretation: isReversed && card.reversedMeaning
        ? card.reversedMeaning
        : card.uprightMeaning,
    };
  });
}
