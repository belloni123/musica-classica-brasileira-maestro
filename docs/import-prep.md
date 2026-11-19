# Importação editorial

O catálogo recebe lotes de compositores, maestros e obras via API REST ou MCP. O editor pode preparar os lotes a partir de uma planilha CSV. A prévia valida as linhas e reverte as escritas. A aplicação usa o plano da prévia e registra o lote em `import_batches` e as linhas em `import_rows`.

Consulte o [guia do Claude Code](claude-code.md#2-importar-da-planilha) e o [contrato OpenAPI](https://obras.maestrothiagosantos.com.br/api/v1/openapi.json). O painel `/admin/importacao` acompanha os lotes aplicados.
