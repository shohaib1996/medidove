import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { captureLeadFromMessage } from "@/lib/ai/lead-capture";
import { generateOpenAIText } from "@/lib/ai/openai";

type ChatRequest = {
  message?: string;
  sessionId?: string;
  visitorId?: string;
};

type AssistantResponse = {
  answer: string;
  cta: string | null;
  intent: string;
  provider: "rules" | "openai";
  model?: string;
};

const cleanText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const emergencySignals = [
  "chest pain",
  "can't breathe",
  "cannot breathe",
  "stroke",
  "heavy bleeding",
  "unconscious",
  "suicidal",
];

const knowledge = [
  {
    signals: ["appointment", "book", "schedule", "visit"],
    answer:
      "You can book an appointment from the appointment page. Share your name, phone, preferred department, date, time, and reason for visit. The clinic team can then review it in the admin dashboard.",
    cta: "/appointment",
  },
  {
    signals: ["doctor", "dentist", "neurologist", "pediatrician", "specialist"],
    answer:
      "MediDove supports doctor matching by specialty. Current demo departments include General Medicine, Dental Care, Pediatrics, Neurology, Surgery, and Radiology.",
    cta: "/doctor",
  },
  {
    signals: ["service", "department", "care", "treatment"],
    answer:
      "The services page explains the clinic departments and how each one can feed appointment routing, semantic search, and AI assistant answers.",
    cta: "/service",
  },
  {
    signals: ["call", "phone", "receptionist", "elevenlabs", "voice"],
    answer:
      "The voice receptionist can answer patient calls, capture appointment details, create clinic records, and store call summaries for staff review.",
    cta: "/contact",
  },
  {
    signals: ["whatsapp", "sms", "reminder", "marketing", "follow up"],
    answer:
      "WhatsApp and phone outreach should be opt-in patient engagement: appointment reminders, confirmations, follow-ups, feedback, and approved health campaign messages.",
    cta: "/contact",
  },
  {
    signals: ["admin", "dashboard", "lead", "supabase"],
    answer:
      "The admin dashboard is protected and shows recent appointment requests plus contact leads captured from the website.",
    cta: "/admin",
  },
];

const getStoredKnowledgeMatch = async (message: string) => {
  try {
    const supabase = createAdminClient();
    const terms = message
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((term) => term.length > 3)
      .slice(0, 6);

    const { data } = await supabase
      .from("ai_documents")
      .select("title, content, source_type")
      .limit(20);

    if (!data?.length || !terms.length) {
      return null;
    }

    const match = data.find((document) => {
      const searchable = `${document.title} ${document.content}`.toLowerCase();

      return terms.some((term) => searchable.includes(term));
    });

    if (!match) {
      return null;
    }

    return {
      answer: `${match.title}: ${match.content}`,
      context: `${match.title}: ${match.content}`,
      cta: "/contact",
      intent: `knowledge_${match.source_type}`,
      provider: "rules" as const,
    };
  } catch (error) {
    console.error("AI knowledge lookup failed:", error);
    return null;
  }
};

const getRuleBasedAssistantResponse = async (
  message: string,
): Promise<AssistantResponse> => {
  const normalized = message.toLowerCase();
  const emergencyMatch = emergencySignals.find((signal) =>
    normalized.includes(signal),
  );

  if (emergencyMatch) {
    return {
      answer:
        "This may require urgent medical attention. Please contact emergency services or visit the nearest emergency department immediately. I can help with routine appointment routing, but I cannot handle emergencies.",
      cta: null,
      intent: "urgent_safety",
      provider: "rules",
    };
  }

  const storedKnowledgeMatch = await getStoredKnowledgeMatch(message);

  if (storedKnowledgeMatch) {
    return storedKnowledgeMatch;
  }

  const match = knowledge.find((item) =>
    item.signals.some((signal) => normalized.includes(signal)),
  );

  if (match) {
    return {
      answer: match.answer,
      cta: match.cta,
      intent: match.signals[0],
      provider: "rules",
    };
  }

  return {
    answer:
      "I can help with appointments, doctor matching, medical services, virtual reception workflows, reminder preferences, and clinic message handling. Tell me what you want to do next.",
    cta: "/appointment",
    intent: "general_help",
    provider: "rules",
  };
};

