"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin, refreshContent, slugify, text } from "./action-utils";

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
