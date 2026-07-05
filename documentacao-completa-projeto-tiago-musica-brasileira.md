# Documentação funcional completa

# Plataforma de catalogação, pesquisa e difusão da música brasileira de concerto

## Projeto do Maestro Tiago Santos

## Referência funcional principal

Daniels’ Orchestral Music Online  
https://daniels-orchestral.com/advanced-search/

---

# 1. Premissa central do projeto

A proposta é desenvolver uma plataforma digital de base de dados musicológica, funcionalmente inspirada no Daniels’ Orchestral Music Online, mas exclusivamente voltada à música brasileira de concerto.

A referência do Daniels deve ser entendida como base funcional, não como modelo visual, textual ou editorial a ser copiado. O objetivo é criar uma plataforma própria, original e academicamente consistente, com foco em catalogação, pesquisa, programação artística, estudo, preservação e difusão da música brasileira.

A parte visual é secundária nesta etapa. O núcleo do projeto é:

1. Modelagem de dados extremamente bem feita.
2. Sistema de busca avançada por atributos musicais.
3. Área de assinantes com níveis de acesso.
4. Administração editorial para alimentar e revisar a base.
5. Padronização de instrumentação, compositores, obras, editoras, acervos e fontes.
6. Camada acadêmica de confiabilidade, referências, proveniência e histórico de revisão.
7. Possível API para integrações futuras.
8. Possível busca inteligente por linguagem natural em uma versão posterior.

O projeto não deve ser tratado como um site institucional com busca. Ele deve ser tratado como um produto digital especializado, próximo a um SaaS acadêmico-cultural, sustentado por uma base de dados relacional e por uma metodologia de catalogação própria.

---

# 2. Posicionamento recomendado

O projeto não deve ser apresentado internamente apenas como “um Daniels brasileiro”. Essa expressão pode ajudar na compreensão inicial, mas é limitada.

O posicionamento mais adequado é:

> A principal plataforma de catalogação, pesquisa e difusão da música brasileira de concerto.

Ou, em versão mais institucional:

> Uma base de dados de referência para preservar, organizar, pesquisar e difundir o patrimônio da música brasileira de concerto.

A plataforma deve servir a:

- Regentes.
- Orquestras.
- Bibliotecários de orquestra.
- Pesquisadores.
- Universidades.
- Conservatórios.
- Festivais.
- Programadores artísticos.
- Alunos de música.
- Compositores.
- Editoras.
- Acervos.
- Instituições culturais.

---

# 3. Limite da análise da referência Daniels

A análise funcional da referência Daniels foi baseada em páginas públicas acessíveis, incluindo:

- Home.
- Busca simples.
- Busca avançada.
- Listagem de compositores.
- Páginas públicas de compositores.
- Páginas públicas de obras.
- Diretório de editoras.
- Página de planos e assinatura.
- Checkout.
- Login.
- Páginas auxiliares de documentação.
- Páginas sobre abreviações, instrumentos e convenções.

Não foi possível inspecionar:

- Área interna de assinante.
- Resultados completos protegidos por login.
- Código-fonte real do sistema.
- Banco de dados.
- API privada.
- Painel administrativo.
- Fluxos internos de curadoria.
- Lógica completa de atualização da base.

Portanto, esta documentação é uma engenharia reversa funcional baseada nas páginas públicas, combinada com uma especificação técnica de como construir um sistema equivalente em função, sem copiar conteúdo, código, design, textos, dados pagos ou propriedade intelectual da referência.

---

# 4. O que o Daniels representa como modelo funcional

O Daniels’ Orchestral Music Online é uma ferramenta voltada para pesquisa de repertório orquestral. Sua lógica central é permitir que usuários pesquisem obras por compositor, título, duração, instrumentação, coro, solistas, tipo de orquestra e outros critérios técnicos.

O Daniels combina quatro camadas principais:

1. Base de dados musicológica.
2. Sistema de busca especializada.
3. Interface pública com prévias.
4. Área paga com dados completos e ferramentas adicionais.

Para o projeto do Maestro Tiago Santos, a equivalência funcional deve seguir essa mesma lógica, mas com escopo brasileiro e metodologia própria.

A plataforma brasileira deve ter como foco:

- Obras brasileiras de concerto.
- Compositores brasileiros ou radicados no Brasil.
- Música sinfônica brasileira.
- Música brasileira para orquestra de cordas.
- Obras com coro, solistas e formações especiais.
- Obras com instrumentos brasileiros.
- Fontes, editoras, manuscritos, acervos e direitos.
- Dados úteis para programação artística e pesquisa acadêmica.

---

# 5. Estrutura funcional geral da plataforma

A plataforma deve ser composta por estas grandes áreas:

1. Site público.
2. Busca simples.
3. Busca avançada.
4. Base de compositores.
5. Base de obras.
6. Diretório de editoras, acervos e fontes.
7. Área de assinantes.
8. Painel administrativo editorial.
9. Sistema de importação de dados.
10. Sistema de revisão e confiabilidade acadêmica.
11. Sistema de assinaturas e paywall.
12. Recursos de exportação e produtividade.
13. Conteúdos auxiliares e guia da base.
14. Relatórios e analytics.
15. Possível API.
16. Possível busca inteligente com linguagem natural.

---

# 6. Home / página inicial

A home deve cumprir três funções:

1. Explicar o valor da plataforma.
2. Direcionar para busca simples e busca avançada.
3. Converter visitantes para assinatura, teste gratuito ou solicitação institucional.

## Elementos recomendados

- Hero com proposta de valor.
- Campo de busca rápida.
- Chamada para busca avançada.
- Explicação da base.
- Bloco “Para quem é”.
- Bloco “O que é possível pesquisar”.
- Destaques de compositores brasileiros.
- Destaques de obras.
- Chamada para assinatura.
- Chamada para instituições.
- Chamada para colaboração acadêmica.
- Link para metodologia da base.

## Mensagem central sugerida

> Encontre, estude e programe obras da música brasileira de concerto com dados confiáveis sobre compositores, instrumentação, fontes, editoras, acervos e disponibilidade de execução.

---

# 7. Busca simples

A busca simples deve ser rápida, direta e acessível para usuários não técnicos.

## Deve permitir buscar por

- Compositor.
- Nome exato do compositor.
- Título da obra.
- Palavra-chave.
- Nome artístico.
- Pseudônimo.
- Título alternativo.
- Título traduzido.
- Catálogo.
- Opus.
- Número de obra.
- Instrumento relevante.
- Formação.

## Requisitos de busca textual

A busca deve considerar:

- Acentos e sem acentos.
- Maiúsculas e minúsculas.
- Hífens e variações de grafia.
- Nomes completos e sobrenomes.
- Títulos alternativos.
- Pseudônimos.
- Traduções.
- Erros comuns de digitação.
- Busca exata com aspas.
- Busca parcial.
- Relevância por campos.

## Exemplos

