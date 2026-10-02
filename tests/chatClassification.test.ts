import { describe, it, expect } from 'vitest';
import { classifyChatMessageType } from '../api/chat.js';

describe('Chat Message Professional Classification (Requisitos 16, 19)', () => {
  it('deve classificar dúvidas sobre preços e créditos como SUPPORT', () => {
    expect(classifyChatMessageType('quanto custa para consultar?')).toBe('SUPPORT');
    expect(classifyChatMessageType('como funciona comprar créditos no portal?')).toBe('SUPPORT');
    expect(classifyChatMessageType('preciso de suporte com a minha conta')).toBe('SUPPORT');
  });

  it('deve classificar saudações casuais como CONVERSATION', () => {
    expect(classifyChatMessageType('boa noite')).toBe('CONVERSATION');
    expect(classifyChatMessageType('Olá Maria Padilha!')).toBe('CONVERSATION');
    expect(classifyChatMessageType('Laroyê')).toBe('CONVERSATION');
    expect(classifyChatMessageType('Saravá')).toBe('CONVERSATION');
  });

  it('deve classificar perguntas de aconselhamento e futuro como ORACLE_QUESTION', () => {
    expect(classifyChatMessageType('Vou conseguir este novo emprego no próximo mês?')).toBe('ORACLE_QUESTION');
    expect(classifyChatMessageType('Estou abrindo sociedade comercial, terei sucesso financeiro?')).toBe('ORACLE_QUESTION');
    expect(classifyChatMessageType('Quais caminhos devo seguir na minha vida pessoal?')).toBe('ORACLE_QUESTION');
  });

  it('deve classificar perguntas sobre cartas anteriores como ORACLE_FOLLOWUP', () => {
    expect(classifyChatMessageType('explique melhor a segunda carta', 2)).toBe('ORACLE_FOLLOWUP');
    expect(classifyChatMessageType('o que significa essa carta na minha situação?', 1)).toBe('ORACLE_FOLLOWUP');
  });
});
