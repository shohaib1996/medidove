"use server";

import { revalidatePath } from "next/cache";
import { runAutomationRules } from "@/lib/automations/runner";
import { createClient } from "@/lib/supabase/server";

const channels = ["email", "sms", "whatsapp", "voice"] as const;

const text = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

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

export const createAutomationRule = async (formData: FormData) => {
  const name = text(formData.get("name"));
  const triggerEvent = text(formData.get("trigger_event"));
  const channel = text(formData.get("channel"));
  const audience = text(formData.get("audience"));
  const instructions = text(formData.get("instructions"));
  const templateId = text(formData.get("template_id"));
  const delayMinutes = Number.parseInt(text(formData.get("delay_minutes")), 10);

  if (!name || !triggerEvent || !audience || !instructions) {
    throw new Error("Name, trigger, audience, and instructions are required.");
  }

  if (!channels.includes(channel as (typeof channels)[number])) {
    throw new Error("Choose a valid channel.");
  }

  const supabase = await assertAdmin();
  const { error } = await supabase.from("automation_rules").insert({
    name,
    trigger_event: triggerEvent,
    channel: channel as never,
    audience,
    delay_minutes: Number.isFinite(delayMinutes) ? Math.max(delayMinutes, 0) : 0,
    template_id: templateId || null,
    instructions,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/automations");
};

export const toggleAutomationRule = async (formData: FormData) => {
  const id = text(formData.get("id"));
  const isActive = formData.get("is_active") === "true";

  if (!id) {
    throw new Error("Automation id is required.");
  }

  const supabase = await assertAdmin();
  const { error } = await supabase
    .from("automation_rules")
    .update({
      is_active: !isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/automations");
};

export const runAutomationsNow = async () => {
  await assertAdmin();
  await runAutomationRules();

  revalidatePath("/admin/automations");
  revalidatePath("/admin/outreach");
};
