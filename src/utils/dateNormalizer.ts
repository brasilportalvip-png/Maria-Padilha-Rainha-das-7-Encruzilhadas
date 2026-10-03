/**
 * Canonical Date Normalizer - Reino de Maria Padilha
 * 
 * Regra: Aceita estritamente YYYY-MM-DD e DD/MM/AAAA.
 * Rejeita datas fictícias ou impossíveis (ex: 31/02).
 * NUNCA inventa ano 1990/2000, dia 1 ou mês 1 silenciosamente.
 */

export interface NormalizedDate {
  year: number;
  month: number; // 1 - 12
  day: number;   // 1 - 31
  isoDate: string; // Canonical format YYYY-MM-DD
}

export function parseAndValidateDate(dateStr: string | undefined | null): NormalizedDate {
  if (!dateStr || typeof dateStr !== 'string') {
    throw new Error('Data é obrigatória e deve ser uma sequência de texto válida.');
  }

  const trimmed = dateStr.trim();
  let year = 0;
  let month = 0;
  let day = 0;

  // 1. Format: YYYY-MM-DD (e.g. 1983-02-02)
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (isoMatch) {
    year = parseInt(isoMatch[1], 10);
    month = parseInt(isoMatch[2], 10);
    day = parseInt(isoMatch[3], 10);
  } else {
    // 2. Format: DD/MM/YYYY (e.g. 02/02/1983)
    const brMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
    if (brMatch) {
      day = parseInt(brMatch[1], 10);
      month = parseInt(brMatch[2], 10);
      year = parseInt(brMatch[3], 10);
    } else {
      throw new Error(`Formato de data inválido: "${dateStr}". Use o formato AAAA-MM-DD ou DD/MM/AAAA.`);
    }
  }

  // Range validation
  if (year < 1900 || year > 2100) {
    throw new Error(`Ano de nascimento inválido: ${year}. Deve estar entre 1900 e 2100.`);
  }

  if (month < 1 || month > 12) {
    throw new Error(`Mês inválido: ${month}. Deve estar entre 1 e 12.`);
  }

  // Exact calendar days in month (handling leap years correctly)
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    throw new Error(`Dia inválido (${day}) para o mês ${month} do ano ${year}. Este mês possui ${daysInMonth} dias.`);
  }

  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  const isoDate = `${year}-${mm}-${dd}`;

  return { year, month, day, isoDate };
}

export function isValidDateString(dateStr: string | undefined | null): boolean {
  try {
    parseAndValidateDate(dateStr);
    return true;
  } catch {
    return false;
  }
}
