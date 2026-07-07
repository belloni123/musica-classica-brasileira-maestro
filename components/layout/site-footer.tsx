import Link from "next/link";

const quickLinks = [
  { href: "/planos", label: "Assinatura" },
  { href: "/recursos/ferramenta", label: "Sobre a ferramenta" },
  { href: "/recursos/editoras", label: "Editoras e acervos" },
  { href: "/recursos/abreviaturas", label: "Abreviaturas" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border-strong)] bg-[var(--footer-bg)]">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-7 text-sm md:grid-cols-3 md:px-8">
        <section>
          <h2 className="font-semibold uppercase">Links rápidos</h2>
          <div className="mt-2 grid gap-1">
            {quickLinks.map((link) => (
              <Link className="text-[var(--catalog-blue)] hover:underline" href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </section>
        <section className="border-y border-[color-mix(in_srgb,var(--foreground)_22%,transparent)] py-4 md:border-x md:border-y-0 md:px-6 md:py-0">
          <h2 className="font-semibold uppercase">Nota</h2>
          <p className="mt-2 leading-6">
            Música Brasileira de Concerto é uma base de pesquisa e catalogação. A plataforma não
            substitui editoras, acervos ou detentores de direitos.
          </p>
        </section>
        <section>
          <h2 className="font-semibold uppercase">Projeto</h2>
          <p className="mt-2 leading-6">
            Catálogo brasileiro dedicado a repertório, instrumentação, fontes, referências e acesso
            por assinatura.
          </p>
        </section>
      </div>
    </footer>
  );
}
