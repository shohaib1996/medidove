"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit/log";
import { createClient } from "@/lib/supabase/server";

const text = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

const clampRating = (value: number) => Math.min(5, Math.max(1, value || 5));

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

const refreshTestimonials = () => {
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/admin/audit");
  revalidatePath("/sitemap.xml");
};

export const createTestimonial = async (formData: FormData) => {
  const authorName = text(formData.get("author_name"));
  const authorRole = text(formData.get("author_role"));
  const quote = text(formData.get("quote"));
  const category = text(formData.get("category")) || "patient_experience";
  const imageUrl = text(formData.get("image_url"));
  const rating = clampRating(Number(text(formData.get("rating")) || 5));
  const isFeatured = formData.get("is_featured") === "on";
  const isPublished = formData.get("is_published") === "on";

  if (!authorName || !quote) {
    throw new Error("Author name and quote are required.");
  }

  const { supabase, userId } = await assertAdmin();
  const { data, error } = await supabase
    .from("testimonials")
    .insert({
      author_name: authorName,
      author_role: authorRole || null,
      quote,
      rating,
      category,
      image_url: imageUrl || null,
      is_featured: isFeatured,
      is_published: isPublished,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    actorId: userId,
    actorType: "admin",
    eventType: "testimonial_created",
    entityType: "testimonials",
    entityId: data.id,
    summary: `Created testimonial from ${authorName}.`,
    metadata: {
      rating,
      is_published: isPublished,
    },
  });

  refreshTestimonials();
};

export const toggleTestimonialPublish = async (formData: FormData) => {
  const id = text(formData.get("id"));
  const publish = formData.get("publish") === "true";
  const { supabase, userId } = await assertAdmin();
  const { error } = await supabase
    .from("testimonials")
    .update({
      is_published: publish,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    actorId: userId,
    actorType: "admin",
    eventType: publish ? "testimonial_published" : "testimonial_unpublished",
    entityType: "testimonials",
    entityId: id,
    summary: `${publish ? "Published" : "Unpublished"} testimonial.`,
  });

  refreshTestimonials();
};
