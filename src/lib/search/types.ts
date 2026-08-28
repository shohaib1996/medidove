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

export type SearchProfile = {
  intent: string | null;
  expandedTerms: string[];
  provider: "rules" | "openai";
};
