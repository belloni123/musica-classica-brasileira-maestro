"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireEditorialWriteAccess } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { parseReferenceFormData } from "@/lib/validators/reference";

export async function createReference(formData: FormData) {
  await requireEditorialWriteAccess();
  const values = parseReferenceFormData(formData);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bibliographic_references")
    .insert(values)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(`Erro ao criar referencia: ${error?.message ?? "sem retorno"}`);
  }

  revalidatePath("/admin/referencias");
  redirect(`/admin/referencias/${data.id}/editar`);
}

export async function updateReference(referenceId: string, formData: FormData) {
  await requireEditorialWriteAccess();
  const values = parseReferenceFormData(formData);
  const supabase = await createClient();
  const { data: previous, error: previousError } = await supabase
    .from("bibliographic_references")
    .select("*")
    .eq("id", referenceId)
    .single();

  if (previousError || !previous) {
    throw new Error(`Referencia nao encontrada: ${previousError?.message ?? "sem retorno"}`);
  }

  const { error } = await supabase
    .from("bibliographic_references")
    .update(values)
    .eq("id", referenceId);

  if (error) {
    throw new Error(`Erro ao atualizar referencia: ${error.message}`);
  }

  revalidatePath("/admin/referencias");
  revalidatePath(`/admin/referencias/${referenceId}/editar`);
  redirect(`/admin/referencias/${referenceId}/editar`);
}
