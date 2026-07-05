import { signIn } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type SignInPageProps = {
  searchParams: Promise<{
    error?: string;
    reset?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  credenciais: "Nao foi possivel entrar com esses dados.",
  limite: "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.",
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const errorMessage = params.error ? errorMessages[params.error] : null;
  const resetMessage = params.reset === "enviado" ? "Se o e-mail existir, enviaremos um link de recuperacao." : null;

  return (
    <div className="mx-auto grid w-full max-w-md gap-6">
      <div>
        <p className="mb-3 text-sm text-[var(--accent)]">Conta</p>
        <h1 className="text-4xl font-semibold leading-tight text-[var(--foreground-strong)]">Entrar</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
          Acesse sua área de pesquisa, listas e painel editorial.
        </p>
      </div>
      <Card className="p-6">
        <form action={signIn} className="grid gap-4">
          {errorMessage ? (
            <p className="rounded-md border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)]">
              {errorMessage}
            </p>
          ) : null}
          {resetMessage ? (
            <p className="rounded-md border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)]">
              {resetMessage}
            </p>
          ) : null}
          <input
            autoComplete="off"
            className="hidden"
            name="company"
            tabIndex={-1}
            type="text"
          />
          <label className="grid gap-2 text-sm font-medium">
            E-mail
            <Input autoComplete="email" name="email" required type="email" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Senha
            <Input autoComplete="current-password" name="password" required type="password" />
          </label>
          <Button type="submit">Entrar</Button>
        </form>
      </Card>
    </div>
  );
}
