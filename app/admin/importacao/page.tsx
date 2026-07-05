import { AdminNav } from "@/components/layout/admin-nav";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { createClient } from "@/lib/supabase/server";

type ImportBatchRow = {
  id: string;
  file_name: string;
  file_type: string;
  entity_type: string;
  status: string;
  total_rows: number;
  valid_rows: number;
  error_rows: number;
  created_at: string;
};

async function fetchImportBatches() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("import_batches")
    .select("id,file_name,file_type,entity_type,status,total_rows,valid_rows,error_rows,created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return { batches: [] as ImportBatchRow[], error: error.message };
  }

  return { batches: (data ?? []) as ImportBatchRow[], error: null };
}

export default async function AdminImportPage() {
  const { batches, error } = await fetchImportBatches();

  return (
    <>
      <AdminNav />
      <section className="grid flex-1 gap-6">
        <AdminPageHeader
          title="Importação"
          description="Controle preparado para lotes futuros. Upload, validação de CSV/XLSX e ingestão real ainda não estão ativos."
        />
        {error ? <Card className="text-sm text-[var(--muted-foreground)]">{error}</Card> : null}
        {batches.length === 0 ? (
          <EmptyState
            title="Nenhum lote registrado"
            description="As tabelas import_batches e import_rows já existem com RLS editorial."
          />
        ) : (
          <div className="grid gap-3">
            {batches.map((batch) => (
              <Card className="grid gap-3" key={batch.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">{batch.file_name}</h2>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {batch.entity_type} · {batch.file_type}
                    </p>
                  </div>
                  <Badge>{batch.status}</Badge>
                </div>
                <dl className="grid gap-3 text-sm md:grid-cols-3">
                  <div>
                    <dt className="text-[var(--muted-foreground)]">Linhas</dt>
                    <dd>{batch.total_rows}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--muted-foreground)]">Válidas</dt>
                    <dd>{batch.valid_rows}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--muted-foreground)]">Com erro</dt>
                    <dd>{batch.error_rows}</dd>
                  </div>
                </dl>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
