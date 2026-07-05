import { signOut } from "@/lib/auth/actions";
import { getCurrentProfile, requireAuthenticatedUser } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function AccountPage() {
  const user = await requireAuthenticatedUser();
  const profile = await getCurrentProfile();

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-semibold">Minha conta</h1>
      <Card>
        <dl className="grid gap-3 text-sm md:grid-cols-2">
          <div>
            <dt className="text-[var(--muted-foreground)]">Email</dt>
            <dd>{user.email ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-[var(--muted-foreground)]">Nome</dt>
            <dd>{profile?.full_name ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-[var(--muted-foreground)]">Papel</dt>
            <dd>{profile?.role ?? "user"}</dd>
          </div>
          <div>
            <dt className="text-[var(--muted-foreground)]">Status</dt>
            <dd>{profile?.status ?? "profile pendente"}</dd>
          </div>
        </dl>
        <form action={signOut} className="mt-4">
          <Button type="submit" variant="secondary">
            Sair
          </Button>
        </form>
      </Card>
    </div>
  );
}
