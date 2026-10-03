import type { IntentAnalysis, IntentCategory, Participant, ParticipantRole } from '../types/spiritual.js';
import { getTemporalContext, resolveTemporalReferenceInText } from './temporalEngine.js';

const BUSINESS_KEYWORDS = [
  'sociedade', 'sócio', 'socia', 'empresa', 'negócio', 'negocio', 'abrir empresa',
  'contrato', 'parceria', 'investimento', 'capital', 'lucro', 'vender', 'compra',
  'loja', 'comércio', 'projeto', 'faturamento'
];

const CAREER_KEYWORDS = [
  'emprego', 'trabalho', 'trabalhar', 'entrevista', 'currículo', 'curriculo',
  'vaga', 'promoção', 'promocao', 'concurso', 'chefe', 'demissão', 'demissao',
  'salário', 'salario', 'carreira', 'processo seletivo'
];

const FAMILY_KEYWORDS = [
  'irmão', 'irmao', 'irmã', 'irma', 'mãe', 'mae', 'pai', 'filho', 'filha',
  'sobrinho', 'sobrinha', 'primo', 'prima', 'tio', 'tia', 'avô', 'avo', 'família', 'familia'
];

const ROMANCE_KEYWORDS = [
  'amor', 'ama', 'gosta de mim', 'sente por mim', 'ex', 'namorado', 'namorada',
  'marido', 'esposa', 'casamento', 'ficante', 'paixão', 'paixao', 'traição',
  'traicao', 'trai', 'voltar', 'volta pra mim', 'reconciliação', 'reconciliacao',
  'ciúmes', 'ciumes', 'rival', 'amante', 'saudade dele', 'saudade dela',
  'alma gêmea', 'alma gemea', 'desejo sexual', 'química'
];

const DATE_REGEX = /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\b/;

