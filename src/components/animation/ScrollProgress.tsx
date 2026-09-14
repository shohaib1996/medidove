"use client";

import { motion, useScroll, useSpring } from "motion/react";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-linear-to-r from-rose-500 via-pink-500 to-violet-500"
    />
  );
};

export default ScrollProgress;
