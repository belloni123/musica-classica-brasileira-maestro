"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buildComposerSlug } from "@/lib/slug";
import { requireEditorialWriteAccess } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { parseComposerFormData, type ComposerFormValues } from "@/lib/validators/composer";

const COMPOSER_PHOTO_BUCKET = "composer-photos";
const COMPOSER_PHOTO_MAX_SIZE = 5 * 1024 * 1024;
const COMPOSER_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function getComposerPhotoFile(formData: FormData, required: boolean) {
  const value = formData.get("photo");
  if (!value || typeof value === "string" || value.size === 0) {
    if (required) throw new Error("Adicione uma foto quadrada para o compositor.");
    return null;
  }

  if (!COMPOSER_PHOTO_TYPES.has(value.type)) {
    throw new Error("A foto deve estar em JPG, PNG ou WebP.");
  }
  if (formData.get("photo_crop_ready") !== "1") {
    throw new Error("Aguarde o recorte terminar antes de salvar a foto.");
  }
  if (value.size > COMPOSER_PHOTO_MAX_SIZE) {
    throw new Error("A foto deve ter no máximo 5 MB.");
  }

  return value;
}

async function uploadComposerPhoto(
  supabase: Awaited<ReturnType<typeof createClient>>,
  composerId: string,
  file: File,
) {
  const path = `composers/${composerId}.webp`;
  const { error } = await supabase.storage.from(COMPOSER_PHOTO_BUCKET).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: true,
  });

  if (error) throw new Error(`Erro ao salvar a foto do compositor: ${error.message}`);
  return path;
}

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

function toComposerUpdate(values: ComposerFormValues, slug: string, actorUserId: string): ComposerFormValues & {
  slug: string;
  updated_by: string;
  photo_path?: string;
} {
  return {
    ...values,
    slug,
    updated_by: actorUserId,
  };
}

export async function createComposer(formData: FormData) {
  const { user } = await requireEditorialWriteAccess();
  const photoFile = getComposerPhotoFile(formData, true);
  if (!photoFile) throw new Error("Adicione uma foto quadrada para o compositor.");
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

  const photoPath = await uploadComposerPhoto(supabase, data.id, photoFile);
  const { error: photoUpdateError } = await supabase
    .from("composers")
    .update({ photo_path: photoPath, updated_by: user.id })
    .eq("id", data.id);

  if (photoUpdateError) throw new Error(`Erro ao associar a foto ao compositor: ${photoUpdateError.message}`);

  revalidatePath("/admin/compositores");
  revalidatePath("/compositores");
  redirect(`/admin/compositores/${data.id}/editar`);
}

export async function updateComposer(composerId: string, formData: FormData) {
  const { user } = await requireEditorialWriteAccess();
  const photoFile = getComposerPhotoFile(formData, false);
  const values = parseComposerFormData(formData);
  const supabase = await createClient();

  const { data: previous, error: previousError } = await supabase.rpc("get_editorial_record", { entity: "composer", record_id: composerId });

  if (previousError || !previous) {
    throw new Error(`Compositor nao encontrado: ${previousError?.message ?? "sem retorno"}`);
  }

  const slug = await buildUniqueComposerSlug(supabase, values.canonical_name, composerId);
  const updatePayload = toComposerUpdate(values, slug, user.id);

  if (photoFile) {
    updatePayload.photo_path = await uploadComposerPhoto(supabase, composerId, photoFile);
  }

  const { error } = await supabase.from("composers").update(updatePayload).eq("id", composerId);

  if (error) {
    throw new Error(`Erro ao atualizar compositor: ${error.message}`);
  }

  revalidatePath("/admin/compositores");
  revalidatePath(`/admin/compositores/${composerId}/editar`);
  revalidatePath("/compositores");
  revalidatePath(`/compositores/${slug}`);
  redirect(`/admin/compositores/${composerId}/editar`);
}

export async function publishComposer(composerId: string) {
  const { user } = await requireEditorialWriteAccess();
  const supabase = await createClient();
  const { data: previous, error: previousError } = await supabase
    .from("composers")
    .select("id,publication_status,canonical_name,photo_path")
    .eq("id", composerId)
    .single();

  if (previousError || !previous) {
    throw new Error(`Compositor nao encontrado: ${previousError?.message ?? "sem retorno"}`);
  }
  if (!previous.photo_path) {
    throw new Error("Adicione uma foto ao compositor antes de publicar.");
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