- Buscar “Villa Lobos” deve retornar “Heitor Villa-Lobos”.
- Buscar “Choros” deve retornar “Chôros”.
- Buscar “Bachianas” deve retornar obras relacionadas às “Bachianas brasileiras”.
- Buscar “Mignone” deve retornar Francisco Mignone e suas obras cadastradas.
- Buscar “violão” deve retornar obras que tenham violão como solista ou instrumento relevante.

---

# 8. Busca avançada

A busca avançada é o coração funcional da plataforma.

Ela deve permitir que o usuário encontre obras brasileiras a partir de critérios musicológicos, práticos, editoriais, históricos e curatoriais.

## 8.1 Filtros de compositor

- Nome.
- Nome exato.
- Nome artístico.
- Pseudônimo.
- Ano de nascimento.
- Ano de morte.
- Compositor vivo ou falecido.
- Aniversário de nascimento.
- Aniversário de morte.
- Gênero.
- Nacionalidade.
- Estado brasileiro.
- Região brasileira.
- Cidade de nascimento.
- Local de atuação.
- Escola estética ou movimento.
- Marcadores curatoriais.

## Marcadores curatoriais possíveis

- Mulheres compositoras.
- Compositores negros.
- Compositores indígenas.
- Compositores nordestinos.
- Compositores amazônicos.
- Compositores do sul do Brasil.
- Compositores modernistas.
- Compositores nacionalistas.
- Compositores contemporâneos.
- Imigrantes radicados no Brasil.
- Compositores brasileiros no exterior.

Esses marcadores devem ser usados com rigor editorial e fonte, evitando inferências frágeis ou classificações sensíveis sem confirmação.

## 8.2 Filtros de obra

- Título.
- Título exato.
- Título alternativo.
- Título original.
- Título traduzido.
- Número de catálogo.
- Opus.
- Ano de composição.
- Ano de revisão.
- Período aproximado.
- Duração mínima.
- Duração máxima.
- Tipo de formação.
- Dificuldade.
- Indicação pedagógica.
- Obra para jovem orquestra.
- Obra com coro.
- Obra com solista.
- Obra com instrumentos brasileiros.
- Obra com eletrônica.
- Obra com narrador.
- Obra cênica ou semiencenada.
- Obra com dança.
- Obra com fita, áudio fixo ou live electronics.
- Obra publicada.
- Obra inédita.
- Obra manuscrita.
- Obra em domínio público.
- Obra com material de execução disponível.

## 8.3 Filtros de formação

- Orquestra sinfônica.
- Orquestra de câmara.
- Orquestra de cordas.
- Orquestra jovem.
- Banda sinfônica, se incluída no escopo.
- Coro e orquestra.
- Solista e orquestra.
- Voz e orquestra.
- Instrumento brasileiro e orquestra.
- Música de câmara, se incluída no escopo.
- Formação indeterminada.
- Formação flexível.
- Orquestra reduzida.
- Orquestra sem cordas.
- Cordas e percussão.
- Cordas e teclado.
- Múltiplas orquestras.

## 8.4 Filtros de instrumentação

A instrumentação deve ser estruturada por famílias e instrumentos.

Famílias principais:

- Cordas.
- Madeiras.
- Metais.
- Percussão.
- Teclados.
- Harpa.
- Vozes.
- Coro.
- Eletrônica.
- Instrumentos brasileiros.
- Outros instrumentos.

## Instrumentos brasileiros e populares a considerar

- Violão.
- Viola caipira.
- Cavaquinho.
- Bandolim.
- Acordeon.
- Sanfona.
- Berimbau.
- Pandeiro.
- Atabaque.
- Agogô.
- Cuíca.
- Reco-reco.
- Ganzá.
- Alfaia.
- Zabumba.
- Rabeca.
- Instrumentos indígenas.
- Instrumentos afro-brasileiros.
- Outros instrumentos tradicionais, quando documentados.

## 8.5 Operadores de instrumentação

O sistema deve permitir operadores comparativos:

- `=` exatamente.
- `≥` pelo menos.
- `≤` no máximo.
- `0` nenhum.
- `opcional`.
- `qualquer`.

## Exemplos

- Trompas `≤ 2`.
- Flautas `= 2`.
- Percussão `≥ 1`.
- Harpa `= 0`.
- Violão `≥ 1`.
- Coro `= 0`.
- Piano `opcional`.

## 8.6 Filtros de coro e vozes

- Coro SATB.
- Coro infantil.
- Coro feminino.
- Coro masculino.
- Coro misto.
- Coro a cappella.
- Coro e orquestra.
- Soprano.
- Meio-soprano.
- Contralto.
- Tenor.
- Barítono.
- Baixo.
- Voz popular.
- Voz narrada.
- Narrador.
- Voz amplificada.

## 8.7 Filtros práticos para programação

Esses filtros são essenciais para regentes, orquestras e programadores artísticos.

- Duração até X minutos.
- Obra sem coro.
- Obra sem solista.
- Obra para orquestra reduzida.
- Obra para orquestra de cordas.
- Obra sem percussão.
- Obra com até dois percussionistas.
- Obra sem harpa.
- Obra sem piano.
- Obra adequada para concerto didático.
- Obra adequada para concerto ao ar livre.
- Obra adequada para formação jovem.
- Obra com temática brasileira.
- Obra de domínio público.
- Obra com material de execução disponível.
- Obra com partitura para consulta online.
- Obra com gravação disponível.
- Obra com notas de programa disponíveis.
- Obra de curta duração para abertura de concerto.
- Obra adequada para encerramento de concerto.
- Obra com baixa complexidade logística.

## 8.8 Lógica de combinação

A busca avançada deve permitir combinação de múltiplos filtros com lógica AND.

Exemplo:

> Obras brasileiras, de compositoras mulheres, compostas entre 1950 e 2000, com duração de até 12 minutos, sem coro, com até 2 trompas e sem harpa.

Resultado esperado:

- Lista de obras compatíveis.
- Dados resumidos.
- Botão para abrir detalhe.
- Botão para salvar busca.
- Botão para exportar, se o plano permitir.

---

# 9. Resultados da busca

A página de resultados deve ser objetiva, operacional e pensada para tomada de decisão.

## Colunas recomendadas

- Compositor.
- Datas do compositor.
- Título da obra.
- Ano.
- Duração.
- Formação.
- Instrumentação resumida.
- Solistas.
- Coro.
- Editora / fonte.
- Status de disponibilidade.
- Grau de confiabilidade.
- Ações.

## Ações

- Ver obra.
- Favoritar.
- Adicionar a lista.
- Copiar referência.
- Exportar.
- Ver editora.
- Ver gravações.
- Ver partitura, quando permitido.
- Ver acervo.
- Sugerir correção.

## Ordenação

- Relevância.
- Compositor A-Z.
- Título A-Z.
- Ano de composição.
- Duração.
- Data de cadastro.
- Data de atualização.
- Popularidade interna.
- Obras com material disponível primeiro.
- Obras com maior confiabilidade primeiro.

## Requisitos técnicos

