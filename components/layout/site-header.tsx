import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { ChevronDown, LibraryBig, LogIn, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const publicLinks = [
  { href: "/buscar", label: "Pesquisa simples" },
  { href: "/busca-avancada", label: "Pesquisa avançada" },
  { href: "/compositores", label: "Compositores" },
];

const resourceLinks = [
  { href: "/recursos/editoras", label: "Editoras e acervos" },
  { href: "/recursos/ferramenta", label: "Esta ferramenta" },
  { href: "/recursos/praticas-instrumentais", label: "Práticas instrumentais" },
  { href: "/recursos/altura-e-transposicao", label: "Altura e transposição" },
  { href: "/recursos/abreviaturas", label: "Abreviaturas" },
];

export async function SiteHeader() {
  const user = await getCurrentUser();
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface-strong)]">
      <div className="mx-auto flex min-h-[72px] w-full max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
        <Link className="flex min-w-0 items-center gap-3 text-sm font-semibold md:text-base" href="/">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--catalog-blue)] text-white shadow-[var(--button-inset)]">
            <LibraryBig size={17} aria-hidden="true" />
          </span>
          <span className="grid leading-tight">
            <span className="whitespace-nowrap text-[var(--catalog-blue)]">Brasil Orquestral</span>
            <span className="hidden whitespace-nowrap text-xs font-normal text-[var(--catalog-blue)] xl:inline">
              ferramenta de busca de repertório brasileiro
            </span>
          </span>
        </Link>
        <nav className="hidden self-stretch xl:flex" aria-label="Navegação pública">
          {publicLinks.map((link) => (
            <Link
              className="flex items-center px-4 text-xs font-semibold uppercase tracking-normal text-[var(--foreground)] hover:bg-[var(--nav-active)]"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
          <div className="group relative flex">
            <Link
              className="flex items-center gap-1 px-4 text-xs font-semibold uppercase tracking-normal hover:bg-[var(--nav-active)]"
              href="/recursos"
            >
              Recursos
              <ChevronDown size={14} aria-hidden="true" />
            </Link>
            <div className="invisible absolute right-0 top-full min-w-56 bg-[var(--nav-active)] py-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              {resourceLinks.map((link) => (
                <Link
                  className="block px-4 py-3 text-xs font-semibold hover:bg-[var(--surface-strong)]"
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <Link
            className="my-auto flex h-10 items-center rounded-md border border-[var(--border-strong)] bg-[var(--accent)] px-4 text-xs font-semibold uppercase tracking-normal text-[var(--foreground-strong)] shadow-[var(--button-inset)] transition-colors hover:bg-[var(--nav-active)]"
            href="/planos"
          >
            Assinar
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="ghost">
            <Link aria-label={user ? "Minha conta" : "Entrar"} href={user ? "/minha-conta" : "/entrar"}>
              <LogIn size={16} aria-hidden="true" />
              <span className="hidden sm:inline">{user ? "Minha conta" : "Entrar"}</span>
            </Link>
          </Button>
          <details className="relative xl:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md border border-[var(--border)] bg-[var(--nav-active)]">
              <Menu size={22} aria-hidden="true" />
              <span className="sr-only">Abrir menu</span>
            </summary>
            <div className="absolute right-0 top-12 w-72 border border-[var(--border)] bg-[var(--surface-strong)] p-2 shadow-lg">
              {[...publicLinks, { href: "/recursos", label: "Recursos" }, { href: "/planos", label: "Assinar" }].map(
                (link) => (
                  <Link className="block px-3 py-3 text-sm font-medium" href={link.href} key={link.href}>
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
