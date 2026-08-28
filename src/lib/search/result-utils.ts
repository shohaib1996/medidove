import type { SiteSearchResult } from "./types";

export const scoreResult = ({
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
  const haystack = `${title} ${description} ${meta}`.trim().toLowerCase();
  const titleText = title.trim().toLowerCase();
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

export const sortAndLimit = (results: SiteSearchResult[]) =>
  results
    .filter((result) => result.score > 0)
    .sort((first, second) => second.score - first.score)
    .slice(0, 12);

export const groupResults = (results: SiteSearchResult[]) => ({
  service: results.filter((result) => result.type === "service"),
  doctor: results.filter((result) => result.type === "doctor"),
  department: results.filter((result) => result.type === "department"),
  package: results.filter((result) => result.type === "package"),
  product: results.filter((result) => result.type === "product"),
  knowledge: results.filter((result) => result.type === "knowledge"),
});
