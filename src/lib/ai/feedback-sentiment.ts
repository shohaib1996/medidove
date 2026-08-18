type FeedbackInput = {
  rating: number;
  message: string;
  category: string;
};

type FeedbackTriage = {
  sentiment: "positive" | "neutral" | "negative";
  urgency: "low" | "medium" | "high";
  summary: string;
};

const negativeSignals = [
  "angry",
  "bad",
  "billing",
  "cancel",
  "complaint",
  "confused",
  "delay",
  "late",
  "pain",
  "rude",
  "unsafe",
  "waiting",
  "wrong",
];

const highUrgencySignals = [
  "unsafe",
  "emergency",
  "severe",
  "mistake",
  "wrong medicine",
  "allergic",
  "harm",
  "legal",
];

export const triageFeedback = ({
  rating,
  message,
  category,
}: FeedbackInput): FeedbackTriage => {
  const normalized = message.toLowerCase();
  const negativeMatches = negativeSignals.filter((signal) =>
    normalized.includes(signal),
  );
  const highMatches = highUrgencySignals.filter((signal) =>
    normalized.includes(signal),
  );
  const sentiment =
    rating >= 4 && negativeMatches.length === 0
      ? "positive"
      : rating <= 2 || negativeMatches.length > 1
        ? "negative"
        : "neutral";
  const urgency =
    highMatches.length > 0 || rating === 1
      ? "high"
      : sentiment === "negative"
        ? "medium"
        : "low";

  return {
    sentiment,
    urgency,
    summary: `${sentiment.toUpperCase()} ${category} feedback with ${urgency} follow-up priority. Rating: ${rating}/5. ${message.slice(0, 180)}`,
  };
};