const getOpenAIAssistantResponse = async (
  message: string,
  fallbackResponse: AssistantResponse,
): Promise<AssistantResponse | null> => {
  const clinicInstructions = [
    "You are MediDove AI Clinic Assistant for a modern healthcare website demo.",
    "Help visitors with appointment booking, doctor matching, clinic services, voice receptionist workflows, WhatsApp/SMS follow-ups, and admin lead handling.",
    "Do not diagnose, prescribe, or provide treatment plans. For urgent symptoms, tell the visitor to contact emergency services or visit the nearest emergency department.",
    "Use the provided clinic context when it is relevant. If details are missing, say the clinic team can follow up.",
    "Keep the answer concise, friendly, and under 110 words. Return plain text only.",
  ].join("\n");

  const input = [
    `Visitor message: ${message}`,
    "",
    "Clinic context:",
    fallbackResponse.answer,
    "",
    `Recommended CTA: ${fallbackResponse.cta || "none"}`,
    `Detected intent: ${fallbackResponse.intent}`,
  ].join("\n");

  const result = await generateOpenAIText({
    instructions: clinicInstructions,
    input,
    metadata: {
      feature: "clinic_assistant",
      intent: fallbackResponse.intent,
    },
  });

  if (!result.ok) {
    console.error("OpenAI assistant failed:", result.error);
    return null;
  }

  return {
    ...fallbackResponse,
    answer: result.text,
    provider: "openai",
    model: result.model,
  };
};

const getAssistantResponse = async (
  message: string,
): Promise<AssistantResponse> => {
  const fallbackResponse = await getRuleBasedAssistantResponse(message);

  if (fallbackResponse.intent === "urgent_safety") {
    return fallbackResponse;
  }

  const openAIResponse = await getOpenAIAssistantResponse(
    message,
    fallbackResponse,
  );

  return openAIResponse || fallbackResponse;
};

const logConversation = async ({
  sessionId,
  visitorId,
  message,
  answer,
  intent,
  provider,
  model,
}: {
  sessionId: string | null;
  visitorId: string;
  message: string;
  answer: string;
  intent: string;
  provider: AssistantResponse["provider"];
  model?: string;
}) => {
  try {
    const supabase = createAdminClient();
    let activeSessionId = sessionId;

    if (!activeSessionId) {
      const { data: session } = await supabase
        .from("ai_chat_sessions")
        .insert({
          visitor_id: visitorId,
        })
        .select("id")
        .single();

      activeSessionId = session?.id || null;
    }

    if (!activeSessionId) {
      return null;
    }

    await supabase.from("ai_chat_messages").insert([
      {
        session_id: activeSessionId,
        role: "user",
        content: message,
        metadata: { intent, provider, model },
      },
      {
        session_id: activeSessionId,
        role: "assistant",
        content: answer,
        metadata: { intent, provider, model },
      },
    ]);

    const capturedLead = captureLeadFromMessage({
      message,
      visitorId,
      sessionId: activeSessionId,
      intent,
    });

    if (capturedLead) {
      const { data: existingLead } = await supabase
        .from("ai_leads")
        .select("id")
        .eq("session_id", activeSessionId)
        .maybeSingle();

      if (!existingLead) {
        await supabase.from("ai_leads").insert({
          session_id: activeSessionId,
          visitor_id: visitorId,
          ...capturedLead,
        });
      }
    }

    return activeSessionId;
  } catch (error) {
    console.error("AI chat logging failed:", error);
    return sessionId;
  }
};

export async function POST(request: Request) {
  let body: ChatRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const message = cleanText(body.message);
  const sessionId = cleanText(body.sessionId) || null;
  const visitorId = cleanText(body.visitorId) || crypto.randomUUID();

  if (message.length < 2) {
    return NextResponse.json(
      { error: "Please enter a message." },
      { status: 400 },
    );
  }

  const response = await getAssistantResponse(message);
  const activeSessionId = await logConversation({
    sessionId,
    visitorId,
    message,
    answer: response.answer,
    intent: response.intent,
    provider: response.provider,
    model: response.model,
  });

  return NextResponse.json({
    ...response,
    sessionId: activeSessionId,
    visitorId,
  });
}
