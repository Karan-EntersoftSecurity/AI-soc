"use client";

import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "accent" | "warning" | "danger" | "success";
}

const variants = {
  default:
    "border-border-soft bg-soft-ui-blue text-text-primary",
  accent:
    "border-primary/20 bg-soft-ui-blue text-primary",
  warning:
    "border-severity-medium/20 bg-severity-medium/10 text-severity-medium",
  danger:
    "border-severity-critical/20 bg-severity-critical/10 text-severity-critical",
  success:
    "border-success/20 bg-success/10 text-success",
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
        hover:bg-hover-highlight
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
