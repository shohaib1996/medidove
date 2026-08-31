"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DebouncedSearchInputProps = {
  basePath: string;
  defaultValue?: string;
  paramName?: string;
  placeholder?: string;
  debounceMs?: number;
  preserveParams?: Record<string, string>;
  className?: string;
};

const DebouncedSearchInput = ({
  basePath,
  defaultValue = "",
  paramName = "q",
  placeholder = "Search...",
  debounceMs = 400,
  preserveParams,
  className,
}: DebouncedSearchInputProps) => {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (value === defaultValue) {
      return;
    }

    const handle = setTimeout(() => {
      const params = new URLSearchParams(preserveParams);

      if (value.trim()) {
        params.set(paramName, value.trim());
      }

      const query = params.toString();
      router.push(`${basePath}${query ? `?${query}` : ""}`, { scroll: false });
    }, debounceMs);

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      <Input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />
      {value ? (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
};

export default DebouncedSearchInput;
