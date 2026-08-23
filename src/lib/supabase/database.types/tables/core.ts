import type { AppointmentStatus, Channel, Json, LeadStatus, UserRole } from "../shared";

export type CoreTables = {
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
  staff_members: {
    Row: {
      id: string;
      profile_id: string | null;
      full_name: string;
      email: string;
      phone: string | null;
      role: UserRole;
      status: "active" | "inactive" | "invited";
      notes: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      profile_id?: string | null;
      full_name: string;
      email: string;
      phone?: string | null;
      role?: UserRole;
      status?: "active" | "inactive" | "invited";
      notes?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      profile_id?: string | null;
      full_name?: string;
      email?: string;
      phone?: string | null;
      role?: UserRole;
      status?: "active" | "inactive" | "invited";
      notes?: string | null;
      updated_at?: string;
    };
    Relationships: [
      {
        foreignKeyName: "staff_members_profile_id_fkey";
        columns: ["profile_id"];
        isOneToOne: false;
        referencedRelation: "profiles";
        referencedColumns: ["id"];
      },
    ];
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
};
