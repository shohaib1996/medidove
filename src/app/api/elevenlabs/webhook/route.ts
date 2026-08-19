import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { writeAuditLog } from "@/lib/audit/log";

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

const getWebhookToken = () =>
  process.env.ELEVENLABS_WEBHOOK_TOKEN?.trim() ||
  process.env.ELEVENLABS_WEBHOOK_SECRET?.trim() ||
  "";

const isAuthorized = (request: Request) => {
  const token = getWebhookToken();

  if (!token) {
    return true;
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

const formatTranscript = (turns: TranscriptTurn[] | undefined) =>
  (turns || [])
    .map((turn) => {
      const role = cleanText(turn.role) || "speaker";
      const message = cleanText(turn.message);

      return message ? `${role}: ${message}` : "";
    })
    .filter(Boolean)
    .join("\n");

const getPhoneNumber = (payload: ElevenLabsWebhookPayload) =>
  cleanText(payload.data?.metadata?.phone_call?.external_number) ||
  cleanText(payload.data?.metadata?.phone_call?.agent_number) ||
  "Unknown caller";

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

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized webhook." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as
    | ElevenLabsWebhookPayload
    | null;

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
  const phoneNumber = getPhoneNumber(payload);
  const direction: "inbound" | "outbound" =
    payload.data.metadata?.phone_call?.direction === "outbound"
      ? "outbound"
      : "inbound";
  const record = {
    phone_number: phoneNumber,
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
    summary: `Stored ElevenLabs post-call transcript for ${phoneNumber}.`,
    metadata: {
      conversation_id: conversationId,
      agent_id: payload.data.agent_id,
      agent_name: payload.data.agent_name,
      event_timestamp: payload.event_timestamp,
    },
  });

  return NextResponse.json({ received: true, callLogId: data.id });
}
