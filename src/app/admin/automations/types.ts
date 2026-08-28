export type AutomationRule = {
  id: string;
  name: string;
  trigger_event: string;
  channel: string;
  audience: string;
  delay_minutes: number;
  template_id: string | null;
  instructions: string;
  is_active: boolean;
  created_at: string;
};

export type MessageTemplate = {
  id: string;
  name: string;
  channel: string;
  category: string;
  is_active: boolean;
};
