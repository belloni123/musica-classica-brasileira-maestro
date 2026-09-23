import Link from "next/link";
import { getCurrentProfile, hasCompleteCatalogAccess } from "@/lib/auth/session";
import { CatalogWorkDetails } from "@/components/catalog/work-details";
import { notFound } from "next/navigation";
import { ContentLock } from "@/components/ui/content-lock";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { compositionYearLabel } from "@/lib/catalog/options";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

function composerName(value: { display_name: string } | Array<{ display_name: string }> | null) {
  if (Array.isArray(value)) return value[0]?.display_name ?? "-";
  return value?.display_name ?? "-";
}

export default async function PublicWorkPage({ params }: PageProps) {
  const { slug } = await params;

  const profile = await getCurrentProfile();
    const supabase = await createClient();
    const { data: work, error } = await supabase
      .from("works")
      .select(
        "id,display_title,composition_year_start,composition_year_end,composition_date_text,formation_type,duration_minutes,composers(display_name)",
      )
      .eq("slug", slug)
      .eq("publication_status", "published")
      .maybeSingle();

    if (error) throw new Error("Não foi possível consultar a obra.");
    if (!work) notFound();

    return (
      <div className="grid gap-8">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm text-[var(--accent)]">Obra</p>
          <h1 className="text-3xl font-semibold leading-tight text-[var(--foreground-strong)] sm:text-4xl md:text-5xl">
            {work.display_title}
          </h1>
          <p className="mt-4 text-lg text-[var(--muted-foreground)]">
            {composerName(work.composers)} · {compositionYearLabel(work.composition_year_start, work.composition_year_end, work.composition_date_text)}
          </p>
        </div>
        {hasCompleteCatalogAccess(profile)
          ? <CatalogWorkDetails workId={work.id} durationMinutes={work.duration_minutes} formationType={work.formation_type} />
          : <><Card><h2 className="text-2xl">Informações para performance</h2><dl className="mt-4 grid gap-3 text-sm"><div><dt>Duração</dt><dd>{work.duration_minutes != null ? `${work.duration_minutes} min` : "Não informada"}</dd></div><div><dt>Meio de execução</dt><dd>{work.formation_type ?? "Não informado"}</dd></div></dl></Card><ContentLock /></>}
        <Link className="underline" href="/buscar">Voltar à pesquisa</Link>
      </div>
    );
}
