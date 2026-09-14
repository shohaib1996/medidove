"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import FullscreenSearch from "@/components/common/FullscreenSearch";
import { cn } from "@/lib/utils";

const PublicSearchButton = ({ className }: { className?: string }) => {
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn("hidden sm:inline-flex", className)}
        onClick={() => setOpenSearch(true)}
      >
        <Search />
        Search
      </Button>
      {openSearch ? (
        <FullscreenSearch openSearch={openSearch} setOpenSearch={setOpenSearch} />
      ) : null}
    </>
  );
};

export default PublicSearchButton;
