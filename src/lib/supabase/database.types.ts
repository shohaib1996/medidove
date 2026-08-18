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
          profile_id: string | null;
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
          profile_id?: string | null;
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
          profile_id?: string | null;
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
            foreignKeyName: "doctors_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "doctors_department_id_fkey";
            columns: ["department_id"];
            isOneToOne: false;
            referencedRelation: "departments";
            referencedColumns: ["id"];
          },
        ];
      };
      doctor_availability: {
        Row: {
          id: string;
          doctor_id: string;
          weekday: number;
          start_time: string;
          end_time: string;
          slot_minutes: number;
          location: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          doctor_id: string;
          weekday: number;
          start_time: string;
          end_time: string;
          slot_minutes?: number;
          location?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          doctor_id?: string;
          weekday?: number;
          start_time?: string;
          end_time?: string;
          slot_minutes?: number;
          location?: string | null;
          is_active?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "doctor_availability_doctor_id_fkey";
            columns: ["doctor_id"];
            isOneToOne: false;
            referencedRelation: "doctors";
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
      clinic_settings: {
        Row: {
          id: string;
          clinic_name: string;
          phone: string;
          email: string;
          address: string | null;
          business_hours: string | null;
          whatsapp_number: string | null;
          emergency_notice: string | null;
          ai_disclosure: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clinic_name: string;
          phone: string;
          email: string;
          address?: string | null;
          business_hours?: string | null;
          whatsapp_number?: string | null;
          emergency_notice?: string | null;
          ai_disclosure?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          clinic_name?: string;
          phone?: string;
          email?: string;
          address?: string | null;
          business_hours?: string | null;
          whatsapp_number?: string | null;
          emergency_notice?: string | null;
          ai_disclosure?: string | null;
          updated_at?: string;
        };
        Relationships: [];
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
      clinical_notes: {
        Row: {
          id: string;
          patient_id: string | null;
          appointment_id: string | null;
          author_id: string | null;
          patient_name: string;
          visit_type: string;
          raw_note: string;
          subjective: string;
          objective: string;
          assessment: string;
          care_plan: string;
          risk_flags: string[];
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id?: string | null;
          appointment_id?: string | null;
          author_id?: string | null;
          patient_name: string;
          visit_type?: string;
          raw_note: string;
          subjective: string;
          objective: string;
          assessment: string;
          care_plan: string;
          risk_flags?: string[];
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          patient_id?: string | null;
          appointment_id?: string | null;
          author_id?: string | null;
          patient_name?: string;
          visit_type?: string;
          raw_note?: string;
          subjective?: string;
          objective?: string;
          assessment?: string;
          care_plan?: string;
          risk_flags?: string[];
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "clinical_notes_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "clinical_notes_appointment_id_fkey";
            columns: ["appointment_id"];
            isOneToOne: false;
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "clinical_notes_author_id_fkey";
            columns: ["author_id"];
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
      patient_feedback: {
        Row: {
          id: string;
          patient_id: string | null;
          appointment_id: string | null;
          name: string;
          email: string | null;
          phone: string | null;
          rating: number;
          category: string;
          message: string;
          ai_sentiment: string;
          ai_summary: string;
          ai_urgency: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id?: string | null;
          appointment_id?: string | null;
          name: string;
          email?: string | null;
          phone?: string | null;
          rating: number;
          category?: string;
          message: string;
          ai_sentiment: string;
          ai_summary: string;
          ai_urgency: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          patient_id?: string | null;
          appointment_id?: string | null;
          name?: string;
          email?: string | null;
          phone?: string | null;
          rating?: number;
          category?: string;
          message?: string;
          ai_sentiment?: string;
          ai_summary?: string;
          ai_urgency?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "patient_feedback_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "patient_feedback_appointment_id_fkey";
            columns: ["appointment_id"];
            isOneToOne: false;
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          },
        ];
      };
      care_tasks: {
        Row: {
          id: string;
          patient_id: string | null;
          assigned_to: string | null;
          source_type: string;
          source_id: string | null;
          title: string;
          description: string | null;
          priority: string;
          status: string;
          due_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id?: string | null;
          assigned_to?: string | null;
          source_type?: string;
          source_id?: string | null;
          title: string;
          description?: string | null;
          priority?: string;
          status?: string;
          due_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          patient_id?: string | null;
          assigned_to?: string | null;
          source_type?: string;
          source_id?: string | null;
          title?: string;
          description?: string | null;
          priority?: string;
          status?: string;
          due_at?: string | null;
          created_by?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "care_tasks_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "care_tasks_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "care_tasks_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
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
