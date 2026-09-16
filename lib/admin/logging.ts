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
