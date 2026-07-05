# Documentação de Stack e Arquitetura Técnica

## Projeto: Plataforma de Pesquisa da Música Brasileira de Concerto

**Cliente:** projeto interno  
**Objetivo:** Criar uma plataforma de catalogação, pesquisa, assinatura e difusão da música brasileira de concerto, inspirada funcionalmente no Daniels’ Orchestral Music Online, mas com metodologia, base de dados, identidade e evolução próprias.

---

## 1. Diretriz central da arquitetura

O projeto deve começar de forma enxuta, mas não frágil.

A recomendação é evitar dois extremos:

1. **Arquitetura simples demais**, como WordPress com posts, ACF e filtros improvisados, porque a busca avançada, a modelagem de obras e a instrumentação estruturada exigem banco relacional bem planejado.
2. **Arquitetura complexa demais**, com microsserviços, Kubernetes, back-end excessivamente robusto e infraestrutura pesada antes de existir base de usuários, porque isso aumentaria custo, tempo de desenvolvimento e manutenção sem necessidade imediata.

A arquitetura ideal para este momento é:

> **Aplicação web moderna, banco relacional robusto, autenticação pronta, busca dedicada e deploy simplificado via Coolify.**

Considerando uma infraestrutura com Coolify e familiaridade com Supabase, a recomendação principal é construir o projeto usando:

- **Next.js** para front-end e back-end da aplicação.
- **Supabase** para banco Postgres, autenticação, storage e políticas de acesso.
- **Meilisearch** ou **Typesense** para busca avançada e busca textual performática.
- **Coolify** para deploy da aplicação e serviços auxiliares.
- **Stripe, Mercado Pago ou Asaas** para assinaturas.
- **GitHub** para versionamento e deploy automatizado.

---

## 2. Decisão recomendada de stack

### Stack principal recomendada

| Camada | Tecnologia recomendada | Justificativa |
|---|---|---|
| Front-end | Next.js | Permite páginas públicas rápidas, área logada, SSR, SEO, rotas dinâmicas e boa experiência de desenvolvimento. |
| Back-end da aplicação | Next.js API Routes / Server Actions | Suficiente para MVP e V1 sem criar um back-end separado. |
| Banco de dados | Supabase Postgres | Postgres relacional, robusto, familiar para você e adequado à modelagem complexa. |
| Autenticação | Supabase Auth | Evita construir login, recuperação de senha, sessão e segurança do zero. |
| Storage | Supabase Storage | Útil para PDFs, imagens, documentos, planilhas importadas e anexos administrativos. |
| Busca textual e filtros rápidos | Meilisearch | Fácil de subir via Docker, ótimo para busca textual, tolerância a erros, acentos e resposta rápida. |
| Deploy | Coolify na Hostinger | Você já possui a infraestrutura e consegue deployar containers com controle próprio. |
| Pagamentos | Stripe, Mercado Pago ou Asaas | Depende do público e cobrança. Stripe é tecnicamente excelente; Asaas/Mercado Pago podem facilitar operação no Brasil. |
| E-mails transacionais | Resend, Brevo ou Amazon SES | Para recuperação de senha, recibos, notificações e avisos administrativos. |
| Analytics | Plausible, Umami ou PostHog | Métricas de uso, buscas e comportamento sem depender apenas de Google Analytics. |
| Monitoramento | Uptime Kuma + Sentry | Uptime para disponibilidade; Sentry para erros da aplicação. |

---

## 3. Por que não começar com WordPress puro

Você trabalha com WordPress e Elementor, mas este projeto não é um site institucional comum. Ele é uma plataforma de dados.

WordPress puro pode funcionar bem para:

- Páginas institucionais.
- Blog.
- SEO editorial.
- Landing pages.
- Conteúdo de autoridade.

Mas ele não é a melhor base para:

- Busca avançada relacional.
- Instrumentação estruturada.
- Relações complexas entre obras, compositores, editoras, fontes, movimentos, vozes e instrumentos.
- Controle de assinatura granular.
- API futura.
- Performance em filtros combinados.

O problema não é o WordPress em si. O problema é usar `wp_posts` e `wp_postmeta` como banco principal para uma base musicológica complexa.

