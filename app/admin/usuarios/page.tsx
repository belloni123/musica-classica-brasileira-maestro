import { AdminNav } from "@/components/layout/admin-nav";
import { Card } from "@/components/ui/card";

export default function AdminUsersPage() {
  return (
    <>
      <AdminNav />
      <section className="flex-1">
        <h1 className="text-3xl font-semibold">Usuários</h1>
        <Card className="mt-6">Usuários e permissões serão gerenciados em etapa posterior.</Card>
      </section>
    </>
  );
}
