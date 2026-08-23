import type { AppointmentStatus, Channel, Json, LeadStatus, UserRole } from "../shared";

export type PatientCareTables = {
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
};