### Uso aceitável do WordPress neste projeto

Existem dois cenários possíveis:

#### Cenário A: Sem WordPress no MVP

Todo o projeto nasce em Next.js + Supabase.

Indicado quando:

- A prioridade é construir a plataforma corretamente desde o começo.
- O blog e as páginas editoriais podem esperar.
- A experiência do usuário precisa ser mais parecida com uma aplicação do que com um site comum.

#### Cenário B: WordPress apenas como camada editorial

WordPress fica separado, apenas para:

- Blog.
- Páginas institucionais.
- Artigos.
- SEO de conteúdo.
- Landing pages.

A aplicação principal continua em Next.js + Supabase.

Exemplo:

- `musica-brasileira.com.br` → site institucional e conteúdo.
- `app.musica-brasileira.com.br` → plataforma, busca, login e assinatura.

Esse cenário é bom para marketing, mas adiciona mais uma peça para manter.

### Recomendação prática

Para iniciar com menos complexidade:

> **Começar tudo em Next.js + Supabase, sem WordPress.**

Depois, se o projeto exigir produção editorial intensa, adicionar WordPress separado como CMS ou usar um CMS headless.

---

## 4. Por que Next.js é adequado para este projeto

Next.js é uma boa escolha porque permite unir site público, aplicação logada e APIs internas em um mesmo projeto.

Ele é adequado para:

- Home pública.
- Páginas de compositores indexáveis no Google.
- Páginas públicas de obras.
- Área de assinantes.
- Busca avançada.
- Painel administrativo.
- Rotas de API.
- Integração com Supabase.
- Integração com gateways de pagamento.
- Deploy via Docker.

A documentação oficial do Next.js informa que ele pode ser auto-hospedado em servidor Node.js, imagem Docker ou exportação estática. Para este projeto, o caminho recomendado é Docker, porque conversa bem com Coolify e preserva recursos dinâmicos da aplicação.

---

## 5. Por que Supabase é adequado

Supabase é recomendado porque entrega um conjunto de recursos que seriam caros e demorados para construir do zero:

- Banco Postgres completo.
- Autenticação.
- Storage.
- APIs automáticas.
- Row Level Security.
- Edge Functions, se necessário.
- Backups gerenciados nos planos pagos.

A própria documentação do Supabase apresenta o Postgres como fundação do produto, com Auth, Storage, Realtime e Edge Functions construídos ao redor do banco. Isso combina bem com a necessidade deste projeto, porque a base de obras precisa de um banco relacional real, não de uma estrutura improvisada.

### Uso recomendado do Supabase

No projeto, o Supabase deve ser usado para:

- Banco principal.
- Login e autenticação.
- Controle de sessão.
- Storage de arquivos.
- Políticas de acesso.
- Funções SQL para regras específicas.
- Auditoria básica, se bem modelada.

### O que não jogar automaticamente no Supabase

Evitar usar Supabase como solução para tudo.

Não recomendo depender apenas da busca nativa do banco para toda a experiência de busca textual. Para busca simples e pequenos filtros, Postgres resolve. Para busca textual rica, tolerância a erro, acentos, relevância e velocidade, é melhor usar um motor dedicado como Meilisearch ou Typesense.

---

## 6. Banco de dados: Supabase Postgres

O banco precisa ser o núcleo do projeto.

A modelagem deve nascer com tabelas próprias para:

- Compositores.
- Obras.
- Instrumentos.
- Instrumentação da obra.
- Movimentos.
- Vozes.
- Coros.
- Editoras.
- Acervos.
- Fontes.
- Referências bibliográficas.
- Manuscritos.
- Revisões editoriais.
- Usuários.
- Assinaturas.
- Buscas salvas.
- Favoritos.
- Listas de repertório.
- Logs de busca.

### Regra técnica importante

A instrumentação não deve ficar apenas como texto.

Cada obra deve ter:

1. **Instrumentação textual**, para leitura humana.
2. **Instrumentação estruturada**, para busca e filtros.

Exemplo:

Instrumentação textual:

> 2 flautas, 2 oboés, 2 clarinetes, 2 fagotes, 2 trompas, cordas.

Instrumentação estruturada:

