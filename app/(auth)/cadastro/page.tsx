import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SignUpPage() {
  return (
    <div className="mx-auto grid w-full max-w-md gap-6">
      <div>
        <p className="mb-3 text-sm text-[var(--accent)]">Conta</p>
        <h1 className="text-4xl font-semibold leading-tight text-[var(--foreground-strong)]">
          Acesso por cadastro administrativo
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
          Neste MVP, novas contas são criadas pela administração da plataforma.
        </p>
      </div>
      <Card className="p-6">
        <p className="text-sm leading-6 text-[var(--muted-foreground)]">
          Se você já recebeu um e-mail e senha de acesso, use a página única de login. Se ainda não
          recebeu, solicite o cadastro ao responsável pela plataforma.
        </p>
        <Button asChild className="mt-4">
          <Link href="/entrar">Ir para login</Link>
        </Button>
      </Card>
    </div>
  );
}
