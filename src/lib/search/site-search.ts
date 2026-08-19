import { fallbackDoctors, fallbackServices } from "@/lib/clinic/static-content";
import { fallbackHealthPackages } from "@/lib/packages/content";
import { fallbackProducts } from "@/lib/products/content";
import { fallbackTestimonials } from "@/lib/testimonials/content";
import { generateOpenAIText } from "@/lib/ai/openai";
import { createClient } from "@/lib/supabase/server";

export type SearchResultType =
  | "service"
  | "doctor"
  | "department"
  | "package"
  | "product"
  | "knowledge";

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
  intent: string | null;
  expandedTerms: string[];
  provider: "rules" | "openai";
  results: SiteSearchResult[];
  grouped: Record<SearchResultType, SiteSearchResult[]>;
  safetyMessage: string | null;
};

type SearchProfile = {
  intent: string | null;
  expandedTerms: string[];
  provider: "rules" | "openai";
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

const semanticHints = [
  {
    signals: ["tooth", "teeth", "dental", "gum", "jaw", "cavity"],
    terms: ["dental", "dentist", "cleaning", "tooth", "gum"],
    intent: "dental_care",
  },
  {
    signals: ["child", "baby", "kid", "infant", "fever", "vaccination"],
    terms: ["pediatrics", "pediatrician", "child", "vaccination", "parent"],
    intent: "pediatric_care",
  },
  {
    signals: ["headache", "migraine", "seizure", "nerve", "numb", "dizzy"],
    terms: ["neurology", "neurologist", "specialist", "nerve", "headache"],
    intent: "neurology",
  },
  {
    signals: ["xray", "x-ray", "scan", "imaging", "radiology", "diagnostic"],
    terms: ["radiology", "imaging", "scan", "diagnostics"],
    intent: "radiology",
  },
  {
    signals: ["surgery", "injury", "operation", "wound"],
    terms: ["surgery", "surgeon", "consultant", "injury"],
    intent: "surgery",
  },
  {
    signals: ["heart", "cardiac", "pressure", "blood", "checkup"],
    terms: ["general", "medicine", "primary", "care", "checkup"],
    intent: "general_medicine",
  },
  {
    signals: ["call", "phone", "voice", "receptionist", "elevenlabs"],
    terms: ["receptionist", "voice", "call", "appointment", "ai"],
    intent: "ai_receptionist",
  },
  {
    signals: ["whatsapp", "sms", "reminder", "followup", "follow-up"],
    terms: ["whatsapp", "sms", "reminder", "engagement", "follow"],
    intent: "patient_engagement",
  },
];

const getRuleBasedSearchProfile = (query: string, terms: string[]): SearchProfile => {
  const matchedHints = semanticHints.filter((hint) =>
    hint.signals.some((signal) => query.includes(signal)),
  );
  const expandedTerms = Array.from(
    new Set([...terms, ...matchedHints.flatMap((hint) => hint.terms)]),
  ).slice(0, 14);

  return {
    intent: matchedHints[0]?.intent || null,
    expandedTerms,
    provider: "rules",
  };
};

const parseOpenAIProfile = (
  text: string,
  fallback: SearchProfile,
): SearchProfile | null => {
  try {
    const jsonText = text.match(/\{[\s\S]*\}/)?.[0] || text;
    const parsed = JSON.parse(jsonText) as Partial<SearchProfile>;
    const aiTerms = Array.isArray(parsed.expandedTerms)
      ? parsed.expandedTerms
          .filter((term): term is string => typeof term === "string")
          .map((term) => normalize(term))
          .filter((term) => term.length > 1)
      : [];

    return {
      intent:
        typeof parsed.intent === "string" && parsed.intent.trim()
          ? normalize(parsed.intent)
          : fallback.intent,
      expandedTerms: Array.from(
        new Set([...fallback.expandedTerms, ...aiTerms]),
      ).slice(0, 14),
      provider: "openai",
    };
  } catch (error) {
    console.error("OpenAI search profile parse failed:", error);
    return null;
  }
};

const getSearchProfile = async (
  query: string,
  terms: string[],
): Promise<SearchProfile> => {
  const fallback = getRuleBasedSearchProfile(query, terms);
  const result = await generateOpenAIText({
    instructions: [
      "You expand short clinic website searches into medical routing search terms.",
      "Do not diagnose or give medical advice.",
      "Return only valid JSON: {\"intent\":\"short_snake_case_or_null\",\"expandedTerms\":[\"term\"]}.",
      "Use common clinic service terms such as general medicine, dental, pediatrics, neurology, surgery, radiology, appointments, receptionist, WhatsApp, reminders, packages, products.",
    ].join("\n"),
    input: `Search query: ${query}`,
    metadata: {
      feature: "semantic_site_search",
    },
  });

  if (!result.ok) {
    return fallback;
  }

  return parseOpenAIProfile(result.text, fallback) || fallback;
};

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
  package: results.filter((result) => result.type === "package"),
  product: results.filter((result) => result.type === "product"),
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

export const searchSite = async (rawQuery: string): Promise<SiteSearchResponse> => {
  const query = normalize(rawQuery).slice(0, 120);
  const terms = getTerms(query);
  const safetyMessage = includesAny(query, emergencySignals)
    ? "This search includes emergency-like symptoms. MediDove AI can help route care, but urgent symptoms should be handled by emergency services or the nearest emergency department."
    : null;

  if (query.length < 2 || terms.length === 0) {
    return {
      query,
      intent: null,
      expandedTerms: [],
      provider: "rules",
      results: [],
      grouped: groupResults([]),
      safetyMessage,
    };
  }

  const searchProfile = await getSearchProfile(query, terms);
  const expandedTerms = searchProfile.expandedTerms.length
    ? searchProfile.expandedTerms
    : terms;
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
    supabase
      .from("ai_documents")
      .select("id, title, content, source_type")
      .limit(50),
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
        terms: expandedTerms,
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
        terms: expandedTerms,
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
        terms: expandedTerms,
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
        terms: expandedTerms,
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
        terms: expandedTerms,
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
        terms: expandedTerms,
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
        terms: expandedTerms,
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
        terms: expandedTerms,
        title: item.name,
        description: item.description,
        meta: item.category,
    }),
  }));

  const results = sortAndLimit([
    ...services,
    ...doctors,
    ...departments,
    ...packages,
    ...products,
    ...documents,
    ...blogPosts,
    ...testimonials,
  ]);
  const safeResults =
    results.length > 0 ? results : fallbackSearch(query, expandedTerms);

  return {
    query,
    intent: searchProfile.intent,
    expandedTerms,
    provider: searchProfile.provider,
    results: safeResults,
    grouped: groupResults(safeResults),
    safetyMessage,
  };
};
