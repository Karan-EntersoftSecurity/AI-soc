"use client";

import { motion } from "framer-motion";
import { Activity, Wifi, Menu } from "lucide-react";
import { EntersoftLogo } from "./EntersoftLogo";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative shrink-0 border-b border-white/[0.06] bg-primary-dark/60 backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-accent/[0.04] via-transparent to-cyber-purple/[0.04]" />

      <div className="relative flex items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex md:hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/80 hover:bg-white/[0.08] hover:text-white"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <EntersoftLogo />
          <div className="hidden min-w-0 border-l border-white/[0.08] pl-4 sm:block">
            <h1 className="truncate text-base font-bold tracking-tight text-white sm:text-lg">
              AI SOC Dashboard{" "}
              <span className="text-glow text-accent">Pro</span>
            </h1>
            <p className="truncate text-xs text-white/40">
              Agentic AI SOC &middot; Incident Triage &middot; L2 Handoff
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 sm:flex sm:px-3">
            <Activity className="h-3.5 w-3.5 text-cyber-green" />
            <span className="text-xs font-medium text-cyber-green">System Active</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 sm:px-3">
            <Wifi className="h-3.5 w-3.5 text-accent animate-data-flow" />
            <span className="text-xs text-white/50">Live</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
    </motion.header>
  );
}
