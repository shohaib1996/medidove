export type AppointmentRow = {
  id: string;
  patient_name: string;
  patient_email: string | null;
  patient_phone: string;
  requested_department: string | null;
  requested_doctor: string | null;
  requested_at: string | null;
  reason: string | null;
  urgency: string | null;
  status: string;
  source_channel: string;
  created_at: string;
};

export type LeadRow = {
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
  status: string;
  created_at: string;
};

export type CallLogRow = {
  id: string;
  phone_number: string;
  direction: "inbound" | "outbound";
  provider: string;
  transcript: string | null;
  ai_summary: string | null;
  status: string | null;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
};

export type WhatsAppMessageRow = {
  id: string;
  phone_number: string;
  direction: "inbound" | "outbound";
  message: string;
  status: string | null;
  created_at: string;
};
