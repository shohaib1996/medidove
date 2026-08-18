export type LeadTriage = {
  category: string;
  urgency: "low" | "medium" | "high";
  summary: string;
  suggestedReply: string;
};

const highUrgencyWords = [
  "urgent",
  "emergency",
  "severe",
  "chest pain",
  "shortness of breath",
  "bleeding",
  "faint",
  "stroke",
];

const mediumUrgencyWords = [
  "appointment",
  "book",
  "schedule",
  "pain",
  "fever",
  "follow up",
  "follow-up",
  "report",
];

const getLeadCategory = (content: string) => {
  if (content.includes("appointment") || content.includes("book")) {
    return "appointment";
  }

  if (
    content.includes("price") ||
    content.includes("cost") ||
    content.includes("billing") ||
    content.includes("insurance")
  ) {
    return "billing";
  }

  if (
    content.includes("product") ||
    content.includes("shop") ||
    content.includes("medicine")
  ) {
    return "shop";
  }

  if (
    content.includes("partner") ||
    content.includes("business") ||
    content.includes("upwork")
  ) {
    return "partnership";
  }

  return "general";
};

const getUrgency = (content: string): LeadTriage["urgency"] => {
  if (highUrgencyWords.some((word) => content.includes(word))) {
    return "high";
  }

  if (mediumUrgencyWords.some((word) => content.includes(word))) {
    return "medium";
  }

  return "low";
};

const truncate = (value: string, maxLength: number) =>
  value.length > maxLength ? `${value.slice(0, maxLength - 3).trim()}...` : value;

const buildSuggestedReply = (
  name: string,
  category: string,
  urgency: LeadTriage["urgency"],
) => {
  if (urgency === "high") {
    return `Hi ${name}, thanks for contacting MediDove. If this is a medical emergency, please call local emergency services now. A clinic coordinator will review your message and contact you as soon as possible.`;
  }

  if (category === "appointment") {
    return `Hi ${name}, thanks for contacting MediDove. We can help you choose the right department and appointment time. Please share your preferred date, time, and any doctor preference.`;
  }

  if (category === "billing") {
    return `Hi ${name}, thanks for reaching out. A care coordinator can help with pricing, billing, or insurance questions. Please share the service name so we can guide you correctly.`;
  }

  return `Hi ${name}, thanks for contacting MediDove. We received your message and a clinic coordinator will follow up with the right next step.`;
};

export const triageLead = ({
  name,
  subject,
  message,
}: {
  name: string;
  subject: string;
  message: string;
}): LeadTriage => {
  const content = `${subject} ${message}`.toLowerCase();
  const category = getLeadCategory(content);
  const urgency = getUrgency(content);

  return {
    category,
    urgency,
    summary: `${urgency.toUpperCase()} ${category} lead from ${name}: ${truncate(
      message.replace(/\s+/g, " "),
      180,
    )}`,
    suggestedReply: buildSuggestedReply(name, category, urgency),
  };
};
