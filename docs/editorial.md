# Diretrizes Editoriais Iniciais

Esta etapa cria a fundacao tecnica para um fluxo editorial, sem implementar ainda o CRUD completo.

## Status editorial

As entidades principais usam:

- `draft`: cadastro em rascunho.
- `in_review`: cadastro enviado para revisao.
- `published`: cadastro publicado.
- `archived`: cadastro arquivado.

## Confiabilidade

Os niveis iniciais sao:

- `primary_source_confirmed`
- `secondary_source_confirmed`
- `composer_reported`
- `publisher_reported`
- `inferred`
- `pending`

## Regra central

Dados musicologicos nao devem ser publicados automaticamente a partir de importacao ou sugestao. Importacoes futuras devem criar registros revisaveis.
