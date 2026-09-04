import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const text = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

export const assertAdmin = async () => {
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

export const refreshContent = () => {
  revalidatePath("/admin/content");
  revalidatePath("/admin");
  revalidatePath("/admin/analytics");
  revalidatePath("/service");
  revalidatePath("/doctor");
  revalidatePath("/admin/ai-leads");
  revalidatePath("/admin/opt-outs");
  revalidatePath("/admin/feedback");
  revalidatePath("/admin/schedule");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/staff");
  revalidatePath("/contact");
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
};
