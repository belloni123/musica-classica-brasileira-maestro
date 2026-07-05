import { AdminNav } from "@/components/layout/admin-nav";
import { Card } from "@/components/ui/card";

export default function AdminComposersPage() {
  return (
    <>
      <AdminNav />
      <section className="flex-1">
        <h1 className="text-3xl font-semibold">Compositores</h1>
        <Card className="mt-6">CRUD será implementado na próxima etapa.</Card>
      </section>
    </>
  );
}
