# Banco de Dados

O Supabase/Postgres e a fonte oficial dos dados do projeto.

Meilisearch, quando entrar, deve ser tratado apenas como indice derivado e reconstruivel a partir das tabelas do Postgres.

## Arquivos iniciais

- `sql/migrations/0001_initial_foundation.sql`: cria enums, tabelas principais, indices, triggers, funcoes auxiliares e politicas iniciais de RLS.
- `sql/seeds/0001_foundation_seeds.sql`: insere papeis de usuario, familias instrumentais, instrumentos iniciais e taxonomias minimas.

## Ordem de aplicacao

1. Aplicar `sql/migrations/0001_initial_foundation.sql` no projeto Supabase.
2. Aplicar `sql/seeds/0001_foundation_seeds.sql`.
3. Configurar as variaveis em `.env.local` com base em `.env.example`.

## Regras de seguranca

- RLS esta ativado nas tabelas da fundacao.
- Visitantes veem apenas compositores e obras publicados.
- Dados detalhados de catalogo, como instrumentacao, fontes e manuscritos, exigem papel com acesso completo.
- Editores e administradores podem gerenciar dados editoriais.
- Favoritos, listas e buscas salvas ficam restritos ao proprio usuario.
- `revision_history` registra alteracoes editoriais.
- `audit_logs` registra eventos operacionais e de seguranca.
