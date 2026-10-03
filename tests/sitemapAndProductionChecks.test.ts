import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { generateSitemapXml } from '../scripts/generate-sitemap.js';
import { checkRateLimit } from '../serverlib/services/rateLimiter.js';

describe('Sitemap, Robots e Proteções de Produção (Requisitos 27, 28, 30)', () => {
  it('generateSitemapXml deve gerar XML válido e incluir estritamente rotas públicas canônicas', () => {
    const xml = generateSitemapXml();

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain('<loc>https://maria-padilha-rainha-das-7-encruzil.vercel.app/</loc>');
    expect(xml).toContain('<loc>https://maria-padilha-rainha-das-7-encruzil.vercel.app/privacidade</loc>');
    expect(xml).toContain('<loc>https://maria-padilha-rainha-das-7-encruzil.vercel.app/termos</loc>');

    // Rotas privadas NUNCA podem estar no sitemap
    expect(xml).not.toContain('/admin');
    expect(xml).not.toContain('/chat');
    expect(xml).not.toContain('/credits');
    expect(xml).not.toContain('/dashboard');
    expect(xml).not.toContain('/diary');
    expect(xml).not.toContain('localhost');
  });

  it('robots.txt deve permitir indexação apenas de rotas públicas e bloquear rotas autenticadas', () => {
    const robotsPath = path.resolve(process.cwd(), 'public/robots.txt');
    const robotsContent = fs.readFileSync(robotsPath, 'utf-8');

    expect(robotsContent).toContain('Allow: /');
    expect(robotsContent).toContain('Allow: /privacidade');
    expect(robotsContent).toContain('Allow: /termos');
    expect(robotsContent).toContain('Disallow: /admin');
    expect(robotsContent).toContain('Disallow: /api/');
    expect(robotsContent).toContain('Disallow: /chat');
    expect(robotsContent).toContain('Disallow: /credits');
    expect(robotsContent).toContain('Disallow: /dashboard');
    expect(robotsContent).toContain('Sitemap: https://maria-padilha-rainha-das-7-encruzil.vercel.app/sitemap.xml');
  });

  it('rateLimiter deve suportar fail-closed para fluxos de alta sensibilidade', async () => {
    // Normal query with fail-open
    const resOpen = await checkRateLimit('user_test_rate_1', 10, 60000, false);
    expect(resOpen.allowed).toBe(true);

    // Limit reached
    for (let i = 0; i < 15; i++) {
      await checkRateLimit('user_test_rate_2', 5, 60000, true);
    }
    const resBlocked = await checkRateLimit('user_test_rate_2', 5, 60000, true);
    expect(resBlocked.allowed).toBe(false);
    expect(resBlocked.remaining).toBe(0);
  });
});
