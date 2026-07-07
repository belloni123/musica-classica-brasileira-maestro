# Permissoes

## Papeis

- `user`: usuario autenticado sem acesso administrativo.
- `subscriber_individual`: reservado para assinatura individual futura.
- `subscriber_professional`: reservado para assinatura profissional futura.
- `institution_user`: reservado para acesso institucional futuro.
- `institution_admin`: reservado para gestao institucional futura.
- `reviewer`: acessa areas editoriais para revisao e leitura, mas nao escreve.
- `editor`: cria e edita entidades editoriais.
- `admin`: super admin; gerencia dados editoriais, usuarios e configuracoes.

## Regras no Next.js

- Visitante sem sessao que acessa `/admin` deve ser redirecionado para `/entrar`.
- Usuario autenticado sem papel editorial deve ser redirecionado para `/acesso-negado`.
- `reviewer`, `editor` e `admin` acessam areas administrativas de leitura.
- Apenas `editor` e `admin` podem criar, editar, publicar, arquivar ou alterar entidades editoriais.
- Apenas `admin` pode abrir `/admin/usuarios` e criar assinantes ou novos administradores.
- O login e unico em `/entrar`; depois da autenticacao, perfis editoriais seguem para `/admin/dashboard` e demais usuarios para `/minha-conta`.

## Regras no Supabase

- Supabase/Postgres e a fonte oficial dos dados.
- RLS deve proteger dados mesmo quando alguem conhece uma URL ou ID.
- `profiles.role` nao pode ser elevado por usuario comum.
- Criacao de contas do MVP e feita pelo super admin via Supabase Auth Admin server-side.
- Mutacoes editoriais devem registrar `revision_history` e `audit_logs`.
- `SUPABASE_SERVICE_ROLE_KEY` nao deve ser usado no client.

## Utilitarios

Os utilitarios server-side ficam em `lib/auth/session.ts`:

- `getCurrentUser`
- `getCurrentProfile`
- `requireAdminAccess`
- `requireSuperAdminAccess`
- `requireEditorialWriteAccess`
- `hasEditorialAccess`
- `hasEditorialWriteAccess`
- `hasCompleteCatalogAccess`
