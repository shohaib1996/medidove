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

export const updateFeedbackStatus = async (formData: FormData) => {
  const id = text(formData.get("id"));
  const status = text(formData.get("status"));

  if (!id || !["new", "reviewing", "resolved", "archived"].includes(status)) {
    throw new Error("Choose a valid feedback status.");
  }

  const { supabase, userId } = await assertAdmin();
  const { error } = await supabase
    .from("patient_feedback")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    actorId: userId,
    actorType: "admin",
    eventType: "feedback_status_updated",
    entityType: "patient_feedback",
    entityId: id,
    summary: `Updated patient feedback status to ${status}.`,
    metadata: { status },
  });

  revalidatePath("/admin/feedback");
  revalidatePath("/admin/audit");
};
