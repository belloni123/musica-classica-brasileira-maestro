import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export default async function PublicComposerPage({ params }: PageProps) {
  const { slug } = await params;

  try {
    const supabase = await createClient();
    const { data: composer, error } = await supabase
      .from("composers")
      .select("display_name,birth_year,death_year,nationality,short_biography,long_biography")
      .eq("slug", slug)
      .eq("publication_status", "published")
      .single();

    if (error || !composer) notFound();

    return (
      <div className="grid gap-8">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm text-[var(--accent)]">Compositor</p>
          <h1 className="text-3xl font-semibold leading-tight text-[var(--foreground-strong)] sm:text-4xl md:text-5xl">
            {composer.display_name}
          </h1>
          <p className="mt-4 text-lg text-[var(--muted-foreground)]">
            {composer.birth_year ?? "?"} - {composer.death_year ?? ""} ·{" "}
            {composer.nationality ?? "nacionalidade não informada"}
          </p>
        </div>
        <Card className="max-w-4xl">
          <h2 className="text-2xl font-normal">Biografia</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--muted-foreground)]">
            {composer.long_biography ?? composer.short_biography ?? "Biografia não informada."}
          </p>
        </Card>
      </div>
    );
  } catch {
    notFound();
  }
}
