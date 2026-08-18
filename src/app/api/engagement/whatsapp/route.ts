import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const phonePattern = /^[+()0-9\s-]{7,24}$/;

const normalizeMessage = (name: string, interest: string) =>
  `WhatsApp opt-in from ${name}. Patient is interested in: ${interest}. Suggested first reply: Thanks for opting in to MediDove updates. A care coordinator can help with appointments, reminders, and service questions.`;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    phone?: string;
    email?: string;
    interest?: string;
    consent?: boolean;
  } | null;

  const name = body?.name?.trim();
  const phone = body?.phone?.trim();
  const interest = body?.interest?.trim();

  if (!name || !phone || !interest) {
    return NextResponse.json(
      { error: "Name, phone number, and interest are required." },
      { status: 400 },
    );
  }

  if (!phonePattern.test(phone)) {
    return NextResponse.json(
      { error: "Please enter a valid phone number." },
      { status: 400 },
    );
  }

  if (!body?.consent) {
    return NextResponse.json(
      { error: "WhatsApp opt-in consent is required." },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();
  const userClient = await createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  const message = normalizeMessage(name, interest);

  const [{ error: messageError }, { error: consentError }] = await Promise.all([
    supabase.from("whatsapp_messages").insert({
      phone_number: phone,
      direction: "outbound",
      message,
      status: "requested",
    }),
    supabase.from("consent_logs").insert({
      patient_id: user?.id || null,
      phone,
      email: body.email?.trim() || null,
      channel: "whatsapp",
      consented: true,
      reason: `Patient opted in for ${interest}.`,
    }),
  ]);

  if (messageError || consentError) {
    return NextResponse.json(
      { error: "Could not save the WhatsApp opt-in request." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "WhatsApp opt-in saved for admin review.",
  });
}
