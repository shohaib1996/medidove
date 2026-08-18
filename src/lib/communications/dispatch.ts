import { createAdminClient } from "@/lib/supabase/admin";
import { writeAuditLog } from "@/lib/audit/log";
import type { Channel, Json } from "@/lib/supabase/database.types";

type OutboxRecord = {
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

type DeliveryResult = {
  ok: boolean;
  provider: string;
  providerMessageId?: string;
  error?: string;
};

type ConsentResult = {
  consented: boolean;
  reason: string;
};

const optionalEnv = (key: string) => process.env[key]?.trim() || "";

const getProvider = (channel: Channel, provider: string | null) => {
  if (provider) {
    return provider;
  }

  if (channel === "voice") {
    return "elevenlabs";
  }

  if (channel === "sms" || channel === "whatsapp") {
    return "twilio";
  }

  return "email_webhook";
};

const metadataObject = (metadata: Json) =>
  metadata && typeof metadata === "object" && !Array.isArray(metadata)
    ? metadata
    : {};

const getLatestConsent = async (
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

const sendTwilioMessage = async (record: OutboxRecord): Promise<DeliveryResult> => {
  const accountSid = optionalEnv("TWILIO_ACCOUNT_SID");
  const authToken = optionalEnv("TWILIO_AUTH_TOKEN");
  const smsFrom = optionalEnv("TWILIO_FROM_PHONE");
  const whatsAppFrom = optionalEnv("TWILIO_WHATSAPP_FROM");
  const toPhone = record.recipient_phone;

  if (!accountSid || !authToken) {
    return {
      ok: false,
      provider: "twilio",
      error: "Missing Twilio account SID or auth token.",
    };
  }

  if (!toPhone) {
    return {
      ok: false,
      provider: "twilio",
      error: "Recipient phone is required.",
    };
  }

  const isWhatsApp = record.channel === "whatsapp";
  const from = isWhatsApp ? whatsAppFrom : smsFrom;
  const to = isWhatsApp && !toPhone.startsWith("whatsapp:")
    ? `whatsapp:${toPhone}`
    : toPhone;

  if (!from) {
    return {
      ok: false,
      provider: "twilio",
      error: `Missing ${isWhatsApp ? "TWILIO_WHATSAPP_FROM" : "TWILIO_FROM_PHONE"}.`,
    };
  }

  const body = new URLSearchParams({
    From: from,
    To: to,
    Body: record.message,
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    },
  );

  const payload = (await response.json().catch(() => ({}))) as {
    sid?: string;
    message?: string;
  };

  if (!response.ok) {
    return {
      ok: false,
      provider: "twilio",
      error: payload.message || "Twilio delivery failed.",
    };
  }

  return {
    ok: true,
    provider: "twilio",
    providerMessageId: payload.sid,
  };
};

const sendWebhook = async (
  record: OutboxRecord,
  provider: string,
  webhookUrl: string,
): Promise<DeliveryResult> => {
  if (!webhookUrl) {
    return {
      ok: false,
      provider,
      error: `Missing webhook URL for ${provider}.`,
    };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: record.id,
      channel: record.channel,
      recipientName: record.recipient_name,
      recipientPhone: record.recipient_phone,
      recipientEmail: record.recipient_email,
      subject: record.subject,
      message: record.message,
      metadata: record.metadata,
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    id?: string;
    messageId?: string;
    error?: string;
  };

  if (!response.ok) {
    return {
      ok: false,
      provider,
      error: payload.error || `${provider} webhook delivery failed.`,
    };
  }

  return {
    ok: true,
    provider,
    providerMessageId: payload.messageId || payload.id,
  };
};

const deliverRecord = async (record: OutboxRecord): Promise<DeliveryResult> => {
  if (record.channel === "sms" || record.channel === "whatsapp") {
    return sendTwilioMessage(record);
  }

  if (record.channel === "voice") {
    return sendWebhook(
      record,
      getProvider(record.channel, record.provider),
      optionalEnv("ELEVENLABS_OUTBOUND_CALL_WEBHOOK_URL"),
    );
  }

  return sendWebhook(
    record,
    getProvider(record.channel, record.provider),
    optionalEnv("EMAIL_DELIVERY_WEBHOOK_URL"),
  );
};

export const dispatchQueuedOutbox = async (limit = 20) => {
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("communication_outbox")
    .select(
      "id, patient_id, channel, recipient_name, recipient_phone, recipient_email, subject, message, provider, metadata, scheduled_for",
    )
    .eq("status", "queued")
    .or(`scheduled_for.is.null,scheduled_for.lte.${now}`)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  const records = (data || []) as OutboxRecord[];
  let sent = 0;
  let failed = 0;
  let blocked = 0;
  const results = [];

  for (const record of records) {
    const deliveredAt = new Date().toISOString();
    const consent = await getLatestConsent(record);

    if (!consent.consented) {
      const metadata = {
        ...metadataObject(record.metadata),
        consent_required: true,
        consent_block_reason: consent.reason,
        blocked_at: deliveredAt,
      };

      const { error: updateError } = await supabase
        .from("communication_outbox")
        .update({
          status: "blocked",
          updated_at: deliveredAt,
          metadata,
        })
        .eq("id", record.id);

      blocked += 1;
      results.push({
        id: record.id,
        channel: record.channel,
        ok: false,
        provider: getProvider(record.channel, record.provider),
        error: updateError?.message || consent.reason,
      });

      await writeAuditLog(supabase, {
        actorType: "system",
        eventType: "outbox_dispatch_blocked",
        entityType: "communication_outbox",
        entityId: record.id,
        summary: `Blocked ${record.channel} outreach because consent was not active.`,
        metadata: {
          channel: record.channel,
          reason: updateError?.message || consent.reason,
        },
      });

      continue;
    }

    const result = await deliverRecord(record);
    const metadata = {
      ...metadataObject(record.metadata),
      consent_required: true,
      consent_verified: true,
      delivery_provider: result.provider,
      delivery_error: result.error || null,
      dispatched_at: deliveredAt,
    };

    const { error: updateError } = await supabase
      .from("communication_outbox")
      .update({
        status: result.ok ? "sent" : "failed",
        provider: result.provider,
        provider_message_id: result.providerMessageId || null,
        sent_at: result.ok ? deliveredAt : null,
        updated_at: deliveredAt,
        metadata,
      })
      .eq("id", record.id);

    if (updateError || !result.ok) {
      failed += 1;
    } else {
      sent += 1;
    }

    results.push({
      id: record.id,
      channel: record.channel,
      ok: result.ok && !updateError,
      provider: result.provider,
      error: updateError?.message || result.error || null,
    });
  }

  const summary = {
    ok: true,
    scanned: records.length,
    sent,
    failed,
    blocked,
    results,
  };

  await writeAuditLog(supabase, {
    actorType: "system",
    eventType: "outbox_dispatch_executed",
    entityType: "communication_outbox",
    summary: `Outbox dispatch scanned ${summary.scanned} records, sent ${summary.sent}, failed ${summary.failed}, and blocked ${summary.blocked}.`,
    metadata: summary,
  });

  return summary;
};
