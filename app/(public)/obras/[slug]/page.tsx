import Link from "next/link";
import { getCurrentProfile, hasCompleteCatalogAccess } from "@/lib/auth/session";
import { CatalogWorkDetails } from "@/components/catalog/work-details";
import { WorkCollectionControls } from "@/components/catalog/work-collection-controls";
import { notFound } from "next/navigation";
import { ContentLock } from "@/components/ui/content-lock";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

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
        "id,display_title,composition_year_start,public_summary,formation_type,duration_minutes,has_choir,has_soloist,composers(display_name)",
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
            {composerName(work.composers)} · {work.composition_year_start ?? "s/d"}
          </p>
        </div>
        <Card>
          <h2 className="text-2xl font-normal">Resumo público</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--muted-foreground)]">
            {work.public_summary ?? "Resumo público não informado."}
          </p>
        </Card>
        <Card>
          <h2 className="text-2xl font-normal">Dados básicos</h2>
          <dl className="mt-3 grid gap-3 text-sm md:grid-cols-2">
            <div>
              <dt className="text-[var(--muted-foreground)]">Formação</dt>
              <dd>{work.formation_type ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted-foreground)]">Duração</dt>
              <dd>{work.duration_minutes ? `${work.duration_minutes} min` : "-"}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted-foreground)]">Coro</dt>
              <dd>{work.has_choir ? "Sim" : "Não"}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted-foreground)]">Solista</dt>
              <dd>{work.has_soloist ? "Sim" : "Não"}</dd>
            </div>
          </dl>
        </Card>
        {profile && <WorkCollectionControls workId={work.id} />}
        {hasCompleteCatalogAccess(profile) ? <CatalogWorkDetails workId={work.id} /> : <ContentLock />}
        <Link className="underline" href="/buscar">Voltar à pesquisa</Link>
      </div>
    );
}
