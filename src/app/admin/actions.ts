"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type AdminTable =
  | "appointments"
  | "contact_leads"
  | "call_logs"
  | "whatsapp_messages";

const allowedStatuses: Record<AdminTable, string[]> = {
  appointments: ["pending", "confirmed", "completed", "cancelled", "rescheduled"],
  contact_leads: ["new", "contacted", "converted", "closed", "spam"],
  call_logs: ["requested", "contacted", "completed", "failed"],
  whatsapp_messages: ["requested", "queued", "sent", "failed"],
};

const isAdminTable = (value: FormDataEntryValue | null): value is AdminTable =>
  typeof value === "string" &&
  ["appointments", "contact_leads", "call_logs", "whatsapp_messages"].includes(
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

  return supabase;
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

  const supabase = await assertAdmin();

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

  revalidatePath("/admin");
  revalidatePath("/admin/appointments");
  revalidatePath("/admin/leads");
};
