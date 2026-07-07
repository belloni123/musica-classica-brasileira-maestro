import Link from "next/link";
import { Printer, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";

type AdvancedSearchPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

type WorkResult = {
  id: string;
  display_title: string;
  slug: string;
  composition_year_start: number | null;
  duration_minutes: number | null;
  formation_type: string | null;
  instrumentation_text: string | null;
  public_summary: string | null;
  composers: { display_name: string } | Array<{ display_name: string }> | null;
};

type ComposerFilterRow = {
  id: string;
};

export const dynamic = "force-dynamic";

const RESULT_LIMIT = 50;

function cleanText(value?: string) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s'".-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

function cleanNumber(value?: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isChecked(value?: string) {
  return value === "on" || value === "true" || value === "1";
}

function composerName(value: WorkResult["composers"]) {
  if (Array.isArray(value)) return value[0]?.display_name ?? "-";
  return value?.display_name ?? "-";
}

function hasAnySearch(params: Record<string, string | undefined>) {
  return Object.values(params).some((value) => cleanText(value).length > 0 || isChecked(value));
}

async function findComposerIds(params: Record<string, string | undefined>) {
  const name = cleanText(params.compositor);
  const nationality = cleanText(params.nacionalidade);
  const birthFrom = cleanNumber(params.nascimento_de);
  const birthTo = cleanNumber(params.nascimento_ate);
  const deathFrom = cleanNumber(params.falecimento_de);
  const deathTo = cleanNumber(params.falecimento_ate);
  const gender = cleanText(params.genero);

  if (!name && !nationality && !birthFrom && !birthTo && !deathFrom && !deathTo && !gender) {
    return null;
  }

  const supabase = await createClient();
  let request = supabase
    .from("composers")
    .select("id")
    .eq("publication_status", "published")
    .limit(500);

  if (name) {
    request = request.or(`canonical_name.ilike.%${name}%,display_name.ilike.%${name}%,surname.ilike.%${name}%`);
  }

  if (nationality) {
    request = request.or(`nationality.ilike.%${nationality}%,ethnicity_identity.ilike.%${nationality}%`);
  }

  if (birthFrom !== null) request = request.gte("birth_year", birthFrom);
  if (birthTo !== null) request = request.lte("birth_year", birthTo);
  if (deathFrom !== null) request = request.gte("death_year", deathFrom);
  if (deathTo !== null) request = request.lte("death_year", deathTo);
  if (gender) request = request.ilike("gender", `%${gender}%`);

  const { data, error } = await request;
  if (error) throw error;

  return ((data ?? []) as ComposerFilterRow[]).map((composer) => composer.id);
}

async function runAdvancedSearch(params: Record<string, string | undefined>) {
  if (!hasAnySearch(params)) {
    return { works: [] as WorkResult[], error: null };
  }

  try {
    const composerIds = await findComposerIds(params);

    if (composerIds && composerIds.length === 0) {
      return { works: [] as WorkResult[], error: null };
    }

    const supabase = await createClient();
    let request = supabase
      .from("works")
      .select(
        "id,display_title,slug,composition_year_start,duration_minutes,formation_type,instrumentation_text,public_summary,composers(display_name)",
      )
      .eq("publication_status", "published")
      .order("display_title", { ascending: true })
      .limit(RESULT_LIMIT);

    const title = cleanText(params.titulo);
    const compositionFrom = cleanNumber(params.composicao_de);
    const compositionTo = cleanNumber(params.composicao_ate);
    const durationFrom = cleanNumber(params.duracao_de);
    const durationTo = cleanNumber(params.duracao_ate);
    const formation = cleanText(params.formacao);
    const instrumentation = cleanText(params.instrumentacao);
    const instrumentalSolo = cleanText(params.solista_instrumental);
    const vocalSolo = cleanText(params.solista_vocal);

    if (composerIds) request = request.in("composer_id", composerIds);
    if (title) request = request.or(`canonical_title.ilike.%${title}%,display_title.ilike.%${title}%`);
    if (compositionFrom !== null) request = request.gte("composition_year_start", compositionFrom);
    if (compositionTo !== null) request = request.lte("composition_year_start", compositionTo);
    if (durationFrom !== null) request = request.gte("duration_minutes", durationFrom);
    if (durationTo !== null) request = request.lte("duration_minutes", durationTo);
    if (formation) request = request.ilike("formation_type", `%${formation}%`);
    if (instrumentation) request = request.ilike("instrumentation_text", `%${instrumentation}%`);
    if (instrumentalSolo) request = request.ilike("instrumentation_text", `%${instrumentalSolo}%`);
    if (vocalSolo) request = request.ilike("instrumentation_text", `%${vocalSolo}%`);
    if (isChecked(params.coro)) request = request.eq("has_choir", true);
    if (isChecked(params.sem_coro)) request = request.eq("has_choir", false);
    if (isChecked(params.solista)) request = request.eq("has_soloist", true);
    if (isChecked(params.obra_didatica)) request = request.eq("educational_work", true);
    if (isChecked(params.orquestra_jovem)) request = request.eq("youth_work", true);

    const { data, error } = await request;
    if (error) throw error;

    return { works: (data ?? []) as unknown as WorkResult[], error: null };
  } catch (error) {
    return {
      works: [] as WorkResult[],
      error: error instanceof Error ? error.message : "Pesquisa avançada indisponível.",
    };
  }
}

function value(params: Record<string, string | undefined>, key: string) {
  return params[key] ?? "";
}

export default async function AdvancedSearchPage({ searchParams }: AdvancedSearchPageProps) {
  const params = await searchParams;
  const { works, error } = await runAdvancedSearch(params);
  const searched = hasAnySearch(params);

  return (
    <div className="grid gap-7">
      <div className="flex items-start justify-between gap-4 border-b border-[var(--border-strong)] pb-4">
        <div>
          <h1 className="text-3xl font-semibold leading-tight text-[var(--foreground-strong)]">
            Pesquisa avançada
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Combine critérios de programação, formação, período, duração e instrumentação.
          </p>
        </div>
        <Link className="text-sm font-semibold text-[var(--catalog-blue)]" href="/entrar">
          Entrar
        </Link>
      </div>

      <form action="/busca-avancada" className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="grid gap-2">
          <details className="bg-[var(--panel-blue)] p-3" open>
            <summary className="cursor-pointer text-sm font-semibold">Compositor, nacionalidade e datas</summary>
            <div className="mt-4 grid gap-3 text-sm">
              <label className="grid gap-1">
                Nome
                <Input className="rounded-sm bg-white" defaultValue={value(params, "compositor")} name="compositor" />
              </label>
              <label className="grid gap-1">
                Nacionalidade / identidade
                <Input
                  className="rounded-sm bg-white"
                  defaultValue={value(params, "nacionalidade")}
                  name="nacionalidade"
                  placeholder="Brasileira, mulheres compositoras..."
                />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="grid gap-1">
                  Nascimento de
                  <Input className="rounded-sm bg-white" defaultValue={value(params, "nascimento_de")} name="nascimento_de" type="number" />
                </label>
                <label className="grid gap-1">
                  até
                  <Input className="rounded-sm bg-white" defaultValue={value(params, "nascimento_ate")} name="nascimento_ate" type="number" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="grid gap-1">
                  Falecimento de
                  <Input className="rounded-sm bg-white" defaultValue={value(params, "falecimento_de")} name="falecimento_de" type="number" />
                </label>
                <label className="grid gap-1">
                  até
                  <Input className="rounded-sm bg-white" defaultValue={value(params, "falecimento_ate")} name="falecimento_ate" type="number" />
                </label>
              </div>
              <label className="grid gap-1">
                Gênero
                <Input className="rounded-sm bg-white" defaultValue={value(params, "genero")} name="genero" />
              </label>
            </div>
          </details>

          <details className="bg-[var(--panel-blue)] p-3" open>
            <summary className="cursor-pointer text-sm font-semibold">Título, ano de composição e duração</summary>
            <div className="mt-4 grid gap-3 text-sm">
              <label className="grid gap-1">
                Título da obra
                <Input className="rounded-sm bg-white" defaultValue={value(params, "titulo")} name="titulo" />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="grid gap-1">
                  Composição de
                  <Input className="rounded-sm bg-white" defaultValue={value(params, "composicao_de")} name="composicao_de" type="number" />
                </label>
                <label className="grid gap-1">
                  até
                  <Input className="rounded-sm bg-white" defaultValue={value(params, "composicao_ate")} name="composicao_ate" type="number" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="grid gap-1">
                  Duração de
                  <Input className="rounded-sm bg-white" defaultValue={value(params, "duracao_de")} name="duracao_de" type="number" />
                </label>
                <label className="grid gap-1">
                  até
                  <Input className="rounded-sm bg-white" defaultValue={value(params, "duracao_ate")} name="duracao_ate" type="number" />
                </label>
              </div>
            </div>
          </details>

          <details className="bg-[var(--panel-blue)] p-3">
            <summary className="cursor-pointer text-sm font-semibold">Tipo de orquestra</summary>
            <label className="mt-4 grid gap-1 text-sm">
              Formação
              <Input
                className="rounded-sm bg-white"
                defaultValue={value(params, "formacao")}
                name="formacao"
                placeholder="Orquestra, cordas, câmara..."
              />
            </label>
          </details>

          <details className="bg-[var(--panel-blue)] p-3">
            <summary className="cursor-pointer text-sm font-semibold">Instrumentação</summary>
            <label className="mt-4 grid gap-1 text-sm">
              Instrumento ou família
              <Input
                className="rounded-sm bg-white"
                defaultValue={value(params, "instrumentacao")}
                name="instrumentacao"
                placeholder="Madeiras, berimbau, harpa..."
              />
            </label>
          </details>

          <details className="bg-[var(--panel-blue)] p-3">
            <summary className="cursor-pointer text-sm font-semibold">Solista(s) instrumental(is)</summary>
            <label className="mt-4 grid gap-1 text-sm">
              Instrumento solista
              <Input className="rounded-sm bg-white" defaultValue={value(params, "solista_instrumental")} name="solista_instrumental" />
            </label>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input defaultChecked={isChecked(params.solista)} name="solista" type="checkbox" />
              Mostrar obras com solista
            </label>
          </details>

          <details className="bg-[var(--panel-blue)] p-3">
            <summary className="cursor-pointer text-sm font-semibold">Solista(s) vocal(is)</summary>
            <label className="mt-4 grid gap-1 text-sm">
              Voz
              <Input className="rounded-sm bg-white" defaultValue={value(params, "solista_vocal")} name="solista_vocal" placeholder="Soprano, tenor..." />
            </label>
          </details>

          <details className="bg-[var(--panel-blue)] p-3">
            <summary className="cursor-pointer text-sm font-semibold">Coro</summary>
            <div className="mt-4 grid gap-2 text-sm">
              <label className="flex items-center gap-2">
                <input defaultChecked={isChecked(params.coro)} name="coro" type="checkbox" />
                Com coro
              </label>
              <label className="flex items-center gap-2">
                <input defaultChecked={isChecked(params.sem_coro)} name="sem_coro" type="checkbox" />
                Sem coro
              </label>
            </div>
          </details>

          <details className="bg-[var(--panel-blue)] p-3">
            <summary className="cursor-pointer text-sm font-semibold">Obras jovens / educacionais</summary>
            <div className="mt-4 grid gap-2 text-sm">
              <label className="flex items-center gap-2">
                <input defaultChecked={isChecked(params.obra_didatica)} name="obra_didatica" type="checkbox" />
                Obra didática
              </label>
              <label className="flex items-center gap-2">
                <input defaultChecked={isChecked(params.orquestra_jovem)} name="orquestra_jovem" type="checkbox" />
                Orquestra jovem
              </label>
            </div>
          </details>

          <div className="mt-3 flex items-center gap-2">
            <Button aria-label="Buscar" size="sm" type="submit" variant="secondary">
              <Search size={19} aria-hidden="true" />
            </Button>
            <Button asChild aria-label="Limpar" size="sm" variant="secondary">
              <Link href="/busca-avancada">
                <RotateCcw size={18} aria-hidden="true" />
              </Link>
            </Button>
            <Button aria-label="Imprimir" size="sm" type="button" variant="secondary">
              <Printer size={18} aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div className="grid content-start gap-6">
          <div className="rounded-md border border-[var(--foreground)] bg-[var(--help-blue)] p-4 text-sm leading-6">
            <h2 className="text-xl font-semibold">Informações úteis</h2>
            <p className="mt-2 font-medium">
              Use a pesquisa avançada para programação temática, seleção por duração, formação,
              coro, solistas e recortes de compositor.
            </p>
            <p className="mt-2 font-medium">
              Para resultados mais precisos, combine poucos critérios fortes em vez de preencher
              todos os campos ao mesmo tempo.
            </p>
          </div>

          {error ? <Card className="text-sm text-[var(--muted-foreground)]">{error}</Card> : null}
          {!searched ? (
            <EmptyState title="Escolha um ou mais critérios" />
          ) : works.length === 0 ? (
            <EmptyState title="Nenhuma obra encontrada" />
          ) : (
            <section className="grid gap-3">
              <h2 className="text-2xl font-normal">Resultados</h2>
              {works.map((work) => (
                <Link href={`/obras/${work.slug}`} key={work.id}>
                  <Card className="transition-colors hover:border-[var(--border-strong)]">
                    <h3 className="text-xl font-normal">{work.display_title}</h3>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {composerName(work.composers)} · {work.composition_year_start ?? "s/d"} ·{" "}
                      {work.duration_minutes ? `${work.duration_minutes} min` : "duração não informada"}
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                      {work.formation_type ?? "formação não informada"}
                      {work.instrumentation_text ? ` · ${work.instrumentation_text}` : ""}
                    </p>
                  </Card>
                </Link>
              ))}
            </section>
          )}
        </div>
      </form>
    </div>
  );
}
