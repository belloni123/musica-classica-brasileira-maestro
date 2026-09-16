"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireEditorialWriteAccess } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import {
  parseSourceHolderFormData,
} from "@/lib/validators/source-holder";

export async function createSourceHolder(formData: FormData) {
  await requireEditorialWriteAccess();
  const values = parseSourceHolderFormData(formData);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("source_holders")
    .insert(values)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(`Erro ao criar fonte/acervo: ${error?.message ?? "sem retorno"}`);
  }

  revalidatePath("/admin/fontes");
  redirect(`/admin/fontes/${data.id}/editar`);
}

export async function updateSourceHolder(sourceHolderId: string, formData: FormData) {
  await requireEditorialWriteAccess();
  const values = parseSourceHolderFormData(formData);
  const supabase = await createClient();
  const { data: previous, error: previousError } = await supabase
    .from("source_holders")
    .select("*")
    .eq("id", sourceHolderId)
    .single();

  if (previousError || !previous) {
    throw new Error(`Fonte/acervo nao encontrado: ${previousError?.message ?? "sem retorno"}`);
  }

  const { error } = await supabase.from("source_holders").update(values).eq("id", sourceHolderId);

  if (error) {
    throw new Error(`Erro ao atualizar fonte/acervo: ${error.message}`);
  }

  revalidatePath("/admin/fontes");
  revalidatePath(`/admin/fontes/${sourceHolderId}/editar`);
  redirect(`/admin/fontes/${sourceHolderId}/editar`);
}

export async function setSourceHolderActive(sourceHolderId: string, active: boolean) {
  await requireEditorialWriteAccess();
  const supabase = await createClient();
  const { data: previous, error: previousError } = await supabase
    .from("source_holders")
    .select("id,name,active")
    .eq("id", sourceHolderId)
    .single();

  if (previousError || !previous) {
    throw new Error(`Fonte/acervo nao encontrado: ${previousError?.message ?? "sem retorno"}`);
  }

  const { error } = await supabase
    .from("source_holders")
    .update({ active })
    .eq("id", sourceHolderId);

  if (error) {
    throw new Error(`Erro ao alterar status da fonte/acervo: ${error.message}`);
  }

  revalidatePath("/admin/fontes");
  revalidatePath(`/admin/fontes/${sourceHolderId}/editar`);
}
