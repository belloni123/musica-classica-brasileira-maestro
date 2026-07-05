import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { createClient } from "@/lib/supabase/server";

type RepertoireListRow = {
  id: string;
  name: string;
  description: string | null;
  private: boolean;
  created_at: string;
};

async function fetchLists() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("repertoire_lists")
      .select("id,name,description,private,created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return { lists: [] as RepertoireListRow[], error: error.message };
    }

    return { lists: (data ?? []) as RepertoireListRow[], error: null };
  } catch (error) {
    return {
      lists: [] as RepertoireListRow[],
      error: error instanceof Error ? error.message : "Base ainda nao conectada.",
    };
  }
}

export default async function ListsPage() {
  const { lists, error } = await fetchLists();

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-semibold">Listas</h1>
      {error ? <Card className="text-sm text-[var(--muted-foreground)]">{error}</Card> : null}
      {lists.length === 0 ? (
        <EmptyState title="Nenhuma lista criada" description="A estrutura de listas privadas está pronta; a criação entra em etapa futura." />
      ) : (
        <div className="grid gap-3">
          {lists.map((list) => (
            <Link href="/listas" key={list.id}>
              <Card className="transition-colors hover:border-[var(--primary)]">
                <h2 className="font-semibold">{list.name}</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {list.description ?? "Sem descrição."}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
