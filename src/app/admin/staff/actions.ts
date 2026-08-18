"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit/log";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/database.types";

const staffRoles: UserRole[] = ["admin", "doctor", "receptionist"];
const staffStatuses = ["active", "inactive", "invited"] as const;

type StaffStatus = (typeof staffStatuses)[number];

const text = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

const normalizeRole = (value: string): UserRole =>
  staffRoles.includes(value as UserRole) ? (value as UserRole) : "receptionist";

const normalizeStatus = (value: string): StaffStatus =>
  staffStatuses.includes(value as StaffStatus)
    ? (value as StaffStatus)
    : "active";

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

const refreshStaff = () => {
  revalidatePath("/admin/staff");
  revalidatePath("/admin/tasks");
  revalidatePath("/admin/audit");
};

export const createStaffMember = async (formData: FormData) => {
  const fullName = text(formData.get("full_name"));
  const email = text(formData.get("email")).toLowerCase();
  const phone = text(formData.get("phone"));
  const role = normalizeRole(text(formData.get("role")));
  const status = normalizeStatus(text(formData.get("status")));
  const notes = text(formData.get("notes"));

  if (!fullName || !email) {
    throw new Error("Staff name and email are required.");
  }

  const { supabase, userId } = await assertAdmin();
  const { data: linkedProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("full_name", fullName)
    .maybeSingle();

  const { data, error } = await supabase
    .from("staff_members")
    .insert({
      profile_id: linkedProfile?.id || null,
      full_name: fullName,
      email,
      phone: phone || null,
      role,
      status,
      notes: notes || null,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    actorId: userId,
    actorType: "admin",
    eventType: "staff_member_created",
    entityType: "staff_members",
    entityId: data.id,
    summary: `Created staff member ${fullName}.`,
    metadata: {
      role,
      status,
    },
  });

  refreshStaff();
};

export const updateStaffStatus = async (formData: FormData) => {
  const id = text(formData.get("id"));
  const status = normalizeStatus(text(formData.get("status")));
  const { supabase, userId } = await assertAdmin();
  const { error } = await supabase
    .from("staff_members")
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
    eventType: "staff_status_updated",
    entityType: "staff_members",
    entityId: id,
    summary: `Updated staff status to ${status}.`,
  });

  refreshStaff();
};
