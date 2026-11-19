import Link from "next/link";

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
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-6 text-sm md:px-8 lg:flex-row lg:items-baseline lg:justify-between">
        <nav aria-label="Links do rodapé" className="flex flex-wrap gap-x-5 gap-y-2">
          {quickLinks.map((link) => (
            <Link className="w-fit hover:underline underline-offset-4" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="max-w-sm leading-relaxed text-[var(--ivory)]/75">
          Catálogo de referência. Para acessar materiais, consulte editoras, acervos e detentores de direitos.
        </p>
      </div>
    </footer>
  );
}
