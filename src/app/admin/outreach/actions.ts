"use server";

import { revalidatePath } from "next/cache";
import { dispatchQueuedOutbox } from "@/lib/communications/dispatch";
import { createClient } from "@/lib/supabase/server";

const channels = ["email", "sms", "whatsapp", "voice"] as const;

const text = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

const optionalEnv = (key: string) => process.env[key]?.trim() || "";

const providerForChannel = (channel: string) => {
  if (channel === "voice") {
    return "elevenlabs";
  }

  if (channel === "whatsapp" || channel === "sms") {
    return optionalEnv("OUTBOUND_MESSAGING_PROVIDER") || "disabled";
  }

  return optionalEnv("OUTBOUND_EMAIL_PROVIDER") || "smtp";
};

const assertAdmin = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Admin access is required.");
  }

  return supabase;
};

export const queueOutreachMessage = async (formData: FormData) => {
  const channel = text(formData.get("channel"));
  const templateId = text(formData.get("template_id"));
  const recipientName = text(formData.get("recipient_name"));
  const recipientPhone = text(formData.get("recipient_phone"));
  const recipientEmail = text(formData.get("recipient_email"));
  const subject = text(formData.get("subject"));
  const message = text(formData.get("message"));
  const consentConfirmed = formData.get("consent_confirmed") === "on";

  if (!channels.includes(channel as (typeof channels)[number])) {
    throw new Error("Choose a valid channel.");
  }

  if (!message) {
    throw new Error("Message is required.");
  }

  if ((channel === "whatsapp" || channel === "sms" || channel === "voice") && !recipientPhone) {
    throw new Error("Phone number is required for this channel.");
  }

  if (channel === "email" && !recipientEmail) {
    throw new Error("Email is required for email outreach.");
  }

  if (!consentConfirmed) {
    throw new Error("Confirm consent before queuing outreach.");
  }

  const supabase = await assertAdmin();
  const { error } = await supabase.from("communication_outbox").insert({
    template_id: templateId || null,
    channel: channel as never,
    recipient_name: recipientName || null,
    recipient_phone: recipientPhone || null,
    recipient_email: recipientEmail || null,
    subject: subject || null,
    message,
    status: "queued",
    provider: providerForChannel(channel),
    metadata: {
      consent_confirmed: true,
      queued_from: "admin_outreach",
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (channel === "whatsapp") {
    await supabase.from("whatsapp_messages").insert({
      phone_number: recipientPhone,
      direction: "outbound",
      message,
      status: "queued",
    });
  }

  if (channel === "voice") {
    await supabase.from("call_logs").insert({
      phone_number: recipientPhone,
      direction: "outbound",
      provider: "elevenlabs",
      ai_summary: message,
      status: "queued",
    });
  }

  revalidatePath("/admin/outreach");
  revalidatePath("/admin");
  revalidatePath("/admin/analytics");
};

export const dispatchOutboxNow = async () => {
  await assertAdmin();
  await dispatchQueuedOutbox(10);

  revalidatePath("/admin/outreach");
  revalidatePath("/admin/communications");
  revalidatePath("/admin/analytics");
};
