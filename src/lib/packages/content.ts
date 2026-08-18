import { createClient } from "@supabase/supabase-js";
import { getSupabaseBrowserEnv } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/database.types";

export type HealthPackage = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  duration: string;
  audience: string;
  features: string[];
  badge: string;
  imageUrl: string;
  isFeatured: boolean;
};

export const fallbackHealthPackages: HealthPackage[] = [
  {
    id: "fallback-family-wellness",
    name: "Family Wellness Screening",
    slug: "family-wellness-screening",
    description:
      "Annual preventive package for families with AI-assisted appointment intake and follow-up reminders.",
    price: 149,
    duration: "60 minutes",
    audience: "Families and preventive care patients",
    features: [
      "General physician consultation",
      "Vitals and basic screening",
      "AI-prepared intake summary",
      "WhatsApp reminder and follow-up",
    ],
    badge: "Popular",
    imageUrl: "/assets/img/blog/news-thumb-4.jpg",
    isFeatured: true,
  },
  {
    id: "fallback-dental-cleaning",
    name: "Dental Cleaning and Care Plan",
    slug: "dental-cleaning-care-plan",
    description:
      "Dental hygiene package with symptom intake, care coordinator follow-up, and recall reminders.",
    price: 89,
    duration: "45 minutes",
    audience: "Dental patients",
    features: [
      "Dental check and cleaning",
      "Pain and sensitivity intake",
      "Recall reminder campaign",
      "Optional dentist escalation",
    ],
    badge: "Dental",
    imageUrl: "/assets/img/blog/news-thumb-5.jpg",
    isFeatured: false,
  },
  {
    id: "fallback-heart-check",
    name: "Heart Health Check",
    slug: "heart-health-check",
    description:
      "Cardiology-oriented screening package with emergency-safe routing and staff-reviewed next steps.",
    price: 199,
    duration: "75 minutes",
    audience: "Adults monitoring heart health",
    features: [
      "Cardiology consultation request",
      "Basic vitals and risk questions",
      "AI routing note for staff",
      "Follow-up communication workflow",
    ],
    badge: "Screening",
    imageUrl: "/assets/img/blog/news-thumb-6.jpg",
    isFeatured: true,
  },
];

type HealthPackageRow = Pick<
  Database["public"]["Tables"]["health_packages"]["Row"],
  | "id"
  | "name"
  | "slug"
  | "description"
  | "price"
  | "duration"
  | "audience"
  | "features"
  | "badge"
  | "image_url"
  | "is_featured"
>;

const mapHealthPackage = (item: HealthPackageRow): HealthPackage => ({
  id: item.id,
  name: item.name,
  slug: item.slug,
  description: item.description,
  price: Number(item.price),
  duration: item.duration || "Clinic visit",
  audience: item.audience || "Clinic patients",
  features: item.features,
  badge: item.badge || "Care package",
  imageUrl: item.image_url || "/assets/img/blog/news-thumb-4.jpg",
  isFeatured: item.is_featured,
});

export const getHealthPackages = async (): Promise<HealthPackage[]> => {
  try {
    const { url, publishableKey } = getSupabaseBrowserEnv();
    const supabase = createClient<Database>(url, publishableKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data } = await supabase
      .from("health_packages")
      .select(
        "id, name, slug, description, price, duration, audience, features, badge, image_url, is_featured",
      )
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(12);

    if (!data?.length) {
      return fallbackHealthPackages;
    }

    return data.map(mapHealthPackage);
  } catch (error) {
    console.error("Health packages lookup failed:", error);
    return fallbackHealthPackages;
  }
};
