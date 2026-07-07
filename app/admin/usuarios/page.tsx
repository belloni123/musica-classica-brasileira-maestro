import { AdminNav } from "@/components/layout/admin-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createManagedUser } from "@/app/admin/usuarios/actions";
import { mvpAssignableRoles, roleLabels, type AppRole } from "@/lib/permissions/roles";
import { requireSuperAdminAccess } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  searchParams: Promise<{
    created?: string;
    error?: string;
  }>;
};

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: AppRole;
  status: string;
  created_at: string;
  last_login_at: string | null;
};

const errorMessages: Record<string, string> = {
  auth: "Não foi possível criar o usuário no Auth.",
  configuracao: "Configure SUPABASE_SERVICE_ROLE_KEY para criar usuários pelo painel.",
  duplicado: "Já existe uma conta com esse e-mail.",
  inesperado: "Não foi possível criar o usuário agora.",
  validacao:
    "Confira nome, e-mail, papel e senha. A senha precisa ter 10 caracteres, maiúscula, minúscula e número.",
};

async function fetchProfiles() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,full_name,role,status,created_at,last_login_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      throw error;
    }

    return {
      profiles: (data ?? []) as ProfileRow[],
      error: null,
    };
  } catch (error) {
    return {
      profiles: [] as ProfileRow[],
      error: error instanceof Error ? error.message : "Erro ao carregar usuários.",
    };
  }
}

function roleTone(role: AppRole): "neutral" | "success" | "warning" | "danger" | "info" {
  if (role === "admin") return "danger";
  if (role === "editor" || role === "reviewer") return "info";
  if (role.startsWith("subscriber") || role.startsWith("institution")) return "success";
  return "neutral";
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  await requireSuperAdminAccess();
  const params = await searchParams;
  const createdMessage = params.created === "1" ? "Usuário criado com sucesso." : null;
  const errorMessage = params.error ? errorMessages[params.error] : null;
  const { profiles, error } = await fetchProfiles();

  return (
    <>
      <AdminNav />
      <section className="grid flex-1 gap-6">
        <div>
          <h1 className="text-3xl font-semibold">Usuários</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Criação manual de assinantes e administradores para o MVP.
          </p>
        </div>

        <Card>
          <h2 className="text-xl font-semibold">Adicionar acesso</h2>
          <form action={createManagedUser} className="mt-5 grid gap-4 md:grid-cols-2">
            {createdMessage ? (
              <p className="rounded-md border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)] md:col-span-2">
                {createdMessage}
              </p>
            ) : null}
            {errorMessage ? (
              <p className="rounded-md border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm text-[var(--accent)] md:col-span-2">
                {errorMessage}
              </p>
            ) : null}
            <label className="grid gap-2 text-sm font-medium">
              Nome
              <Input autoComplete="name" name="full_name" required />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              E-mail
              <Input autoComplete="email" name="email" required type="email" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Papel
              <select
                className="h-10 rounded-md border border-[var(--border-strong)] bg-transparent px-3 text-sm outline-none focus-visible:shadow-[var(--focus-shadow)]"
                defaultValue="subscriber_individual"
                name="role"
                required
              >
                {mvpAssignableRoles.map((role) => (
                  <option key={role} value={role}>
                    {roleLabels[role]}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Senha temporária
              <Input
                autoComplete="new-password"
                minLength={10}
                name="password"
                required
                type="password"
              />
            </label>
            <div className="md:col-span-2">
              <Button type="submit">Criar usuário</Button>
            </div>
          </form>
        </Card>

        {error ? <Card className="text-sm text-[var(--accent)]">{error}</Card> : null}

        <div className="overflow-hidden rounded-md border border-[var(--border)] bg-white">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[var(--muted)] text-xs uppercase text-[var(--muted-foreground)]">
              <tr>
                <th className="px-4 py-3">Usuário</th>
                <th className="px-4 py-3">Papel</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Criado em</th>
              </tr>
            </thead>
            <tbody>
              {profiles.length > 0 ? (
                profiles.map((profile) => (
                  <tr className="border-t border-[var(--border)]" key={profile.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{profile.full_name ?? "Sem nome"}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">
                        {profile.email ?? "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={roleTone(profile.role)}>{roleLabels[profile.role]}</Badge>
                    </td>
                    <td className="px-4 py-3">{profile.status}</td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">
                      {new Intl.DateTimeFormat("pt-BR").format(new Date(profile.created_at))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-8 text-center text-[var(--muted-foreground)]" colSpan={4}>
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
