# CRUD Administrativo de Fontes, Acervos e Instituições

## Rotas

- `/admin/fontes`
- `/admin/fontes/novo`
- `/admin/fontes/[id]/editar`

## Campos

- nome;
- tipo;
- pais;
- estado;
- cidade;
- endereco;
- e-mail;
- telefone;
- website;
- pessoa de contato;
- observacoes;
- ativo/inativo.

## Permissoes

- `reviewer` pode visualizar a listagem.
- `editor` e `admin` podem criar, editar, ativar e desativar.
- Mutacoes sao protegidas por server actions com `requireEditorialWriteAccess()`.

## Auditoria

Mutacoes registram:

- `revision_history` com `entity_type = source_holder`;
- `audit_logs` com acoes `source_holder.created`, `source_holder.updated`, `source_holder.activated` e `source_holder.deactivated`.

## Observacao

Esse CRUD prepara o cadastro de editoras, acervos, bibliotecas, instituicoes, websites e pessoas de contato para vinculos futuros com obras, manuscritos e materiais.
