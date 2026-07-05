import Link from "next/link";
import { Edit, Plus, Power, Search } from "lucide-react";
import { setSourceHolderActive } from "@/app/admin/fontes/actions";
import { AdminNav } from "@/components/layout/admin-nav";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { Badge } from "@/components/ui/badge";
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
import { sourceHolderTypes } from "@/lib/validators/source-holder";

const pageSize = 10;

type PageProps = {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
};

type SourceHolderRow = {
  id: string;
  name: string;
  type: string;
  city: string | null;
  state: string | null;
  country: string | null;
  website: string | null;
  active: boolean;
};

const typeLabels: Record<string, string> = {
  publisher: "Editora",
  archive: "Acervo",
  library: "Biblioteca",
  composer_estate: "Espólio",
  institution: "Instituição",
  website: "Website",
  person: "Pessoa",
  other: "Outro",
};

function buildHref(query: string, type: string, page: number) {
  const params = new URLSearchParams();

  if (query) params.set("q", query);
  if (type) params.set("type", type);
  params.set("page", String(page));

  return `/admin/fontes?${params.toString()}`;
}

async function fetchSourceHolders(query: string, type: string, page: number) {
  try {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let request = supabase
      .from("source_holders")
      .select("id,name,type,city,state,country,website,active", { count: "exact" })
      .order("name", { ascending: true })
      .range(from, to);

    if (type) request = request.eq("type", type);
    if (query) {
      const cleaned = query.replace(/[,()]/g, " ").trim();
      request = request.or(`name.ilike.%${cleaned}%,city.ilike.%${cleaned}%,state.ilike.%${cleaned}%,country.ilike.%${cleaned}%`);
    }

    const { data, error, count } = await request;
    if (error) throw error;
    return { sources: (data ?? []) as SourceHolderRow[], total: count ?? 0, error: null };
  } catch (error) {
    return {
      sources: [] as SourceHolderRow[],
      total: 0,
      error: error instanceof Error ? error.message : "Erro ao carregar fontes.",
    };
  }
}

export default async function AdminSourcesPage({ searchParams }: PageProps) {
  await requireAdminAccess();
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const type = params.type?.trim() ?? "";
  const currentPage = Math.max(Number(params.page ?? "1") || 1, 1);
  const profile = await getCurrentProfile();
  const canWrite = hasEditorialWriteAccess(profile);
  const { sources, total, error } = await fetchSourceHolders(query, type, currentPage);

  return (
    <>
      <AdminNav />
      <section className="grid flex-1 gap-6">
        <AdminPageHeader
          title="Fontes, acervos e instituições"
          description="Editoras, bibliotecas, acervos, websites e pessoas relacionadas às fontes."
          action={
            canWrite ? (
              <Button asChild>
                <Link href="/admin/fontes/novo">
                  <Plus size={16} aria-hidden="true" />
                  Nova fonte
                </Link>
              </Button>
            ) : null
          }
        />

        <Card>
          <form action="/admin/fontes" className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
            <label className="grid gap-2 text-sm font-medium">
              Buscar
              <Input defaultValue={query} name="q" placeholder="Nome, cidade, estado ou país" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Tipo
              <select
                className="h-10 rounded-md border border-[var(--border)] bg-white px-3 text-sm"
                defaultValue={type}
                name="type"
              >
                <option value="">Todos</option>
                {sourceHolderTypes.map((sourceType) => (
                  <option key={sourceType} value={sourceType}>
                    {typeLabels[sourceType]}
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

        {sources.length === 0 ? (
          <EmptyState title="Nenhuma fonte encontrada" />
        ) : (
          <div className="overflow-hidden rounded-md border border-[var(--border)] bg-white">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-[var(--muted)] text-xs uppercase text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Local</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((source) => {
                  const toggleAction = setSourceHolderActive.bind(null, source.id, !source.active);
                  return (
                    <tr className="border-t border-[var(--border)]" key={source.id}>
                      <td className="px-4 py-3">
                        <div className="font-medium">{source.name}</div>
                        <div className="text-xs text-[var(--muted-foreground)]">
                          {source.website ?? "Sem website"}
                        </div>
                      </td>
                      <td className="px-4 py-3">{typeLabels[source.type] ?? source.type}</td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">
                        {[source.city, source.state, source.country].filter(Boolean).join(", ") || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={source.active ? "success" : "danger"}>
                          {source.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {canWrite ? (
                          <div className="flex flex-wrap gap-2">
                            <Button asChild size="sm" variant="secondary">
                              <Link href={`/admin/fontes/${source.id}/editar`}>
                                <Edit size={14} aria-hidden="true" />
                                Editar
                              </Link>
                            </Button>
                            <form action={toggleAction}>
                              <Button size="sm" type="submit" variant="ghost">
                                <Power size={14} aria-hidden="true" />
                                {source.active ? "Desativar" : "Ativar"}
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
          buildHref={(page) => buildHref(query, type, page)}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={total}
        />
      </section>
    </>
  );
}