| Obra | Instrumento | Quantidade mínima | Quantidade máxima | Opcional | Dobramento |
|---|---:|---:|---:|---|---|
| Obra X | Flauta | 2 | 2 | Não | Não |
| Obra X | Oboé | 2 | 2 | Não | Não |
| Obra X | Trompa | 2 | 2 | Não | Não |

Sem essa estrutura, o filtro “obras com até 2 trompas e sem harpa” vira gambiarra.

---

## 7. Busca: Postgres + Meilisearch

### Recomendação para o MVP

Usar dois níveis de busca:

1. **Postgres**, para filtros relacionais precisos.
2. **Meilisearch**, para busca textual rápida, tolerante e agradável.

### O que o Postgres resolve bem

- Duração mínima e máxima.
- Ano de composição.
- Compositor vivo ou falecido.
- Estado, região e país.
- Obra com coro.
- Obra com solista.
- Obra com instrumento específico.
- Quantidade de instrumentos.
- Disponibilidade de material.
- Status de direitos.
- Status editorial.

### O que o Meilisearch resolve melhor

- Busca por título.
- Busca por compositor.
- Busca sem acento.
- Busca com erro de digitação.
- Busca por nomes alternativos.
- Busca por tags.
- Busca instantânea.
- Ordenação por relevância textual.

### Por que Meilisearch

Meilisearch é um motor de busca open-source, simples de operar e fácil de subir em Docker. Para este projeto, ele tem boa relação entre poder e simplicidade.

Ele é mais leve e simples do que OpenSearch/Elasticsearch para o estágio inicial do projeto.

### Alternativa: Typesense

Typesense também é uma excelente opção. É rápido, moderno e muito bom para busca com filtros.

Entre Meilisearch e Typesense, minha recomendação prática inicial é:

> **Meilisearch se a prioridade for simplicidade operacional. Typesense se a prioridade for filtro facetado mais avançado desde cedo.**

Para o seu caso, eu começaria com **Meilisearch**.

---

## 8. Coolify na Hostinger

Você já possui Coolify na Hostinger. Isso é uma vantagem, porque reduz dependência de Vercel, Railway ou outros serviços externos.

Coolify é uma plataforma self-hosted para gerenciar aplicações, bancos e serviços em servidores próprios via Docker. A documentação oficial informa que ele pode trabalhar com Docker Compose e criar redes internas para serviços de uma aplicação, além de expor serviços por proxy quando necessário.

### O que hospedar no Coolify

Recomendação:

- Aplicação Next.js.
- Meilisearch.
- Uptime Kuma.
- Eventualmente Redis, se for necessário no futuro.
- Eventualmente um worker de sincronização.

### O que não necessariamente hospedar no Coolify no começo

Eu não hospedaria o banco principal no Coolify no primeiro momento se você já tem conforto com Supabase.

Motivos:

- Supabase já resolve autenticação.
- Supabase facilita RLS.
- Supabase tem painel bom para banco.
- Supabase reduz risco operacional com backup e manutenção.
- Você já conhece a ferramenta.

### Arquitetura recomendada com Coolify

```
Usuário
  ↓
Domínio público
  ↓
Next.js hospedado no Coolify
  ↓
Supabase Auth + Supabase Postgres + Supabase Storage
  ↓
Meilisearch hospedado no Coolify
```

### Serviços no Coolify

No Coolify, você teria pelo menos:

1. `app-tiago-musica`  
   Aplicação Next.js.

2. `meilisearch-tiago`  
   Motor de busca.

3. `uptime-kuma`  
   Monitoramento simples de disponibilidade.

4. `worker-sync-search`, se necessário  
   Serviço para manter Meilisearch sincronizado com Supabase.

---

## 9. Recomendação de domínios e ambientes

### Ambientes recomendados

Ter pelo menos dois ambientes:

| Ambiente | Uso | URL sugerida |
|---|---|---|
| Produção | Usuários reais | `app.dominio.com.br` |
| Homologação | Testes internos | `staging.dominio.com.br` |

Se quiser simplificar no início, pode começar com produção e uma branch de desenvolvimento local. Mas, para um projeto com assinatura e base de dados, homologação é altamente recomendada.

### Estrutura de subdomínios

Sugestão:

