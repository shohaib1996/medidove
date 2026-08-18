import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type ChatRequest = {
  message?: string;
  sessionId?: string;
  visitorId?: string;
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
    cta: "/appoinment",
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
      "The planned voice receptionist uses ElevenLabs with Twilio. It can answer inbound calls, capture appointment details, create Supabase records, and store call summaries for staff review.",
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
      "The admin dashboard is protected by Supabase Auth and shows recent appointment requests plus contact leads captured from the website.",
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
      cta: "/contact",
      intent: `knowledge_${match.source_type}`,
    };
  } catch (error) {
    console.error("AI knowledge lookup failed:", error);
    return null;
  }
};

const getAssistantResponse = async (message: string) => {
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
    };
  }

  return {
    answer:
      "I can help with appointments, doctor matching, medical services, AI receptionist workflows, WhatsApp reminders, and admin lead handling. Tell me what you want to do next.",
    cta: "/appoinment",
    intent: "general_help",
  };
};

const logConversation = async ({
  sessionId,
  visitorId,
  message,
  answer,
  intent,
}: {
  sessionId: string | null;
  visitorId: string;
  message: string;
  answer: string;
  intent: string;
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
        metadata: { intent },
      },
      {
        session_id: activeSessionId,
        role: "assistant",
        content: answer,
        metadata: { intent },
      },
    ]);

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
  });

  return NextResponse.json({
    ...response,
    sessionId: activeSessionId,
    visitorId,
  });
}
