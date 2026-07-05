import Link from "next/link";
import {
  Archive,
  BookOpen,
  ClipboardList,
  FileClock,
  Gauge,
  Library,
  Music2,
  Tags,
  Upload,
  Users,
} from "lucide-react";

const adminItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/admin/compositores", label: "Compositores", icon: Users },
  { href: "/admin/obras", label: "Obras", icon: Music2 },
  { href: "/admin/instrumentos", label: "Instrumentos", icon: Library },
  { href: "/admin/fontes", label: "Fontes", icon: Archive },
  { href: "/admin/referencias", label: "Referências", icon: BookOpen },
  { href: "/admin/taxonomias", label: "Taxonomias", icon: Tags },
  { href: "/admin/importacao", label: "Importação", icon: Upload },
  { href: "/admin/revisoes", label: "Revisões", icon: FileClock },
  { href: "/admin/usuarios", label: "Usuários", icon: ClipboardList },
];

export function AdminNav() {
  return (
    <aside className="w-full shrink-0 border-b border-[var(--border)] pb-4 lg:w-64 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
      <nav className="grid gap-1" aria-label="Administração">
        {adminItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              className="flex min-h-10 items-center gap-3 rounded-md px-3 text-sm text-[var(--muted-foreground)] hover:bg-white hover:text-[var(--foreground)]"
              href={item.href}
              key={item.href}
            >
              <Icon size={16} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
