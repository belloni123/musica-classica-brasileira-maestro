import { AdminNav } from "@/components/layout/admin-nav";
import { Card } from "@/components/ui/card";

export default function AdminInstrumentsPage() {
  return (
    <>
      <AdminNav />
      <section className="flex-1">
        <h1 className="text-3xl font-semibold">Instrumentos</h1>
        <Card className="mt-6">Dicionário instrumental será editável em etapa posterior.</Card>
      </section>
    </>
  );
}
