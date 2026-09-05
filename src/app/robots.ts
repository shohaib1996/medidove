import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.medidove.health";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/service",
          "/doctor",
          "/packages",
          "/shop",
          "/testimonials",
          "/appointment",
          "/contact",
          "/blog",
          "/blog/",
          "/receptionist",
          "/engagement",
          "/unsubscribe",
          "/privacy",
          "/terms",
        ],
        disallow: [
          "/admin",
          "/admin/",
          "/portal",
          "/portal/",
          "/doctor-portal",
          "/api",
          "/api/",
          "/auth",
          "/auth/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
