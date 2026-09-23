import Link from "next/link";
import { LogIn, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div>
      <section className="py-8 lg:py-16">
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

      </section>
    </div>
  );
}
