"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({
  children,
  className = "",
  hover = false,
}: CardProps) {
  const Wrapper = hover ? motion.div : "div";
  const motionProps = hover
    ? {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        whileHover: { scale: 1.01 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Wrapper
      className={`rounded-xl border border-surface-border bg-surface-card p-4 ${className}`}
      {...motionProps}
    >
      {children}
    </Wrapper>
  );
}
