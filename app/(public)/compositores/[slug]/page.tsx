import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PublicComposerPage({ params }: PageProps) {
  const { slug } = await params;

  try {
    const supabase = await createClient();
    const { data: composer, error } = await supabase
      .from("composers")
      .select("*")
      .eq("slug", slug)
      .eq("publication_status", "published")
      .single();

    if (error || !composer) notFound();

    return (
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-semibold">{composer.display_name}</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            {composer.birth_year ?? "?"} - {composer.death_year ?? ""} ·{" "}
            {composer.nationality ?? "nacionalidade não informada"}
          </p>
        </div>
        <Card>
          <h2 className="font-semibold">Biografia</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--muted-foreground)]">
            {composer.long_biography ?? composer.short_biography ?? "Biografia ainda não informada."}
          </p>
        </Card>
      </div>
    );
  } catch {
    notFound();
  }
}
