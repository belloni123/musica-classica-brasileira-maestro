# Instrumentação Estruturada da Obra

## Escopo implementado

Na página `/admin/obras/[id]/editar`, foi adicionada uma primeira versão da instrumentação estruturada.

Ela permite:

- listar instrumentos vinculados à obra;
- adicionar instrumento;
- remover instrumento;
- informar quantidade minima;
- informar quantidade maxima;
- informar quantidade textual;
- marcar obrigatório;
- marcar opcional;
- marcar dobramento;
- selecionar instrumento dobrado;
- marcar substituível;
- informar observação;
- informar fonte.

## Validação

As quantidades sao validadas por Zod:

- quantidades devem ser inteiros positivos ou zero;
- quantidade minima nao pode ser maior que quantidade maxima.

## Auditoria

Mutacoes registram:

- `revision_history` com `entity_type = work_instrumentation`;
- `audit_logs` com acoes `work_instrumentation.created` e `work_instrumentation.removed`.

## Fora deste corte

- edicao inline de uma linha de instrumentacao;
- ordenacao customizada da instrumentacao;
- validacao musicologica avancada;
- parser automatico de instrumentacao textual;
- busca por operadores de instrumentacao.

Esses recursos ficam para uma etapa posterior.
