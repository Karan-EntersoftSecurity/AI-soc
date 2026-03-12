"use client";

import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "accent" | "warning" | "danger" | "success";
}

const variants = {
  default:
    "border-white/[0.08] bg-white/[0.04] text-white/80",
  accent:
    "border-accent/20 bg-accent/10 text-accent",
  warning:
    "border-severity-medium/20 bg-severity-medium/10 text-severity-medium",
  danger:
    "border-severity-critical/20 bg-severity-critical/10 text-severity-critical",
  success:
    "border-cyber-green/20 bg-cyber-green/10 text-cyber-green",
};

export function Badge({
  children,
  className = "",
  variant = "default",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-md border px-2.5 py-1
        text-xs font-medium tracking-wide transition-colors duration-200
        hover:bg-white/[0.06]
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
