# Auditoria de referencia: Daniels' Orchestral Music Online

Data: 2026-07-07

## Escopo

Esta auditoria observa o funcionamento do Daniels' Orchestral Music Online como referencia de produto para a plataforma Musica Brasileira de Concerto.

O objetivo nao e copiar conteudo proprietario, base de dados ou textos longos. O objetivo e entender arquitetura de navegacao, padrao de busca, paywall, area de conta e apresentacao de registros para adaptar ao nosso catalogo brasileiro.

## Fontes observadas

- Home: `https://daniels-orchestral.com/`
- Login: `https://daniels-orchestral.com/login/`
- Pesquisa simples: `https://daniels-orchestral.com/simple-search/`
- Pesquisa avancada: `https://daniels-orchestral.com/advanced-search/`
- Indice de compositores: `https://daniels-orchestral.com/composers/`
- Recursos: `https://daniels-orchestral.com/other-resources/`
- Assinatura: `https://daniels-orchestral.com/subscribe-levels/`
- Conta: `https://daniels-orchestral.com/my-account`
- Exemplos de compositor/obra observados com acesso logado para compreender a estrutura de pagina.

## Arquitetura geral

O produto e uma ferramenta de busca de repertorio, nao uma landing page. A navegacao principal e curta e operacional:

- Simple Search
- Advanced Search
- Browse by Composer
- Other Resources
- Subscribe
- Login/My account

Para o nosso projeto, a traducao funcional recomendada e:

- Pesquisa simples
- Pesquisa avancada
- Compositores
- Recursos
- Assinar
- Entrar/Minha conta

## Comportamento de login e assinatura

O site usa WordPress com Paid Memberships Pro. A area logada muda a barra superior para mostrar:

- nome/usuario logado;
- link para My account;
- link de Log out.

Na conta, o usuario ve:

- nivel de assinatura atual;
- preco/status;
- data de expiracao;
- e-mail principal e alternativos;
- links de estatisticas de uso;
- edicao de login/contato/cobranca;
- atualizacao de cartao;
- troca ou cancelamento de assinatura;
- configuracoes para mostrar/ocultar ajuda na busca simples e na busca avancada;
- historico de faturas.

Para o nosso MVP:

- manter login unico;
- manter area de conta simples, mas ja preparada para status de assinatura;
- adicionar depois estatisticas de uso e preferencias de ajuda;
- super admin cria assinantes manualmente ate existir checkout.

## Home

A home se posiciona como ferramenta indispensavel para bibliotecarios, planejadores, regentes, pesquisadores e diretores artisticos.

Elementos importantes:

- proposta de valor objetiva;
- numeros de acervo e uso;
- lista do que a ferramenta oferece;
- chamada de teste/assinatura;
- nota explicando que a plataforma informa sobre obras, mas nao e agente, distribuidora ou editora.

Para o nosso projeto:

- manter a home como porta de entrada para a ferramenta;
- incluir video grande do maestro;
- explicar busca simples, avancada, indice, fontes e assinatura;
- evitar hero excessivamente institucional que esconda o produto.

## Pesquisa simples

A pesquisa simples logada tem dois campos principais:

- Composer;
- Work Title.

Tambem inclui:

- botao de buscar;
- botao de limpar;
- botao de imprimir;
- botao/favorito para salvar busca;
- mensagem "Search bookmarked";
- painel de ajuda;
- dica para usar aspas em buscas exatas;
- orientacao para evitar titulos genericos.

Implicacoes para o nosso projeto:

- a pesquisa simples deve ser muito rapida e visualmente pequena;
- campos separados para compositor e titulo sao melhores do que um unico campo generico;
- salvar busca e imprimir devem entrar como recursos de assinante;
- ajuda contextual deve poder ser desligada pelo usuario.

## Pesquisa avancada

A pesquisa avancada e o centro do produto. Ela usa paineis recolhiveis com icones de expandir/editar/limpar.

Secoes observadas:

- Composer, Nationality, Dates
- Title, Composition Year, Duration
- Orchestra Type
- Instrumentation
- Instrumental Soloist(s)
- Vocal Soloist(s)
- Chorus
- Youth / Educational Works

Campos e comportamentos importantes:

- nome do compositor;
- nome exato;
- ano de nascimento entre dois valores;
- ano de falecimento entre dois valores;
- aniversario com marcadores 25 e 50;
- genero;
- nacionalidade/etnia por seletor;
- titulo da obra;
- ano de composicao de/ate;
- duracao em minutos de/ate;
- tipos de orquestra;
- picker de instrumentos;
- operadores de quantidade para instrumentos;
- solistas instrumentais e vocais com operadores;
- tipos de coro;
- obras jovens/educacionais por categorias.

Implicacoes para o nosso projeto:

- nossa busca avancada precisa evoluir para componentes de filtro reutilizaveis;
- instrumentacao deve ter filtro estruturado, nao apenas texto;
- solistas, coro e obras pedagogicas devem virar campos/indexes fortes;
- filtros devem montar uma query persistivel para "buscas salvas";
- resultados devem ser imprimiveis e copiaveis.

