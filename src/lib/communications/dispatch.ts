import { createAdminClient } from "@/lib/supabase/admin";
import { writeAuditLog } from "@/lib/audit/log";
import type { Channel, Json } from "@/lib/supabase/database.types";

type OutboxRecord = {
  id: string;
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
      "id, channel, recipient_name, recipient_phone, recipient_email, subject, message, provider, metadata, scheduled_for",
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
  const results = [];

  for (const record of records) {
    const result = await deliverRecord(record);
    const deliveredAt = new Date().toISOString();
    const metadata = {
      ...metadataObject(record.metadata),
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
    results,
  };

  await writeAuditLog(supabase, {
    actorType: "system",
    eventType: "outbox_dispatch_executed",
    entityType: "communication_outbox",
    summary: `Outbox dispatch scanned ${summary.scanned} records, sent ${summary.sent}, and failed ${summary.failed}.`,
    metadata: summary,
  });

  return summary;
};
