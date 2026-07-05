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
    <Card className="grid gap-4 border-dashed bg-[color-mix(in_srgb,var(--accent)_5%,var(--surface))]">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--background)] text-[var(--accent)] shadow-[var(--button-inset)]">
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
