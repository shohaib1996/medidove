"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const text = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

const getOwnDoctorId = async (userId: string) => {
  const admin = createAdminClient();
  const { data } = await admin
    .from("doctors")
    .select("id")
    .eq("profile_id", userId)
    .maybeSingle();

  return data?.id ?? null;
};

export const createOwnAvailability = async (formData: FormData) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const weekday = Number(formData.get("weekday"));
  const startTime = text(formData.get("start_time"));
  const endTime = text(formData.get("end_time"));
  const slotMinutesRaw = Number(formData.get("slot_minutes"));
  const location = text(formData.get("location"));

  if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
    throw new Error("Choose a valid day of week.");
  }

  if (!startTime || !endTime) {
    throw new Error("Start time and end time are required.");
  }

  if (startTime >= endTime) {
    throw new Error("End time must be after start time.");
  }

  const doctorId = await getOwnDoctorId(user.id);

  if (!doctorId) {
    throw new Error("Your account is not linked to a doctor profile.");
  }

  const admin = createAdminClient();
  const { error } = await admin.from("doctor_availability").insert({
    doctor_id: doctorId,
    weekday,
    start_time: startTime,
    end_time: endTime,
    slot_minutes: Number.isFinite(slotMinutesRaw)
      ? Math.max(slotMinutesRaw, 10)
      : 30,
    location: location || null,
    is_active: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/doctor-portal");
};

export const toggleOwnAvailability = async (formData: FormData) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = text(formData.get("id"));
  const isActive = formData.get("is_active") === "true";

  if (!id) {
    throw new Error("Availability id is required.");
  }

  const doctorId = await getOwnDoctorId(user.id);

  if (!doctorId) {
    throw new Error("Your account is not linked to a doctor profile.");
  }

  const admin = createAdminClient();
  const { data: block } = await admin
    .from("doctor_availability")
    .select("id, doctor_id")
    .eq("id", id)
    .maybeSingle();

  if (!block || block.doctor_id !== doctorId) {
    throw new Error("You can only manage your own availability.");
  }

  const { error } = await admin
    .from("doctor_availability")
    .update({ is_active: !isActive })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/doctor-portal");
};
