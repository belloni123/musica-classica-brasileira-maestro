export type SearchDocumentType = "composer" | "work";

export type SearchDocument = {
  id: string;
  type: SearchDocumentType;
  title: string;
  slug: string;
  subtitle: string | null;
  summary: string | null;
  publication_status: "published";
};

export type ComposerSearchSource = {
  id: string;
  display_name: string;
  slug: string;
  birth_year: number | null;
  death_year: number | null;
  nationality: string | null;
  short_biography: string | null;
  publication_status: string;
};

export type WorkSearchSource = {
  id: string;
  display_title: string;
  slug: string;
  composition_year_start: number | null;
  formation_type: string | null;
  public_summary: string | null;
  publication_status: string;
  composers?: { display_name: string } | Array<{ display_name: string }> | null;
};

function composerName(value: WorkSearchSource["composers"]) {
  if (Array.isArray(value)) return value[0]?.display_name ?? null;
  return value?.display_name ?? null;
}

export function mapComposerToSearchDocument(composer: ComposerSearchSource): SearchDocument | null {
  if (composer.publication_status !== "published") return null;

  return {
    id: `composer:${composer.id}`,
    type: "composer",
    title: composer.display_name,
    slug: `/compositores/${composer.slug}`,
    subtitle: [composer.birth_year, composer.death_year].filter(Boolean).join("-") || composer.nationality,
    summary: composer.short_biography,
    publication_status: "published",
  };
}

export function mapWorkToSearchDocument(work: WorkSearchSource): SearchDocument | null {
  if (work.publication_status !== "published") return null;

  return {
    id: `work:${work.id}`,
    type: "work",
    title: work.display_title,
    slug: `/obras/${work.slug}`,
    subtitle: [composerName(work.composers), work.composition_year_start, work.formation_type]
      .filter(Boolean)
      .join(" · "),
    summary: work.public_summary,
    publication_status: "published",
  };
}
