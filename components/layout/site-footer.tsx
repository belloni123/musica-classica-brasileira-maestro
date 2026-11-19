import Link from "next/link";
import Image from "next/image";

const quickLinks = [
  { href: "/planos", label: "Assinatura" },
  { href: "/recursos/ferramenta", label: "Sobre a ferramenta" },
  { href: "/recursos/editoras", label: "Editoras e acervos" },
  { href: "/recursos/abreviaturas", label: "Abreviaturas" },
  { href: "/integracoes", label: "API e MCP" },
];

export function SiteFooter() {
  return (
    <footer className="bg-[var(--navy)] text-[var(--ivory)]">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-7 text-sm md:grid-cols-3 md:px-8">
        <section>
          <h2 className="font-sans text-xs font-semibold tracking-widest uppercase">Links rápidos</h2>
          <div className="mt-2 grid gap-1">
            {quickLinks.map((link) => (
              <Link className="w-fit hover:underline" href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </section>
        <section className="border-y border-white/20 py-4 md:border-x md:border-y-0 md:px-6 md:py-0">
          <h2 className="font-sans text-xs font-semibold tracking-widest uppercase">Nota</h2>
          <p className="mt-2 leading-6">
            Brasil Orquestral é uma base de pesquisa e catalogação. A plataforma não
            substitui editoras, acervos ou detentores de direitos.
          </p>
        </section>
        <section>
          <Link className="inline-flex h-16 w-44 items-center" href="/">
            <Image alt="Brasil Orquestral" src="/marca/horizontal-escuro.svg" width={176} height={114} unoptimized />
          </Link>
          <p className="mt-2 leading-6">
            Catálogo brasileiro dedicado a repertório, instrumentação, fontes, referências e acesso
            por assinatura.
          </p>
        </section>
      </div>
    </footer>
  );
}
