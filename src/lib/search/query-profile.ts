import { generateOpenAIText } from "@/lib/ai/openai";
import type { SearchProfile } from "./types";

export const emergencySignals = [
  "chest pain",
  "can't breathe",
  "cannot breathe",
  "shortness of breath",
  "stroke",
  "heavy bleeding",
  "unconscious",
  "loss of consciousness",
  "severe allergic",
  "suicidal",
];

export const normalize = (value: string) => value.trim().toLowerCase();

export const includesAny = (text: string, terms: string[]) =>
  terms.some((term) => text.includes(term));

export const getTerms = (query: string) =>
  normalize(query)
    .split(/\s+/)
    .map((term) => term.replace(/[^\w-]/g, ""))
    .filter((term) => term.length > 1);

const semanticHints = [
  {
    signals: ["tooth", "teeth", "dental", "gum", "jaw", "cavity"],
    terms: ["dental", "dentist", "cleaning", "tooth", "gum"],
    intent: "dental_care",
  },
  {
    signals: ["child", "baby", "kid", "infant", "fever", "vaccination"],
    terms: ["pediatrics", "pediatrician", "child", "vaccination", "parent"],
    intent: "pediatric_care",
  },
  {
    signals: ["headache", "migraine", "seizure", "nerve", "numb", "dizzy"],
    terms: ["neurology", "neurologist", "specialist", "nerve", "headache"],
    intent: "neurology",
  },
  {
    signals: ["xray", "x-ray", "scan", "imaging", "radiology", "diagnostic"],
    terms: ["radiology", "imaging", "scan", "diagnostics"],
    intent: "radiology",
  },
  {
    signals: ["surgery", "injury", "operation", "wound"],
    terms: ["surgery", "surgeon", "consultant", "injury"],
    intent: "surgery",
  },
  {
    signals: ["heart", "cardiac", "pressure", "blood", "checkup"],
    terms: ["general", "medicine", "primary", "care", "checkup"],
    intent: "general_medicine",
  },
  {
    signals: ["call", "phone", "voice", "receptionist", "elevenlabs"],
    terms: ["receptionist", "voice", "call", "appointment", "ai"],
    intent: "ai_receptionist",
  },
  {
    signals: ["whatsapp", "sms", "reminder", "followup", "follow-up"],
    terms: ["whatsapp", "sms", "reminder", "engagement", "follow"],
    intent: "patient_engagement",
  },
];

const getRuleBasedSearchProfile = (
  query: string,
  terms: string[],
): SearchProfile => {
  const matchedHints = semanticHints.filter((hint) =>
    hint.signals.some((signal) => query.includes(signal)),
  );
  const expandedTerms = Array.from(
    new Set([...terms, ...matchedHints.flatMap((hint) => hint.terms)]),
  ).slice(0, 14);

  return {
    intent: matchedHints[0]?.intent || null,
    expandedTerms,
    provider: "rules",
  };
};

const parseOpenAIProfile = (
  text: string,
  fallback: SearchProfile,
): SearchProfile | null => {
  try {
    const jsonText = text.match(/\{[\s\S]*\}/)?.[0] || text;
    const parsed = JSON.parse(jsonText) as Partial<SearchProfile>;
    const aiTerms = Array.isArray(parsed.expandedTerms)
      ? parsed.expandedTerms
          .filter((term): term is string => typeof term === "string")
          .map((term) => normalize(term))
          .filter((term) => term.length > 1)
      : [];

    return {
      intent:
        typeof parsed.intent === "string" && parsed.intent.trim()
          ? normalize(parsed.intent)
          : fallback.intent,
      expandedTerms: Array.from(
        new Set([...fallback.expandedTerms, ...aiTerms]),
      ).slice(0, 14),
      provider: "openai",
    };
  } catch (error) {
    console.error("OpenAI search profile parse failed:", error);
    return null;
  }
};

export const getSearchProfile = async (
  query: string,
  terms: string[],
): Promise<SearchProfile> => {
  const fallback = getRuleBasedSearchProfile(query, terms);
  const result = await generateOpenAIText({
    instructions: [
      "You expand short clinic website searches into medical routing search terms.",
      "Do not diagnose or give medical advice.",
      'Return only valid JSON: {"intent":"short_snake_case_or_null","expandedTerms":["term"]}.',
      "Use common clinic service terms such as general medicine, dental, pediatrics, neurology, surgery, radiology, appointments, receptionist, WhatsApp, reminders, packages, products.",
    ].join("\n"),
    input: `Search query: ${query}`,
    metadata: {
      feature: "semantic_site_search",
    },
  });

  if (!result.ok) {
    return fallback;
  }

  return parseOpenAIProfile(result.text, fallback) || fallback;
};
