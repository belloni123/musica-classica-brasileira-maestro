import { Card } from "@/components/ui/card";

export default function WorksPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-semibold">Obras</h1>
      <Card>
        <p className="text-sm leading-6 text-[var(--muted-foreground)]">
          Listagem pública preparada para obras publicadas. Instrumentação detalhada será tratada
          com permissão própria.
        </p>
      </Card>
    </div>
  );
}
