import Link from "next/link";
import { Card } from "@/components/ui/card";
import { catalogResources } from "@/lib/catalog/resources";

export default function ResourcesPage() {
  return (
    <div className="grid gap-7">
      <div className="flex items-start justify-between gap-4 border-b border-[var(--border-strong)] pb-4">
        <div>
          <h1 className="text-3xl font-semibold leading-tight text-[var(--foreground-strong)]">
            Recursos
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Páginas de apoio para busca, instrumentação, fontes e leitura dos registros.
          </p>
        </div>
        <Link className="text-sm font-semibold text-[var(--catalog-blue)]" href="/entrar">
          Entrar
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {catalogResources.map((resource) => (
          <Link href={`/recursos/${resource.slug}`} key={resource.slug}>
            <Card className="h-full transition-colors hover:border-[var(--border-strong)]">
              <h2 className="text-xl font-normal">{resource.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                {resource.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