- `dominio.com.br` → landing/home institucional.
- `app.dominio.com.br` → plataforma logada.
- `admin.dominio.com.br` → opcional, apenas se o admin for separado.
- `staging.dominio.com.br` → homologação.

No MVP, pode ser tudo dentro do mesmo app:

- `/` home.
- `/buscar` busca pública.
- `/compositores` compositores.
- `/obras` obras.
- `/app` área logada.
- `/admin` painel administrativo.

---

## 10. Autenticação e autorização

### Autenticação

Usar Supabase Auth.

Recursos necessários:

- Cadastro por e-mail e senha.
- Login.
- Recuperação de senha.
- Confirmação de e-mail, se desejado.
- Sessão persistente.
- Proteção de rotas privadas.

### Autorização

Criar papéis no banco:

- `visitor`
- `subscriber_individual`
- `subscriber_professional`
- `institution_user`
- `institution_admin`
- `editor`
- `reviewer`
- `admin`

### Onde controlar permissões

Permissões devem existir em três camadas:

1. **Interface**, ocultando botões e áreas que o usuário não pode acessar.
2. **API**, bloqueando chamadas não autorizadas.
3. **Banco**, usando RLS quando fizer sentido.

A interface nunca deve ser a única proteção.

---

## 11. Assinaturas e pagamentos

### Opções principais

#### Stripe

Melhor escolha técnica.

Vantagens:

- Excelente documentação.
- Assinaturas recorrentes maduras.
- Webhooks confiáveis.
- Portal do cliente.
- Boa integração com SaaS.

Possíveis pontos de atenção:

- Operação no Brasil pode exigir atenção fiscal e comercial.
- Métodos de pagamento locais podem depender da configuração.

#### Mercado Pago

Boa opção para público brasileiro.

Vantagens:

- Familiaridade no Brasil.
- Pix e cartão.
- Boa aceitação local.

Pontos de atenção:

- Experiência de assinatura e webhooks pode exigir mais cuidado técnico.

#### Asaas

Boa opção para cobrança recorrente no Brasil.

Vantagens:

- Boleto, Pix, cartão.
- Bom para cobrança nacional.
- Útil para planos institucionais e cobrança B2B.

Pontos de atenção:

- Pode ser menos fluido para uma experiência SaaS internacional.

### Recomendação prática

Para MVP brasileiro:

> **Asaas ou Mercado Pago se a operação for 100% Brasil e precisar de Pix/boleto desde o início. Stripe se a prioridade for arquitetura SaaS mais limpa e escalável.**

Minha recomendação seria:

1. **Começar com Stripe**, se cartão for suficiente e a operação aceitar.
2. **Considerar Asaas**, se o Maestro quiser vender para instituições brasileiras com boleto, Pix e cobrança mais tradicional.

### Como o pagamento deve funcionar

Fluxo:

1. Usuário escolhe plano.
2. Vai para checkout.
3. Gateway confirma pagamento.
4. Webhook chama API interna.
5. Sistema atualiza assinatura no Supabase.
6. Usuário recebe acesso automaticamente.

Nunca liberar acesso apenas porque o front-end recebeu “sucesso”. A liberação deve vir de webhook validado.

---

## 12. Painel administrativo

### Recomendação

Construir o admin dentro do próprio Next.js.

Motivo:

- Menos ferramentas.
- Menos autenticações separadas.
- Permissões centralizadas.
- Mais controle sobre UX editorial.
- Melhor integração com Supabase.

### Bibliotecas úteis

- React Hook Form.
- Zod para validação.
- TanStack Table para tabelas administrativas.
- shadcn/ui ou Radix UI para componentes.
- TipTap ou editor markdown para campos longos.

### Módulos do admin no MVP

- Dashboard.
- Compositores.
- Obras.
- Instrumentos.
- Editoras e acervos.
- Fontes.
- Referências bibliográficas.
- Manuscritos.
- Importação de planilhas.
- Revisão editorial.
- Usuários.
- Assinaturas.

### Controle editorial

Todo cadastro importante deve ter status:

- Rascunho.
- Em revisão.
- Publicado.
- Arquivado.

Toda obra deve ter grau de confiabilidade:

