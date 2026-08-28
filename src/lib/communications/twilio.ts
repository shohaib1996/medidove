import crypto from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { writeAuditLog } from "@/lib/audit/log";

type TwilioFieldMap = {
  from: string;
  to: string;
  body: string;
  messageSid: string;
  callSid: string;
  callStatus: string;
  digits: string;
  speechResult: string;
};

const optionalEnv = (key: string) => process.env[key]?.trim() || "";
const parsedTwilioForms = new WeakMap<Request, URLSearchParams>();

const xmlEscape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const parseTwilioForm = async (
  request: Request,
): Promise<TwilioFieldMap> => {
  const body = await request.text();
  const formData = new URLSearchParams(body);
  parsedTwilioForms.set(request, formData);
  const field = (name: string) => {
    const value = formData.get(name);

    return value?.trim() || "";
  };

  return {
    from: field("From"),
    to: field("To"),
    body: field("Body"),
    messageSid: field("MessageSid"),
    callSid: field("CallSid"),
    callStatus: field("CallStatus"),
    digits: field("Digits"),
    speechResult: field("SpeechResult"),
  };
};

const getTwilioValidationUrl = (request: Request) => {
  const baseUrl = optionalEnv("TWILIO_WEBHOOK_BASE_URL");

  if (!baseUrl) {
    return request.url;
  }

  const requestUrl = new URL(request.url);
  const publicBaseUrl = new URL(baseUrl);

  requestUrl.protocol = publicBaseUrl.protocol;
  requestUrl.host = publicBaseUrl.host;

  return requestUrl.toString();
};

export const shouldValidateTwilioWebhook = () => {
  const setting = optionalEnv("TWILIO_VALIDATE_WEBHOOKS").toLowerCase();

  if (setting === "true") {
    return true;
  }

  if (setting === "false") {
    return false;
  }

  return process.env.NODE_ENV === "production";
};

export const validateTwilioWebhook = (
  request: Request,
  fields: Partial<TwilioFieldMap>,
) => {
  if (!shouldValidateTwilioWebhook()) {
    return true;
  }

  const authToken = optionalEnv("TWILIO_AUTH_TOKEN");
  const signature = request.headers.get("x-twilio-signature") || "";

  if (!authToken || !signature) {
    return false;
  }

  const formEntries = parsedTwilioForms.get(request)
    ? Array.from(parsedTwilioForms.get(request)!.entries())
    : Object.entries({
        Body: fields.body,
        CallSid: fields.callSid,
        CallStatus: fields.callStatus,
        Digits: fields.digits,
        From: fields.from,
        MessageSid: fields.messageSid,
        SpeechResult: fields.speechResult,
        To: fields.to,
      }).filter((entry): entry is [string, string] => Boolean(entry[1]));
  const payload = formEntries
    .sort(([first], [second]) => first.localeCompare(second))
    .reduce(
      (input, [key, value]) => `${input}${key}${value}`,
      getTwilioValidationUrl(request),
    );

  const expected = crypto
    .createHmac("sha1", authToken)
    .update(payload)
    .digest("base64");
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);

  return (
    expectedBuffer.length === actualBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, actualBuffer)
  );
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

export const receptionistGatherResponse = (actionUrl: string) =>
  twimlResponse(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Gather input="speech dtmf" action="${xmlEscape(
      actionUrl,
    )}" method="POST" timeout="6" speechTimeout="auto" numDigits="1"><Say voice="alice">Hello, this is MediDove Clinic. You are speaking with an AI assisted receptionist demo. If this is a medical emergency, please hang up and contact emergency services now. To request an appointment, press 1 or say appointment. To request a callback, press 2 or say callback. To leave a message for the clinic team, press 3 or say message.</Say></Gather><Say voice="alice">We did not receive a response. The reception team will see that you called. Goodbye.</Say><Hangup/></Response>`,
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

const getVoiceIntent = (digits: string, speechResult: string) => {
  const speech = speechResult.toLowerCase();

  if (digits === "1" || speech.includes("appointment") || speech.includes("book")) {
    return "appointment_request";
  }

  if (digits === "2" || speech.includes("callback") || speech.includes("call back")) {
    return "callback_request";
  }

  if (digits === "3" || speech.includes("message")) {
    return "clinic_message";
  }

  return "general_voice_request";
};

export const logVoiceReceptionistIntake = async ({
  from,
  callSid,
  callStatus,
  digits,
  speechResult,
}: {
  from: string;
  callSid: string;
  callStatus: string;
  digits: string;
  speechResult: string;
}) => {
  const supabase = createAdminClient();
  const phone = from || "Unknown caller";
  const intent = getVoiceIntent(digits, speechResult);
  const transcript = speechResult || `Caller selected menu option ${digits || "unknown"}.`;
  const summary = `AI receptionist captured ${intent.replaceAll(
    "_",
    " ",
  )} from ${phone}. ${transcript}`;

  if (callSid) {
    const { data: existingCall } = await supabase
      .from("call_logs")
      .select("id")
      .eq("provider_call_id", callSid)
      .maybeSingle();

    if (existingCall) {
      const { error } = await supabase
        .from("call_logs")
        .update({
          status: "requested",
          transcript,
          ai_summary: summary,
          ended_at: new Date().toISOString(),
        })
        .eq("id", existingCall.id);

      if (error) {
        throw new Error(error.message);
      }

      await writeAuditLog(supabase, {
        actorType: "system",
        eventType: "twilio_voice_intake",
        entityType: "call_logs",
        entityId: existingCall.id,
        summary: `Captured AI receptionist intake from ${phone}.`,
        metadata: {
          provider_call_id: callSid,
          call_status: callStatus,
          intent,
          digits,
        },
      });

      return existingCall.id;
    }
  }

  const { data, error } = await supabase
    .from("call_logs")
    .insert({
      phone_number: phone,
      direction: "inbound",
      provider: "twilio",
      provider_call_id: callSid || null,
      status: "requested",
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
      transcript,
      ai_summary: summary,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    actorType: "system",
    eventType: "twilio_voice_intake",
    entityType: "call_logs",
    entityId: data.id,
    summary: `Captured AI receptionist intake from ${phone}.`,
    metadata: {
      provider_call_id: callSid,
      call_status: callStatus,
      intent,
      digits,
    },
  });

  return data.id;
};
