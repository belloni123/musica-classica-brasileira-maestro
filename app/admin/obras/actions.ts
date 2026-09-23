"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireEditorialWriteAccess } from "@/lib/auth/session";
import { slugify } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";
import { parseChoirVoices, parseWorkFormData } from "@/lib/validators/work";

async function syncChoirVoices(supabase: Awaited<ReturnType<typeof createClient>>, workId: string, voices: string[]) {
  const { data: existing, error } = await supabase.from("voice_requirements")
    .select("id,voice").eq("work_id", workId).eq("type", "choir");
  if (error) throw new Error(`Erro ao consultar vozes do coro: ${error.message}`);
  const toDelete = (existing ?? []).filter(row => !voices.includes(row.voice ?? "")).map(row => row.id);
  if (toDelete.length) {
    const { error: deleteError } = await supabase.from("voice_requirements").delete().in("id", toDelete);
    if (deleteError) throw new Error(`Erro ao atualizar vozes do coro: ${deleteError.message}`);
  }
  const existingVoices = new Set((existing ?? []).map(row => row.voice));
  const toInsert = voices.filter(voice => !existingVoices.has(voice)).map(voice => ({ work_id: workId, type: "choir", voice }));
  if (toInsert.length) {
    const { error: insertError } = await supabase.from("voice_requirements").insert(toInsert);
    if (insertError) throw new Error(`Erro ao salvar vozes do coro: ${insertError.message}`);
  }
}

async function buildUniqueWorkSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  title: string,
  ignoredWorkId?: string,
) {
  const baseSlug = slugify(title) || "obra";
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    let query = supabase.from("works").select("id").eq("slug", candidate).limit(1);
    if (ignoredWorkId) query = query.neq("id", ignoredWorkId);
    const { data, error } = await query;
    if (error) throw new Error(`Erro ao validar slug da obra: ${error.message}`);
    if (!data || data.length === 0) return candidate;
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export async function createWork(formData: FormData) {
  const { user } = await requireEditorialWriteAccess();
  const values = parseWorkFormData(formData);
  const choirVoices = parseChoirVoices(formData);
  const supabase = await createClient();
  const slug = await buildUniqueWorkSlug(supabase, values.canonical_title);
  const payload = {
    ...values,
    slug,
    publication_status: "draft",
    created_by: user.id,
    updated_by: user.id,
  };
  const { data, error } = await supabase.from("works").insert(payload).select("id").single();

  if (error || !data) {
    throw new Error(`Erro ao criar obra: ${error?.message ?? "sem retorno"}`);
  }

  await syncChoirVoices(supabase, data.id, choirVoices);

  revalidatePath("/admin/obras");
  redirect(`/admin/obras/${data.id}/editar`);
}

export async function updateWork(workId: string, formData: FormData) {
  const { user } = await requireEditorialWriteAccess();
  const values = parseWorkFormData(formData);
  const choirVoices = parseChoirVoices(formData);
  const supabase = await createClient();
  const { data: previous, error: previousError } = await supabase.rpc("get_editorial_record", { entity: "work", record_id: workId });

  if (previousError || !previous) {
    throw new Error(`Obra nao encontrada: ${previousError?.message ?? "sem retorno"}`);
  }

  const slug = await buildUniqueWorkSlug(supabase, values.canonical_title, workId);
  const payload = {
    composer_id: values.composer_id,
    canonical_title: values.canonical_title,
    display_title: values.display_title,
    composition_year_start: values.composition_year_start,
    composition_year_end: null,
    duration_minutes: values.duration_minutes,
    formation_type: values.formation_type ?? previous.formation_type ?? null,
    soloist_type: values.soloist_type,
    has_soloist: values.has_soloist,
    has_choir: values.has_choir,
    main_source: values.main_source,
    performance_notes: values.performance_notes,
    slug,
    updated_by: user.id,
  };
  const { error } = await supabase.from("works").update(payload).eq("id", workId);

  if (error) {
    throw new Error(`Erro ao atualizar obra: ${error.message}`);
  }

  await syncChoirVoices(supabase, workId, choirVoices);

  revalidatePath("/admin/obras");
  revalidatePath(`/admin/obras/${workId}/editar`);
  redirect(`/admin/obras/${workId}/editar`);
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