## Indice de compositores

O indice por compositor usa:

- letras A-Z;
- rota por letra;
- lista densa de nomes;
- link direto para a pagina do compositor.

Na pagina do compositor:

- mantem o indice A-Z no topo;
- mostra lista lateral/densa das obras do compositor;
- cada obra e linkavel;
- a obra atual fica destacada quando se entra em um detalhe.

Implicacoes para o nosso projeto:

- manter `/compositores` com A-Z;
- criar pagina de compositor mais operacional, com lista de obras clara;
- no detalhe da obra, mostrar outras obras do mesmo compositor para navegação rapida.

## Detalhe de obra

O detalhe de obra observado combina informacao de compositor, obra e fontes em uma unica pagina.

Estrutura funcional:

- titulo no padrao "Compositor :: Obra";
- links de conta no topo;
- indice A-Z;
- lista de obras do compositor;
- bloco do compositor com nome, datas, local de nascimento/morte e nacionalidade;
- titulo da obra;
- duracao;
- formula de instrumentacao;
- detalhes de percussao ou instrumentos adicionais;
- movimentos/partes e duracoes quando aplicavel;
- notas adicionais;
- rodape da obra com fontes/editoras;
- abreviaturas de editoras e detalhes de contato.

Implicacoes para o nosso projeto:

- nosso detalhe de obra deve ter um modo assinante com dados completos;
- a formula de instrumentacao precisa aparecer de forma compacta e tambem estruturada;
- fontes devem aparecer como entidades vinculadas, nao texto solto;
- movimentos e duracoes parciais devem entrar em tabela propria;
- notas de performance e disponibilidade devem ficar visiveis para assinantes.

## Recursos

O menu Other Resources mistura paginas tecnicas e institucionais.

Uteis para adaptar:

- Publishers Overview;
- This online tool;
- Instrumental practices;
- Pitch chart;
- Abbreviations;
- Orchestralogy.

Menos uteis para o nosso projeto neste momento:

- pagina pessoal/equipe de David Daniels;
- parceiros especificos;
- contatos do produto original.

Implicacoes para o nosso projeto:

- manter Recursos como area tecnica;
- listar editoras/acervos/fontes;
- criar glossario de abreviaturas;
- criar pagina de praticas instrumentais brasileiras;
- criar pagina sobre altura/transposicao;
- criar pagina de metodologia da ferramenta.

## Planos e monetizacao

O site tem niveis anuais:

- usuario unico;
- dois a cinco usuarios;
- acesso institucional por IP;
- teste gratuito;
- transferencia bancaria;
- usuario adicional por codigo patrocinador;
- mencao a API como add-on para especialistas.

Implicacoes para o nosso projeto:

- preparar planos individual, profissional e institucional;
- considerar assentos adicionais;
- considerar acesso institucional por dominio/IP no futuro;
- manter trilha de teste gratuito;
- preparar API futura como plano separado ou add-on.

## Arquitetura tecnica observada

O site roda em WordPress e usa:

- Paid Memberships Pro para assinatura;
- plugins customizados `om-basic-search` e `om-advanced-search`;
- JavaScript client-side para controles de busca;
- jQuery UI para dialogs/autocomplete/pickers;
- paginas estaticas/WordPress para compositores e obras;
- CSS especifico de impressao;
- controles de favoritos, copiar e imprimir.

Para o nosso projeto Next/Supabase:

- nao replicar WordPress;
- implementar busca no servidor com query segura e RLS;
- criar componentes React para filtros;
- guardar buscas salvas em tabela propria;
- usar entidades normalizadas: composers, works, instruments, work_instrumentation, movements, source_holders, references;
- adicionar camada de assinatura por `subscriptions`/entitlements;
- pensar em Meilisearch para busca textual e Postgres para filtros estruturados.

## Checklist para aproximar nosso MVP

- [x] Login unico.
- [x] Super admin cria assinantes manualmente.
- [x] Header com Pesquisa simples, Pesquisa avancada, Compositores, Recursos e Assinar.
- [x] Pesquisa simples com compositor/titulo.
- [x] Pesquisa avancada inicial com secoes.
- [x] Indice A-Z de compositores.
- [x] Recursos iniciais.
- [x] Fundacao de assinatura futura.
- [ ] Busca salva/favoritos de busca.
- [ ] Preferencia do usuario para mostrar/ocultar ajuda.
- [ ] Botao real de imprimir resultados.
- [ ] Resultado de busca em layout compacto copiavel.
- [ ] Detalhe de obra com modo assinante completo.
- [ ] Pagina de compositor com lista de obras mais densa.
- [ ] Fontes/editoras no rodape da obra.
- [ ] Movimentos e duracoes parciais no detalhe.
- [ ] Filtros estruturados de instrumentacao.
- [ ] Estatisticas de uso por conta.
- [ ] Planos com assentos/institucional.
- [ ] Checkout e webhooks.

