
Entendi a frustração — são vários pedidos grandes de uma vez. Vou propor um plano em fases pra não quebrar nada, e preciso de algumas confirmações antes.

## O que você pediu (resumido)

1. **Bug audiolivros**: em `/audiolivros/genesis` os capítulos e o player não aparecem.
2. **Agente de suporte com OpenRouter**: um agente que tenta resolver, e se não conseguir, te envia email automaticamente.
3. **Nova interface do dashboard**: abas Apostilas / Audiolivros / Audiodramas, com título clicável em vez de link.
4. **Player customizado dos audiodramas**: ao clicar no capítulo, abre player interno (sem link do Google Drive visível).
5. **Sistema de créditos "ebook credits"**: 10 créditos totais, check-in diário dá 10, cada capítulo consome, admin (você) ilimitado, assinatura para mais.

## Fase 1 — Diagnóstico dos itens já parcialmente prontos (agora)

Antes de construir coisa nova, preciso ver o estado real do banco. Vou:
- Listar tabelas existentes (`audiobooks`, `support_conversations`, etc).
- Verificar se `audiobooks` tem linhas e se a policy RLS deixa admin ler — é o motivo mais provável da tela vazia.
- Ver se existe tabela de audiodramas separada ou se são os próprios `audiobooks`.

## Fase 2 — Corrigir /audiolivros/genesis (rápido)

Depende do que a Fase 1 achar. Provavelmente é RLS ou tabela vazia. Corrijo isso primeiro, sem mexer em interface, pra você ver os capítulos e o player funcionando.

## Fase 3 — Agente de suporte (médio)

Já existe `supabase/functions/support-agent` usando OpenRouter e a rota `/suporte`. Você disse "nem adicionei OPENROUTER_API_KEY". Então:
- Adiciono o secret `OPENROUTER_API_KEY` via formulário seguro.
- Adiciono lógica de escalonamento por email (usando Resend, que já está configurado) quando o agente marca `[ESCALATE]`.
- Alimento o system prompt do agente com info real do site (rotas, funcionalidades) pra ele "conhecer tudo".

## Fase 4 — Nova aba Audiodramas no dashboard

- Adiciono abas no `/dashboard`: Apostilas | Audiolivros | Audiodramas.
- Cada card tem título clicável → abre página do audiodrama com lista de capítulos + player customizado inline (já existe base em `audiolivros.genesis.tsx`, generalizo).

## Fase 5 — Sistema de créditos ebook

Isso é o maior. Envolve:
- Nova tabela `ebook_credits (user_id, balance, updated_at)`.
- Tabela `daily_checkins (user_id, date)`.
- Tabela `credit_transactions` (audit).
- UI: mostrar saldo em `/perfil`, botão "Check-in" (uma vez por dia = +10), consumo ao tocar capítulo.
- Bypass total pra admin.
- Placeholder "Assinar" (sem gateway de pagamento ativo ainda — precisa Stripe/Paddle).

---

## Perguntas antes de começar

1. **Ordem**: você concorda em fazer nessa ordem (bug audiolivros → agente → abas → créditos)? Ou quer priorizar diferente?
2. **Audiodramas vs Audiolivros**: são a mesma tabela `audiobooks` ou você quer uma tabela separada `audiodramas`?
3. **Créditos — assinatura**: qual gateway você quer usar (Stripe? Paddle?) ou deixo como "em breve" por enquanto?
4. **OpenRouter key**: confirma que quer que eu já abra o formulário pra você colar a chave da OpenRouter agora?

Assim que você responder, começo pela Fase 1 + 2 imediatamente (o bug do player).
