# Setup do Supabase Cloud

Este guia estabiliza a fundacao com um Supabase real antes de qualquer CRUD, busca, pagamento ou importacao.

## 1. Criar o projeto Supabase

1. Acesse o painel do Supabase.
2. Crie um novo projeto.
3. Escolha uma regiao adequada ao publico principal.
4. Defina uma senha forte para o banco.
5. Aguarde o provisionamento do projeto.

Depois do projeto criado, acesse:

- `Project Settings > API`
- `Project Settings > Database`
- `SQL Editor`
- `Authentication`

## 2. Variaveis para `.env.local`

Crie um arquivo `.env.local` na raiz do projeto local com base em `.env.example`.

Para esta etapa, preencha:

```env
NEXT_PUBLIC_SITE_URL=https://obras.maestrothiagosantos.com.br
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_ANON_KEY
```

Onde encontrar:

- `NEXT_PUBLIC_SUPABASE_URL`: `Project Settings > API > Project URL`.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `Project Settings > API > anon public`.

Nao coloque `SUPABASE_SERVICE_ROLE_KEY` em arquivos client-side. Nesta etapa ele nao e necessario para rodar a aplicacao.

## 3. Aplicar a migration

Arquivo:

```txt
sql/migrations/0001_initial_foundation.sql
```

No Supabase:

1. Abra `SQL Editor`.
2. Crie uma nova query.
3. Cole o conteudo completo da migration.
4. Execute.
5. Confirme que nao houve erro.

O que a migration cria:

- enums;
- tabelas fundacionais;
- indices;
- triggers de `updated_at`;
- funcoes auxiliares de permissao;
- trigger de criacao automatica de `profiles`;
- politicas iniciais de RLS.

## 4. Aplicar o seed

Arquivo:

```txt
sql/seeds/0001_foundation_seeds.sql
```

No Supabase:

1. Abra `SQL Editor`.
2. Crie uma nova query.
3. Cole o conteudo completo do seed.
4. Execute.
5. Confirme que as familias instrumentais, instrumentos, papeis e taxonomias foram criados.

Validacao rapida:

```sql
select count(*) as total_roles from public.role_definitions;
select count(*) as total_families from public.instrument_families;
select count(*) as total_instruments from public.instruments;
select count(*) as total_taxonomies from public.taxonomies;
```

## 5. Criar o primeiro usuario

Ha duas opcoes.

Opcao A: pela aplicacao local

1. Rode o projeto com `.env.local` configurado.
2. Acesse `/cadastro` no ambiente local ou publicado.
3. Crie a primeira conta.

Opcao B: pelo painel Supabase

1. Acesse `Authentication > Users`.
2. Clique em `Add user`.
3. Informe e-mail e senha.
4. Marque o e-mail como confirmado, se necessario.

Nos dois casos, a trigger `public.handle_new_user()` deve criar automaticamente o registro correspondente em `public.profiles`.

## 6. Validar se o profile foi criado

No SQL Editor:

```sql
select
  users.id,
  users.email,
  profiles.full_name,
  profiles.role,
  profiles.status,
  profiles.created_at
from auth.users users
left join public.profiles profiles on profiles.id = users.id
order by users.created_at desc;
```

Resultado esperado:

- o usuario aparece em `auth.users`;
- existe uma linha correspondente em `public.profiles`;
- `role` inicial e `user`.

Se o usuario existir, mas o profile nao existir, rode:

```sql
insert into public.profiles (id, email, full_name)
select id, email, raw_user_meta_data ->> 'full_name'
from auth.users
where email = 'SEU_EMAIL_AQUI'
on conflict (id) do nothing;
```

## 7. Promover o primeiro usuario para admin

Depois de confirmar que o profile existe, rode:

```sql
update public.profiles
set role = 'admin'
where email = 'SEU_EMAIL_AQUI';
```

Validacao:

```sql
select id, email, full_name, role, status
from public.profiles
where email = 'SEU_EMAIL_AQUI';
```

Resultado esperado:

```txt
role = admin
```

## 8. Validar acesso administrativo

1. Rode o app local.
2. Acesse `/entrar`.
3. Entre com o usuario promovido para admin.
4. Acesse `/admin/dashboard`.

Resultado esperado:

- usuario anonimo e redirecionado para `/entrar`;
- usuario autenticado sem papel editorial e redirecionado para `/acesso-negado`;
- `admin`, `editor` e `reviewer` acessam o painel.

## 9. Configuracoes de seguranca do Auth

Antes de abrir cadastro real para usuarios externos, revise em `Authentication`:

- exigir confirmacao de e-mail;
- configurar politica minima de senha forte;
- revisar rate limits de login, cadastro e recuperacao;
- habilitar protecao anti-bot/CAPTCHA quando disponivel;
- restringir URLs de redirect aos dominios reais;
- configurar SMTP transacional proprio;
- desativar provedores OAuth nao utilizados;
- exigir processo interno de MFA para administradores, se disponivel.

O app tambem aplica validacao server-side, honeypot e limite inicial de tentativas, mas isso nao substitui as protecoes do Supabase e do provedor de deploy.

## 10. Observacoes de compatibilidade com Supabase Cloud

- `create extension if not exists pgcrypto` e compativel com Supabase Cloud.
- A trigger em `auth.users` e um padrao comum no Supabase para criar `profiles`.
- As funcoes de permissao usam `security definer` e `set search_path = public`.
- As politicas de `profiles` nao permitem que um usuario comum altere o proprio papel.
- Mudancas de papel devem ser feitas por SQL administrativo ou por uma tela admin futura protegida.

## 11. Ordem segura de execucao

1. Criar Supabase.
2. Preencher `.env.local`.
3. Aplicar migration.
4. Aplicar seed.
5. Criar primeiro usuario.
6. Validar `profiles`.
7. Promover primeiro admin.
8. Testar acesso a `/admin/dashboard`.
