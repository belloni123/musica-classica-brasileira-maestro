import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { createClient } from "@/lib/supabase/server";

type ComposerRow = {
  id: string;
  display_name: string;
  canonical_name: string;
  slug: string;
  birth_year: number | null;
  death_year: number | null;
  nationality: string | null;
  short_biography: string | null;
};

async function fetchPublishedComposers() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("composers")
      .select("id,display_name,canonical_name,slug,birth_year,death_year,nationality,short_biography")
      .eq("publication_status", "published")
      .order("display_name", { ascending: true })
      .limit(100);

    if (error) throw error;
    return { composers: (data ?? []) as ComposerRow[], error: null };
  } catch (error) {
    return {
      composers: [] as ComposerRow[],
      error: error instanceof Error ? error.message : "Base ainda não conectada.",
    };
  }
}

export default async function ComposersPage() {
  const { composers, error } = await fetchPublishedComposers();

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold">Compositores</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Índice público de compositores publicados na base.
        </p>
      </div>
      {error ? <Card className="text-sm text-[var(--muted-foreground)]">{error}</Card> : null}
      {composers.length === 0 ? (
        <EmptyState
          title="Nenhum compositor publicado"
          description="A listagem será preenchida quando o Supabase real estiver configurado e houver registros publicados."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {composers.map((composer) => (
            <Link href={`/compositores/${composer.slug}`} key={composer.id}>
              <Card className="h-full transition-colors hover:border-[var(--primary)]">
                <h2 className="font-semibold">{composer.display_name}</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {composer.birth_year ?? "?"} - {composer.death_year ?? ""} ·{" "}
                  {composer.nationality ?? "nacionalidade não informada"}
                </p>
                {composer.short_biography ? (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--muted-foreground)]">
                    {composer.short_biography}
                  </p>
                ) : null}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
