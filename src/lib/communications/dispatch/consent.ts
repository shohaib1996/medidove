import { createAdminClient } from "@/lib/supabase/admin";
import type { ConsentResult, OutboxRecord } from "./types";

export const getLatestConsent = async (
  record: OutboxRecord,
): Promise<ConsentResult> => {
  const supabase = createAdminClient();
  const hasOptOut = async (
    column: "patient_id" | "email" | "phone",
    value: string | null,
  ) => {
    if (!value) {
      return false;
    }

    const { data } = await supabase
      .from("opt_outs")
      .select("id")
      .eq("channel", record.channel)
      .eq(column, value)
      .order("created_at", { ascending: false })
      .limit(1);

    return Boolean(data?.[0]);
  };

  if (
    (await hasOptOut("patient_id", record.patient_id)) ||
    (await hasOptOut("email", record.recipient_email)) ||
    (await hasOptOut("phone", record.recipient_phone))
  ) {
    return {
      consented: false,
      reason: "Recipient has an active opt-out for this channel.",
    };
  }

  const baseQuery = supabase
    .from("consent_logs")
    .select("consented, created_at")
    .eq("channel", record.channel)
    .order("created_at", { ascending: false })
    .limit(1);

  if (record.patient_id) {
    const { data } = await baseQuery.eq("patient_id", record.patient_id);
    const latest = data?.[0];

    return {
      consented: latest?.consented === true,
      reason: latest
        ? "Latest patient consent record was not active."
        : "No patient consent record found.",
    };
  }

  if (record.channel === "email") {
    if (!record.recipient_email) {
      return { consented: false, reason: "Recipient email is missing." };
    }

    const { data } = await baseQuery.eq("email", record.recipient_email);
    const latest = data?.[0];

    return {
      consented: latest?.consented === true,
      reason: latest
        ? "Latest email consent record was not active."
        : "No email consent record found.",
    };
  }

  if (!record.recipient_phone) {
    return { consented: false, reason: "Recipient phone is missing." };
  }

  const { data } = await baseQuery.eq("phone", record.recipient_phone);
  const latest = data?.[0];

  return {
    consented: latest?.consented === true,
    reason: latest
      ? "Latest phone consent record was not active."
      : "No phone consent record found.",
  };
};
