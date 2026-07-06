## Diagnóstico

Confirmado: o `package.json` **não contém mais** `@lovable.dev/vite-tanstack-config`. Também foi adicionado `@netlify/vite-plugin-tanstack-start` em `devDependencies` (provável artefato do teste de deploy no Vercel/Netlify).

Outras observações:
- `bunfig.toml` ainda lista `@lovable.dev/vite-tanstack-config` em `minimumReleaseAgeExcludes` — confirma que o pacote deveria estar presente.
- `vite.config.ts` **não** importa `@lovable.dev/vite-tanstack-config` diretamente hoje (usa `tanstackStart`, `cloudflare`, `viteReact`, `tailwindcss`, `tsConfigPaths`). Ou seja, o build atual pode até rodar sem ele, mas essa é a configuração padrão que a Lovable espera para preview/build gerenciados.
- Não encontrei referência a `nitro` / `nitro-nightly` no `package.json` atual — se estava antes, foi como dependência transitiva de `@lovable.dev/vite-tanstack-config`, não como entrada direta.

## Plano de restauração (somente infra, zero mudança de rotas/componentes)

1. **Reinstalar** `@lovable.dev/vite-tanstack-config` na versão que o projeto usava antes (`^2.3.2`, conforme o histórico do próprio projeto e a entrada preservada no `bunfig.toml`):
   ```
   bun add -d @lovable.dev/vite-tanstack-config@^2.3.2
   ```
   Isso deve trazer de volta o `nitro-nightly` como dependência transitiva pinada pelo próprio pacote (não precisamos declarar `nitro` manualmente).

2. **Opcional (sugerido, aguardo confirmação)**: remover `@netlify/vite-plugin-tanstack-start` de `devDependencies`, já que foi adicionado no teste de deploy externo e não é usado pelo `vite.config.ts` atual. Se preferir manter por segurança, deixamos.

3. **Não tocar** em: `vite.config.ts`, `src/start.ts`, `src/router.tsx`, nem qualquer rota (`dashboard`, `audiolivros`, `perfil`, `admin`, `login`, `index`, `responder.*`) ou componentes.

4. **Verificação**: após o `bun add`, o dev server reinicia sozinho. Vou apenas conferir que não há erros de resolução no build (`tsgo` + observar console/preview). Sem alterações de código.

## Ponto que preciso confirmar antes de agir

- Confirma versão `^2.3.2` para `@lovable.dev/vite-tanstack-config`? (é a que o histórico do projeto indica)
- Remover ou manter `@netlify/vite-plugin-tanstack-start`?