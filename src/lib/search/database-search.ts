import { createClient } from "@/lib/supabase/server";
import { scoreResult, sortAndLimit } from "./result-utils";
import type { SiteSearchResult } from "./types";

export const searchDatabaseContent = async ({
  query,
  terms,
}: {
  query: string;
  terms: string[];
}): Promise<SiteSearchResult[]> => {
  const supabase = await createClient();
  const [
    { data: servicesData },
    { data: doctorsData },
    { data: departmentsData },
    { data: documentsData },
    { data: blogPostsData },
    { data: packagesData },
    { data: productsData },
    { data: testimonialsData },
  ] = await Promise.all([
    supabase
      .from("services")
      .select("id, title, slug, summary, description")
      .eq("is_active", true)
      .limit(50),
    supabase
      .from("doctors")
      .select("id, full_name, slug, specialty, bio, departments(name)")
      .eq("is_active", true)
      .limit(50),
    supabase
      .from("departments")
      .select("id, name, slug, description")
      .eq("is_active", true)
      .limit(50),
    supabase.from("ai_documents").select("id, title, content, source_type").limit(50),
    supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, content, category")
      .eq("is_published", true)
      .limit(50),
    supabase
      .from("health_packages")
      .select("id, name, description, slug, audience, features, badge")
      .eq("is_active", true)
      .limit(50),
    supabase
      .from("products")
      .select("id, name, slug, category, description")
      .eq("is_active", true)
      .limit(50),
    supabase
      .from("testimonials")
      .select("id, author_name, author_role, quote, category")
      .eq("is_published", true)
      .limit(50),
  ]);

  const services = (servicesData || []).map((service) => ({
    id: service.id,
    type: "service" as const,
    title: service.title,
    description: service.summary,
    href: `/service-details?service=${service.slug}`,
    meta: "Clinic service",
    score: scoreResult({
      query,
      terms,
      title: service.title,
      description: `${service.summary} ${service.description || ""}`,
      meta: "Clinic service",
    }),
  }));

  const doctors = (doctorsData || []).map((doctor) => {
    const department = Array.isArray(doctor.departments)
      ? doctor.departments[0]?.name
      : doctor.departments?.name;

    return {
      id: doctor.id,
      type: "doctor" as const,
      title: doctor.full_name,
      description: doctor.bio || doctor.specialty,
      href: `/doctor-details?doctor=${doctor.slug}`,
      meta: `${doctor.specialty}${department ? ` - ${department}` : ""}`,
      score: scoreResult({
        query,
        terms,
        title: doctor.full_name,
        description: `${doctor.specialty} ${doctor.bio || ""}`,
        meta: department || "",
      }),
    };
  });

  const departments = (departmentsData || []).map((department) => ({
    id: department.id,
    type: "department" as const,
    title: department.name,
    description:
      department.description ||
      "Department record managed from the MediDove admin dashboard.",
    href: `/service?department=${department.slug}`,
    meta: "Department",
    score: scoreResult({
      query,
      terms,
      title: department.name,
      description: department.description || "",
      meta: "Department",
    }),
  }));

  const documents = (documentsData || []).map((document) => ({
    id: document.id,
    type: "knowledge" as const,
    title: document.title,
    description: document.content.slice(0, 180),
    href: "/contact",
    meta: document.source_type,
    score: scoreResult({
      query,
      terms,
      title: document.title,
      description: document.content,
      meta: document.source_type,
    }),
  }));

  const blogPosts = (blogPostsData || []).map((post) => ({
    id: post.id,
    type: "knowledge" as const,
    title: post.title,
    description: post.excerpt,
    href: `/blog/${post.slug}`,
    meta: post.category,
    score: scoreResult({
      query,
      terms,
      title: post.title,
      description: `${post.excerpt} ${post.content}`,
      meta: post.category,
    }),
  }));

  const packages = (packagesData || []).map((item) => ({
    id: item.id,
    type: "package" as const,
    title: item.name,
    description: item.description,
    href: `/packages?package=${item.slug}`,
    meta: item.badge || "Package",
    score: scoreResult({
      query,
      terms,
      title: item.name,
      description: `${item.description} ${item.features.join(" ")}`,
      meta: item.audience || "",
    }),
  }));

  const testimonials = (testimonialsData || []).map((item) => ({
    id: item.id,
    type: "knowledge" as const,
    title: item.author_name,
    description: item.quote,
    href: "/testimonials",
    meta: item.category,
    score: scoreResult({
      query,
      terms,
      title: `${item.author_name} ${item.author_role || ""}`,
      description: item.quote,
      meta: item.category,
    }),
  }));

  const products = (productsData || []).map((item) => ({
    id: item.id,
    type: "product" as const,
    title: item.name,
    description: item.description,
    href: `/shop?product=${item.slug}`,
    meta: item.category,
    score: scoreResult({
      query,
      terms,
      title: item.name,
      description: item.description,
      meta: item.category,
    }),
  }));

  return sortAndLimit([
    ...services,
    ...doctors,
    ...departments,
    ...packages,
    ...products,
    ...documents,
    ...blogPosts,
    ...testimonials,
  ]);
};
