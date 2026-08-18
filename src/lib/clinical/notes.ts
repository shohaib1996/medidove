type ClinicalNoteDraft = {
  subjective: string;
  objective: string;
  assessment: string;
  carePlan: string;
  riskFlags: string[];
};

const urgentSignals = [
  "chest pain",
  "shortness of breath",
  "cannot breathe",
  "stroke",
  "unconscious",
  "severe bleeding",
  "suicidal",
  "allergic reaction",
];

const objectiveSignals = [
  "bp",
  "blood pressure",
  "pulse",
  "temperature",
  "temp",
  "oxygen",
  "spo2",
  "exam",
  "lab",
  "x-ray",
  "scan",
];

const sentenceList = (text: string) =>
  text
    .split(/[.\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

const pickSentences = (sentences: string[], signals: string[]) =>
  sentences.filter((sentence) =>
    signals.some((signal) => sentence.toLowerCase().includes(signal)),
  );

const fallback = (value: string[], message: string) =>
  value.length > 0 ? value.join(". ") : message;

export const createClinicalNoteDraft = (rawNote: string): ClinicalNoteDraft => {
  const sentences = sentenceList(rawNote);
  const normalized = rawNote.toLowerCase();
  const riskFlags = urgentSignals.filter((signal) => normalized.includes(signal));
  const objective = pickSentences(sentences, objectiveSignals);
  const subjective = sentences.filter((sentence) => !objective.includes(sentence));
  const possibleAssessment = sentences.filter((sentence) =>
    ["diagnosis", "likely", "suspect", "consistent with", "assessment"].some(
      (signal) => sentence.toLowerCase().includes(signal),
    ),
  );
  const possiblePlan = sentences.filter((sentence) =>
    ["plan", "follow up", "follow-up", "prescribe", "refer", "monitor"].some(
      (signal) => sentence.toLowerCase().includes(signal),
    ),
  );

  return {
    subjective: fallback(
      subjective.slice(0, 4),
      "Patient-reported history should be reviewed and completed by a clinician.",
    ),
    objective: fallback(
      objective.slice(0, 4),
      "Objective findings were not clearly documented in the source note.",
    ),
    assessment: fallback(
      possibleAssessment.slice(0, 3),
      "Assessment requires clinician review before finalization.",
    ),
    carePlan: fallback(
      possiblePlan.slice(0, 4),
      "Care plan requires clinician review, including follow-up timing and patient instructions.",
    ),
    riskFlags,
  };
};
