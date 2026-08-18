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

export const createBlogPost = async (formData: FormData) => {
  const title = text(formData.get("title"));
  const category = text(formData.get("category")) || "Clinic AI";
  const excerpt = text(formData.get("excerpt"));
  const content = text(formData.get("content"));
  const imageUrl = text(formData.get("image_url"));
  const authorName = text(formData.get("author_name")) || "MediDove Team";
  const isPublished = formData.get("is_published") === "on";

  if (!title || !excerpt || !content) {
    throw new Error("Title, excerpt, and content are required.");
  }

  const { supabase, userId } = await assertAdmin();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title,
      slug: slugify(title),
      category,
      excerpt,
      content,
      image_url: imageUrl || null,
      author_name: authorName,
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
      created_by: userId,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    actorId: userId,
    actorType: "admin",
    eventType: "blog_post_created",
    entityType: "blog_posts",
    entityId: data.id,
    summary: `Created blog post ${title}.`,
    metadata: {
      category,
      is_published: isPublished,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/admin/audit");
};

export const toggleBlogPostPublish = async (formData: FormData) => {
  const id = text(formData.get("id"));
  const publish = formData.get("publish") === "true";
  const { supabase, userId } = await assertAdmin();
  const { error } = await supabase
    .from("blog_posts")
    .update({
      is_published: publish,
      published_at: publish ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    actorId: userId,
    actorType: "admin",
    eventType: publish ? "blog_post_published" : "blog_post_unpublished",
    entityType: "blog_posts",
    entityId: id,
    summary: `${publish ? "Published" : "Unpublished"} blog post.`,
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/admin/audit");
};
