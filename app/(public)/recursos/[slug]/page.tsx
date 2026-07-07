import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { catalogResources, getCatalogResource } from "@/lib/catalog/resources";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type SourceHolderRow = {
  id: string;
  name: string;
  type: string;
  city: string | null;
  state: string | null;
  country: string | null;
  website: string | null;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return catalogResources.map((resource) => ({ slug: resource.slug }));
}

async function fetchSourceHolders() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("source_holders")
      .select("id,name,type,city,state,country,website")
      .eq("active", true)
      .order("name", { ascending: true })
      .limit(100);

    if (error) throw error;
    return { sources: (data ?? []) as SourceHolderRow[], error: null };
  } catch (error) {
    return {
      sources: [] as SourceHolderRow[],
      error: error instanceof Error ? error.message : "Não foi possível carregar as fontes.",
    };
  }
}

export default async function ResourcePage({ params }: PageProps) {
  const { slug } = await params;
  const resource = getCatalogResource(slug);

  if (!resource) {
    notFound();
  }

  const sourceData = slug === "editoras" ? await fetchSourceHolders() : null;

  return (
    <div className="grid gap-7">
      <div className="flex items-start justify-between gap-4 border-b border-[var(--border-strong)] pb-4">
        <div>
          <p className="mb-2 text-sm text-[var(--accent)]">Recursos</p>
          <h1 className="text-3xl font-semibold leading-tight text-[var(--foreground-strong)]">
            {resource.title}
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">{resource.description}</p>
        </div>
        <Link className="text-sm font-semibold text-[var(--catalog-blue)]" href="/entrar">
          Entrar
        </Link>
      </div>

      <div className="grid gap-5">
        {resource.sections.map((section) => (
          <section className="grid gap-2" key={section.title}>
            <h2 className="text-2xl font-normal">{section.title}</h2>
            {section.body.map((paragraph) => (
              <p className="text-sm leading-7 text-[var(--muted-foreground)]" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>

      {sourceData ? (
        <section className="grid gap-3">
          <h2 className="text-2xl font-normal">Registros cadastrados</h2>
          {sourceData.error ? (
            <Card className="text-sm text-[var(--muted-foreground)]">{sourceData.error}</Card>
          ) : sourceData.sources.length === 0 ? (
            <Card className="text-sm text-[var(--muted-foreground)]">
              Nenhuma fonte ativa publicada.
            </Card>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {sourceData.sources.map((source) => (
                <Card key={source.id}>
                  <h3 className="text-lg font-normal">{source.name}</h3>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {source.type} · {[source.city, source.state, source.country].filter(Boolean).join(", ") || "-"}
                  </p>
                  {source.website ? (
                    <a
                      className="mt-2 block text-sm text-[var(--catalog-blue)]"
                      href={source.website}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Site
                    </a>
                  ) : null}
                </Card>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
