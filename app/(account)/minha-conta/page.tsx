import Link from "next/link";
import { signOut } from "@/lib/auth/actions";
import {
  getCurrentProfile,
  hasCompleteCatalogAccess,
  hasEditorialAccess,
  requireAuthenticatedUser,
} from "@/lib/auth/session";
import { roleLabels } from "@/lib/permissions/roles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function AccountPage() {
  const user = await requireAuthenticatedUser();
  const profile = await getCurrentProfile();
  const canAccessCatalog = hasCompleteCatalogAccess(profile);
  const canAccessAdmin = hasEditorialAccess(profile);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold">Minha conta</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Seu acesso ao catálogo e às áreas internas da plataforma.
        </p>
      </div>
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
            <dd>{profile?.role ? roleLabels[profile.role] : roleLabels.user}</dd>
          </div>
          <div>
            <dt className="text-[var(--muted-foreground)]">Status</dt>
            <dd>{profile?.status ?? "profile pendente"}</dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge tone={canAccessCatalog ? "success" : "warning"}>
            {canAccessCatalog ? "Catálogo completo liberado" : "Acesso básico"}
          </Badge>
          {canAccessAdmin ? <Badge tone="info">Painel editorial liberado</Badge> : null}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/obras">Ver obras</Link>
          </Button>
          {canAccessAdmin ? (
            <Button asChild variant="secondary">
              <Link href="/admin/dashboard">Abrir painel</Link>
            </Button>
          ) : null}
          <form action={signOut}>
            <Button type="submit" variant="secondary">
              Sair
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
