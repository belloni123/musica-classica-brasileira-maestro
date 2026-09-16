import Link from "next/link";

export function SearchPagination({ path, params, page, hasNext }: {
  path: string; params: Record<string, string | undefined>; page: number; hasNext: boolean;
}) {
  function href(number: number) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) if (value && key !== "pagina") query.set(key, value);
    query.set("pagina", String(number));
    return `${path}?${query.toString()}`;
  }
  return <nav aria-label="Paginação" className="flex items-center gap-4 text-sm">
    {page > 1 && <Link href={href(page - 1)}>← Anterior</Link>}
    <span>Página {page}</span>
    {hasNext && <Link href={href(page + 1)}>Próxima →</Link>}
  </nav>;
}
