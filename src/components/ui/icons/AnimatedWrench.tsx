"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

interface AnimatedWrenchProps {
  className?: string;
  animate?: boolean;
}

export function AnimatedWrench({ className = "", animate: trigger }: AnimatedWrenchProps) {
  const controls = useAnimation();

  useEffect(() => {
    if (trigger) {
      controls.start({
        rotate: [0, -20, 20, -10, 10, 0],
        transition: { duration: 0.6, ease: "easeInOut" },
      });
    } else {
      controls.start({
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
        style={{ originX: "0.5", originY: "0.5" }}
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </motion.svg>
    </div>
  );
}
