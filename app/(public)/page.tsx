import Link from "next/link";
import { Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="grid gap-10">
      <section className="grid gap-6 py-8">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.12em] text-[var(--accent)]">
            Base musicológica brasileira
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Catálogo estruturado para pesquisar, revisar e difundir a música brasileira de
            concerto.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
            Primeira etapa técnica: banco relacional, autenticação, segurança por RLS e painel
            editorial inicial. A busca avançada e o paywall entram depois da fundação.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/buscar">
              <Search size={18} aria-hidden="true" />
              Buscar catálogo
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/admin/dashboard">
              <ShieldCheck size={18} aria-hidden="true" />
              Painel editorial
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <h2 className="font-semibold">Fonte oficial</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
            O Supabase/Postgres é a origem dos dados. Índices de busca serão derivados e
            reconstruíveis.
          </p>
        </Card>
        <Card>
          <h2 className="font-semibold">Editorial primeiro</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
            A primeira entrega prioriza compositores, obras, instrumentos, fontes, revisão e
            publicação.
          </p>
        </Card>
        <Card>
          <h2 className="font-semibold">Segurança desde o início</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
            RLS, papéis, auditoria e histórico editorial entram antes de assinatura e API pública.
          </p>
        </Card>
      </section>
    </div>
  );
}
