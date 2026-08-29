"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit/log";
import { createClient } from "@/lib/supabase/server";
import { getRequestedAt } from "@/lib/appointments/requested-at";

type AdminTable =
  | "appointments"
  | "contact_leads"
  | "ai_leads"
  | "call_logs"
  | "whatsapp_messages";

const allowedStatuses: Record<AdminTable, string[]> = {
  appointments: ["pending", "confirmed", "completed", "cancelled", "rescheduled"],
  contact_leads: ["new", "contacted", "converted", "closed", "spam"],
  ai_leads: ["new", "contacted", "converted", "closed", "spam"],
  call_logs: ["requested", "contacted", "completed", "failed"],
  whatsapp_messages: ["requested", "queued", "sent", "failed"],
};

const isAdminTable = (value: FormDataEntryValue | null): value is AdminTable =>
  typeof value === "string" &&
  ["appointments", "contact_leads", "ai_leads", "call_logs", "whatsapp_messages"].includes(
    value,
  );

const assertAdmin = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in as an admin.");
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

export const updateAdminRecordStatus = async (formData: FormData) => {
  const table = formData.get("table");
  const id = formData.get("id");
  const status = formData.get("status");

  if (!isAdminTable(table) || typeof id !== "string" || typeof status !== "string") {
    throw new Error("Invalid status update request.");
  }

  if (!allowedStatuses[table].includes(status)) {
    throw new Error("Unsupported status for this record type.");
  }

  const { supabase, userId } = await assertAdmin();

  if (table === "appointments") {
    const { error } = await supabase
      .from("appointments")
      .update({ status: status as never, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }

  if (table === "contact_leads") {
    const { error } = await supabase
      .from("contact_leads")
      .update({ status: status as never })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }

  if (table === "ai_leads") {
    const { error } = await supabase
      .from("ai_leads")
      .update({ status })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }

  if (table === "call_logs") {
    const { error } = await supabase
      .from("call_logs")
      .update({ status })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }

  if (table === "whatsapp_messages") {
    const { error } = await supabase
      .from("whatsapp_messages")
      .update({ status })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }

  await writeAuditLog(supabase, {
    actorId: userId,
    actorType: "admin",
    eventType: "status_updated",
    entityType: table,
    entityId: id,
    summary: `Updated ${table} status to ${status}.`,
    metadata: {
      table,
      status,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/appointments");
  revalidatePath("/admin/leads");
  revalidatePath("/admin/ai-leads");
  revalidatePath("/admin/communications");
  revalidatePath("/admin/audit");
};

export const rescheduleAppointment = async (formData: FormData) => {
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

  const { supabase, userId } = await assertAdmin();

  const { error } = await supabase
    .from("appointments")
    .update({
      requested_at: requestedAt,
      status: "rescheduled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    actorId: userId,
    actorType: "admin",
    eventType: "status_updated",
    entityType: "appointments",
    entityId: id,
    summary: `Rescheduled appointment to ${requestedAt}.`,
    metadata: {
      table: "appointments",
      status: "rescheduled",
      requestedAt,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/appointments");
};
