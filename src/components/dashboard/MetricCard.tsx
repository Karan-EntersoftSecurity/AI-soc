"use client";

import { motion } from "framer-motion";

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  delay?: number;
}

export function MetricCard({ label, value, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="rounded-xl border border-surface-border bg-surface-card p-4"
    >
      <div className="text-sm font-medium text-white/70">{label}</div>
      <div className="mt-1 text-xl font-bold text-white">{value}</div>
    </motion.div>
  );
}
