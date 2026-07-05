Scripts futuros para reconstruir indices derivados, como Meilisearch, a partir do Supabase/Postgres.

Estado atual:

- a busca publica ainda usa Supabase;
- `lib/search/documents.ts` define o formato dos documentos derivados;
- nenhum script de reindexacao real foi ativado.

Quando Meilisearch for implementado, os scripts desta pasta devem:

1. ler compositores e obras publicados no Supabase;
2. mapear registros para documentos de busca;
3. substituir ou atualizar o indice externo;
4. registrar falhas de sincronizacao.
