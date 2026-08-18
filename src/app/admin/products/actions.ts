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

const refreshProducts = () => {
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/admin/audit");
  revalidatePath("/sitemap.xml");
};

export const createProduct = async (formData: FormData) => {
  const name = text(formData.get("name"));
  const category = text(formData.get("category")) || "wellness";
  const description = text(formData.get("description"));
  const price = Number(text(formData.get("price")) || 0);
  const imageUrl = text(formData.get("image_url"));
  const stockStatus = text(formData.get("stock_status")) || "available";
  const requiresPrescription = formData.get("requires_prescription") === "on";
  const isFeatured = formData.get("is_featured") === "on";

  if (!name || !description) {
    throw new Error("Product name and description are required.");
  }

  const { supabase, userId } = await assertAdmin();
  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      slug: slugify(name),
      category,
      description,
      price,
      image_url: imageUrl || null,
      stock_status: stockStatus,
      requires_prescription: requiresPrescription,
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
    eventType: "product_created",
    entityType: "products",
    entityId: data.id,
    summary: `Created product ${name}.`,
    metadata: {
      category,
      requires_prescription: requiresPrescription,
    },
  });

  refreshProducts();
};

export const toggleProductStatus = async (formData: FormData) => {
  const id = text(formData.get("id"));
  const active = formData.get("active") === "true";
  const { supabase, userId } = await assertAdmin();
  const { error } = await supabase
    .from("products")
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
    eventType: active ? "product_activated" : "product_archived",
    entityType: "products",
    entityId: id,
    summary: `${active ? "Activated" : "Archived"} product.`,
  });

  refreshProducts();
};
