import Link from "next/link";
import { Archive, BookOpen, LibraryBig, LogIn, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="grid gap-16">
      <section className="grid gap-10 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-16">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm text-[var(--accent)]">Ferramenta de repertório brasileiro</p>
          <h1 className="text-4xl font-semibold leading-none text-[var(--foreground-strong)] sm:text-5xl lg:text-6xl">
            Música brasileira de concerto, pesquisável por método.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
            Um catálogo para encontrar compositores, obras, formações, duração, instrumentação,
            fontes e caminhos de programação em uma plataforma de acesso especializado.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild className="w-full sm:w-auto" size="lg">
              <Link href="/buscar">
                <Search className="shrink-0" size={18} aria-hidden="true" />
                Pesquisa simples
              </Link>
            </Button>
            <Button asChild className="w-full sm:w-auto" size="lg" variant="secondary">
              <Link href="/busca-avancada">
                <LogIn size={18} aria-hidden="true" />
                Pesquisa avançada
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
              Busca simples, busca avançada, índice de compositores, recursos técnicos e acesso por assinatura.
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold leading-tight text-[var(--foreground-strong)]">
            Conheça a plataforma
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
            O maestro apresenta a proposta, o valor musicológico da base e sua contribuição para a
            pesquisa, a programação e a difusão da música brasileira de concerto.
          </p>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-md border border-[var(--border-strong)] bg-[var(--foreground)]">
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            src="https://www.youtube.com/embed/jfVPaGI-V1w"
            title="Apresentação da Música Brasileira de Concerto"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[1fr_320px]">
        <Card>
          <h2 className="text-2xl font-normal">A plataforma oferece</h2>
          <ul className="mt-4 grid gap-3 text-sm leading-6 text-[var(--muted-foreground)]">
            <li>Busca rápida por compositor, título de obra ou palavra-chave.</li>
            <li>Pesquisa avançada por duração, formação, instrumentação, coro, solistas e recortes curatoriais.</li>
            <li>Índice alfabético de compositores publicados.</li>
            <li>Links entre obras, fontes, acervos, referências e materiais disponíveis.</li>
            <li>Acesso organizado para assinantes, instituições e equipe editorial.</li>
          </ul>
        </Card>
        <Card className="bg-[color-mix(in_srgb,var(--catalog-blue)_7%,var(--surface))]">
          <h2 className="text-2xl font-normal">Acesso à plataforma</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
            Contas são liberadas pela administração conforme o perfil de uso: pesquisa, curadoria,
            edição ou acesso institucional.
          </p>
          <Button asChild className="mt-5" size="sm" variant="secondary">
            <Link href="/planos">Ver acesso</Link>
          </Button>
        </Card>
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
