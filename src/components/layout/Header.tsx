"use client";

import { motion } from "framer-motion";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-surface-border bg-primary/80 px-6 py-4 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20">
          <span className="text-lg font-bold text-accent">AI</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">AI SOC Dashboard Pro</h1>
          <p className="text-sm text-white/60">
            Agentic AI SOC dashboard for incident triage, evidence review, and
            L2 handoff
          </p>
        </div>
      </div>
    </motion.header>
  );
}
