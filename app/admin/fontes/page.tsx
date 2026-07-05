import { AdminNav } from "@/components/layout/admin-nav";
import { Card } from "@/components/ui/card";

export default function AdminSourcesPage() {
  return (
    <>
      <AdminNav />
      <section className="flex-1">
        <h1 className="text-3xl font-semibold">Fontes</h1>
        <Card className="mt-6">Editoras, acervos e fontes serão tratados aqui.</Card>
      </section>
    </>
  );
}
