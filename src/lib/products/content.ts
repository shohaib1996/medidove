import { createClient } from "@supabase/supabase-js";
import { getSupabaseBrowserEnv } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/database.types";

export type PublicProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  stockStatus: string;
  requiresPrescription: boolean;
  isFeatured: boolean;
};

export const fallbackProducts: PublicProduct[] = [
  {
    id: "fallback-blood-pressure-monitor",
    name: "Digital Blood Pressure Monitor",
    slug: "digital-blood-pressure-monitor",
    category: "Home monitoring",
    description:
      "Home blood pressure tracking device for patients who need staff-guided monitoring between clinic visits.",
    price: 59,
    imageUrl: "/assets/img/shop/img1.jpg",
    stockStatus: "available",
    requiresPrescription: false,
    isFeatured: true,
  },
  {
    id: "fallback-glucose-log-kit",
    name: "Glucose Log Starter Kit",
    slug: "glucose-log-starter-kit",
    category: "Wellness supplies",
    description:
      "Patient-friendly tracking kit for wellness follow-ups and care coordinator review.",
    price: 29,
    imageUrl: "/assets/img/shop/img2.jpg",
    stockStatus: "available",
    requiresPrescription: false,
    isFeatured: false,
  },
  {
    id: "fallback-dental-care-bundle",
    name: "Dental Care Bundle",
    slug: "dental-care-bundle",
    category: "Dental",
    description:
      "Preventive dental supplies bundle paired with recall reminders and optional dental cleaning booking.",
    price: 24,
    imageUrl: "/assets/img/shop/img3.jpg",
    stockStatus: "available",
    requiresPrescription: false,
    isFeatured: true,
  },
];

type ProductRow = Pick<
  Database["public"]["Tables"]["products"]["Row"],
  | "id"
  | "name"
  | "slug"
  | "category"
  | "description"
  | "price"
  | "image_url"
  | "stock_status"
  | "requires_prescription"
  | "is_featured"
>;

const mapProduct = (item: ProductRow): PublicProduct => ({
  id: item.id,
  name: item.name,
  slug: item.slug,
  category: item.category,
  description: item.description,
  price: Number(item.price),
  imageUrl: item.image_url || "/assets/img/shop/img1.jpg",
  stockStatus: item.stock_status,
  requiresPrescription: item.requires_prescription,
  isFeatured: item.is_featured,
});

export const getPublicProducts = async (): Promise<PublicProduct[]> => {
  try {
    const { url, publishableKey } = getSupabaseBrowserEnv();
    const supabase = createClient<Database>(url, publishableKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data } = await supabase
      .from("products")
      .select(
        "id, name, slug, category, description, price, image_url, stock_status, requires_prescription, is_featured",
      )
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(24);

    if (!data?.length) {
      return fallbackProducts;
    }

    return data.map(mapProduct);
  } catch (error) {
    console.error("Products lookup failed:", error);
    return fallbackProducts;
  }
};
