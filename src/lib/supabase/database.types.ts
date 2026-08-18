export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "patient" | "doctor" | "receptionist" | "admin";
export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "rescheduled";
export type LeadStatus = "new" | "contacted" | "converted" | "closed" | "spam";
export type Channel = "email" | "sms" | "whatsapp" | "voice";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: UserRole;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      departments: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          is_active?: boolean;
        };
        Relationships: [];
      };
      doctors: {
        Row: {
          id: string;
          department_id: string | null;
          full_name: string;
          slug: string;
          specialty: string;
          bio: string | null;
          consultation_fee: number | null;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          department_id?: string | null;
          full_name: string;
          slug: string;
          specialty: string;
          bio?: string | null;
          consultation_fee?: number | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          department_id?: string | null;
          full_name?: string;
          slug?: string;
          specialty?: string;
          bio?: string | null;
          consultation_fee?: number | null;
          image_url?: string | null;
          is_active?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "doctors_department_id_fkey";
            columns: ["department_id"];
            isOneToOne: false;
            referencedRelation: "departments";
            referencedColumns: ["id"];
          },
        ];
      };
      services: {
        Row: {
          id: string;
          department_id: string | null;
          title: string;
          slug: string;
          summary: string;
          description: string | null;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          department_id?: string | null;
          title: string;
          slug: string;
          summary: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          department_id?: string | null;
          title?: string;
          slug?: string;
          summary?: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "services_department_id_fkey";
            columns: ["department_id"];
            isOneToOne: false;
            referencedRelation: "departments";
            referencedColumns: ["id"];
          },
        ];
      };
      appointments: {
        Row: {
          id: string;
          patient_id: string | null;
          doctor_id: string | null;
          department_id: string | null;
          patient_name: string;
          patient_email: string | null;
          patient_phone: string;
          requested_department: string | null;
          requested_doctor: string | null;
          requested_at: string | null;
          reason: string | null;
          ai_summary: string | null;
          urgency: string | null;
          status: AppointmentStatus;
          source_channel: Channel | "website";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id?: string | null;
          doctor_id?: string | null;
          department_id?: string | null;
          patient_name: string;
          patient_email?: string | null;
          patient_phone: string;
          requested_department?: string | null;
          requested_doctor?: string | null;
          requested_at?: string | null;
          reason?: string | null;
          ai_summary?: string | null;
          urgency?: string | null;
          status?: AppointmentStatus;
          source_channel?: Channel | "website";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          doctor_id?: string | null;
          department_id?: string | null;
          patient_email?: string | null;
          patient_phone?: string;
          requested_department?: string | null;
          requested_doctor?: string | null;
          requested_at?: string | null;
          reason?: string | null;
          ai_summary?: string | null;
          urgency?: string | null;
          status?: AppointmentStatus;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_department_id_fkey";
            columns: ["department_id"];
            isOneToOne: false;
            referencedRelation: "departments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_doctor_id_fkey";
            columns: ["doctor_id"];
            isOneToOne: false;
            referencedRelation: "doctors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
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
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      appointment_status: AppointmentStatus;
      lead_status: LeadStatus;
      communication_channel: Channel;
    };
    CompositeTypes: Record<string, never>;
  };
};
