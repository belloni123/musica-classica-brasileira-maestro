import Link from "next/link";
import { Printer, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";

type SearchPageProps = {
  searchParams: Promise<{
    compositor?: string;
    titulo?: string;
    q?: string;
  }>;
};

export const dynamic = "force-dynamic";

const SEARCH_RESULT_LIMIT = 25;

type ComposerResult = {
  id: string;
  display_name: string;
  slug: string;
  short_biography: string | null;
};

type WorkResult = {
  id: string;
  display_title: string;
  slug: string;
  public_summary: string | null;
  composition_year_start: number | null;
  formation_type: string | null;
  composers: { display_name: string } | Array<{ display_name: string }> | null;
};

function sanitizeSearchQuery(query: string) {
  return query
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s'".-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function composerName(value: WorkResult["composers"]) {
  if (Array.isArray(value)) return value[0]?.display_name ?? "-";
  return value?.display_name ?? "-";
}

async function runSearch(composerQuery: string, titleQuery: string) {
  const composer = sanitizeSearchQuery(composerQuery);
  const title = sanitizeSearchQuery(titleQuery);

  if (!composer && !title) {
    return { composers: [] as ComposerResult[], works: [] as WorkResult[], error: null };
  }

  try {
    const supabase = await createClient();
    const composerRequest = supabase
      .from("composers")
      .select("id,display_name,slug,short_biography")
      .eq("publication_status", "published")
      .limit(SEARCH_RESULT_LIMIT);

    const workRequest = supabase
      .from("works")
      .select(
        "id,display_title,slug,public_summary,composition_year_start,formation_type,composers(display_name)",
      )
      .eq("publication_status", "published")
      .limit(SEARCH_RESULT_LIMIT);

    if (composer) {
      composerRequest.or(
        `canonical_name.ilike.%${composer}%,display_name.ilike.%${composer}%,slug.ilike.%${composer}%`,
      );
    }

    if (title) {
      workRequest.or(`canonical_title.ilike.%${title}%,display_title.ilike.%${title}%,slug.ilike.%${title}%`);
    } else if (composer) {
      workRequest.or(`canonical_title.ilike.%${composer}%,display_title.ilike.%${composer}%,slug.ilike.%${composer}%`);
    }

    const [composerResult, workResult] = await Promise.all([composerRequest, workRequest]);

    if (composerResult.error) throw composerResult.error;
    if (workResult.error) throw workResult.error;

    return {
      composers: (composerResult.data ?? []) as ComposerResult[],
      works: (workResult.data ?? []) as unknown as WorkResult[],
      error: null,
    };
  } catch (error) {
    return {
      composers: [] as ComposerResult[],
      works: [] as WorkResult[],
      error: error instanceof Error ? error.message : "Não foi possível concluir a busca.",
    };
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const composerQuery = params.compositor ?? params.q ?? "";
  const titleQuery = params.titulo ?? "";
  const { composers, works, error } = await runSearch(composerQuery, titleQuery);
  const hasQuery = Boolean(sanitizeSearchQuery(composerQuery) || sanitizeSearchQuery(titleQuery));
  const hasResults = composers.length > 0 || works.length > 0;

  return (
    <div className="grid gap-7">
      <div className="flex items-start justify-between gap-4 border-b border-[var(--border-strong)] pb-4">
        <div>
          <h1 className="text-3xl font-semibold leading-tight text-[var(--foreground-strong)]">
            Pesquisa simples
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Busca rápida por compositor, título de obra ou palavra distintiva.
          </p>
        </div>
        <Link className="text-sm font-semibold text-[var(--catalog-blue)]" href="/entrar">
          Entrar
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="flex gap-4">
          <Card className="w-full rounded-none bg-[var(--panel-blue)] p-3">
            <form action="/buscar" className="grid gap-3">
              <label className="grid gap-1 text-sm font-medium">
                Compositor
                <Input
                  className="rounded-sm bg-white"
                  defaultValue={composerQuery}
                  name="compositor"
                  placeholder="Nome do compositor"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                e/ou título da obra
                <Input
                  className="rounded-sm bg-white"
                  defaultValue={titleQuery}
                  name="titulo"
                  placeholder="Título, apelido, opus ou catálogo"
                />
              </label>
              <div className="mt-2 flex items-center gap-2">
                <Button aria-label="Buscar" size="sm" type="submit" variant="secondary">
                  <Search size={19} aria-hidden="true" />
                </Button>
                <Button asChild aria-label="Limpar" size="sm" variant="secondary">
                  <Link href="/buscar">
                    <RotateCcw size={18} aria-hidden="true" />
                  </Link>
                </Button>
                <Button aria-label="Imprimir" size="sm" type="button" variant="secondary">
                  <Printer size={18} aria-hidden="true" />
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="rounded-md border border-[var(--foreground)] bg-[var(--help-blue)] p-4 text-sm leading-6">
          <h2 className="text-xl font-semibold">Informações úteis</h2>
          <p className="mt-2 font-medium">
            A pesquisa simples foi pensada para ser rápida: ela compara o que você digita com nomes
            de compositores e títulos publicados.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 font-medium">
            <li>Use palavras distintivas do título, apelidos ou números de catálogo.</li>
            <li>Evite títulos genéricos quando puder buscar por algo mais específico.</li>
            <li>Quando precisar cruzar duração, formação, coro ou solistas, use a pesquisa avançada.</li>
          </ul>
        </div>
      </div>

      {error ? <Card className="text-sm text-[var(--muted-foreground)]">{error}</Card> : null}
      {!hasQuery ? (
        <EmptyState title="Digite um termo para buscar" />
      ) : !hasResults ? (
        <EmptyState title="Nenhum resultado encontrado" />
      ) : (
        <div className="grid gap-6">
          <section className="grid gap-3">
            <h2 className="text-2xl font-normal">Compositores</h2>
            {composers.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">Nenhum compositor encontrado.</p>
            ) : (
              composers.map((composer) => (
                <Link href={`/compositores/${composer.slug}`} key={composer.id}>
                  <Card className="transition-colors hover:border-[var(--border-strong)]">
                    <h3 className="text-xl font-normal">{composer.display_name}</h3>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {composer.short_biography ?? "Sem resumo público."}
                    </p>
                  </Card>
                </Link>
              ))
            )}
          </section>
          <section className="grid gap-3">
            <h2 className="text-2xl font-normal">Obras</h2>
            {works.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">Nenhuma obra encontrada.</p>
            ) : (
              works.map((work) => (
                <Link href={`/obras/${work.slug}`} key={work.id}>
                  <Card className="transition-colors hover:border-[var(--border-strong)]">
                    <h3 className="text-xl font-normal">{work.display_title}</h3>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {composerName(work.composers)} · {work.composition_year_start ?? "s/d"} ·{" "}
                      {work.formation_type ?? "formação não informada"}
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                      {work.public_summary ?? "Sem resumo público."}
                    </p>
                  </Card>
                </Link>
              ))
            )}
          </section>
        </div>
      )}
    </div>
  );
}
