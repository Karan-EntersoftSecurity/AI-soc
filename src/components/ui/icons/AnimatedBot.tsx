"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

interface AnimatedBotProps {
  className?: string;
  animate?: boolean;
}

export function AnimatedBot({ className = "", animate: trigger }: AnimatedBotProps) {
  const controls = useAnimation();

  useEffect(() => {
    if (trigger) {
      controls.start({
        y: [0, -2, 1, -1, 0],
        rotate: [0, -5, 5, -3, 0],
        transition: { duration: 0.5, ease: "easeInOut" },
      });
    } else {
      controls.start({
        y: 0,
        rotate: 0,
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
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </motion.svg>
    </div>
  );
}
