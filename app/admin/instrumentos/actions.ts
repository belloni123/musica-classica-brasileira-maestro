"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { changedRows, insertAuditLog, insertRevisionRows } from "@/lib/admin/logging";
import { requireEditorialWriteAccess } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import {
  parseInstrumentFormData,
  type InstrumentFormValues,
} from "@/lib/validators/instrument";

type InstrumentRow = InstrumentFormValues & {
  id: string;
};

const trackedFields: Array<keyof InstrumentRow> = [
  "name",
  "plural_name",
  "abbreviation",
  "family",
  "family_id",
  "subfamily",
  "alternative_names",
  "is_brazilian_instrument",
  "active",
  "display_order",
  "notes",
];

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
  const values = parseInstrumentFormData(formData);
  const family = await getFamilyName(supabase, values.family_id);

  return {
    ...values,
    family,
  };
}

export async function createInstrument(formData: FormData) {
  const { user } = await requireEditorialWriteAccess();
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

  await insertRevisionRows(supabase, user.id, "instrument", data.id, [
    {
      field_name: "instrument",
      previous_value: null,
      new_value: payload,
      reason: "instrument_created",
    },
  ]);
  await insertAuditLog(supabase, user.id, "instrument.created", "instrument", data.id, {
    name: payload.name,
  });

  revalidatePath("/admin/instrumentos");
  redirect(`/admin/instrumentos/${data.id}/editar`);
}

export async function updateInstrument(instrumentId: string, formData: FormData) {
  const { user } = await requireEditorialWriteAccess();
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

  await insertRevisionRows(
    supabase,
    user.id,
    "instrument",
    instrumentId,
    changedRows(previous as InstrumentRow, payload, trackedFields, "instrument_updated"),
  );
  await insertAuditLog(supabase, user.id, "instrument.updated", "instrument", instrumentId, {
    name: payload.name,
  });

  revalidatePath("/admin/instrumentos");
  revalidatePath(`/admin/instrumentos/${instrumentId}/editar`);
  redirect(`/admin/instrumentos/${instrumentId}/editar`);
}

export async function setInstrumentActive(instrumentId: string, active: boolean) {
  const { user } = await requireEditorialWriteAccess();
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

  await insertRevisionRows(supabase, user.id, "instrument", instrumentId, [
    {
      field_name: "active",
      previous_value: previous.active,
      new_value: active,
      reason: active ? "instrument_activated" : "instrument_deactivated",
    },
  ]);
  await insertAuditLog(
    supabase,
    user.id,
    active ? "instrument.activated" : "instrument.deactivated",
    "instrument",
    instrumentId,
    { name: previous.name },
  );

  revalidatePath("/admin/instrumentos");
  revalidatePath(`/admin/instrumentos/${instrumentId}/editar`);
}
