import { Card } from "@/components/ui/card";

export default function ListsPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-semibold">Listas</h1>
      <Card>
        <p className="text-sm text-[var(--muted-foreground)]">
          Estrutura preparada para listas privadas de repertório.
        </p>
      </Card>
    </div>
  );
}
