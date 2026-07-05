"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buildComposerSlug } from "@/lib/slug";
import { requireEditorialWriteAccess } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { parseComposerFormData, type ComposerFormValues } from "@/lib/validators/composer";

type ComposerRow = {
  id: string;
  canonical_name: string;
  display_name: string;
  surname: string | null;
  alternative_names: string[];
  pseudonyms: string[];
  birth_date: string | null;
  death_date: string | null;
  birth_year: number | null;
  death_year: number | null;
  birth_city: string | null;
  birth_state: string | null;
  birth_country: string | null;
  death_city: string | null;
  death_state: string | null;
  nationality: string | null;
  gender: string | null;
  ethnicity_identity: string | null;
  brazil_region: string | null;
  short_biography: string | null;
  long_biography: string | null;
  biography_source: string | null;
  official_website: string | null;
  notes: string | null;
  reliability_level: string;
  publication_status: string;
  slug: string;
};

const trackedComposerFields: Array<keyof ComposerFormValues | "slug"> = [
  "canonical_name",
  "display_name",
  "surname",
  "alternative_names",
  "pseudonyms",
  "birth_date",
  "death_date",
  "birth_year",
  "death_year",
  "birth_city",
  "birth_state",
  "birth_country",
  "death_city",
  "death_state",
  "nationality",
  "gender",
  "ethnicity_identity",
  "brazil_region",
  "short_biography",
  "long_biography",
  "biography_source",
  "official_website",
  "notes",
  "reliability_level",
  "slug",
];

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

async function insertAuditLog(
  supabase: Awaited<ReturnType<typeof createClient>>,
  actorUserId: string,
  action: string,
  entityId: string,
  metadata: Record<string, unknown> = {},
) {
  const { error } = await supabase.from("audit_logs").insert({
    actor_user_id: actorUserId,
    action,
    entity_type: "composer",
    entity_id: entityId,
    metadata_json: metadata,
  });

  if (error) {
    throw new Error(`Erro ao registrar auditoria: ${error.message}`);
  }
}

async function insertRevisionRows(
  supabase: Awaited<ReturnType<typeof createClient>>,
  actorUserId: string,
  composerId: string,
  rows: Array<{
    field_name: string;
    previous_value: unknown;
    new_value: unknown;
    reason: string;
  }>,
) {
  if (rows.length === 0) {
    return;
  }

  const { error } = await supabase.from("revision_history").insert(
    rows.map((row) => ({
      entity_type: "composer",
      entity_id: composerId,
      field_name: row.field_name,
      previous_value: row.previous_value === undefined ? null : row.previous_value,
      new_value: row.new_value === undefined ? null : row.new_value,
      reason: row.reason,
      user_id: actorUserId,
      status: "recorded",
    })),
  );

  if (error) {
    throw new Error(`Erro ao registrar historico editorial: ${error.message}`);
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

function changedRevisionRows(
  previous: ComposerRow,
  next: Partial<ComposerRow>,
  reason: string,
) {
  return trackedComposerFields.flatMap((field) => {
    const previousValue = previous[field as keyof ComposerRow];
    const nextValue = next[field as keyof ComposerRow];

    if (JSON.stringify(previousValue) === JSON.stringify(nextValue)) {
      return [];
    }

    return [
      {
        field_name: field,
        previous_value: previousValue,
        new_value: nextValue,
        reason,
      },
    ];
  });
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

  await insertRevisionRows(supabase, user.id, data.id, [
    {
      field_name: "composer",
      previous_value: null,
      new_value: { ...values, slug, publication_status: "draft" },
      reason: "composer_created",
    },
  ]);
  await insertAuditLog(supabase, user.id, "composer.created", data.id, {
    slug,
    canonical_name: values.canonical_name,
  });

  revalidatePath("/admin/compositores");
  redirect(`/admin/compositores/${data.id}/editar`);
}

export async function updateComposer(composerId: string, formData: FormData) {
  const { user } = await requireEditorialWriteAccess();
  const values = parseComposerFormData(formData);
  const supabase = await createClient();

  const { data: previous, error: previousError } = await supabase
    .from("composers")
    .select("*")
    .eq("id", composerId)
    .single();

  if (previousError || !previous) {
    throw new Error(`Compositor nao encontrado: ${previousError?.message ?? "sem retorno"}`);
  }

  const slug = await buildUniqueComposerSlug(supabase, values.canonical_name, composerId);
  const updatePayload = toComposerUpdate(values, slug, user.id);

  const { error } = await supabase.from("composers").update(updatePayload).eq("id", composerId);

  if (error) {
    throw new Error(`Erro ao atualizar compositor: ${error.message}`);
  }

  await insertRevisionRows(
    supabase,
    user.id,
    composerId,
    changedRevisionRows(previous as ComposerRow, updatePayload, "composer_updated"),
  );
  await insertAuditLog(supabase, user.id, "composer.updated", composerId, {
    slug,
    canonical_name: values.canonical_name,
  });

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

  await insertRevisionRows(supabase, user.id, composerId, [
    {
      field_name: "publication_status",
      previous_value: previous.publication_status,
      new_value: "published",
      reason: "composer_published",
    },
  ]);
  await insertAuditLog(supabase, user.id, "composer.published", composerId, {
    canonical_name: previous.canonical_name,
  });

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

  await insertRevisionRows(supabase, user.id, composerId, [
    {
      field_name: "publication_status",
      previous_value: previous.publication_status,
      new_value: "archived",
      reason: "composer_archived",
    },
  ]);
  await insertAuditLog(supabase, user.id, "composer.archived", composerId, {
    canonical_name: previous.canonical_name,
  });

  revalidatePath("/admin/compositores");
  revalidatePath(`/admin/compositores/${composerId}/editar`);
}
