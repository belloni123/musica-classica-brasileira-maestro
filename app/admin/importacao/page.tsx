import { AdminNav } from "@/components/layout/admin-nav";
import { Card } from "@/components/ui/card";

export default function AdminImportPage() {
  return (
    <>
      <AdminNav />
      <section className="flex-1">
        <h1 className="text-3xl font-semibold">Importação</h1>
        <Card className="mt-6">CSV/XLSX fica fora desta etapa, mas as tabelas de controle existem.</Card>
      </section>
    </>
  );
}
