# Deploy de producao

Dominio: `https://obras.maestrothiagosantos.com.br`

Projeto: `Brasil Orquestral`

## Publicação das melhorias de novembro no ambiente existente

O Coolify acompanha a branch `main` com deploy automático. A versão anterior confirmada é `11edb95`. Mantenha o pacote local até a autorização para publicar. A ordem é **backup, migrações, atualização do esquema do backup e publicação da aplicação**.

### 1. Confirmar o backup anterior à publicação

- Confira a cópia criptografada mais recente na pasta privada `Backups privados — Brasil Orquestral` do Google Drive. Em uma janela com edições posteriores ao último backup, gere e confira uma nova cópia antes de migrar.
- O teste de 19/11/2026 restaurou 128 registros de 17 tabelas e validou um objeto de teste separado. A cópia cobre o acervo e o Storage. Contas e auditoria ficam fora dessa rotina.
- Registre o commit em execução no Coolify para poder restaurar a versão anterior da aplicação.

### 2. Aplicar as migrações no Supabase

No ambiente atual, a importação `import_catalog_v1` já existe. Confira o histórico e aplique somente os arquivos pendentes abaixo, um por vez, na ordem indicada. Cada arquivo tem sua própria transação. Interrompa a sequência se um arquivo falhar.

| Ordem | Migração | O que habilita |
| --- | --- | --- |
| 1 | [20261119194530_optimize_admin_work_save.sql](../sql/migrations/20261119194530_optimize_admin_work_save.sql) | Salva a obra e as vozes do coro na mesma transação. |
| 2 | [20261119195538_filter_catalog_instrumentation.sql](../sql/migrations/20261119195538_filter_catalog_instrumentation.sql) | Filtra instrumentação e quantidades antes de paginar. |
| 3 | [20261119200206_import_structured_instrumentation.sql](../sql/migrations/20261119200206_import_structured_instrumentation.sql) | Importa instrumentação estruturada. Usa a função de normalização criada na etapa 2. |

Depois das três migrações, confirme que o PostgREST expõe `save_editorial_work`, `search_catalog_instrumentation` e `import_catalog_v1` para os papéis previstos. Confira também a coluna `work_instrumentation.imported_from_sheet` com padrão `false`. Os registros antigos de instrumentação conservam o vínculo com suas obras e instrumentos. Para o projeto existente, preserve a configuração de Auth e as tabelas de referência já semeadas.

### 3. Atualizar o esquema que acompanha o backup

Assim que o Supabase estiver com as três migrações, copie os arquivos aplicados para a pasta `schema` do backup neste Mac. Isso inclui no próximo arquivo do Drive o esquema necessário para restaurar a coluna nova. Deixe as versões anteriores do Drive com o esquema que já está dentro delas.

```sh
backup_schema="$HOME/.codex/private/brasil-orquestral-backup/schema"
install -m 600 sql/migrations/20261119194530_optimize_admin_work_save.sql "$backup_schema/"
install -m 600 sql/migrations/20261119195538_filter_catalog_instrumentation.sql "$backup_schema/"
install -m 600 sql/migrations/20261119200206_import_structured_instrumentation.sql "$backup_schema/"
```

### 4. Publicar a aplicação no Coolify

Com o banco verificado, integre a versão revisada à `main` remota e acompanhe o deploy automático do Coolify até concluir. Confirme o commit publicado.

Confira, após a publicação:

1. Login de editor e abertura do painel. Em um rascunho separado para verificação, salvar uma obra com coro, adicionar instrumentação em lote e atualizar o campo de material.
2. Busca por quantidade em obras publicadas, com composição de filtros e paginação. Na ficha, confira texto livre, link clicável e ausência da seção quando o campo estiver vazio e a obra não tiver fontes vinculadas.
3. API e MCP com conta ativa. Chamadas sem token passam a exigir autenticação. Confirme que uma prévia de importação com instrumentação mostra as quantidades e preserva os dados até a aplicação do lote.
4. Primeira cópia posterior à migração no Drive. Confirme que as três migrações estão no arquivo criptografado e que a cópia restaura localmente.

Se o build ou a aplicação apresentar falha, mantenha as migrações e considere restaurar o último commit saudável no Coolify. No commit `11edb95`, consultas REST e MCP ao catálogo publicado são públicas e o formulário de material exige URL. Se precisar manter a autenticação das integrações ou editar fichas que passaram a guardar texto livre, priorize corrigir e republicar a aplicação. Após o rollback, valide login, catálogo e painel.

## Configuração inicial em um projeto novo

1. Criar um projeto Supabase Cloud.
2. Em um projeto novo, aplicar todos os arquivos de `sql/migrations/` em ordem de nome e depois `sql/seeds/0001_foundation_seeds.sql`. A migração `20261119183823_catalog_api_import.sql` habilita o diretório de maestros e a importação editorial. Em um ambiente existente, aplique somente migrações pendentes depois de conferir o histórico do Supabase.
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
7. Conferir `/maestros` e `/integracoes`. Em `/api/v1/catalog/works` e no POST de `/api/mcp`, conferir `401` sem token, `403` com conta inativa e consulta bem-sucedida com `Authorization: Bearer` de uma conta ativa. Para validar o acesso editorial, use a prévia com a conta de Editor e confira que as linhas permaneceram sem alteração. [Guia do Claude Code](claude-code.md)
