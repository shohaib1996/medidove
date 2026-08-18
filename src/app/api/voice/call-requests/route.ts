import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const phonePattern = /^[+()0-9\s-]{7,24}$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    phone?: string;
    reason?: string;
    consent?: boolean;
  } | null;

  if (!body?.name?.trim() || !body.phone?.trim()) {
    return NextResponse.json(
      { error: "Name and phone number are required." },
      { status: 400 },
    );
  }

  if (!phonePattern.test(body.phone.trim())) {
    return NextResponse.json(
      { error: "Please enter a valid phone number." },
      { status: 400 },
    );
  }

  if (!body.consent) {
    return NextResponse.json(
      { error: "Consent is required before scheduling an AI callback." },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();
  const reason = body.reason?.trim() || "Patient requested an AI receptionist callback.";

  const { error } = await supabase.from("call_logs").insert({
    phone_number: body.phone.trim(),
    direction: "outbound",
    provider: "elevenlabs",
    status: "requested",
    ai_summary: `${body.name.trim()} requested an AI callback. Reason: ${reason}`,
  });

  if (error) {
    return NextResponse.json(
      { error: "Could not save the callback request." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "Callback request saved for the reception team.",
  });
}
