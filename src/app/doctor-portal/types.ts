export type DoctorProfile = {
  id: string;
  full_name: string;
  specialty: string;
  image_url: string | null;
};

export type AppointmentRow = {
  id: string;
  patient_name: string;
  patient_email: string | null;
  patient_phone: string;
  requested_department: string | null;
  requested_at: string | null;
  reason: string | null;
  ai_summary: string | null;
  urgency: string | null;
  status: string;
  created_at: string;
};

export type AvailabilityRow = {
  id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  slot_minutes: number;
  location: string | null;
  is_active: boolean;
};

