export interface TemporalContext {
  referenceIso: string;
  userTimezone: string;
  userFormattedDate: string;
  userFormattedTime: string;
  userDayOfWeek: string;
  periodOfDay: 'manha' | 'tarde' | 'noite' | 'madrugada';
  greeting: string;
  temporalExpressions: {
    hoje: string;
    amanha: string;
    ontem: string;
    inicioSemana: string;
    fimSemana: string;
  };
}

export function getTemporalContext(
  timezone: string = 'America/Sao_Paulo',
  referenceDate: Date = new Date()
): TemporalContext {
  // Safe timezone check
  let validTimezone = timezone;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
  } catch {
    validTimezone = 'America/Sao_Paulo';
  }

  // Get local date components in the specified timezone
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: validTimezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'long',
    hour12: false,
  });

  const parts = formatter.formatToParts(referenceDate);
  const findPart = (type: string) => parts.find((p) => p.type === type)?.value || '';

  const day = findPart('day');
  const month = findPart('month');
  const year = findPart('year');
  const hour = parseInt(findPart('hour') || '12', 10);
  const minute = findPart('minute');
  const weekday = findPart('weekday');

  const userFormattedDate = `${day}/${month}/${year}`;
  const userFormattedTime = `${hour.toString().padStart(2, '0')}:${minute}`;

  // Greeting and period of day
  let periodOfDay: TemporalContext['periodOfDay'];
  let greeting: string;

  if (hour >= 5 && hour < 12) {
    periodOfDay = 'manha';
    greeting = 'Bom dia';
  } else if (hour >= 12 && hour < 18) {
    periodOfDay = 'tarde';
    greeting = 'Boa tarde';
  } else if (hour >= 18 && hour <= 23) {
    periodOfDay = 'noite';
    greeting = 'Boa noite';
  } else {
    periodOfDay = 'madrugada';
    greeting = 'Boa noite';
  }

  // Calculate relative dates (hoje, amanha, ontem) in local days
  const nowMs = referenceDate.getTime();
  const dayMs = 24 * 60 * 60 * 1000;

  const formatDateOffset = (offsetDays: number) => {
    const target = new Date(nowMs + offsetDays * dayMs);
    const subParts = formatter.formatToParts(target);
    const d = subParts.find((p) => p.type === 'day')?.value || '';
    const m = subParts.find((p) => p.type === 'month')?.value || '';
    const y = subParts.find((p) => p.type === 'year')?.value || '';
    return `${d}/${m}/${y}`;
  };

  return {
    referenceIso: referenceDate.toISOString(),
    userTimezone: validTimezone,
    userFormattedDate,
    userFormattedTime,
    userDayOfWeek: weekday,
    periodOfDay,
    greeting,
    temporalExpressions: {
      hoje: userFormattedDate,
      amanha: formatDateOffset(1),
      ontem: formatDateOffset(-1),
      inicioSemana: formatDateOffset(-((referenceDate.getDay() + 6) % 7)),
      fimSemana: formatDateOffset(6 - ((referenceDate.getDay() + 6) % 7)),
    },
  };
}

export function resolveTemporalReferenceInText(
  text: string,
  context: TemporalContext
): { resolvedTerm?: string; resolvedDate?: string; explanation: string } {
  const lower = text.toLowerCase();

  if (lower.includes('amanhã') || lower.includes('amanha')) {
    return {
      resolvedTerm: 'amanhã',
      resolvedDate: context.temporalExpressions.amanha,
      explanation: `Amanhã refere-se a ${context.temporalExpressions.amanha}`,
    };
  }

  if (lower.includes('hoje') || lower.includes('esta noite') || lower.includes('essa noite')) {
    return {
      resolvedTerm: 'hoje',
      resolvedDate: context.temporalExpressions.hoje,
      explanation: `Hoje refere-se a ${context.temporalExpressions.hoje}`,
    };
  }

  if (lower.includes('ontem')) {
    return {
      resolvedTerm: 'ontem',
      resolvedDate: context.temporalExpressions.ontem,
      explanation: `Ontem refere-se a ${context.temporalExpressions.ontem}`,
    };
  }

  if (lower.includes('próxima semana') || lower.includes('proxima semana') || lower.includes('semana que vem')) {
    return {
      resolvedTerm: 'próxima semana',
      explanation: `Período seguinte a ${context.userFormattedDate}`,
    };
  }

  if (lower.includes('próximo mês') || lower.includes('proximo mes') || lower.includes('mês que vem')) {
    return {
      resolvedTerm: 'próximo mês',
      explanation: `Mês seguinte ao atual (${context.userFormattedDate})`,
    };
  }

  return {
    explanation: `Data de referência atual: ${context.userFormattedDate} (${context.userDayOfWeek})`,
  };
}