- Confirmado por fonte primária.
- Confirmado por fonte secundária.
- Informado pelo compositor.
- Informado por editora.
- Inferido.
- Pendente.

---

## 13. Importação de dados

A importação deve ser pensada desde o início.

### Formatos aceitos no MVP

- CSV.
- XLSX.

### Fluxo recomendado

1. Admin faz upload da planilha.
2. Sistema lê colunas.
3. Sistema mostra prévia.
4. Admin mapeia campos, se necessário.
5. Sistema valida dados.
6. Sistema mostra erros e alertas.
7. Admin confirma importação.
8. Sistema cria registros como rascunho ou em revisão.

### Não importar diretamente como publicado

A importação deve gerar registros revisáveis.

Motivo:

- Evita duplicatas.
- Evita erro de instrumentação.
- Evita informação incompleta publicada.
- Preserva qualidade acadêmica.

---

## 14. Sincronização entre Supabase e Meilisearch

Como os dados principais estarão no Supabase e a busca textual no Meilisearch, será necessário sincronizar os registros.

### Estratégia simples para MVP

Ao criar ou editar uma obra/compositor:

1. Salva no Supabase.
2. Chama uma função interna.
3. Atualiza o índice do Meilisearch.

### Estratégia mais robusta para V2

Criar um worker de sincronização.

Função:

- Escutar alterações.
- Atualizar índices.
- Reindexar dados quando necessário.
- Registrar falhas.

### Índices recomendados

- `composers`
- `works`
- `sources`
- `global_search`

O índice `global_search` pode misturar compositores, obras e fontes para uma busca geral rápida.

---

## 15. API futura

A API não precisa ser construída no MVP, mas a arquitetura deve nascer preparada.

### Preparar desde o início

- Separar regras de negócio em funções reutilizáveis.
- Não acoplar tudo diretamente à interface.
- Criar endpoints internos claros.
- Registrar permissões por plano.
- Modelar tokens de API no banco, mesmo que não sejam usados no começo.

### API V2 possível

Endpoints:

- `GET /api/composers`
- `GET /api/composers/:id`
- `GET /api/works`
- `GET /api/works/:id`
- `POST /api/search`
- `GET /api/sources`

Controle:

- Token por usuário ou instituição.
- Limite por plano.
- Log de uso.
- Rate limit.

---

## 16. Segurança

### Princípios mínimos

- HTTPS obrigatório.
- Variáveis sensíveis fora do código.
- Webhooks validados.
- RLS no Supabase onde fizer sentido.
- Backups ativos.
- Logs de erro.
- Permissões por papel.
- Painel administrativo protegido.
- Rate limit em rotas sensíveis.
- Proteção contra enumeração de usuários.

### Dados sensíveis

Dados de cartão não devem passar pelo sistema.

O gateway deve cuidar disso.

A aplicação deve armazenar apenas:

- ID do cliente no gateway.
- ID da assinatura.
- Status da assinatura.
- Plano.
- Datas.

### LGPD

O sistema deve prever:

- Política de privacidade.
- Termos de uso.
- Registro de aceite.
- Exclusão de conta.
- Exportação de dados pessoais.
- Controle de comunicações.

---

## 17. Backups

### Banco

Se usar Supabase gerenciado:

- Verificar plano com backup automático.
- Ativar rotina de exportação periódica para segurança adicional.
- Criar snapshots antes de grandes importações.

### Meilisearch

O Meilisearch pode ser reconstruído a partir do banco principal.

Ainda assim, recomenda-se:

- Volume persistente no Coolify.
- Snapshot periódico, se disponível.
- Script de reindexação completo.

### Storage

Arquivos importantes devem ter cópia externa.

Sugestão:

- Supabase Storage como fonte operacional.
- Backup periódico para outro local, se o acervo crescer.

---

## 18. Observabilidade e manutenção

### Uptime

Usar Uptime Kuma no Coolify para monitorar:

- Home.
- Login.
- Busca.
- API interna.
- Meilisearch.

### Erros

Usar Sentry para capturar:

- Erros de front-end.
- Erros de API.
- Falhas em checkout.
- Falhas em importação.
- Falhas de sincronização com busca.

### Logs importantes

Registrar:

