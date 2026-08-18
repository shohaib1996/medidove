import type { MetadataRoute } from "next";
import { getPublicBlogPosts } from "@/lib/blog/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://medidove.ai";

const publicRoutes = [
  "",
  "/about",
  "/service",
  "/doctor",
  "/packages",
  "/shop",
  "/testimonials",
  "/appointment",
  "/contact",
  "/blog",
  "/receptionist",
  "/engagement",
  "/feedback",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = await getPublicBlogPosts();

  const routes = publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : 0.7,
  }));

  const blogRoutes = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...routes, ...blogRoutes];
}
