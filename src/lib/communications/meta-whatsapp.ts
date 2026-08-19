import { createAdminClient } from "@/lib/supabase/admin";
import { writeAuditLog } from "@/lib/audit/log";
import type { Json } from "@/lib/supabase/database.types";

type MetaSendMessageInput = {
  recipientPhone: string | null;
  message: string;
  metadata?: Json;
};

type MetaMessagePayload = {
  messaging_product?: string;
  contacts?: { wa_id?: string }[];
  messages?: { id?: string }[];
  error?: {
    message?: string;
    code?: number;
    error_subcode?: number;
  };
};

export type MetaWhatsAppDeliveryResult = {
  ok: boolean;
  provider: "meta_whatsapp";
  providerMessageId?: string;
  error?: string;
};

const optionalEnv = (key: string) => process.env[key]?.trim() || "";

const normalizeWhatsAppPhone = (phone: string) =>
  phone.replace(/^whatsapp:/, "").replace(/[^\d+]/g, "");

export const sendMetaWhatsAppMessage = async ({
  recipientPhone,
  message,
  metadata,
}: MetaSendMessageInput): Promise<MetaWhatsAppDeliveryResult> => {
  const accessToken = optionalEnv("META_WHATSAPP_ACCESS_TOKEN");
  const phoneNumberId = optionalEnv("META_WHATSAPP_PHONE_NUMBER_ID");
  const graphVersion = optionalEnv("META_WHATSAPP_GRAPH_VERSION") || "v23.0";

  if (!accessToken || !phoneNumberId) {
    return {
      ok: false,
      provider: "meta_whatsapp",
      error:
        "Missing META_WHATSAPP_ACCESS_TOKEN or META_WHATSAPP_PHONE_NUMBER_ID.",
    };
  }

  if (!recipientPhone) {
    return {
      ok: false,
      provider: "meta_whatsapp",
      error: "Recipient phone is required.",
    };
  }

  const to = normalizeWhatsAppPhone(recipientPhone);

  const response = await fetch(
    `https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: {
          preview_url: false,
          body: message,
        },
      }),
    },
  );

  const payload = (await response.json().catch(() => ({}))) as MetaMessagePayload;

  if (!response.ok) {
    return {
      ok: false,
      provider: "meta_whatsapp",
      error: payload.error?.message || "Meta WhatsApp delivery failed.",
    };
  }

  const providerMessageId = payload.messages?.[0]?.id;

  try {
    const supabase = createAdminClient();

    await supabase.from("whatsapp_messages").insert({
      phone_number: to,
      direction: "outbound",
      message,
      provider_message_id: providerMessageId || null,
      status: "sent",
    });

    await writeAuditLog(supabase, {
      actorType: "system",
      eventType: "meta_whatsapp_outbound",
      entityType: "whatsapp_messages",
      summary: `Sent WhatsApp message to ${to}.`,
      metadata: {
        provider_message_id: providerMessageId,
        phone: to,
        source_metadata: metadata || null,
      },
    });
  } catch (error) {
    console.error("Meta WhatsApp delivery log failed:", error);
  }

  return {
    ok: true,
    provider: "meta_whatsapp",
    providerMessageId,
  };
};

