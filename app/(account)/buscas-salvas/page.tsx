import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { createClient } from "@/lib/supabase/server";

type SavedSearchRow = {
  id: string;
  name: string;
  parameters_json: Record<string, unknown>;
  created_at: string;
};

async function fetchSavedSearches() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("saved_searches")
      .select("id,name,parameters_json,created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return { searches: [] as SavedSearchRow[], error: error.message };
    }

    return { searches: (data ?? []) as SavedSearchRow[], error: null };
  } catch (error) {
    return {
      searches: [] as SavedSearchRow[],
      error: error instanceof Error ? error.message : "Base ainda nao conectada.",
    };
  }
}

export default async function SavedSearchesPage() {
  const { searches, error } = await fetchSavedSearches();

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-semibold">Buscas salvas</h1>
      {error ? <Card className="text-sm text-[var(--muted-foreground)]">{error}</Card> : null}
      {searches.length === 0 ? (
        <EmptyState title="Nenhuma busca salva" description="A tabela e a RLS estão prontas para buscas salvas próprias do usuário." />
      ) : (
        <div className="grid gap-3">
          {searches.map((search) => (
            <Card key={search.id}>
              <h2 className="font-semibold">{search.name}</h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {JSON.stringify(search.parameters_json)}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
