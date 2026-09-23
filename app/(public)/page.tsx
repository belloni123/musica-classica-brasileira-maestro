import Link from "next/link";
import { LogIn, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="lg:flex lg:flex-1">
      <section className="w-full py-8 lg:flex lg:items-center lg:justify-center lg:py-20">
        <div className="mx-auto max-w-5xl lg:text-center">
          <p className="mb-4 text-sm text-[var(--accent)] lg:text-base">Ferramenta de repertório brasileiro</p>
          <h1 className="text-4xl font-semibold leading-none text-[var(--foreground-strong)] sm:text-5xl lg:text-7xl lg:leading-[1.04] xl:text-[5rem]">
            Música brasileira de concerto, pesquisável por método.
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-[var(--muted-foreground)] sm:text-xl lg:mx-auto lg:mt-8 lg:text-2xl lg:leading-9">
            Um catálogo para encontrar compositores, obras, formações, duração, instrumentação,
            fontes e caminhos de programação em uma plataforma de acesso especializado.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-10 lg:justify-center lg:gap-4">
            <Button asChild className="w-full sm:w-auto lg:h-14 lg:px-8 lg:text-lg" size="lg">
              <Link href="/buscar">
                <Search className="shrink-0" size={20} aria-hidden="true" />
                Pesquisa simples
              </Link>
            </Button>
            <Button asChild className="w-full sm:w-auto lg:h-14 lg:px-8 lg:text-lg" size="lg" variant="secondary">
              <Link href="/busca-avancada">
                <LogIn size={20} aria-hidden="true" />
                Pesquisa avançada
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
