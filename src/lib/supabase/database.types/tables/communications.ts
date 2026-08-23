import type { AppointmentStatus, Channel, Json, LeadStatus, UserRole } from "../shared";

export type CommunicationTables = {
  call_logs: {
    Row: {
      id: string;
      appointment_id: string | null;
      phone_number: string;
      direction: "inbound" | "outbound";
      provider: string;
      provider_call_id: string | null;
      transcript: string | null;
      ai_summary: string | null;
      status: string | null;
      started_at: string | null;
      ended_at: string | null;
      created_at: string;
    };
    Insert: {
      id?: string;
      appointment_id?: string | null;
      phone_number: string;
      direction: "inbound" | "outbound";
      provider?: string;
      provider_call_id?: string | null;
      transcript?: string | null;
      ai_summary?: string | null;
      status?: string | null;
      started_at?: string | null;
      ended_at?: string | null;
      created_at?: string;
    };
    Update: {
      appointment_id?: string | null;
      phone_number?: string;
      direction?: "inbound" | "outbound";
      provider?: string;
      provider_call_id?: string | null;
      transcript?: string | null;
      ai_summary?: string | null;
      status?: string | null;
      started_at?: string | null;
      ended_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "call_logs_appointment_id_fkey";
        columns: ["appointment_id"];
        isOneToOne: false;
        referencedRelation: "appointments";
        referencedColumns: ["id"];
      },
    ];
  };
  whatsapp_messages: {
    Row: {
      id: string;
      appointment_id: string | null;
      phone_number: string;
      direction: "inbound" | "outbound";
      message: string;
      provider_message_id: string | null;
      status: string | null;
      created_at: string;
    };
    Insert: {
      id?: string;
      appointment_id?: string | null;
      phone_number: string;
      direction: "inbound" | "outbound";
      message: string;
      provider_message_id?: string | null;
      status?: string | null;
      created_at?: string;
    };
    Update: {
      appointment_id?: string | null;
      phone_number?: string;
      direction?: "inbound" | "outbound";
      message?: string;
      provider_message_id?: string | null;
      status?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "whatsapp_messages_appointment_id_fkey";
        columns: ["appointment_id"];
        isOneToOne: false;
        referencedRelation: "appointments";
        referencedColumns: ["id"];
      },
    ];
  };
  consent_logs: {
    Row: {
      id: string;
      patient_id: string | null;
      phone: string | null;
      email: string | null;
      channel: Channel;
      consented: boolean;
      reason: string | null;
      created_at: string;
    };
    Insert: {
      id?: string;
      patient_id?: string | null;
      phone?: string | null;
      email?: string | null;
      channel: Channel;
      consented: boolean;
      reason?: string | null;
      created_at?: string;
    };
    Update: {
      patient_id?: string | null;
      phone?: string | null;
      email?: string | null;
      channel?: Channel;
      consented?: boolean;
      reason?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "consent_logs_patient_id_fkey";
        columns: ["patient_id"];
        isOneToOne: false;
        referencedRelation: "profiles";
        referencedColumns: ["id"];
      },
    ];
  };
  opt_outs: {
    Row: {
      id: string;
      patient_id: string | null;
      channel: Channel;
      phone: string | null;
      email: string | null;
      reason: string | null;
      source: string;
      created_at: string;
    };
    Insert: {
      id?: string;
      patient_id?: string | null;
      channel: Channel;
      phone?: string | null;
      email?: string | null;
      reason?: string | null;
      source?: string;
      created_at?: string;
    };
    Update: {
      patient_id?: string | null;
      channel?: Channel;
      phone?: string | null;
      email?: string | null;
      reason?: string | null;
      source?: string;
    };
    Relationships: [
      {
        foreignKeyName: "opt_outs_patient_id_fkey";
        columns: ["patient_id"];
        isOneToOne: false;
        referencedRelation: "profiles";
        referencedColumns: ["id"];
      },
    ];
  };
  message_templates: {
    Row: {
      id: string;
      name: string;
      channel: Channel;
      category: string;
      body: string;
      variables: string[];
      is_active: boolean;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      name: string;
      channel: Channel;
      category: string;
      body: string;
      variables?: string[];
      is_active?: boolean;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      name?: string;
      channel?: Channel;
      category?: string;
      body?: string;
      variables?: string[];
      is_active?: boolean;
      updated_at?: string;
    };
    Relationships: [];
  };
  communication_outbox: {
    Row: {
      id: string;
      template_id: string | null;
      patient_id: string | null;
      channel: Channel;
      recipient_name: string | null;
      recipient_phone: string | null;
      recipient_email: string | null;
      subject: string | null;
      message: string;
      status: string;
      provider: string | null;
      provider_message_id: string | null;
      metadata: Json;
      scheduled_for: string | null;
      sent_at: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      template_id?: string | null;
      patient_id?: string | null;
      channel: Channel;
      recipient_name?: string | null;
      recipient_phone?: string | null;
      recipient_email?: string | null;
      subject?: string | null;
      message: string;
      status?: string;
      provider?: string | null;
      provider_message_id?: string | null;
      metadata?: Json;
      scheduled_for?: string | null;
      sent_at?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      template_id?: string | null;
      patient_id?: string | null;
      channel?: Channel;
      recipient_name?: string | null;
      recipient_phone?: string | null;
      recipient_email?: string | null;
      subject?: string | null;
      message?: string;
      status?: string;
      provider?: string | null;
      provider_message_id?: string | null;
      metadata?: Json;
      scheduled_for?: string | null;
      sent_at?: string | null;
      updated_at?: string;
    };
    Relationships: [
      {
        foreignKeyName: "communication_outbox_template_id_fkey";
        columns: ["template_id"];
        isOneToOne: false;
        referencedRelation: "message_templates";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "communication_outbox_patient_id_fkey";
        columns: ["patient_id"];
        isOneToOne: false;
        referencedRelation: "profiles";
        referencedColumns: ["id"];
      },
    ];
  };
  automation_rules: {
    Row: {
      id: string;
      name: string;
      trigger_event: string;
      channel: Channel;
      audience: string;
      delay_minutes: number;
      template_id: string | null;
      instructions: string;
      is_active: boolean;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      name: string;
      trigger_event: string;
      channel: Channel;
      audience: string;
      delay_minutes?: number;
      template_id?: string | null;
      instructions: string;
      is_active?: boolean;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      name?: string;
      trigger_event?: string;
      channel?: Channel;
      audience?: string;
      delay_minutes?: number;
      template_id?: string | null;
      instructions?: string;
      is_active?: boolean;
      updated_at?: string;
    };
    Relationships: [
      {
        foreignKeyName: "automation_rules_template_id_fkey";
        columns: ["template_id"];
        isOneToOne: false;
        referencedRelation: "message_templates";
        referencedColumns: ["id"];
      },
    ];
  };
};
