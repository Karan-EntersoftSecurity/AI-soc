"use client";

import { motion, useAnimation } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect } from "react";

const boxVariants: Variants = {
  normal: {
    x: 0,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  animate: (i: number) => {
    const positions = [
      { x: 11, y: 0 },
      { x: 0, y: 11 },
      { x: -11, y: 0 },
      { x: 0, y: -11 },
    ];
    return {
      ...positions[i],
      transition: { type: "spring", stiffness: 300, damping: 25 },
    };
  },
};

interface LayoutGridProps {
  className?: string;
  animate?: boolean;
}

export function LayoutGrid({ className = "", animate: externalAnimate }: LayoutGridProps) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start(externalAnimate ? "animate" : "normal");
  }, [externalAnimate, controls]);

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.rect
          width="7" height="7" x="3" y="3" rx="1"
          variants={boxVariants} animate={controls} initial="normal" custom={0}
        />
        <motion.rect
          width="7" height="7" x="14" y="3" rx="1"
          variants={boxVariants} animate={controls} initial="normal" custom={1}
        />
        <motion.rect
          width="7" height="7" x="14" y="14" rx="1"
          variants={boxVariants} animate={controls} initial="normal" custom={2}
        />
        <motion.rect
          width="7" height="7" x="3" y="14" rx="1"
          variants={boxVariants} animate={controls} initial="normal" custom={3}
        />
      </svg>
    </div>
  );
}
