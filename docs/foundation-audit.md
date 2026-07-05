# Auditoria da Fundacao Atual

Estado auditado no commit `96f28ac Initial SaaS foundation`.

Esta auditoria documenta a fundacao criada ate agora. Nenhuma funcionalidade nova foi adicionada neste documento.

## 1. Estrutura atual de pastas

```txt
app/                 rotas Next.js
  (public)/          paginas publicas
  (auth)/            login, cadastro e recuperacao de senha
  (account)/         conta, favoritos, listas e buscas salvas
  admin/             navegacao inicial do painel editorial
components/          componentes de UI e layout
lib/                 ambiente, Supabase, autenticacao e permissoes
server/              camadas reservadas para repositories, services e use-cases
sql/                 migrations e seeds
scripts/             scripts futuros de importacao e reindexacao
docs/                documentacao tecnica do projeto
```

Arquivos centrais:

- `sql/migrations/0001_initial_foundation.sql`
- `sql/seeds/0001_foundation_seeds.sql`
- `docs/step-1-foundation.md`
- `docs/database.md`
- `docs/editorial.md`

## 2. Bibliotecas instaladas

- `next`, `react`, `react-dom`: base da aplicacao web.
- `typescript`: tipagem estatica.
- `tailwindcss`, `@tailwindcss/postcss`: estilos.
- `@supabase/supabase-js`, `@supabase/ssr`: cliente Supabase e sessao SSR.
- `zod`: validacao de variaveis de ambiente.
- `lucide-react`: icones.
- `@radix-ui/react-slot`: base para componentes no estilo shadcn/ui.
- `class-variance-authority`, `clsx`, `tailwind-merge`: composicao de classes e variantes.
- `eslint`, `eslint-config-next`, `@eslint/eslintrc`: lint.
- `@types/node`, `@types/react`, `@types/react-dom`: tipos auxiliares.

## 3. Configuracao atual do Supabase

Supabase esta preparado em:

