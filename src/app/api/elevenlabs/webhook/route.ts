import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { writeAuditLog } from "@/lib/audit/log";
import { extractContactDetails } from "@/lib/ai/lead-capture";

type TranscriptTurn = {
  role?: string;
  message?: string | null;
};

type ElevenLabsWebhookPayload = {
  type?: string;
  event_timestamp?: number | string;
  data?: {
    agent_id?: string;
    agent_name?: string;
    conversation_id?: string;
    status?: string;
    transcript?: TranscriptTurn[];
    analysis?: {
      transcript_summary?: string | null;
      call_summary?: string | null;
      evaluation_criteria_results?: Record<string, unknown>;
      data_collection_results?: Record<string, unknown>;
    };
    metadata?: {
      start_time_unix_secs?: number;
      call_duration_secs?: number;
      phone_call?: {
        external_number?: string;
        agent_number?: string;
        direction?: string;
      };
    };
  };
};

const cleanText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const getWebhookToken = () => process.env.ELEVENLABS_WEBHOOK_TOKEN?.trim() || "";

const getWebhookSigningSecret = () =>
  process.env.ELEVENLABS_WEBHOOK_SECRET?.trim() || "";

const isAuthorizedByToken = (request: Request) => {
  const token = getWebhookToken();

  if (!token) {
    return false;
  }

  const url = new URL(request.url);
  const authorization = request.headers.get("authorization") || "";
  const headerToken = request.headers.get("x-webhook-token") || "";
  const queryToken = url.searchParams.get("token") || "";

  return (
    authorization === `Bearer ${token}` ||
    headerToken === token ||
    queryToken === token
  );
};

// ElevenLabs signs webhook deliveries as `elevenlabs-signature: t=<unix>,v0=<hmac_sha256_hex>`
// computed over `${t}.${rawBody}` using the workspace webhook secret.
const isAuthorizedBySignature = (request: Request, rawBody: string) => {
  const secret = getWebhookSigningSecret();
  const signatureHeader = request.headers.get("elevenlabs-signature");

  if (!secret || !signatureHeader) {
    return false;
  }

  const parts: Record<string, string> = {};

  for (const segment of signatureHeader.split(",")) {
    const [key, value] = segment.split("=");

    if (key && value) {
      parts[key.trim()] = value.trim();
    }
  }

  const timestamp = parts.t;
  const providedSignature = parts.v0;

  if (!timestamp || !providedSignature) {
    return false;
  }

  const expectedSignature = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  const providedBuffer = Buffer.from(providedSignature, "utf8");

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  try {
    return timingSafeEqual(expectedBuffer, providedBuffer);
  } catch {
    return false;
  }
};

const isAuthorized = (request: Request, rawBody: string) => {
  const hasAnyAuthConfigured = Boolean(getWebhookToken() || getWebhookSigningSecret());

  if (!hasAnyAuthConfigured) {
    return true;
  }

  return isAuthorizedByToken(request) || isAuthorizedBySignature(request, rawBody);
};

const formatTranscript = (turns: TranscriptTurn[] | undefined) =>
  (turns || [])
    .map((turn) => {
      const role = cleanText(turn.role) || "speaker";
      const message = cleanText(turn.message);

      return message ? `${role}: ${message}` : "";
    })
    .filter(Boolean)
    .join("\n");

const getRealPhoneCallNumber = (payload: ElevenLabsWebhookPayload) =>
  cleanText(payload.data?.metadata?.phone_call?.external_number) ||
  cleanText(payload.data?.metadata?.phone_call?.agent_number);

const getDisplayCaller = (
  payload: ElevenLabsWebhookPayload,
  caller: { name: string | null; phone: string | null },
) => {
  const realPhoneCallNumber = getRealPhoneCallNumber(payload);

  if (realPhoneCallNumber) {
    return realPhoneCallNumber;
  }

  if (caller.name && caller.phone) {
    return `${caller.name} (${caller.phone})`;
  }

  return caller.name || caller.phone || "Unknown caller";
};

const getStartedAt = (payload: ElevenLabsWebhookPayload) => {
  const startTime = payload.data?.metadata?.start_time_unix_secs;

  return typeof startTime === "number"
    ? new Date(startTime * 1000).toISOString()
    : null;
};

const getEndedAt = (payload: ElevenLabsWebhookPayload) => {
  const startedAt = getStartedAt(payload);
  const duration = payload.data?.metadata?.call_duration_secs;

  if (!startedAt || typeof duration !== "number") {
    return null;
  }

  return new Date(new Date(startedAt).getTime() + duration * 1000).toISOString();
};

const getSummary = (payload: ElevenLabsWebhookPayload, transcript: string) =>
  cleanText(payload.data?.analysis?.transcript_summary) ||
  cleanText(payload.data?.analysis?.call_summary) ||
  (transcript
    ? `ElevenLabs receptionist completed a call. ${transcript.slice(0, 260)}`
    : "ElevenLabs receptionist completed a call without transcript text.");

