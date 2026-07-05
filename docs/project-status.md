# Status tecnico do projeto

Atualizado apos a implementacao incremental da fundacao, CRUDs editoriais iniciais e superficies publicas.

## Implementado

- Fundacao Next.js App Router com Supabase SSR.
- Autenticacao por Supabase Auth.
- Protecao server-side de `/admin`.
- Protecao server-side da area de conta.
- Papéis: `user`, assinantes futuros, organizacoes, `reviewer`, `editor`, `admin`.
- RLS nas tabelas principais.
- CRUD administrativo de compositores.
- CRUD administrativo de instrumentos.
- CRUD administrativo de detentores/fontes.
- CRUD administrativo de referencias.
- CRUD administrativo de taxonomias.
- CRUD administrativo inicial de obras.
- Edicao de instrumentacao por obra.
- Registro de `revision_history`.
- Registro de `audit_logs`.
- Listagens publicas de compositores e obras publicados.
- Paginas publicas de detalhe de compositor e obra.
- Busca publica simples em compositores e obras publicados.
- Area de conta com leitura de perfil, favoritos, listas e buscas salvas.
- Painel de importacao em modo leitura/preparacao.
- Painel de revisoes em modo leitura.
- Preparacao tecnica para paywall.
- Preparacao tecnica para documentos de busca externa.
- Modo demonstracao navegavel com dados ficticios via `NEXT_PUBLIC_DEMO_MODE=true`.
- Endurecimento inicial de seguranca para autenticacao, headers HTTP e higiene de repositorio.

## Consistencia revisada

- Paginas publicas consultam apenas registros com `publication_status = 'published'`.
- Paginas publicas de detalhe usam selecao explicita de campos, evitando `select("*")`.
- Dados completos de obra continuam bloqueados visualmente e nao sao expostos na pagina publica.
- Busca simples limpa caracteres de controle/filtro, limita termos e retorna no maximo 20 compositores e 20 obras.
- Area de conta e rotas administrativas sao marcadas como dinamicas e protegidas server-side.
- Paginas pessoais filtram explicitamente por `user_id` alem de dependerem da RLS.
- `/admin/importacao` apenas lista lotes existentes; nao faz upload, parsing ou escrita automatica.
- `/admin/revisoes` apenas lista `revision_history` e fica sob protecao editorial do layout admin.
- `SUPABASE_SERVICE_ROLE_KEY` nao e usado pela aplicacao atual.
- Fluxos de login, cadastro e recuperacao possuem validacao server-side, honeypot e limite inicial de tentativas.

## Modo demonstracao

Quando `NEXT_PUBLIC_DEMO_MODE=true`, o projeto usa um cliente Supabase simulado em `lib/demo/supabase.ts` e dados ficticios em `lib/demo/data.ts`.

Esse modo permite navegar pelas paginas publicas, area de conta e painel administrativo sem Supabase real. Ele serve apenas para avaliacao de interface e fluxo; dados enviados em formularios nao sao persistidos.

## Ainda nao implementado

- CRUD completo de materiais, manuscritos, referencias vinculadas a obras e disponibilidade.
- Criacao/edicao de favoritos, listas e buscas salvas pela interface.
- Busca avancada com Meilisearch.
- Pipeline real de reindexacao.
- Upload e processamento real de CSV/XLSX.
- Assinatura, checkout, webhooks e gestao financeira.
- API publica.
- Testes automatizados.
- Validacao real contra Supabase Cloud neste ambiente, pois depende do `.env.local` e credenciais reais.
- Rate limit compartilhado em Redis/Upstash ou firewall externo para producao com multiplas instancias.

## Estado recomendado para retomada

1. Configurar `.env.local` com Supabase real.
2. Aplicar migrations em ordem:
   - `sql/migrations/0001_initial_foundation.sql`
   - `sql/migrations/0002_instrument_active.sql`
3. Aplicar seed:
   - `sql/seeds/0001_foundation_seeds.sql`
4. Criar usuario pelo fluxo `/cadastro`.
5. Promover o usuario para `admin` via SQL.
6. Rodar validacoes locais.
7. Testar manualmente CRUDs com `admin`, `editor`, `reviewer`, usuario comum e visitante.

## Ultimo estado de validacao local

Os comandos abaixo passaram sem `.env.local`:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`

As rotas que dependem de dados reais seguem validaveis estruturalmente, mas a validacao funcional completa depende de um projeto Supabase configurado.
