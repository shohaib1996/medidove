import { createClient } from "@supabase/supabase-js";
import { getSupabaseBrowserEnv } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/database.types";

export type PublicBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  authorName: string;
  publishedAt: string;
};

export const fallbackBlogPosts: PublicBlogPost[] = [
  {
    id: "fallback-ai-receptionist",
    title: "How AI receptionists reduce missed clinic calls",
    slug: "ai-receptionist-missed-calls",
    excerpt:
      "A practical look at using voice AI to capture appointment requests, callback tasks, and patient questions after hours.",
    content:
      "AI receptionists can support clinics by collecting patient name, phone number, appointment reason, and preferred timing. The goal is not medical diagnosis. The goal is better routing, faster staff follow-up, and clearer appointment operations.",
    category: "AI Reception",
    imageUrl: "/assets/img/blog/news-thumb-1.jpg",
    authorName: "MediDove Team",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "fallback-whatsapp-reminders",
    title: "Building consent-aware WhatsApp reminders for patients",
    slug: "consent-aware-whatsapp-reminders",
    excerpt:
      "Patient messaging works best when reminders are opt-in, template-safe, and easy to opt out from.",
    content:
      "Clinics can use WhatsApp for appointment confirmations, reminders, follow-ups, and feedback requests. Consent records and opt-out language are core parts of a safe patient engagement workflow.",
    category: "Patient Engagement",
    imageUrl: "/assets/img/blog/news-thumb-2.jpg",
    authorName: "MediDove Team",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "fallback-smart-intake",
    title: "Smart appointment intake without diagnosis claims",
    slug: "smart-intake-without-diagnosis",
    excerpt:
      "AI can help route patients to the right department while keeping emergency and clinical safety boundaries clear.",
    content:
      "A safe intake assistant can classify routine requests, recommend a department, and warn patients about urgent symptoms. It should avoid diagnosis and direct emergency-like symptoms to emergency services.",
    category: "Smart Intake",
    imageUrl: "/assets/img/blog/news-thumb-3.jpg",
    authorName: "MediDove Team",
    publishedAt: new Date().toISOString(),
  },
];

export const getPublicBlogPosts = async (): Promise<PublicBlogPost[]> => {
  try {
    const { url, publishableKey } = getSupabaseBrowserEnv();
    const supabase = createClient<Database>(url, publishableKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data } = await supabase
      .from("blog_posts")
      .select(
        "id, title, slug, excerpt, content, category, image_url, author_name, published_at, created_at",
      )
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(12);

    if (!data?.length) {
      return fallbackBlogPosts;
    }

    return data.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      imageUrl: post.image_url || "/assets/img/blog/news-thumb-1.jpg",
      authorName: post.author_name || "MediDove Team",
      publishedAt: post.published_at || post.created_at,
    }));
  } catch (error) {
    console.error("Blog posts lookup failed:", error);
    return fallbackBlogPosts;
  }
};
