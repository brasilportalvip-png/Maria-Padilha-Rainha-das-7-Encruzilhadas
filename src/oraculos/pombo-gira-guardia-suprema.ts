export interface PomboGiraGuardiaInput {
  fullName: string;
  birthDate: string;
  question?: string;
}





const GUARDIAS = [
  {
    nome: 'Maria Padilha das 7 Encruzilhadas',
    linha: 'Rainhas',
    campo: 'caminhos, escolhas, viradas e decisões importantes.',
    luz: 'abre direção, mostra encruzilhadas e fortalece a postura.',
    sombra: 'indecisão, orgulho, caminhos cruzados e medo de escolher.',
    conselho: 'escolha com firmeza e não fique parado esperando a vida decidir por você.',
    apareceQuando: [
      'encruzilhada',
      'decisão',
      'mudança',
      'caminhos',
      'escolhas'
    ]
  },
  {
    nome: 'Maria Padilha das Almas',
    linha: 'Maria Padilhas',
    campo: 'ancestralidade, proteção espiritual e cura de dores antigas.',
    luz: 'proteção dos antigos, limpeza de sofrimento e força espiritual silenciosa.',
    sombra: 'peso do passado, tristeza guardada e apego a dores antigas.',
    conselho: 'honre sua história, mas não carregue dor que já deveria ter ficado para trás.',
    apareceQuando: [
      'ancestralidade',
      'espiritualidade',
      'cura',
      'perdas',
      'proteção'
    ]
  },
  {
    nome: 'Maria Mulambo',
    linha: 'Marias',
    campo: 'amor ferido, autoestima, abandono e reconstrução pessoal.',
    luz: 'cura da humilhação, força depois da queda e resgate do amor-próprio.',
    sombra: 'aceitar pouco, se diminuir e confundir sofrimento com amor.',
    conselho: 'não se vista de resto por ninguém; levante sua coroa.',
    apareceQuando: [
      'abandono',
      'humilhação',
      'baixa autoestima',
      'amor não correspondido',
      'rejeição'
    ]
  },
  {
    nome: 'Maria Navalha',
    linha: 'Marias',
    campo: 'corte, verdade, justiça, mentira e defesa espiritual.',
    luz: 'corta ilusão, revela verdade e protege contra falsidade.',
    sombra: 'raiva, dureza, vingança e palavra afiada demais.',
    conselho: 'use a verdade como lâmina de limpeza, não como veneno.',
    apareceQuando: [
      'mentira',
      'traição',
      'justiça',
      'falsidade',
      'corte',
      'manipulação'
    ]
  },
  {
    nome: 'Maria Quitéria',
    linha: 'Marias',
    campo: 'prosperidade, trabalho, coragem e abertura de estrada.',
    luz: 'força para vencer, trabalhar, prosperar e se posicionar.',
    sombra: 'cansaço, excesso de luta e orgulho de não pedir ajuda.',
    conselho: 'trabalhe com estratégia, não apenas com força.',
    apareceQuando: [
      'trabalho',
      'prosperidade',
      'dinheiro',
      'coragem',
      'vitória'
    ]
  },
  {
    nome: 'Pombo Gira Rosa Vermelha',
    linha: 'Rosas',
    campo: 'amor, paixão, desejo, reconciliação e magnetismo.',
    luz: 'atração, encanto, doçura, aproximação e força amorosa.',
    sombra: 'ciúme, apego, sedução usada sem consciência e ilusão afetiva.',
    conselho: 'use seu encanto sem perder sua dignidade.',
    apareceQuando: [
      'amor',
      'paixão',
      'atração',
      'sedução',
      'reconciliação'
    ]
  },
  {
    nome: 'Pombo Gira Sete Saias',
    linha: 'Saias',
    campo: 'mistério feminino, proteção, sedução, defesa e poder pessoal.',
    luz: 'mistério, força, magnetismo, proteção e presença espiritual.',
    sombra: 'vaidade ferida, disputa, segredo e manipulação.',
    conselho: 'guarde seu mistério, mas não se esconda de si mesmo.',
    apareceQuando: [
      'proteção',
      'mistério',
      'magnetismo',
      'poder pessoal',
      'defesa'
    ]
  },
  {
    nome: 'Pombo Gira Cigana',
    linha: 'Ciganas',
    campo: 'movimento, destino, caminhos, liberdade e sinais espirituais.',
    luz: 'visão de estrada, liberdade, alegria, previsão e movimento.',
    sombra: 'instabilidade, fuga, excesso de sonho e falta de raiz.',
    conselho: 'ande pelos caminhos, mas saiba onde quer chegar.',
    apareceQuando: [
      'destino',
      'mudança',
      'estrada',
      'viagem',
      'novidades'
    ]
  },
  {
    nome: 'Maria Farrapo',
    linha: 'Marias',
    campo: 'dor antiga, rejeição, abandono, queda e reconstrução depois da perda.',
    luz: 'levanta quem foi humilhado, dá força depois da queda e mostra valor onde houve desprezo.',
    sombra: 'mágoa presa, sensação de resto, tristeza escondida e medo de não ser escolhido.',
    conselho: 'não aceite migalhas de ninguém; quem tem valor não precisa implorar presença.',
    apareceQuando: [
      'abandono',
      'rejeição',
      'humilhação',
      'tristeza',
      'desvalorização'
    ]
  },
  {
    nome: 'Dama da Noite',
    linha: 'Damas',
    campo: 'segredos, desejo oculto, sedução, mistério e verdades escondidas.',
    luz: 'revela intenção escondida, mostra desejo oculto e fortalece magnetismo pessoal.',
    sombra: 'ilusão noturna, segredo perigoso, vaidade, mentira e jogo emocional.',
    conselho: 'nem todo encanto é caminho; observe o que a pessoa faz quando ninguém está olhando.',
    apareceQuando: [
      'segredo',
      'desejo',
      'mistério',
      'sedução',
      'vida noturna'
    ]
  },
  {
    nome: 'Rosa Caveira',
    linha: 'Rosas',
    campo: 'fim de ciclos, verdade dura, desapego, proteção e corte espiritual.',
    luz: 'corta apego, mostra fim necessário e protege contra insistência destrutiva.',
    sombra: 'obsessão, medo de perder, apego ao passado e recusa em aceitar encerramentos.',
    conselho: 'quando uma porta vira prisão, sair também é vitória.',
    apareceQuando: [
      'fim',
      'encerramento',
      'desapego',
      'corte',
      'transformação'
    ]
  },
  {
    nome: 'Maria Quitéria das Almas',
    linha: 'Marias',
    campo: 'proteção espiritual, força de batalha, trabalho, justiça e caminhos pesados.',
    luz: 'dá coragem, firmeza, defesa espiritual e força para enfrentar lutas difíceis.',
    sombra: 'cansaço extremo, guerra interna, orgulho e sobrecarga.',
    conselho: 'não lute todas as guerras; escolha bem onde gastar sua força.',
    apareceQuando: [
      'batalha',
      'proteção',
      'justiça',
      'luta',
      'força'
    ]
  },
  {
    nome: 'Maria Padilha da Calunga',
    linha: 'Maria Padilhas',
    campo: 'mistério profundo, transformação, proteção nas sombras e cortes espirituais.',
    luz: 'mostra verdades escondidas, protege em caminhos densos e ajuda a encerrar ciclos pesados.',
    sombra: 'medo, apego à dor, energia carregada e permanência em situações mortas.',
    conselho: 'não tente dar vida ao que espiritualmente já terminou.',
    apareceQuando: [
      'calunga',
      'mistério',
      'proteção espiritual',
      'transformação',
      'encerramento'
    ]
  },
  {
    nome: 'Maria Padilha do Cabaré',
    linha: 'Maria Padilhas',
    campo: 'sedução, autoestima, prazer, poder feminino, encanto e relações afetivas.',
    luz: 'devolve autoestima, magnetismo, alegria e domínio da própria presença.',
    sombra: 'vaidade ferida, carência, sedução sem consciência e dependência de aprovação.',
    conselho: 'use seu encanto para se fortalecer, não para se perder na mão dos outros.',
    apareceQuando: [
      'autoestima',
      'sedução',
      'magnetismo',
      'prazer',
      'amor'
    ]
  },


{
  nome: 'Maria Padilha da Estrada',
  linha: 'Maria Padilhas',
  campo: 'caminhos, viagens, mudanças, movimento e decisões de estrada.',
  luz: 'abre passagem, mostra direção e fortalece quem precisa seguir em frente.',
  sombra: 'fuga, pressa, instabilidade e medo de criar raiz.',
  conselho: 'caminhe com coragem, mas saiba para onde está indo.',
  apareceQuando: ['caminhos', 'viagem', 'mudança', 'estrada', 'decisão']
},
{
  nome: 'Maria Padilha da Praia',
  linha: 'Maria Padilhas',
  campo: 'emoções, limpeza, encantamento, amor e movimento das águas.',
  luz: 'limpa mágoas, suaviza dores e fortalece o magnetismo emocional.',
  sombra: 'ilusões, carência, instabilidade e excesso de fantasia.',
  conselho: 'sinta, mas não se afogue no que sente.',
  apareceQuando: ['emoção', 'amor', 'mágoa', 'limpeza', 'carência']
},
{
  nome: 'Maria Padilha da Figueira',
  linha: 'Maria Padilhas',
  campo: 'mistério, raízes espirituais, proteção e revelação oculta.',
  luz: 'mostra verdades escondidas e fortalece proteção espiritual.',
  sombra: 'segredos, apego, energia presa e medo do oculto.',
  conselho: 'nem toda raiz deve ser cortada, mas toda prisão deve ser vista.',
  apareceQuando: ['segredo', 'mistério', 'proteção', 'raiz', 'oculto']
},
{
  nome: 'Maria Padilha do Cruzeiro',
  linha: 'Maria Padilhas',
  campo: 'decisão, cruzamento espiritual, destino e escolha difícil.',
  luz: 'clareia encruzilhadas e mostra o caminho de maior firmeza.',
  sombra: 'dúvida, medo de escolher e caminhos parados.',
  conselho: 'quem não escolhe também entrega o destino nas mãos dos outros.',
  apareceQuando: ['decisão', 'cruzeiro', 'dúvida', 'destino', 'escolha']
},
{
  nome: 'Maria Padilha da Porteira',
  linha: 'Maria Padilhas',
  campo: 'entrada, saída, proteção de passagem e limites espirituais.',
  luz: 'abre o que deve abrir e fecha o que precisa ser protegido.',
  sombra: 'insistência em porta fechada, teimosia e falta de limite.',
  conselho: 'respeite a porta que se fecha; às vezes ela te livra.',
  apareceQuando: ['porta', 'entrada', 'saída', 'limite', 'proteção']
},
{
  nome: 'Maria Padilha do Cemitério',
  linha: 'Maria Padilhas',
  campo: 'fim de ciclos, desapego, verdade espiritual e transformação.',
  luz: 'ajuda a enterrar dores antigas e encerrar ciclos mortos.',
  sombra: 'apego ao passado, sofrimento repetido e medo de finalizar.',
  conselho: 'não carregue no peito aquilo que já virou passado.',
  apareceQuando: ['fim', 'passado', 'desapego', 'encerramento', 'dor antiga']
},
{
  nome: 'Maria Padilha das Rosas',
  linha: 'Maria Padilhas',
  campo: 'amor, beleza, encanto, autoestima e poder de atração.',
  luz: 'fortalece o amor-próprio, o encanto e a presença pessoal.',
  sombra: 'vaidade ferida, ilusão amorosa e dependência de aprovação.',
  conselho: 'floresça por você antes de querer perfumar a vida de alguém.',
  apareceQuando: ['amor', 'autoestima', 'beleza', 'encanto', 'atração']
},
{
  nome: 'Maria Padilha da Lira',
  linha: 'Maria Padilhas',
  campo: 'sedução, alegria, vida social, palavra e magnetismo.',
  luz: 'abre caminhos de encanto, comunicação e poder pessoal.',
  sombra: 'excesso, vaidade, distração e relações superficiais.',
  conselho: 'use sua presença com inteligência, não como fuga.',
  apareceQuando: ['sedução', 'vida social', 'comunicação', 'alegria', 'magnetismo']
},
{
  nome: 'Maria Padilha das Sete Catacumbas',
  linha: 'Maria Padilhas',
  campo: 'mistério profundo, sombras, proteção pesada e revelação espiritual.',
  luz: 'protege em caminhos densos e revela o que estava enterrado.',
  sombra: 'medo, obsessão, apego sombrio e energia carregada.',
  conselho: 'não tema a verdade; tema continuar preso ao que te consome.',
  apareceQuando: ['mistério', 'proteção pesada', 'sombra', 'medo', 'revelação']
},
{
  nome: 'Maria Padilha da Meia-Noite',
  linha: 'Maria Padilhas',
  campo: 'segredos, viradas, silêncio, desejo oculto e revelação.',
  luz: 'mostra verdades escondidas quando tudo parece escuro.',
  sombra: 'ilusão, segredo, solidão e escolhas feitas no impulso.',
  conselho: 'no escuro, só caminha bem quem conhece a própria intenção.',
  apareceQuando: ['segredo', 'meia-noite', 'silêncio', 'desejo oculto', 'virada']
},
{
  nome: 'Maria Mulambo das Almas',
  linha: 'Marias',
  campo: 'abandono, cura espiritual, rejeição e reconstrução da dignidade.',
  luz: 'levanta quem foi ferido e devolve força depois da humilhação.',
  sombra: 'mágoa antiga, tristeza guardada e sentimento de desvalor.',
  conselho: 'quem te jogou no chão não decide se você levanta.',
  apareceQuando: ['abandono', 'rejeição', 'humilhação', 'cura', 'dignidade']
},
{
  nome: 'Maria Mulambo da Estrada',
  linha: 'Marias',
  campo: 'recomeços, mudança depois da dor e saída de situações difíceis.',
  luz: 'abre movimento depois de perdas e fortalece quem precisa seguir.',
  sombra: 'fuga, medo de recomeçar e apego ao que machucou.',
  conselho: 'seguir em frente não é esquecer; é parar de sangrar no mesmo lugar.',
  apareceQuando: ['recomeço', 'mudança', 'abandono', 'estrada', 'dor']
},
{
  nome: 'Maria Mulambo do Cabaré',
  linha: 'Marias',
  campo: 'autoestima ferida, desejo, rejeição amorosa e resgate do encanto.',
  luz: 'devolve brilho, presença e confiança a quem foi diminuído.',
  sombra: 'carência, humilhação afetiva e busca desesperada por validação.',
  conselho: 'não use desejo para mendigar amor.',
  apareceQuando: ['autoestima', 'rejeição', 'desejo', 'carência', 'amor ferido']
},
{
  nome: 'Maria Quitéria da Encruzilhada',
  linha: 'Marias',
  campo: 'decisões fortes, trabalho, coragem, justiça e abertura de caminhos.',
  luz: 'dá firmeza para decidir e força para vencer obstáculos.',
  sombra: 'teimosia, excesso de carga e orgulho de não recuar.',
  conselho: 'firmeza não é bater de frente com tudo; é saber onde pisar.',
  apareceQuando: ['coragem', 'trabalho', 'decisão', 'justiça', 'caminhos']
},
{
  nome: 'Maria Quitéria da Estrada',
  linha: 'Marias',
  campo: 'movimento, conquista, trabalho, viagens e oportunidades.',
  luz: 'abre estrada para prosperidade e fortalece ação prática.',
  sombra: 'cansaço, pressa, desorganização e excesso de luta.',
  conselho: 'não basta andar; caminhe com direção.',
  apareceQuando: ['trabalho', 'viagem', 'oportunidade', 'prosperidade', 'estrada']
},
{
  nome: 'Maria Navalha das Almas',
  linha: 'Marias',
  campo: 'corte espiritual, verdade, justiça e proteção contra falsidade.',
  luz: 'corta mentira, revela intenção oculta e protege contra traição.',
  sombra: 'raiva, rancor, vingança e dureza emocional.',
  conselho: 'corte o mal sem virar aquilo que te feriu.',
  apareceQuando: ['mentira', 'traição', 'corte', 'justiça', 'proteção']
},
{
  nome: 'Maria Navalha da Estrada',
  linha: 'Marias',
  campo: 'decisão rápida, corte de caminhos ruins e defesa espiritual.',
  luz: 'mostra onde cortar e dá coragem para seguir sem peso.',
  sombra: 'impulsividade, palavra dura e reação sem estratégia.',
  conselho: 'nem todo corte precisa de grito; alguns se fazem em silêncio.',
  apareceQuando: ['corte', 'estrada', 'decisão', 'falsidade', 'mudança']
},
{
  nome: 'Maria Rosa',
  linha: 'Marias',
  campo: 'amor-próprio, beleza, sensibilidade, afeto e cura emocional.',
  luz: 'suaviza dores e fortalece o valor pessoal.',
  sombra: 'fragilidade emocional, romantização e dependência afetiva.',
  conselho: 'amor bonito começa quando você para de se abandonar.',
  apareceQuando: ['amor', 'autoestima', 'cura emocional', 'sensibilidade', 'afeto']
},
{
  nome: 'Maria das Matas',
  linha: 'Marias',
  campo: 'proteção, força natural, segredo, cura e caminhos de raiz.',
  luz: 'fortalece energia vital, proteção e sabedoria instintiva.',
  sombra: 'isolamento, desconfiança, fuga e silêncio excessivo.',
  conselho: 'a mata protege, mas também ensina a caminhar atento.',
  apareceQuando: ['proteção', 'natureza', 'cura', 'isolamento', 'raiz']
},
{
  nome: 'Maria da Praia',
  linha: 'Marias',
  campo: 'emoções, limpeza espiritual, amor, saudade e movimento.',
  luz: 'limpa tristeza e ajuda o coração a respirar novamente.',
  sombra: 'carência, ilusão e instabilidade emocional.',
  conselho: 'não confunda onda passageira com destino firme.',
  apareceQuando: ['emoção', 'saudade', 'amor', 'limpeza', 'carência']
},
{
  nome: 'Maria do Mangue',
  linha: 'Marias',
  campo: 'situações difíceis, sobrevivência, transformação e força na lama.',
  luz: 'mostra força onde parecia haver apenas dificuldade.',
  sombra: 'estagnação, apego ao sofrimento e ambientes pesados.',
  conselho: 'até na lama nasce vida, mas você não precisa morar nela.',
  apareceQuando: ['dificuldade', 'sobrevivência', 'estagnação', 'transformação', 'dor']
},
{
  nome: 'Maria do Lodo',
  linha: 'Marias',
  campo: 'limpeza de energia pesada, emoções densas e libertação de vínculos ruins.',
  luz: 'ajuda a sair de relações ou situações que sugam energia.',
  sombra: 'apego ao caos, tristeza pesada e repetição de padrões ruins.',
  conselho: 'reconheça a lama, mas não se acostume com ela.',
  apareceQuando: ['energia pesada', 'apego', 'relação tóxica', 'tristeza', 'libertação']
},
{
  nome: 'Rosa Negra',
  linha: 'Rosas',
  campo: 'mistério, sedução profunda, proteção, verdade oculta e poder pessoal.',
  luz: 'fortalece magnetismo e revela intenções escondidas.',
  sombra: 'obsessão, segredo, ciúme e desejo usado sem consciência.',
  conselho: 'nem todo desejo merece passagem para dentro da sua vida.',
  apareceQuando: ['mistério', 'sedução', 'ciúme', 'segredo', 'proteção']
},
{
  nome: 'Rosa Branca',
  linha: 'Rosas',
  campo: 'paz, cura emocional, reconciliação interna e suavização de conflitos.',
  luz: 'acalma o coração e ajuda a enxergar com mais clareza.',
  sombra: 'passividade, fuga de confronto e medo de decidir.',
  conselho: 'paz não é aceitar tudo; paz também é saber dizer basta.',
  apareceQuando: ['paz', 'cura', 'reconciliação', 'conflito', 'calma']
},
{
  nome: 'Rosa do Luar',
  linha: 'Rosas',
  campo: 'intuição, romance, saudade, sonhos e sentimentos escondidos.',
  luz: 'clareia sentimentos ocultos e fortalece percepção emocional.',
  sombra: 'fantasia, idealização e espera sem atitude.',
  conselho: 'sonhar é bonito, mas caminho se abre com postura.',
  apareceQuando: ['saudade', 'romance', 'sonho', 'intuição', 'sentimento oculto']
},
{
  nome: 'Rosa da Madrugada',
  linha: 'Rosas',
  campo: 'viradas emocionais, esperança, recomeço e decisões silenciosas.',
  luz: 'mostra luz depois de períodos escuros e fortalece recomeços.',
  sombra: 'solidão, ansiedade e medo do novo dia.',
  conselho: 'a madrugada cobra coragem de quem quer ver o sol nascer.',
  apareceQuando: ['recomeço', 'madrugada', 'solidão', 'esperança', 'virada']
},
{
  nome: 'Rosa Vermelha das Almas',
  linha: 'Rosas',
  campo: 'paixão com dor, saudade, ligação espiritual e amor marcado.',
  luz: 'mostra magnetismo profundo e revela sentimento preso.',
  sombra: 'apego, sofrimento amoroso e laço difícil de soltar.',
  conselho: 'paixão sem dignidade vira corrente.',
  apareceQuando: ['paixão', 'saudade', 'amor marcado', 'apego', 'ligação']
},
{
  nome: 'Dama Negra',
  linha: 'Damas',
  campo: 'mistério, proteção, poder oculto e verdades não ditas.',
  luz: 'protege no silêncio e revela intenções escondidas.',
  sombra: 'segredo, isolamento, desconfiança e energia fechada.',
  conselho: 'quem muito esconde também se prende no próprio segredo.',
  apareceQuando: ['mistério', 'segredo', 'proteção', 'silêncio', 'desconfiança']
},
{
  nome: 'Dama das Almas',
  linha: 'Damas',
  campo: 'ancestralidade, proteção espiritual, dores antigas e caminhos de cura.',
  luz: 'ampara em momentos pesados e fortalece proteção silenciosa.',
  sombra: 'tristeza antiga, apego ao passado e medo espiritual.',
  conselho: 'honre seus mortos, mas viva sua vida.',
  apareceQuando: ['ancestralidade', 'perda', 'proteção', 'tristeza', 'cura']
},
{
  nome: 'Dama da Encruzilhada',
  linha: 'Damas',
  campo: 'escolhas, sedução, decisão, magnetismo e viradas de caminho.',
  luz: 'mostra a melhor direção e fortalece presença pessoal.',
  sombra: 'dúvida, vaidade, disputa e caminhos cruzados.',
  conselho: 'encruzilhada não é lugar de medo; é lugar de decisão.',
  apareceQuando: ['decisão', 'encruzilhada', 'sedução', 'dúvida', 'virada']
},
{
  nome: 'Dama do Cabaré',
  linha: 'Damas',
  campo: 'prazer, autoestima, vida social, encanto e relações afetivas.',
  luz: 'devolve alegria, magnetismo e domínio da própria presença.',
  sombra: 'carência, excesso, vaidade e relações vazias.',
  conselho: 'brilhe sem vender sua paz por atenção.',
  apareceQuando: ['prazer', 'autoestima', 'vida social', 'encanto', 'carência']
},
{
  nome: 'Dama da Meia-Noite',
  linha: 'Damas',
  campo: 'silêncio, segredo, virada espiritual, desejo oculto e revelação.',
  luz: 'mostra o que fica escondido quando todos se calam.',
  sombra: 'solidão, ilusão noturna e escolhas escondidas.',
  conselho: 'o silêncio também fala; aprenda a escutar.',
  apareceQuando: ['silêncio', 'segredo', 'meia-noite', 'desejo oculto', 'solidão']
},
{
  nome: 'Pombo Gira Sete Saias do Cabaré',
  linha: 'Saias',
  campo: 'sedução, autoestima, encanto, proteção e poder feminino.',
  luz: 'fortalece magnetismo, alegria e domínio pessoal.',
  sombra: 'vaidade ferida, disputa, carência e sedução sem direção.',
  conselho: 'não dispute presença; seja presença.',
  apareceQuando: ['sedução', 'autoestima', 'cabaré', 'magnetismo', 'poder feminino']
},
{
  nome: 'Pombo Gira Sete Saias das Almas',
  linha: 'Saias',
  campo: 'proteção espiritual, mistério, ancestralidade e defesa.',
  luz: 'protege caminhos densos e fortalece presença espiritual.',
  sombra: 'medo, segredo, energia pesada e desconfiança.',
  conselho: 'proteção também exige postura.',
  apareceQuando: ['proteção', 'ancestralidade', 'mistério', 'energia pesada', 'defesa']
},
{
  nome: 'Pombo Gira Sete Saias da Estrada',
  linha: 'Saias',
  campo: 'caminhos, movimento, proteção em mudanças e viradas.',
  luz: 'abre estrada com proteção e fortalece decisões de movimento.',
  sombra: 'instabilidade, fuga e escolhas sem direção.',
  conselho: 'mudar de caminho não resolve se você leva a mesma confusão.',
  apareceQuando: ['estrada', 'mudança', 'proteção', 'caminhos', 'virada']
},
{
  nome: 'Pombo Gira Sete Saias da Calunga',
  linha: 'Saias',
  campo: 'mistério profundo, defesa espiritual, cortes e encerramentos.',
  luz: 'protege nas sombras e ajuda a encerrar ciclos pesados.',
  sombra: 'medo, apego ao sofrimento e energia parada.',
  conselho: 'não tenha medo do fim quando ele te livra.',
  apareceQuando: ['calunga', 'fim', 'corte', 'proteção', 'energia pesada']
},
{
  nome: 'Pombo Gira Sete Saias da Praia',
  linha: 'Saias',
  campo: 'emoções, limpeza, encanto, amor e proteção feminina.',
  luz: 'limpa mágoas e fortalece magnetismo com suavidade.',
  sombra: 'carência, ilusão e instabilidade afetiva.',
  conselho: 'o mar leva, mas você precisa soltar.',
  apareceQuando: ['emoção', 'limpeza', 'amor', 'praia', 'carência']
},
{
  nome: 'Pombo Gira Cigana da Lua',
  linha: 'Ciganas',
  campo: 'intuição, destino, sonhos, romance e sinais ocultos.',
  luz: 'revela caminhos pela intuição e fortalece percepção espiritual.',
  sombra: 'fantasia, instabilidade e excesso de sonho.',
  conselho: 'a lua mostra sinais, mas quem caminha é você.',
  apareceQuando: ['intuição', 'lua', 'sonhos', 'romance', 'destino']
},
{
  nome: 'Pombo Gira Cigana da Estrada',
  linha: 'Ciganas',
  campo: 'movimento, viagem, destino, mudanças e novas oportunidades.',
  luz: 'abre estrada, traz movimento e aponta novas direções.',
  sombra: 'fuga, instabilidade e falta de compromisso.',
  conselho: 'liberdade sem direção vira perda de tempo.',
  apareceQuando: ['viagem', 'estrada', 'mudança', 'oportunidade', 'destino']
},
{
  nome: 'Pombo Gira Cigana do Oriente',
  linha: 'Ciganas',
  campo: 'sabedoria, visão espiritual, destino, mistério e conselho.',
  luz: 'traz visão ampla, intuição e orientação de caminhos.',
  sombra: 'excesso de fantasia, distância emocional e fuga da realidade.',
  conselho: 'veja longe, mas não esqueça o chão onde pisa.',
  apareceQuando: ['sabedoria', 'visão', 'destino', 'orientação', 'mistério']
},
{
  nome: 'Pombo Gira Cigana do Ouro',
  linha: 'Ciganas',
  campo: 'prosperidade, sorte, movimento financeiro e oportunidades.',
  luz: 'abre caminhos de dinheiro, comércio e boas oportunidades.',
  sombra: 'ganância, pressa, vaidade e gasto sem controle.',
  conselho: 'sorte ajuda, mas disciplina segura a prosperidade.',
  apareceQuando: ['dinheiro', 'prosperidade', 'sorte', 'comércio', 'oportunidade']
},
{
  nome: 'Pombo Gira Cigana das Rosas',
  linha: 'Ciganas',
  campo: 'amor, encanto, alegria, movimento afetivo e beleza.',
  luz: 'fortalece magnetismo, leveza e abertura amorosa.',
  sombra: 'ilusão romântica, instabilidade e sedução sem raiz.',
  conselho: 'encante sem se perder no encanto do outro.',
  apareceQuando: ['amor', 'encanto', 'alegria', 'romance', 'atração']
},
{
  nome: 'Rainha do Cabaré',
  linha: 'Rainhas',
  campo: 'poder social, sedução, autoestima, prazer e domínio da presença.',
  luz: 'fortalece encanto, alegria e autoconfiança.',
  sombra: 'vaidade, excesso, carência e disputa por atenção.',
  conselho: 'quem tem trono não disputa cadeira.',
  apareceQuando: ['cabaré', 'sedução', 'autoestima', 'poder', 'atenção']
},
{
  nome: 'Rainha das Almas',
  linha: 'Rainhas',
  campo: 'ancestralidade, proteção espiritual, cura e sabedoria antiga.',
  luz: 'protege em caminhos pesados e fortalece a ligação ancestral.',
  sombra: 'tristeza antiga, apego ao passado e energia densa.',
  conselho: 'respeite o passado, mas não viva preso nele.',
  apareceQuando: ['ancestralidade', 'proteção', 'almas', 'cura', 'passado']
},
{
  nome: 'Rainha da Calunga',
  linha: 'Rainhas',
  campo: 'mistério profundo, fim de ciclos, proteção e transformação.',
  luz: 'encerra o que precisa terminar e protege em travessias difíceis.',
  sombra: 'medo, apego, energia pesada e recusa de encerramento.',
  conselho: 'quando a vida enterra um ciclo, não cave para sofrer de novo.',
  apareceQuando: ['calunga', 'fim', 'mistério', 'transformação', 'proteção']
},
{
  nome: 'Rainha da Praia',
  linha: 'Rainhas',
  campo: 'emoções, limpeza, amor, sedução e movimento afetivo.',
  luz: 'limpa mágoas, suaviza conflitos e fortalece encanto emocional.',
  sombra: 'ilusão, carência, instabilidade e apego sentimental.',
  conselho: 'se a maré levou, aprenda antes de correr atrás.',
  apareceQuando: ['praia', 'emoção', 'amor', 'limpeza', 'saudade']
},
{
  nome: 'Rainha da Lira',
  linha: 'Rainhas',
  campo: 'alegria, sedução, comunicação, vida social e poder de encanto.',
  luz: 'abre caminhos sociais, fortalece palavra e magnetismo.',
  sombra: 'excesso, vaidade, distração e relações superficiais.',
  conselho: 'encanto é poder; use com consciência.',
  apareceQuando: ['lira', 'comunicação', 'sedução', 'vida social', 'encanto']
},
{
  nome: 'Rainha das Matas',
  linha: 'Rainhas',
  campo: 'proteção natural, cura, segredo, força instintiva e raiz espiritual.',
  luz: 'protege, fortalece energia vital e traz sabedoria de raiz.',
  sombra: 'isolamento, desconfiança e fuga para dentro de si.',
  conselho: 'a mata guarda, mas também testa quem entra.',
  apareceQuando: ['matas', 'proteção', 'cura', 'raiz', 'natureza']
},
{
  nome: 'Rainha do Cruzeiro',
  linha: 'Rainhas',
  campo: 'escolhas, destino, decisões fortes e cruzamentos espirituais.',
  luz: 'clareia caminhos cruzados e mostra direção firme.',
  sombra: 'indecisão, medo de escolher e caminhos travados.',
  conselho: 'não peça resposta se não tiver coragem de seguir o caminho mostrado.',
  apareceQuando: ['cruzeiro', 'decisão', 'destino', 'dúvida', 'caminhos']
},
{
  nome: 'Rainha do Lodo',
  linha: 'Rainhas',
  campo: 'transformação em ambientes pesados, limpeza e saída da estagnação.',
  luz: 'ajuda a levantar de situações difíceis e limpar energia densa.',
  sombra: 'acomodação na dor, apego ao caos e tristeza parada.',
  conselho: 'você pode ter passado pela lama, mas não nasceu para morar nela.',
  apareceQuando: ['lodo', 'energia pesada', 'estagnação', 'dor', 'limpeza']
},
{
  nome: 'Rainha do Mangue',
  linha: 'Rainhas',
  campo: 'sobrevivência, adaptação, força oculta e transformação.',
  luz: 'mostra força em situações difíceis e abre vida onde parecia impossível.',
  sombra: 'paralisação, confusão emocional e apego ao sofrimento.',
  conselho: 'até o mangue tem vida; o problema é aceitar viver sem saída.',
  apareceQuando: ['mangue', 'sobrevivência', 'adaptação', 'dificuldade', 'transformação']
},
{
  nome: 'Rainha da Cachoeira',
  linha: 'Rainhas',
  campo: 'limpeza emocional, renovação, amor-próprio e fluidez.',
  luz: 'renova sentimentos e ajuda a lavar dores antigas.',
  sombra: 'excesso emocional, fuga e instabilidade sentimental.',
  conselho: 'deixe a água levar o que sua alma já não aguenta carregar.',
  apareceQuando: ['cachoeira', 'limpeza', 'renovação', 'emoção', 'amor-próprio']
},
{
  nome: 'Rainha das Pedreiras',
  linha: 'Rainhas',
  campo: 'firmeza, justiça, estrutura, resistência e decisões sólidas.',
  luz: 'dá base, firmeza e coragem para decisões difíceis.',
  sombra: 'rigidez, orgulho e dureza emocional.',
  conselho: 'seja firme como pedra, mas não frio como ela.',
  apareceQuando: ['firmeza', 'justiça', 'pedreira', 'decisão', 'estrutura']
},


{
  nome: 'Maria Padilha da Tronqueira',
  linha: 'Maria Padilhas',
  campo: 'proteção de entrada, firmeza, caminhos espirituais e defesa.',
  luz: 'guarda passagens, fortalece proteção e fecha entrada para energia ruim.',
  sombra: 'teimosia, bloqueio, medo de avançar e defesa excessiva.',
  conselho: 'nem toda porta deve ficar aberta; proteja sua entrada.',
  apareceQuando: ['proteção', 'entrada', 'tronqueira', 'defesa', 'bloqueio']
},
{
  nome: 'Maria Padilha dos Sete Cruzeiros',
  linha: 'Maria Padilhas',
  campo: 'decisões pesadas, destino, caminhos cruzados e justiça espiritual.',
  luz: 'clareia escolhas difíceis e firma caminhos espirituais.',
  sombra: 'dúvida, medo, peso espiritual e caminhos travados.',
  conselho: 'quando o caminho pesa, escolha com fé e firmeza.',
  apareceQuando: ['cruzeiro', 'destino', 'justiça', 'decisão', 'caminhos']
},
{
  nome: 'Maria Padilha do Porto',
  linha: 'Maria Padilhas',
  campo: 'chegadas, partidas, saudade, retorno e movimento emocional.',
  luz: 'mostra quem chega, quem parte e o que ainda pode retornar.',
  sombra: 'espera, apego, saudade presa e medo de seguir.',
  conselho: 'nem todo barco que parte merece porto aberto para voltar.',
  apareceQuando: ['saudade', 'retorno', 'partida', 'espera', 'movimento']
},
{
  nome: 'Maria Padilha da Lomba',
  linha: 'Maria Padilhas',
  campo: 'subidas difíceis, resistência, esforço e superação.',
  luz: 'dá força para vencer caminhos pesados e subir com firmeza.',
  sombra: 'cansaço, desistência, orgulho e sensação de peso.',
  conselho: 'subida cansa, mas também mostra quem tem perna para vencer.',
  apareceQuando: ['dificuldade', 'subida', 'resistência', 'cansaço', 'superação']
},
{
  nome: 'Maria Padilha da Mata Escura',
  linha: 'Maria Padilhas',
  campo: 'mistério, proteção profunda, medo, segredo e caminhos ocultos.',
  luz: 'protege no escuro e revela perigos escondidos.',
  sombra: 'medo, confusão, isolamento e energia escondida.',
  conselho: 'quem caminha no escuro precisa confiar na própria firmeza.',
  apareceQuando: ['mistério', 'medo', 'proteção', 'segredo', 'oculto']
},
{
  nome: 'Maria Padilha do Cais',
  linha: 'Maria Padilhas',
  campo: 'espera, saudade, encontros, partidas e decisões emocionais.',
  luz: 'mostra movimento afetivo e clareia esperas do coração.',
  sombra: 'apego, ansiedade, ilusão de retorno e coração parado.',
  conselho: 'não fique no cais esperando quem não sabe voltar.',
  apareceQuando: ['espera', 'saudade', 'encontro', 'partida', 'retorno']
},
{
  nome: 'Maria Padilha das Sete Portas',
  linha: 'Maria Padilhas',
  campo: 'aberturas, escolhas, oportunidades e proteção de caminhos.',
  luz: 'abre portas certas e fecha caminhos de perda.',
  sombra: 'confusão, excesso de opções e medo de escolher.',
  conselho: 'porta aberta também exige coragem para atravessar.',
  apareceQuando: ['porta', 'oportunidade', 'escolha', 'abertura', 'proteção']
},
{
  nome: 'Maria Padilha das Sete Chaves',
  linha: 'Maria Padilhas',
  campo: 'segredos, proteção, desbloqueio, caminhos fechados e revelação.',
  luz: 'abre o que estava trancado e revela a chave do problema.',
  sombra: 'segredo, bloqueio, teimosia e portas espirituais fechadas.',
  conselho: 'toda chave abre algo, mas nem toda porta merece ser aberta.',
  apareceQuando: ['chave', 'bloqueio', 'segredo', 'desbloqueio', 'proteção']
},
{
  nome: 'Maria Padilha do Ouro',
  linha: 'Maria Padilhas',
  campo: 'prosperidade, brilho, ambição, autoestima e conquistas.',
  luz: 'abre caminhos de valor, dinheiro e reconhecimento.',
  sombra: 'vaidade, ganância, orgulho e desejo de aprovação.',
  conselho: 'ouro sem caráter pesa mais do que enriquece.',
  apareceQuando: ['dinheiro', 'prosperidade', 'valor', 'brilho', 'conquista']
},
{
  nome: 'Maria Padilha da Lua',
  linha: 'Maria Padilhas',
  campo: 'intuição, amor oculto, sonhos, saudade e mistério feminino.',
  luz: 'clareia sentimentos escondidos e fortalece percepção espiritual.',
  sombra: 'fantasia, ilusão, espera e emoção instável.',
  conselho: 'a lua mostra, mas não carrega seus passos.',
  apareceQuando: ['lua', 'intuição', 'saudade', 'sonho', 'amor oculto']
},
{
  nome: 'Maria Mulambo da Calunga',
  linha: 'Marias',
  campo: 'abandono profundo, fim de ciclos, dor antiga e libertação.',
  luz: 'levanta quem foi deixado para trás e corta apego ao sofrimento.',
  sombra: 'mágoa pesada, apego ao passado e tristeza parada.',
  conselho: 'não faça morada onde só existe lembrança morta.',
  apareceQuando: ['abandono', 'calunga', 'fim', 'dor antiga', 'libertação']
},
{
  nome: 'Maria Mulambo da Praia',
  linha: 'Marias',
  campo: 'cura emocional, rejeição amorosa, saudade e limpeza afetiva.',
  luz: 'lava dores de amor e devolve suavidade ao coração.',
  sombra: 'carência, choro escondido e apego sentimental.',
  conselho: 'deixe a maré levar quem só te trouxe peso.',
  apareceQuando: ['rejeição', 'saudade', 'praia', 'cura emocional', 'amor']
},
{
  nome: 'Maria Mulambo da Figueira',
  linha: 'Marias',
  campo: 'raízes de dor, abandono familiar, segredo e cura profunda.',
  luz: 'mostra a origem da ferida e fortalece reconstrução.',
  sombra: 'mágoa antiga, segredo familiar e sentimento de rejeição.',
  conselho: 'raiz ferida precisa de cuidado, não de negação.',
  apareceQuando: ['raiz', 'abandono', 'família', 'segredo', 'cura']
},
{
  nome: 'Maria Mulambo das Sete Encruzilhadas',
  linha: 'Marias',
  campo: 'recomeço após humilhação, escolha, amor ferido e virada.',
  luz: 'abre novos caminhos para quem foi desprezado.',
  sombra: 'vergonha, baixa autoestima e medo de recomeçar.',
  conselho: 'a encruzilhada também levanta quem caiu.',
  apareceQuando: ['humilhação', 'recomeço', 'amor ferido', 'encruzilhada', 'virada']
},
{
  nome: 'Maria Farrapo das Almas',
  linha: 'Marias',
  campo: 'rejeição espiritual, tristeza antiga, abandono e cura da dignidade.',
  luz: 'acolhe quem foi esquecido e devolve força silenciosa.',
  sombra: 'dor presa, sensação de abandono e tristeza profunda.',
  conselho: 'quem te esqueceu não apagou teu valor.',
  apareceQuando: ['abandono', 'tristeza', 'almas', 'dignidade', 'cura']
},
{
  nome: 'Maria Farrapo da Estrada',
  linha: 'Marias',
  campo: 'queda, recomeço, estrada difícil e recuperação.',
  luz: 'dá força para seguir depois de perdas e desprezo.',
  sombra: 'medo de caminhar, cansaço e apego ao que feriu.',
  conselho: 'quem caiu na estrada também pode levantar nela.',
  apareceQuando: ['queda', 'estrada', 'recomeço', 'perda', 'recuperação']
},
{
  nome: 'Maria Farrapo do Cruzeiro',
  linha: 'Marias',
  campo: 'dor de escolha, abandono, destino e virada espiritual.',
  luz: 'mostra saída onde parecia existir apenas sofrimento.',
  sombra: 'indecisão, mágoa e apego a caminhos quebrados.',
  conselho: 'não escolha de novo aquilo que já te rasgou.',
  apareceQuando: ['abandono', 'cruzeiro', 'escolha', 'dor', 'virada']
},
{
  nome: 'Maria Farrapo do Cabaré',
  linha: 'Marias',
  campo: 'autoestima ferida, desejo, rejeição, sedução e reconstrução.',
  luz: 'devolve brilho para quem foi diminuído no amor.',
  sombra: 'carência, vergonha, humilhação afetiva e busca por aprovação.',
  conselho: 'não se enfeite para quem só sabe rasgar.',
  apareceQuando: ['autoestima', 'rejeição', 'cabaré', 'sedução', 'carência']
},
{
  nome: 'Maria Quitéria do Cemitério',
  linha: 'Marias',
  campo: 'fim de lutas, justiça, proteção e encerramento de ciclos.',
  luz: 'dá coragem para enterrar batalhas que já cumpriram seu papel.',
  sombra: 'guerra interna, apego à disputa e cansaço espiritual.',
  conselho: 'nem toda luta vencida precisa continuar sendo carregada.',
  apareceQuando: ['justiça', 'fim', 'cemitério', 'batalha', 'proteção']
},
{
  nome: 'Maria Quitéria da Calunga',
  linha: 'Marias',
  campo: 'proteção pesada, justiça espiritual, coragem e cortes profundos.',
  luz: 'defende em caminhos densos e fortalece firmeza diante do medo.',
  sombra: 'raiva, sobrecarga, guerra espiritual e dureza.',
  conselho: 'coragem sem direção vira peso nas costas.',
  apareceQuando: ['calunga', 'proteção', 'justiça', 'coragem', 'corte']
},
{
  nome: 'Maria Quitéria da Praia',
  linha: 'Marias',
  campo: 'trabalho emocional, equilíbrio, movimento e limpeza de cansaço.',
  luz: 'limpa pesos emocionais e ajuda a recuperar força.',
  sombra: 'cansaço, instabilidade e esforço sem descanso.',
  conselho: 'até quem luta precisa lavar a alma.',
  apareceQuando: ['cansaço', 'praia', 'limpeza', 'trabalho', 'equilíbrio']
},
{
  nome: 'Maria Quitéria do Cruzeiro',
  linha: 'Marias',
  campo: 'decisão, justiça, trabalho, destino e caminhos de conquista.',
  luz: 'firma decisões importantes e abre caminho para vitória.',
  sombra: 'orgulho, indecisão e excesso de cobrança.',
  conselho: 'a vitória começa quando você para de fugir da decisão.',
  apareceQuando: ['decisão', 'trabalho', 'justiça', 'cruzeiro', 'vitória']
},
{
  nome: 'Maria Navalha do Cemitério',
  linha: 'Marias',
  campo: 'corte definitivo, fim de mentira, proteção e desapego.',
  luz: 'encerra falsidade e corta vínculos espiritualmente pesados.',
  sombra: 'vingança, rancor e dureza destrutiva.',
  conselho: 'cortar não é odiar; é parar de sangrar.',
  apareceQuando: ['corte', 'mentira', 'cemitério', 'desapego', 'proteção']
},
{
  nome: 'Maria Navalha da Calunga',
  linha: 'Marias',
  campo: 'verdade oculta, defesa espiritual, traição e corte profundo.',
  luz: 'revela o escondido e protege contra ataque silencioso.',
  sombra: 'desconfiança, raiva e desejo de revanche.',
  conselho: 'a verdade corta melhor quando sua mão está firme.',
  apareceQuando: ['traição', 'calunga', 'verdade', 'defesa', 'corte']
},
{
  nome: 'Maria Navalha do Cabaré',
  linha: 'Marias',
  campo: 'jogo emocional, mentira afetiva, sedução e verdade.',
  luz: 'mostra falsidade em relações e corta encanto perigoso.',
  sombra: 'ciúme, disputa, vaidade e manipulação.',
  conselho: 'nem todo sorriso bonito vem com intenção limpa.',
  apareceQuando: ['mentira', 'sedução', 'cabaré', 'jogo emocional', 'ciúme']
},
{
  nome: 'Maria Navalha da Lira',
  linha: 'Marias',
  campo: 'palavra, comunicação, corte de fofoca e verdade social.',
  luz: 'corta boatos, revela fala falsa e protege reputação.',
  sombra: 'língua afiada, fofoca, intriga e palavra venenosa.',
  conselho: 'palavra também corta; escolha se vai ferir ou libertar.',
  apareceQuando: ['fofoca', 'comunicação', 'mentira', 'lira', 'reputação']
},
{
  nome: 'Maria Rosa das Almas',
  linha: 'Marias',
  campo: 'amor antigo, cura espiritual, saudade e doçura ferida.',
  luz: 'acalma dores antigas e fortalece amor-próprio.',
  sombra: 'saudade presa, tristeza amorosa e apego ao passado.',
  conselho: 'doçura não é se entregar para quem te machuca.',
  apareceQuando: ['amor antigo', 'saudade', 'cura', 'almas', 'tristeza']
},
{
  nome: 'Maria Rosa da Estrada',
  linha: 'Marias',
  campo: 'amor em movimento, recomeço, encontros e abertura afetiva.',
  luz: 'abre caminhos amorosos e suaviza mudanças do coração.',
  sombra: 'instabilidade, esperança sem base e medo de recomeçar.',
  conselho: 'novo caminho pede coração limpo.',
  apareceQuando: ['amor', 'estrada', 'recomeço', 'encontro', 'mudança']
},
{
  nome: 'Maria Rosa do Cabaré',
  linha: 'Marias',
  campo: 'encanto, autoestima, desejo, vida social e magnetismo.',
  luz: 'devolve brilho, alegria e poder de atração.',
  sombra: 'carência, vaidade e dependência de elogio.',
  conselho: 'seu brilho não pode depender dos olhos dos outros.',
  apareceQuando: ['autoestima', 'encanto', 'desejo', 'cabaré', 'magnetismo']
},
{
  nome: 'Maria Rosa da Praia',
  linha: 'Marias',
  campo: 'cura emocional, amor, leveza, saudade e limpeza.',
  luz: 'lava mágoas e abre espaço para sentimento mais leve.',
  sombra: 'ilusão, carência e emoção sem direção.',
  conselho: 'deixe o mar limpar antes de tentar amar de novo.',
  apareceQuando: ['cura emocional', 'praia', 'amor', 'saudade', 'limpeza']
},
{
  nome: 'Rosa Negra das Almas',
  linha: 'Rosas',
  campo: 'mistério espiritual, proteção, desejo oculto e segredos antigos.',
  luz: 'protege em silêncio e revela intenções profundas.',
  sombra: 'obsessão, segredo, ciúme e energia densa.',
  conselho: 'mistério é poder quando não vira prisão.',
  apareceQuando: ['mistério', 'almas', 'segredo', 'proteção', 'ciúme']
},
{
  nome: 'Rosa Negra da Calunga',
  linha: 'Rosas',
  campo: 'proteção profunda, corte, desejo intenso e transformação.',
  luz: 'corta obsessões e protege contra energia pesada.',
  sombra: 'apego sombrio, controle e desejo destrutivo.',
  conselho: 'quando o desejo vira corrente, é hora de cortar.',
  apareceQuando: ['calunga', 'obsessão', 'corte', 'proteção', 'desejo']
},
{
  nome: 'Rosa Negra da Encruzilhada',
  linha: 'Rosas',
  campo: 'escolhas afetivas, sedução, mistério e decisão.',
  luz: 'mostra intenção oculta e ajuda a escolher com firmeza.',
  sombra: 'dúvida, ilusão, vaidade e disputa.',
  conselho: 'não escolha pelo desejo se a verdade já mostrou perigo.',
  apareceQuando: ['encruzilhada', 'sedução', 'decisão', 'mistério', 'ilusão']
},
{
  nome: 'Rosa Branca das Almas',
  linha: 'Rosas',
  campo: 'paz espiritual, cura de perdas, calma e proteção.',
  luz: 'acalma dores profundas e traz serenidade para decidir.',
  sombra: 'passividade, tristeza silenciosa e medo de conflito.',
  conselho: 'paz também exige coragem para encerrar o que machuca.',
  apareceQuando: ['paz', 'almas', 'cura', 'perda', 'calma']
},
{
  nome: 'Rosa Branca da Praia',
  linha: 'Rosas',
  campo: 'limpeza emocional, reconciliação interna e suavização.',
  luz: 'lava mágoas e traz leveza para o coração.',
  sombra: 'fuga emocional, fragilidade e espera sem atitude.',
  conselho: 'não use paz como desculpa para aceitar abandono.',
  apareceQuando: ['praia', 'limpeza', 'reconciliação', 'paz', 'mágoa']
},
{
  nome: 'Rosa Vermelha da Encruzilhada',
  linha: 'Rosas',
  campo: 'paixão, escolha amorosa, desejo e virada afetiva.',
  luz: 'fortalece atração e abre caminho para movimento amoroso.',
  sombra: 'ciúme, apego, pressa e disputa emocional.',
  conselho: 'paixão abre caminho, mas dignidade decide se você entra.',
  apareceQuando: ['paixão', 'encruzilhada', 'atração', 'amor', 'ciúme']
},
{
  nome: 'Rosa Vermelha do Cabaré',
  linha: 'Rosas',
  campo: 'sedução, autoestima, desejo, encanto e poder afetivo.',
  luz: 'aumenta magnetismo e devolve confiança amorosa.',
  sombra: 'carência, vaidade e dependência de desejo alheio.',
  conselho: 'ser desejado não vale mais do que ser respeitado.',
  apareceQuando: ['sedução', 'desejo', 'cabaré', 'autoestima', 'amor']
},
{
  nome: 'Dama da Lua',
  linha: 'Damas',
  campo: 'intuição, amor oculto, silêncio, sonhos e percepção.',
  luz: 'clareia sentimentos escondidos e fortalece a intuição.',
  sombra: 'fantasia, idealização e confusão emocional.',
  conselho: 'escute sua intuição, mas não abandone a realidade.',
  apareceQuando: ['lua', 'intuição', 'sonho', 'amor oculto', 'silêncio']
},
{
  nome: 'Dama da Praia',
  linha: 'Damas',
  campo: 'emoção, limpeza, sedução suave e cura afetiva.',
  luz: 'limpa mágoas e suaviza relações carregadas.',
  sombra: 'carência, instabilidade e excesso emocional.',
  conselho: 'não mergulhe onde você já sabe que não há chão.',
  apareceQuando: ['praia', 'emoção', 'limpeza', 'cura', 'carência']
},
{
  nome: 'Dama da Calunga',
  linha: 'Damas',
  campo: 'mistério profundo, proteção, silêncio e encerramentos.',
  luz: 'protege no escuro e ajuda a fechar ciclos pesados.',
  sombra: 'medo, apego ao fim e energia parada.',
  conselho: 'o fim também pode ser proteção.',
  apareceQuando: ['calunga', 'fim', 'proteção', 'mistério', 'silêncio']
},
{
  nome: 'Dama das Sete Encruzilhadas',
  linha: 'Damas',
  campo: 'escolhas complexas, mistério, sedução e decisão espiritual.',
  luz: 'mostra direção em caminhos cruzados e fortalece presença.',
  sombra: 'dúvida, vaidade, manipulação e caminhos confusos.',
  conselho: 'quem tem muitas portas diante de si precisa de firmeza para escolher.',
  apareceQuando: ['encruzilhada', 'decisão', 'mistério', 'sedução', 'caminhos']
},
{
  nome: 'Dama dos Sete Véus',
  linha: 'Damas',
  campo: 'segredos, mistério feminino, revelação gradual e proteção.',
  luz: 'retira véus da ilusão e mostra verdades escondidas aos poucos.',
  sombra: 'segredo, manipulação, fantasia e confusão.',
  conselho: 'nem tudo se revela de uma vez; observe sem se enganar.',
  apareceQuando: ['segredo', 'véu', 'mistério', 'ilusão', 'revelação']
},
{
  nome: 'Pombo Gira Sete Rosas',
  linha: 'Rosas',
  campo: 'amor, beleza, proteção, encanto e cura emocional.',
  luz: 'fortalece autoestima, atração e suavidade espiritual.',
  sombra: 'vaidade, apego, ilusão amorosa e carência.',
  conselho: 'sete rosas não perfumam uma vida sem amor-próprio.',
  apareceQuando: ['amor', 'rosas', 'autoestima', 'cura', 'atração']
},
{
  nome: 'Pombo Gira Sete Rosas da Calunga',
  linha: 'Rosas',
  campo: 'amor marcado, fim de ciclos, proteção e transformação afetiva.',
  luz: 'corta apego amoroso pesado e protege o coração.',
  sombra: 'obsessão, dor amorosa e recusa de encerramento.',
  conselho: 'amor que vira peso precisa de corte e verdade.',
  apareceQuando: ['amor marcado', 'calunga', 'fim', 'proteção', 'apego']
},
{
  nome: 'Pombo Gira Sete Rosas da Praia',
  linha: 'Rosas',
  campo: 'limpeza afetiva, romance, saudade e cura emocional.',
  luz: 'lava mágoas e renova o campo amoroso.',
  sombra: 'ilusão, espera, carência e emoção confusa.',
  conselho: 'limpe o coração antes de abrir nova porta.',
  apareceQuando: ['praia', 'amor', 'limpeza', 'saudade', 'cura']
},
{
  nome: 'Pombo Gira Sete Rosas da Estrada',
  linha: 'Rosas',
  campo: 'recomeço amoroso, encontros, mudanças e abertura afetiva.',
  luz: 'abre caminhos para novo movimento sentimental.',
  sombra: 'instabilidade, pressa e esperança sem postura.',
  conselho: 'o amor também precisa de direção.',
  apareceQuando: ['estrada', 'recomeço', 'amor', 'encontro', 'mudança']
},
{
  nome: 'Pombo Gira Cigana Esmeralda',
  linha: 'Ciganas',
  campo: 'cura, prosperidade, intuição, beleza e caminhos de crescimento.',
  luz: 'abre visão, fortalece esperança e favorece prosperidade.',
  sombra: 'fantasia, apego a promessas e instabilidade.',
  conselho: 'brilhe com sabedoria, não com ilusão.',
  apareceQuando: ['prosperidade', 'intuição', 'cura', 'beleza', 'crescimento']
},
{
  nome: 'Pombo Gira Cigana Safira',
  linha: 'Ciganas',
  campo: 'clareza, verdade emocional, intuição e proteção.',
  luz: 'clareia sentimentos e protege decisões delicadas.',
  sombra: 'frieza, distância emocional e medo de sentir.',
  conselho: 'clareza sem coragem não muda destino.',
  apareceQuando: ['clareza', 'verdade', 'intuição', 'proteção', 'emoção']
},
{
  nome: 'Pombo Gira Cigana Rubi',
  linha: 'Ciganas',
  campo: 'paixão, desejo, coragem amorosa e magnetismo.',
  luz: 'fortalece atração, atitude e poder de conquista.',
  sombra: 'impulso, ciúme, pressa e apego ao desejo.',
  conselho: 'desejo forte precisa de cabeça firme.',
  apareceQuando: ['paixão', 'desejo', 'magnetismo', 'coragem', 'ciúme']
},
{
  nome: 'Pombo Gira Cigana Serena',
  linha: 'Ciganas',
  campo: 'paz, equilíbrio, reconciliação interna e orientação.',
  luz: 'acalma pensamentos e mostra direção com suavidade.',
  sombra: 'passividade, medo de agir e espera prolongada.',
  conselho: 'serenidade não é ficar parado; é agir sem desespero.',
  apareceQuando: ['paz', 'equilíbrio', 'orientação', 'calma', 'reconciliação']
},
{
  nome: 'Pombo Gira Cigana Aurora',
  linha: 'Ciganas',
  campo: 'recomeço, esperança, novidade, abertura e destino.',
  luz: 'abre novos ciclos e traz clareza depois da escuridão.',
  sombra: 'ansiedade, pressa e medo do novo.',
  conselho: 'a aurora chega para quem atravessa a noite sem desistir.',
  apareceQuando: ['recomeço', 'esperança', 'novidade', 'aurora', 'destino']
},
{
  nome: 'Rainha da Meia-Noite',
  linha: 'Rainhas',
  campo: 'segredos, viradas, silêncio, mistério e revelação.',
  luz: 'mostra verdades escondidas no silêncio e protege decisões noturnas.',
  sombra: 'solidão, ilusão, segredo e escolhas ocultas.',
  conselho: 'a meia-noite revela o que o dia tentou esconder.',
  apareceQuando: ['meia-noite', 'segredo', 'silêncio', 'virada', 'mistério']
},
{
  nome: 'Rainha das Sete Portas',
  linha: 'Rainhas',
  campo: 'abertura, fechamento, destino, proteção e oportunidade.',
  luz: 'abre portas certas e protege contra caminhos errados.',
  sombra: 'confusão, ansiedade e medo de escolher.',
  conselho: 'nem toda porta bonita leva a um bom destino.',
  apareceQuando: ['porta', 'abertura', 'proteção', 'oportunidade', 'escolha']
},
{
  nome: 'Rainha das Sete Chaves',
  linha: 'Rainhas',
  campo: 'desbloqueio, segredo, proteção, revelação e domínio espiritual.',
  luz: 'abre caminhos trancados e mostra a chave da situação.',
  sombra: 'controle, segredo, medo e bloqueio espiritual.',
  conselho: 'quem tem chave também precisa saber o que não abrir.',
  apareceQuando: ['chave', 'desbloqueio', 'segredo', 'proteção', 'revelação']
},
{
  nome: 'Rainha das Sete Catacumbas',
  linha: 'Rainhas',
  campo: 'proteção pesada, fim de ciclos, mistério e força profunda.',
  luz: 'protege em caminhos densos e encerra ligações pesadas.',
  sombra: 'medo, apego ao passado e energia morta.',
  conselho: 'não carregue catacumba no coração.',
  apareceQuando: ['catacumba', 'fim', 'proteção pesada', 'mistério', 'apego']
},
{
  nome: 'Rainha do Oriente',
  linha: 'Rainhas',
  campo: 'sabedoria, visão espiritual, destino, segredo e orientação.',
  luz: 'traz visão ampla, discernimento e direção espiritual.',
  sombra: 'distância emocional, fantasia e fuga da realidade.',
  conselho: 'sabedoria é enxergar longe sem perder o chão.',
  apareceQuando: ['oriente', 'sabedoria', 'destino', 'visão', 'orientação']
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
  if (t.includes('trabalho') || t.includes('dinheiro') || t.includes('prosperidade')) return 'prosperidade';
  if (t.includes('espiritual') || t.includes('guia') || t.includes('entidade')) return 'espiritualidade';
  if (t.includes('inveja') || t.includes('demanda') || t.includes('proteção') || t.includes('protecao')) return 'proteção';
  if (t.includes('verdade') || t.includes('mentira') || t.includes('justiça') || t.includes('justica')) return 'justiça';

  return 'geral';
}

function selecionarGuardia(nome: string, nascimento: string, pergunta: string) {
  const tema = detectarTema(pergunta);
  const t = normalizar(pergunta);

  const guardiasComPontuacao = GUARDIAS.map((guardia) => {
    let pontos = 0;

    const apareceQuando = guardia.apareceQuando || [];

    for (const chave of apareceQuando) {
      if (t.includes(normalizar(chave))) {
        pontos += 3;
      }
    }

    if (tema === 'amor' && normalizar(guardia.campo).includes('amor')) pontos += 2;
    if (tema === 'prosperidade' && normalizar(guardia.campo).includes('prosperidade')) pontos += 2;
    if (tema === 'proteção' && normalizar(guardia.campo).includes('protecao')) pontos += 2;
    if (tema === 'justiça' && normalizar(guardia.campo).includes('justica')) pontos += 2;
    if (tema === 'espiritualidade' && normalizar(guardia.campo).includes('espiritual')) pontos += 2;

    return {
      guardia,
      pontos
    };
  });

  const melhores = guardiasComPontuacao
    .filter((item) => item.pontos > 0)
    .sort((a, b) => b.pontos - a.pontos);

  if (melhores.length > 0) {
    return melhores[0].guardia;
  }

  const base =
    somaTexto(limparNome(nome)) +
    somaTexto(nascimento) +
    somaTexto(normalizar(pergunta));

  return GUARDIAS[base % GUARDIAS.length];
}

export function buildPomboGiraGuardiaSuprema(input: PomboGiraGuardiaInput) {
  const nome = input.fullName || '';
  const nascimento = input.birthDate || '';
  const pergunta = input.question || '';

  const tema = detectarTema(pergunta);
  const guardia = selecionarGuardia(nome, nascimento, pergunta);

  const resumoParaMariaPadilha = `
POMBO GIRA GUARDIÃ SUPREMA

Tema detectado: ${tema}

Presença espiritual auxiliar:
${guardia.nome}

Campo de atuação:
${guardia.campo}

Luz:
${guardia.luz}

Sombra:
${guardia.sombra}

Conselho:
${guardia.conselho}

ORIENTAÇÃO PARA A VOZ DE MARIA PADILHA:
Maria Padilha continua sendo a voz principal e absoluta da consulta.

Esta presença faz parte da corte espiritual da Rainha.
Ela pode ser citada naturalmente na resposta, como presença que acompanha, protege, alerta ou confirma a leitura.

Maria Padilha pode dizer frases como:
- "Vejo ${guardia.nome} caminhando perto desse caminho."
- "${guardia.nome} aparece como força de proteção nesta gira."
- "Essa presença confirma o que estou vendo."
- "${guardia.nome} mostra um ponto importante nesta consulta."

A presença auxiliar nunca responde no lugar de Maria Padilha.
A presença auxiliar nunca toma a frente.
A presença auxiliar nunca dá ordem direta ao consulente.
Maria Padilha continua conduzindo tudo.

Não diga que sorteou.
Não diga que calculou.
Não diga que foi escolhido por sistema.
Não transforme isso em relatório.

Use essa presença para enriquecer a consulta com:
- proteção;
- alerta;
- força;
- direção;
- confirmação espiritual;
- encanto da corte das Pombo Giras.

Fale com firmeza, respeito, autoridade e linguagem popular.
`.trim();

  return {
    entrada: {
      fullName: nome,
      birthDate: nascimento,
      question: pergunta
    },

    tema,

    guardia,

    resumoParaMariaPadilha
  };
}

export default buildPomboGiraGuardiaSuprema;