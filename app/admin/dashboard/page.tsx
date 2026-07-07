import { AdminNav } from "@/components/layout/admin-nav";
import { Card } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <>
      <AdminNav />
      <section className="grid flex-1 gap-6">
        <div>
          <h1 className="text-3xl font-semibold">Painel editorial</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Use este painel para organizar o catálogo, revisar informações e
            gerenciar acessos.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <h2 className="font-semibold">Catálogo</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Compositores, obras, instrumentos e fontes.
            </p>
          </Card>
          <Card>
            <h2 className="font-semibold">Revisão</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Status editorial, confiabilidade e histórico de alterações.
            </p>
          </Card>
          <Card>
            <h2 className="font-semibold">Operação</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Auditoria, importações futuras e segurança.
            </p>
          </Card>
        </div>
      </section>
    </>
  );
}
