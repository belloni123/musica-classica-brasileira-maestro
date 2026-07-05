# Pendencias manuais

Estas etapas exigem acesso ao painel do Supabase, Coolify, Hostinger ou credenciais privadas. Elas nao devem ser automatizadas sem a conta conectada e permissao operacional explicita.

## Supabase

- Criar projeto Supabase Cloud.
- Copiar `Project URL`.
- Copiar `anon public key`.
- Manter `service_role key` apenas para rotinas server-side futuras, nunca em componente client-side.
- Aplicar migrations SQL.
- Aplicar seed SQL.
- Criar o primeiro usuario pelo fluxo normal da aplicacao.
- Promover o primeiro usuario para `admin`.
- Testar RLS com perfis reais.

## GitHub

- Confirmar que o repositorio remoto esta acessivel:
  - `belloni123/musica-classica-brasileira-maestro`
- Ao retomar em outro computador, clonar o repositorio e instalar dependencias.

## Coolify

- Criar app apontando para o repositorio GitHub.
- Configurar build com pnpm.
- Definir variaveis de ambiente.
- Configurar dominio.
- Rodar deploy inicial.

## Variaveis minimas

```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

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
