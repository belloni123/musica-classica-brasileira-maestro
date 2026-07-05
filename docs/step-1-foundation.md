# Etapa 1: Fundacao Tecnica e Editorial

## Criado nesta etapa

- Projeto Next.js com TypeScript.
- Tailwind CSS.
- Componentes base em estilo shadcn/ui: `Button`, `Input` e `Card`.
- Estrutura modular de pastas para app, componentes, bibliotecas, servidor, SQL, scripts e docs.
- Cliente Supabase para browser, server components/actions e middleware de sessao.
- Acoes basicas de autenticacao:
  - entrar;
  - cadastrar;
  - recuperar senha;
  - sair.
- Layout publico simples.
- Rotas publicas iniciais:
  - `/`;
  - `/buscar`;
  - `/compositores`;
  - `/obras`;
  - `/planos`;
  - `/sobre`;
  - `/metodologia`.
- Rotas de conta:
  - `/minha-conta`;
  - `/favoritos`;
  - `/listas`;
  - `/buscas-salvas`.
- Painel admin inicial apenas com navegacao:
  - `/admin/dashboard`;
  - `/admin/compositores`;
  - `/admin/obras`;
  - `/admin/instrumentos`;
  - `/admin/fontes`;
  - `/admin/referencias`;
  - `/admin/taxonomias`;
  - `/admin/importacao`;
  - `/admin/revisoes`;
  - `/admin/usuarios`.

## Migration adicionada

- `sql/migrations/0001_initial_foundation.sql`

Ela cria:

- `profiles`
- `organizations`
- `organization_members`
- `role_definitions`
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

Tambem cria enums, indices, triggers de `updated_at`, trigger de criacao de perfil a partir de `auth.users` e politicas iniciais de RLS.

## Seed adicionada

- `sql/seeds/0001_foundation_seeds.sql`

Ela cria dados minimos para:

- papeis de usuario;
- familias instrumentais;
- instrumentos orquestrais e brasileiros iniciais;
- taxonomias curatoriais iniciais.

## Fora desta etapa

- Busca avancada.
- Meilisearch.
- Pagamento.
- Checkout.
- Assinatura.
- API publica.
- Importacao CSV/XLSX funcional.
- CRUD completo.
- Relatorios avancados.
- Busca por IA.

## Proximos passos recomendados

1. Configurar Supabase e aplicar migration + seed.
2. Criar controle real de acesso nas rotas admin com base no papel do `profile`.
3. Implementar CRUD de compositores.
4. Implementar CRUD de obras.
5. Implementar cadastro de instrumentacao estruturada.
6. Implementar busca simples.
7. Implementar busca avancada.
8. Somente depois iniciar paywall e assinatura.
