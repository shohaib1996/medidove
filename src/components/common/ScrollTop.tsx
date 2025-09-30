"use client"
import UseSticky from "@/hooks/UseSticky";
import React, { useState, useEffect } from "react";

type style_type = {
  style?: boolean
}
const ScrollTop = () => {
  const { sticky }: { sticky: boolean } = UseSticky();

  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, []);

  return (
    <>
      {sticky &&
        <button id="scrollUp" onClick={scrollTop} style={{ position: "fixed", zIndex: "99999", border: "none" }}
          className={`${sticky ? "d-block" : ""}`}>
          <i className="fas fa-chevron-up"></i>
        </button>
      }
    </>
  );
};

export default ScrollTop;
