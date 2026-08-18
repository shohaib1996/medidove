type LeadCaptureInput = {
  message: string;
  visitorId: string;
  sessionId: string | null;
  intent: string;
};

export type CapturedAiLead = {
  name: string | null;
  email: string | null;
  phone: string | null;
  interest: string;
  summary: string;
  urgency: "low" | "medium" | "high";
  status: "new";
};

const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const phonePattern = /(?:\+?\d[\d\s().-]{6,}\d)/;
const namePattern = /(?:my name is|i am|i'm)\s+([a-z][a-z\s.'-]{1,40})/i;

const highUrgencySignals = [
  "urgent",
  "as soon as possible",
  "asap",
  "severe",
  "pain",
  "swelling",
  "bleeding",
];

const leadIntentSignals = [
  "book",
  "appointment",
  "call",
  "callback",
  "contact",
  "quote",
  "price",
  "consult",
  "doctor",
  "dentist",
  "whatsapp",
];

const cleanPhone = (value: string | null) =>
  value ? value.replace(/\s+/g, " ").trim() : null;

const cleanName = (value: string | null) => {
  if (!value) {
    return null;
  }

  return value
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
};

export const captureLeadFromMessage = ({
  message,
  visitorId,
  sessionId,
  intent,
}: LeadCaptureInput): CapturedAiLead | null => {
  const normalized = message.toLowerCase();
  const hasLeadIntent =
    intent !== "general_help" ||
    leadIntentSignals.some((signal) => normalized.includes(signal));
  const email = message.match(emailPattern)?.[0] || null;
  const phone = cleanPhone(message.match(phonePattern)?.[0] || null);

  if (!hasLeadIntent || (!email && !phone)) {
    return null;
  }

  const name = cleanName(message.match(namePattern)?.[1] || null);
  const urgency = highUrgencySignals.some((signal) => normalized.includes(signal))
    ? "high"
    : normalized.includes("appointment") || normalized.includes("call")
      ? "medium"
      : "low";
  const interest = intent.replaceAll("_", " ");

  return {
    name,
    email,
    phone,
    interest,
    summary: `Chat visitor ${
      name || visitorId
    } asked about ${interest}. Message: ${message.slice(0, 220)}${
      sessionId ? ` Session: ${sessionId}.` : ""
    }`,
    urgency,
    status: "new",
  };
};
