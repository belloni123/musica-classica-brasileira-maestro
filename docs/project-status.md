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

Os comandos `pnpm typecheck` e `pnpm lint` passaram nos blocos implementados. O build completo deve ser executado no final da rodada e novamente apos configurar o Supabase real.