- Paginação obrigatória.
- Filtros laterais persistentes.
- URL compartilhável com filtros aplicados.
- Estado da busca salvo na URL.
- Opção de salvar busca para assinantes.
- Opção de limpar filtros.
- Contagem de resultados em tempo real.
- Indicação quando não houver resultado.
- Sugestões de filtros alternativos.

---

# 10. Base de compositores

A plataforma deve possuir navegação alfabética de compositores e páginas individuais.

## 10.1 Listagem geral de compositores

Funcionalidades:

- Alfabeto A-Z.
- Busca por nome.
- Filtro por período.
- Filtro por estado.
- Filtro por região.
- Filtro por gênero.
- Filtro por compositor vivo/falecido.
- Filtro por formação predominante.
- Filtro por disponibilidade de obras.
- Filtro por fontes verificadas.
- Filtro por obras com material disponível.

## 10.2 Página individual do compositor

Campos recomendados:

- Nome completo.
- Nome artístico.
- Pseudônimos.
- Datas de nascimento e morte.
- Local de nascimento.
- Local de morte, se aplicável.
- Estado.
- Região.
- Nacionalidade.
- Biografia curta.
- Biografia expandida.
- Fontes biográficas.
- Links oficiais.
- Cronologia.
- Catálogo de obras.
- Obras orquestrais.
- Obras para orquestra de cordas.
- Obras com solista.
- Obras com coro.
- Obras com instrumentos brasileiros.
- Obras camerísticas, se incluídas no escopo.
- Editoras relacionadas.
- Acervos relacionados.
- Instituições detentoras de manuscritos.
- Observações curatoriais.
- Status geral de direitos autorais.
- Data da última revisão.
- Responsável pela última revisão.

## 10.3 Cronologia do compositor

A página do compositor pode conter uma linha do tempo com:

- Nascimento.
- Formação.
- Primeiras obras.
- Estreias relevantes.
- Viagens.
- Mudanças estéticas.
- Prêmios.
- Publicações.
- Vínculos institucionais.
- Falecimento.
- Eventos póstumos relevantes.

Esse módulo é especialmente útil para pesquisa acadêmica e para contextualização histórica.

---

# 11. Base de obras

A página de obra deve ser o principal ativo da plataforma.

## 11.1 Página pública da obra

Visitantes não logados devem ver uma versão limitada.

Campos públicos recomendados:

- Título da obra.
- Compositor.
- Datas do compositor.
- Ano aproximado de composição.
- Formação geral.
- Resumo curto.
- Algumas tags.
- Status público básico.
- Chamada para assinatura.

## 11.2 Página completa da obra para assinantes

Assinantes devem ver dados completos.

### Identificação

- Título principal.
- Títulos alternativos.
- Título original.
- Traduções.
- Compositor.
- Ano de composição.
- Ano de revisão.
- Número de catálogo.
- Opus.
- Dedicatória.
- Encomenda.
- Estreia.
- Local de estreia.
- Regente da estreia.
- Intérpretes da estreia.

### Dados musicais

- Formação.
- Instrumentação completa.
- Instrumentação resumida.
- Duração aproximada.
- Número de movimentos.
- Títulos dos movimentos.
- Solistas.
- Vozes.
- Coro.
- Eletrônica.
- Percussão detalhada.
- Dobramentos.
- Instrumentos opcionais.
- Instrumentos substituíveis.
- Dificuldade técnica.
- Observações de performance.

### Dados práticos

- Editora.
- Detentor dos direitos.
- Contato para aluguel ou compra.
- Disponibilidade de partitura.
- Disponibilidade de partes.
- Link para perusal score.
- Link para gravação.
- Link para notas de programa.
- Link para vídeo.
- Status de domínio público.
- Status de obra publicada.
- Status de obra manuscrita.
- Fonte consultada.
- Grau de confiabilidade do cadastro.

### Dados curatoriais

- Temas.
- Período estético.
- Relação com música brasileira.
- Ocasiões de programação.
- Indicação para concerto didático.
- Indicação para repertório de câmara.
- Indicação para orquestra jovem.
- Indicação para concerto sinfônico.
- Tags editoriais.

### Dados acadêmicos adicionais

- Referências bibliográficas.
- Teses relacionadas.
- Dissertações relacionadas.
- Artigos relacionados.
- Catálogos relacionados.
- Acervos relacionados.
- Manuscritos existentes.
- Localização dos manuscritos.
- Estado de preservação, se conhecido.
- Histórico de revisões da ficha.
- Grau de confiabilidade por campo.
- Como citar esta ficha.

---

# 12. Módulo de manuscritos, fontes e acervos

Este é um diferencial importante em relação a uma simples base de repertório.

Cada obra deve poder indicar se existe manuscrito, edição impressa, material de execução ou fonte digital.

## Campos recomendados

- Existe manuscrito?
- Onde está localizado?
- Instituição detentora.
- Acervo.
- Código de localização.
- Está digitalizado?
- Link de acesso.
- Acesso público ou restrito.
- Estado de preservação.
- Tipo de fonte.
- Fonte autógrafa.
- Cópia manuscrita.
- Edição impressa.
- Edição crítica.
- Material de execução.
- Partes orquestrais.
- Redução para piano.
- Gravação de referência.
- Fonte enviada pelo compositor.
- Fonte enviada pela editora.
- Fonte enviada por herdeiro.
- Observações.
- Data da última verificação.

## Tipos de fonte

- Manuscrito autógrafo.
- Manuscrito não autógrafo.
- Cópia de copista.
- Edição impressa.
- Edição crítica.
- Edição digital.
- Material de execução.
- Catálogo institucional.
- Registro bibliográfico.
- Gravação.
- Programa de concerto.
- Depoimento do compositor.
- Informação de editora.
- Informação de herdeiro.

---

# 13. Módulo de confiabilidade e proveniência dos dados

Toda informação relevante deve ter origem rastreável.

A plataforma deve permitir indicar a fonte de cada campo ou de cada bloco de informação.

## Níveis de confiabilidade sugeridos

- Confirmado por manuscrito original.
- Confirmado por edição impressa.
- Confirmado por catálogo institucional.
- Confirmado pelo compositor.
- Confirmado pela editora.
- Confirmado por herdeiro ou responsável legal.
- Confirmado por bibliografia acadêmica.
- Informação inferida.
- Informação pendente de confirmação.
- Informação divergente entre fontes.

## Exemplo de uso

Campo: Instrumentação completa  
Valor: 2 flautas, 2 oboés, 2 clarinetes, 2 fagotes, 4 trompas, 2 trompetes, tímpanos e cordas.  
Fonte: edição impressa da editora X.  
Confiabilidade: confirmada por edição impressa.  
Última revisão: 15/08/2026.  
Responsável: editor musicológico.

Esse recurso é fundamental para o caráter acadêmico da plataforma.

---

# 14. Histórico de revisões

A plataforma deve registrar alterações feitas nas fichas de compositores, obras, fontes e editoras.

## Cada revisão deve registrar

