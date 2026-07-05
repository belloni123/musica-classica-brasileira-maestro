import { Card } from "@/components/ui/card";

export default function FavoritesPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-semibold">Favoritos</h1>
      <Card>
        <p className="text-sm text-[var(--muted-foreground)]">
          Estrutura preparada para favoritos próprios do usuário via RLS.
        </p>
      </Card>
    </div>
  );
}
