import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { createClient } from "@/lib/supabase/server";

type ComposersPageProps = {
  searchParams: Promise<{ letra?: string }>;
};

type ComposerRow = {
  id: string;
  display_name: string;
  canonical_name: string;
  slug: string;
  birth_year: number | null;
  death_year: number | null;
  nationality: string | null;
  short_biography: string | null;
};

export const dynamic = "force-dynamic";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function normalizeLetter(value?: string) {
  const letter = String(value ?? "").trim().toUpperCase().slice(0, 1);
  return alphabet.includes(letter) ? letter : "";
}

function firstIndexLetter(composer: ComposerRow) {
  const source = composer.canonical_name || composer.display_name;
  return source.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().charAt(0).toUpperCase();
}

async function fetchPublishedComposers(letter: string) {
  try {
    const supabase = await createClient();
    let request = supabase
      .from("composers")
      .select("id,display_name,canonical_name,slug,birth_year,death_year,nationality,short_biography")
      .eq("publication_status", "published")
      .order("canonical_name", { ascending: true })
      .limit(500);

    if (letter) {
      request = request.ilike("canonical_name", `${letter}%`);
    }

    const { data, error } = await request;

    if (error) throw error;
    return { composers: (data ?? []) as ComposerRow[], error: null };
  } catch (error) {
    return {
      composers: [] as ComposerRow[],
      error: error instanceof Error ? error.message : "Base ainda não conectada.",
    };
  }
}

export default async function ComposersPage({ searchParams }: ComposersPageProps) {
  const params = await searchParams;
  const selectedLetter = normalizeLetter(params.letra);
  const { composers, error } = await fetchPublishedComposers(selectedLetter);

  return (
    <div className="grid gap-7">
      <div className="flex items-start justify-between gap-4 border-b border-[var(--border-strong)] pb-4">
        <div>
          <h1 className="text-3xl font-semibold leading-tight text-[var(--foreground-strong)]">
            Visão geral de compositores
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Compositores e obras da base publicados em ordem alfabética.
          </p>
        </div>
        <Link className="text-sm font-semibold text-[var(--catalog-blue)]" href="/entrar">
          Entrar
        </Link>
      </div>

      <nav className="flex flex-wrap gap-x-3 gap-y-2 text-sm font-semibold" aria-label="Índice alfabético">
        <Link
          className={!selectedLetter ? "text-[var(--accent)]" : "text-[var(--catalog-blue)]"}
          href="/compositores"
        >
          Todos
        </Link>
        {alphabet.map((letter) => (
          <Link
            className={selectedLetter === letter ? "text-[var(--accent)]" : "text-[var(--catalog-blue)]"}
            href={`/compositores?letra=${letter}`}
            key={letter}
          >
            {letter}
          </Link>
        ))}
      </nav>

      <p className="text-sm leading-6 text-[var(--muted-foreground)]">
        Encontre compositores publicados na base. A instrumentação completa e dados detalhados ficam
        disponíveis conforme o nível de acesso do usuário.
      </p>

      {error ? <Card className="text-sm text-[var(--muted-foreground)]">{error}</Card> : null}
      {composers.length === 0 ? (
        <EmptyState
          title="Nenhum compositor publicado"
          description="A listagem será preenchida quando o Supabase real estiver configurado e houver registros publicados."
        />
      ) : (
        <div className="grid gap-6">
          {alphabet
            .filter((letter) => !selectedLetter || letter === selectedLetter)
            .map((letter) => {
              const letterComposers = composers.filter((composer) => firstIndexLetter(composer) === letter);

              if (letterComposers.length === 0) return null;

              return (
                <section className="grid gap-3" key={letter}>
                  <h2 className="border-b border-[var(--border)] pb-2 text-2xl font-semibold">{letter}</h2>
                  <div className="grid gap-3 md:grid-cols-2">
                    {letterComposers.map((composer) => (
                      <Link href={`/compositores/${composer.slug}`} key={composer.id}>
                        <Card className="h-full transition-colors hover:border-[var(--border-strong)]">
                          <h3 className="text-xl font-normal">{composer.display_name}</h3>
                          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                            {composer.birth_year ?? "?"} - {composer.death_year ?? ""} ·{" "}
                            {composer.nationality ?? "nacionalidade não informada"}
                          </p>
                          {composer.short_biography ? (
                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--muted-foreground)]">
                              {composer.short_biography}
                            </p>
                          ) : null}
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
        </div>
      )}
    </div>
  );
}
