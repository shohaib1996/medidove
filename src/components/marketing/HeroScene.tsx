"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";

const HeroSceneCanvas = dynamic(() => import("./HeroSceneCanvas"), {
  ssr: false,
});

const HeroScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);

  // Pause the render loop once the hero scrolls away — a continuously
  // animating WebGL canvas is a real battery drain on mobile otherwise.
  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "120px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0" aria-hidden="true">
      {reduceMotion ? null : <HeroSceneCanvas active={isVisible} />}
    </div>
  );
};

export default HeroScene;
