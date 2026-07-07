import { AdminNav } from "@/components/layout/admin-nav";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { createClient } from "@/lib/supabase/server";

type RevisionRow = {
  id: string;
  entity_type: string;
  entity_id: string;
  field_name: string;
  changed_at: string;
};

async function fetchRevisions() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("revision_history")
      .select("id,entity_type,entity_id,field_name,changed_at")
      .order("changed_at", { ascending: false })
      .limit(50);

    if (error) {
      return { revisions: [] as RevisionRow[], error: error.message };
    }

    return { revisions: (data ?? []) as RevisionRow[], error: null };
  } catch (error) {
    return {
      revisions: [] as RevisionRow[],
      error: error instanceof Error ? error.message : "Não foi possível carregar as revisões.",
    };
  }
}

export default async function AdminReviewsPage() {
  const { revisions, error } = await fetchRevisions();

  return (
    <>
      <AdminNav />
      <section className="grid flex-1 gap-6">
        <AdminPageHeader
          title="Revisões"
          description="Últimas alterações registradas no histórico editorial."
        />
        {error ? <Card className="text-sm text-[var(--muted-foreground)]">{error}</Card> : null}
        {revisions.length === 0 ? (
          <EmptyState title="Nenhuma revisão registrada" />
        ) : (
          <div className="grid gap-3">
            {revisions.map((revision) => (
              <Card key={revision.id}>
                <h2 className="font-semibold">
                  {revision.entity_type} · {revision.field_name}
                </h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Registro {revision.entity_id} · {new Date(revision.changed_at).toLocaleString("pt-BR")}
                </p>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
