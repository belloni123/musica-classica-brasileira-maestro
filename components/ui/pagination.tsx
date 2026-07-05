import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  buildHref,
}: {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  buildHref: (page: number) => string;
}) {
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);

  return (
    <div className="flex flex-col gap-3 text-sm text-[var(--muted-foreground)] md:flex-row md:items-center md:justify-between">
      <span>
        Página {currentPage} de {totalPages} · {totalItems} registro(s)
      </span>
      <div className="flex gap-2">
        <Button asChild disabled={currentPage <= 1} size="sm" variant="secondary">
          <Link href={buildHref(Math.max(currentPage - 1, 1))}>Anterior</Link>
        </Button>
        <Button asChild disabled={currentPage >= totalPages} size="sm" variant="secondary">
          <Link href={buildHref(Math.min(currentPage + 1, totalPages))}>Próxima</Link>
        </Button>
      </div>
    </div>
  );
}
