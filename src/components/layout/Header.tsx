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
      className="relative shrink-0 border-b border-border-soft bg-card backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5" />

      <div className="relative flex items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex md:hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-soft bg-soft-ui-blue text-text-primary hover:bg-hover-highlight hover:text-primary"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <EntersoftLogo />
          <div className="hidden min-w-0 border-l border-border-soft pl-4 sm:block">
            <h1 className="truncate text-base font-bold tracking-tight text-text-primary sm:text-lg">
              AI SOC Dashboard{" "}
              <span className="text-glow text-primary">Pro</span>
            </h1>
            <p className="truncate text-xs text-text-secondary">
              Agentic AI SOC &middot; Incident Triage &middot; L2 Handoff
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-2 rounded-lg border border-border-soft bg-soft-ui-blue px-2.5 py-1 sm:flex sm:px-3">
            <Activity className="h-3.5 w-3.5 text-success" />
            <span className="text-xs font-medium text-success">System Active</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border-soft bg-soft-ui-blue px-2.5 py-1 sm:px-3">
            <Wifi className="h-3.5 w-3.5 text-primary animate-data-flow" />
            <span className="text-xs text-text-secondary">Live</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </motion.header>
  );
}
