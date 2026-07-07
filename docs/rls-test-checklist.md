# Checklist Manual de RLS

Use este checklist depois de aplicar a migration e o seed no Supabase real.

## Preparacao

Crie quatro usuarios de validacao:

- visitante: sem login;
- usuario comum: `role = user`;
- editor: `role = editor`;
- admin: `role = admin`.

Promova papeis pelo SQL Editor:

```sql
update public.profiles set role = 'editor' where email = 'EDITOR_EMAIL';
update public.profiles set role = 'admin' where email = 'ADMIN_EMAIL';
```

## Visitante

Sem login:

- [ ] consegue abrir `/`;
- [ ] consegue abrir `/buscar`;
- [ ] consegue abrir `/compositores`;
- [ ] consegue abrir `/obras`;
- [ ] ao abrir `/admin/dashboard`, e redirecionado para `/entrar`;
- [ ] no SQL/API, ve apenas compositores publicados;
- [ ] no SQL/API, ve apenas obras publicadas;
- [ ] nao consegue ler `work_instrumentation`;
- [ ] nao consegue ler `work_sources`;
- [ ] nao consegue ler `manuscript_sources`;
- [ ] nao consegue ler `revision_history`;
- [ ] nao consegue ler `audit_logs`.

## Usuario comum

Com login e `role = user`:

- [ ] consegue abrir `/minha-conta`;
- [ ] ao abrir `/admin/dashboard`, e redirecionado para `/acesso-negado`;
- [ ] consegue ler o proprio `profile`;
- [ ] nao consegue alterar o proprio `role`;
- [ ] nao consegue inserir um `profile` com `role = admin`;
- [ ] consegue criar/ler/remover seus proprios favoritos;
- [ ] nao consegue ler favoritos de outro usuario;
- [ ] consegue criar/ler/remover suas proprias listas;
- [ ] nao consegue ler listas privadas de outro usuario;
- [ ] consegue criar/ler/remover suas proprias buscas salvas;
- [ ] nao consegue inserir, editar ou excluir compositores;
- [ ] nao consegue inserir, editar ou excluir obras.

## Editor

Com login e `role = editor`:

- [ ] consegue abrir `/admin/dashboard`;
- [ ] consegue ler rascunhos e itens em revisao;
- [ ] consegue inserir compositores;
- [ ] consegue atualizar compositores;
- [ ] nao consegue excluir compositores, se nao for admin;
- [ ] consegue inserir obras;
- [ ] consegue atualizar obras;
- [ ] nao consegue excluir obras, se nao for admin;
- [ ] consegue gerenciar instrumentos;
- [ ] consegue gerenciar fontes;
- [ ] consegue inserir `revision_history`;
- [ ] consegue ler batches de importacao;
- [ ] consegue gerenciar batches de importacao;
- [ ] nao consegue gerenciar `audit_logs`.

## Admin

Com login e `role = admin`:

- [ ] consegue abrir `/admin/dashboard`;
- [ ] consegue ler e atualizar `profiles`;
- [ ] consegue promover/rebaixar papeis;
- [ ] consegue gerenciar organizacoes;
- [ ] consegue gerenciar membros de organizacoes;
- [ ] consegue inserir, atualizar e excluir compositores;
- [ ] consegue inserir, atualizar e excluir obras;
- [ ] consegue gerenciar instrumentos, fontes, referencias e taxonomias;
- [ ] consegue ler `revision_history`;
- [ ] consegue gerenciar `audit_logs`;
- [ ] consegue ler e gerenciar importacoes.

## Consultas uteis de verificacao

Perfil atual:

```sql
select id, email, role, status
from public.profiles
order by created_at desc;
```

Usuarios sem profile:

```sql
select users.id, users.email
from auth.users users
left join public.profiles profiles on profiles.id = users.id
where profiles.id is null;
```

Politicas ativas:

```sql
select schemaname, tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```
