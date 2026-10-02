export interface GuardianAngel {
  number: number;
  name: string;
  choir: string;
  archangel: string;
  period: string;
  virtue: string;
}

export interface CabalaResult {
  methodVersion: string;
  sephirahNumber: number;
  sephirahName: string;
  divineAttribute: string;
  rulingArchangel: string;
  guardianAngel: GuardianAngel;
  angelicChoir: string;
  spiritualGuidance: string;
}

const SEPHIROTH = [
  { number: 1, name: 'Kether (Coroa)', attribute: 'Vontade Divina e Propósito Primordial', archangel: 'Metatron', choir: 'Serafins' },
  { number: 2, name: 'Chokmah (Sabedoria)', attribute: 'Intuição Pura e Sabedoria Criativa', archangel: 'Raziel', choir: 'Querubins' },
  { number: 3, name: 'Binah (Entendimento)', attribute: 'Discernimento, Estrutura e Compreensão Profunda', archangel: 'Tzaphkiel', choir: 'Tronos' },
  { number: 4, name: 'Chesed (Misericórdia)', attribute: 'Generosidade, Expansão e Amor Incondicional', archangel: 'Tzadkiel', choir: 'Dominações' },
  { number: 5, name: 'Geburah (Fortaleza)', attribute: 'Coragem, Firmeza, Disciplina e Proteção', archangel: 'Kamael', choir: 'Potências' },
  { number: 6, name: 'Tiphareth (Beleza)', attribute: 'Harmonia, Equilíbrio do Coração e Conexão Superior', archangel: 'Raphael', choir: 'Virtudes' },
  { number: 7, name: 'Netzach (Vitória)', attribute: 'Perseverança, Paixão e Superação das Provações', archangel: 'Haniel', choir: 'Principados' },
  { number: 8, name: 'Hod (Glória)', attribute: 'Comunicação Clara, Verdade e Intelecto Espiritual', archangel: 'Michael', choir: 'Arcanjos' },
  { number: 9, name: 'Yesod (Fundamento)', attribute: 'Sensibilidade Astral, Imaginação e Alicerce', archangel: 'Gabriel', choir: 'Anjos' },
  { number: 10, name: 'Malkuth (Reino)', attribute: 'Materialização, Realização Terrena e Força no Mundo', archangel: 'Sandalphon', choir: 'Ishim' },
];

// Sample of official 72 Kabbalistic Angels mapped across astrological solar calendar
const SAMPLE_ANGELS: GuardianAngel[] = [
  { number: 1, name: 'Vehuiah', choir: 'Serafins', archangel: 'Metatron', period: '21 a 25 de Março', virtue: 'Vontade transformadora e clareza espiritual' },
  { number: 2, name: 'Jeliel', choir: 'Serafins', archangel: 'Metatron', period: '26 a 30 de Março', virtue: 'Harmonia, fidelidade e paz interior' },
  { number: 3, name: 'Sitael', choir: 'Serafins', archangel: 'Metatron', period: '31 de Março a 04 de Abril', virtue: 'Nobreza, retidão e vitória sobre adversidades' },
  { number: 4, name: 'Elemiah', choir: 'Serafins', archangel: 'Metatron', period: '05 a 09 de Abril', virtue: 'Proteção nas viagens e alívio do espírito' },
  { number: 5, name: 'Mahasiah', choir: 'Serafins', archangel: 'Metatron', period: '10 a 14 de Abril', virtue: 'Paz, serenidade e ciência das leis universais' },
  { number: 6, name: 'Lelahel', choir: 'Serafins', archangel: 'Metatron', period: '15 a 20 de Abril', virtue: 'Luz curativa, arte e nobreza da alma' },
  { number: 7, name: 'Achaiah', choir: 'Serafins', archangel: 'Metatron', period: '21 a 25 de Abril', virtue: 'Paciência, segredos da natureza e perseverança' },
  { number: 8, name: 'Cahetel', choir: 'Serafins', archangel: 'Metatron', period: '26 a 30 de Abril', virtue: 'Bênçãos divinas, colheita fértil e gratidão' },
  { number: 9, name: 'Haziel', choir: 'Querubins', archangel: 'Raziel', period: '01 a 05 de Maio', virtue: 'Misericórdia divina e reconciliação' },
  { number: 10, name: 'Aladiah', choir: 'Querubins', archangel: 'Raziel', period: '06 a 10 de Maio', virtue: 'Cura das feridas da alma e regeneração moral' },
  { number: 11, name: 'Lauviah', choir: 'Querubins', archangel: 'Raziel', period: '11 a 15 de Maio', virtue: 'Vitória sobre o orgulho e sabedoria serena' },
  { number: 12, name: 'Hahaiah', choir: 'Querubins', archangel: 'Raziel', period: '16 a 20 de Maio', virtue: 'Refúgio espiritual, sonhos proféticos e amparo' },
  { number: 21, name: 'Nelchael', choir: 'Tronos', archangel: 'Tzaphkiel', period: '02 a 06 de Julho', virtue: 'Conhecimento da verdade e proteção contra ilusões' },
  { number: 27, name: 'Yerathel', choir: 'Dominações', archangel: 'Tzadkiel', period: '03 a 07 de Agosto', virtue: 'Propagação da luz e libertação de inimigos' },
  { number: 37, name: 'Aniel', choir: 'Potências', archangel: 'Kamael', period: '24 a 28 de Setembro', virtue: 'Coragem para vencer o círculo vicioso e vitória moral' },
  { number: 42, name: 'Mikael', choir: 'Virtudes', archangel: 'Raphael', period: '19 a 23 de Outubro', virtue: 'Ordem, segurança e fidelidade aos compromissos' },
  { number: 49, name: 'Vehuel', choir: 'Principados', archangel: 'Haniel', period: '23 a 27 de Novembro', virtue: 'Elevação da alma e amor generoso' },
  { number: 58, name: 'Yeyalel', choir: 'Arcanjos', archangel: 'Michael', period: '06 a 10 de Janeiro', virtue: 'Cura da tristeza e discernimento lúcido' },
  { number: 72, name: 'Mumiah', choir: 'Anjos', archangel: 'Gabriel', period: '16 a 20 de Março', virtue: 'Finalização bem-sucedida de ciclos e renascimento' },
];

