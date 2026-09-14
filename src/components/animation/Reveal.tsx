"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type Direction = "up" | "down" | "left" | "right" | "none";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: Direction;
  immediate?: boolean;
};

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 34 },
  down: { x: 0, y: -34 },
  left: { x: 34, y: 0 },
  right: { x: -34, y: 0 },
  none: { x: 0, y: 0 },
};

const Reveal = ({
  children,
  className,
  delay = 0,
  duration = 0.65,
  direction = "up",
  immediate = false,
}: RevealProps) => {
  const reduceMotion = useReducedMotion();
  const offset = reduceMotion ? offsets.none : offsets[direction];
  const visible = { opacity: 1, x: 0, y: 0 };
  const transition = {
    duration,
    delay,
    ease: [0.22, 0.61, 0.36, 1] as const,
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      {...(immediate
        ? { animate: visible }
        : {
            whileInView: visible,
            viewport: { once: true, margin: "-70px" },
          })}
      transition={transition}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
