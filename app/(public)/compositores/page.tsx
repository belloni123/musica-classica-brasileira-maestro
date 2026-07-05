import { Card } from "@/components/ui/card";

export default function ComposersPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-semibold">Compositores</h1>
      <Card>
        <p className="text-sm leading-6 text-[var(--muted-foreground)]">
          Listagem pública preparada para receber compositores publicados após a implementação do
          CRUD editorial.
        </p>
      </Card>
    </div>
  );
}
