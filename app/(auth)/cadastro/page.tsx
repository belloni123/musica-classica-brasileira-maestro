import { signUp } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type SignUpPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  cadastro: "Nao foi possivel criar a conta agora.",
  limite: "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.",
  validacao: "Use um nome valido e uma senha com ao menos 10 caracteres, letras maiusculas, minusculas e numeros.",
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const errorMessage = params.error ? errorMessages[params.error] : null;

  return (
    <div className="mx-auto grid w-full max-w-md gap-6">
      <div>
        <p className="mb-3 text-sm text-[var(--accent)]">Conta</p>
        <h1 className="text-4xl font-semibold leading-tight text-[var(--foreground-strong)]">Cadastro</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
          Crie seu acesso para acompanhar repertórios e recursos editoriais.
        </p>
      </div>
      <Card className="p-6">
        <form action={signUp} className="grid gap-4">
          {errorMessage ? (
            <p className="rounded-md border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)]">
              {errorMessage}
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
            Nome
            <Input autoComplete="name" name="full_name" required />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            E-mail
            <Input autoComplete="email" name="email" required type="email" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Senha
            <Input autoComplete="new-password" minLength={10} name="password" required type="password" />
          </label>
          <Button type="submit">Criar conta</Button>
        </form>
      </Card>
    </div>
  );
}
