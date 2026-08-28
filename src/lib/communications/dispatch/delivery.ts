import { sendSmtpEmail } from "@/lib/communications/email";
import { sendMetaWhatsAppMessage } from "@/lib/communications/meta-whatsapp";
import {
  getEmailProvider,
  getMessagingProvider,
  getProvider,
  optionalEnv,
} from "./providers";
import type { DeliveryResult, OutboxRecord } from "./types";

const sendTwilioMessage = async (
  record: OutboxRecord,
): Promise<DeliveryResult> => {
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
  const to =
    isWhatsApp && !toPhone.startsWith("whatsapp:")
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

export const deliverRecord = async (
  record: OutboxRecord,
): Promise<DeliveryResult> => {
  if (record.channel === "sms" || record.channel === "whatsapp") {
    const provider = getMessagingProvider(record.provider);

    if (provider === "twilio") {
      return sendTwilioMessage(record);
    }

    if (provider === "meta_whatsapp" && record.channel === "whatsapp") {
      return sendMetaWhatsAppMessage({
        recipientPhone: record.recipient_phone,
        message: record.message,
        metadata: record.metadata,
      });
    }

    if (provider === "webhook") {
      return sendWebhook(
        record,
        "messaging_webhook",
        optionalEnv("MESSAGE_DELIVERY_WEBHOOK_URL"),
      );
    }

    return {
      ok: false,
      provider,
      error:
        "Message delivery is disabled. Set OUTBOUND_MESSAGING_PROVIDER to meta_whatsapp, twilio, or webhook to enable it.",
    };
  }

  if (record.channel === "voice") {
    return sendWebhook(
      record,
      getProvider(record.channel, record.provider),
      optionalEnv("ELEVENLABS_OUTBOUND_CALL_WEBHOOK_URL"),
    );
  }

  const emailProvider = getEmailProvider(record.provider);

  if (emailProvider === "smtp") {
    return sendSmtpEmail({
      to: record.recipient_email,
      subject: record.subject,
      message: record.message,
    });
  }

  if (emailProvider === "webhook") {
    return sendWebhook(
      record,
      "email_webhook",
      optionalEnv("EMAIL_DELIVERY_WEBHOOK_URL"),
    );
  }

  return {
    ok: false,
    provider: emailProvider,
    error:
      "Email delivery is disabled. Set OUTBOUND_EMAIL_PROVIDER to smtp or webhook to enable it.",
  };
};
