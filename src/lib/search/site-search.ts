import { fallbackDoctors, fallbackServices } from "@/lib/clinic/static-content";
import { createClient } from "@/lib/supabase/server";

export type SearchResultType = "service" | "doctor" | "department" | "knowledge";

export type SiteSearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  href: string;
  meta: string;
  score: number;
};

export type SiteSearchResponse = {
  query: string;
  results: SiteSearchResult[];
  grouped: Record<SearchResultType, SiteSearchResult[]>;
  safetyMessage: string | null;
};

const emergencySignals = [
  "chest pain",
  "can't breathe",
  "cannot breathe",
  "shortness of breath",
  "stroke",
  "heavy bleeding",
  "unconscious",
  "loss of consciousness",
  "severe allergic",
  "suicidal",
];

const normalize = (value: string) => value.trim().toLowerCase();

const includesAny = (text: string, terms: string[]) =>
  terms.some((term) => text.includes(term));

const getTerms = (query: string) =>
  normalize(query)
    .split(/\s+/)
    .map((term) => term.replace(/[^\w-]/g, ""))
    .filter((term) => term.length > 1);

const scoreResult = ({
  query,
  terms,
  title,
  description,
  meta,
}: {
  query: string;
  terms: string[];
  title: string;
  description: string;
  meta: string;
}) => {
  const haystack = normalize(`${title} ${description} ${meta}`);
  const titleText = normalize(title);
  let score = 0;

  if (titleText.includes(query)) {
    score += 8;
  }

  if (haystack.includes(query)) {
    score += 5;
  }

  terms.forEach((term) => {
    if (titleText.includes(term)) {
      score += 3;
    }

    if (haystack.includes(term)) {
      score += 1;
    }
  });

  return score;
};

const sortAndLimit = (results: SiteSearchResult[]) =>
  results
    .filter((result) => result.score > 0)
    .sort((first, second) => second.score - first.score)
    .slice(0, 12);

const groupResults = (results: SiteSearchResult[]) => ({
  service: results.filter((result) => result.type === "service"),
  doctor: results.filter((result) => result.type === "doctor"),
  department: results.filter((result) => result.type === "department"),
  knowledge: results.filter((result) => result.type === "knowledge"),
});

const fallbackSearch = (query: string, terms: string[]): SiteSearchResult[] => {
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

  return sortAndLimit([...services, ...doctors]);
};

export const searchSite = async (rawQuery: string): Promise<SiteSearchResponse> => {
  const query = normalize(rawQuery).slice(0, 120);
  const terms = getTerms(query);
  const safetyMessage = includesAny(query, emergencySignals)
    ? "This search includes emergency-like symptoms. MediDove AI can help route care, but urgent symptoms should be handled by emergency services or the nearest emergency department."
    : null;

  if (query.length < 2 || terms.length === 0) {
    return {
      query,
      results: [],
      grouped: groupResults([]),
      safetyMessage,
    };
  }

  const supabase = await createClient();
  const [
    { data: servicesData },
    { data: doctorsData },
    { data: departmentsData },
    { data: documentsData },
    { data: blogPostsData },
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
    supabase
      .from("ai_documents")
      .select("id, title, content, source_type")
      .limit(50),
    supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, content, category")
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

  const results = sortAndLimit([
    ...services,
    ...doctors,
    ...departments,
    ...documents,
    ...blogPosts,
  ]);
  const safeResults = results.length > 0 ? results : fallbackSearch(query, terms);

  return {
    query,
    results: safeResults,
    grouped: groupResults(safeResults),
    safetyMessage,
  };
};
