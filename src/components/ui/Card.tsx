"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({
  children,
  className = "",
  hover = false,
  glow = false,
}: CardProps) {
  const Wrapper = hover ? motion.div : "div";
  const motionProps = hover
    ? {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        whileHover: { scale: 1.01, y: -2 },
        transition: { duration: 0.25 },
      }
    : {};

  return (
    <Wrapper
      className={`
        glow-border relative min-w-0 overflow-hidden rounded-xl
        border border-border-soft bg-card p-4 sm:p-5
        backdrop-blur-sm transition-all duration-300
        hover:border-primary/20 hover:shadow-glow-sm
        ${glow ? "shadow-glow-sm animate-glow-pulse" : ""}
        ${className}
      `}
      {...motionProps}
    >
      <div className="absolute inset-0 bg-card-gradient pointer-events-none" />
      <div className="relative">{children}</div>
    </Wrapper>
  );
}
