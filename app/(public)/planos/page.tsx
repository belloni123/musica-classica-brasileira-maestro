import { Card } from "@/components/ui/card";

export default function PlansPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-semibold">Planos</h1>
      <Card>
        <p className="text-sm leading-6 text-[var(--muted-foreground)]">
          Assinatura, checkout e paywall estão fora da primeira etapa. Esta página é apenas uma
          reserva de rota.
        </p>
      </Card>
    </div>
  );
}
