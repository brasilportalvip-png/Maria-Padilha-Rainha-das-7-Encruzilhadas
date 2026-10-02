export interface IntencaoUniversal {
  categoria: string;
  subtipo: string;
  intensidade: 'baixa' | 'media' | 'alta';
  precisaDadosOutraPessoa: boolean;
  envolveOutraPessoa: boolean;
  outraPessoa: boolean;
  amorGeral: boolean;
  trabalho: boolean;
  dinheiro: boolean;
  espiritual: boolean;
  familia: boolean;
  emocional: boolean;
  temas: string[];
  emocoes: string[];
  sinais: string[];
  orientacaoResposta: string;
}

export function normalizarTextoIntencao(texto: string): string {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function contem(t: string, lista: string[]): boolean {
  return lista.some((p) => t.includes(normalizarTextoIntencao(p)));
}

function encontrar(t: string, lista: string[]): string[] {
  return lista.filter((p) => t.includes(normalizarTextoIntencao(p)));
}

export function classificarIntencaoUniversal(texto: string): IntencaoUniversal {
  const t = normalizarTextoIntencao(texto);

  const amorGeral = contem(t, [
    'minha vida amorosa',
    'vida amorosa',
    'sorte no amor',
    'amor para mim',
    'caminhos no amor',
    'campo amoroso',
    'futuro amoroso',
    'vou encontrar alguem',
    'vou encontrar um amor',
    'meu amor vai chegar',
    'quando vou amar',
    'quando vou ser amada',
    'quando vou ser amado',
    'amor esta aberto',
    'amor está aberto'
  ]);

  const sinaisOutraPessoa = contem(t, [
    'ele',
    'ela',
    'meu ex',
    'minha ex',
    'meu namorado',
    'minha namorada',
    'meu marido',
    'minha esposa',
    'meu ficante',
    'minha ficante',
    'essa pessoa',
    'a pessoa',
    'fulano',
    'fulana'
  ]);

  const intencaoOutraPessoa = contem(t, [
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
    'esta com outro',
    'me trai',
    'me traiu',
    'vai dar certo',
    'tem futuro',
    'devo esperar',
    'devo insistir',
    'quer ficar comigo',
    'quer compromisso',
    'sumiu de mim',
    'se afastou',
    'ainda lembra de mim',
    'me esqueceu',
    'sente saudade'
  ]);

  const nomeComLigacao =
    /\b(com|de|da|do|sobre|entre eu e|eu e)\s+[a-z]{2,}/i.test(t);

  const envolveOutraPessoa =
    !amorGeral && (sinaisOutraPessoa || intencaoOutraPessoa || nomeComLigacao);

  const reconciliacao = contem(t, [
    'volta',
    'vai voltar',
    'retorno',
    'reconciliacao',
    'reconciliar',
    'reatar',
    'segunda chance',
    'voltar comigo'
  ]);

  const traicao = contem(t, [
    'traicao',
    'traiu',
    'me trai',
    'tem outra',
    'tem outro',
    'esta com outra',
    'esta com outro',
    'mentira',
    'esconde algo'
  ]);

  const trabalho = contem(t, [
    'trabalho',
    'emprego',
    'carreira',
    'profissao',
    'empresa',
    'negocio',
    'servico',
    'cliente',
    'vender',
    'vendas',
    'projeto'
  ]);

  const dinheiro = contem(t, [
    'dinheiro',
    'prosperidade',
    'financeiro',
    'divida',
    'riqueza',
    'abundancia',
    'lucro',
    'ganhar dinheiro',
    'faturamento',
    'renda'
  ]);

  const espiritual = contem(t, [
    'energia',
    'demanda',
    'inveja',
    'protecao',
    'macumba',
    'olho gordo',
    'caminho fechado',
    'descarrego',
    'encosto',
    'espiritual',
    'carregado',
    'peso espiritual'
  ]);

  const familia = contem(t, [
    'familia',
    'filho',
    'filha',
    'mae',
    'pai',
    'irmao',
    'irma',
    'casa',
    'lar'
  ]);

  const emocional = contem(t, [
    'triste',
    'ansiedade',
    'medo',
    'dor',
    'sofrendo',
    'cansado',
    'cansada',
    'perdido',
    'perdida',
    'angustia',
    'choro',
    'desespero'
  ]);

  const destino = contem(t, [
    'destino',
    'caminho',
    'caminhos',
    'futuro',
    'rumo',
    'direcao',
    'o que vem',
    'o que me espera'
  ]);

  const temas: string[] = [];
  const emocoes: string[] = [];
  const sinais: string[] = [];

  if (amorGeral) temas.push('vida amorosa geral');
  if (envolveOutraPessoa) temas.push('outra pessoa');
  if (reconciliacao) temas.push('reconciliação ou retorno');
  if (traicao) temas.push('traição ou desconfiança');
  if (trabalho) temas.push('trabalho e carreira');
  if (dinheiro) temas.push('dinheiro e prosperidade');
  if (espiritual) temas.push('proteção espiritual');
  if (familia) temas.push('família');
  if (emocional) temas.push('dor emocional');
  if (destino) temas.push('destino e caminhos');

  emocoes.push(...encontrar(t, [
    'saudade',
    'medo',
    'dor',
    'ciume',
    'raiva',
    'ansiedade',
    'desespero',
    'tristeza',
    'angustia',
    'inseguranca',
    'carencia'
  ]));

  sinais.push(...encontrar(t, [
    'sumiu',
    'se afastou',
    'silencio',
    'bloqueou',
    'nao responde',
    'mudou comigo',
    'frio',
    'distante',
    'confuso',
    'confusa',
    'travado',
    'fechado',
    'parado'
  ]));

  let categoria = 'geral';
  let subtipo = 'pergunta_comum';
  let orientacaoResposta =
    'Responda como leitura geral, identificando o caminho principal, o alerta e o conselho.';

  if (envolveOutraPessoa && reconciliacao) {
    categoria = 'amor';
    subtipo = 'reconciliacao';
    orientacaoResposta =
      'Leia desejo, saudade, orgulho, silêncio, chance de movimento e risco de ilusão. Peça dados da outra pessoa se ainda não houver.';
  } else if (envolveOutraPessoa && traicao) {
    categoria = 'amor';
    subtipo = 'traicao_desconfianca';
    orientacaoResposta =
      'Leia sinais de ocultação, comportamento, risco, insegurança e verdade emocional, sem afirmar traição como certeza absoluta.';
  } else if (envolveOutraPessoa) {
    categoria = 'amor';
    subtipo = 'outra_pessoa';
    orientacaoResposta =
      'Antes de responder profundamente, confirme dados da outra pessoa se ainda não foram informados.';
  } else if (amorGeral) {
    categoria = 'amor';
    subtipo = 'vida_amorosa_geral';
    orientacaoResposta =
      'Responda sobre o campo amoroso geral do consulente, sem pedir nome de outra pessoa.';
  } else if (dinheiro) {
    categoria = 'prosperidade';
    subtipo = 'dinheiro';
    orientacaoResposta =
      'Leia bloqueios, oportunidades, postura financeira e caminhos de prosperidade.';
  } else if (trabalho) {
    categoria = 'trabalho';
    subtipo = 'carreira';
    orientacaoResposta =
      'Leia caminhos profissionais, esforço, oportunidade, estratégia e movimento.';
  } else if (espiritual) {
    categoria = 'espiritualidade';
    subtipo = 'protecao_energia';
    orientacaoResposta =
      'Leia proteção, energia, caminhos fechados, inveja ou peso espiritual sem fazer terrorismo.';
  } else if (familia) {
    categoria = 'familia';
    subtipo = 'familia';
    orientacaoResposta =
      'Leia relações familiares, limites, proteção e equilíbrio emocional.';
  } else if (emocional) {
    categoria = 'emocional';
    subtipo = 'dor_emocional';
    orientacaoResposta =
      'Acolha a dor, leia o caminho emocional e dê conselho firme sem substituir ajuda profissional.';
  } else if (destino) {
    categoria = 'destino';
    subtipo = 'caminhos';
    orientacaoResposta =
      'Leia tendências, escolhas, caminhos abertos ou travados e próximos passos.';
  }

  const intensidade =
    emocional ||
    emocoes.length >= 2 ||
    sinais.length >= 2 ||
    contem(t, ['urgente', 'desespero', 'nao aguento', 'preciso saber'])
      ? 'alta'
      : temas.length >= 2
        ? 'media'
        : 'baixa';

  return {
    categoria,
    subtipo,
    intensidade,
    precisaDadosOutraPessoa:
      subtipo === 'outra_pessoa' ||
      subtipo === 'reconciliacao' ||
      subtipo === 'traicao_desconfianca',
    envolveOutraPessoa,
    outraPessoa: envolveOutraPessoa,
    amorGeral,
    trabalho,
    dinheiro,
    espiritual,
    familia,
    emocional,
    temas,
    emocoes,
    sinais,
    orientacaoResposta
  };
}

export default classificarIntencaoUniversal;