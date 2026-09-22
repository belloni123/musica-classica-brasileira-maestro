# Apresentação do catálogo

- O índice de compositores ordena e filtra pelo cabeçalho de exibição `Sobrenome, Nome`. Isso preserva a escolha editorial de sobrenomes compostos. Sem vírgula, usa o campo `surname`; sem ambos, mantém o nome disponível. A comparação usa português e desconsidera acentos.
- Lista e ficha mostram cidade/UF de nascimento. Estados brasileiros escritos por extenso são abreviados somente na apresentação. Valores ausentes não são preenchidos por suposição.
- A ficha da obra gera o código de instrumentação a partir de `work_instrumentation`, preservando os registros originais. Ordem: flauta, oboé, clarinete, fagote; trompa, trompete, trombone, tuba; `Tmp` para tímpanos e `Str` para cordas de arco cadastradas. Instrumentos adicionais permanecem indicados pelo nome.
- Exemplo com cadastro completo: `2 2 2 2 - 4 2 3 1 - Tmp - Str`.
- A lista individual fica recolhida em “Ver instrumentos e observações”. Texto livre não é interpretado automaticamente como dados estruturados.
- O código diferencia quantidade desconhecida (`?`), mínimo (`+`), intervalos e atributos (`*`). `0` em posição sem registro significa ausência de cadastro, não confirmação musicológica de ausência do instrumento.
- A pesquisa avançada permite combinar quantidades dos oito instrumentos, tímpanos e cordas. Todos os critérios precisam corresponder à mesma obra. Campos vazios não filtram; intervalos cadastrados aceitam valores dentro dos limites. Uma quantidade desconhecida ou instrumento sem registro nunca corresponde a uma busca numérica, nem mesmo por zero.
- A pesquisa detalhada continua exigindo acesso ao catálogo e usa o cliente sujeito a RLS; não utiliza a chave administrativa.
- Para registrar quantidade exata, preencher mínimo e máximo com o mesmo número. A mesma instrumentação estruturada alimenta o resumo e a busca.

## Verificação

`pnpm test`, `pnpm typecheck`, `pnpm lint` e `pnpm build`.

Testes cobrem sobrenomes, acentos, naturalidade incompleta, exemplo orquestral, instrumentos extras, atributos, intervalos, busca combinada e validação das quantidades. A checagem HTTP local com o banco real confirmou filtros A/G/N, ficha de compositor e bloqueio da pesquisa detalhada para visitante.
