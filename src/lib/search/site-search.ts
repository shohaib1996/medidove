import { fallbackSearch } from "./fallback-search";
import { searchDatabaseContent } from "./database-search";
import { groupResults } from "./result-utils";
import {
  emergencySignals,
  getSearchProfile,
  getTerms,
  includesAny,
  normalize,
} from "./query-profile";
import type { SiteSearchResponse } from "./types";

export type {
  SearchProfile,
  SearchResultType,
  SiteSearchResponse,
  SiteSearchResult,
} from "./types";

export const searchSite = async (
  rawQuery: string,
): Promise<SiteSearchResponse> => {
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
  const results = await searchDatabaseContent({ query, terms: expandedTerms });
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
