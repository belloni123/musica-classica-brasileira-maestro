import Link from "next/link";
import { Archive, CheckCircle2, Edit, Plus, Search } from "lucide-react";
import { AdminNav } from "@/components/layout/admin-nav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { archiveComposer, publishComposer } from "@/app/admin/compositores/actions";
import {
  getCurrentProfile,
  hasEditorialWriteAccess,
  requireAdminAccess,
} from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

const pageSize = 10;

type AdminComposersPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

type ComposerListRow = {
  id: string;
  canonical_name: string;
  display_name: string;
  slug: string;
  birth_year: number | null;
  death_year: number | null;
  nationality: string | null;
  publication_status: string;
  reliability_level: string;
  updated_at: string;
};

function sanitizeSearch(value: string) {
  return value.replace(/[,()]/g, " ").trim();
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    draft: "Rascunho",
    in_review: "Em revisao",
    published: "Publicado",
    archived: "Arquivado",
  };

  return labels[status] ?? status;
}

function buildPageHref(page: number, query: string) {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  params.set("page", String(page));

  return `/admin/compositores?${params.toString()}`;
}

async function fetchComposers(query: string, page: number) {
  try {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const cleanedQuery = sanitizeSearch(query);
    let request = supabase
      .from("composers")
      .select(
        "id,canonical_name,display_name,slug,birth_year,death_year,nationality,publication_status,reliability_level,updated_at",
        { count: "exact" },
      )
      .order("updated_at", { ascending: false })
      .range(from, to);

    if (cleanedQuery) {
      request = request.or(
        `canonical_name.ilike.%${cleanedQuery}%,display_name.ilike.%${cleanedQuery}%,surname.ilike.%${cleanedQuery}%,slug.ilike.%${cleanedQuery}%`,
      );
    }

    const { data, error, count } = await request;

    if (error) {
      throw error;
    }

    return {
      composers: (data ?? []) as ComposerListRow[],
      total: count ?? 0,
      error: null,
    };
  } catch (error) {
    return {
      composers: [] as ComposerListRow[],
      total: 0,
      error: error instanceof Error ? error.message : "Erro ao carregar compositores.",
    };
  }
}

export default async function AdminComposersPage({ searchParams }: AdminComposersPageProps) {
  await requireAdminAccess();
  const params = await searchParams;
  const query = sanitizeSearch(params.q ?? "");
  const currentPage = Math.max(Number(params.page ?? "1") || 1, 1);
  const profile = await getCurrentProfile();
  const canWrite = hasEditorialWriteAccess(profile);
  const { composers, total, error } = await fetchComposers(query, currentPage);
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  return (
    <>
      <AdminNav />
      <section className="grid flex-1 gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Compositores</h1>
            <p className="mt-2 text-[var(--muted-foreground)]">
              Cadastro editorial, status de publicacao e revisao da base.
            </p>
          </div>
          {canWrite ? (
            <Button asChild>
              <Link href="/admin/compositores/novo">
                <Plus size={16} aria-hidden="true" />
                Novo compositor
              </Link>
            </Button>
          ) : null}
        </div>

        <Card>
          <form className="flex flex-col gap-3 md:flex-row" action="/admin/compositores">
            <label className="grid flex-1 gap-2 text-sm font-medium">
              Buscar no admin
              <Input name="q" defaultValue={query} placeholder="Nome, sobrenome ou slug" />
            </label>
            <div className="flex items-end">
              <Button type="submit" variant="secondary">
                <Search size={16} aria-hidden="true" />
                Buscar
              </Button>
            </div>
          </form>
        </Card>

        {error ? (
          <Card>
            <p className="text-sm text-[var(--accent)]">{error}</p>
          </Card>
        ) : null}

        <div className="overflow-hidden rounded-md border border-[var(--border)] bg-white">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[var(--muted)] text-xs uppercase text-[var(--muted-foreground)]">
              <tr>
                <th className="px-4 py-3">Compositor</th>
                <th className="px-4 py-3">Datas</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Confiabilidade</th>
                <th className="px-4 py-3">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {composers.length > 0 ? (
                composers.map((composer) => {
                  const publishAction = publishComposer.bind(null, composer.id);
                  const archiveAction = archiveComposer.bind(null, composer.id);

                  return (
                    <tr className="border-t border-[var(--border)]" key={composer.id}>
                      <td className="px-4 py-3">
                        <div className="font-medium">{composer.display_name}</div>
                        <div className="text-xs text-[var(--muted-foreground)]">
                          {composer.canonical_name} · {composer.slug}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">
                        {composer.birth_year ?? "?"} - {composer.death_year ?? ""}
                      </td>
                      <td className="px-4 py-3">{statusLabel(composer.publication_status)}</td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">
                        {composer.reliability_level}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {canWrite ? (
                            <>
                              <Button asChild size="sm" variant="secondary">
                                <Link href={`/admin/compositores/${composer.id}/editar`}>
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
                            </>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="px-4 py-8 text-center text-[var(--muted-foreground)]" colSpan={5}>
                    Nenhum compositor encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 text-sm text-[var(--muted-foreground)] md:flex-row md:items-center md:justify-between">
          <span>
            Pagina {currentPage} de {totalPages} · {total} registro(s)
          </span>
          <div className="flex gap-2">
            <Button asChild disabled={currentPage <= 1} size="sm" variant="secondary">
              <Link href={buildPageHref(Math.max(currentPage - 1, 1), query)}>Anterior</Link>
            </Button>
            <Button asChild disabled={currentPage >= totalPages} size="sm" variant="secondary">
              <Link href={buildPageHref(Math.min(currentPage + 1, totalPages), query)}>Proxima</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
