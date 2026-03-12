"use client";

import { motion } from "framer-motion";
import { Shield, Activity, Menu, PanelLeftClose } from "@/components/icons";
import { EntersoftLogo } from "./EntersoftLogo";

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({ sidebarOpen, onToggleSidebar }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 border-b border-surface-border bg-primary/80 px-4 py-3 backdrop-blur-sm sm:px-6 sm:py-4"
    >
      <button
        type="button"
        onClick={onToggleSidebar}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? (
          <PanelLeftClose className="h-5 w-5" aria-hidden />
        ) : (
          <Menu className="h-5 w-5" aria-hidden />
        )}
      </button>

      {/* Company: Entersoft logo + name */}
      <div className="flex items-center gap-2">
        <EntersoftLogo />
        <span className="font-semibold uppercase tracking-wide text-white text-xs sm:text-sm">
          Entersoft
        </span>
      </div>

      {/* Vertical divider between company and project */}
      <div className="h-8 w-px shrink-0 bg-white/20" aria-hidden />

      {/* Project: AI SOC Dashboard */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/20 sm:h-10 sm:w-10">
          <Shield className="h-5 w-5 text-accent" aria-hidden />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold text-white sm:text-xl">
            AI SOC Dashboard Pro
          </h1>
          <p className="flex items-center gap-1.5 truncate text-xs text-white/60 sm:text-sm">
            <Activity className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="hidden sm:inline">
              Agentic AI SOC dashboard for incident triage, evidence review, and
              L2 handoff
            </span>
          </p>
        </div>
      </div>
    </motion.header>
  );
}
