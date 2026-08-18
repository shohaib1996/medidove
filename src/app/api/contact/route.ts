import { NextResponse } from "next/server";
import { triageLead } from "@/lib/ai/lead-triage";
import { createAdminClient } from "@/lib/supabase/admin";

type ContactRequest = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
};

const cleanText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(request: Request) {
  let body: ContactRequest;

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
  const subject = cleanText(body.subject);
  const message = cleanText(body.message);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  if (!isEmail(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  const triage = triageLead({ name, subject, message });
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("contact_leads")
    .insert({
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
      ai_category: triage.category,
      ai_summary: triage.summary,
      ai_urgency: triage.urgency,
      ai_suggested_reply: triage.suggestedReply,
      status: "new",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Contact lead create failed:", error);

    return NextResponse.json(
      { error: "Unable to submit your message." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    leadId: data.id,
    message: "Message submitted successfully.",
  });
}
