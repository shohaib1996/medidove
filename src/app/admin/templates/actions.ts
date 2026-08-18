"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const text = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

const channels = ["email", "sms", "whatsapp", "voice"] as const;

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

const parseVariables = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim().replace(/[{}]/g, ""))
    .filter(Boolean);

export const createMessageTemplate = async (formData: FormData) => {
  const name = text(formData.get("name"));
  const channel = text(formData.get("channel"));
  const category = text(formData.get("category"));
  const body = text(formData.get("body"));
  const variables = parseVariables(text(formData.get("variables")));

  if (!name || !category || !body) {
    throw new Error("Template name, category, and body are required.");
  }

  if (!channels.includes(channel as (typeof channels)[number])) {
    throw new Error("Choose a valid channel.");
  }

  const supabase = await assertAdmin();
  const { error } = await supabase.from("message_templates").insert({
    name,
    channel: channel as never,
    category,
    body,
    variables,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/templates");
};

export const toggleMessageTemplate = async (formData: FormData) => {
  const id = text(formData.get("id"));
  const isActive = formData.get("is_active") === "true";

  if (!id) {
    throw new Error("Template id is required.");
  }

  const supabase = await assertAdmin();
  const { error } = await supabase
    .from("message_templates")
    .update({
      is_active: !isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/templates");
};
