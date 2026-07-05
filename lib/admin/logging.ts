import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export async function insertAuditLog(
  supabase: SupabaseServerClient,
  actorUserId: string,
  action: string,
  entityType: string,
  entityId: string,
  metadata: Record<string, unknown> = {},
) {
  const { error } = await supabase.from("audit_logs").insert({
    actor_user_id: actorUserId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    metadata_json: metadata,
  });

  if (error) {
    throw new Error(`Erro ao registrar auditoria: ${error.message}`);
  }
}

export async function insertRevisionRows(
  supabase: SupabaseServerClient,
  actorUserId: string,
  entityType: string,
  entityId: string,
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
      entity_type: entityType,
      entity_id: entityId,
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

export function changedRows<T extends Record<string, unknown>>(
  previous: T,
  next: Partial<T>,
  fields: Array<keyof T>,
  reason: string,
) {
  return fields.flatMap((field) => {
    const previousValue = previous[field];
    const nextValue = next[field];

    if (JSON.stringify(previousValue) === JSON.stringify(nextValue)) {
      return [];
    }

    return [
      {
        field_name: String(field),
        previous_value: previousValue,
        new_value: nextValue,
        reason,
      },
    ];
  });
}