- Login administrativo.
- Alterações em obras.
- Publicações.
- Importações.
- Erros de pagamento.
- Webhooks recebidos.
- Alterações de assinatura.
- Buscas sem resultado.

---

## 19. UI e componentes

Mesmo que a parte visual venha depois, a escolha de UI impacta velocidade.

### Recomendação

Usar:

- Tailwind CSS.
- shadcn/ui.
- Radix UI.
- Lucide Icons.
- TanStack Table.
- React Hook Form.
- Zod.

Essa combinação permite montar uma interface moderna, consistente e rápida, sem depender de bibliotecas visuais engessadas.

### Por que não usar template pronto genérico

Templates prontos podem ajudar visualmente, mas esse projeto tem formulários e filtros muito específicos.

O painel de cadastro de obra, por exemplo, terá:

- Campos textuais.
- Relações.
- Instrumentação dinâmica.
- Movimentos.
- Fontes.
- Referências.
- Manuscritos.
- Status editorial.

Um template genérico pode atrapalhar mais do que ajudar.

---

## 20. Inteligência artificial no projeto

IA não deve ser o núcleo do MVP, mas pode entrar como camada de produtividade.

### Usos seguros no MVP ou V1

- Ajudar a normalizar títulos.
- Sugerir tags a partir de descrição.
- Sugerir resumo público a partir de dados estruturados.
- Ajudar na busca em linguagem natural, ainda com confirmação do usuário.
- Ajudar editores a identificar campos faltantes.

### Usos que exigem cautela

- Criar informação musicológica sem fonte.
- Inferir instrumentação sem partitura.
- Determinar direitos autorais sem validação.
- Publicar dados automaticamente.

### Regra editorial

IA pode sugerir. Editor humano aprova.

---

## 21. Arquitetura por fases

## Fase 0: Fundação técnica

Objetivo: preparar base correta.

Entregas:

- Repositório GitHub.
- Projeto Next.js.
- Supabase configurado.
- Modelagem inicial do banco.
- Autenticação.
- Deploy via Coolify.
- Domínio e SSL.
- Estrutura inicial de layout.
- Painel admin protegido.

## Fase 1: Catálogo básico

Objetivo: cadastrar e exibir dados.

Entregas:

- CRUD de compositores.
- CRUD de obras.
- CRUD de instrumentos.
- Página pública de compositor.
- Página pública de obra.
- Status editorial.
- Controle básico de publicação.

## Fase 2: Instrumentação estruturada

Objetivo: tornar a base pesquisável de verdade.

Entregas:

- Dicionário de instrumentos.
- Relação obra-instrumento.
- Dobramentos.
- Instrumentos opcionais.
- Instrumentação textual + estruturada.
- Validação básica.

## Fase 3: Busca avançada

Objetivo: entregar o valor central do produto.

Entregas:

- Busca simples.
- Busca avançada.
- Filtros por compositor.
- Filtros por obra.
- Filtros por duração.
- Filtros por ano.
- Filtros por instrumentação.
- Resultados paginados.
- URL compartilhável.

## Fase 4: Assinaturas

Objetivo: monetizar.

Entregas:

- Planos.
- Checkout.
- Webhooks.
- Área do assinante.
- Paywall.
- Controle de plano.
- Liberação automática.

## Fase 5: Recursos acadêmicos

Objetivo: elevar valor científico.

Entregas:

- Referências bibliográficas.
- Manuscritos.
- Histórico de revisão.
- Grau de confiabilidade.
- Fontes primárias/secundárias.
- Como citar a base.

## Fase 6: Produtividade do usuário

Objetivo: aumentar retenção.

Entregas:

- Favoritos.
- Listas de repertório.
- Buscas salvas.
- Exportação CSV.
- Exportação PDF.
- Copiar referência.

## Fase 7: Institucional e API

Objetivo: escalar comercialmente.

Entregas:

- Plano institucional.
- Múltiplos usuários.
- Domínio/IP institucional.
- API.
- Tokens.
- Rate limit.
- Relatórios.

---

## 22. Estrutura de repositório recomendada

