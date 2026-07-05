"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { changedRows, insertAuditLog, insertRevisionRows } from "@/lib/admin/logging";
import { requireEditorialWriteAccess } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import {
  parseSourceHolderFormData,
  type SourceHolderFormValues,
} from "@/lib/validators/source-holder";

type SourceHolderRow = SourceHolderFormValues & {
  id: string;
};

const trackedFields: Array<keyof SourceHolderRow> = [
  "name",
  "type",
  "country",
  "state",
  "city",
  "address",
  "email",
  "phone",
  "website",
  "contact_person",
  "notes",
  "active",
];

export async function createSourceHolder(formData: FormData) {
  const { user } = await requireEditorialWriteAccess();
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

  await insertRevisionRows(supabase, user.id, "source_holder", data.id, [
    {
      field_name: "source_holder",
      previous_value: null,
      new_value: values,
      reason: "source_holder_created",
    },
  ]);
  await insertAuditLog(supabase, user.id, "source_holder.created", "source_holder", data.id, {
    name: values.name,
    type: values.type,
  });

  revalidatePath("/admin/fontes");
  redirect(`/admin/fontes/${data.id}/editar`);
}

export async function updateSourceHolder(sourceHolderId: string, formData: FormData) {
  const { user } = await requireEditorialWriteAccess();
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

  await insertRevisionRows(
    supabase,
    user.id,
    "source_holder",
    sourceHolderId,
    changedRows(previous as SourceHolderRow, values, trackedFields, "source_holder_updated"),
  );
  await insertAuditLog(supabase, user.id, "source_holder.updated", "source_holder", sourceHolderId, {
    name: values.name,
    type: values.type,
  });

  revalidatePath("/admin/fontes");
  revalidatePath(`/admin/fontes/${sourceHolderId}/editar`);
  redirect(`/admin/fontes/${sourceHolderId}/editar`);
}

export async function setSourceHolderActive(sourceHolderId: string, active: boolean) {
  const { user } = await requireEditorialWriteAccess();
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

  await insertRevisionRows(supabase, user.id, "source_holder", sourceHolderId, [
    {
      field_name: "active",
      previous_value: previous.active,
      new_value: active,
      reason: active ? "source_holder_activated" : "source_holder_deactivated",
    },
  ]);
  await insertAuditLog(
    supabase,
    user.id,
    active ? "source_holder.activated" : "source_holder.deactivated",
    "source_holder",
    sourceHolderId,
    { name: previous.name },
  );

  revalidatePath("/admin/fontes");
  revalidatePath(`/admin/fontes/${sourceHolderId}/editar`);
}
