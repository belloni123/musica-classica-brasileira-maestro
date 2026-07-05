import Link from "next/link";
import { LibraryBig, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const publicLinks = [
  { href: "/buscar", label: "Buscar" },
  { href: "/compositores", label: "Compositores" },
  { href: "/obras", label: "Obras" },
  { href: "/metodologia", label: "Metodologia" },
  { href: "/admin/dashboard", label: "Admin" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_92%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex min-h-[72px] w-full max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
        <Link className="flex min-w-0 items-center gap-3 text-sm font-normal md:text-base" href="/">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--button-inset)]">
            <LibraryBig size={17} aria-hidden="true" />
          </span>
          <span className="hidden leading-tight sm:inline">Música Brasileira de Concerto</span>
          <span className="leading-tight sm:hidden">MBC</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegação pública">
          {publicLinks.map((link) => (
            <Button asChild key={link.href} size="sm" variant="ghost">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>
        <Button asChild size="sm">
          <Link aria-label="Entrar" href="/entrar">
            <LogIn size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Entrar</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
