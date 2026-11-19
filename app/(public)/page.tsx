import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const archiveSource =
  "https://commons.wikimedia.org/wiki/File:Orquestra_sinf%C3%B4nica_no_Campo_de_S%C3%A3o_Crist%C3%B3v%C3%A3o.jpg";

const catalogLinks = [
  { href: "/obras", title: "Obras", description: "Títulos, formações e duração" },
  { href: "/compositores", title: "Compositores", description: "Biografias e repertório" },
  { href: "/maestros", title: "Maestros", description: "Perfis de regentes" },
];

export default function HomePage() {
  return (
    <div className="grid gap-9 pb-2 sm:gap-12">
      <section className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-12 xl:gap-16">
        <div className="lg:pb-8">
          <h1 className="max-w-[11ch] text-[clamp(2.6rem,5vw,4.6rem)] leading-[1.02] font-normal tracking-[-0.04em]">
            A música brasileira <span className="whitespace-nowrap">de concerto</span>
          </h1>
          <p className="mt-5 max-w-[37ch] text-[1.0625rem] leading-relaxed text-[var(--muted-foreground)] sm:mt-6 sm:text-lg">
            Explore o repertório orquestral brasileiro. Consulte formações, instrumentação e fontes
            para planejar seu próximo concerto.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 sm:mt-8">
            <Button asChild className="rounded-sm" size="lg">
              <Link href="/buscar">
                <Search size={16} aria-hidden="true" />
                Pesquisar repertório
              </Link>
            </Button>
            <Link
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium underline decoration-[var(--border-strong)] underline-offset-4 hover:decoration-current"
              href="/busca-avancada"
            >
              Pesquisa avançada
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <figure className="min-w-0">
          <picture>
            <source
              sizes="(min-width: 1280px) 704px, (min-width: 1024px) 58vw, (min-width: 768px) calc(100vw - 64px), calc(100vw - 40px)"
              srcSet="/catalogo/orquestra-sinfonica-brasileira-1952-800.webp 800w, /catalogo/orquestra-sinfonica-brasileira-1952.webp 1600w"
              type="image/webp"
            />
            <Image
              alt="Maestro e músicos da Orquestra Sinfônica Brasileira durante um concerto ao ar livre, diante de uma multidão."
              className="h-auto w-full bg-[var(--ivory)]"
              fetchPriority="high"
              height={1156}
              loading="eager"
              src="/catalogo/orquestra-sinfonica-brasileira-1952.webp"
              unoptimized
              width={1600}
            />
          </picture>
          <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[var(--border)] py-2.5 text-xs leading-relaxed text-[var(--muted-foreground)] sm:text-sm">
            <span>Orquestra Sinfônica Brasileira · Rio de Janeiro, 1952</span>
            <a className="!underline underline-offset-4" href={archiveSource}>Arquivo Nacional</a>
          </figcaption>
        </figure>
      </section>

      <nav aria-label="Explorar o catálogo" className="grid border-y border-[var(--border-strong)] sm:grid-cols-3">
        {catalogLinks.map(({ href, title, description }) => (
          <Link
            className="group flex min-w-0 items-center justify-between gap-3 border-b border-[var(--border)] px-3 py-4 transition-colors last:border-b-0 hover:bg-[var(--muted)] sm:border-r sm:border-b-0 sm:px-5 sm:py-5 sm:last:border-r-0"
            href={href}
            key={href}
          >
            <span className="grid gap-1">
              <span className="font-serif text-[1.65rem] leading-tight">{title}</span>
              <span className="text-sm text-[var(--muted-foreground)]">{description}</span>
            </span>
            <ArrowRight aria-hidden="true" className="shrink-0 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" size={19} />
          </Link>
        ))}
      </nav>
    </div>
  );
}
