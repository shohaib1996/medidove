import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizePhone } from "@/lib/phone";
import type { Channel } from "@/lib/supabase/database.types";

type UnsubscribeRequest = {
  channel?: string;
  phone?: string;
  email?: string;
  reason?: string;
};

const channels: Channel[] = ["email", "sms", "whatsapp", "voice"];

const cleanText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(request: Request) {
  let body: UnsubscribeRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const channel = cleanText(body.channel) as Channel;
  const phone = normalizePhone(cleanText(body.phone));
  const email = cleanText(body.email).toLowerCase();
  const reason = cleanText(body.reason);

  if (!channels.includes(channel)) {
    return NextResponse.json(
      { error: "Choose a valid channel." },
      { status: 400 },
    );
  }

  if (!phone && !email) {
    return NextResponse.json(
      { error: "Provide a phone number or email address." },
      { status: 400 },
    );
  }

  if (email && !isEmail(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();
  const { error: optOutError } = await supabase.from("opt_outs").insert({
    channel,
    phone: phone || null,
    email: email || null,
    reason: reason || "Public unsubscribe request.",
    source: "public_unsubscribe",
  });

  if (optOutError) {
    console.error("Opt-out create failed:", optOutError);

    return NextResponse.json(
      { error: "Unable to save unsubscribe request." },
      { status: 500 },
    );
  }

  await supabase.from("consent_logs").insert({
    channel,
    phone: phone || null,
    email: email || null,
    consented: false,
    reason: reason || "Public unsubscribe request.",
  });

  return NextResponse.json({
    ok: true,
    message: "Unsubscribe request saved.",
  });
}
