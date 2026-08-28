import type { Channel, Json } from "@/lib/supabase/database.types";

export type OutboxRecord = {
  id: string;
  patient_id: string | null;
  channel: Channel;
  recipient_name: string | null;
  recipient_phone: string | null;
  recipient_email: string | null;
  subject: string | null;
  message: string;
  provider: string | null;
  metadata: Json;
  scheduled_for: string | null;
};

export type DeliveryResult = {
  ok: boolean;
  provider: string;
  providerMessageId?: string;
  error?: string;
};

export type ConsentResult = {
  consented: boolean;
  reason: string;
};
