"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

// Splits values like "12+" or "24/7" into an animatable leading number and a
// static suffix, so non-numeric stat labels still render correctly.
const parse = (value: string) => {
  const match = /^(\d+)(.*)$/.exec(value);

  if (!match) {
    return { target: null, suffix: value };
  }

  return { target: Number(match[1]), suffix: match[2] };
};

const AnimatedCounter = ({
  value,
  className,
}: {
  value: string;
  className?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const { target, suffix } = parse(value);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView || target === null || reduceMotion) {
      return;
    }

    const controls = animate(0, target, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (latest) => setCount(Math.round(latest)),
    });

    return () => controls.stop();
  }, [isInView, target, reduceMotion]);

  const display =
    target === null ? suffix : `${reduceMotion ? target : count}${suffix}`;

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
};

export default AnimatedCounter;
