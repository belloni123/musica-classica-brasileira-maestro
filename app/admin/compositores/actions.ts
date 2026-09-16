"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buildComposerSlug } from "@/lib/slug";
import { requireEditorialWriteAccess } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { parseComposerFormData, type ComposerFormValues } from "@/lib/validators/composer";

async function buildUniqueComposerSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  canonicalName: string,
  ignoredComposerId?: string,
) {
  const baseSlug = buildComposerSlug(canonicalName) || "compositor";
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    let query = supabase.from("composers").select("id").eq("slug", candidate).limit(1);

    if (ignoredComposerId) {
      query = query.neq("id", ignoredComposerId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Erro ao validar slug do compositor: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return candidate;
    }

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

function toComposerInsert(values: ComposerFormValues, slug: string, actorUserId: string) {
  return {
    ...values,
    slug,
    publication_status: "draft",
    created_by: actorUserId,
    updated_by: actorUserId,
  };
}

function toComposerUpdate(values: ComposerFormValues, slug: string, actorUserId: string) {
  return {
    ...values,
    slug,
    updated_by: actorUserId,
  };
}

export async function createComposer(formData: FormData) {
  const { user } = await requireEditorialWriteAccess();
  const values = parseComposerFormData(formData);
  const supabase = await createClient();
  const slug = await buildUniqueComposerSlug(supabase, values.canonical_name);

  const { data, error } = await supabase
    .from("composers")
    .insert(toComposerInsert(values, slug, user.id))
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(`Erro ao criar compositor: ${error?.message ?? "sem retorno"}`);
  }

  revalidatePath("/admin/compositores");
  redirect(`/admin/compositores/${data.id}/editar`);
}

export async function updateComposer(composerId: string, formData: FormData) {
  const { user } = await requireEditorialWriteAccess();
  const values = parseComposerFormData(formData);
  const supabase = await createClient();

  const { data: previous, error: previousError } = await supabase.rpc("get_editorial_record", { entity: "composer", record_id: composerId });

  if (previousError || !previous) {
    throw new Error(`Compositor nao encontrado: ${previousError?.message ?? "sem retorno"}`);
  }

  const slug = await buildUniqueComposerSlug(supabase, values.canonical_name, composerId);
  const updatePayload = toComposerUpdate(values, slug, user.id);

  const { error } = await supabase.from("composers").update(updatePayload).eq("id", composerId);

  if (error) {
    throw new Error(`Erro ao atualizar compositor: ${error.message}`);
  }

  revalidatePath("/admin/compositores");
  revalidatePath(`/admin/compositores/${composerId}/editar`);
  redirect(`/admin/compositores/${composerId}/editar`);
}

export async function publishComposer(composerId: string) {
  const { user } = await requireEditorialWriteAccess();
  const supabase = await createClient();
  const { data: previous, error: previousError } = await supabase
    .from("composers")
    .select("id,publication_status,canonical_name")
    .eq("id", composerId)
    .single();

  if (previousError || !previous) {
    throw new Error(`Compositor nao encontrado: ${previousError?.message ?? "sem retorno"}`);
  }

  const { error } = await supabase
    .from("composers")
    .update({ publication_status: "published", updated_by: user.id })
    .eq("id", composerId);

  if (error) {
    throw new Error(`Erro ao publicar compositor: ${error.message}`);
  }

  revalidatePath("/admin/compositores");
  revalidatePath(`/admin/compositores/${composerId}/editar`);
}

export async function archiveComposer(composerId: string) {
  const { user } = await requireEditorialWriteAccess();
  const supabase = await createClient();
  const { data: previous, error: previousError } = await supabase
    .from("composers")
    .select("id,publication_status,canonical_name")
    .eq("id", composerId)
    .single();

  if (previousError || !previous) {
    throw new Error(`Compositor nao encontrado: ${previousError?.message ?? "sem retorno"}`);
  }

  const { error } = await supabase
    .from("composers")
    .update({ publication_status: "archived", updated_by: user.id })
    .eq("id", composerId);

  if (error) {
    throw new Error(`Erro ao arquivar compositor: ${error.message}`);
  }

  revalidatePath("/admin/compositores");
  revalidatePath(`/admin/compositores/${composerId}/editar`);
}
