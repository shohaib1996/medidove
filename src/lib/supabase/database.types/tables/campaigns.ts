import type { AppointmentStatus, Channel, Json, LeadStatus, UserRole } from "../shared";

export type CampaignTables = {
  campaigns: {
    Row: {
      id: string;
      name: string;
      campaign_type: string;
      audience: string;
      channel: Channel;
      goal: string | null;
      message: string;
      ai_recommendation: string | null;
      status: string;
      recipient_count: number;
      queued_at: string | null;
      created_by: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      name: string;
      campaign_type: string;
      audience: string;
      channel: Channel;
      goal?: string | null;
      message: string;
      ai_recommendation?: string | null;
      status?: string;
      recipient_count?: number;
      queued_at?: string | null;
      created_by?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      name?: string;
      campaign_type?: string;
      audience?: string;
      channel?: Channel;
      goal?: string | null;
      message?: string;
      ai_recommendation?: string | null;
      status?: string;
      recipient_count?: number;
      queued_at?: string | null;
      created_by?: string | null;
      updated_at?: string;
    };
    Relationships: [
      {
        foreignKeyName: "campaigns_created_by_fkey";
        columns: ["created_by"];
        isOneToOne: false;
        referencedRelation: "profiles";
        referencedColumns: ["id"];
      },
    ];
  };
  campaign_recipients: {
    Row: {
      id: string;
      campaign_id: string;
      patient_id: string | null;
      recipient_name: string | null;
      recipient_phone: string | null;
      recipient_email: string | null;
      status: string;
      provider_message_id: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      campaign_id: string;
      patient_id?: string | null;
      recipient_name?: string | null;
      recipient_phone?: string | null;
      recipient_email?: string | null;
      status?: string;
      provider_message_id?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      campaign_id?: string;
      patient_id?: string | null;
      recipient_name?: string | null;
      recipient_phone?: string | null;
      recipient_email?: string | null;
      status?: string;
      provider_message_id?: string | null;
      updated_at?: string;
    };
    Relationships: [
      {
        foreignKeyName: "campaign_recipients_campaign_id_fkey";
        columns: ["campaign_id"];
        isOneToOne: false;
        referencedRelation: "campaigns";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "campaign_recipients_patient_id_fkey";
        columns: ["patient_id"];
        isOneToOne: false;
        referencedRelation: "profiles";
        referencedColumns: ["id"];
      },
    ];
  };
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
