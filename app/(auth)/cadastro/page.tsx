import { signUp } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
  return (
    <div className="mx-auto grid w-full max-w-md gap-6">
      <div>
        <h1 className="text-3xl font-semibold">Cadastro</h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Perfil criado automaticamente pelo trigger do Supabase.
        </p>
      </div>
      <Card>
        <form action={signUp} className="grid gap-4">
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
            <Input autoComplete="new-password" minLength={8} name="password" required type="password" />
          </label>
          <Button type="submit">Criar conta</Button>
        </form>
      </Card>
    </div>
  );
}
