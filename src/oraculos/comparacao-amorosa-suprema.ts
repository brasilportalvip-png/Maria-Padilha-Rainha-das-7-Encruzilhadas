function normalizar(texto: string) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function reduzirNumero(n: number): number {
  n = Math.abs(Number(n) || 0);

  while (n > 9 && ![11, 22, 33].includes(n)) {
    n = String(n).split('').reduce((a, b) => a + Number(b), 0);
  }

  return n;
}

function limparNome(nome: string) {
  return String(nome || '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z]/g, '');
}

function numeroNome(nome: string) {
  const mapa: Record<string, number> = {
    A: 1, J: 1, S: 1,
    B: 2, K: 2, T: 2,
    C: 3, L: 3, U: 3,
    D: 4, M: 4, V: 4,
    E: 5, N: 5, W: 5,
    F: 6, O: 6, X: 6,
    G: 7, P: 7, Y: 7,
    H: 8, Q: 8, Z: 8,
    I: 9, R: 9
  };

  let total = 0;

  for (const letra of limparNome(nome)) {
    total += mapa[letra] || 0;
  }

  return reduzirNumero(total);
}

function numeroData(data: string) {
  const nums = String(data || '').replace(/\D/g, '');

  if (!nums) return 0;

  const total = nums.split('').reduce((a, b) => a + Number(b), 0);

  return reduzirNumero(total);
}



function extrairData(texto: string) {
  const t = String(texto || '').toLowerCase();

  // 24/02/1985
  // 24-02-1985
  // 24 02 1985
  let match = t.match(/\b(\d{1,2})[\/\-\s](\d{1,2})[\/\-\s](\d{2,4})\b/);

  if (match) {
    return `${match[1]}/${match[2]}/${match[3]}`;
  }

  // 24 fevereiro de 1985
  // 24 fevereiro 1985
  // 24 fev 1985

  const meses: Record<string, string> = {
    janeiro: '01',
    jan: '01',
    fevereiro: '02',
    fev: '02',
    março: '03',
    marco: '03',
    mar: '03',
    abril: '04',
    abr: '04',
    maio: '05',
    junho: '06',
    jun: '06',
    julho: '07',
    jul: '07',
    agosto: '08',
    ago: '08',
    setembro: '09',
    set: '09',
    outubro: '10',
    out: '10',
    novembro: '11',
    nov: '11',
    dezembro: '12',
    dez: '12'
  };

  match = t.match(
    /\b(\d{1,2})\s+([a-zçãéô]+)(?:\s+de)?\s+(\d{4})\b/
  );

  if (match) {
    const mes = meses[match[2]];

    if (mes) {
      return `${match[1]}/${mes}/${match[3]}`;
    }
  }

  return '';
}




function limparNomeCapturado(nome: string) {
  return String(nome || '')
    .replace(
      /\b(tem|sente|me|por|mim|amor|ama|gosta|pensa|volta|vai|ainda|existe|sera|será|comigo|saudade|futuro|reconciliacao|reconciliação|trai|trair|traiu|de|do|da|dos|das)\b.*$/i,
      ''
    )
    .trim();
}

function extrairNomeDepoisDe(texto: string) {
  const textoOriginal = String(texto || '');

  const padroes = [
    /\bnome\s+(?:dele|dela|da pessoa)?\s*(?:é|e)?\s*([A-Za-zÀ-ÿ]{2,}(?:\s+[A-Za-zÀ-ÿ]{2,})*)/i,
    /\bsobre\s+([A-Za-zÀ-ÿ]{2,}(?:\s+[A-Za-zÀ-ÿ]{2,})*)/i,
    /\bcom\s+([A-Za-zÀ-ÿ]{2,}(?:\s+[A-Za-zÀ-ÿ]{2,})*)/i,
    /\bde\s+([A-Za-zÀ-ÿ]{2,}(?:\s+[A-Za-zÀ-ÿ]{2,})*)/i
  ];

  for (const p of padroes) {
    const match = textoOriginal.match(p);

    if (match?.[1]) {
      const nome = limparNomeCapturado(match[1]);

      if (nome.length >= 2) {
        return nome;
      }
    }
  }

  const inicioComNome = textoOriginal.match(
    /^([A-Za-zÀ-ÿ]{2,}(?:\s+[A-Za-zÀ-ÿ]{2,})*)\s+(?:me\s+ama|gosta\s+de\s+mim|tem\s+amor\s+por\s+mim|sente\s+amor\s+por\s+mim|sente\s+algo\s+por\s+mim|pensa\s+em\s+mim|vai\s+voltar|volta|tem\s+saudade|sente\s+saudade|quer\s+ficar\s+comigo|quer\s+voltar|me\s+procura|vai\s+me\s+procurar|existe\s+futuro|tem\s+futuro)/i
  );

  if (inicioComNome?.[1]) {
    return limparNomeCapturado(inicioComNome[1]);
  }

  return '';
}

export function detectarPerguntaSobreOutraPessoa(texto: string) {
  const t = normalizar(texto);

  const possuiNomeDepoisDeComandos =
    /\b(?:sobre|com|de)\s+[a-zà-ÿ]{2,}(?:\s+[a-zà-ÿ]{2,})*/i.test(texto);

  const nomeNoInicioComPergunta =
    /^[a-zà-ÿ]{2,}(?:\s+[a-zà-ÿ]{2,})*\s+(?:me ama|gosta de mim|tem amor por mim|sente amor por mim|sente algo por mim|pensa em mim|vai voltar|volta|tem saudade|sente saudade|quer ficar comigo|quer voltar|me procura|vai me procurar|existe futuro|tem futuro)/i.test(t);

  const pronomesOuRelacao = [
    'ele',
    'ela',
    'ex',
    'dele',
    'dela',
    'meu marido',
    'minha esposa',
    'meu namorado',
    'minha namorada',
    'meu ficante',
    'minha ficante',
    'essa pessoa',
    'terceira pessoa',
    'rival',
    'amante'
  ];

  const sinaisAmorosos = [
    'me ama',
    'gosta de mim',
    'tem amor por mim',
    'sente amor por mim',
    'sente algo por mim',
    'pensa em mim',
    'tem saudade',
    'sente saudade',
    'ainda me ama',
    'ainda gosta de mim',
    'quer ficar comigo',
    'quer voltar',
    'vai voltar',
    'volta pra mim',
    'me procura',
    'vai me procurar',
    'existe futuro',
    'tem futuro',
    'vai dar certo',
    'tem sentimento',
    'sentimento por mim',
    'tem atracao',
    'tem atração',
    'existe amor',
    'existe ligacao',
    'existe ligação',
    'reconciliacao',
    'reconciliação',
    'trai',
    'traicao',
    'traição',
    'ciume',
    'ciúme',
    'afastamento',
    'separacao',
    'separação'
  ];

  const possuiPronomeOuRelacao = pronomesOuRelacao.some((s) => {
    const termo = normalizar(s);

    if (termo.length <= 4) {
      return new RegExp(`\\b${termo}\\b`, 'i').test(t);
    }

    return t.includes(termo);
  });

  const possuiSinalAmoroso = sinaisAmorosos.some((s) =>
    t.includes(normalizar(s))
  );

  return (
    possuiNomeDepoisDeComandos ||
    nomeNoInicioComPergunta ||
    (possuiPronomeOuRelacao && possuiSinalAmoroso) ||
    (possuiNomeDepoisDeComandos && possuiSinalAmoroso)
  );
}



export function analisarDadosOutraPessoa(texto: string) {
  const nascimento = extrairData(texto);

  let nome = extrairNomeDepoisDe(texto);

  if (!nome && nascimento) {
    nome = String(texto || '')
      .replace(nascimento, '')
      .replace(/\b\d{1,2}[\/\-\s]\d{1,2}[\/\-\s]\d{2,4}\b/, '')
      .trim();
  }

  return {
    nomeOutraPessoa: nome,
    nascimentoOutraPessoa: nascimento,
    temNomeOutraPessoa: !!nome,
    temNascimentoOutraPessoa: !!nascimento,
    dadosCompletos: !!nome && !!nascimento
  };
}



export function devePedirDadosOutraPessoa(texto: string) {
  const perguntaSobreOutraPessoa = detectarPerguntaSobreOutraPessoa(texto);
  const dados = analisarDadosOutraPessoa(texto);

  return {
    devePedir:
      perguntaSobreOutraPessoa &&
      (!dados.temNomeOutraPessoa || !dados.temNascimentoOutraPessoa),
    perguntaSobreOutraPessoa,
    ...dados
  };
}



export function mensagemPedirDadosOutraPessoa() {
  return `🌹 Vou correr a gira desta pessoa para você.

Me envie os dados exatamente neste formato:

Exemplo:

Nome: Ana Campos Alves (obrigatório)
Data de nascimento: 28/10/1992 (obrigatório)
Horário de nascimento: 14:30 (opcional)

Vou correr a gira e te informar sobre:

• amor;
• sentimentos;
• saudade;
• orgulho;
• atração;
• compatibilidade;
• afastamento;
• possibilidade de aproximação;
• tendências do relacionamento.`;
}




function interpretarIndice(valor: number) {
  if (valor >= 8 || [11, 22, 33].includes(valor)) return 'alto';
  if (valor >= 5) return 'médio';
  return 'baixo';
}

export function gerarComparacaoAmorosaSuprema(params: {
  nomeConsulente: string;
  nascimentoConsulente: string;
  nomeOutraPessoa: string;
  nascimentoOutraPessoa: string;
  pergunta: string;
}) {
  const n1 = numeroNome(params.nomeConsulente);
  const n2 = numeroNome(params.nomeOutraPessoa);

  const d1 = numeroData(params.nascimentoConsulente);
  const d2 = numeroData(params.nascimentoOutraPessoa);

  const compatibilidade = reduzirNumero(n1 + n2 + d1 + d2);
  const atracao = reduzirNumero(Math.abs(n1 - n2) + d1 + d2);
  const conflito = reduzirNumero(Math.abs(d1 - d2) + Math.abs(n1 - n2));
  const retorno = reduzirNumero(Math.abs(compatibilidade + atracao - conflito));
  const destino = reduzirNumero(n1 + d2);
  const emocaoOculta = reduzirNumero(n2 + d1);
  const futuro = reduzirNumero(compatibilidade + retorno + destino);
  const orgulho = reduzirNumero(conflito + n2);
  const comunicacao = reduzirNumero(n1 + n2);
  const estabilidade = reduzirNumero(d1 + d2 + destino);

  const nivelCompatibilidade = interpretarIndice(compatibilidade);
  const nivelAtracao = interpretarIndice(atracao);
  const nivelConflito = interpretarIndice(conflito);
  const nivelRetorno = interpretarIndice(retorno);
  const nivelFuturo = interpretarIndice(futuro);
  const nivelOrgulho = interpretarIndice(orgulho);
  const nivelComunicacao = interpretarIndice(comunicacao);
  const nivelEstabilidade = interpretarIndice(estabilidade);

  return `
COMPARAÇÃO AMOROSA SUPREMA OCULTA

PERGUNTA:
${params.pergunta}

CONSULENTE:
Nome: ${params.nomeConsulente}
Nascimento: ${params.nascimentoConsulente}

OUTRA PESSOA:
Nome: ${params.nomeOutraPessoa}
Nascimento: ${params.nascimentoOutraPessoa}

LEITURA NUMÉRICA OCULTA:
Número do consulente: ${n1}
Número da outra pessoa: ${n2}
Caminho do consulente: ${d1}
Caminho da outra pessoa: ${d2}

ÍNDICES OCULTOS DO CASAL:
Compatibilidade: ${compatibilidade} — nível ${nivelCompatibilidade}
Atração: ${atracao} — nível ${nivelAtracao}
Conflito: ${conflito} — nível ${nivelConflito}
Tendência de retorno/movimento: ${retorno} — nível ${nivelRetorno}
Laço de destino: ${destino}
Emoção oculta da outra pessoa: ${emocaoOculta}
Futuro provável: ${futuro} — nível ${nivelFuturo}
Orgulho/bloqueio emocional: ${orgulho} — nível ${nivelOrgulho}
Comunicação entre os dois: ${comunicacao} — nível ${nivelComunicacao}
Estabilidade possível: ${estabilidade} — nível ${nivelEstabilidade}

TENDÊNCIAS PARA USO INTERNO:
- Compatibilidade ${nivelCompatibilidade}: use como medida de encaixe emocional e espiritual.
- Atração ${nivelAtracao}: use como medida de desejo, magnetismo e curiosidade.
- Conflito ${nivelConflito}: use como orgulho, silêncio, briga, medo ou trava.
- Retorno/movimento ${nivelRetorno}: use como chance de aproximação, procura ou conversa.
- Futuro ${nivelFuturo}: use como tendência de continuidade ou esfriamento.
- Orgulho ${nivelOrgulho}: use para avaliar bloqueios e resistência.
- Comunicação ${nivelComunicacao}: use para avaliar conversa, mensagem e clareza.
- Estabilidade ${nivelEstabilidade}: use para avaliar se há base para algo mais firme.

COMO USAR NA RESPOSTA:
- Nunca mostre esses números diretamente, a menos que o consulente peça.
- Use como bastidor espiritual.
- Responda por tendência, nunca por certeza absoluta.
- Analise amor, desejo, saudade, orgulho, silêncio, medo, atração, conflito, rivalidade, retorno, estabilidade e chance de movimento.
- Se a atração for alta e o conflito alto, diga que existe magnetismo, mas também bloqueio.
- Se compatibilidade e estabilidade forem baixas, oriente com cautela e dignidade.
- Se retorno for médio ou alto, fale em tendência de movimento, nunca promessa.
- Se orgulho for alto, destaque que o silêncio pode ser mais orgulho do que falta total de sentimento.
- Não diga que calculou.
- Não diga que é sistema.
- Não prometa volta.
- Não afirme sentimento de terceiro como certeza fechada.
- Maria Padilha deve falar com firmeza, domínio e responsabilidade.
`;
}