import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { readCatalog } from "@/lib/integrations/catalog";

export const metadata = { title: "Maestros | Brasil Orquestral" };
export const dynamic = "force-dynamic";

export default async function ConductorsPage({ searchParams }: {
  searchParams: Promise<{ pagina?: string }>;
}) {
  const { pagina } = await searchParams;
  const pageSize = 24;
  const page = Math.min(Math.floor(100_000 / pageSize) + 1, Math.max(1, Number.parseInt(pagina ?? "", 10) || 1));
  const result = await readCatalog({ entity: "conductors", limit: pageSize, offset: (page - 1) * pageSize })
    .catch(() => null);

  return (
    <section className="grid gap-6">
      <h1 className="border-b border-[var(--border-strong)] pb-4 text-4xl">Maestros</h1>
      {!result ? (
        <Card role="alert">Não foi possível carregar os maestros. Tente novamente mais tarde.</Card>
      ) : result.total === 0 ? (
        <EmptyState title="Nenhum maestro publicado" description="Os perfis de regentes aparecem aqui após a publicação editorial." />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {result.data.map((conductor) => "display_name" in conductor && (
              <Link href={`/maestros/${conductor.slug}`} key={conductor.slug}>
                <Card className="h-full hover:border-[var(--border-strong)]">
                  <h2 className="text-2xl">{conductor.display_name}</h2>
                  {conductor.short_biography && (
                    <p className="mt-2 line-clamp-3 text-[var(--muted-foreground)]">{conductor.short_biography}</p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
          <Pagination currentPage={page} pageSize={pageSize} totalItems={result.total}
            buildHref={(nextPage) => `/maestros?pagina=${nextPage}`} />
        </>
      )}
    </section>
  );
}
