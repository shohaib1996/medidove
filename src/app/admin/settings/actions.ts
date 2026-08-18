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

export const updateClinicSettings = async (formData: FormData) => {
  const clinicName = text(formData.get("clinic_name"));
  const phone = text(formData.get("phone"));
  const email = text(formData.get("email"));
  const address = text(formData.get("address"));
  const businessHours = text(formData.get("business_hours"));
  const whatsappNumber = text(formData.get("whatsapp_number"));
  const emergencyNotice = text(formData.get("emergency_notice"));
  const aiDisclosure = text(formData.get("ai_disclosure"));

  if (!clinicName || !phone || !email) {
    throw new Error("Clinic name, phone, and email are required.");
  }

  const { supabase, userId } = await assertAdmin();
  const { error } = await supabase.from("clinic_settings").upsert({
    id: "default",
    clinic_name: clinicName,
    phone,
    email,
    address: address || null,
    business_hours: businessHours || null,
    whatsapp_number: whatsappNumber || null,
    emergency_notice: emergencyNotice || null,
    ai_disclosure: aiDisclosure || null,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    actorId: userId,
    actorType: "admin",
    eventType: "clinic_settings_updated",
    entityType: "clinic_settings",
    entityId: "default",
    summary: "Updated public clinic settings.",
    metadata: {
      clinic_name: clinicName,
      email,
    },
  });

  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/audit");
};
