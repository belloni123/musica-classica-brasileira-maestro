import { AdminNav } from "@/components/layout/admin-nav";
import { Card } from "@/components/ui/card";

export default function AdminReviewsPage() {
  return (
    <>
      <AdminNav />
      <section className="flex-1">
        <h1 className="text-3xl font-semibold">Revisões</h1>
        <Card className="mt-6">Histórico editorial e filas de revisão serão conectados depois.</Card>
      </section>
    </>
  );
}