- `lib/env.ts`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/middleware.ts`
- `middleware.ts`

Estado atual:

- ainda nao ha projeto Supabase real conectado;
- faltam valores reais em `.env.local`;
- o middleware atualiza a sessao quando `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` existem;
- server actions usam o cliente Supabase server-side.

Regra arquitetural:

> Supabase/Postgres e a fonte oficial dos dados. Qualquer indice de busca futuro deve ser derivado e reconstruivel a partir do banco.

## 4. Migrations SQL criadas

Existe uma migration inicial:

- `sql/migrations/0001_initial_foundation.sql`

Ela cria:

- extensao `pgcrypto`;
- enums;
- tabelas fundacionais;
- indices;
- triggers de `updated_at`;
- funcoes auxiliares de permissao;
- trigger `handle_new_user` para criar `profiles` a partir de `auth.users`;
- politicas iniciais de Row Level Security.

## 5. Tabelas criadas

- `role_definitions`
- `profiles`
- `organizations`
- `organization_members`
- `composers`
- `works`
- `instrument_families`
- `instruments`
- `work_instrumentation`
- `movements`
- `voice_requirements`
- `source_holders`
- `work_sources`
- `manuscript_sources`
- `bibliographic_references`
- `work_references`
- `composer_references`
- `taxonomies`
- `work_taxonomies`
- `composer_taxonomies`
- `revision_history`
- `audit_logs`
- `saved_searches`
- `favorites`
- `repertoire_lists`
- `repertoire_list_items`
- `import_batches`
- `import_rows`

## 6. Enums, constraints e indices

Enums criados:

- `app_role`
- `publication_status`
- `reliability_level`
- `organization_type`
- `organization_member_role`
- `member_status`
- `source_holder_type`
- `material_type`
- `manuscript_source_type`
- `reference_type`
- `taxonomy_type`
- `import_status`
- `import_row_status`

Constraints principais:

- chaves estrangeiras entre entidades;
- `unique` em slugs e vinculos;
- checks de quantidade minima/maxima em `work_instrumentation`;
- trigger padrao para atualizacao de `updated_at`.

Indices principais:

- status e slugs de compositores e obras;
- ano, duracao e formacao de obras;
- GIN em nomes e titulos alternativos;
- chaves de relacionamento;
- auditoria;
- importacao;
- favoritos, listas e buscas salvas.

## 7. Politicas de Row Level Security

RLS esta ativado nas tabelas principais.

Regras implementadas em alto nivel:

- publico le compositores e obras publicados;
- instrumentos, familias instrumentais e taxonomias sao publicos;
- dados detalhados de catalogo exigem papel com acesso completo;
- editores e administradores gerenciam dados editoriais;
- administradores gerenciam organizacoes e auditoria;
- usuarios gerenciam apenas seus proprios favoritos, listas e buscas salvas;
- revisoes e importacoes sao visiveis para perfis editoriais.

Funcoes auxiliares:

- `current_user_role()`
- `has_any_role(required_roles app_role[])`
- `has_editorial_access()`
- `has_editor_write_access()`
- `has_catalog_access()`
- `is_admin()`

## 8. Fluxo de autenticacao criado

Arquivo principal:

- `lib/auth/actions.ts`

Acoes criadas:

- `signIn`: login por e-mail e senha.
- `signUp`: cadastro com e-mail, senha e nome.
- `signOut`: encerramento de sessao.
- `resetPassword`: envio de e-mail de recuperacao.

Fluxo de perfil:

- Supabase Auth cria o usuario em `auth.users`;
- trigger `handle_new_user` cria o registro correspondente em `public.profiles`;
- o papel inicial padrao e `user`.

## 9. Estrutura inicial do painel administrativo

Rotas criadas:

- `/admin/dashboard`
- `/admin/compositores`
- `/admin/obras`
- `/admin/instrumentos`
- `/admin/fontes`
- `/admin/referencias`
- `/admin/taxonomias`
- `/admin/importacao`
- `/admin/revisoes`
- `/admin/usuarios`

Estado atual:

- existe navegacao inicial;
- as paginas sao placeholders;
- ainda nao ha CRUD completo;
- ainda falta bloquear visualmente/por rota o acesso admin no Next.js.

## 10. Seeds criados

Arquivo:

- `sql/seeds/0001_foundation_seeds.sql`

Dados criados:

- papeis de usuario;
- familias instrumentais;
- instrumentos orquestrais iniciais;
- instrumentos brasileiros iniciais;
- taxonomias curatoriais minimas.

## 11. Variaveis de ambiente necessarias

Arquivo de referencia:

- `.env.example`

Variaveis listadas:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `MEILISEARCH_HOST`
- `MEILISEARCH_API_KEY`
- `PAYMENT_PROVIDER`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `ASAAS_API_KEY`
- `RESEND_API_KEY`
- `SENTRY_DSN`

Para a etapa atual, as variaveis essenciais sao:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 12. Como rodar localmente

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Abrir:

```txt
http://localhost:3000
```

Validacao:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## 13. Como fazer deploy no Coolify

O projeto ja possui:

- `Dockerfile`
- `.dockerignore`
- `next.config.ts` com `output: "standalone"`

Fluxo recomendado:

1. Usar o repositorio GitHub como origem.
2. Criar uma aplicacao no Coolify apontando para o repositorio.
3. Usar build via Dockerfile.
4. Configurar variaveis de ambiente no Coolify.
5. Manter Supabase Cloud separado.
6. Deployar a aplicacao Next.js.
7. Adicionar Meilisearch depois, como servico separado, quando a busca entrar.

## 14. O que ainda nao foi implementado

- CRUD de compositores.
- CRUD de obras.
- Cadastro de instrumentacao estruturada pela interface.
- Protecao das rotas admin no Next.js.
- Busca simples funcional.
- Busca avancada.
- Meilisearch.
- Importacao CSV/XLSX funcional.
- Assinatura.
- Pagamento.
- Paywall.
- API publica.
- Relatorios.
- Busca com IA.
- Testes automatizados.
- UX final.

## 15. Riscos, pendencias e proximos passos

Riscos atuais:

- migration ainda precisa ser aplicada e testada em um projeto Supabase real;
- RLS precisa ser validado com usuarios reais e papeis diferentes;
- admin ainda nao esta protegido por rota;
- `SUPABASE_SERVICE_ROLE_KEY` nao pode ir para o client;
- importacao e busca ainda sao apenas preparacao estrutural;
- dados academicos exigirao fluxo editorial cuidadoso antes de publicacao.

Proximos passos recomendados:

1. Criar/configurar projeto Supabase.
2. Aplicar migration e seed.
3. Configurar `.env.local`.
4. Criar primeiro usuario admin.
5. Proteger rotas admin.
6. Implementar CRUD de compositores.
7. Implementar CRUD de obras.
8. Implementar instrumentacao estruturada.
9. Implementar busca simples.
10. Depois implementar busca avancada.
11. Somente depois iniciar assinatura e paywall.

## Estado Git

Repositorio remoto:

- URL do repositorio remoto no GitHub.

Commit base auditado:

- `96f28ac Initial SaaS foundation`
