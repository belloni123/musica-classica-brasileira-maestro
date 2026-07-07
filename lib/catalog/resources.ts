export type CatalogResource = {
  slug: string;
  title: string;
  description: string;
  sections: Array<{
    title: string;
    body: string[];
  }>;
};

export const catalogResources: CatalogResource[] = [
  {
    slug: "editoras",
    title: "Editoras e acervos",
    description: "Índice operacional de editoras, bibliotecas, arquivos, espólios e instituições.",
    sections: [
      {
        title: "Como usar",
        body: [
          "Use esta área para localizar detentores de fontes, materiais de execução, partituras, gravações, notas de programa e links de referência.",
          "No MVP, o cadastro de fontes já existe no painel administrativo. A listagem pública pode ser alimentada aos poucos conforme os registros forem verificados.",
        ],
      },
      {
        title: "Dados recomendados",
        body: [
          "Nome oficial, tipo de instituição, cidade, estado, país, site, e-mail, pessoa de contato, condições de acesso e data da última verificação.",
          "Quando uma obra tiver materiais associados, o vínculo deve apontar para a fonte cadastrada em vez de repetir informações soltas.",
        ],
      },
    ],
  },
  {
    slug: "ferramenta",
    title: "Esta ferramenta",
    description: "Notas de uso sobre a base, a busca e a leitura dos dados catalográficos.",
    sections: [
      {
        title: "Objetivo",
        body: [
          "A plataforma organiza repertório brasileiro de concerto para pesquisa, programação, estudo e curadoria.",
          "Os dados principais são compositores, obras, formação, instrumentação, duração, fontes, referências e notas editoriais.",
        ],
      },
      {
        title: "Leitura dos registros",
        body: [
          "Anos de composição, duração e instrumentação devem ser tratados como dados verificáveis, com nível de confiabilidade e fonte sempre que possível.",
          "Títulos, nomes alternativos, pseudônimos e números de catálogo ajudam a busca a encontrar obras mesmo quando o usuário não sabe a forma canônica.",
        ],
      },
    ],
  },
  {
    slug: "praticas-instrumentais",
    title: "Práticas instrumentais",
    description: "Notas para interpretar instrumentação, dobramentos e particularidades de execução.",
    sections: [
      {
        title: "Dobramentos e instrumentos auxiliares",
        body: [
          "Quando uma parte exige que o mesmo músico toque instrumento auxiliar, registre isso como dobramento, não apenas como instrumento adicional.",
          "Piccolo, corne inglês, clarinete baixo, contrafagote, saxofones, teclados, harpa e percussões devem ser descritos com clareza para planejamento de ensaio e contratação.",
        ],
      },
      {
        title: "Instrumentos brasileiros",
        body: [
          "Instrumentos como berimbau, pandeiro, viola caipira, rabeca, cavaquinho, alfaia e atabaques devem ser tratados como parte central da formação quando forem estruturalmente relevantes.",
          "Sempre que houver prática regional ou técnica específica, registre uma nota editorial curta e uma fonte.",
        ],
      },
    ],
  },
  {
    slug: "altura-e-transposicao",
    title: "Altura e transposição",
    description: "Referência rápida para notação de alturas, oitavas e instrumentos transpositores.",
    sections: [
      {
        title: "Notação de oitavas",
        body: [
          "Use um padrão consistente de oitavas nos campos técnicos. Uma referência comum é considerar o dó central como C4.",
          "Quando a fonte usar outro padrão, registre a equivalência ou mantenha a informação em nota editorial.",
        ],
      },
      {
        title: "Transposição",
        body: [
          "Instrumentos transpositores devem ser descritos de forma útil para quem prepara material, por exemplo clarinete em Si bemol, trompa em Fá ou saxofone alto em Mi bemol.",
          "Se a partitura exigir instrumento raro ou afinação alternativa, deixe isso visível no campo de instrumentação ou nas notas de performance.",
        ],
      },
    ],
  },
  {
    slug: "abreviaturas",
    title: "Abreviaturas",
    description: "Glossário inicial de siglas usadas em instrumentação e referências.",
    sections: [
      {
        title: "Madeiras e metais",
        body: [
          "fl: flauta; pic: piccolo; ob: oboé; ci: corne inglês; cl: clarinete; clb: clarinete baixo; fg: fagote; cfg: contrafagote.",
          "tpa: trompa; tpt: trompete; tbn: trombone; tb: tuba; euph: eufônio.",
        ],
      },
      {
        title: "Cordas, vozes e outros",
        body: [
          "vn: violino; va: viola; vc: violoncelo; cb: contrabaixo; hp: harpa; pn: piano; cel: celesta; perc: percussão; timp: tímpanos.",
          "sop: soprano; mezzo: mezzo-soprano; ct: contralto; ten: tenor; bar: barítono; bx: baixo; coro SATB: coro misto a quatro vozes.",
        ],
      },
      {
        title: "Materiais e fontes",
        body: [
          "part.: partitura; mat.: material de execução; partes: partes instrumentais; manuscr.: manuscrito; ed. crit.: edição crítica; n.d.: sem data identificada.",
        ],
      },
    ],
  },
  {
    slug: "programacao",
    title: "Programação e orquestração",
    description: "Critérios curatoriais para encontrar repertório compatível com um projeto artístico.",
    sections: [
      {
        title: "Combinação de critérios",
        body: [
          "Comece pela formação disponível, duração desejada e presença de solistas ou coro. Depois refine por período, região, identidade curatorial ou tema.",
          "A pesquisa avançada existe justamente para cruzar necessidades práticas com repertório musical.",
        ],
      },
      {
        title: "Uso editorial",
        body: [
          "Quando uma busca revelar lacunas, registre quais campos precisam ser completados no cadastro da obra: duração, fonte, instrumentação ou notas de performance.",
        ],
      },
    ],
  },
];

export function getCatalogResource(slug: string) {
  return catalogResources.find((resource) => resource.slug === slug) ?? null;
}
