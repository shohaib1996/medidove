import type { AppointmentStatus, Channel, Json, LeadStatus, UserRole } from "../shared";

export type AiTables = {
  contact_leads: {
    Row: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
      subject: string | null;
      message: string;
      ai_category: string | null;
      ai_summary: string | null;
      ai_urgency: string | null;
      ai_suggested_reply: string | null;
      status: LeadStatus;
      created_at: string;
    };
    Insert: {
      id?: string;
      name: string;
      email: string;
      phone?: string | null;
      subject?: string | null;
      message: string;
      ai_category?: string | null;
      ai_summary?: string | null;
      ai_urgency?: string | null;
      ai_suggested_reply?: string | null;
      status?: LeadStatus;
      created_at?: string;
    };
    Update: {
      ai_category?: string | null;
      ai_summary?: string | null;
      ai_urgency?: string | null;
      ai_suggested_reply?: string | null;
      status?: LeadStatus;
    };
    Relationships: [];
  };
  ai_chat_sessions: {
    Row: {
      id: string;
      user_id: string | null;
      visitor_id: string | null;
      created_at: string;
    };
    Insert: {
      id?: string;
      user_id?: string | null;
      visitor_id?: string | null;
      created_at?: string;
    };
    Update: {
      user_id?: string | null;
      visitor_id?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "ai_chat_sessions_user_id_fkey";
        columns: ["user_id"];
        isOneToOne: false;
        referencedRelation: "profiles";
        referencedColumns: ["id"];
      },
    ];
  };
  ai_documents: {
    Row: {
      id: string;
      source_type: string;
      source_id: string | null;
      title: string;
      content: string;
      metadata: Json;
      created_at: string;
    };
    Insert: {
      id?: string;
      source_type: string;
      source_id?: string | null;
      title: string;
      content: string;
      metadata?: Json;
      created_at?: string;
    };
    Update: {
      source_type?: string;
      source_id?: string | null;
      title?: string;
      content?: string;
      metadata?: Json;
    };
    Relationships: [];
  };
  ai_document_chunks: {
    Row: {
      id: string;
      document_id: string;
      content: string;
      embedding: string | null;
      metadata: Json;
      created_at: string;
    };
    Insert: {
      id?: string;
      document_id: string;
      content: string;
      embedding?: string | null;
      metadata?: Json;
      created_at?: string;
    };
    Update: {
      document_id?: string;
      content?: string;
      embedding?: string | null;
      metadata?: Json;
    };
    Relationships: [
      {
        foreignKeyName: "ai_document_chunks_document_id_fkey";
        columns: ["document_id"];
        isOneToOne: false;
        referencedRelation: "ai_documents";
        referencedColumns: ["id"];
      },
    ];
  };
  ai_chat_messages: {
    Row: {
      id: string;
      session_id: string;
      role: "user" | "assistant" | "system";
      content: string;
      metadata: Json | null;
      created_at: string;
    };
    Insert: {
      id?: string;
      session_id: string;
      role: "user" | "assistant" | "system";
      content: string;
      metadata?: Json | null;
      created_at?: string;
    };
    Update: {
      content?: string;
      metadata?: Json | null;
    };
    Relationships: [
      {
        foreignKeyName: "ai_chat_messages_session_id_fkey";
        columns: ["session_id"];
        isOneToOne: false;
        referencedRelation: "ai_chat_sessions";
        referencedColumns: ["id"];
      },
    ];
  };
  ai_leads: {
    Row: {
      id: string;
      session_id: string | null;
      visitor_id: string | null;
      name: string | null;
      email: string | null;
      phone: string | null;
      interest: string;
      summary: string;
      urgency: string;
      status: string;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      session_id?: string | null;
      visitor_id?: string | null;
      name?: string | null;
      email?: string | null;
      phone?: string | null;
      interest: string;
      summary: string;
      urgency?: string;
      status?: string;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      session_id?: string | null;
      visitor_id?: string | null;
      name?: string | null;
      email?: string | null;
      phone?: string | null;
      interest?: string;
      summary?: string;
      urgency?: string;
      status?: string;
      updated_at?: string;
    };
    Relationships: [
      {
        foreignKeyName: "ai_leads_session_id_fkey";
        columns: ["session_id"];
        isOneToOne: false;
        referencedRelation: "ai_chat_sessions";
        referencedColumns: ["id"];
      },
    ];
  };
};
