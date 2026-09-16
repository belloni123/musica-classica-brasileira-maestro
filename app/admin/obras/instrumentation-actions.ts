"use server";

import { revalidatePath } from "next/cache";
import { requireEditorialWriteAccess } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { parseWorkInstrumentationFormData } from "@/lib/validators/work-instrumentation";

export async function addWorkInstrumentation(workId: string, formData: FormData) {
  await requireEditorialWriteAccess();
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

  revalidatePath(`/admin/obras/${workId}/editar`);
}

export async function removeWorkInstrumentation(workId: string, rowId: string) {
  await requireEditorialWriteAccess();
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

  revalidatePath(`/admin/obras/${workId}/editar`);
}