- Data.
- Usuário responsável.
- Campo alterado.
- Valor anterior.
- Novo valor.
- Motivo da alteração.
- Fonte usada.
- Status da revisão.

## Exemplo

Data: 15/08/2026  
Tipo: atualização de instrumentação  
Obra: exemplo  
Alteração: adicionada indicação de harpa opcional  
Fonte: edição impressa consultada  
Responsável: Tiago Santos  
Status: aprovado

## Benefícios

- Transparência acadêmica.
- Rastreabilidade.
- Confiança institucional.
- Proteção contra erros.
- Registro do desenvolvimento da pesquisa.

---

# 15. Referências bibliográficas

A plataforma deve permitir associar referências bibliográficas a compositores, obras, movimentos, acervos e fontes.

## Tipos de referência

- Livro.
- Artigo.
- Tese.
- Dissertação.
- Trabalho acadêmico.
- Catálogo.
- Programa de concerto.
- Site institucional.
- Acervo digital.
- Entrevista.
- Depoimento.
- Gravação.
- Partitura.
- Manuscrito.

## Campos recomendados

- Autor.
- Título.
- Tipo de publicação.
- Ano.
- Editora ou instituição.
- Local.
- DOI, se houver.
- URL.
- Data de acesso.
- Observações.
- Obra relacionada.
- Compositor relacionado.

## Exportações futuras

- ABNT.
- BibTeX.
- RIS.
- Chicago.
- APA, se necessário.

---

# 16. Relações entre obras

A plataforma deve permitir mapear relações entre obras.

## Tipos de relação

- Versão orquestral de.
- Versão para câmara de.
- Arranjo de.
- Transcrição de.
- Baseada em.
- Pertence ao ciclo.
- Complementa.
- Revisão de.
- Obra derivada de.
- Mesmo tema.
- Mesma formação.
- Mesmo período.
- Obra semelhante.

## Exemplo

Uma obra pode ser:

- Versão orquestral de uma obra para piano.
- Parte de uma série.
- Revisão posterior de uma versão anterior.
- Arranjo autorizado pelo compositor.

Esse módulo ajuda pesquisadores, regentes e estudantes a compreenderem melhor o repertório.

---

# 17. Geografia da música brasileira

A plataforma pode ter uma camada geográfica para ampliar o valor acadêmico e cultural.

## Dados geográficos possíveis

- Cidade de nascimento do compositor.
- Estado de nascimento.
- Região brasileira.
- Cidade de atuação.
- Local de estreia da obra.
- Localização do manuscrito.
- Localização da editora.
- Localização do acervo.
- Instituições vinculadas ao compositor.

## Possíveis recursos

- Mapa de compositores.
- Mapa de acervos.
- Mapa de estreias.
- Filtro por região.
- Filtro por estado.

Esse recurso não precisa entrar no MVP, mas deve ser previsto na modelagem.

---

# 18. Diretório de editoras, acervos e fontes

A plataforma deve ter um diretório próprio para editoras, instituições e detentores de fontes.

## Deve incluir

- Editoras comerciais.
- Acervos públicos.
- Acervos universitários.
- Arquivos pessoais.
- Herdeiros.
- Instituições detentoras de manuscritos.
- Bibliotecas.
- Fundações.
- Orquestras com acervo próprio.
- Sites oficiais de compositores.
- Plataformas de partitura.
- Contatos para licenciamento.

## Campos recomendados

- Nome da instituição.
- Tipo.
- País.
- Estado.
- Cidade.
- Endereço.
- E-mail.
- Telefone.
- Site.
- Pessoa de contato.
- Observações.
- Compositores relacionados.
- Obras relacionadas.
- Condições de acesso.
- Disponibilidade de aluguel.
- Disponibilidade de compra.
- Disponibilidade digital.
- Data da última verificação.

---

# 19. Guia de leitura da base

A plataforma deve ter uma seção pública ou parcialmente pública explicando sua metodologia.

## Conteúdos recomendados

- Como interpretar a instrumentação.
- Abreviações usadas.
- Padrão de nomes de instrumentos.
- Convenção de vozes.
- Convenção de coro.
- Convenção de percussão.
- Convenção de instrumentos brasileiros.
- Convenção de datas aproximadas.
- Convenção de fontes.
- Critérios curatoriais.
- Critérios de confiabilidade.
- Como citar a base em trabalhos acadêmicos.
- Como sugerir correções.
- Como colaborar com a base.

Esse recurso aumenta a autoridade do projeto e reduz dúvidas de assinantes.

---

# 20. Assinaturas, acesso e monetização

A plataforma deve operar com níveis de acesso.

## 20.1 Plano gratuito

Finalidade: descoberta, SEO e autoridade pública.

Acesso:

- Home.
- Busca simples limitada.
- Listagem pública de compositores.
- Página pública de compositor.
- Página pública de obra com dados básicos.
- Algumas editoras ou fontes públicas.
- Guia parcial da base.
- Convite para assinatura.

Ocultar:

- Instrumentação detalhada.
- Filtros avançados completos.
- Links práticos de contato.
- Exportação.
- Dados de disponibilidade.
- Observações curatoriais avançadas.
- API.
- Histórico completo de revisão.
- Referências completas, se a estratégia comercial exigir.

## 20.2 Teste gratuito

Finalidade: conversão.

Acesso:

- Busca avançada completa por período determinado.
- Visualização completa temporária.
- Limite de exportações, se desejado.
- Sem acesso à API, salvo estratégia comercial específica.

## 20.3 Plano individual

Acesso:

- Busca avançada completa.
- Páginas completas de obras.
- Editoras e fontes completas.
- Salvar buscas.
- Favoritar obras.
- Criar listas.
- Exportar resultados básicos.
- Copiar dados para planejamento de concertos.
- Histórico de buscas.

## 20.4 Plano profissional

Para regentes, pesquisadores, curadores, bibliotecários e programadores artísticos.

Acesso:

- Tudo do individual.
- Exportação avançada.
- Listas privadas de repertório.
- Comparação de obras.
- Coleções.
- Comentários privados.
- Download de planilhas, quando permitido.
- Exportação bibliográfica.

## 20.5 Plano institucional

Para universidades, orquestras, bibliotecas, conservatórios e festivais.

Acesso:

- Múltiplos usuários.
- Login por domínio de e-mail ou IP.
- Administração de usuários.
- Relatório de uso.
- Condições comerciais por contrato.
- Eventual integração via API.

## 20.6 Plano API

Para integração com outros sistemas.

A API não precisa entrar no MVP, mas deve ser prevista na arquitetura.

---

# 21. Sistema de login e conta

O sistema deve incluir:

- Cadastro.
- Login.
- Recuperação de senha.
- Alteração de senha.
- Dados pessoais.
- Dados de cobrança.
- Histórico de assinatura.
- Renovação.
- Cancelamento.
- Upgrade e downgrade de plano.
- Área “minhas buscas salvas”.
- Área “minhas obras favoritas”.
- Área “minhas listas”.
- Preferências de idioma, se houver versão multilíngue.

