"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

interface AnimatedArrowRightLeftProps {
  className?: string;
  animate?: boolean;
}

export function AnimatedArrowRightLeft({ className = "", animate: trigger }: AnimatedArrowRightLeftProps) {
  const controls = useAnimation();

  useEffect(() => {
    if (trigger) {
      controls.start({
        x: [0, 3, -3, 2, 0],
        transition: { duration: 0.5, ease: "easeInOut" },
      });
    } else {
      controls.start({
        x: 0,
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
        <path d="m16 3 4 4-4 4" />
        <path d="M20 7H4" />
        <path d="m8 21-4-4 4-4" />
        <path d="M4 17h16" />
      </motion.svg>
    </div>
  );
}
