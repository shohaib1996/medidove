"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import FullscreenSearch from "@/components/common/FullscreenSearch";

const PublicSearchButton = () => {
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="hidden sm:inline-flex"
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
