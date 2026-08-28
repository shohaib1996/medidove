export type Doctor = {
  id: string;
  profile_id: string | null;
  full_name: string;
  specialty: string;
  is_active: boolean;
};

export type DoctorUser = {
  id: string;
  full_name: string | null;
  phone: string | null;
};

export type Availability = {
  id: string;
  doctor_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  slot_minutes: number;
  location: string | null;
  is_active: boolean;
};

export type Appointment = {
  id: string;
  patient_name: string;
  requested_department: string | null;
  requested_doctor: string | null;
  requested_at: string | null;
  status: string;
};
