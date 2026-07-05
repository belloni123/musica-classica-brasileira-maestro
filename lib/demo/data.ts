export const demoUser = {
  id: "00000000-0000-4000-8000-000000000001",
  email: "demo@musicabrasileira.dev",
};

export const demoProfile = {
  id: demoUser.id,
  email: demoUser.email,
  full_name: "Cliente Demo",
  role: "admin",
  status: "active",
};

export const demoComposers = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    canonical_name: "Villa-Lobos, Heitor",
    display_name: "Heitor Villa-Lobos",
    surname: "Villa-Lobos",
    alternative_names: ["H. Villa-Lobos"],
    pseudonyms: [],
    slug: "heitor-villa-lobos",
    birth_date: "1887-03-05",
    death_date: "1959-11-17",
    birth_year: 1887,
    death_year: 1959,
    birth_city: "Rio de Janeiro",
    birth_state: "RJ",
    birth_country: "Brasil",
    death_city: "Rio de Janeiro",
    death_state: "RJ",
    nationality: "Brasileira",
    gender: "Masculino",
    ethnicity_identity: null,
    brazil_region: "Sudeste",
    short_biography:
      "Compositor central da música brasileira de concerto, com produção sinfônica, camerística, vocal e pedagógica.",
    long_biography:
      "Heitor Villa-Lobos ocupa posição fundamental na consolidação de uma linguagem brasileira de concerto no século XX. Esta biografia é demonstrativa e serve para validar leitura, hierarquia e navegação da plataforma.",
    biography_source: "Registro demonstrativo",
    official_website: "",
    notes: "Registro de demonstração.",
    publication_status: "published",
    reliability_level: "secondary_source_confirmed",
    updated_at: "2026-07-01T12:00:00.000Z",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    canonical_name: "Mignone, Francisco",
    display_name: "Francisco Mignone",
    surname: "Mignone",
    alternative_names: [],
    pseudonyms: [],
    slug: "francisco-mignone",
    birth_date: "1897-09-03",
    death_date: "1986-02-19",
    birth_year: 1897,
    death_year: 1986,
    birth_city: "São Paulo",
    birth_state: "SP",
    birth_country: "Brasil",
    death_city: "Rio de Janeiro",
    death_state: "RJ",
    nationality: "Brasileira",
    gender: "Masculino",
    ethnicity_identity: null,
    brazil_region: "Sudeste",
    short_biography:
      "Compositor, regente e pianista, associado a repertórios orquestrais, vocais e pianísticos.",
    long_biography:
      "Francisco Mignone é apresentado aqui como registro demonstrativo para avaliação do fluxo editorial.",
    biography_source: "Registro demonstrativo",
    official_website: "",
    notes: "Registro de demonstração.",
    publication_status: "published",
    reliability_level: "secondary_source_confirmed",
    updated_at: "2026-07-02T12:00:00.000Z",
  },
];

export const demoInstrumentFamilies = [
  { id: "fam-strings", name: "Cordas", display_order: 1 },
  { id: "fam-woods", name: "Madeiras", display_order: 2 },
  { id: "fam-brass", name: "Metais", display_order: 3 },
  { id: "fam-percussion", name: "Percussão", display_order: 4 },
];

export const demoInstruments = [
  {
    id: "inst-flute",
    name: "Flauta",
    plural_name: "Flautas",
    abbreviation: "fl.",
    family: "Madeiras",
    family_id: "fam-woods",
    subfamily: "Madeiras",
    alternative_names: [],
    is_brazilian_instrument: false,
    active: true,
    display_order: 1,
    notes: "",
  },
  {
    id: "inst-violin",
    name: "Violino",
    plural_name: "Violinos",
    abbreviation: "vln.",
    family: "Cordas",
    family_id: "fam-strings",
    subfamily: "Cordas friccionadas",
    alternative_names: [],
    is_brazilian_instrument: false,
    active: true,
    display_order: 2,
    notes: "",
  },
  {
    id: "inst-berimbau",
    name: "Berimbau",
    plural_name: "Berimbaus",
    abbreviation: "ber.",
    family: "Percussão",
    family_id: "fam-percussion",
    subfamily: "Instrumentos brasileiros",
    alternative_names: [],
    is_brazilian_instrument: true,
    active: true,
    display_order: 3,
    notes: "Instrumento brasileiro incluído para demonstração curatorial.",
  },
];

