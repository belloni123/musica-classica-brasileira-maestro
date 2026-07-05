# Preparacao para importacao

Importacao real de CSV/XLSX ainda nao foi implementada. A fundacao contem tabelas de controle e uma tela administrativa de leitura.

## Tabelas existentes

- `import_batches`
- `import_rows`

## Painel existente

`/admin/importacao` lista lotes ja existentes, se houver.

## Fluxo futuro recomendado

1. Upload do arquivo.
2. Criacao de `import_batches`.
3. Leitura do arquivo no servidor.
4. Criacao de `import_rows` com `raw_json`.
5. Validacao por entidade.
6. Normalizacao para `normalized_json`.
7. Tela de revisao dos erros e avisos.
8. Confirmacao manual de importacao.
9. Criacao ou atualizacao dos registros definitivos.
10. Registro em `revision_history` e `audit_logs`.

## Decisoes pendentes

- Formato de template CSV/XLSX por entidade.
- Estrategia de deduplicacao.
- Regras de merge.
- Campos obrigatorios por entidade.
- Limite de tamanho de arquivo.
