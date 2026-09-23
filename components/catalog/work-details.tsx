import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { firstRelated, safeExternalUrl, type WorkDetails } from "@/lib/catalog/types";
import { instrumentationCode, sortInstrumentationRows } from "@/lib/catalog/instrumentation";

export async function CatalogWorkDetails({ workId, durationMinutes, formationType }: {
  workId: string; durationMinutes: number | null; formationType: string | null;
}) {
  const supabase = await createClient();
  const [details, instrumentation, sources, references] = await Promise.all([
    supabase.rpc("get_work_details", { work_id: workId }),
    supabase.from("work_instrumentation").select("id,minimum_quantity,maximum_quantity,quantity_text,optional,doubling,role,notes,instruments!work_instrumentation_instrument_id_fkey(name)").eq("work_id", workId).order("created_at"),
    supabase.from("work_sources").select("id,material_type,score_available,parts_available,access_conditions,purchase_url,rental_url,perusal_score_url,source_holders(name,website)").eq("work_id", workId),
    supabase.from("work_references").select("id,bibliographic_references(title,author,year,url)").eq("work_id", workId),
  ]);
  if ([details, instrumentation, sources, references].some(result => result.error)) throw new Error("Não foi possível carregar os detalhes autorizados.");
  const data = details.data as WorkDetails | null;
  const code = instrumentationCode(instrumentation.data ?? []);
  const mainSourceUrl = safeExternalUrl(data?.main_source);
  const visibleInstrumentation = sortInstrumentationRows((instrumentation.data ?? []).filter(row => {
    const name = firstRelated(row.instruments)?.name?.trim().toLocaleLowerCase("pt-BR") ?? "";
    const isStrings = name === "cordas" || name === "strings";
    const hasQuantity = Boolean(row.quantity_text?.trim()) || row.minimum_quantity !== null || row.maximum_quantity !== null;
    return !isStrings || hasQuantity;
  }), row => firstRelated(row.instruments)?.name ?? "Instrumento");
  return <>
    <Card>
      <h2 className="text-2xl">Informações para performance</h2>
      <dl className="mt-4 grid gap-4">
        <div><dt className="text-sm text-[var(--muted-foreground)]">Duração</dt><dd>{durationMinutes != null ? `${durationMinutes} min` : "Não informada"}</dd></div>
        <div><dt className="text-sm text-[var(--muted-foreground)]">Meio de execução</dt><dd>{formationType ?? "Não informado"}</dd></div>
        <div><dt className="text-sm text-[var(--muted-foreground)]">Instrumentação</dt>
          <dd className="mt-1">{code ? <span className="font-mono text-lg" aria-label={`Instrumentação: ${code}`}>{code}</span> : data?.instrumentation_text || "Não informada"}</dd>
          {!!(visibleInstrumentation.length || data?.instrumentation_text) && <details className="mt-3"><summary className="cursor-pointer text-sm font-medium">Ver instrumentos</summary>
            {data?.instrumentation_text && <p className="mt-3 whitespace-pre-wrap">{data.instrumentation_text}</p>}
            <ul className="mt-3 grid gap-2">{visibleInstrumentation.map(row => <li key={row.id}>
              {firstRelated(row.instruments)?.name ?? "Instrumento"}: {row.quantity_text || (row.minimum_quantity === null && row.maximum_quantity === null ? "quantidade não informada" : `${row.minimum_quantity ?? row.maximum_quantity}${row.maximum_quantity !== null && row.minimum_quantity !== row.maximum_quantity ? `–${row.maximum_quantity}` : ""}`)}
              {row.optional ? " · opcional" : ""}{row.doubling ? " · dobramento" : ""}{row.role ? ` · ${row.role}` : ""}
              {row.notes && <p className="text-sm text-[var(--muted-foreground)]">{row.notes}</p>}
            </li>)}</ul>
          </details>}
        </div>
      </dl>
      <div className="mt-6 border-t border-[var(--border)] pt-5">
        <h3 className="text-xl">Observações</h3>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--muted-foreground)]">
          {data?.performance_notes || "Nenhuma observação informada."}
        </p>
      </div>
    </Card>
    <Card>
      <h2 className="text-2xl">Disponibilidade de material</h2>
      {mainSourceUrl && <p className="mt-3"><a className="break-all underline" href={mainSourceUrl} target="_blank" rel="noopener noreferrer">{data?.main_source}</a></p>}
      {sources.data?.map(source => <div key={source.id} className="mt-4 border-t pt-3">
        <h3>{firstRelated(source.source_holders)?.name ?? "Acervo não informado"} · {source.material_type}</h3>
        <p className="text-sm">Partitura: {source.score_available ? "disponível" : "não confirmada"} · Partes: {source.parts_available ? "disponíveis" : "não confirmadas"}</p>
        <p>{source.access_conditions}</p>
        <div className="flex gap-3">{[["Consulta",source.perusal_score_url],["Compra",source.purchase_url],["Locação",source.rental_url]].map(([label,url]) => {
          const href = safeExternalUrl(url); return href ? <a key={label} className="underline" href={href} target="_blank" rel="noopener noreferrer">{label}</a> : null;
        })}</div>
      </div>)}
      {!mainSourceUrl && !sources.data?.length && <p className="mt-3 text-sm">Nenhum material informado.</p>}
    </Card>
    <Card>
      <h2 className="text-2xl">Referências bibliográficas</h2>
      {references.data?.map(row => { const reference = firstRelated(row.bibliographic_references); const href = safeExternalUrl(reference?.url); return <p className="mt-3" key={row.id}>{reference?.author} · {reference?.title} · {reference?.year ?? "s/d"} {href && <a href={href} className="underline" target="_blank" rel="noopener noreferrer">Consultar</a>}</p>; })}
      {!references.data?.length && <p className="mt-3 text-sm">Nenhuma referência vinculada.</p>}
    </Card>
  </>;
}