## LGPD

Também é necessário prever:

- Consentimento de termos.
- Política de privacidade.
- Registro de aceite.
- Exclusão de conta.
- Exportação de dados pessoais.
- Controle de e-mails transacionais e marketing.

---

# 22. Modelo de dados recomendado

Este é o ponto mais importante do projeto.

Não é recomendado montar a plataforma apenas com posts e campos personalizados genéricos. Para um produto desse tipo, a base precisa ser relacional, normalizada e preparada para busca.

## 22.1 Composer

Representa o compositor.

Campos:

- id.
- nome_canonico.
- nome_exibicao.
- sobrenome.
- nomes_alternativos.
- pseudonimos.
- slug.
- data_nascimento.
- data_morte.
- ano_nascimento.
- ano_morte.
- cidade_nascimento.
- estado_nascimento.
- pais_nascimento.
- cidade_morte.
- estado_morte.
- nacionalidade.
- genero.
- etnia_identidade, se aplicável e editorialmente validado.
- regiao_brasil.
- biografia_curta.
- biografia_longa.
- fonte_biografica.
- website_oficial.
- observacoes.
- status_publicacao.
- grau_confiabilidade.
- criado_em.
- atualizado_em.

## 22.2 Work

Representa a obra.

Campos:

- id.
- composer_id.
- titulo_canonico.
- titulo_exibicao.
- titulos_alternativos.
- titulo_original.
- titulo_traduzido.
- slug.
- ano_composicao_inicio.
- ano_composicao_fim.
- data_composicao_textual.
- ano_revisao.
- opus.
- catalogo.
- numero_catalogo.
- duracao_minutos.
- duracao_minima.
- duracao_maxima.
- tipo_formacao.
- nivel_dificuldade.
- possui_coro.
- possui_solista.
- possui_eletronica.
- possui_instrumentos_brasileiros.
- obra_educacional.
- obra_juvenil.
- dominio_publico.
- status_direitos.
- status_obra.
- resumo_publico.
- notas_assinante.
- notas_performance.
- notas_editoriais.
- fonte_principal.
- grau_confiabilidade.
- status_publicacao.
- criado_em.
- atualizado_em.

## 22.3 Instrument

Representa cada instrumento padronizado.

Campos:

- id.
- nome.
- nome_plural.
- abreviacao.
- familia.
- subfamilia.
- nomes_alternativos.
- instrumento_brasileiro.
- ordem_exibicao.
- observacoes.

Famílias:

- Madeiras.
- Metais.
- Cordas.
- Percussão.
- Teclados.
- Vozes.
- Coro.
- Eletrônica.
- Instrumentos brasileiros.
- Outros.

## 22.4 WorkInstrumentation

Relaciona obra e instrumentos.

Campos:

- id.
- work_id.
- instrument_id.
- quantidade_minima.
- quantidade_maxima.
- quantidade_textual.
- obrigatorio.
- opcional.
- dobramento.
- instrumento_dobrado_id.
- substituivel.
- observacao.
- fonte.
- confiabilidade.

Esse modelo permite perguntas como:

- Obras com no máximo 2 trompas.
- Obras sem harpa.
- Obras com exatamente 2 flautas.
- Obras com pelo menos 1 piano.
- Obras com percussão, mas sem tímpanos.
- Obras para cordas sem sopros.
- Obras com violão solista.
- Obras com berimbau.

## 22.5 VoiceRequirement

Para solistas vocais e coro.

Campos:

- id.
- work_id.
- tipo.
- voz.
- quantidade.
- coro_tipo.
- coro_tamanho.
- opcional.
- observacao.

## 22.6 Movement

Representa movimentos da obra.

Campos:

- id.
- work_id.
- ordem.
- titulo.
- andamento.
- duracao.
- observacoes.

## 22.7 Publisher / SourceHolder

Representa editora, acervo ou fonte detentora.

Campos:

- id.
- nome.
- tipo.
- pais.
- estado.
- cidade.
- endereco.
- email.
- telefone.
- website.
- pessoa_contato.
- observacoes.
- ativo.
- ultima_verificacao.

## 22.8 WorkSource

Relaciona obra com editora, acervo, link ou fonte.

Campos:

- id.
- work_id.
- source_holder_id.
- tipo_material.
- partitura_disponivel.
- partes_disponiveis.
- perusal_score_url.
- compra_url.
- aluguel_url.
- gravacao_url.
- notas_programa_url.
- video_url.
- condicoes_acesso.
- observacoes.
- ultima_verificacao.

## 22.9 ManuscriptSource

Representa fontes manuscritas ou documentos primários.

Campos:

- id.
- work_id.
- source_holder_id.
- tipo_fonte.
- codigo_acervo.
- descricao.
- digitalizado.
- url_acesso.
- acesso_publico.
- estado_preservacao.
- observacoes.
- confiabilidade.
- ultima_verificacao.

## 22.10 BibliographicReference

Representa referências bibliográficas.

Campos:

- id.
- tipo.
- autor.
- titulo.
- ano.
- editora.
- instituicao.
- local.
- doi.
- url.
- data_acesso.
- observacoes.

## 22.11 WorkReference

Relaciona obra com referência bibliográfica.

Campos:

- id.
- work_id.
- reference_id.
- observacao.
- pagina.
- tipo_relacao.

## 22.12 ComposerReference

Relaciona compositor com referência bibliográfica.

Campos:

- id.
- composer_id.
- reference_id.
- observacao.
- pagina.
- tipo_relacao.

## 22.13 Taxonomy / Tags

Para classificar obras e compositores.

Campos:

- id.
- nome.
- tipo.
- slug.
- descricao.

Tipos possíveis:

- Período.
- Movimento estético.
- Tema.
- Região.
- Formação.
- Ocasião de programação.
- Grau de dificuldade.
- Perfil pedagógico.
- Instrumento brasileiro.
- Identidade curatorial.

## 22.14 WorkRelationship

Relaciona obras entre si.

Campos:

- id.
- work_id_origem.
- work_id_destino.
- tipo_relacao.
- observacao.

Tipos:

- Versão de.
- Arranjo de.
- Transcrição de.
- Revisão de.
- Pertence ao ciclo.
- Complementa.
- Baseada em.
- Obra relacionada.

## 22.15 RevisionHistory

Histórico de alterações.

Campos:

- id.
- entidade_tipo.
- entidade_id.
- campo.
- valor_anterior.
- valor_novo.
- motivo.
- fonte.
- user_id.
- status.
- criado_em.

## 22.16 User

Campos:

- id.
- nome.
- email.
- senha_hash.
- papel.
- instituicao.
- telefone.
- pais.
- estado.
- status.
- criado_em.
- ultimo_login.

## 22.17 Subscription

Campos:

- id.
- user_id.
- plano.
- status.
- inicio.
- fim.
- renovacao_automatica.
- gateway_pagamento.
- customer_id.
- subscription_id.
- quantidade_usuarios.
- acesso_api.
- acesso_institucional_ip.