const extractCollectedField = (
  results: Record<string, unknown> | undefined,
  patterns: RegExp[],
): string | null => {
  if (!results) {
    return null;
  }

  for (const [key, raw] of Object.entries(results)) {
    if (!patterns.some((pattern) => pattern.test(key))) {
      continue;
    }

    const value =
      raw && typeof raw === "object" && "value" in (raw as Record<string, unknown>)
        ? (raw as Record<string, unknown>).value
        : raw;

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
};

const urgentTranscriptSignals = [
  "urgent",
  "emergency",
  "severe",
  "chest pain",
  "bleeding",
  "can't breathe",
  "cannot breathe",
];

const getCallerTranscriptText = (turns: TranscriptTurn[] | undefined) =>
  (turns || [])
    .filter((turn) => cleanText(turn.role).toLowerCase() !== "agent")
    .map((turn) => cleanText(turn.message))
    .filter(Boolean)
    .join(" ");

type ExtractedCaller = {
  name: string | null;
  email: string | null;
  phone: string | null;
};

// Prefer the agent's Data Collection results when configured, but fall back
// to regex-extracting name/email/phone straight from what the caller said,
// so this works even without setting up Data Collection fields.
const extractCallerDetails = (payload: ElevenLabsWebhookPayload): ExtractedCaller => {
  const collected = payload.data?.analysis?.data_collection_results;
  const fallback = extractContactDetails(
    getCallerTranscriptText(payload.data?.transcript),
  );

  return {
    name: extractCollectedField(collected, [/name/i]) || fallback.name,
    email: extractCollectedField(collected, [/email/i]) || fallback.email,
    phone: extractCollectedField(collected, [/phone/i, /number/i]) || fallback.phone,
  };
};

const createLeadFromCall = async (
  supabase: ReturnType<typeof createAdminClient>,
  caller: ExtractedCaller,
  conversationId: string,
  transcript: string,
  summary: string,
) => {
  const { name, email, phone } = caller;

  if (!email && !phone) {
    return;
  }

  const visitorId = `elevenlabs:${conversationId}`;
  const { data: existingLead } = await supabase
    .from("ai_leads")
    .select("id")
    .eq("visitor_id", visitorId)
    .maybeSingle();

  if (existingLead) {
    return;
  }

  const urgency = urgentTranscriptSignals.some((signal) =>
    transcript.toLowerCase().includes(signal),
  )
    ? "high"
    : "medium";

  await supabase.from("ai_leads").insert({
    visitor_id: visitorId,
    name,
    email,
    phone,
    interest: "voice_appointment",
    summary: `Voice receptionist call. ${summary}`,
    urgency,
    status: "new",
  });
};

export async function POST(request: Request) {
  const rawBody = await request.text();

  if (!isAuthorized(request, rawBody)) {
    return NextResponse.json({ error: "Unauthorized webhook." }, { status: 401 });
  }

  let payload: ElevenLabsWebhookPayload | null = null;

  try {
    payload = JSON.parse(rawBody) as ElevenLabsWebhookPayload;
  } catch {
    payload = null;
  }

  if (!payload?.type || !payload.data?.conversation_id) {
    return NextResponse.json(
      { error: "Invalid ElevenLabs webhook payload." },
      { status: 400 },
    );
  }

  if (payload.type !== "post_call_transcription") {
    return NextResponse.json({ received: true, ignored: payload.type });
  }

  const supabase = createAdminClient();
  const conversationId = payload.data.conversation_id;
  const transcript = formatTranscript(payload.data.transcript);
  const caller = extractCallerDetails(payload);
  const displayCaller = getDisplayCaller(payload, caller);
  const direction: "inbound" | "outbound" =
    payload.data.metadata?.phone_call?.direction === "outbound"
      ? "outbound"
      : "inbound";
  const record = {
    phone_number: displayCaller,
    direction,
    provider: "elevenlabs",
    provider_call_id: conversationId,
    transcript,
    ai_summary: getSummary(payload, transcript),
    status: payload.data.status === "done" ? "completed" : payload.data.status || "received",
    started_at: getStartedAt(payload),
    ended_at: getEndedAt(payload),
  };

  const { data: existingCall } = await supabase
    .from("call_logs")
    .select("id")
    .eq("provider_call_id", conversationId)
    .maybeSingle();

  const { data, error } = existingCall
    ? await supabase
        .from("call_logs")
        .update(record)
        .eq("id", existingCall.id)
        .select("id")
        .single()
    : await supabase.from("call_logs").insert(record).select("id").single();

  if (error) {
    return NextResponse.json(
      { error: "Could not save ElevenLabs call webhook." },
      { status: 500 },
    );
  }

  await writeAuditLog(supabase, {
    actorType: "system",
    eventType: "elevenlabs_post_call_transcription",
    entityType: "call_logs",
    entityId: data.id,
    summary: `Stored ElevenLabs post-call transcript for ${displayCaller}.`,
    metadata: {
      conversation_id: conversationId,
      agent_id: payload.data.agent_id,
      agent_name: payload.data.agent_name,
      event_timestamp: payload.event_timestamp,
    },
  });

  await createLeadFromCall(
    supabase,
    caller,
    conversationId,
    transcript,
    record.ai_summary,
  );

  return NextResponse.json({ received: true, callLogId: data.id });
}
