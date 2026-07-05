# CRUD Administrativo de Referências Bibliográficas

## Rotas

- `/admin/referencias`
- `/admin/referencias/nova`
- `/admin/referencias/[id]/editar`

## Campos

- tipo;
- titulo;
- autor(es);
- ano;
- editora/publicacao;
- instituicao;
- local;
- DOI;
- URL;
- data de acesso;
- observacoes.

## Observacoes de schema

O schema atual nao possui coluna ISBN separada. Se ISBN se tornar necessario, a recomendacao e adicionar uma migration especifica ou armazenar temporariamente em `notes` apenas quando inevitavel.

## Permissoes

- `reviewer` visualiza listagem.
- `editor` e `admin` criam e editam.
- Mutacoes sao protegidas com `requireEditorialWriteAccess()`.

## Auditoria

Mutacoes registram:

- `revision_history` com `entity_type = bibliographic_reference`;
- `audit_logs` com acoes `reference.created` e `reference.updated`.

## Preparacao futura

As referencias serao vinculadas a compositores por `composer_references` e a obras por `work_references`.
