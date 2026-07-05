# Pendencias manuais

Estas etapas exigem acesso ao painel do Supabase, Coolify, Hostinger ou credenciais privadas. Elas nao devem ser automatizadas sem a conta conectada e permissao operacional explicita.

## Supabase

- [ ] Criar projeto Supabase Cloud.
- [ ] Copiar `Project URL`.
- [ ] Copiar `anon public key`.
- [ ] Preencher `.env.local` com `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] Aplicar `sql/migrations/0001_initial_foundation.sql`.
- [ ] Aplicar `sql/migrations/0002_instrument_active.sql`.
- [ ] Aplicar `sql/seeds/0001_foundation_seeds.sql`.
- [ ] Criar o primeiro usuario pelo fluxo `/cadastro`.
- [ ] Promover o primeiro usuario para `admin` via SQL.
- [ ] Criar usuarios/perfis de teste para `editor`, `reviewer` e `user`.
- [ ] Testar RLS com perfis reais.
- [ ] Manter `service_role key` apenas para rotinas server-side futuras, nunca em componente client-side.
- [ ] Ativar confirmacao de e-mail, politica de senha forte e protecoes anti-bot/rate limit do Supabase Auth antes de abrir cadastro real.

SQL de promocao do primeiro admin, substituindo o email:

```sql
update public.profiles
set role = 'admin'
where email = 'SEU_EMAIL';
```

## GitHub

- [ ] Confirmar que o repositorio remoto esta acessivel no GitHub.
- [ ] Ao retomar em outro computador, clonar o repositorio e instalar dependencias.

## Coolify

- [ ] Criar app apontando para o repositorio GitHub.
- [ ] Configurar build com pnpm.
- [ ] Definir variaveis de ambiente.
- [ ] Configurar dominio.
- [ ] Rodar deploy inicial.
- [ ] Garantir HTTPS obrigatorio.
- [ ] Definir variaveis sensiveis somente no painel do Coolify.
- [ ] Confirmar `NEXT_PUBLIC_DEMO_MODE=false` no ambiente real.

## Seguranca antes de producao

- [ ] Revisar `docs/security.md`.
- [ ] Rodar varredura por segredos antes do push/deploy.
- [ ] Confirmar que `.env.local`, `.vercel/`, dumps e chaves privadas nao estao versionados.
- [ ] Configurar camada externa de rate limit/WAF quando houver trafego real.

Comandos recomendados no Coolify:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

## Variaveis minimas

```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_DEMO_MODE=false
```

Para publicar uma demo navegavel sem Supabase real, usar:

```env
NEXT_PUBLIC_DEMO_MODE=true
```

Nesse modo os dados sao ficticios e nao persistentes.

## Variaveis futuras

Estas ainda nao sao obrigatorias para o MVP atual:

```env
SUPABASE_SERVICE_ROLE_KEY=
MEILISEARCH_HOST=
MEILISEARCH_ADMIN_KEY=
PAYMENT_PROVIDER=
PAYMENT_WEBHOOK_SECRET=
```

`SUPABASE_SERVICE_ROLE_KEY`, chaves de Meilisearch e segredos de pagamento devem ficar apenas no ambiente do servidor.
