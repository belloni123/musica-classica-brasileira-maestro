"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireEditorialWriteAccess } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import {
  parseInstrumentFormData,
} from "@/lib/validators/instrument";

async function getFamilyName(supabase: Awaited<ReturnType<typeof createClient>>, familyId: string | null) {
  if (!familyId) {
    return "";
  }

  const { data, error } = await supabase
    .from("instrument_families")
    .select("name")
    .eq("id", familyId)
    .single();

  if (error || !data) {
    throw new Error(`Familia instrumental nao encontrada: ${error?.message ?? "sem retorno"}`);
  }

  return data.name as string;
}

async function parsePayload(supabase: Awaited<ReturnType<typeof createClient>>, formData: FormData) {
  const familyId = formData.get("family_id");
  const family = await getFamilyName(supabase, typeof familyId === "string" ? familyId : null);
  const values = parseInstrumentFormData(formData, family);

  return {
    ...values,
    family,
  };
}

export async function createInstrument(formData: FormData) {
  await requireEditorialWriteAccess();
  const supabase = await createClient();
  const payload = await parsePayload(supabase, formData);

  const { data, error } = await supabase
    .from("instruments")
    .insert(payload)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(`Erro ao criar instrumento: ${error?.message ?? "sem retorno"}`);
  }

  revalidatePath("/admin/instrumentos");
  redirect(`/admin/instrumentos/${data.id}/editar`);
}

export async function updateInstrument(instrumentId: string, formData: FormData) {
  await requireEditorialWriteAccess();
  const supabase = await createClient();
  const payload = await parsePayload(supabase, formData);
  const { data: previous, error: previousError } = await supabase
    .from("instruments")
    .select("*")
    .eq("id", instrumentId)
    .single();

  if (previousError || !previous) {
    throw new Error(`Instrumento nao encontrado: ${previousError?.message ?? "sem retorno"}`);
  }

  const { error } = await supabase.from("instruments").update(payload).eq("id", instrumentId);

  if (error) {
    throw new Error(`Erro ao atualizar instrumento: ${error.message}`);
  }

  revalidatePath("/admin/instrumentos");
  revalidatePath(`/admin/instrumentos/${instrumentId}/editar`);
  redirect(`/admin/instrumentos/${instrumentId}/editar`);
}

export async function setInstrumentActive(instrumentId: string, active: boolean) {
  await requireEditorialWriteAccess();
  const supabase = await createClient();
  const { data: previous, error: previousError } = await supabase
    .from("instruments")
    .select("id,name,active")
    .eq("id", instrumentId)
    .single();

  if (previousError || !previous) {
    throw new Error(`Instrumento nao encontrado: ${previousError?.message ?? "sem retorno"}`);
  }

  const { error } = await supabase.from("instruments").update({ active }).eq("id", instrumentId);

  if (error) {
    throw new Error(`Erro ao alterar status do instrumento: ${error.message}`);
  }

  revalidatePath("/admin/instrumentos");
  revalidatePath(`/admin/instrumentos/${instrumentId}/editar`);
}
