import { Card } from "@/components/ui/card";

export default function MethodologyPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-semibold">Metodologia</h1>
      <Card>
        <p className="text-sm leading-6 text-[var(--muted-foreground)]">
          Espaço para documentar critérios curatoriais, níveis de confiabilidade, fontes,
          instrumentação e histórico editorial.
        </p>
      </Card>
    </div>
  );
}
