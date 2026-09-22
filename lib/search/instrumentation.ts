import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile, hasCompleteCatalogAccess } from "@/lib/auth/session";
import { matchesInstrumentation, type InstrumentationCriteria, type InstrumentationRow } from "@/lib/catalog/instrumentation";

export async function findInstrumentationMatches(criteria: InstrumentationCriteria) {
  if (!hasCompleteCatalogAccess(await getCurrentProfile())) {
    throw new Error("Entre com uma conta com acesso ao catálogo para pesquisar instrumentação detalhada.");
  }
  const supabase = await createClient();
  const byWork = new Map<string, InstrumentationRow[]>();
  // RLS remains in force; no privileged client or public exposure of instrumentation.
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await supabase.from("work_instrumentation")
      .select("id,work_id,minimum_quantity,maximum_quantity,quantity_text,optional,doubling,role,instruments!work_instrumentation_instrument_id_fkey(name)")
      .order("id").range(offset, offset + 499);
    if (error) throw new Error("Não foi possível consultar as quantidades dos instrumentos.");
    for (const row of data ?? []) {
      const rows = byWork.get(row.work_id) ?? [];
      rows.push(row);
      byWork.set(row.work_id, rows);
    }
    if (!data || data.length < 500) break;
  }
  return [...byWork].filter(([, rows]) => matchesInstrumentation(rows, criteria)).map(([id]) => id);
}
