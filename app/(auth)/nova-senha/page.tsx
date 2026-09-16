import { requireAuthenticatedUser } from "@/lib/auth/session";
import { updatePassword } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function NewPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireAuthenticatedUser();
  const { error } = await searchParams;
  return <Card className="mx-auto w-full max-w-md">
    <h1 className="text-3xl font-semibold">Definir nova senha</h1>
    <p className="my-4 text-sm">Use pelo menos 10 caracteres, incluindo maiúscula, minúscula e número.</p>
    {error && <p role="alert" className="mb-4">{error === "limite" ? "Aguarde antes de tentar novamente." : "Não foi possível atualizar. Confira as senhas; se o link expirou, solicite outro."}</p>}
    <form action={updatePassword} className="grid gap-4">
      <label>Nova senha<Input name="password" type="password" autoComplete="new-password" minLength={10} maxLength={128} required /></label>
      <label>Confirme a senha<Input name="confirmation" type="password" autoComplete="new-password" minLength={10} maxLength={128} required /></label>
      <Button type="submit">Salvar nova senha</Button>
    </form>
  </Card>;
}
