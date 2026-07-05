# CRUD Administrativo de Instrumentos

## Rotas

- `/admin/instrumentos`
- `/admin/instrumentos/novo`
- `/admin/instrumentos/[id]/editar`

## Campos

- nome;
- nome plural;
- abreviacao;
- familia instrumental;
- subfamilia;
- nomes alternativos;
- instrumento brasileiro;
- ordem de exibicao;
- ativo/inativo;
- observacoes.

## Permissoes

- `reviewer` pode visualizar a listagem.
- `editor` e `admin` podem criar, editar, ativar e desativar.
- Visitantes sao enviados para `/entrar`.
- Usuarios comuns sao enviados para `/acesso-negado`.

## Auditoria

As mutacoes registram:

- `revision_history` com `entity_type = instrument`;
- `audit_logs` com acoes `instrument.created`, `instrument.updated`, `instrument.activated` e `instrument.deactivated`.

## Banco

Foi adicionada a migration `sql/migrations/0002_instrument_active.sql`, que inclui:

- coluna `active boolean not null default true` em `public.instruments`;
- indice `idx_instruments_active`.

Essa migration precisa ser aplicada no Supabase real depois da migration inicial.
