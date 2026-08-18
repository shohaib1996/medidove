import { createAdminClient } from "@/lib/supabase/admin";
import { writeAuditLog } from "@/lib/audit/log";

type TwilioFieldMap = {
  from: string;
  to: string;
  body: string;
  messageSid: string;
  callSid: string;
  callStatus: string;
};

const xmlEscape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const parseTwilioForm = async (request: Request): Promise<TwilioFieldMap> => {
  const formData = await request.formData();
  const field = (name: string) => {
    const value = formData.get(name);

    return typeof value === "string" ? value.trim() : "";
  };

  return {
    from: field("From"),
    to: field("To"),
    body: field("Body"),
    messageSid: field("MessageSid"),
    callSid: field("CallSid"),
    callStatus: field("CallStatus"),
  };
};

export const twimlResponse = (xml: string) =>
  new Response(xml, {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
    },
  });

export const messagingResponse = (message: string) =>
  twimlResponse(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${xmlEscape(
      message,
    )}</Message></Response>`,
  );

export const voiceResponse = (message: string) =>
  twimlResponse(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="alice">${xmlEscape(
      message,
    )}</Say><Pause length="1"/><Hangup/></Response>`,
  );

export const logInboundWhatsApp = async ({
  from,
  body,
  messageSid,
}: {
  from: string;
  body: string;
  messageSid: string;
}) => {
  const supabase = createAdminClient();
  const phone = from.replace(/^whatsapp:/, "");
  const message = body || "Inbound WhatsApp message without body.";

  const { data, error } = await supabase
    .from("whatsapp_messages")
    .insert({
      phone_number: phone,
      direction: "inbound",
      message,
      provider_message_id: messageSid || null,
      status: "received",
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    actorType: "system",
    eventType: "twilio_whatsapp_inbound",
    entityType: "whatsapp_messages",
    entityId: data.id,
    summary: `Received inbound WhatsApp message from ${phone}.`,
    metadata: {
      provider_message_id: messageSid,
      phone,
    },
  });

  return data.id;
};

export const logInboundVoiceCall = async ({
  from,
  callSid,
  callStatus,
}: {
  from: string;
  callSid: string;
  callStatus: string;
}) => {
  const supabase = createAdminClient();
  const phone = from || "Unknown caller";

  const { data, error } = await supabase
    .from("call_logs")
    .insert({
      phone_number: phone,
      direction: "inbound",
      provider: "twilio",
      provider_call_id: callSid || null,
      status: callStatus || "received",
      started_at: new Date().toISOString(),
      ai_summary:
        "Inbound phone call received by Twilio. Configure Twilio Media Streams or call forwarding to connect this to a live ElevenLabs receptionist.",
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    actorType: "system",
    eventType: "twilio_voice_inbound",
    entityType: "call_logs",
    entityId: data.id,
    summary: `Received inbound voice call from ${phone}.`,
    metadata: {
      provider_call_id: callSid,
      call_status: callStatus,
      phone,
    },
  });

  return data.id;
};
