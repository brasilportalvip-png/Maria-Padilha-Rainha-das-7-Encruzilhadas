import { describe, it, expect } from 'vitest';
import {
  getOrCreateSpiritualProfile,
  getLivingSpiritualHistory,
  recordSpiritualEvent,
  assembleSpiritualAIContext,
} from '../api/services/spiritualProfileService.js';
import { calculateLoveSynastry } from '../src/oraculos/loveSynastryEngine.js';
import { LOVE_COMPATIBILITY_COST } from '../src/config/pricing.js';
import type { UserProfile } from '../src/types/spiritual.js';

describe('Perfil Espiritual Permanente e Sinastria Amorosa Sagrada', () => {
  const dummyUser: UserProfile = {
    uid: 'usr_spiritual_test_1',
    fullName: 'Maria da Conceição Silva',
    email: 'maria@example.com',
    phone: '11999998888',
    birthDate: '1990-05-15',
    birthTime: '14:30',
    city: 'Salvador',
    timezone: 'America/Bahia',
    credits: 10,
    isBlocked: false,
    isVerified: true,
    emailVerified: true,
    phoneVerified: true,
    mfaEnabled: false,
    antiFraudScore: 0,
    deviceFingerprint: 'fp_test_1',
    createdAt: new Date().toISOString(),
  };

  it('deve gerar perfil espiritual permanente estável com versão 1', async () => {
    const profile = await getOrCreateSpiritualProfile(dummyUser);

    expect(profile.uid).toBe(dummyUser.uid);
    expect(profile.natalProfileVersion).toBe(1);
    expect(profile.numerology.lifePath).toBeGreaterThan(0);
    expect(profile.cabala.sephirahName).toBeTruthy();
    expect(profile.cabala.rulingArchangel).toBeTruthy();
    expect(profile.astrology.sunSign).toBeTruthy();
    expect(profile.astrology.element).toBeTruthy();
    expect(profile.archetypes.pomboGiraAffinity).toBeTruthy();
    expect(profile.karmicPatterns.soulMission).toBeTruthy();

    // Call again with same data: deterministic parts stay stable, version does NOT bump
    const cached = await getOrCreateSpiritualProfile(dummyUser);
    expect(cached.natalProfileVersion).toBe(1);
    expect(cached.natalSignature).toBe(profile.natalSignature);
  });

  it('deve recalcular partes dependentes e incrementar versão se dados natais forem explicitamente alterados', async () => {
    const updatedUser = {
      ...dummyUser,
      birthDate: '1992-10-28', // changed birthdate
    };

    const newProfile = await getOrCreateSpiritualProfile(updatedUser);
    expect(newProfile.natalProfileVersion).toBe(2);
    expect(newProfile.natalSignature).not.toBe((await getOrCreateSpiritualProfile(dummyUser)).natalSignature);
  });

  it('deve manter história espiritual viva sem substituir dados natais', async () => {
    await recordSpiritualEvent({
      uid: dummyUser.uid,
      category: 'amor',
      readingId: 'read_123',
      summary: 'Pergunta sobre reconciliação amorosa',
      partnerName: 'Carlos Eduardo',
    });

    const history = await getLivingSpiritualHistory(dummyUser.uid);
    expect(history.recurringThemes).toContain('amor');
    expect(history.importantRelations.some(r => r.name === 'Carlos Eduardo')).toBe(true);
    expect(history.previousReadings.length).toBeGreaterThan(0);
  });

  it('deve cruzar duas pessoas na Comparação Amorosa sem scores fictícios de charCode', () => {
    const synastry = calculateLoveSynastry({
      name1: 'Juliana Mendes',
      birthDate1: '1993-04-12',
      name2: 'Rafael Santos',
      birthDate2: '1989-11-23',
    });

    // Both persons calculated
    expect(synastry.person1.numerology.lifePathNumber).toBeGreaterThan(0);
    expect(synastry.person2.numerology.lifePathNumber).toBeGreaterThan(0);
    expect(synastry.person1.astrology.sunSign).toBeTruthy();
    expect(synastry.person2.astrology.sunSign).toBeTruthy();

    // Elemental dynamic and cabalistic alignment
    expect(synastry.elementalDynamic.harmonyType).toBeTruthy();
    expect(synastry.cabalisticAlignment.pillarDynamic).toBeTruthy();

    // Real Tarot draw for love synastry (3 cards)
    expect(synastry.tarotSpread.length).toBe(3);
    expect(synastry.tarotSpread[0].card.name).toBeTruthy();

    // Authentic qualitative indicators
    expect(synastry.qualitativeIndicators.spiritualAffinity.level).toBeTruthy();
    expect(synastry.qualitativeIndicators.spiritualAffinity.index).toBeGreaterThanOrEqual(60);
    expect(synastry.qualitativeIndicators.spiritualAffinity.index).toBeLessThanOrEqual(100);

    expect(synastry.qualitativeIndicators.emotionalResonance.level).toBeTruthy();
    expect(synastry.qualitativeIndicators.emotionalResonance.index).toBeGreaterThanOrEqual(60);
    expect(synastry.qualitativeIndicators.emotionalResonance.index).toBeLessThanOrEqual(100);

    expect(synastry.qualitativeIndicators.practicalHarmony.level).toBeTruthy();

    // Price of love compatibility must be 5 credits
    expect(LOVE_COMPATIBILITY_COST).toBe(5);
  });

  it('assembleSpiritualAIContext deve montar contexto espiritual rico com seletividade para a IA', async () => {
    const ctx = await assembleSpiritualAIContext({
      user: dummyUser,
      question: 'Devo me abrir para este novo amor ou focar na minha carreira?',
      partnerData: { name: 'Lucas', birthDate: '1991-08-14' },
    });

    expect(ctx.systemContext).toContain('CONTEXTO ESPIRITUAL PROFUNDO DO CONSULENTE');
    expect(ctx.systemContext).toContain('PERFIL ESPIRITUAL PERMANENTE');
    expect(ctx.systemContext).toContain('PESSOA ENVOLVIDA');
    expect(ctx.systemContext).toContain('DIRETRIZ DE CONDUTA PARA MARIA PADILHA');
    expect(ctx.permanentProfile.numerology.lifePath).toBeGreaterThan(0);
    expect(ctx.temporal.greeting).toBeTruthy();
  });
});
