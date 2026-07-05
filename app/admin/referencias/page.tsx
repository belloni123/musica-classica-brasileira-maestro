import { AdminNav } from "@/components/layout/admin-nav";
import { Card } from "@/components/ui/card";

export default function AdminReferencesPage() {
  return (
    <>
      <AdminNav />
      <section className="flex-1">
        <h1 className="text-3xl font-semibold">Referências</h1>
        <Card className="mt-6">Referências bibliográficas serão editáveis em etapa posterior.</Card>
      </section>
    </>
  );
}
