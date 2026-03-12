"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

interface AnimatedSearchProps {
  className?: string;
  animate?: boolean;
}

export function AnimatedSearch({ className = "", animate: trigger }: AnimatedSearchProps) {
  const controls = useAnimation();

  useEffect(() => {
    if (trigger) {
      controls.start({
        x: [0, 2, -2, 1.5, -1, 0],
        y: [0, -2, 0, -1, 0.5, 0],
        scale: [1, 1.15, 1.1, 1.05, 1],
        transition: { duration: 0.5, ease: "easeInOut" },
      });
    } else {
      controls.start({
        x: 0,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 25 },
      });
    }
  }, [trigger, controls]);

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={controls}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </motion.svg>
    </div>
  );
}
