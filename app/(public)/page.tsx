import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="grid flex-1 items-center bg-[var(--navy)] text-[var(--ivory)] lg:grid-cols-[1fr_0.8fr]">
      <div className="px-6 pt-10 pb-5 sm:px-10 sm:pt-14 lg:px-14 lg:py-16 xl:px-20">
        <h1 className="text-[clamp(2.25rem,4.7vw,4.4rem)] leading-[1.07] font-normal text-balance">
          O repertório brasileiro para orquestra
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--ivory)] sm:text-lg">
          Um guia para pesquisar compositores, obras, formações, duração, instrumentação e fontes para sua programação.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="border-[var(--gold)] bg-[var(--gold)] !text-[var(--navy)] [&_*]:!text-[var(--navy)] [&_svg]:!stroke-[var(--navy)]" size="lg">
            <Link href="/buscar">
              <Search size={17} aria-hidden="true" />
              Pesquisa simples
            </Link>
          </Button>
          <Button asChild className="border-white/40 text-[var(--ivory)] hover:bg-white/10" size="lg" variant="secondary">
            <Link href="/busca-avancada">
              Pesquisa avançada
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-center px-6 pt-2 pb-7 sm:pb-10 lg:p-10">
        <Image
          alt="Brasil Orquestral"
          className="h-auto w-[min(55vw,190px)] lg:w-full lg:max-w-[390px]"
          height={440}
          src="/marca/assinatura-escuro.svg"
          width={393}
          priority
          unoptimized
        />
      </div>
    </section>
  );
}