## 22.18 SavedSearch

Campos:

- id.
- user_id.
- nome.
- parametros_json.
- criado_em.
- atualizado_em.

## 22.19 Favorite / RepertoireList

Campos:

- id.
- user_id.
- nome_lista.
- descricao.
- privada.
- criada_em.

## 22.20 RepertoireListItem

Campos:

- id.
- list_id.
- work_id.
- notas_privadas.
- ordem.

## 22.21 SearchLog

Campos:

- id.
- user_id.
- parametros_json.
- quantidade_resultados.
- data_hora.

Uso para analytics:

- O que os usuários mais procuram.
- Quais filtros são mais usados.
- Quais compositores têm mais demanda.
- Quais buscas não retornam resultado.
- Onde a base precisa ser ampliada.

---

# 23. Painel administrativo

O projeto precisa de um painel administrativo robusto.

Sem isso, a base ficará difícil de alimentar, revisar e manter.

## 23.1 Perfis administrativos

### Administrador geral

- Gerencia usuários.
- Gerencia planos.
- Gerencia permissões.
- Gerencia taxonomias.
- Acessa relatórios.
- Configura o sistema.

### Editor musicológico

- Cadastra compositores.
- Cadastra obras.
- Cadastra fontes.
- Revisa instrumentação.
- Publica conteúdos, se autorizado.

### Revisor

- Revisa dados.
- Aprova ou rejeita alterações.
- Comenta inconsistências.
- Solicita correções.

### Colaborador

- Sugere obras.
- Preenche rascunhos.
- Envia fontes.
- Não publica diretamente.

## 23.2 Funcionalidades do admin

- CRUD de compositores.
- CRUD de obras.
- CRUD de instrumentos.
- CRUD de editoras e acervos.
- CRUD de fontes externas.
- CRUD de referências bibliográficas.
- CRUD de manuscritos.
- Importação por CSV ou XLSX.
- Exportação de dados.
- Detecção de duplicatas.
- Histórico de alterações.
- Revisão editorial.
- Status: rascunho, em revisão, publicado, arquivado.
- Campos obrigatórios configuráveis.
- Validação de instrumentação.
- Controle de fontes.
- Grau de confiabilidade.
- Log de auditoria.
- Backup.
- Relatório de cadastros incompletos.

---

# 24. Importação de dados

A alimentação manual obra por obra será lenta. O projeto deve nascer com modelo de importação.

## 24.1 Planilha de compositores

Colunas recomendadas:

- nome_canonico.
- nome_exibicao.
- nascimento.
- morte.
- cidade.
- estado.
- país.
- gênero.
- biografia_curta.
- fonte.
- observações.

## 24.2 Planilha de obras

Colunas recomendadas:

- compositor.
- título.
- título alternativo.
- ano composição início.
- ano composição fim.
- duração.
- formação.
- instrumentação textual.
- instrumentação estruturada.
- solistas.
- coro.
- editora.
- fonte.
- links.
- observações.

## 24.3 Planilha de instrumentação

Colunas recomendadas:

- obra.
- instrumento.
- família.
- quantidade mínima.
- quantidade máxima.
- opcional.
- dobramento.
- observação.

## 24.4 Planilha de fontes e acervos

Colunas recomendadas:

- obra.
- tipo de fonte.
- instituição.
- acervo.
- código de localização.
- digitalizado.
- link.
- acesso público.
- observações.

## 24.5 Planilha de referências

Colunas recomendadas:

- tipo.
- autor.
- título.
- ano.
- editora/instituição.
- local.
- DOI.
- URL.
- data de acesso.
- obra relacionada.
- compositor relacionado.

---

# 25. Arquitetura técnica recomendada

Como o projeto pode ser desenvolvido em ambiente WordPress, é possível usar WordPress, mas não como um site comum baseado apenas em posts, páginas e campos personalizados genéricos.

A estrutura de dados exige tabelas próprias, relações bem definidas e motor de busca preparado para filtros avançados.

## 25.1 Opção recomendada para entrega com WordPress

WordPress + plugin customizado + banco relacional + motor de busca dedicado.

Estrutura:

- WordPress para páginas institucionais, blog, SEO, login, checkout e área pública.
- Plugin customizado para compositores, obras, instrumentos, editoras, fontes e busca.
- Tabelas próprias no banco, não apenas `wp_posts` e `wp_postmeta`.
- Motor de busca dedicado para performance.
- Integração com gateway de pagamento.
- Área de assinantes integrada.
- Painel administrativo customizado dentro do WordPress.

Tecnologias possíveis:

- WordPress.
- PHP customizado.
- MySQL ou MariaDB.
- Tabelas próprias.
- REST API interna.
- Meilisearch, Typesense, Algolia ou OpenSearch para busca.
- Stripe, Mercado Pago, Pagar.me ou outro gateway.
- Plugin de membership ou assinatura customizada.

## 25.2 Opção mais robusta

Aplicação web separada.

Estrutura:

- Front-end moderno em Next.js ou similar.
- Back-end em Laravel, NestJS ou Django.
- Banco PostgreSQL.
- Motor de busca dedicado.
- Painel administrativo próprio.
- WordPress apenas para marketing e conteúdo editorial, se necessário.

## 25.3 Recomendação estratégica

Se a prioridade for velocidade, orçamento controlado e uso da estrutura já conhecida:

> WordPress + plugin customizado + tabelas próprias + motor de busca externo.

Se a prioridade for criar uma referência nacional, com milhares de obras, instituições, API e escala:

> Aplicação customizada separada, com WordPress apenas como camada institucional ou editorial.

---

# 26. MVP recomendado

O MVP deve provar o valor principal:

> Encontrar obras brasileiras executáveis por uma formação específica.

A primeira versão não precisa ter API, acesso institucional por IP, mapa, recomendações inteligentes ou relatórios avançados.

## 26.1 Público

- Home.
- Sobre o projeto.
- Busca simples limitada.
- Listagem de compositores.
- Página pública de compositor.
- Página pública de obra.
- Página de planos.
- Checkout.
- Login.
- Recuperação de senha.
- Guia básico da base.

## 26.2 Assinante

- Busca avançada completa.
- Página completa de obra.
- Instrumentação detalhada.
- Fontes e editoras.
- Links externos.
- Favoritos.
- Busca salva.
- Exportação básica.
- Referências bibliográficas.
- Dados de confiabilidade.

## 26.3 Admin

- Cadastro de compositor.
- Cadastro de obra.
- Cadastro de instrumentos.
- Cadastro de editoras e fontes.
- Cadastro de referências.
- Cadastro de manuscritos.
- Importação CSV/XLSX.
- Revisão editorial.
- Publicação.

## 26.4 Dados iniciais

- Base inicial de compositores brasileiros.
- Base inicial de obras orquestrais brasileiras.
- Instrumentação normalizada.
- Fontes verificadas.
- Editoras/acervos relacionados.
- Referências mínimas por compositor e obra prioritária.

---

