import { describe, it, expect } from 'vitest';
import { drawTarotCards, FULL_DECK } from '../src/oraculos/tarotEngine.js';

describe('Tarot Real Oracle Engine (Requisitos 25, 26, 72)', () => {
  it('deve sortear exatamente 3 cartas sem repetição em uma tiragem padrão', () => {
    const spread = drawTarotCards(3);
    expect(spread).toHaveLength(3);

    const cardIds = spread.map((p) => p.card.id);
    const uniqueIds = new Set(cardIds);
    expect(uniqueIds.size).toBe(3);
  });

  it('todas as cartas sorteadas devem pertencer ao baralho oficial', () => {
    const spread = drawTarotCards(5);
    expect(spread).toHaveLength(5);

    spread.forEach((p) => {
      expect(FULL_DECK.some((c) => c.id === p.card.id)).toBe(true);
      expect(p.card.name).toBeDefined();
      expect(p.label).toBeDefined();
      expect(typeof p.isReversed).toBe('boolean');
    });
  });

  it('PARTE 124 - deve possuir exatamente 78 cartas (22 Maiores + 56 Menores, 14 por naipe, sem duplicação)', () => {
    expect(FULL_DECK).toHaveLength(78);

    const major = FULL_DECK.filter((c) => c.arcana === 'major');
    const minor = FULL_DECK.filter((c) => c.arcana === 'minor');

    expect(major).toHaveLength(22);
    expect(minor).toHaveLength(56);

    const suits = ['copas', 'ouros', 'espadas', 'paus'] as const;
    suits.forEach((suit) => {
      const suitCards = minor.filter((c) => c.suit === suit);
      expect(suitCards).toHaveLength(14);
    });

    const uniqueIds = new Set(FULL_DECK.map((c) => c.id));
    expect(uniqueIds.size).toBe(78);
  });

  it('PARTE 28 & 30 - deve suportar digital cut e reversões configuráveis', () => {
    const spreadNoReversals = drawTarotCards(5, { allowReversals: false });
    expect(spreadNoReversals.every((p) => p.isReversed === false)).toBe(true);

    const spreadWithCut = drawTarotCards(3, { cutIndex: 20 });
    expect(spreadWithCut).toHaveLength(3);
  });

  it('deve lançar erro se a quantidade pedida exceder o baralho', () => {
    expect(() => drawTarotCards(FULL_DECK.length + 1)).toThrow();
  });
});
