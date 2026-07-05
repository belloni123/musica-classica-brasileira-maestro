import Link from "next/link";
import { Edit, Plus, Search } from "lucide-react";
import { AdminNav } from "@/components/layout/admin-nav";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
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

type ReferenceRow = {
  id: string;
  type: string;
  author: string | null;
  title: string;
  year: number | null;
  publisher: string | null;
  institution: string | null;
};

function buildHref(query: string, page: number) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  params.set("page", String(page));
  return `/admin/referencias?${params.toString()}`;
}

async function fetchReferences(query: string, page: number) {
  try {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let request = supabase
      .from("bibliographic_references")
      .select("id,type,author,title,year,publisher,institution", { count: "exact" })
      .order("title", { ascending: true })
      .range(from, to);

    if (query) {
      const cleaned = query.replace(/[,()]/g, " ").trim();
      request = request.or(`title.ilike.%${cleaned}%,author.ilike.%${cleaned}%,publisher.ilike.%${cleaned}%,institution.ilike.%${cleaned}%`);
    }

    const { data, error, count } = await request;
    if (error) throw error;
    return { references: (data ?? []) as ReferenceRow[], total: count ?? 0, error: null };
  } catch (error) {
    return {
      references: [] as ReferenceRow[],
      total: 0,
      error: error instanceof Error ? error.message : "Erro ao carregar referencias.",
    };
  }
}

export default async function AdminReferencesPage({ searchParams }: PageProps) {
  await requireAdminAccess();
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const currentPage = Math.max(Number(params.page ?? "1") || 1, 1);
  const profile = await getCurrentProfile();
  const canWrite = hasEditorialWriteAccess(profile);
  const { references, total, error } = await fetchReferences(query, currentPage);

  return (
    <>
      <AdminNav />
      <section className="grid flex-1 gap-6">
        <AdminPageHeader
          title="Referências"
          description="Bibliografia e registros de apoio para compositores, obras e fontes."
          action={
            canWrite ? (
              <Button asChild>
                <Link href="/admin/referencias/nova">
                  <Plus size={16} aria-hidden="true" />
                  Nova referência
                </Link>
              </Button>
            ) : null
          }
        />

        <Card>
          <form action="/admin/referencias" className="flex flex-col gap-3 md:flex-row">
            <label className="grid flex-1 gap-2 text-sm font-medium">
              Buscar
              <Input defaultValue={query} name="q" placeholder="Título, autor ou publicação" />
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

        {references.length === 0 ? (
          <EmptyState title="Nenhuma referência encontrada" />
        ) : (
          <div className="overflow-hidden rounded-md border border-[var(--border)] bg-white">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-[var(--muted)] text-xs uppercase text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3">Título</th>
                  <th className="px-4 py-3">Autor</th>
                  <th className="px-4 py-3">Ano</th>
                  <th className="px-4 py-3">Publicação</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {references.map((reference) => (
                  <tr className="border-t border-[var(--border)]" key={reference.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{reference.title}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">{reference.type}</div>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">
                      {reference.author ?? "-"}
                    </td>
                    <td className="px-4 py-3">{reference.year ?? "-"}</td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">
                      {reference.publisher ?? reference.institution ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      {canWrite ? (
                        <Button asChild size="sm" variant="secondary">
                          <Link href={`/admin/referencias/${reference.id}/editar`}>
                            <Edit size={14} aria-hidden="true" />
                            Editar
                          </Link>
                        </Button>
                      ) : (
                        <span className="text-xs text-[var(--muted-foreground)]">Somente leitura</span>
                      )}
                    </td>
                  </tr>
                ))}
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
