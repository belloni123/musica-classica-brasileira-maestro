import Link from "next/link";
import { Database, LogIn } from "lucide-react";
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
    <header className="border-b border-[var(--border)] bg-white">
      <div className="mx-auto flex min-h-[72px] w-full max-w-7xl items-center justify-between gap-6 px-6">
        <Link className="flex items-center gap-3 font-semibold" href="/">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--primary)] text-white">
            <Database size={18} aria-hidden="true" />
          </span>
          <span>Música Brasileira de Concerto</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegação pública">
          {publicLinks.map((link) => (
            <Button asChild key={link.href} size="sm" variant="ghost">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>
        <Button asChild size="sm" variant="secondary">
          <Link href="/entrar">
            <LogIn size={16} aria-hidden="true" />
            Entrar
          </Link>
        </Button>
      </div>
    </header>
  );
}
