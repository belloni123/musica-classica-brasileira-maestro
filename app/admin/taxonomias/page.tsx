import Link from "next/link";
import { Edit, Plus, Search } from "lucide-react";
import { AdminNav } from "@/components/layout/admin-nav";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { taxonomyTypeLabels } from "@/components/forms/taxonomy-form";
import {
  getCurrentProfile,
  hasEditorialWriteAccess,
  requireAdminAccess,
} from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { taxonomyTypes } from "@/lib/validators/taxonomy";

const pageSize = 12;

type PageProps = {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
};

type TaxonomyRow = {
  id: string;
  name: string;
  type: string;
  slug: string;
  description: string | null;
};

function buildHref(query: string, type: string, page: number) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (type) params.set("type", type);
  params.set("page", String(page));
  return `/admin/taxonomias?${params.toString()}`;
}

async function fetchTaxonomies(query: string, type: string, page: number) {
  try {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let request = supabase
      .from("taxonomies")
      .select("id,name,type,slug,description", { count: "exact" })
      .order("type", { ascending: true })
      .order("name", { ascending: true })
      .range(from, to);

    if (type) request = request.eq("type", type);
    if (query) {
      const cleaned = query.replace(/[,()]/g, " ").trim();
      request = request.or(`name.ilike.%${cleaned}%,slug.ilike.%${cleaned}%,description.ilike.%${cleaned}%`);
    }

    const { data, error, count } = await request;
    if (error) throw error;
    return { taxonomies: (data ?? []) as TaxonomyRow[], total: count ?? 0, error: null };
  } catch (error) {
    return {
      taxonomies: [] as TaxonomyRow[],
      total: 0,
      error: error instanceof Error ? error.message : "Erro ao carregar taxonomias.",
    };
  }
}

export default async function AdminTaxonomiesPage({ searchParams }: PageProps) {
  await requireAdminAccess();
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const type = params.type?.trim() ?? "";
  const currentPage = Math.max(Number(params.page ?? "1") || 1, 1);
  const profile = await getCurrentProfile();
  const canWrite = hasEditorialWriteAccess(profile);
  const { taxonomies, total, error } = await fetchTaxonomies(query, type, currentPage);

  return (
    <>
      <AdminNav />
      <section className="grid flex-1 gap-6">
        <AdminPageHeader
          title="Taxonomias"
          description="Classificações curatoriais, formações, temas, regiões e marcadores."
          action={
            canWrite ? (
              <Button asChild>
                <Link href="/admin/taxonomias/nova">
                  <Plus size={16} aria-hidden="true" />
                  Nova taxonomia
                </Link>
              </Button>
            ) : null
          }
        />

        <Card>
          <form action="/admin/taxonomias" className="grid gap-3 md:grid-cols-[1fr_260px_auto]">
            <label className="grid gap-2 text-sm font-medium">
              Buscar
              <Input defaultValue={query} name="q" placeholder="Nome, slug ou descrição" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Tipo
              <select
                className="h-10 rounded-md border border-[var(--border)] bg-white px-3 text-sm"
                defaultValue={type}
                name="type"
              >
                <option value="">Todos</option>
                {taxonomyTypes.map((taxonomyType) => (
                  <option key={taxonomyType} value={taxonomyType}>
                    {taxonomyTypeLabels[taxonomyType]}
                  </option>
                ))}
              </select>
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

        {taxonomies.length === 0 ? (
          <EmptyState title="Nenhuma taxonomia encontrada" />
        ) : (
          <div className="overflow-hidden rounded-md border border-[var(--border)] bg-white">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-[var(--muted)] text-xs uppercase text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {taxonomies.map((taxonomy) => (
                  <tr className="border-t border-[var(--border)]" key={taxonomy.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{taxonomy.name}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">{taxonomy.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      {taxonomyTypeLabels[taxonomy.type as keyof typeof taxonomyTypeLabels] ?? taxonomy.type}
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">
                      {taxonomy.description ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      {canWrite ? (
                        <Button asChild size="sm" variant="secondary">
                          <Link href={`/admin/taxonomias/${taxonomy.id}/editar`}>
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
          buildHref={(page) => buildHref(query, type, page)}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={total}
        />
      </section>
    </>
  );
}
