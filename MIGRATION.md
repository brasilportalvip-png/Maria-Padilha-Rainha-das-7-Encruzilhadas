# Guia Oficial de Migração e Substituição em Produção
## Reino de Maria Padilha — Rainha das 7 Encruzilhadas

Este documento estabelece o procedimento operacional padrão para a substituição segura e não destrutiva da versão antiga do portal pela versão 2.0.0 em produção (Vercel e Firebase).

---

### 1. Princípios Absolutos da Migração

Conforme diretriz do comitê técnico e do proprietário:

1. **MESMO Projeto Firebase**: O projeto `maria-padilha-rainha-das-7` permanece inalterado.
2. **MESMOS Usuários**: Todos os UIDs do Firebase Authentication continuam idênticos e ativos.
3. **MESMO Firestore**: Nenhuma coleção é recriada ou zerada.
4. **MESMOS Saldos de Crédito**: A integridade financeira e contábil existente em `users/{uid}.credits` é mantida integralmente.
5. **MESMOS Dados Natais**: Data de nascimento, hora, cidade e nome civil dos consulentes não são sobrescritos com valores vazios.
6. **MESMAS Credenciais Mercado Pago**: `MERCADOPAGO_ACCESS_TOKEN` e `MERCADO_PAGO_WEBHOOK_SECRET` reais configurados na Vercel continuam válidos.
7. **Nenhuma Migração Destrutiva**: Qualquer campo novo adicionado ao schema (`lastPlanId`, `level`, `xp`, `cabala`, `astrology`) utiliza valores opcionais com fallback retrocompatível.

---

### 2. Mapeamento de Schemas e Retrocompatibilidade

| Coleção Firestore | Schema Antigo | Schema 2.0.0 | Tratamento de Retrocompatibilidade |
|---|---|---|---|
| `users` | `uid`, `fullName`, `email`, `phone`, `birthDate`, `birthTime`, `city`, `credits`, `isBlocked` | Adicionados `lastPlanId?`, `role?`, `level?`, `xp?` | Operações utilizam `{ merge: true }`. Campos pré-existentes nunca são apagados ou redefinidos para null. |
| `readings` | `uid`, `oracleType`, `interpretationHtml`, `creditCost`, `createdAt` | Adicionados `rawResult`, `intent`, `readingId`, `timezone` | Leituras anteriores continuam legíveis pela UI sem necessidade de alteração retroativa. |
| `credit_ledger` | Registros históricos | Schema contábil auditado | Imutável. Somente append-only de novos lançamentos. |
| `payment_orders` | Pedidos de compra | Reconciliação atômica | Pedidos antigos permanecem com seus respectivos status. |
| `diary` | Entradas espirituais | Mesma estrutura | Preservado 100%. |

---

### 3. Procedimento Passo a Passo de Cutover na Vercel

1. **Verificar Variáveis de Ambiente na Vercel**:
   Certifique-se de que as variáveis abaixo estão preenchidas no painel da Vercel (Production & Preview):
   - `FIREBASE_SERVICE_ACCOUNT_BASE64`: Chave JSON da conta de serviço Firebase codificada em Base64.
   - `GEMINI_API_KEY`: Chave da API Google Gemini.
   - `GEMINI_PRIMARY_MODEL`: `gemini-3.8-flash`
   - `GEMINI_SECONDARY_MODEL`: `gemini-3.7-flash`
   - `GEMINI_TERTIARY_MODEL`: `gemini-3.6-flash`
   - `MERCADOPAGO_ACCESS_TOKEN`: Token de acesso de produção do Mercado Pago.
   - `MERCADO_PAGO_WEBHOOK_SECRET`: Segredo de assinatura do Webhook do Mercado Pago.
   - `PUBLIC_SITE_URL`: Domínio canônico de produção (ex: `https://maria-padilha-rainha-das-7-encruzil.vercel.app`).

2. **Atribuição de Custom Claim de Administrador**:
   Para conceder privilégios de administrador sem depender de e-mail hardcoded:
   ```bash
   npx tsx scripts/set-admin-claim.ts <UID_DO_ADMINISTRADOR>
   ```

3. **Deploy de Regras do Firestore (`firestore.rules`)**:
   As regras já estão validadas para impedir que usuários alterem seus próprios créditos ou o campo `role`. Elas permitem leitura do próprio perfil e escrita de consultas geradas pelo backend.

4. **Publicação do Código**:
   Aponte o repositório ou branch `main` na Vercel. O script `npm run build` executará:
   - `npm run sitemap` (geração de sitemap limpo sem lastmod forçado diário);
   - `vite build` (compilação do frontend com code-splitting);
   - `esbuild server.ts` (bundle do servidor para produção).

5. **Verificação Pós-Deploy**:
   - Acesse `https://seu-dominio/api/health` e confirme resposta HTTP 200 com status `online`.
   - Teste login com usuário real já existente.
   - Verifique se os créditos e histórico de leituras são exibidos imediatamente.
