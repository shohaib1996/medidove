export type TaskFilter = "all" | "open" | "in_progress" | "done" | "cancelled";

export type ProfileOption = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: string;
};

export type CareTask = {
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
  created_at: string;
};
