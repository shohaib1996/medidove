"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit/log";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { UserRole } from "@/lib/supabase/database.types";
import { DEFAULT_LOGIN_PASSWORD } from "./constants";

const US_AREA_CODES = [
  201, 212, 213, 214, 216, 305, 310, 312, 404, 415, 469, 480, 502, 503, 512,
  602, 610, 617, 619, 646, 702, 704, 713, 718, 720, 786, 813, 858, 904, 916,
  919, 973,
];

const randomUsPhone = () => {
  const areaCode = US_AREA_CODES[Math.floor(Math.random() * US_AREA_CODES.length)];
  const line = String(Math.floor(Math.random() * 100)).padStart(2, "0");
  return `+1${areaCode}555${"01"}${line}`;
};

const kebabCase = (value: string) =>
  value
    .replace(/^Dr\.\s*/i, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const assertEmailAvailable = async (
  adminSupabase: ReturnType<typeof createAdminClient>,
  email: string,
) => {
  const { data: existingUsers } = await adminSupabase.auth.admin.listUsers({
    perPage: 200,
  });
  const taken = (existingUsers?.users || []).some(
    (existingUser) => existingUser.email?.toLowerCase() === email.toLowerCase(),
  );

  if (taken) {
    throw new Error(`${email} is already used by another login.`);
  }
};

const staffRoles: UserRole[] = ["admin", "doctor"];
const staffStatuses = ["active", "inactive", "invited"] as const;

type StaffStatus = (typeof staffStatuses)[number];

const text = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

const normalizeRole = (value: string): UserRole =>
  staffRoles.includes(value as UserRole) ? (value as UserRole) : "admin";

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
  revalidatePath("/admin/audit");
};

export const createStaffMember = async (formData: FormData) => {
  const fullName = text(formData.get("full_name"));
  const email = text(formData.get("email")).toLowerCase();
  const role = normalizeRole(text(formData.get("role")));
  const status = normalizeStatus(text(formData.get("status")));
  const notes = text(formData.get("notes"));

  if (!fullName || !email) {
    throw new Error("Staff name and email are required.");
  }

  if (!isEmail(email)) {
    throw new Error("Enter a valid email address.");
  }

  const { supabase, userId } = await assertAdmin();
  const adminSupabase = createAdminClient();

  await assertEmailAvailable(adminSupabase, email);

  const { data: created, error: createUserError } =
    await adminSupabase.auth.admin.createUser({
      email,
      password: DEFAULT_LOGIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: fullName, role },
    });

  if (createUserError || !created?.user) {
    throw new Error(createUserError?.message || "Could not create staff login.");
  }

  const profileId = created.user.id;
  const phone = randomUsPhone();

  const { error: profileError } = await adminSupabase.from("profiles").upsert({
    id: profileId,
    full_name: fullName,
    phone,
    role,
  });

  if (profileError) {
    throw new Error(profileError.message);
  }

  const { data, error } = await supabase
    .from("staff_members")
    .insert({
      profile_id: profileId,
      full_name: fullName,
      email,
      phone,
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
    summary: `Created staff member ${fullName} with login ${email}.`,
    metadata: {
      role,
      status,
      email,
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

export const deleteStaffMember = async (formData: FormData) => {
  const id = text(formData.get("id"));
  const { supabase, userId } = await assertAdmin();

  const { data: existing } = await supabase
    .from("staff_members")
    .select("full_name")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("staff_members").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    actorId: userId,
    actorType: "admin",
    eventType: "staff_member_deleted",
    entityType: "staff_members",
    entityId: id,
    summary: `Deleted staff member ${existing?.full_name || id}.`,
  });

  refreshStaff();
};

export const createDoctor = async (formData: FormData) => {
  const fullName = text(formData.get("full_name"));
  const email = text(formData.get("email")).toLowerCase();
  const departmentId = text(formData.get("department_id"));
  const specialty = text(formData.get("specialty"));
  const bio = text(formData.get("bio"));
  const consultationFeeRaw = text(formData.get("consultation_fee"));
  const imageUrl = text(formData.get("image_url"));

  if (!fullName || !email || !departmentId || !specialty) {
    throw new Error(
      "Doctor name, email, department, and specialty are required.",
    );
  }

  if (!isEmail(email)) {
    throw new Error("Enter a valid email address.");
  }

  const consultationFee = consultationFeeRaw
    ? Number.parseFloat(consultationFeeRaw)
    : null;

  const { supabase, userId } = await assertAdmin();
  const adminSupabase = createAdminClient();

  const baseSlug = kebabCase(fullName) || "doctor";
  let slug = baseSlug;
  let slugSuffix = 2;
  while (true) {
    const { data: existingSlug } = await supabase
      .from("doctors")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existingSlug) break;
    slug = `${baseSlug}-${slugSuffix}`;
    slugSuffix += 1;
  }

  await assertEmailAvailable(adminSupabase, email);

  const { data: created, error: createUserError } =
    await adminSupabase.auth.admin.createUser({
      email,
      password: DEFAULT_LOGIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: fullName, role: "doctor" },
    });

  if (createUserError || !created?.user) {
    throw new Error(createUserError?.message || "Could not create doctor login.");
  }

  const profileId = created.user.id;

  const { error: profileError } = await adminSupabase.from("profiles").upsert({
    id: profileId,
    full_name: fullName,
    phone: randomUsPhone(),
    role: "doctor",
  });

  if (profileError) {
    throw new Error(profileError.message);
  }

  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .insert({
      profile_id: profileId,
      department_id: departmentId,
      full_name: fullName,
      slug,
      specialty,
      bio: bio || null,
      consultation_fee: consultationFee,
      image_url: imageUrl || null,
      is_active: true,
    })
    .select("id")
    .single();

  if (doctorError) {
    throw new Error(doctorError.message);
  }

  await writeAuditLog(supabase, {
    actorId: userId,
    actorType: "admin",
    eventType: "doctor_created",
    entityType: "doctors",
    entityId: doctor.id,
    summary: `Created doctor ${fullName} with login ${email}.`,
    metadata: { email, specialty },
  });

  revalidatePath("/admin/staff");
  revalidatePath("/admin/schedule");
  revalidatePath("/doctor");
};
