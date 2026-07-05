import Link from "next/link";
import { Edit, Plus, Power, Search } from "lucide-react";
import { setInstrumentActive } from "@/app/admin/instrumentos/actions";
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

const pageSize = 12;

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

type InstrumentRow = {
  id: string;
  name: string;
  plural_name: string | null;
  abbreviation: string | null;
  family: string;
  is_brazilian_instrument: boolean;
  active: boolean;
  display_order: number;
};

function buildHref(query: string, page: number) {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  params.set("page", String(page));
  return `/admin/instrumentos?${params.toString()}`;
}

async function fetchInstruments(query: string, page: number) {
  try {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let request = supabase
      .from("instruments")
      .select("id,name,plural_name,abbreviation,family,is_brazilian_instrument,active,display_order", {
        count: "exact",
      })
      .order("display_order", { ascending: true })
      .order("name", { ascending: true })
      .range(from, to);

    if (query) {
      const cleaned = query.replace(/[,()]/g, " ").trim();
      request = request.or(`name.ilike.%${cleaned}%,plural_name.ilike.%${cleaned}%,abbreviation.ilike.%${cleaned}%,family.ilike.%${cleaned}%`);
    }

    const { data, error, count } = await request;

    if (error) {
      throw error;
    }

    return { instruments: (data ?? []) as InstrumentRow[], total: count ?? 0, error: null };
  } catch (error) {
    return {
      instruments: [] as InstrumentRow[],
      total: 0,
      error: error instanceof Error ? error.message : "Erro ao carregar instrumentos.",
    };
  }
}

export default async function AdminInstrumentsPage({ searchParams }: PageProps) {
  await requireAdminAccess();
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const currentPage = Math.max(Number(params.page ?? "1") || 1, 1);
  const profile = await getCurrentProfile();
  const canWrite = hasEditorialWriteAccess(profile);
  const { instruments, total, error } = await fetchInstruments(query, currentPage);

  return (
    <>
      <AdminNav />
      <section className="grid flex-1 gap-6">
        <AdminPageHeader
          title="Instrumentos"
          description="Dicionário instrumental usado pela instrumentação estruturada."
          action={
            canWrite ? (
              <Button asChild>
                <Link href="/admin/instrumentos/novo">
                  <Plus size={16} aria-hidden="true" />
                  Novo instrumento
                </Link>
              </Button>
            ) : null
          }
        />

        <Card>
          <form action="/admin/instrumentos" className="flex flex-col gap-3 md:flex-row">
            <label className="grid flex-1 gap-2 text-sm font-medium">
              Buscar
              <Input defaultValue={query} name="q" placeholder="Nome, abreviação ou família" />
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

        {instruments.length === 0 ? (
          <EmptyState title="Nenhum instrumento encontrado" />
        ) : (
          <div className="overflow-hidden rounded-md border border-[var(--border)] bg-white">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-[var(--muted)] text-xs uppercase text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3">Instrumento</th>
                  <th className="px-4 py-3">Família</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {instruments.map((instrument) => {
                  const toggleAction = setInstrumentActive.bind(null, instrument.id, !instrument.active);

                  return (
                    <tr className="border-t border-[var(--border)]" key={instrument.id}>
                      <td className="px-4 py-3">
                        <div className="font-medium">{instrument.name}</div>
                        <div className="text-xs text-[var(--muted-foreground)]">
                          {instrument.abbreviation ?? "Sem abreviação"} · ordem {instrument.display_order}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>{instrument.family}</div>
                        {instrument.is_brazilian_instrument ? (
                          <div className="mt-1">
                            <Badge tone="info">Instrumento brasileiro</Badge>
                          </div>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={instrument.active ? "success" : "danger"}>
                          {instrument.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {canWrite ? (
                          <div className="flex flex-wrap gap-2">
                            <Button asChild size="sm" variant="secondary">
                              <Link href={`/admin/instrumentos/${instrument.id}/editar`}>
                                <Edit size={14} aria-hidden="true" />
                                Editar
                              </Link>
                            </Button>
                            <form action={toggleAction}>
                              <Button size="sm" type="submit" variant="ghost">
                                <Power size={14} aria-hidden="true" />
                                {instrument.active ? "Desativar" : "Ativar"}
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
