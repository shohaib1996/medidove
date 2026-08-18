import { createClient } from "@supabase/supabase-js";
import { getSupabaseBrowserEnv } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/database.types";

export type PublicTestimonial = {
  id: string;
  authorName: string;
  authorRole: string;
  quote: string;
  rating: number;
  category: string;
  imageUrl: string;
  isFeatured: boolean;
};

export const fallbackTestimonials: PublicTestimonial[] = [
  {
    id: "fallback-clinic-manager",
    authorName: "Nadia Morgan",
    authorRole: "Clinic Operations Manager",
    quote:
      "MediDove gives our front desk a structured view of appointment requests, call summaries, and patient follow-ups without pretending to replace clinical judgment.",
    rating: 5,
    category: "Operations",
    imageUrl: "/assets/img/testimonials/testi-author-icon.png",
    isFeatured: true,
  },
  {
    id: "fallback-dental-coordinator",
    authorName: "Samuel Reed",
    authorRole: "Dental Care Coordinator",
    quote:
      "The AI intake workflow helps us separate routine dental bookings from requests that need staff review, so the team can respond faster.",
    rating: 5,
    category: "Dental",
    imageUrl: "/assets/img/blog/details/author.png",
    isFeatured: false,
  },
  {
    id: "fallback-admin-lead",
    authorName: "Amara Chen",
    authorRole: "Healthcare Admin Lead",
    quote:
      "The strongest part is the audit-friendly admin dashboard. We can see appointments, WhatsApp opt-ins, campaigns, and AI tasks in one place.",
    rating: 5,
    category: "Admin",
    imageUrl: "/assets/img/blog/details/me.jpg",
    isFeatured: true,
  },
];

type TestimonialRow = Pick<
  Database["public"]["Tables"]["testimonials"]["Row"],
  | "id"
  | "author_name"
  | "author_role"
  | "quote"
  | "rating"
  | "category"
  | "image_url"
  | "is_featured"
>;

const mapTestimonial = (item: TestimonialRow): PublicTestimonial => ({
  id: item.id,
  authorName: item.author_name,
  authorRole: item.author_role || "Patient",
  quote: item.quote,
  rating: item.rating,
  category: item.category,
  imageUrl: item.image_url || "/assets/img/testimonials/testi-author-icon.png",
  isFeatured: item.is_featured,
});

export const getPublicTestimonials = async (): Promise<PublicTestimonial[]> => {
  try {
    const { url, publishableKey } = getSupabaseBrowserEnv();
    const supabase = createClient<Database>(url, publishableKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data } = await supabase
      .from("testimonials")
      .select(
        "id, author_name, author_role, quote, rating, category, image_url, is_featured",
      )
      .eq("is_published", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(12);

    if (!data?.length) {
      return fallbackTestimonials;
    }

    return data.map(mapTestimonial);
  } catch (error) {
    console.error("Testimonials lookup failed:", error);
    return fallbackTestimonials;
  }
};
