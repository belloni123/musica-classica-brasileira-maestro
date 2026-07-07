# Deploy de producao

Dominio: `https://obras.maestrothiagosantos.com.br`

Projeto Coolify: `Musica Classica Brasileira`

## Supabase

1. Criar um projeto Supabase Cloud.
2. Em `SQL Editor`, aplicar nesta ordem:
   - `sql/migrations/0001_initial_foundation.sql`
   - `sql/migrations/0002_instrument_active.sql`
   - `sql/migrations/0003_subscription_foundation.sql`
   - `sql/seeds/0001_foundation_seeds.sql`
3. Em `Authentication > Users`, criar o usuario:
   - email: `felipe@agenciab16.com.br`
   - senha: usar a senha definida pelo operador do projeto.
   - marcar o e-mail como confirmado.
4. Em `SQL Editor`, executar:
   - `sql/production/0001_bootstrap_admin_profile.sql`
5. Em `Authentication > URL Configuration`, configurar:
   - Site URL: `https://obras.maestrothiagosantos.com.br`
   - Redirect URLs: `https://obras.maestrothiagosantos.com.br/**`

## Variaveis no Coolify

Obrigatorias:

```env
NEXT_PUBLIC_SITE_URL=https://obras.maestrothiagosantos.com.br
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Reservadas para proximas fases:

```env
DATABASE_URL=
MEILISEARCH_HOST=
MEILISEARCH_API_KEY=
PAYMENT_PROVIDER=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
ASAAS_API_KEY=
RESEND_API_KEY=
SENTRY_DSN=
```

## Coolify

Configuracao recomendada:

- Build pack: Dockerfile.
- Porta exposta: `3000`.
- Dominio: `obras.maestrothiagosantos.com.br`.
- HTTPS: ativo.
- Comando de build: o Dockerfile executa `pnpm build`.
- Comando de start: o Dockerfile executa `node server.js`.

Depois de definir as variaveis, rodar `Redeploy` no Coolify.

## Validacao

1. Abrir `https://obras.maestrothiagosantos.com.br`.
2. Acessar `/entrar`.
3. Entrar com o admin criado no Supabase.
4. Confirmar redirecionamento para `/admin/dashboard`.
5. Criar um assinante em `/admin/usuarios`.
6. Fazer login com o assinante e confirmar acesso a `/minha-conta` e ao catalogo publicado.
