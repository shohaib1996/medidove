"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRequestedAt } from "@/lib/appointments/requested-at";
import { normalizePhone } from "@/lib/phone";

const text = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

export const updateProfile = async (formData: FormData) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const fullName = text(formData.get("full_name"));
  const phone = text(formData.get("phone"));

  if (!fullName) {
    throw new Error("Full name is required.");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone: phone || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/portal");
};

export const createConsentLog = async (formData: FormData) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const channel = text(formData.get("channel"));
  const consented = formData.get("consented") === "on";
  const reason = text(formData.get("reason"));
  const phone = normalizePhone(text(formData.get("phone")));
  const email = text(formData.get("email")) || user.email || "";

  if (!["email", "sms", "whatsapp", "voice"].includes(channel)) {
    throw new Error("Choose a valid communication channel.");
  }

  const { error } = await supabase.from("consent_logs").insert({
    patient_id: user.id,
    phone: phone || null,
    email: email || null,
    channel: channel as never,
    consented,
    reason: reason || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/portal");
  revalidatePath("/portal/consents");
};

export const rescheduleOwnAppointment = async (formData: FormData) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = formData.get("id");
  const date = formData.get("date");
  const time = formData.get("time");

  if (
    typeof id !== "string" ||
    typeof date !== "string" ||
    typeof time !== "string"
  ) {
    throw new Error("Invalid reschedule request.");
  }

  const requestedAt = getRequestedAt(date, time);

  if (!requestedAt) {
    throw new Error("Choose a valid date and time.");
  }

  const admin = createAdminClient();
  const { data: appointment, error: fetchError } = await admin
    .from("appointments")
    .select("id, patient_id, status")
    .eq("id", id)
    .single();

  if (fetchError || !appointment) {
    throw new Error("Appointment not found.");
  }

  if (appointment.patient_id !== user.id) {
    throw new Error("You can only reschedule your own appointments.");
  }

  if (appointment.status !== "pending") {
    throw new Error(
      "This appointment is already confirmed. Contact reception to change it.",
    );
  }

  const { error } = await admin
    .from("appointments")
    .update({ requested_at: requestedAt, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/portal");
};
