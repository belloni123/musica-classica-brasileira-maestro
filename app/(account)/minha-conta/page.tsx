import { signOut } from "@/lib/auth/actions";
import { publicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function AccountPage() {
  let userEmail: string | null = null;

  if (publicEnv.NEXT_PUBLIC_SUPABASE_URL && publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    userEmail = user?.email ?? null;
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-semibold">Minha conta</h1>
      <Card>
        <p className="text-sm text-[var(--muted-foreground)]">
          {userEmail ?? "Nenhum usuário autenticado nesta sessão."}
        </p>
        {userEmail ? (
          <form action={signOut} className="mt-4">
            <Button type="submit" variant="secondary">
              Sair
            </Button>
          </form>
        ) : null}
      </Card>
    </div>
  );
}
