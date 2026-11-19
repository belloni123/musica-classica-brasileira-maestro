import Link from "next/link";
import { notFound } from "next/navigation";
import { readCatalog } from "@/lib/integrations/catalog";

export const dynamic = "force-dynamic";

export default async function ConductorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await readCatalog({ entity: "conductors", slug, limit: 1 });
  const conductor = result.data[0];
  if (!conductor || !("display_name" in conductor)) notFound();
  const years = [conductor.birth_year, conductor.death_year].filter((year) => year != null).join("–");

  return (
    <article className="max-w-3xl">
      <Link className="text-sm underline underline-offset-4" href="/maestros">Todos os maestros</Link>
      <h1 className="mt-5 text-4xl sm:text-5xl">{conductor.display_name}</h1>
      {years && <p className="mt-2 text-[var(--muted-foreground)]">{years}</p>}
      <p className="mt-6 whitespace-pre-line leading-relaxed">{conductor.long_biography || conductor.short_biography}</p>
    </article>
  );
}
