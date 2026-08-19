# Apostila com leitura em voz, Cadernos e Minhas Notas

## O que encontrei no código atual

- **Rotas existentes**: `index`, `login`, `signup`, `complete-profile`, `reset-password`, `dashboard`, `apostila/$id`, `responder`, `responder/$apostilaId`, `exercicios`, `perfil`, `admin`, `suporte`, `documentacao`, `termos`, `privacidade`. As rotas de **áudio livros/áudio dramas não existem mais** no projeto (foram perdidas em alguma reversão) — não vou mexer nisso agora, só sinalizo.
- **Apostilas hoje são estáticas em código**: `src/lib/apostilas.ts` tem os 5 níveis antigos hardcoded (Gênesis 1 Iniciante… Consolidação) e o `/dashboard` lista esses 5. Ou seja, o site ainda mostra as apostilas removidas do banco. Precisa virar **uma única apostila de Gênesis** com o novo `drive_file_id`.
- **`/apostila/$id`** hoje é só um `<iframe>` do Drive (`docs.google.com/.../preview`) — sem paginação e sem leitura em voz.
- **Auth**: `useAuth` + `useRequireAccess` já cuidam de login e `acesso_liberado`. `/admin` usa `profiles.nivel_admin` (`admin` / `junior` / `nenhum`) e tem abas Resumo / Usuários / Respostas / Suporte.
- **Banco**: não tenho acesso direto de escrita ao seu Supabase por aqui (nenhuma conexão operacional chegou). Então **as tabelas novas você roda no SQL Editor do Supabase** com o script que vou te entregar pronto — o código do site já vem escrito para elas.

## Ponto técnico importante (preciso do seu ok)

Para ter **paginação própria + botão "Ouvir"**, o site precisa do **texto** da apostila. Um iframe do Google Doc é de outro domínio: o navegador não deixa ler o texto de dentro dele, então nem paginação nem TTS funcionam em cima do iframe.

Solução: o servidor do site busca o texto do Doc pela URL de exportação pública
`https://docs.google.com/document/d/<ID>/export?format=txt` a cada carregamento (sem cache), quebra em páginas e entrega ao visualizador.

**Requisito**: o Google Doc precisa estar compartilhado como **"Qualquer pessoa com o link — Leitor"**. Como você atualiza o Doc direto no Drive, o site sempre pega a versão mais recente. Se você preferir não deixar o Doc público, o alternativo é manter o iframe (sem paginação/TTS) — mas aí perde o recurso principal de acessibilidade.

## 1) Visualizador de apostila

- `src/lib/apostilas.ts` passa a ter só a **Apostila de Gênesis** (`1gSfhG7etuw3-oCDV3BaUrsUyPSrZ0bNqt8ucRjv5ZPM`); `/dashboard` mostra um card único.
- Nova server function `apostila.functions.ts`: baixa o texto do Doc, limpa e devolve parágrafos.
- `/apostila/$id` vira visualizador próprio:
  - Texto renderizado em HTML real (fonte grande, alto contraste) — o TalkBack lê normalmente.
  - Paginação por blocos de parágrafos: **"Página anterior" / "Próxima página"**, com `aria-label` completo ("Ir para a página 3 de 12") e um `aria-live="polite"` anunciando a troca de página.
  - Botão fixo no topo **"Ouvir"** (ícone de alto-falante) usando `window.speechSynthesis` — 100% nativo, sem API paga. Lê só a página atual, em `pt-BR`, com botões **Pausar / Continuar / Parar** e controle de velocidade. Para automaticamente ao trocar de página ou sair.
  - Fallback: se o Doc não estiver acessível, mostra o iframe atual e explica o motivo.

## 2) Cadernos (`/cadernos`)

- Lista dos cadernos do aluno (título + data de atualização), botão **"Criar novo caderno"**.
- `/cadernos/$id`: título + área de texto grande para escrever livremente, com **"Salvar"** explícito (sem autosave silencioso, que confunde leitor de tela) e confirmação por `aria-live`.
- Item **"Cadernos"** no menu lateral.
- Aluno pode ter quantos cadernos quiser; só vê e edita os próprios (RLS).

## 3) Admin — "Minhas Notas"

- Nova aba no `/admin` (visível para `nivel_admin = 'admin'`).
- Lista alunos → cadernos de cada aluno → conteúdo completo do caderno.
- Campo de **observação/nota qualitativa** por caderno, salvo em tabela própria, editável a qualquer momento.
- O aluno vê a observação do professor dentro do seu caderno (só leitura).

## Estrutura de tabelas proposta (SQL para você rodar)

```sql
-- Cadernos do aluno
create table public.cadernos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null default 'Novo caderno',
  conteudo text not null default '',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
grant select, insert, update, delete on public.cadernos to authenticated;
alter table public.cadernos enable row level security;

create policy "aluno le seus cadernos" on public.cadernos
  for select to authenticated using (auth.uid() = user_id);
create policy "aluno cria caderno" on public.cadernos
  for insert to authenticated with check (auth.uid() = user_id);
create policy "aluno edita seu caderno" on public.cadernos
  for update to authenticated using (auth.uid() = user_id);
create policy "aluno apaga seu caderno" on public.cadernos
  for delete to authenticated using (auth.uid() = user_id);
create policy "admin le todos os cadernos" on public.cadernos
  for select to authenticated using (
    exists (select 1 from public.profiles p
            where p.id = auth.uid() and p.nivel_admin in ('admin','junior'))
  );

-- Observações do administrador sobre cada caderno
create table public.caderno_notas (
  id uuid primary key default gen_random_uuid(),
  caderno_id uuid not null references public.cadernos(id) on delete cascade,
  admin_id uuid not null references auth.users(id) on delete cascade,
  observacao text not null default '',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (caderno_id)
);
grant select, insert, update, delete on public.caderno_notas to authenticated;
alter table public.caderno_notas enable row level security;

create policy "aluno le nota do seu caderno" on public.caderno_notas
  for select to authenticated using (
    exists (select 1 from public.cadernos c
            where c.id = caderno_id and c.user_id = auth.uid())
  );
create policy "admin gerencia notas" on public.caderno_notas
  for all to authenticated using (
    exists (select 1 from public.profiles p
            where p.id = auth.uid() and p.nivel_admin = 'admin')
  ) with check (
    exists (select 1 from public.profiles p
            where p.id = auth.uid() and p.nivel_admin = 'admin')
  );
```

`conteudo` e `observacao` são `text` (sem limite de tamanho), como você pediu.

## Confirmações que preciso

1. Pode deixar o Google Doc como **"qualquer pessoa com o link — Leitor"**? (necessário para paginação + "Ouvir")
2. `unique (caderno_id)` em `caderno_notas` = **uma observação por caderno**, editável. Prefere assim ou um histórico de várias observações?
3. Junior (`nivel_admin='junior'`) deve **ver** os cadernos mas não escrever observações — está certo?
4. Posso remover as 5 apostilas antigas do dashboard e deixar só a Apostila de Gênesis?
