import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { firstRelated, safeExternalUrl, type WorkDetails } from "@/lib/catalog/types";
import { instrumentationCode } from "@/lib/catalog/instrumentation";

export async function CatalogWorkDetails({ workId }: { workId: string }) {
  const supabase = await createClient();
  const [details, instrumentation, sources, references] = await Promise.all([
    supabase.rpc("get_work_details", { work_id: workId }),
    supabase.from("work_instrumentation").select("id,minimum_quantity,maximum_quantity,quantity_text,optional,doubling,role,notes,instruments!work_instrumentation_instrument_id_fkey(name)").eq("work_id", workId).order("created_at"),
    supabase.from("work_sources").select("id,material_type,score_available,parts_available,access_conditions,purchase_url,rental_url,perusal_score_url,source_holders(name,website)").eq("work_id", workId),
    supabase.from("work_references").select("id,bibliographic_references(title,author,year,url)").eq("work_id", workId),
  ]);
  if ([details, instrumentation, sources, references].some((result) => result.error)) throw new Error("Não foi possível carregar os detalhes autorizados.");
  const data = details.data as WorkDetails | null;
  const code = instrumentationCode(instrumentation.data ?? []);
  return <>
    <Card><h2 className="text-2xl">Instrumentação</h2>
      {code ? <>
        <p className="mt-3 font-mono text-xl leading-relaxed" aria-label={`Instrumentação: ${code}`}>{code}</p>
        <p className="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">Flautas, oboés, clarinetes, fagotes — trompas, trompetes, trombones, tubas — Tmp: tímpanos — Str: cordas cadastradas.</p>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">0: nenhum instrumento cadastrado nessa posição; ?: quantidade não informada; +: mínimo; *: consultar função, opcional ou dobramento nos detalhes.</p>
      </> : <p className="mt-3 whitespace-pre-wrap">{data?.instrumentation_text || "Instrumentação não informada."}</p>}
      {!!instrumentation.data?.length && <details className="mt-4"><summary className="cursor-pointer text-sm font-medium">Ver instrumentos e observações</summary>
      {data?.instrumentation_text && <p className="mt-3 whitespace-pre-wrap">{data.instrumentation_text}</p>}
      <ul className="mt-3 grid gap-2">{instrumentation.data?.map(row => <li key={row.id}>
        {firstRelated(row.instruments)?.name ?? "Instrumento"}: {row.quantity_text || (row.minimum_quantity === null ? "quantidade não informada" : `${row.minimum_quantity}${row.maximum_quantity !== null && row.maximum_quantity !== row.minimum_quantity ? `–${row.maximum_quantity}` : ""}`)}
        {row.optional ? " · opcional" : ""}{row.doubling ? " · dobramento" : ""}{row.role ? ` · ${row.role}` : ""}
        {row.notes && <p className="text-sm text-[var(--muted-foreground)]">{row.notes}</p>}
      </li>)}</ul>
      </details>}
    </Card>
    <Card><h2 className="text-2xl">Notas para pesquisa e performance</h2>
      <p className="mt-3 whitespace-pre-wrap">{data?.subscriber_notes || "Notas de pesquisa não informadas."}</p>
      <p className="mt-3 whitespace-pre-wrap">{data?.performance_notes || "Notas de performance não informadas."}</p>
    </Card>
    <Card><h2 className="text-2xl">Fontes e materiais</h2>
      <p className="mt-3 whitespace-pre-wrap">{data?.main_source || "Fonte principal não informada."}</p>
      {sources.data?.map(source => <div key={source.id} className="mt-4 border-t pt-3">
        <h3>{firstRelated(source.source_holders)?.name ?? "Acervo não informado"} · {source.material_type}</h3>
        <p className="text-sm">Partitura: {source.score_available ? "disponível" : "não confirmada"} · Partes: {source.parts_available ? "disponíveis" : "não confirmadas"}</p>
        <p>{source.access_conditions}</p>
        <div className="flex gap-3">{[["Consulta",source.perusal_score_url],["Compra",source.purchase_url],["Locação",source.rental_url]].map(([label,url]) => {
          const href = safeExternalUrl(url); return href ? <a key={label} className="underline" href={href} target="_blank" rel="noopener noreferrer">{label}</a> : null;
        })}</div>
      </div>)}
      {!sources.data?.length && <p className="mt-3 text-sm">Nenhum material vinculado.</p>}
    </Card>
    <Card><h2 className="text-2xl">Referências</h2>
      {references.data?.map(row => { const reference=firstRelated(row.bibliographic_references); const href=safeExternalUrl(reference?.url); return <p className="mt-3" key={row.id}>{reference?.author} · {reference?.title} · {reference?.year ?? "s/d"} {href && <a href={href} className="underline" target="_blank" rel="noopener noreferrer">Consultar</a>}</p>; })}
      {!references.data?.length && <p className="mt-3 text-sm">Nenhuma referência vinculada.</p>}
    </Card>
  </>;
}
