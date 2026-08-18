"use client"
import UseSticky from "@/hooks/UseSticky";
import React, { useEffect, useState } from "react";
const ScrollTop = () => {
  const { sticky }: { sticky: boolean } = UseSticky();

  const [showScroll, setShowScroll] = useState(false);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const checkScrollTop = () => {
      setShowScroll(window.pageYOffset > 400);
    };

    window.addEventListener("scroll", checkScrollTop);
    checkScrollTop();

    return () => window.removeEventListener("scroll", checkScrollTop);
  }, []);

  return (
    <>
      {sticky && showScroll &&
        <button id="scrollUp" onClick={scrollTop} style={{ position: "fixed", zIndex: "99999", border: "none" }}
          className={`${sticky ? "d-block" : ""}`}>
          <i className="fas fa-chevron-up"></i>
        </button>
      }
    </>
  );
};

export default ScrollTop;
