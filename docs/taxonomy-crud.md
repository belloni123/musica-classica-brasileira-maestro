# CRUD Administrativo de Taxonomias

## Rotas

- `/admin/taxonomias`
- `/admin/taxonomias/nova`
- `/admin/taxonomias/[id]/editar`

## Campos

- nome;
- tipo;
- slug;
- descricao.

## Slug

Se o slug for deixado vazio, ele e gerado a partir do nome.

Duplicidades sao evitadas com sufixo incremental:

```txt
orquestra-jovem
orquestra-jovem-2
```

## Permissoes

- `reviewer` visualiza a listagem.
- `editor` e `admin` criam e editam.

## Auditoria

Mutacoes registram:

- `revision_history` com `entity_type = taxonomy`;
- `audit_logs` com acoes `taxonomy.created` e `taxonomy.updated`.