export function extractParticipants(text: string): Participant[] {
  const participants: Participant[] = [];
  const lower = text.toLowerCase();

  // Check for family markers
  let familyRole: ParticipantRole | null = null;
  if (lower.includes('irmão') || lower.includes('irmao') || lower.includes('irmã') || lower.includes('irma')) {
    familyRole = 'familiar';
  } else if (lower.includes('mãe') || lower.includes('mae') || lower.includes('pai')) {
    familyRole = 'familiar';
  } else if (lower.includes('filho') || lower.includes('filha')) {
    familyRole = 'familiar';
  }

  // Check for business partner markers
  const isBusinessContext = BUSINESS_KEYWORDS.some((k) => lower.includes(k));
  const isRomanticContext = ROMANCE_KEYWORDS.some((k) => lower.includes(k));

  // Extract name patterns like "com Flavio Roberto Ortiz Costa", "sociedade com Carlos", "Maria vai", "João Rogério Braga"
  const namePatterns = [
    /(?:sociedade\s+com|parceria\s+com|com)\s+([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+(?:\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+)*)/g,
    /\b([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+(?:\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+)+)\b/g,
    /\b(Maria|João|Carlos|Flavio|Pedro|Ana|Lucas|Juliana|Marcos|Fernanda|Rodrigo|Camila)\b/gi,
  ];

  const extractedNames = new Set<string>();

  for (const regex of namePatterns) {
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      const candidate = match[1] || match[0];
      if (candidate && candidate.length > 2 && !['Estou', 'Tenho', 'Será', 'Sera', 'Vai', 'Como', 'Quando'].includes(candidate)) {
        extractedNames.add(candidate.trim());
      }
    }
  }

  // Extract date of birth associated with specific participant names
  extractedNames.forEach((name) => {
    let role: ParticipantRole = 'outro';

    if (familyRole) {
      role = 'familiar';
    } else if (isBusinessContext) {
      role = 'socio';
    } else if (isRomanticContext) {
      role = lower.includes('ex') ? 'ex' : 'parceiro_amoroso';
    } else if (lower.includes('chefe')) {
      role = 'chefe';
    } else if (lower.includes('amigo') || lower.includes('amiga')) {
      role = 'amigo';
    }

    // Check if there is a date immediately following this specific name (e.g. "João 10/02/1980" or "Carlos, 15/04/1975")
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const nameWithDateRegex = new RegExp(`${escapedName}[\\s,:-]+(?:nascid[oa]\\s+(?:em\\s+)?)?(\\d{1,2}[\\/\\-]\\d{1,2}[\\/\\-]\\d{2,4})`, 'i');
    const specificMatch = text.match(nameWithDateRegex);

    let participantBirthDate: string | undefined = undefined;
    if (specificMatch?.[1]) {
      participantBirthDate = specificMatch[1];
    } else if (extractedNames.size === 1) {
      // Single person mentioned: if there is exactly one date in the entire text, it belongs to them
      const singleDateMatch = text.match(DATE_REGEX);
      if (singleDateMatch) {
        participantBirthDate = singleDateMatch[0];
      }
    }

    participants.push({
      name,
      birthDate: participantBirthDate,
      role,
    });
  });

  return participants;
}

export function classifyIntent(
  question: string,
  userTimezone: string = 'America/Sao_Paulo'
): IntentAnalysis {
  const text = (question || '').trim();
  const lower = text.toLowerCase();
  const temporal = getTemporalContext(userTimezone);
  const temporalRef = resolveTemporalReferenceInText(text, temporal);
  const participants = extractParticipants(text);

  // 1. Check Business & Partnership
  const hasBusinessKeyword = BUSINESS_KEYWORDS.some((k) => lower.includes(k));
  if (hasBusinessKeyword) {
    return {
      primaryCategory: lower.includes('sociedade') ? 'sociedade' : 'negocios',
      isRomantic: false,
      isBusinessOrCareer: true,
      participants,
      resolvedTimeframe: temporalRef.resolvedTerm
        ? {
            rawTerm: temporalRef.resolvedTerm,
            resolvedDate: temporalRef.resolvedDate,
            description: temporalRef.explanation,
          }
        : undefined,
      summary: `Consulta de negócios/sociedade envolvendo ${participants.map((p) => p.name).join(', ') || 'o consulente'}.`,
    };
  }

  // 2. Check Career & Employment
  const hasCareerKeyword = CAREER_KEYWORDS.some((k) => lower.includes(k));
  if (hasCareerKeyword) {
    const isFamilyCareer = FAMILY_KEYWORDS.some((k) => lower.includes(k));
    return {
      primaryCategory: isFamilyCareer ? 'familia' : 'emprego',
      isRomantic: false,
      isBusinessOrCareer: true,
      participants,
      resolvedTimeframe: temporalRef.resolvedTerm
        ? {
            rawTerm: temporalRef.resolvedTerm,
            resolvedDate: temporalRef.resolvedDate,
            description: temporalRef.explanation,
          }
        : undefined,
      summary: isFamilyCareer
        ? `Consulta sobre trabalho/carreira no contexto familiar.`
        : `Consulta profissional/empregatícia do consulente ou pessoa mencionada.`,
    };
  }

  // 3. Check Family (non-romantic)
  const hasFamilyKeyword = FAMILY_KEYWORDS.some((k) => lower.includes(k));
  if (hasFamilyKeyword) {
    return {
      primaryCategory: 'familia',
      isRomantic: false,
      isBusinessOrCareer: false,
      participants,
      resolvedTimeframe: temporalRef.resolvedTerm
        ? {
            rawTerm: temporalRef.resolvedTerm,
            resolvedDate: temporalRef.resolvedDate,
            description: temporalRef.explanation,
          }
        : undefined,
      summary: `Consulta familiar sobre parentes e relacionamentos familiares.`,
    };
  }

  // 4. Check Romance & Relationship ONLY after strictly ruling out business/career/family
  const hasRomanceKeyword = ROMANCE_KEYWORDS.some((k) => lower.includes(k));
  if (hasRomanceKeyword) {
    let cat: IntentCategory = 'amor';
    if (lower.includes('reconcilia') || lower.includes('voltar') || lower.includes('volta')) {
      cat = 'reconciliacao';
    } else if (lower.includes('relacionamento') || lower.includes('casamento')) {
      cat = 'relacionamento';
    }

    return {
      primaryCategory: cat,
      isRomantic: true,
      isBusinessOrCareer: false,
      participants,
      resolvedTimeframe: temporalRef.resolvedTerm
        ? {
            rawTerm: temporalRef.resolvedTerm,
            resolvedDate: temporalRef.resolvedDate,
            description: temporalRef.explanation,
          }
        : undefined,
      summary: `Consulta de amor, sentimentos e caminhos afetivos.`,
    };
  }

  // 5. Spirituality, Protection, Decision, General
  let category: IntentCategory = 'decisao';
  if (lower.includes('proteção') || lower.includes('protecao') || lower.includes('inveja') || lower.includes('energia')) {
    category = 'protecao';
  } else if (lower.includes('espiritual') || lower.includes('guia') || lower.includes('orixá') || lower.includes('pombagira')) {
    category = 'espiritualidade';
  }

  return {
    primaryCategory: category,
    isRomantic: false,
    isBusinessOrCareer: false,
    participants,
    resolvedTimeframe: temporalRef.resolvedTerm
      ? {
          rawTerm: temporalRef.resolvedTerm,
          resolvedDate: temporalRef.resolvedDate,
          description: temporalRef.explanation,
        }
      : undefined,
    summary: `Consulta de orientação espiritual geral e tomada de decisão.`,
  };
}
