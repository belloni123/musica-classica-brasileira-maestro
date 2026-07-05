import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

type FavoriteRow = {
  id: string;
  created_at: string;
  works:
    | {
        display_title: string;
        slug: string;
        composers: { display_name: string } | Array<{ display_name: string }> | null;
      }
    | Array<{
        display_title: string;
        slug: string;
        composers: { display_name: string } | Array<{ display_name: string }> | null;
      }>
    | null;
};

function firstWork(value: FavoriteRow["works"]) {
  return Array.isArray(value) ? value[0] : value;
}

function composerName(value: { display_name: string } | Array<{ display_name: string }> | null) {
  if (Array.isArray(value)) return value[0]?.display_name ?? "-";
  return value?.display_name ?? "-";
}

async function fetchFavorites(userId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("favorites")
      .select("id,created_at,works(display_title,slug,composers(display_name))")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return { favorites: [] as FavoriteRow[], error: error.message };
    }

    return { favorites: (data ?? []) as unknown as FavoriteRow[], error: null };
  } catch (error) {
    return {
      favorites: [] as FavoriteRow[],
      error: error instanceof Error ? error.message : "Base ainda nao conectada.",
    };
  }
}

export default async function FavoritesPage() {
  const user = await requireAuthenticatedUser();
  const { favorites, error } = await fetchFavorites(user.id);

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-semibold">Favoritos</h1>
      {error ? <Card className="text-sm text-[var(--muted-foreground)]">{error}</Card> : null}
      {favorites.length === 0 ? (
        <EmptyState title="Nenhum favorito ainda" description="A tabela e a RLS já estão prontas para favoritos próprios do usuário." />
      ) : (
        <div className="grid gap-3">
          {favorites.map((favorite) => {
            const work = firstWork(favorite.works);

            if (!work) return null;

            return (
              <Link href={`/obras/${work.slug}`} key={favorite.id}>
                <Card className="transition-colors hover:border-[var(--primary)]">
                  <h2 className="font-semibold">{work.display_title}</h2>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {composerName(work.composers)}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
