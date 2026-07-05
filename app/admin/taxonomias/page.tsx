import { AdminNav } from "@/components/layout/admin-nav";
import { Card } from "@/components/ui/card";

export default function AdminTaxonomiesPage() {
  return (
    <>
      <AdminNav />
      <section className="flex-1">
        <h1 className="text-3xl font-semibold">Taxonomias</h1>
        <Card className="mt-6">Tags curatoriais e classificações serão geridas aqui.</Card>
      </section>
    </>
  );
}
