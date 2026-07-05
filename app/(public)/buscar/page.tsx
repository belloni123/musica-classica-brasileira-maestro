import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function SearchPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold">Buscar</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Tela reservada para busca simples. A busca avançada não faz parte desta etapa.
        </p>
      </div>
      <Card className="max-w-2xl">
        <label className="text-sm font-medium" htmlFor="query">
          Termo de busca
        </label>
        <Input disabled id="query" placeholder="Busca será conectada em etapa posterior" />
      </Card>
    </div>
  );
}
