# Brasil Orquestral com Claude Code

Este guia cobre dois trabalhos do Thiago. O dia a dia editorial passa pela API ou pelo MCP do Brasil Orquestral. Mudanças de layout, comportamento ou estrutura do banco passam pelo código no GitHub e por migrações revisadas.

## 1. Preparar o ambiente

Use Node.js 22, Python 3, Git e Claude Code. Clone o repositório e instale as dependências.

```bash
git clone https://github.com/belloni123/musica-classica-brasileira-maestro.git
cd musica-classica-brasileira-maestro
corepack pnpm install --frozen-lockfile --ignore-scripts
```

Felipe pode habilitar a conta pessoal do Thiago como **Editor** em `/admin/usuarios`. Para alterar o software, Thiago também precisa de acesso de colaborador ao repositório. O acesso à gestão do Supabase é necessário para criar ambientes de desenvolvimento hospedados ou publicar migrações como operador.

### Consultar o catálogo

```bash
claude mcp add --transport http brasil-orquestral https://obras.maestrothiagosantos.com.br/api/mcp
claude
```

Dentro do Claude Code, veja a conexão em `/mcp`. Exemplo de pedido:

> Consulte o Brasil Orquestral por Villa-Lobos. Mostre os nomes, títulos e slugs encontrados e informe a paginação.

