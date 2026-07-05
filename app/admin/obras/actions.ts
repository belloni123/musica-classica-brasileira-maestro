"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { changedRows, insertAuditLog, insertRevisionRows } from "@/lib/admin/logging";
import { requireEditorialWriteAccess } from "@/lib/auth/session";
import { slugify } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";
import { parseWorkFormData, type WorkFormValues } from "@/lib/validators/work";

type WorkRow = WorkFormValues & {
  id: string;
  slug: string;
  publication_status: string;
};

const trackedFields: Array<keyof WorkRow> = [
  "composer_id",
  "canonical_title",
  "display_title",
  "alternative_titles",
  "original_title",
  "translated_title",
  "composition_year_start",
  "composition_year_end",
  "composition_date_text",
  "revision_year",
  "opus",
  "catalog",
  "catalog_number",
  "duration_minutes",
  "duration_minimum",
  "duration_maximum",
  "formation_type",
  "difficulty_level",
  "has_choir",
  "has_soloist",
  "has_electronics",
  "has_brazilian_instruments",
  "educational_work",
  "youth_work",
  "public_domain",
  "rights_status",
  "work_status",
  "public_summary",
  "subscriber_notes",
  "performance_notes",
  "editorial_notes",
  "main_source",
  "instrumentation_text",
  "reliability_level",
  "slug",
];

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

  await insertRevisionRows(supabase, user.id, "work", data.id, [
    {
      field_name: "work",
      previous_value: null,
      new_value: payload,
      reason: "work_created",
    },
  ]);
  await insertAuditLog(supabase, user.id, "work.created", "work", data.id, {
    canonical_title: values.canonical_title,
    slug,
  });

  revalidatePath("/admin/obras");
  redirect(`/admin/obras/${data.id}/editar`);
}

export async function updateWork(workId: string, formData: FormData) {
  const { user } = await requireEditorialWriteAccess();
  const values = parseWorkFormData(formData);
  const supabase = await createClient();
  const { data: previous, error: previousError } = await supabase
    .from("works")
    .select("*")
    .eq("id", workId)
    .single();

  if (previousError || !previous) {
    throw new Error(`Obra nao encontrada: ${previousError?.message ?? "sem retorno"}`);
  }

  const slug = await buildUniqueWorkSlug(supabase, values.canonical_title, workId);
  const payload = { ...values, slug, updated_by: user.id };
  const { error } = await supabase.from("works").update(payload).eq("id", workId);

  if (error) {
    throw new Error(`Erro ao atualizar obra: ${error.message}`);
  }

  await insertRevisionRows(
    supabase,
    user.id,
    "work",
    workId,
    changedRows(previous as WorkRow, payload, trackedFields, "work_updated"),
  );
  await insertAuditLog(supabase, user.id, "work.updated", "work", workId, {
    canonical_title: values.canonical_title,
    slug,
  });

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

  await insertRevisionRows(supabase, user.id, "work", workId, [
    {
      field_name: "publication_status",
      previous_value: previous.publication_status,
      new_value: "published",
      reason: "work_published",
    },
  ]);
  await insertAuditLog(supabase, user.id, "work.published", "work", workId, {
    canonical_title: previous.canonical_title,
  });

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

  await insertRevisionRows(supabase, user.id, "work", workId, [
    {
      field_name: "publication_status",
      previous_value: previous.publication_status,
      new_value: "archived",
      reason: "work_archived",
    },
  ]);
  await insertAuditLog(supabase, user.id, "work.archived", "work", workId, {
    canonical_title: previous.canonical_title,
  });

  revalidatePath("/admin/obras");
  revalidatePath(`/admin/obras/${workId}/editar`);
}
