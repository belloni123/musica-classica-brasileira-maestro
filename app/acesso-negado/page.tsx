import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AccessDeniedPage() {
  return (
    <div className="mx-auto grid w-full max-w-xl gap-6">
      <Card className="grid gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--muted)] text-[var(--accent)]">
            <ShieldAlert size={20} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold">Acesso negado</h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Sua conta nao tem permissao administrativa para acessar esta area.
            </p>
          </div>
        </div>
        <Button asChild variant="secondary">
          <Link href="/">Voltar ao inicio</Link>
        </Button>
      </Card>
    </div>
  );
}
