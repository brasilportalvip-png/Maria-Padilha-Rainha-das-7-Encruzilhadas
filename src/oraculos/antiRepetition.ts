export interface RepetitionContext {
  isRepeatedQuestion: boolean;
  similarityNote?: string;
  adviceGuidance?: string;
}

export function analyzeQuestionRepetition(
  currentQuestion: string,
  history: Array<{ text: string; role: string }>
): RepetitionContext {
  const cleanCurrent = currentQuestion.toLowerCase().trim().replace(/[^\w\s]/g, '');

  if (!cleanCurrent || history.length === 0) {
    return { isRepeatedQuestion: false };
  }

  const previousUserQuestions = history
    .filter((h) => h.role === 'user')
    .map((h) => h.text.toLowerCase().trim().replace(/[^\w\s]/g, ''));

  const matches = previousUserQuestions.filter((prev) => {
    if (prev === cleanCurrent) return true;
    if (prev.length > 10 && cleanCurrent.length > 10) {
      return prev.includes(cleanCurrent) || cleanCurrent.includes(prev);
    }
    return false;
  });

  if (matches.length > 0) {
    return {
      isRepeatedQuestion: true,
      similarityNote: 'O consulente já fez uma pergunta idêntica ou muito semelhante recentemente nesta conversa.',
      adviceGuidance:
        'Reconheça com carinho e sabedoria que a questão já foi trazida. Não mude as cartas nem fabrique resultados artificiais, mas aprofunde a orientação sobre paciência, firmeza de atitude prática e o tempo natural de maturação espiritual.',
    };
  }

  return { isRepeatedQuestion: false };
}