# 27. Funcionalidades para versão 2

- API paga.
- Acesso institucional por IP.
- Múltiplos usuários por instituição.
- Listas colaborativas.
- Relatórios para instituições.
- Exportação avançada.
- Integração com Zotero.
- Exportação RIS.
- Exportação BibTeX.
- Sugestão de correção por usuários.
- Workflow acadêmico de revisão.
- Sistema de citações.
- Histórico público de atualização.
- Página de estatísticas da base.
- Comparador de obras.
- Recomendações automáticas de repertório.
- Curadorias temáticas.
- Trilhas de descoberta.
- Mapa geográfico.
- Busca inteligente por linguagem natural.

---

# 28. Busca inteligente por linguagem natural

Este recurso não deve substituir a busca avançada tradicional. Deve funcionar como uma camada adicional.

O usuário poderia escrever:

> Preciso de uma obra brasileira de aproximadamente 12 minutos para orquestra jovem, sem harpa, com até dois percussionistas.

O sistema interpretaria a frase e converteria em filtros estruturados:

- País/recorte: Brasil.
- Duração máxima aproximada: 12 minutos.
- Formação: orquestra jovem.
- Harpa: 0.
- Percussionistas: ≤ 2.

Outros exemplos:

> Quero obras semelhantes às Bachianas nº 4.

> Procuro repertório brasileiro para abertura de concerto.

> Preciso de uma peça curta, sem coro, com poucos metais.

> Quero obras brasileiras com violão solista e orquestra.

Essa funcionalidade pode usar IA como camada intermediária, mas sempre consultando dados estruturados. A IA não deve inventar resultados. Ela deve apenas transformar linguagem natural em filtros de busca.

---

# 29. Regras de paywall

## Visitante não logado vê

- Nome do compositor.
- Datas.
- Título da obra.
- Ano aproximado.
- Formação geral.
- Resumo curto.
- Algumas tags.
- Convite para assinar.

## Assinante vê

- Instrumentação completa.
- Duração.
- Movimentos.
- Editora.
- Acervo.
- Contatos.
- Links externos.
- Observações de performance.
- Dados de disponibilidade.
- Exportação.
- Favoritos.
- Busca salva.
- Referências bibliográficas.
- Fontes.
- Histórico de revisão, se liberado ao plano.
- Grau de confiabilidade.

## Conteúdo sempre público

Alguns conteúdos devem permanecer públicos por autoridade e SEO:

- Biografias curtas.
- Índice de compositores.
- Textos editoriais.
- Guias de uso.
- Glossário parcial.
- Páginas institucionais.
- Metodologia resumida.

---

# 30. Critérios de aceitação funcional

## 30.1 Busca simples

O sistema deve permitir buscar por:

- Compositor.
- Título.
- Palavra-chave.
- Título alternativo.
- Nome sem acento.
- Nome com acento.
- Nome parcial.

Critério:

> Ao pesquisar “Villa Lobos”, o sistema deve retornar Heitor Villa-Lobos e suas obras cadastradas, mesmo que o nome canônico esteja com hífen.

## 30.2 Busca avançada

O sistema deve permitir combinar:

- Compositor.
- Ano de nascimento.
- Ano de morte.
- Gênero.
- Estado/região.
- Título.
- Ano de composição.
- Duração.
- Formação.
- Instrumentação.
- Solistas.
- Vozes.
- Coro.
- Disponibilidade de material.
- Tags curatoriais.

Critério:

> O usuário deve conseguir encontrar obras brasileiras para orquestra de cordas, com duração até 12 minutos, sem coro, com material disponível e compostas depois de 1950.

## 30.3 Instrumentação

O sistema deve permitir:

- Exatamente X instrumentos.
- Pelo menos X instrumentos.
- No máximo X instrumentos.
- Nenhum instrumento.
- Instrumento opcional.
- Dobramento.
- Substituição.

Critério:

> O usuário deve conseguir buscar obras com no máximo 2 trompas, sem harpa e com pelo menos 1 percussionista.

## 30.4 Página de obra

Deve exibir:

- Dados básicos.
- Dados musicais.
- Instrumentação.
- Movimentos.
- Fontes.
- Editoras/acervos.
- Links externos.
- Observações.
- Status de direitos.
- Referências bibliográficas.
- Grau de confiabilidade.

Critério:

> Um assinante deve conseguir avaliar se uma obra é executável por sua orquestra sem precisar sair da página.

## 30.5 Assinatura

Deve haver:

- Cadastro.
- Login.
- Plano individual.
- Plano institucional.
- Teste gratuito, se adotado.
- Renovação.
- Restrição de conteúdo.
- Liberação automática após pagamento.

Critério:

> Um usuário pagante deve acessar imediatamente os dados completos após confirmação do pagamento.

## 30.6 Admin

Deve permitir:

- Cadastrar compositor.
- Cadastrar obra.
- Vincular obra a compositor.
- Adicionar instrumentação estruturada.
- Adicionar editoras/fontes.
- Adicionar referências.
- Adicionar dados de manuscrito.
- Revisar e publicar.
- Importar planilhas.

Critério:

> Um editor deve conseguir cadastrar uma obra completa sem depender de desenvolvedor.

---

# 31. Especificação de permissões

## Visitante

Pode:

- Ver páginas públicas.
- Fazer busca simples limitada.
- Ver prévia de obra.
- Ver planos.

Não pode:

- Ver instrumentação completa.
- Exportar.
- Salvar busca.
- Ver contatos completos.
- Usar busca avançada completa.

## Assinante individual

Pode:

- Ver tudo da base, conforme plano.
- Usar busca avançada.
- Salvar buscas.
- Favoritar obras.
- Criar listas.
- Exportar resultados básicos.

## Assinante profissional

Pode:

- Tudo do individual.
- Exportações avançadas.
- Listas ampliadas.
- Mais recursos de produtividade.
- Exportação bibliográfica.

## Instituição

Pode:

- Múltiplos usuários.
- Acesso por IP ou domínio.
- Relatórios.
- Administração de assentos.

## Editor

Pode:

- Cadastrar.
- Editar.
- Revisar.
- Publicar, se tiver permissão.

## Administrador

Pode:

- Gerenciar tudo.
- Usuários.
- Planos.
- Dados.
- Configurações.
- Relatórios.

---

# 32. Cuidados jurídicos e éticos

## Pode replicar

- Conceito funcional.
- Tipos de filtros.
- Estrutura geral de busca.
- Modelo de assinatura.
- Ideia de páginas públicas e conteúdo restrito.
- Lógica de diretório de compositores, obras e editoras.

## Não deve copiar

- Base de dados do Daniels.
- Textos descritivos.
- Organização textual idêntica.
- Abreviações proprietárias, se houver originalidade protegida.
- Interface visual.
- Código.
- Estrutura de URLs como cópia literal.
- Conteúdo editorial.
- Notas de obras.
- Informações pagas.

## Deve construir de forma própria

