import { NextResponse } from "next/server";
import { triageFeedback } from "@/lib/ai/feedback-sentiment";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type FeedbackRequest = {
  name?: string;
  email?: string;
  phone?: string;
  rating?: number;
  category?: string;
  message?: string;
  appointmentId?: string;
};

const cleanText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const isEmail = (value: string) =>
  value.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(request: Request) {
  let body: FeedbackRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const name = cleanText(body.name);
  const email = cleanText(body.email);
  const phone = cleanText(body.phone);
  const category = cleanText(body.category) || "general";
  const message = cleanText(body.message);
  const appointmentId = cleanText(body.appointmentId);
  const rating = Number(body.rating);

  if (!name || !message || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Name, rating, and feedback message are required." },
      { status: 400 },
    );
  }

  if (!isEmail(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  const userClient = await createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  const triage = triageFeedback({ rating, message, category });
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("patient_feedback")
    .insert({
      patient_id: user?.id || null,
      appointment_id: appointmentId || null,
      name,
      email: email || user?.email || null,
      phone: phone || null,
      rating,
      category,
      message,
      ai_sentiment: triage.sentiment,
      ai_summary: triage.summary,
      ai_urgency: triage.urgency,
      status: "new",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Feedback create failed:", error);

    return NextResponse.json(
      { error: "Unable to submit feedback." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    feedbackId: data.id,
    message: "Feedback submitted successfully.",
  });
}
