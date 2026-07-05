import { signIn } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  return (
    <div className="mx-auto grid w-full max-w-md gap-6">
      <div>
        <h1 className="text-3xl font-semibold">Entrar</h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Autenticação inicial via Supabase Auth.
        </p>
      </div>
      <Card>
        <form action={signIn} className="grid gap-4">
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
