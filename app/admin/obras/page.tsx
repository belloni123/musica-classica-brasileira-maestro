import Link from "next/link";
import { Archive, CheckCircle2, Edit, Plus, Search } from "lucide-react";
import { archiveWork, publishWork } from "@/app/admin/obras/actions";
import { AdminNav } from "@/components/layout/admin-nav";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { Badge, publicationStatusLabel, publicationStatusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  getCurrentProfile,
  hasEditorialWriteAccess,
  requireAdminAccess,
} from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

const pageSize = 10;

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

type WorkRow = {
  id: string;
  canonical_title: string;
  display_title: string;
  slug: string;
  composition_year_start: number | null;
  duration_minutes: number | null;
  formation_type: string | null;
  publication_status: string;
  composers: { display_name: string } | Array<{ display_name: string }> | null;
};

function buildHref(query: string, page: number) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  params.set("page", String(page));
  return `/admin/obras?${params.toString()}`;
}

async function fetchWorks(query: string, page: number) {
  try {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let request = supabase
      .from("works")
      .select(
        "id,canonical_title,display_title,slug,composition_year_start,duration_minutes,formation_type,publication_status,composers(display_name)",
        { count: "exact" },
      )
      .order("updated_at", { ascending: false })
      .range(from, to);

    if (query) {
      const cleaned = query.replace(/[,()]/g, " ").trim();
      request = request.or(`canonical_title.ilike.%${cleaned}%,display_title.ilike.%${cleaned}%,slug.ilike.%${cleaned}%`);
    }

    const { data, error, count } = await request;
    if (error) throw error;
    return { works: (data ?? []) as unknown as WorkRow[], total: count ?? 0, error: null };
  } catch (error) {
    return {
      works: [] as WorkRow[],
      total: 0,
      error: error instanceof Error ? error.message : "Erro ao carregar obras.",
    };
  }
}

function composerName(value: WorkRow["composers"]) {
  if (Array.isArray(value)) {
    return value[0]?.display_name ?? "-";
  }

  return value?.display_name ?? "-";
}

export default async function AdminWorksPage({ searchParams }: PageProps) {
  await requireAdminAccess();
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const currentPage = Math.max(Number(params.page ?? "1") || 1, 1);
  const profile = await getCurrentProfile();
  const canWrite = hasEditorialWriteAccess(profile);
  const { works, total, error } = await fetchWorks(query, currentPage);

  return (
    <>
      <AdminNav />
      <section className="grid flex-1 gap-6">
        <AdminPageHeader
          title="Obras"
          description="Cadastro editorial inicial de obras brasileiras de concerto."
          action={
            canWrite ? (
              <Button asChild>
                <Link href="/admin/obras/nova">
                  <Plus size={16} aria-hidden="true" />
                  Nova obra
                </Link>
              </Button>
            ) : null
          }
        />

        <Card>
          <form action="/admin/obras" className="flex flex-col gap-3 md:flex-row">
            <label className="grid flex-1 gap-2 text-sm font-medium">
              Buscar
              <Input defaultValue={query} name="q" placeholder="Título ou slug" />
            </label>
            <div className="flex items-end">
              <Button type="submit" variant="secondary">
                <Search size={16} aria-hidden="true" />
                Buscar
              </Button>
            </div>
          </form>
        </Card>

        {error ? <Card className="text-sm text-[var(--accent)]">{error}</Card> : null}

        {works.length === 0 ? (
          <EmptyState title="Nenhuma obra encontrada" />
        ) : (
          <div className="overflow-hidden rounded-md border border-[var(--border)] bg-white">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-[var(--muted)] text-xs uppercase text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3">Obra</th>
                  <th className="px-4 py-3">Compositor</th>
                  <th className="px-4 py-3">Dados</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {works.map((work) => {
                  const publishAction = publishWork.bind(null, work.id);
                  const archiveAction = archiveWork.bind(null, work.id);
                  return (
                    <tr className="border-t border-[var(--border)]" key={work.id}>
                      <td className="px-4 py-3">
                        <div className="font-medium">{work.display_title}</div>
                        <div className="text-xs text-[var(--muted-foreground)]">{work.slug}</div>
                      </td>
                      <td className="px-4 py-3">{composerName(work.composers)}</td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">
                        {[work.composition_year_start, work.formation_type, work.duration_minutes ? `${work.duration_minutes} min` : null]
                          .filter(Boolean)
                          .join(" · ") || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={publicationStatusTone(work.publication_status)}>
                          {publicationStatusLabel(work.publication_status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {canWrite ? (
                          <div className="flex flex-wrap gap-2">
                            <Button asChild size="sm" variant="secondary">
                              <Link href={`/admin/obras/${work.id}/editar`}>
                                <Edit size={14} aria-hidden="true" />
                                Editar
                              </Link>
                            </Button>
                            <form action={publishAction}>
                              <Button size="sm" type="submit" variant="ghost">
                                <CheckCircle2 size={14} aria-hidden="true" />
                                Publicar
                              </Button>
                            </form>
                            <form action={archiveAction}>
                              <Button size="sm" type="submit" variant="ghost">
                                <Archive size={14} aria-hidden="true" />
                                Arquivar
                              </Button>
                            </form>
                          </div>
                        ) : (
                          <span className="text-xs text-[var(--muted-foreground)]">Somente leitura</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          buildHref={(page) => buildHref(query, page)}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={total}
        />
      </section>
    </>
  );
}
