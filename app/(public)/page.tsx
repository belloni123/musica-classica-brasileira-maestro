import Link from "next/link";
import { BookOpen, Database, Search, ShieldCheck } from "lucide-react";
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
            Base de dados para pesquisa, programação, estudo e difusão da música brasileira de
            concerto.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
            Uma plataforma SaaS acadêmico-cultural para organizar compositores, obras,
            instrumentação, fontes, acervos, referências e critérios de confiabilidade.
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
          <Database className="mb-3 text-[var(--primary)]" size={22} aria-hidden="true" />
          <h2 className="font-semibold">Base relacional</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
            Supabase/Postgres é a fonte oficial dos dados; índices de busca serão derivados.
          </p>
        </Card>
        <Card>
          <BookOpen className="mb-3 text-[var(--primary)]" size={22} aria-hidden="true" />
          <h2 className="font-semibold">Metodologia editorial</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
            Dados com status editorial, confiabilidade, revisão, fontes e histórico de mudanças.
          </p>
        </Card>
        <Card>
          <ShieldCheck className="mb-3 text-[var(--primary)]" size={22} aria-hidden="true" />
          <h2 className="font-semibold">Segurança desde o início</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
            RLS, papéis, auditoria e histórico editorial entram antes de assinatura e API pública.
          </p>
        </Card>
      </section>
    </div>
  );
}
