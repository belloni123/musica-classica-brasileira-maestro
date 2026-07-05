"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { changedRows, insertAuditLog, insertRevisionRows } from "@/lib/admin/logging";
import { requireEditorialWriteAccess } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { parseReferenceFormData, type ReferenceFormValues } from "@/lib/validators/reference";

type ReferenceRow = ReferenceFormValues & {
  id: string;
};

const trackedFields: Array<keyof ReferenceRow> = [
  "type",
  "author",
  "title",
  "year",
  "publisher",
  "institution",
  "place",
  "doi",
  "url",
  "accessed_at",
  "notes",
];

export async function createReference(formData: FormData) {
  const { user } = await requireEditorialWriteAccess();
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

  await insertRevisionRows(supabase, user.id, "bibliographic_reference", data.id, [
    {
      field_name: "bibliographic_reference",
      previous_value: null,
      new_value: values,
      reason: "reference_created",
    },
  ]);
  await insertAuditLog(
    supabase,
    user.id,
    "reference.created",
    "bibliographic_reference",
    data.id,
    { title: values.title, type: values.type },
  );

  revalidatePath("/admin/referencias");
  redirect(`/admin/referencias/${data.id}/editar`);
}

export async function updateReference(referenceId: string, formData: FormData) {
  const { user } = await requireEditorialWriteAccess();
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

  await insertRevisionRows(
    supabase,
    user.id,
    "bibliographic_reference",
    referenceId,
    changedRows(previous as ReferenceRow, values, trackedFields, "reference_updated"),
  );
  await insertAuditLog(
    supabase,
    user.id,
    "reference.updated",
    "bibliographic_reference",
    referenceId,
    { title: values.title, type: values.type },
  );

  revalidatePath("/admin/referencias");
  revalidatePath(`/admin/referencias/${referenceId}/editar`);
  redirect(`/admin/referencias/${referenceId}/editar`);
}
