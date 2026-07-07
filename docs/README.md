# Documentacao do projeto

Este diretorio concentra a documentacao tecnica e operacional da plataforma.

## Leitura principal

- `project-status.md`: estado atual do produto e limites conhecidos.
- `security.md`: postura de seguranca, controles implementados e checklist de producao.
- `manual-pending-setup.md`: itens que dependem de configuracao manual em servicos externos.
- `supabase-setup.md`: passo a passo para configurar Supabase Cloud.
- `production-deploy.md`: checklist de publicacao em Coolify e Supabase.
- `database.md`: visao geral do schema.
- `permissions.md`: papeis e regras de acesso.

## Implementacoes por area

- `composer-crud-test-report.md`: relatorio de testes do CRUD de compositores.
- `instrument-crud.md`: CRUD de instrumentos.
- `work-crud.md`: CRUD inicial de obras.
- `work-instrumentation.md`: instrumentacao por obra.
- `source-holder-crud.md`: detentores/fontes.
- `reference-crud.md`: referencias bibliograficas.
- `taxonomy-crud.md`: taxonomias.
- `import-prep.md`: preparacao para importacao.
- `billing-prep.md`: preparacao para assinatura.
- `daniels-orchestral-audit.md`: auditoria de referencia do Daniels' Orchestral Music Online.
- `meilisearch-prep.md`: preparacao para busca dedicada.

## Especificacoes de referencia

- `specs/functional-specification.md`: especificacao funcional de referencia.
- `specs/technical-stack-recommendation.md`: recomendacao tecnica inicial.

## Higiene de repositorio

Nao versionar:

- `.env`, `.env.local` ou qualquer arquivo com valores reais de variaveis.
- `.vercel/`, `.next/`, `node_modules/` ou artefatos de build.
- dumps de banco com dados reais.
- exports contendo e-mails, telefones, enderecos ou dados pessoais.
- chaves privadas, tokens, certificados ou credenciais de servicos.
