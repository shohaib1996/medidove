"use server";

import { revalidatePath } from "next/cache";
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

  return supabase;
};

const refreshContent = () => {
  revalidatePath("/admin/content");
  revalidatePath("/service");
  revalidatePath("/doctor");
};

export const createDepartment = async (formData: FormData) => {
  const name = text(formData.get("name"));
  const description = text(formData.get("description"));

  if (!name) {
    throw new Error("Department name is required.");
  }

  const supabase = await assertAdmin();
  const { error } = await supabase.from("departments").insert({
    name,
    slug: slugify(name),
    description: description || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  refreshContent();
};

export const createService = async (formData: FormData) => {
  const title = text(formData.get("title"));
  const summary = text(formData.get("summary"));
  const description = text(formData.get("description"));
  const departmentId = text(formData.get("department_id"));

  if (!title || !summary) {
    throw new Error("Service title and summary are required.");
  }

  const supabase = await assertAdmin();
  const { error } = await supabase.from("services").insert({
    department_id: departmentId || null,
    title,
    slug: slugify(title),
    summary,
    description: description || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  refreshContent();
};

export const createDoctor = async (formData: FormData) => {
  const fullName = text(formData.get("full_name"));
  const specialty = text(formData.get("specialty"));
  const bio = text(formData.get("bio"));
  const imageUrl = text(formData.get("image_url"));
  const departmentId = text(formData.get("department_id"));

  if (!fullName || !specialty) {
    throw new Error("Doctor name and specialty are required.");
  }

  const supabase = await assertAdmin();
  const { error } = await supabase.from("doctors").insert({
    department_id: departmentId || null,
    full_name: fullName,
    slug: slugify(fullName),
    specialty,
    bio: bio || null,
    image_url: imageUrl || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  refreshContent();
};

export const createKnowledgeDocument = async (formData: FormData) => {
  const title = text(formData.get("title"));
  const content = text(formData.get("content"));
  const sourceType = text(formData.get("source_type")) || "faq";

  if (!title || !content) {
    throw new Error("Knowledge title and content are required.");
  }

  const supabase = await assertAdmin();
  const { error } = await supabase.from("ai_documents").insert({
    source_type: sourceType,
    title,
    content,
    metadata: {
      managed_by: "admin_content_page",
      searchable_without_embeddings: true,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/content");
};
