import Link from "next/link";
import { Archive, BookOpen, LibraryBig, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="grid gap-16">
      <section className="grid gap-10 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-16">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm text-[var(--accent)]">Base musicológica brasileira</p>
          <h1 className="text-4xl font-semibold leading-none text-[var(--foreground-strong)] sm:text-5xl lg:text-6xl">
            Música brasileira de concerto, catalogada com método.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
            Um catálogo editorial para aproximar compositores, obras, instrumentação, fontes e
            critérios de confiabilidade em uma base relacional preparada para pesquisa.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              className="w-full border-[var(--moss)] bg-[var(--moss)] text-[#fcfbf8] sm:w-auto [&_svg]:stroke-[#fcfbf8]"
              size="lg"
            >
              <Link href="/buscar">
                <Search size={18} aria-hidden="true" />
                Buscar catálogo
              </Link>
            </Button>
            <Button asChild className="w-full sm:w-auto" size="lg" variant="secondary">
              <Link href="/admin/dashboard">
                <ShieldCheck size={18} aria-hidden="true" />
                Painel editorial
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="catalogue-rule absolute inset-x-0 top-0 h-16 opacity-40" aria-hidden="true" />
          <div className="relative grid gap-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Registro editorial</p>
                <h2 className="mt-1 text-2xl font-semibold">Obra sinfônica</h2>
              </div>
              <span className="rounded-full border border-[var(--border)] px-3 py-1 text-sm text-[var(--moss)]">
                publicado
              </span>
            </div>
            {[
              ["Compositor", "Heitor Villa-Lobos"],
              ["Formação", "Orquestra"],
              ["Duração", "18 min"],
              ["Fonte", "Catálogo / acervo"],
            ].map(([label, value]) => (
              <div className="grid gap-1 text-sm sm:grid-cols-[120px_1fr] sm:gap-4" key={label}>
                <span className="text-[var(--muted-foreground)]">{label}</span>
                <span>{value}</span>
              </div>
            ))}
            <div className="mt-2 rounded-xl border border-dashed border-[var(--border-strong)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
              Instrumentação completa, fontes e histórico editorial entram como camadas verificáveis.
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="grid gap-3">
          <LibraryBig className="text-[var(--primary)]" size={22} aria-hidden="true" />
          <h2 className="text-xl font-normal">Catálogo relacional</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
            Compositores, obras, instrumentação e fontes organizados como dados verificáveis.
          </p>
        </Card>
        <Card className="grid gap-3">
          <BookOpen className="text-[var(--primary)]" size={22} aria-hidden="true" />
          <h2 className="text-xl font-normal">Critério musicológico</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
            Status editorial, confiabilidade, revisão e histórico preservam o contexto de cada dado.
          </p>
        </Card>
        <Card className="grid gap-3">
          <Archive className="text-[var(--primary)]" size={22} aria-hidden="true" />
          <h2 className="text-xl font-normal">Fontes e acervos</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
            A estrutura permite registrar detentores, referências, materiais e disponibilidade.
          </p>
        </Card>
      </section>
    </div>
  );
}
