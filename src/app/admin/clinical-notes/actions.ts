"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit/log";
import { createClinicalNoteDraft } from "@/lib/clinical/notes";
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

export const createClinicalNote = async (formData: FormData) => {
  const patientName = text(formData.get("patient_name"));
  const visitType = text(formData.get("visit_type")) || "consultation";
  const appointmentId = text(formData.get("appointment_id"));
  const patientId = text(formData.get("patient_id"));
  const rawNote = text(formData.get("raw_note"));

  if (!patientName || rawNote.length < 20) {
    throw new Error("Patient name and a detailed note are required.");
  }

  const { supabase, userId } = await assertAdmin();
  const draft = createClinicalNoteDraft(rawNote);
  const { data, error } = await supabase
    .from("clinical_notes")
    .insert({
      patient_id: patientId || null,
      appointment_id: appointmentId || null,
      author_id: userId,
      patient_name: patientName,
      visit_type: visitType,
      raw_note: rawNote,
      subjective: draft.subjective,
      objective: draft.objective,
      assessment: draft.assessment,
      care_plan: draft.carePlan,
      risk_flags: draft.riskFlags,
      status: "draft",
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    actorId: userId,
    actorType: "admin",
    eventType: "clinical_note_created",
    entityType: "clinical_notes",
    entityId: data.id,
    summary: `Created AI drafted clinical note for ${patientName}.`,
    metadata: {
      visit_type: visitType,
      risk_flags: draft.riskFlags,
    },
  });

  revalidatePath("/admin/clinical-notes");
  revalidatePath("/admin/audit");
};

export const updateClinicalNoteStatus = async (formData: FormData) => {
  const id = text(formData.get("id"));
  const status = text(formData.get("status"));

  if (!id || !["draft", "reviewed", "archived"].includes(status)) {
    throw new Error("Choose a valid clinical note status.");
  }

  const { supabase, userId } = await assertAdmin();
  const { error } = await supabase
    .from("clinical_notes")
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
    eventType: "clinical_note_status_updated",
    entityType: "clinical_notes",
    entityId: id,
    summary: `Updated clinical note status to ${status}.`,
    metadata: { status },
  });

  revalidatePath("/admin/clinical-notes");
  revalidatePath("/admin/audit");
};
