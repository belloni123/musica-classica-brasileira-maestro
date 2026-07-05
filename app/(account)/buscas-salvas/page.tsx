import { Card } from "@/components/ui/card";

export default function SavedSearchesPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-semibold">Buscas salvas</h1>
      <Card>
        <p className="text-sm text-[var(--muted-foreground)]">
          Estrutura preparada para buscas salvas do usuário autenticado.
        </p>
      </Card>
    </div>
  );
}
