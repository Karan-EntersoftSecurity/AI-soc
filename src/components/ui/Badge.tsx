"use client";

import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-block rounded-full border border-surface-border
        bg-white/5 px-3 py-1 text-xs font-medium
        ${className}
      `}
    >
      {children}
    </span>
  );
}
