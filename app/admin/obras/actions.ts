"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireEditorialWriteAccess } from "@/lib/auth/session";
import type { WorkSaveFeedback } from "@/components/forms/work-form";
import { slugify } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";
import { parseChoirVoices, parseWorkFormData } from "@/lib/validators/work";

async function saveWork(workId: string | null, formData: FormData) {
  await requireEditorialWriteAccess();
  const fields = parseWorkFormData(formData);
  const supabase = await createClient();
  const { data: savedId, error } = await supabase.rpc("save_editorial_work", {
    work_id: workId,
    fields,
    base_slug: slugify(fields.canonical_title) || "obra",
    choir_voices: parseChoirVoices(formData),
  });

  if (error || !savedId) {
    throw new Error(`Erro ao salvar obra: ${error?.message ?? "sem retorno"}`);
  }

  const editPath = `/admin/obras/${savedId}/editar`;
  revalidatePath("/admin/obras");
  revalidatePath(editPath);
  return { editPath };
}

export async function createWork(_previous: WorkSaveFeedback, formData: FormData): Promise<never> {
  const { editPath } = await saveWork(null, formData);
  redirect(editPath);
}

export async function updateWork(workId: string, _previous: WorkSaveFeedback, formData: FormData) {
  await saveWork(workId, formData);
  return { message: "Obra salva com sucesso." };
}

export async function publishWork(workId: string) {
  const { user } = await requireEditorialWriteAccess();
  const supabase = await createClient();
  const { data: previous, error: previousError } = await supabase
    .from("works")
    .select("id,publication_status,canonical_title")
    .eq("id", workId)
    .single();

  if (previousError || !previous) {
    throw new Error(`Obra nao encontrada: ${previousError?.message ?? "sem retorno"}`);
  }

  const { error } = await supabase
    .from("works")
    .update({ publication_status: "published", updated_by: user.id })
    .eq("id", workId);

  if (error) {
    throw new Error(`Erro ao publicar obra: ${error.message}`);
  }

  revalidatePath("/admin/obras");
  revalidatePath(`/admin/obras/${workId}/editar`);
}

export async function archiveWork(workId: string) {
  const { user } = await requireEditorialWriteAccess();
  const supabase = await createClient();
  const { data: previous, error: previousError } = await supabase
    .from("works")
    .select("id,publication_status,canonical_title")
    .eq("id", workId)
    .single();

  if (previousError || !previous) {
    throw new Error(`Obra nao encontrada: ${previousError?.message ?? "sem retorno"}`);
  }

  const { error } = await supabase
    .from("works")
    .update({ publication_status: "archived", updated_by: user.id })
    .eq("id", workId);

  if (error) {
    throw new Error(`Erro ao arquivar obra: ${error.message}`);
  }

  revalidatePath("/admin/obras");
  revalidatePath(`/admin/obras/${workId}/editar`);
}
