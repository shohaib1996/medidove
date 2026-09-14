"use client";

import { useEffect, useRef } from "react";

const WorkflowSteps = ({ steps }: { steps: string[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let cleanup = () => {};

    // Loaded lazily so GSAP and its DOM-dependent plugin never run during SSR.
    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      gsap.registerPlugin(ScrollTrigger);

      const context = gsap.context(() => {
        gsap.from(".workflow-step", {
          opacity: 0,
          x: -28,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.18,
          scrollTrigger: {
            trigger: container,
            start: "top 78%",
          },
        });

        gsap.fromTo(
          ".workflow-progress",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top 70%",
              end: "bottom 65%",
              scrub: 0.6,
            },
          },
        );
      }, container);

      cleanup = () => context.revert();
    })();

    return () => cleanup();
  }, []);

  return (
    <div ref={containerRef} className="relative space-y-4 pl-2">
      <div className="absolute bottom-2 left-6 top-2 w-px bg-white/15">
        <div className="workflow-progress h-full w-full origin-top bg-linear-to-b from-rose-400 to-cyan-400" />
      </div>

      {steps.map((step, index) => (
        <div key={step} className="workflow-step relative flex gap-4">
          <div className="z-10 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-white shadow-lg shadow-primary/30">
            {index + 1}
          </div>
          <p className="pt-1 text-sm leading-6 text-slate-200">{step}</p>
        </div>
      ))}
    </div>
  );
};

export default WorkflowSteps;
