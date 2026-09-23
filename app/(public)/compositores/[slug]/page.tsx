import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { composerBirthplace } from "@/lib/catalog/composers";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export default async function PublicComposerPage({ params }: PageProps) {
  const { slug } = await params;


    const supabase = await createClient();
    const { data: composer, error } = await supabase
      .from("composers")
      .select("id,display_name,birth_year,death_year,birth_city,birth_state,short_biography,long_biography,photo_path")
      .eq("slug", slug)
      .eq("publication_status", "published")
      .maybeSingle();

    if (error) throw new Error("Não foi possível consultar o compositor.");
    if (!composer) notFound();
    const { data: works, error: worksError } = await supabase.from("works")
      .select("id,display_title,slug,composition_year_start").eq("composer_id", composer.id)
      .eq("publication_status", "published").order("display_title").limit(100);
    if (worksError) throw new Error("Não foi possível carregar as obras.");

    return (
      <div className="grid gap-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {composer.photo_path ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={`Foto de ${composer.display_name}`}
              className="h-36 w-36 shrink-0 rounded-xl object-cover sm:h-44 sm:w-44"
              src={supabase.storage.from("composer-photos").getPublicUrl(composer.photo_path).data.publicUrl}
            />
          ) : null}
          <div className="max-w-3xl">
            <p className="mb-3 text-sm text-[var(--accent)]">Compositor</p>
            <h1 className="text-3xl font-semibold leading-tight text-[var(--foreground-strong)] sm:text-4xl md:text-5xl">
              {composer.display_name}
            </h1>
            <p className="mt-4 text-lg text-[var(--muted-foreground)]">
              {composer.birth_year ?? "?"} - {composer.death_year ?? ""} ·{" "}
              {composerBirthplace(composer.birth_city, composer.birth_state)}
            </p>
          </div>
        </div>
        <Card className="max-w-4xl">
          <h2 className="text-2xl font-normal">Biografia</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--muted-foreground)]">
            {composer.long_biography ?? composer.short_biography ?? "Biografia não informada."}
          </p>
        </Card>
        <section className="grid gap-3"><h2 className="text-2xl">Obras publicadas</h2>
          {works?.map(work => <Link href={`/obras/${work.slug}`} key={work.id}><Card>{work.display_title} · {work.composition_year_start ?? "s/d"}</Card></Link>)}
          {!works?.length && <p>Nenhuma obra publicada deste compositor.</p>}
          <Link className="underline" href={`/buscar?compositor=${encodeURIComponent(composer.display_name)}`}>Pesquisar todas as obras</Link>
        </section>
      </div>
    );
}
