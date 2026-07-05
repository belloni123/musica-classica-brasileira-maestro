# Seguranca e boas praticas

Este documento registra a postura de seguranca esperada para o projeto real. O modo demo e apenas uma vitrine navegavel com dados ficticios.

## Controles implementados no app

- Autenticacao via Supabase Auth, sem senhas armazenadas pela aplicacao.
- Protecao server-side para `/admin` e area de conta.
- Verificacao de usuario autenticado, profile vinculado e papel permitido.
- Separacao de permissoes entre `user`, `reviewer`, `editor` e `admin`.
- Validacao server-side com Zod nos fluxos de autenticacao.
- Normalizacao de e-mail antes de login, cadastro e recuperacao de senha.
- Mensagens genericas de erro para reduzir enumeracao de usuarios.
- Honeypot simples em formularios de login, cadastro e recuperacao.
- Limite server-side de tentativas por IP e identidade para login, cadastro e recuperacao.
- Tempo minimo de resposta em autenticacao para reduzir pistas por timing.
- Headers HTTP basicos: `nosniff`, `DENY` para iframe, referrer policy, permissions policy, COOP e HSTS.
- RLS habilitado nas tabelas do Supabase.
- `SUPABASE_SERVICE_ROLE_KEY` nao e importado nem usado pela aplicacao atual.

## Limite de tentativas

Os limites atuais sao uma primeira camada dentro do servidor Next.js:

- login: 25 tentativas por IP e 5 por e-mail a cada 15 minutos;
- cadastro: 10 tentativas por IP e 3 por e-mail a cada 60 minutos;
- recuperacao de senha: 10 tentativas por IP e 3 por e-mail a cada 60 minutos.

Esse mecanismo usa memoria do processo. Em producao com multiplas instancias, ele deve ser complementado por uma camada compartilhada, como Redis/Upstash, Vercel Firewall, Cloudflare Turnstile/WAF ou rate limits no proxy do Coolify.

## Supabase Auth em producao

Configurar antes de abrir cadastro real:

- Confirmacao obrigatoria de e-mail.
- Politica minima de senha forte.
- Protecao contra senhas vazadas, se disponivel no plano.
- Rate limits do Supabase Auth revisados.
- CAPTCHA/bot protection para cadastro e recuperacao de senha, se disponivel.
- SMTP transacional proprio para entregabilidade.
- URLs permitidas de redirect restritas aos dominios reais.
- MFA obrigatorio para contas `admin`, se disponivel no plano/processo.
- Desativar provedores OAuth que nao forem usados.

## Banco e RLS

- Manter RLS sempre habilitado em tabelas de usuario e catalogo.
- Publico anonimo so deve ler registros publicados e campos explicitamente publicos.
- Dados de assinantes devem depender de permissao server-side e RLS, nao apenas bloqueio visual.
- `service_role` deve ser usado apenas em rotinas server-side isoladas, nunca em componentes client-side.
- Toda alteracao editorial relevante deve registrar `revision_history` e/ou `audit_logs`.

## GitHub e documentacao

- O repositorio pode conter nomes de variaveis, mas nunca valores reais.
- `.env.example` deve ter somente placeholders vazios.
- `.env.local`, `.vercel/`, dumps, certificados e chaves privadas devem permanecer ignorados.
- Documentos com informacao pessoal, credenciais, contratos, precos privados ou dados de usuarios nao devem ser commitados.
- Antes de cada push importante, rodar uma busca por termos como `SECRET`, `TOKEN`, `KEY=`, `DATABASE_URL`, `service_role`, `postgres://` e `eyJ`.

## Deploy

Em Vercel ou Coolify:

- Configurar variaveis sensiveis apenas no painel do provedor.
- Separar ambientes de demo, staging e producao.
- Usar HTTPS obrigatorio.
- Definir `NEXT_PUBLIC_DEMO_MODE=false` no projeto real.
- Revisar logs para nao imprimir credenciais, tokens ou payloads sensiveis.

## Pendencias recomendadas

- Trocar o rate limit em memoria por store compartilhado quando houver trafego real.
- Adicionar CAPTCHA no cadastro e recuperacao de senha.
- Adicionar testes automatizados para permissoes e RLS.
- Criar processo de revisao de secrets antes de releases.
- Configurar alertas para picos de erro de login e tentativas bloqueadas.

