"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { changedRows, insertAuditLog, insertRevisionRows } from "@/lib/admin/logging";
import { requireEditorialWriteAccess } from "@/lib/auth/session";
import { slugify } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";
import { parseTaxonomyFormData, type TaxonomyFormValues } from "@/lib/validators/taxonomy";

type TaxonomyRow = Omit<TaxonomyFormValues, "slug"> & {
  id: string;
  slug: string;
};

const trackedFields: Array<keyof TaxonomyRow> = ["name", "type", "slug", "description"];

async function buildUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  name: string,
  slugValue: string | null,
  ignoredTaxonomyId?: string,
) {
  const baseSlug = slugify(slugValue || name) || "taxonomia";
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    let query = supabase.from("taxonomies").select("id").eq("slug", candidate).limit(1);
    if (ignoredTaxonomyId) query = query.neq("id", ignoredTaxonomyId);
    const { data, error } = await query;
    if (error) throw new Error(`Erro ao validar slug: ${error.message}`);
    if (!data || data.length === 0) return candidate;
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export async function createTaxonomy(formData: FormData) {
  const { user } = await requireEditorialWriteAccess();
  const values = parseTaxonomyFormData(formData);
  const supabase = await createClient();
  const slug = await buildUniqueSlug(supabase, values.name, values.slug);
  const payload = { ...values, slug };
  const { data, error } = await supabase.from("taxonomies").insert(payload).select("id").single();

  if (error || !data) {
    throw new Error(`Erro ao criar taxonomia: ${error?.message ?? "sem retorno"}`);
  }

  await insertRevisionRows(supabase, user.id, "taxonomy", data.id, [
    {
      field_name: "taxonomy",
      previous_value: null,
      new_value: payload,
      reason: "taxonomy_created",
    },
  ]);
  await insertAuditLog(supabase, user.id, "taxonomy.created", "taxonomy", data.id, {
    name: values.name,
    type: values.type,
    slug,
  });

  revalidatePath("/admin/taxonomias");
  redirect(`/admin/taxonomias/${data.id}/editar`);
}

export async function updateTaxonomy(taxonomyId: string, formData: FormData) {
  const { user } = await requireEditorialWriteAccess();
  const values = parseTaxonomyFormData(formData);
  const supabase = await createClient();
  const { data: previous, error: previousError } = await supabase
    .from("taxonomies")
    .select("*")
    .eq("id", taxonomyId)
    .single();

  if (previousError || !previous) {
    throw new Error(`Taxonomia nao encontrada: ${previousError?.message ?? "sem retorno"}`);
  }

  const slug = await buildUniqueSlug(supabase, values.name, values.slug, taxonomyId);
  const payload = { ...values, slug };
  const { error } = await supabase.from("taxonomies").update(payload).eq("id", taxonomyId);

  if (error) {
    throw new Error(`Erro ao atualizar taxonomia: ${error.message}`);
  }

  await insertRevisionRows(
    supabase,
    user.id,
    "taxonomy",
    taxonomyId,
    changedRows(previous as TaxonomyRow, payload, trackedFields, "taxonomy_updated"),
  );
  await insertAuditLog(supabase, user.id, "taxonomy.updated", "taxonomy", taxonomyId, {
    name: values.name,
    type: values.type,
    slug,
  });

  revalidatePath("/admin/taxonomias");
  revalidatePath(`/admin/taxonomias/${taxonomyId}/editar`);
  redirect(`/admin/taxonomias/${taxonomyId}/editar`);
}