- Taxonomia brasileira.
- Gramática própria de instrumentação.
- Base de fontes.
- Critérios curatoriais.
- Textos explicativos.
- Guia editorial.
- Sistema de validação acadêmica.
- Metodologia de confiabilidade.
- Referências bibliográficas.
- Relação com acervos brasileiros.

A tese do projeto deve ser: uma base original dedicada à música brasileira, inspirada funcionalmente em bases internacionais, mas com metodologia própria.

---

# 33. Diferenciais estratégicos do projeto brasileiro

## 33.1 Recorte brasileiro profundo

Não apenas “compositores brasileiros”, mas:

- Música brasileira de concerto.
- Música sinfônica brasileira.
- Obras para orquestra jovem.
- Obras com instrumentos brasileiros.
- Obras com matrizes afro-brasileiras.
- Obras com matrizes indígenas.
- Obras com regionalismos.
- Obras de compositoras brasileiras.
- Obras de compositores negros brasileiros.
- Obras ligadas a movimentos estéticos brasileiros.

## 33.2 Uso prático para programação

Filtros pensados para necessidades reais:

- Tenho orquestra pequena.
- Não tenho harpa.
- Tenho poucos metais.
- Tenho coro infantil.
- Preciso de obra curta.
- Preciso de repertório brasileiro para abertura de concerto.
- Preciso de obra para concerto didático.
- Preciso de obra com solista de violão.
- Preciso de obra para cordas.

## 33.3 Uso acadêmico

- Fontes citáveis.
- Metodologia de catalogação.
- Histórico de revisão.
- Referências bibliográficas.
- Exportação bibliográfica.
- Notas sobre manuscritos.
- Status de confiabilidade.

## 33.4 Uso institucional

- Universidades.
- Orquestras.
- Bibliotecas.
- Festivais.
- Programadores culturais.
- Pesquisadores.
- Arquivos.

---

# 34. Estrutura sugerida do menu

## Público

- Início.
- Buscar.
- Compositores.
- Obras.
- Editoras e Acervos.
- Guia da Base.
- Metodologia.
- Planos.
- Sobre.
- Entrar.

## Assinante

- Busca Avançada.
- Minhas Buscas.
- Minhas Listas.
- Favoritos.
- Exportações.
- Minha Conta.

## Admin

- Dashboard.
- Compositores.
- Obras.
- Instrumentos.
- Editoras e Acervos.
- Fontes.
- Manuscritos.
- Referências.
- Taxonomias.
- Usuários.
- Assinaturas.
- Importação.
- Revisões.
- Relatórios.
- Configurações.

---

# 35. Backlog técnico estruturado

## Épico 1: Fundação do sistema

- Definir arquitetura.
- Criar banco de dados.
- Criar entidades principais.
- Criar autenticação.
- Criar permissões.
- Criar painel administrativo básico.

## Épico 2: Compositores

- Cadastro de compositor.
- Listagem pública.
- Página individual.
- Filtros por nome, data, estado e região.
- Importação em massa.
- Controle de fontes.
- Cronologia.

## Épico 3: Obras

- Cadastro de obra.
- Página pública.
- Página completa para assinantes.
- Movimentos.
- Duração.
- Ano.
- Formação.
- Tags.
- Fontes.
- Status editorial.
- Status de direitos.

## Épico 4: Instrumentação

- Dicionário de instrumentos.
- Famílias.
- Abreviações.
- Quantidades.
- Dobramentos.
- Opcionais.
- Substituições.
- Validação da fórmula.

## Épico 5: Busca

- Busca simples.
- Busca avançada.
- Resultados.
- Ordenação.
- Paginação.
- Filtros combinados.
- URL compartilhável.
- Busca salva.

## Épico 6: Assinaturas

- Planos.
- Checkout.
- Gateway.
- Área de conta.
- Controle de acesso.
- Renovação.
- Cancelamento.
- Trial.
- Plano institucional.

## Épico 7: Exportação e produtividade

- Copiar dados.
- Exportar CSV.
- Exportar PDF.
- Exportar referência bibliográfica.
- Favoritos.
- Listas de repertório.

## Épico 8: Conteúdo auxiliar

- Glossário.
- Guia de instrumentação.
- Guia de uso.
- Critérios curatoriais.
- Página sobre metodologia.

## Épico 9: Fontes e confiabilidade

- Cadastro de fontes.
- Cadastro de manuscritos.
- Grau de confiabilidade.
- Histórico de revisão.
- Proveniência dos dados.
- Sugestão de correções.

## Épico 10: Relatórios

- Buscas mais feitas.
- Obras mais visualizadas.
- Compositores mais acessados.
- Buscas sem resultado.
- Assinantes ativos.
- Conversão de trial.
- Uso institucional.

## Épico 11: API

- Autenticação por token.
- Endpoint de compositores.
- Endpoint de obras.
- Endpoint de busca.
- Limite por plano.
- Logs de uso.
- Documentação.

## Épico 12: Busca inteligente

- Interface de pergunta em linguagem natural.
- Interpretação da intenção.
- Conversão para filtros estruturados.
- Exibição dos filtros detectados.
- Execução da busca.
- Explicação do resultado.

---

# 36. O que construir primeiro

A primeira entrega funcional deve focar em:

> Encontrar obras brasileiras executáveis por uma formação específica.

A primeira versão precisa ter:

- Cadastro confiável.
- Busca avançada útil.
- Instrumentação estruturada.
- Assinatura funcionando.
- Páginas de obra completas.
- Admin utilizável.
- Fontes e confiabilidade.
- Importação de dados.

Sem isso, o produto vira apenas um catálogo bonito. Com isso, vira ferramenta profissional e acadêmica.

---

# 37. Conclusão para desenvolvimento

O projeto é viável e pode ser desenvolvido com função equivalente ao Daniels, desde que seja entendido como uma plataforma de dados, não como um site comum.

A referência Daniels oferece a raiz funcional:

- Busca simples.
- Busca avançada.
- Listagem de compositores.
- Páginas de obras.
- Diretório de editoras.
- Documentação técnica.
- Assinatura.
- Acesso institucional.
- Possível API.

O projeto do Maestro Tiago Santos deve preservar essa raiz funcional, mas avançar com uma camada própria e mais adequada ao contexto brasileiro:

- Banco de dados relacional.
- Busca avançada por critérios musicais.
- Catálogo de compositores brasileiros.
- Catálogo de obras brasileiras.
- Instrumentação estruturada.
- Fontes, editoras e acervos.
- Manuscritos e fontes primárias.
- Referências bibliográficas.
- Grau de confiabilidade.
- Histórico de revisões.
- Área de assinantes.
- Admin editorial.
- Importação de dados.
- Paywall.
- Exportação.
- Possibilidade futura de API.
- Possibilidade futura de busca inteligente.

O maior risco não está no desenvolvimento visual. Está na qualidade da modelagem dos dados e na padronização musicológica. Se essa fundação for bem feita, a plataforma pode se tornar uma referência acadêmica, cultural e profissional para o repertório brasileiro de concerto.
