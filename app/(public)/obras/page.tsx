import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { createClient } from "@/lib/supabase/server";

type WorkRow = {
  id: string;
  display_title: string;
  canonical_title: string;
  slug: string;
  composition_year_start: number | null;
  duration_minutes: number | null;
  formation_type: string | null;
  public_summary: string | null;
  composers: { display_name: string } | Array<{ display_name: string }> | null;
};

export const dynamic = "force-dynamic";

function composerName(value: WorkRow["composers"]) {
  if (Array.isArray(value)) return value[0]?.display_name ?? "-";
  return value?.display_name ?? "-";
}

async function fetchPublishedWorks() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("works")
      .select(
        "id,display_title,canonical_title,slug,composition_year_start,duration_minutes,formation_type,public_summary,composers(display_name)",
      )
      .eq("publication_status", "published")
      .order("display_title", { ascending: true })
      .limit(100);

    if (error) throw error;
    return { works: (data ?? []) as unknown as WorkRow[], error: null };
  } catch (error) {
    return {
      works: [] as WorkRow[],
      error: error instanceof Error ? error.message : "Base ainda não conectada.",
    };
  }
}

export default async function WorksPage() {
  const { works, error } = await fetchPublishedWorks();

  return (
    <div className="grid gap-8">
      <div className="max-w-3xl">
        <p className="mb-3 text-sm text-[var(--accent)]">Catálogo público</p>
        <h1 className="text-3xl font-semibold leading-tight text-[var(--foreground-strong)] sm:text-4xl md:text-5xl">
          Obras
        </h1>
        <p className="mt-4 text-lg leading-8 text-[var(--muted-foreground)]">
          Obras publicadas da música brasileira de concerto.
        </p>
      </div>
      {error ? <Card className="text-sm text-[var(--muted-foreground)]">{error}</Card> : null}
      {works.length === 0 ? (
        <EmptyState
          title="Nenhuma obra publicada"
          description="A listagem será preenchida quando houver obras publicadas no Supabase."
        />
      ) : (
        <div className="grid gap-4">
          {works.map((work) => (
            <Link href={`/obras/${work.slug}`} key={work.id}>
              <Card className="transition-colors hover:border-[var(--border-strong)]">
                <h2 className="text-xl font-normal">{work.display_title}</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {composerName(work.composers)} · {work.composition_year_start ?? "s/d"} ·{" "}
                  {work.formation_type ?? "formação não informada"}
                </p>
                {work.public_summary ? (
                  <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                    {work.public_summary}
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
