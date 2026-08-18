"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit/log";
import { createClient } from "@/lib/supabase/server";

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

  return { supabase, userId: user.id };
};

const refreshSchedule = () => {
  revalidatePath("/admin/schedule");
  revalidatePath("/admin/appointments");
  revalidatePath("/admin");
  revalidatePath("/admin/audit");
};

export const createDoctorAvailability = async (formData: FormData) => {
  const doctorId = text(formData.get("doctor_id"));
  const weekday = Number.parseInt(text(formData.get("weekday")), 10);
  const startTime = text(formData.get("start_time"));
  const endTime = text(formData.get("end_time"));
  const slotMinutes = Number.parseInt(text(formData.get("slot_minutes")), 10);
  const location = text(formData.get("location"));

  if (!doctorId || !Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
    throw new Error("Choose a valid doctor and weekday.");
  }

  if (!startTime || !endTime) {
    throw new Error("Start and end times are required.");
  }

  const { supabase, userId } = await assertAdmin();
  const { data, error } = await supabase
    .from("doctor_availability")
    .insert({
      doctor_id: doctorId,
      weekday,
      start_time: startTime,
      end_time: endTime,
      slot_minutes: Number.isFinite(slotMinutes) ? Math.max(slotMinutes, 10) : 30,
      location: location || null,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    actorId: userId,
    actorType: "admin",
    eventType: "doctor_availability_created",
    entityType: "doctor_availability",
    entityId: data.id,
    summary: "Created doctor availability block.",
    metadata: {
      doctor_id: doctorId,
      weekday,
      start_time: startTime,
      end_time: endTime,
      slot_minutes: slotMinutes || 30,
    },
  });

  refreshSchedule();
};

export const toggleDoctorAvailability = async (formData: FormData) => {
  const id = text(formData.get("id"));
  const isActive = formData.get("is_active") === "true";

  if (!id) {
    throw new Error("Availability id is required.");
  }

  const { supabase, userId } = await assertAdmin();
  const { error } = await supabase
    .from("doctor_availability")
    .update({ is_active: !isActive })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    actorId: userId,
    actorType: "admin",
    eventType: "doctor_availability_toggled",
    entityType: "doctor_availability",
    entityId: id,
    summary: `Doctor availability ${isActive ? "paused" : "activated"}.`,
    metadata: { is_active: !isActive },
  });

  refreshSchedule();
};

export const assignAppointmentDoctor = async (formData: FormData) => {
  const appointmentId = text(formData.get("appointment_id"));
  const doctorId = text(formData.get("doctor_id"));
  const requestedDoctor = text(formData.get("requested_doctor"));

  if (!appointmentId || !doctorId) {
    throw new Error("Choose an appointment and doctor.");
  }

  const { supabase, userId } = await assertAdmin();
  const { error } = await supabase
    .from("appointments")
    .update({
      doctor_id: doctorId,
      requested_doctor: requestedDoctor || null,
      status: "confirmed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", appointmentId);

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    actorId: userId,
    actorType: "admin",
    eventType: "appointment_doctor_assigned",
    entityType: "appointments",
    entityId: appointmentId,
    summary: `Assigned appointment to ${requestedDoctor || "selected doctor"}.`,
    metadata: {
      doctor_id: doctorId,
      requested_doctor: requestedDoctor || null,
      status: "confirmed",
    },
  });

  refreshSchedule();
};
