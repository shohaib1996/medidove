"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit/log";
import { createClient } from "@/lib/supabase/server";
import { generateCareTasksFromSignals } from "@/lib/tasks/generator";

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

const refreshTasks = () => {
  revalidatePath("/admin/tasks");
  revalidatePath("/admin");
  revalidatePath("/admin/audit");
};

export const createCareTask = async (formData: FormData) => {
  const title = text(formData.get("title"));
  const description = text(formData.get("description"));
  const priority = text(formData.get("priority")) || "medium";
  const sourceType = text(formData.get("source_type")) || "manual";
  const sourceId = text(formData.get("source_id"));
  const patientId = text(formData.get("patient_id"));
  const assignedTo = text(formData.get("assigned_to"));
  const dueDate = text(formData.get("due_date"));
  const dueTime = text(formData.get("due_time"));

  if (!title) {
    throw new Error("Task title is required.");
  }

  if (!["low", "medium", "high", "urgent"].includes(priority)) {
    throw new Error("Choose a valid priority.");
  }

  const dueAt = dueDate
    ? new Date(`${dueDate}T${dueTime || "09:00"}:00`).toISOString()
    : null;
  const { supabase, userId } = await assertAdmin();
  const { data, error } = await supabase
    .from("care_tasks")
    .insert({
      title,
      description: description || null,
      priority,
      source_type: sourceType,
      source_id: sourceId || null,
      patient_id: patientId || null,
      assigned_to: assignedTo || null,
      due_at: dueAt,
      created_by: userId,
      status: "open",
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    actorId: userId,
    actorType: "admin",
    eventType: "care_task_created",
    entityType: "care_tasks",
    entityId: data.id,
    summary: `Created care task: ${title}.`,
    metadata: {
      priority,
      source_type: sourceType,
      source_id: sourceId || null,
      assigned_to: assignedTo || null,
    },
  });

  refreshTasks();
};

export const updateCareTaskStatus = async (formData: FormData) => {
  const id = text(formData.get("id"));
  const status = text(formData.get("status"));

  if (!id || !["open", "in_progress", "done", "cancelled"].includes(status)) {
    throw new Error("Choose a valid task status.");
  }

  const { supabase, userId } = await assertAdmin();
  const { error } = await supabase
    .from("care_tasks")
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
    eventType: "care_task_status_updated",
    entityType: "care_tasks",
    entityId: id,
    summary: `Updated care task status to ${status}.`,
    metadata: { status },
  });

  refreshTasks();
};

export const generateCareTasks = async () => {
  const { userId } = await assertAdmin();

  await generateCareTasksFromSignals(userId);
  refreshTasks();
};
