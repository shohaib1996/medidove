import { createAdminClient } from "@/lib/supabase/admin";
import { phonesMatch } from "@/lib/phone";
import type { ConsentResult, OutboxRecord } from "./types";

type TimestampedRow = { created_at: string };
type ConsentRow = TimestampedRow & { consented: boolean };

const findLatestOptOut = async (
  supabase: ReturnType<typeof createAdminClient>,
  record: OutboxRecord,
): Promise<TimestampedRow | null> => {
  const { data } = await supabase
    .from("opt_outs")
    .select("patient_id, email, phone, created_at")
    .eq("channel", record.channel)
    .order("created_at", { ascending: false })
    .limit(500);

  const match = (data || []).find(
    (row) =>
      (record.patient_id && row.patient_id === record.patient_id) ||
      (record.recipient_email &&
        row.email?.toLowerCase() === record.recipient_email.toLowerCase()) ||
      phonesMatch(row.phone, record.recipient_phone),
  );

  return match ? { created_at: match.created_at } : null;
};

const findLatestConsentLog = async (
  supabase: ReturnType<typeof createAdminClient>,
  record: OutboxRecord,
): Promise<ConsentRow | null> => {
  if (record.patient_id) {
    const { data } = await supabase
      .from("consent_logs")
      .select("consented, created_at")
      .eq("channel", record.channel)
      .eq("patient_id", record.patient_id)
      .order("created_at", { ascending: false })
      .limit(1);

    return data?.[0] || null;
  }

  if (record.channel === "email") {
    if (!record.recipient_email) {
      return null;
    }

    const { data } = await supabase
      .from("consent_logs")
      .select("consented, created_at")
      .eq("channel", record.channel)
      .eq("email", record.recipient_email)
      .order("created_at", { ascending: false })
      .limit(1);

    return data?.[0] || null;
  }

  if (!record.recipient_phone) {
    return null;
  }

  const { data } = await supabase
    .from("consent_logs")
    .select("consented, phone, created_at")
    .eq("channel", record.channel)
    .not("phone", "is", null)
    .order("created_at", { ascending: false })
    .limit(500);

  const latest = (data || []).find((row) =>
    phonesMatch(row.phone, record.recipient_phone),
  );

  return latest || null;
};

export const getLatestConsent = async (
  record: OutboxRecord,
): Promise<ConsentResult> => {
  const supabase = createAdminClient();

  const [latestOptOut, latestConsentLog] = await Promise.all([
    findLatestOptOut(supabase, record),
    findLatestConsentLog(supabase, record),
  ]);

  const optOutIsNewer =
    latestOptOut &&
    (!latestConsentLog || latestOptOut.created_at > latestConsentLog.created_at);

  if (optOutIsNewer) {
    return {
      consented: false,
      reason: "Recipient has an active opt-out for this channel.",
    };
  }

  if (!latestConsentLog) {
    return { consented: false, reason: "No consent record found." };
  }

  return {
    consented: latestConsentLog.consented === true,
    reason: latestConsentLog.consented
      ? "Latest consent record allows this channel."
      : "Latest consent record was not active.",
  };
};
