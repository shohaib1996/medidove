import { fallbackDoctors, fallbackServices } from "@/lib/clinic/static-content";
import { fallbackHealthPackages } from "@/lib/packages/content";
import { fallbackProducts } from "@/lib/products/content";
import { fallbackTestimonials } from "@/lib/testimonials/content";
import { scoreResult, sortAndLimit } from "./result-utils";
import type { SiteSearchResult } from "./types";

export const fallbackSearch = (
  query: string,
  terms: string[],
): SiteSearchResult[] => {
  const services = fallbackServices.map((service, index) => {
    const description = `${service.description} ${service.aiUse}`;

    return {
      id: `fallback-service-${index}`,
      type: "service" as const,
      title: service.title,
      description: service.description,
      href: "/service",
      meta: "Clinic service",
      score: scoreResult({
        query,
        terms,
        title: service.title,
        description,
        meta: "Clinic service",
      }),
    };
  });

  const doctors = fallbackDoctors.map((doctor, index) => {
    const description = `${doctor.specialty} ${doctor.department} ${doctor.languages}`;

    return {
      id: `fallback-doctor-${index}`,
      type: "doctor" as const,
      title: doctor.name,
      description: doctor.specialty,
      href: "/doctor",
      meta: `${doctor.department} - ${doctor.availability}`,
      score: scoreResult({
        query,
        terms,
        title: doctor.name,
        description,
        meta: doctor.department,
      }),
    };
  });

  const packages = fallbackHealthPackages.map((item) => ({
    id: `fallback-package-${item.slug}`,
    type: "package" as const,
    title: item.name,
    description: item.description,
    href: "/packages",
    meta: item.badge,
    score: scoreResult({
      query,
      terms,
      title: item.name,
      description: `${item.description} ${item.features.join(" ")}`,
      meta: item.audience,
    }),
  }));

  const testimonials = fallbackTestimonials.map((item) => ({
    id: `fallback-testimonial-${item.id}`,
    type: "knowledge" as const,
    title: item.authorName,
    description: item.quote,
    href: "/testimonials",
    meta: item.category,
    score: scoreResult({
      query,
      terms,
      title: `${item.authorName} ${item.authorRole}`,
      description: item.quote,
      meta: item.category,
    }),
  }));

  const products = fallbackProducts.map((item) => ({
    id: `fallback-product-${item.slug}`,
    type: "product" as const,
    title: item.name,
    description: item.description,
    href: "/shop",
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
    ...packages,
    ...products,
    ...testimonials,
  ]);
};
