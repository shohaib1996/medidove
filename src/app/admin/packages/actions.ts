"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit/log";
import { createClient } from "@/lib/supabase/server";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

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

const refreshPackages = () => {
  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  revalidatePath("/admin/audit");
  revalidatePath("/sitemap.xml");
};

export const createHealthPackage = async (formData: FormData) => {
  const name = text(formData.get("name"));
  const description = text(formData.get("description"));
  const price = Number(text(formData.get("price")) || 0);
  const duration = text(formData.get("duration"));
  const audience = text(formData.get("audience"));
  const badge = text(formData.get("badge")) || "Care package";
  const imageUrl = text(formData.get("image_url"));
  const features = text(formData.get("features"))
    .split("\n")
    .map((feature) => feature.trim())
    .filter(Boolean);
  const isFeatured = formData.get("is_featured") === "on";

  if (!name || !description || features.length === 0) {
    throw new Error("Name, description, and at least one feature are required.");
  }

  const { supabase, userId } = await assertAdmin();
  const { data, error } = await supabase
    .from("health_packages")
    .insert({
      name,
      slug: slugify(name),
      description,
      price,
      duration: duration || null,
      audience: audience || null,
      features,
      badge,
      image_url: imageUrl || null,
      is_featured: isFeatured,
      is_active: true,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    actorId: userId,
    actorType: "admin",
    eventType: "health_package_created",
    entityType: "health_packages",
    entityId: data.id,
    summary: `Created health package ${name}.`,
    metadata: {
      price,
      is_featured: isFeatured,
    },
  });

  refreshPackages();
};

export const toggleHealthPackageStatus = async (formData: FormData) => {
  const id = text(formData.get("id"));
  const active = formData.get("active") === "true";
  const { supabase, userId } = await assertAdmin();
  const { error } = await supabase
    .from("health_packages")
    .update({
      is_active: active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    actorId: userId,
    actorType: "admin",
    eventType: active ? "health_package_activated" : "health_package_archived",
    entityType: "health_packages",
    entityId: id,
    summary: `${active ? "Activated" : "Archived"} health package.`,
  });

  refreshPackages();
};
