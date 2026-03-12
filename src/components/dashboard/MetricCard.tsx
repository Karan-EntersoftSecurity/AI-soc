"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  delay?: number;
  icon?: LucideIcon;
}

export function MetricCard({ label, value, delay = 0, icon: Icon }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="
        group relative overflow-hidden rounded-xl border border-white/[0.06]
        bg-white/[0.02] p-4 backdrop-blur-sm transition-all duration-300
        hover:border-accent/20 hover:bg-white/[0.04] hover:shadow-glow-sm
      "
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative">
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon className="h-3.5 w-3.5 text-accent/50 transition-colors group-hover:text-accent/80" />
          )}
          <div className="text-xs font-medium uppercase tracking-wider text-white/40">
            {label}
          </div>
        </div>
        <div className="mt-2 text-xl font-bold tracking-tight text-white">
          {value}
        </div>
      </div>
    </motion.div>
  );
}
