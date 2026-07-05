# CRUD Administrativo Inicial de Obras

## Rotas

- `/admin/obras`
- `/admin/obras/nova`
- `/admin/obras/[id]/editar`

## Escopo implementado

CRUD inicial de obras com:

- compositor;
- titulo canonico;
- titulo de exibicao;
- titulos alternativos;
- titulo original;
- titulo traduzido;
- anos de composicao e revisao;
- opus, catalogo e numero de catalogo;
- duracao;
- formacao;
- dificuldade;
- atributos praticos;
- status de direitos;
- resumo publico;
- notas para assinantes;
- notas de performance;
- notas editoriais;
- fonte principal;
- instrumentacao textual;
- confiabilidade;
- status editorial via publicar/arquivar.

## Slug

O slug e gerado automaticamente a partir do titulo canonico e recebe sufixo incremental quando ha colisao.

## Permissoes

- `reviewer` pode visualizar a listagem de obras.
- `editor` e `admin` podem criar, editar, publicar e arquivar.
- Visitantes e usuarios comuns continuam bloqueados pelas regras gerais do admin.

## Auditoria

Mutacoes registram:

- `revision_history` com `entity_type = work`;
- `audit_logs` com acoes `work.created`, `work.updated`, `work.published` e `work.archived`.

## Fora deste corte

- instrumentacao estruturada completa;
- vinculos com fontes;
- vinculos com referencias;
- importacao;
- busca avancada;
- pagina publica completa de obra.
