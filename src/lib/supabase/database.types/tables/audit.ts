import type { Json } from "../shared";

export type AuditTables = {
  audit_logs: {
    Row: {
      id: string;
      actor_id: string | null;
      actor_type: string;
      event_type: string;
      entity_type: string;
      entity_id: string | null;
      summary: string;
      metadata: Json;
      created_at: string;
    };
    Insert: {
      id?: string;
      actor_id?: string | null;
      actor_type?: string;
      event_type: string;
      entity_type: string;
      entity_id?: string | null;
      summary: string;
      metadata?: Json;
      created_at?: string;
    };
    Update: {
      actor_id?: string | null;
      actor_type?: string;
      event_type?: string;
      entity_type?: string;
      entity_id?: string | null;
      summary?: string;
      metadata?: Json;
    };
    Relationships: [
      {
        foreignKeyName: "audit_logs_actor_id_fkey";
        columns: ["actor_id"];
        isOneToOne: false;
        referencedRelation: "profiles";
        referencedColumns: ["id"];
      },
    ];
  };
};
