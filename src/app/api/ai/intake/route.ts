import { NextResponse } from "next/server";
import { generateOpenAIText } from "@/lib/ai/openai";

type IntakeRequest = {
  reason?: string;
};

type IntakeResult = {
  suggestedDepartment: string;
  suggestedDoctor: string;
  urgency: "low" | "medium" | "high" | "urgent";
  summary: string;
  adminNote: string;
  safetyMessage: string | null;
  matchedSignals: string[];
  provider: "rules" | "openai";
  model?: string;
};

const cleanText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const departmentRules = [
  {
    department: "Dental Care",
    doctor: "Dentist",
    signals: ["tooth", "teeth", "dental", "gum", "cavity", "jaw", "cleaning"],
  },
  {
    department: "Pediatrics",
    doctor: "Pediatrician",
    signals: ["child", "baby", "kid", "infant", "pediatric", "vaccination"],
  },
  {
    department: "Neurology",
    doctor: "Neurologist",
    signals: ["headache", "migraine", "seizure", "nerve", "numb", "dizzy"],
  },
  {
    department: "Surgery and Radiology",
    doctor: "Surgery consultant",
    signals: ["surgery", "xray", "x-ray", "scan", "radiology", "injury"],
  },
];

const urgentSignals = [
  "chest pain",
  "can't breathe",
  "cannot breathe",
  "shortness of breath",
  "stroke",
  "heavy bleeding",
  "unconscious",
  "severe allergic",
  "suicidal",
];

const highSignals = ["severe", "swelling", "high fever", "bleeding", "accident"];

const urgencyLevels = ["low", "medium", "high", "urgent"] as const;

const getRuleBasedIntakeResult = (reason: string): IntakeResult => {
  const normalized = reason.toLowerCase();
  const urgentMatches = urgentSignals.filter((signal) =>
    normalized.includes(signal),
  );

  if (urgentMatches.length > 0) {
    return {
      suggestedDepartment: "Emergency Care",
      suggestedDoctor: "Emergency clinician",
      urgency: "urgent",
      summary: `Patient described possible urgent symptoms: ${reason}`,
      adminNote:
        "Urgent language detected. Do not treat this as a routine booking without human review.",
      safetyMessage:
        "This may require urgent medical attention. Please contact emergency services or visit the nearest emergency department immediately.",
      matchedSignals: urgentMatches,
      provider: "rules",
    };
  }

  const matchedRule = departmentRules.find((rule) =>
    rule.signals.some((signal) => normalized.includes(signal)),
  );
  const matchedSignals =
    matchedRule?.signals.filter((signal) => normalized.includes(signal)) || [];
  const highMatches = highSignals.filter((signal) => normalized.includes(signal));
  const urgency = highMatches.length > 0 ? "high" : matchedRule ? "medium" : "low";
  const suggestedDepartment = matchedRule?.department || "General Medicine";
  const suggestedDoctor = matchedRule?.doctor || "First available doctor";

  return {
    suggestedDepartment,
    suggestedDoctor,
    urgency,
    summary: `Patient is requesting ${suggestedDepartment.toLowerCase()} support. Reason: ${reason}`,
    adminNote:
      urgency === "high"
        ? "Prioritize staff review because the request contains higher-urgency language."
        : "Routine appointment request. Confirm availability and patient contact details.",
    safetyMessage: null,
    matchedSignals: [...matchedSignals, ...highMatches],
    provider: "rules",
  };
};

const cleanString = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;

const cleanStringArray = (value: unknown, fallback: string[]) =>
  Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 8)
    : fallback;

const parseOpenAIIntake = (
  text: string,
  fallback: IntakeResult,
  model: string,
): IntakeResult | null => {
  try {
    const jsonText = text.match(/\{[\s\S]*\}/)?.[0] || text;
    const parsed = JSON.parse(jsonText) as Partial<IntakeResult>;
    const urgency = urgencyLevels.includes(parsed.urgency as IntakeResult["urgency"])
      ? (parsed.urgency as IntakeResult["urgency"])
      : fallback.urgency;

    return {
      suggestedDepartment: cleanString(
        parsed.suggestedDepartment,
        fallback.suggestedDepartment,
      ),
      suggestedDoctor: cleanString(parsed.suggestedDoctor, fallback.suggestedDoctor),
      urgency,
      summary: cleanString(parsed.summary, fallback.summary),
      adminNote: cleanString(parsed.adminNote, fallback.adminNote),
      safetyMessage:
        typeof parsed.safetyMessage === "string"
          ? parsed.safetyMessage.trim() || null
          : fallback.safetyMessage,
      matchedSignals: cleanStringArray(parsed.matchedSignals, fallback.matchedSignals),
      provider: "openai",
      model,
    };
  } catch (error) {
    console.error("OpenAI intake parse failed:", error);
    return null;
  }
};

const getOpenAIIntakeResult = async (
  reason: string,
  fallback: IntakeResult,
): Promise<IntakeResult | null> => {
  const instructions = [
    "You are MediDove's smart appointment intake router.",
    "Classify the appointment request for routing only. Do not diagnose, prescribe, or offer treatment instructions.",
    "Use these departments when possible: General Medicine, Dental Care, Pediatrics, Neurology, Surgery, Radiology, Emergency Care.",
    "If urgent symptoms appear, set urgency to urgent and include the emergency safety message.",
    "Return only valid JSON matching this schema: {\"suggestedDepartment\":\"string\",\"suggestedDoctor\":\"string\",\"urgency\":\"low|medium|high|urgent\",\"summary\":\"string\",\"adminNote\":\"string\",\"safetyMessage\":\"string|null\",\"matchedSignals\":[\"string\"]}.",
  ].join("\n");

  const result = await generateOpenAIText({
    instructions,
    input: [
      `Patient appointment reason: ${reason}`,
      "",
      "Rule-based fallback suggestion:",
      JSON.stringify(fallback),
    ].join("\n"),
    metadata: {
      feature: "smart_intake",
      fallback_urgency: fallback.urgency,
    },
  });

  if (!result.ok) {
    console.error("OpenAI intake failed:", result.error);
    return null;
  }

  return parseOpenAIIntake(result.text, fallback, result.model);
};

const getIntakeResult = async (reason: string): Promise<IntakeResult> => {
  const fallback = getRuleBasedIntakeResult(reason);

  if (fallback.urgency === "urgent") {
    return fallback;
  }

  const openAIResult = await getOpenAIIntakeResult(reason, fallback);

  return openAIResult || fallback;
};

export async function POST(request: Request) {
  let body: IntakeRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const reason = cleanText(body.reason);

  if (reason.length < 10) {
    return NextResponse.json(
      { error: "Please describe the appointment reason in at least 10 characters." },
      { status: 400 },
    );
  }

  return NextResponse.json(await getIntakeResult(reason));
}