O mesmo catálogo está disponível via [API REST](https://obras.maestrothiagosantos.com.br/integracoes). A consulta pública cobre compositores, maestros e obras publicados.

### Habilitar importação editorial

Na raiz do clone, crie `.env.local` a partir de `.env.example` e preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` com a URL e a chave pública do projeto. A chave publicável também funciona nesse campo. Obtenha os dois valores em **Connect** no painel do Supabase. Use a conta de Editor do Thiago para o comando a seguir.

Configure a conexão editorial na máquina em que vai rodar o Claude Code. As aspas simples preservam a referência à variável, que o Claude Code preenche durante a sessão.

```bash
claude mcp add-json brasil-orquestral-editorial '{"type":"http","url":"https://obras.maestrothiagosantos.com.br/api/mcp","headers":{"Authorization":"Bearer ${BRASIL_ORQUESTRAL_ACCESS_TOKEN}"}}'
```

A cada sessão editorial, execute na raiz do clone, em um terminal interativo macOS ou Linux:

```bash
BRASIL_ORQUESTRAL_ACCESS_TOKEN="$(node scripts/import/token-editorial.mjs)" && \
  BRASIL_ORQUESTRAL_ACCESS_TOKEN="$BRASIL_ORQUESTRAL_ACCESS_TOKEN" claude
unset BRASIL_ORQUESTRAL_ACCESS_TOKEN
```

O script pede e-mail e senha com a senha oculta e entrega um token com validade limitada ao processo. Quando o token expirar, feche o Claude Code e repita o login. Mantenha senha, token, chaves de serviço e arquivos de trabalho privados fora do chat e do Git.

## 2. Importar da planilha

Crie uma aba por entidade e exporte cada uma como **CSV UTF-8**. Importe compositores antes de obras. Maestros têm cadastro próprio e aparecem no diretório `/maestros` após publicação.

| Aba | Entidade | Campos mínimos na criação |
| --- | --- | --- |
| Compositores | `composers` | `slug`, `canonical_name`, `display_name` |
| Maestros | `conductors` | `slug`, `canonical_name`, `display_name` |
| Obras | `works` | `slug`, `composer_slug`, `canonical_title`, `display_title` |

`canonical_name` e `canonical_title` guardam o nome de referência. `display_name` e `display_title` definem o texto exibido no site. Use slugs únicos por entidade, em minúsculas e sem acentos, como `sinfonia-exemplo`. Para atualizar, reutilize o slug exato do cadastro e envie somente os campos desejados. O `composer_slug` da obra referencia um compositor já cadastrado.

Células vazias preservam o valor atual. Use `<NULL>` para limpar um campo opcional e `[]` para limpar uma lista. Separe itens de uma lista com `|`. Registros novos começam em `draft` por padrão. Para publicar, inclua explicitamente `publication_status=published` após a revisão. Os outros estados são `in_review` e `archived`.

Exemplos de cabeçalhos e valores fictícios:

```csv
slug;canonical_name;display_name;birth_year;short_biography
compositor-exemplo;Nome Completo;Nome de Exibição;1904;Biografia curta para o catálogo.
```

```csv
slug;composer_slug;canonical_title;display_title;composition_year_start;duration_minutes;formation_type
sinfonia-exemplo;compositor-exemplo;Sinfonia n.º 1;Primeira Sinfonia;1940;27,5;Orquestra sinfônica
```

Campos opcionais incluem biografias e anos para pessoas, datas e nomes alternativos para compositores, e formação, duração, solista, instrumentação em texto, observações e resumo público para obras. O contrato lista os campos e tipos por entidade. Instrumentos individuais, movimentos, vozes, fontes e referências continuam no cadastro editorial próprio. O cadastro de maestros funciona como diretório de perfis. Uma eventual ficha de regência por apresentação ou obra requer modelar esse vínculo em uma migração. [Contrato OpenAPI](https://obras.maestrothiagosantos.com.br/api/v1/openapi.json)

Para converter a primeira parte de uma aba, rode:

```bash
node scripts/import/planilha.mjs composers /caminho/compositores.csv 1 > /tmp/brasil-orquestral-lote.json
```

O conversor avisa quantas partes ficaram disponíveis. Repita com `2`, `3` e assim por diante. Cada lote recebe até 100 linhas e o corpo da chamada aceita até 1 MiB. O conversor também aceita CSV separado por vírgulas.

Pedido que o Thiago pode usar no Claude Code:

> Leia o arquivo /tmp/brasil-orquestral-lote.json e chame prever_importacao com os argumentos do arquivo. Mostre os slugs que serão criados, os campos que mudarão, o estado de publicação e as linhas com erro. Aguarde minha aprovação antes de aplicar. Após eu aprovar, chame aplicar_importacao com os mesmos argumentos e o plan da prévia. Ao final, mostre o batch_id e confira no catálogo os registros publicados.

A prévia consulta o estado corrente e valida todas as linhas com as restrições do banco. A aplicação é transacional por lote. Se um registro mudar após a prévia, gere outra e revise o resultado. Repetir uma importação com os mesmos valores após nova prévia retorna `unchanged`. O histórico dos lotes aplicados aparece em `/admin/importacao`.

### Usar REST para importar

`POST /api/v1/imports` recebe o conteúdo do lote com `"mode": "preview"`. Para aplicar, envie novamente o mesmo lote com `"mode": "apply"` e o `"plan"` retornado. As duas chamadas usam o token editorial no cabeçalho `Authorization: Bearer` e `Content-Type: application/json`. Um erro `409` indica que é preciso revisar uma nova prévia.

## 3. Alterar frontend, backend e Supabase

1. Parta do código mais recente. Rode `git switch main`, `git pull --ff-only` e `git switch -c thiago/minha-alteracao`.
2. Descreva para o Claude Code a experiência desejada e dê um exemplo real de campo, tela e comportamento. Peça que leia os arquivos relacionados antes de editar.
3. Para layout e montagem das telas, consulte `app/(public)/`, `components/` e `app/globals.css`. Os formulários editoriais estão em `app/admin/`, `components/forms/` e `lib/validators/`. A consulta e a escrita de integrações estão em `app/api/` e `lib/integrations/`.
4. Para campos, tipos, relacionamentos e políticas RLS, crie uma migração nova em `sql/migrations/`. Valide em um Supabase local ou projeto de desenvolvimento com dados fictícios. Ao adicionar um campo, decida se ele é público, exclusivo da assinatura ou editorial e atualize as permissões, as consultas, os formulários e a apresentação. Se o campo entrar na importação, atualize o validador em `lib/integrations/schemas.ts` e a função de importação em uma nova migração.
5. Para testar localmente, configure `.env.local` com a URL e a chave pública do ambiente de desenvolvimento. Rode `corepack pnpm dev` e confira o resultado em `http://localhost:3000`. Antes do pull request, rode `corepack pnpm lint`, `corepack pnpm typecheck`, `corepack pnpm test` e `corepack pnpm build`. Confira também o que visitantes e editores conseguem fazer.
6. Faça push da branch e abra um pull request no GitHub com os arquivos alterados, exemplos e a ordem de execução da migração. A aplicação de produção lê a branch `main` no Coolify. Coordene a aplicação de migrações aditivas no Supabase antes do deploy do código que depende delas. Confira o domínio e o fluxo alterado após a publicação. [Deploy do projeto](production-deploy.md)

Exemplo de pedido para um campo que deve aparecer na ficha da obra:

> Quero um campo público “Estreia” na edição da obra e na ficha pública, e na importação por planilha. Use uma coluna opcional para preservar os cadastros antigos. Implemente a migração, o formulário, as consultas e o layout. Teste com uma obra antiga e uma nova no ambiente de desenvolvimento. Abra um pull request com o resultado e a ordem de publicação.

Se usar o MCP oficial do Supabase para explorar o banco, conecte-o ao projeto de desenvolvimento. Para inspeção da produção, use o modo de leitura com `project_ref` e `read_only=true`. O MCP Brasil Orquestral é o ponto de entrada para edição cotidiana de registros. [MCP oficial do Supabase](https://supabase.com/docs/guides/ai-tools/mcp) · [Configuração MCP no Claude Code](https://code.claude.com/docs/en/mcp)
