"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps {
  variant?: Variant;
  children: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const variantStyles = {
  primary:
    "bg-btn-primary text-white font-semibold shadow-glow-sm hover:bg-btn-hover border border-btn-primary/80",
  secondary:
    "bg-soft-ui-blue text-text-primary hover:bg-hover-highlight border border-border-soft",
  outline:
    "bg-transparent text-primary border border-primary/40 hover:bg-soft-ui-blue hover:border-primary/60",
  ghost:
    "bg-transparent text-text-secondary hover:bg-hover-highlight hover:text-text-primary border border-transparent",
};

export function Button({
  variant = "primary",
  className = "",
  disabled,
  loading,
  fullWidth,
  children,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.97 } : undefined}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2
        text-sm font-medium transition-all duration-300
        disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
        ${variantStyles[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
    </motion.button>
  );
}
