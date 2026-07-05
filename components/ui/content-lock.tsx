import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ContentLock({
  title = "Dados completos para assinantes",
  description = "Instrumentação detalhada, fontes, referências, disponibilidade e notas de performance serão liberadas por plano.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Card className="grid gap-3 border-dashed">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--muted)] text-[var(--accent)]">
          <Lock size={18} aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>
        </div>
      </div>
      <div>
        <Button asChild size="sm" variant="secondary">
          <Link href="/planos">Ver planos futuros</Link>
        </Button>
      </div>
    </Card>
  );
}
