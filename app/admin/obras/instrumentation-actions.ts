"use server";

import { revalidatePath } from "next/cache";
import { insertAuditLog, insertRevisionRows } from "@/lib/admin/logging";
import { requireEditorialWriteAccess } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { parseWorkInstrumentationFormData } from "@/lib/validators/work-instrumentation";

export async function addWorkInstrumentation(workId: string, formData: FormData) {
  const { user } = await requireEditorialWriteAccess();
  const values = parseWorkInstrumentationFormData(formData);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("work_instrumentation")
    .insert({
      work_id: workId,
      ...values,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(`Erro ao adicionar instrumentacao: ${error?.message ?? "sem retorno"}`);
  }

  await insertRevisionRows(supabase, user.id, "work_instrumentation", data.id, [
    {
      field_name: "work_instrumentation",
      previous_value: null,
      new_value: { work_id: workId, ...values },
      reason: "work_instrumentation_created",
    },
  ]);
  await insertAuditLog(
    supabase,
    user.id,
    "work_instrumentation.created",
    "work_instrumentation",
    data.id,
    { work_id: workId, instrument_id: values.instrument_id },
  );

  revalidatePath(`/admin/obras/${workId}/editar`);
}

export async function removeWorkInstrumentation(workId: string, rowId: string) {
  const { user } = await requireEditorialWriteAccess();
  const supabase = await createClient();
  const { data: previous, error: previousError } = await supabase
    .from("work_instrumentation")
    .select("*")
    .eq("id", rowId)
    .eq("work_id", workId)
    .single();

  if (previousError || !previous) {
    throw new Error(`Instrumentacao nao encontrada: ${previousError?.message ?? "sem retorno"}`);
  }

  const { error } = await supabase.from("work_instrumentation").delete().eq("id", rowId);

  if (error) {
    throw new Error(`Erro ao remover instrumentacao: ${error.message}`);
  }

  await insertRevisionRows(supabase, user.id, "work_instrumentation", rowId, [
    {
      field_name: "work_instrumentation",
      previous_value: previous,
      new_value: null,
      reason: "work_instrumentation_removed",
    },
  ]);
  await insertAuditLog(
    supabase,
    user.id,
    "work_instrumentation.removed",
    "work_instrumentation",
    rowId,
    { work_id: workId, instrument_id: previous.instrument_id },
  );

  revalidatePath(`/admin/obras/${workId}/editar`);
}
