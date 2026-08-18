import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/lib/supabase/database.types";

type AuditEvent = {
  actorId?: string | null;
  actorType?: "admin" | "system";
  eventType: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  metadata?: Json;
};

export const writeAuditLog = async (
  supabase: SupabaseClient<Database>,
  event: AuditEvent,
) => {
  const { error } = await supabase.from("audit_logs").insert({
    actor_id: event.actorId || null,
    actor_type: event.actorType || "system",
    event_type: event.eventType,
    entity_type: event.entityType,
    entity_id: event.entityId || null,
    summary: event.summary,
    metadata: event.metadata || {},
  });

  if (error) {
    console.error("Failed to write audit log", error.message);
  }
};