```txt
project-root/
  app/
    (public)/
      page.tsx
      buscar/
      compositores/
      obras/
      planos/
      sobre/
    (auth)/
      entrar/
      cadastro/
      recuperar-senha/
    (app)/
      minha-conta/
      favoritas/
      listas/
      buscas-salvas/
    admin/
      dashboard/
      compositores/
      obras/
      instrumentos/
      fontes/
      importacao/
      usuarios/
  components/
    ui/
    forms/
    search/
    tables/
  lib/
    supabase/
    auth/
    permissions/
    search/
    payments/
    validators/
  server/
    services/
    repositories/
    use-cases/
  sql/
    migrations/
    seeds/
  scripts/
    import/
    reindex/
  docs/
    database.md
    api.md
    editorial.md
  docker-compose.yml
  Dockerfile
```

---

## 23. Variáveis de ambiente

Exemplo de variáveis necessárias:

```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
MEILISEARCH_HOST=
MEILISEARCH_API_KEY=
PAYMENT_PROVIDER=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
ASAAS_API_KEY=
RESEND_API_KEY=
SENTRY_DSN=
```

Nunca commitar essas variáveis no GitHub.

---

## 24. Docker e deploy

### Aplicação Next.js

O projeto deve ter Dockerfile próprio.

Coolify pode puxar do GitHub, buildar e publicar automaticamente.

### Meilisearch

Pode rodar como serviço separado no Coolify usando Docker.

### Supabase

Recomendação inicial:

- Usar Supabase Cloud.
- Não self-hostar Supabase no Coolify agora.

Motivo:

Self-hostar Supabase aumenta bastante a responsabilidade operacional. Para este projeto, no estágio inicial, isso não compensa.

---

## 25. Escolha final recomendada

Considerando sua realidade atual:

- Você já usa Coolify na Hostinger.
- Você já conhece Supabase.
- O projeto começa aos poucos.
- O projeto precisa crescer sem reescrita imediata.
- A base exige busca e modelagem séria.
- O orçamento e a complexidade precisam ser controlados.

A recomendação final é:

> **Next.js + Supabase Cloud + Meilisearch no Coolify + deploy da aplicação no Coolify.**

Essa combinação é robusta o suficiente para o projeto nascer certo, mas simples o bastante para não virar um monstro técnico antes da hora.

---

## 26. Stack final proposta

### MVP

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Postgres
- Supabase Auth
- Supabase Storage
- Meilisearch
- Coolify
- GitHub
- Stripe ou Asaas
- Resend ou Brevo
- Uptime Kuma
- Sentry

### V2

- Worker de sincronização.
- API pública com token.
- PostHog ou analytics mais avançado.
- Redis, se houver necessidade de cache ou fila.
- WordPress separado, se houver estratégia editorial forte.
- Integração com Zotero/RIS/BibTeX.
- Busca em linguagem natural com IA.

### Evitar no início

- Kubernetes.
- Microsserviços.
- Back-end separado em Nest/Laravel apenas por arquitetura.
- WordPress como banco principal.
- Elasticsearch/OpenSearch no MVP.
- Supabase self-hosted.
- API pública antes de validar assinatura.
- Painel administrativo genérico demais.

---

## 27. Critério de sucesso técnico

A arquitetura estará correta se, no MVP, for possível:

1. Cadastrar compositores e obras sem depender de desenvolvedor.
2. Estruturar a instrumentação de forma pesquisável.
3. Buscar obras por atributos musicais reais.
4. Restringir dados completos para assinantes.
5. Importar planilhas sem quebrar a base.
6. Manter histórico e qualidade editorial.
7. Evoluir para API e plano institucional sem reconstruir tudo.

---

## 28. Decisão executiva

A stack recomendada não é a mais simples possível, nem a mais poderosa possível.

Ela é a mais coerente para este momento do projeto.

O projeto deve nascer como uma aplicação de dados com base relacional séria, e não como um site com filtros. Ao mesmo tempo, não precisa começar com uma arquitetura corporativa pesada.

A melhor decisão é começar com uma fundação limpa:

> **Next.js para a aplicação, Supabase para dados e autenticação, Meilisearch para busca, Coolify para deploy e gateway de pagamento integrado por webhook.**

Essa estrutura permite iniciar pequeno, validar o produto, cadastrar a base aos poucos, vender assinatura e evoluir sem trocar a espinha dorsal do sistema em pouco tempo.
