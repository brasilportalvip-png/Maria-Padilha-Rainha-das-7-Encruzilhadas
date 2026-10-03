import { parseAndValidateDate } from '../utils/dateNormalizer.js';
import { calculateAstrology } from './astrologyEngine.js';

export interface AstrologiaInput {
  fullName: string;
  birthDate: string;
  birthTime?: string | null;
  question?: string;
}

function normalizar(texto: string): string {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function detectarTema(pergunta: string): string {
  const t = normalizar(pergunta);
  if (t.includes('sociedade') || t.includes('socio') || t.includes('empresa') || t.includes('negocio') || t.includes('contrato')) return 'sociedade';
  if (t.includes('trabalho') || t.includes('emprego') || t.includes('carreira') || t.includes('salario') || t.includes('chefe')) return 'carreira';
  if (t.includes('familia') || t.includes('mae') || t.includes('pai') || t.includes('irmao') || t.includes('filho')) return 'família';
  if (t.includes('dinheiro') || t.includes('financeiro') || t.includes('divida') || t.includes('prosperidade')) return 'prosperidade';
  if (t.includes('amor') || t.includes('namoro') || t.includes('casamento') || t.includes('paixao') || t.includes('reconciliacao')) return 'amor';
  if (t.includes('espiritual') || t.includes('guia') || t.includes('entidade') || t.includes('pombo gira')) return 'espiritualidade';

  return 'geral';
}

export function buildAstrologiaSuprema(input: AstrologiaInput) {
  const { isoDate } = parseAndValidateDate(input.birthDate);
  const astro = calculateAstrology(isoDate, input.birthTime || undefined);
  const tema = detectarTema(input.question || '');

  const resumoParaMariaPadilha = `
ASTROLOGIA CANÔNICA DE ORIENTAÇÃO ESPIRITUAL

Signo Solar: ${astro.sunSign}
Elemento: ${astro.element}
Modo: ${astro.modality}
Vibração da Lua Natal: ${astro.lunarPhase} (${astro.lunarPhaseDescription})
Hora Planetária Natal: ${astro.planetaryHourRuler ? astro.planetaryHourRuler : 'Não informada (hora de nascimento não informada)'}
Tema Detectado da Consulta: ${tema}

DIRETRIZ PARA A VOZ DE MARIA PADILHA:
- Use a astrologia sagrada como bastidor sutil da leitura.
- Não fale como relatório técnico frio ou lista mecânica.
- Não invente ascendente ou casas astrológicas por ausência de dados locais.
- Fale com verdade sagrada, acolhimento e a autoridade majestosa de Maria Padilha.
`.trim();

  return {
    entrada: {
      fullName: input.fullName || '',
      birthDate: isoDate,
      birthTime: input.birthTime || null,
      question: input.question || '',
    },
    astrologia: {
      signoSolar: astro.sunSign,
      elementoDominante: astro.element,
      modalidade: astro.modality,
      planetaRegente: astro.planetaryHourRuler,
      faseLunarNatal: astro.lunarPhase,
      conselhoCosmico: astro.cosmicAdvice,
    },
    tema,
    resumoParaMariaPadilha,
  };
}

export default buildAstrologiaSuprema;
