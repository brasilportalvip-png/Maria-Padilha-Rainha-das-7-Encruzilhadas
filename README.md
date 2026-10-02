# Portal Maria Padilha — Rainha das 7 Encruzilhadas (v2.0.0)

Portal espiritual e oracular de alta fidelidade e arquitetura profissional, integrando motores computacionais determinísticos sagrados (Tarot de 78 cartas, Jogo de Búzios com 16 conchas, Odù Ifá, Numerologia Pitagórica da Alma, Cabala Hermética com os 72 Anjos da Shem HaMephorash e Astrologia Horária), complementados pela interpretação espiritual da inteligência oracular Google Gemini.

---

## 🌟 Arquitetura e Engenharia do Sistema

- **Arquitetura de Oráculos Reais**: O sorteio e os cálculos matemáticos/astronômicos são executados **antes** da interpretação da IA. O Gemini **nunca inventa cartas ou búzios**, apenas interpreta resultados físicos/digitais persistidos de forma auditável e imutável.
- **Fail-Closed em Produção**: Sem credenciais válidas do Firebase Admin ou Mercado Pago em produção, o sistema retorna HTTP 503 e rejeita operações financeiras silenciosas ou cadastros órfãos.
- **Cadeia Gemini Resiliente**:
  - Primário: `gemini-3.8-flash`
  - Fallback 1: `gemini-3.7-flash`
  - Fallback 2: `gemini-3.6-flash`
  - Circuit Breaker individual por modelo, retry para erros transitórios com exponential backoff & jitter, timeout estrito por tentativa (15s) e global (35s).
  - Em caso de falha de conexão do chat: estorno atômico imediato de créditos ao consulente (sem respostas genéricas simuladas).
- **Mercado Pago com Reconciliação Rigorosa**:
  - Verificação de assinatura HMAC-SHA256 (`x-signature`, `x-request-id`, `data.id`).
  - Consulta direta à API do Mercado Pago para conferência de status (`approved`), valor, moeda (`BRL`), plano e UID do consulente antes da liberação de créditos.
  - Idempotência transacional no Firestore contra cobranças ou créditos duplicados.
- **Segurança & LGPD**:
  - Autorização de administrador baseada estritamente em **Firebase Custom Claims** (`admin: true`). E-mails hardcoded foram totalmente erradicados da autorização.
  - Exportação completa de dados pessoais (perfil, leituras, diário, pagamentos).
  - Exclusão com anonimização irreversível e retenção estritamente contábil conforme o Marco Civil da Internet (Lei 12.965/2014) e LGPD (art. 16, I).
  - Rate limiting distribuído compatível com ambiente serverless (Vercel).
  - Remoção de qualquer uso de `dangerouslySetInnerHTML` e eliminação de vídeos/mídias externas.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 20.x ou 22.x
- npm (gerenciador oficial padronizado com `package-lock.json`)

### Passos
1. Instale as dependências:
   ```bash
   npm ci
   ```
2. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   # Preencha GEMINI_API_KEY, MERCADOPAGO_ACCESS_TOKEN e FIREBASE_SERVICE_ACCOUNT_BASE64
   ```
3. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   O portal estará disponível em `http://localhost:3000`.

---

## 🧪 Testes e Qualidade

- **Executar Testes Unitários (Vitest)**:
  ```bash
  npm test
  ```
- **Checagem de Tipos e Linter**:
  ```bash
  npm run lint
  ```
- **Geração de Sitemap Oficial**:
  ```bash
  npm run sitemap
  ```
- **Compilação de Produção**:
  ```bash
  npm run build
  ```

---

## 📄 Migração Segura para Produção

Consulte o documento completo [MIGRATION.md](./MIGRATION.md) para o roteiro de substituição em produção mantendo os mesmos usuários, Firestore, créditos e credenciais sem perda de dados.
