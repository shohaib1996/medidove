import { NextResponse } from "next/server";

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

const getIntakeResult = (reason: string): IntakeResult => {
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
  };
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

  return NextResponse.json(getIntakeResult(reason));
}