export function calculateCabala(birthDateStr: string): CabalaResult {
  // Normalize and parse birthDate
  const cleanDate = (birthDateStr || '').replace(/\D/g, '');
  let day = 1;
  let month = 1;
  let year = 1990;

  if (cleanDate.length >= 8) {
    if (birthDateStr.includes('-')) {
      const parts = birthDateStr.split('-');
      year = parseInt(parts[0], 10) || 1990;
      month = parseInt(parts[1], 10) || 1;
      day = parseInt(parts[2], 10) || 1;
    } else {
      day = parseInt(cleanDate.substring(0, 2), 10) || 1;
      month = parseInt(cleanDate.substring(2, 4), 10) || 1;
      year = parseInt(cleanDate.substring(4, 8), 10) || 1990;
    }
  }

  // 1. Sephirah calculation (reduction of full birth date digits to 1..10)
  const digits = `${day}${month}${year}`.split('').map(Number);
  let sum = digits.reduce((acc, d) => acc + d, 0);
  while (sum > 10) {
    sum = String(sum).split('').map(Number).reduce((acc, d) => acc + d, 0);
  }
  const sephirahIndex = Math.max(1, Math.min(10, sum)) - 1;
  const sephirah = SEPHIROTH[sephirahIndex];

  // 2. Day of year to determine Guardian Angel index (1..72)
  const dayOfYear = (month - 1) * 30 + day;
  const angelNumber = ((dayOfYear % 72) || 72);
  const foundAngel = SAMPLE_ANGELS.find((a) => a.number === angelNumber) || {
    number: angelNumber,
    name: `Anjo Guardião Sagrado ${angelNumber}`,
    choir: sephirah.choir,
    archangel: sephirah.archangel,
    period: `Grau Solar ${angelNumber * 5}°`,
    virtue: `Proteção sagrada na esfera de ${sephirah.name}`,
  };

  const spiritualGuidance = `Pela sagrada Tradição da Árvore da Vida, a sua centelha vibra sob a esfera de ${sephirah.name}, regida pelo Arcanjo ${sephirah.archangel}. O seu Anjo Guardião (${foundAngel.name}, Coro dos ${foundAngel.choir}) confere a você o dom da ${foundAngel.virtue}. Para abrir caminhos, aja com a dignidade da sua esfera e não se desvie da sua retidão moral.`;

  return {
    methodVersion: 'Cabala-Hermetica-72-Anjos-v1',
    sephirahNumber: sephirah.number,
    sephirahName: sephirah.name,
    divineAttribute: sephirah.attribute,
    rulingArchangel: sephirah.archangel,
    guardianAngel: foundAngel,
    angelicChoir: foundAngel.choir,
    spiritualGuidance,
  };
}
