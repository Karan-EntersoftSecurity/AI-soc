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
    "bg-gradient-to-r from-accent/90 to-accent text-primary-dark font-semibold shadow-glow-sm hover:shadow-glow-md border border-accent/50",
  secondary:
    "bg-primary-light text-white hover:bg-primary border border-white/[0.08]",
  outline:
    "bg-transparent text-accent border border-accent/30 hover:bg-accent/10 hover:border-accent/50",
  ghost:
    "bg-transparent text-white/70 hover:bg-white/[0.05] hover:text-white border border-transparent",
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
      onClick={onClick}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
    </motion.button>
  );
}