export const demoWorks = [
  {
    id: "33333333-3333-4333-8333-333333333333",
    composer_id: demoComposers[0].id,
    canonical_title: "Bachianas brasileiras n. 4",
    display_title: "Bachianas brasileiras n. 4",
    alternative_titles: [],
    original_title: "Bachianas brasileiras n. 4",
    translated_title: "",
    slug: "bachianas-brasileiras-n-4",
    composition_year_start: 1930,
    composition_year_end: 1941,
    composition_date_text: "1930-1941",
    revision_year: null,
    opus: "",
    catalog: "",
    catalog_number: "",
    duration_minutes: 21,
    duration_minimum: 18,
    duration_maximum: 24,
    formation_type: "Orquestra",
    difficulty_level: "Avançado",
    has_choir: false,
    has_soloist: false,
    has_electronics: false,
    has_brazilian_instruments: false,
    educational_work: false,
    youth_work: false,
    public_domain: false,
    rights_status: "Verificar",
    work_status: "Obra publicada",
    public_summary:
      "Exemplo de obra orquestral exibida na demo para avaliação da ficha pública e editorial.",
    subscriber_notes: "Notas completas ficariam disponíveis em plano futuro.",
    performance_notes: "Notas demonstrativas de performance.",
    editorial_notes: "Registro de demonstração.",
    main_source: "Fonte demonstrativa",
    instrumentation_text: "Madeiras, metais, percussão e cordas.",
    reliability_level: "secondary_source_confirmed",
    publication_status: "published",
    updated_at: "2026-07-02T12:00:00.000Z",
    composers: { display_name: demoComposers[0].display_name },
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    composer_id: demoComposers[1].id,
    canonical_title: "Festa das igrejas",
    display_title: "Festa das igrejas",
    alternative_titles: [],
    original_title: "Festa das igrejas",
    translated_title: "",
    slug: "festa-das-igrejas",
    composition_year_start: 1940,
    composition_year_end: null,
    composition_date_text: "c. 1940",
    revision_year: null,
    opus: "",
    catalog: "",
    catalog_number: "",
    duration_minutes: 16,
    duration_minimum: 14,
    duration_maximum: 18,
    formation_type: "Orquestra",
    difficulty_level: "Intermediário",
    has_choir: false,
    has_soloist: false,
    has_electronics: false,
    has_brazilian_instruments: false,
    educational_work: false,
    youth_work: false,
    public_domain: false,
    rights_status: "Verificar",
    work_status: "Obra publicada",
    public_summary: "Registro demonstrativo para navegação por obras e edição no painel.",
    subscriber_notes: "",
    performance_notes: "",
    editorial_notes: "",
    main_source: "Fonte demonstrativa",
    instrumentation_text: "Orquestra sinfônica.",
    reliability_level: "secondary_source_confirmed",
    publication_status: "published",
    updated_at: "2026-07-03T12:00:00.000Z",
    composers: { display_name: demoComposers[1].display_name },
  },
];

export const demoWorkInstrumentation = [
  {
    id: "wi-1",
    work_id: demoWorks[0].id,
    instrument_id: "inst-flute",
    minimum_quantity: 2,
    maximum_quantity: 2,
    quantity_text: "2",
    required: true,
    optional: false,
    doubling: false,
    doubled_instrument_id: null,
    substitutable: false,
    notes: "",
    source: "Partitura demonstrativa",
  },
];

export const demoSourceHolders = [
  {
    id: "source-1",
    name: "Arquivo demonstrativo",
    type: "archive",
    country: "Brasil",
    state: "RJ",
    city: "Rio de Janeiro",
    address: "",
    email: "arquivo@example.com",
    phone: "",
    website: "https://example.com",
    contact_person: "Equipe de acervo",
    notes: "Fonte fictícia para validação do fluxo.",
    active: true,
    updated_at: "2026-07-03T12:00:00.000Z",
  },
];

export const demoReferences = [
  {
    id: "ref-1",
    type: "catalog",
    author: "Equipe editorial",
    title: "Catálogo demonstrativo da música brasileira de concerto",
    year: 2026,
    publisher: "Demo",
    institution: "MBC",
    place: "São Paulo",
    doi: "",
    url: "https://example.com",
    accessed_at: "2026-07-05",
    notes: "Referência de demonstração.",
    updated_at: "2026-07-03T12:00:00.000Z",
  },
];

export const demoTaxonomies = [
  {
    id: "tax-1",
    type: "formation",
    name: "Orquestra sinfônica",
    slug: "orquestra-sinfonica",
    description: "Formação orquestral para filtros futuros.",
    active: true,
    updated_at: "2026-07-03T12:00:00.000Z",
  },
];

export const demoRevisionHistory = [
  {
    id: "rev-1",
    entity_type: "works",
    entity_id: demoWorks[0].id,
    field_name: "publication_status",
    changed_at: "2026-07-04T10:00:00.000Z",
  },
];

export const demoImportBatches = [
  {
    id: "batch-1",
    file_name: "obras-demo.csv",
    file_type: "csv",
    entity_type: "works",
    status: "validating",
    total_rows: 24,
    valid_rows: 21,
    error_rows: 3,
    created_at: "2026-07-04T10:00:00.000Z",
  },
];

export const demoFavorites = [
  { id: "fav-1", user_id: demoUser.id, work_id: demoWorks[0].id, created_at: "2026-07-05T10:00:00.000Z", works: demoWorks[0] },
];

export const demoRepertoireLists = [
  {
    id: "list-1",
    user_id: demoUser.id,
    name: "Programa sinfônico brasileiro",
    description: "Lista demonstrativa para planejamento de repertório.",
    private: true,
    created_at: "2026-07-05T10:00:00.000Z",
  },
];

export const demoSavedSearches = [
  {
    id: "search-1",
    user_id: demoUser.id,
    name: "Obras orquestrais publicadas",
    parameters_json: { formation_type: "Orquestra", publication_status: "published" },
    created_at: "2026-07-05T10:00:00.000Z",
  },
];

export function getDemoTable(table: string) {
  const tables: Record<string, unknown[]> = {
    profiles: [demoProfile],
    composers: demoComposers,
    works: demoWorks,
    instrument_families: demoInstrumentFamilies,
    instruments: demoInstruments,
    work_instrumentation: demoWorkInstrumentation,
    source_holders: demoSourceHolders,
    bibliographic_references: demoReferences,
    taxonomies: demoTaxonomies,
    revision_history: demoRevisionHistory,
    import_batches: demoImportBatches,
    favorites: demoFavorites,
    repertoire_lists: demoRepertoireLists,
    saved_searches: demoSavedSearches,
    audit_logs: [],
  };

  return [...(tables[table] ?? [])];
}
