import { resetPassword } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto grid w-full max-w-md gap-6">
      <div>
        <h1 className="text-3xl font-semibold">Recuperar senha</h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Envia um link de recuperação pelo Supabase Auth.
        </p>
      </div>
      <Card>
        <form action={resetPassword} className="grid gap-4">
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
          <Button type="submit">Enviar link</Button>
        </form>
      </Card>
    </div>
  );
}
