"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Loader2, Search, Stethoscope, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type SearchResultType =
  | "service"
  | "doctor"
  | "department"
  | "package"
  | "product"
  | "knowledge";

type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  href: string;
  meta: string;
  score: number;
};

type SearchResponse = {
  query?: string;
  intent?: string | null;
  expandedTerms?: string[];
  provider?: "rules" | "openai";
  results: SearchResult[];
  grouped: Record<SearchResultType, SearchResult[]>;
  safetyMessage: string | null;
};

type FullscreenSearchProps = {
  openSearch: boolean;
  setOpenSearch: (open: boolean) => void;
};

const resultLabels: Record<SearchResultType, string> = {
  service: "Services",
  doctor: "Doctors",
  department: "Departments",
  package: "Packages",
  product: "Products",
  knowledge: "Knowledge",
};

const typeStyles: Record<SearchResultType, string> = {
  service: "bg-cyan-50 text-cyan-700",
  doctor: "bg-emerald-50 text-emerald-700",
  department: "bg-amber-50 text-amber-700",
  package: "bg-violet-50 text-violet-700",
  product: "bg-rose-50 text-rose-700",
  knowledge: "bg-slate-100 text-slate-700",
};

const emptyGroups: Record<SearchResultType, SearchResult[]> = {
  service: [],
  doctor: [],
  department: [],
  package: [],
  product: [],
  knowledge: [],
};

const FullscreenSearch = ({
  openSearch,
  setOpenSearch,
}: FullscreenSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse>({
    query: "",
    intent: null,
    expandedTerms: [],
    provider: "rules",
    results: [],
    grouped: emptyGroups,
    safetyMessage: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visibleGroups = useMemo(
    () =>
      (Object.keys(resultLabels) as SearchResultType[]).filter(
        (type) => results.grouped[type]?.length,
      ),
    [results.grouped],
  );

  useEffect(() => {
    if (!openSearch) {
      return;
    }

    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmedQuery)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = (await response.json()) as SearchResponse;
        setResults(data);
      } catch (searchError) {
        if ((searchError as Error).name !== "AbortError") {
          setError("Search is temporarily unavailable.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [openSearch, query]);

  useEffect(() => {
    if (!openSearch) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenSearch(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);

    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [openSearch, setOpenSearch]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);

    if (value.trim().length < 2) {
      setResults({ results: [], grouped: emptyGroups, safetyMessage: null });
      setError(null);
      setIsLoading(false);
    }
  };

  if (!openSearch) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-9999 overflow-y-auto bg-slate-950/95 px-4 py-6 text-white backdrop-blur md:px-8">
      <div className="mx-auto flex min-h-full max-w-5xl flex-col">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-cyan-300">
              MediDove Search
            </p>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">
              Find care, doctors, products, packages, and patient support
            </h2>
          </div>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            aria-label="Close search"
            onClick={() => setOpenSearch(false)}
          >
            <X />
          </Button>
        </div>

        <form className="mt-10" onSubmit={handleSubmit}>
          <label htmlFor="site-search" className="sr-only">
            Search MediDove
          </label>
          <div className="flex items-center gap-3 border-b border-white/30 pb-4">
            <Search className="size-7 shrink-0 text-cyan-300" />
            <input
              id="site-search"
              type="search"
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
              autoFocus
              className="w-full bg-transparent text-2xl font-semibold text-white outline-none placeholder:text-white/45 md:text-4xl"
              placeholder="Try tooth pain, child fever, heart doctor..."
            />
            {isLoading ? (
              <Loader2 className="size-6 shrink-0 animate-spin text-cyan-300" />
            ) : null}
          </div>
        </form>

        {results.safetyMessage ? (
          <div className="mt-6 flex gap-3 rounded-lg border border-red-300/40 bg-red-500/10 p-4 text-sm leading-6 text-red-50">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-200" />
            <p>{results.safetyMessage}</p>
          </div>
        ) : null}

        {query.trim().length >= 2 && results.expandedTerms?.length ? (
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-white/65">
            <Badge variant="secondary">
              {results.provider === "openai" ? "Expanded results" : "Smart expanded"}
            </Badge>
            {results.expandedTerms.slice(0, 8).map((term) => (
              <span
                key={term}
                className="rounded-full border border-white/10 px-2.5 py-1"
              >
                {term}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-8 flex-1">
          {error ? (
            <div className="rounded-lg border border-red-300/40 bg-red-500/10 p-6 text-red-50">
              {error}
            </div>
          ) : null}

          {!error && query.trim().length < 2 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {["Services", "Products", "Care packages"].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/5 p-5">
                  <Stethoscope className="mb-4 size-7 text-cyan-300" />
                  <h3 className="font-semibold">{item}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Search clinic services, products, packages, and care
                    guidance with emergency-safe support language.
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {!error && query.trim().length >= 2 && !isLoading && results.results.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center text-white/70">
              No matching clinic content found.
            </div>
          ) : null}

          <div className="space-y-8">
            {visibleGroups.map((type) => (
              <section key={type}>
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h3 className="text-sm font-bold uppercase text-white/60">
                    {resultLabels[type]}
                  </h3>
                  <Badge variant="secondary">
                    {results.grouped[type].length} results
                  </Badge>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {results.grouped[type].map((result) => (
                    <Link
                      key={result.id}
                      href={result.href}
                      className="rounded-lg border border-white/10 bg-white p-5 text-slate-900 transition hover:border-cyan-300 hover:shadow-lg"
                      onClick={() => setOpenSearch(false)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-semibold">{result.title}</h4>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                            {result.description}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${typeStyles[type]}`}
                        >
                          {result.meta}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default FullscreenSearch;
