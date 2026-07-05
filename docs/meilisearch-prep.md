# Preparacao para Meilisearch

A busca publica atual usa consultas simples no Supabase. Isso e intencional para o MVP inicial.

## Fonte oficial

O Postgres/Supabase continua sendo a fonte oficial. Meilisearch sera um indice derivado e reconstruivel.

## Documento inicial

O arquivo `lib/search/documents.ts` define o formato inicial de documentos:

- `composer`
- `work`

Cada documento contem:

- `id`
- `type`
- `title`
- `slug`
- `subtitle`
- `summary`
- `publication_status`

## Estrategia futura

1. Buscar apenas registros `published`.
2. Mapear compositores e obras para documentos de busca.
3. Enviar documentos para Meilisearch.
4. Configurar ranking, filtros e facetas.
5. Trocar `/buscar` para consultar Meilisearch.
6. Manter fallback ou tarefa de reindexacao completa.

## O que ainda nao foi feito

- Dependencia do cliente Meilisearch.
- Variaveis obrigatorias.
- Script real de reindexacao.
- Webhook ou fila de sincronizacao.
- Facetas por instrumento, formacao, periodo, regiao e duracao.
