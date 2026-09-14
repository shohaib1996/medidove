"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

const Parallax = ({
  children,
  className,
  distance = 60,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduceMotion ? undefined : { y }} className="h-full">
        {children}
      </motion.div>
    </div>
  );
};

export default Parallax;
