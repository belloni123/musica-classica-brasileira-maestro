import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export const dynamic = "force-dynamic";

const SEARCH_RESULT_LIMIT = 20;

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
};

function sanitizeSearchQuery(query: string) {
  return query
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

async function runSearch(query: string) {
  const cleaned = sanitizeSearchQuery(query);

  if (!cleaned) {
    return { composers: [] as ComposerResult[], works: [] as WorkResult[], error: null };
  }

  try {
    const supabase = await createClient();
    const [composerResult, workResult] = await Promise.all([
      supabase
        .from("composers")
        .select("id,display_name,slug,short_biography")
        .eq("publication_status", "published")
        .or(`canonical_name.ilike.%${cleaned}%,display_name.ilike.%${cleaned}%,slug.ilike.%${cleaned}%`)
        .limit(SEARCH_RESULT_LIMIT),
      supabase
        .from("works")
        .select("id,display_title,slug,public_summary")
        .eq("publication_status", "published")
        .or(`canonical_title.ilike.%${cleaned}%,display_title.ilike.%${cleaned}%,slug.ilike.%${cleaned}%`)
        .limit(SEARCH_RESULT_LIMIT),
    ]);

    if (composerResult.error) throw composerResult.error;
    if (workResult.error) throw workResult.error;

    return {
      composers: (composerResult.data ?? []) as ComposerResult[],
      works: (workResult.data ?? []) as WorkResult[],
      error: null,
    };
  } catch (error) {
    return {
      composers: [] as ComposerResult[],
      works: [] as WorkResult[],
      error: error instanceof Error ? error.message : "Busca indisponível.",
    };
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const { composers, works, error } = await runSearch(query);
  const hasResults = composers.length > 0 || works.length > 0;

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold">Buscar</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Busca simples inicial em compositores e obras publicados.
        </p>
      </div>
      <Card>
        <form action="/buscar" className="flex flex-col gap-3 md:flex-row">
          <label className="grid flex-1 gap-2 text-sm font-medium">
            Termo
            <Input defaultValue={query} name="q" placeholder="Compositor, obra ou palavra-chave" />
          </label>
          <div className="flex items-end">
            <Button type="submit">
              <Search size={16} aria-hidden="true" />
              Buscar
            </Button>
          </div>
        </form>
      </Card>
      {error ? <Card className="text-sm text-[var(--muted-foreground)]">{error}</Card> : null}
      {!query ? (
        <EmptyState title="Digite um termo para buscar" />
      ) : !hasResults ? (
        <EmptyState title="Nenhum resultado encontrado" />
      ) : (
        <div className="grid gap-6">
          <section className="grid gap-3">
            <h2 className="text-xl font-semibold">Compositores</h2>
            {composers.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">Nenhum compositor encontrado.</p>
            ) : (
              composers.map((composer) => (
                <Link href={`/compositores/${composer.slug}`} key={composer.id}>
                  <Card className="transition-colors hover:border-[var(--primary)]">
                    <h3 className="font-semibold">{composer.display_name}</h3>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {composer.short_biography ?? "Sem resumo público."}
                    </p>
                  </Card>
                </Link>
              ))
            )}
          </section>
          <section className="grid gap-3">
            <h2 className="text-xl font-semibold">Obras</h2>
            {works.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">Nenhuma obra encontrada.</p>
            ) : (
              works.map((work) => (
                <Link href={`/obras/${work.slug}`} key={work.id}>
                  <Card className="transition-colors hover:border-[var(--primary)]">
                    <h3 className="font-semibold">{work.display_title}</h3>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
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
