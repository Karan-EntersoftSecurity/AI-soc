"use client";

import { useState, useEffect, type ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Zap,
  Brain,
  Link2,
  ShieldCheck,
  AlertTriangle,
  Microscope,
  X,
} from "lucide-react";
import type { DashboardPage } from "@/types";
import { Button } from "@/components/ui/Button";
import { LayoutGrid } from "@/components/ui/icons/LayoutGrid";
import { AnimatedWrench } from "@/components/ui/icons/AnimatedWrench";
import { AnimatedBot } from "@/components/ui/icons/AnimatedBot";
import { AnimatedSearch } from "@/components/ui/icons/AnimatedSearch";
import { AnimatedArrowRightLeft } from "@/components/ui/icons/AnimatedArrowRightLeft";
import type { LucideIcon } from "lucide-react";

type AnimatedIcon = ComponentType<{ className?: string; animate?: boolean }>;

interface SidebarProps {
  page: DashboardPage;
  onPageChange: (page: DashboardPage) => void;
  onRefresh: () => void;
  onRunAutonomous: () => void;
  onRunAgent: (name: string) => void;
  loading: boolean;
  open?: boolean;
  onClose?: () => void;
}

const PAGES: { id: DashboardPage; label: string; icon: AnimatedIcon }[] = [
  { id: "executive", label: "Executive Overview", icon: LayoutGrid },
  { id: "workbench", label: "Incident Workbench", icon: AnimatedWrench },
  { id: "autonomous", label: "Autonomous AI SOC", icon: AnimatedBot },
  { id: "evidence", label: "Evidence & Forensics", icon: AnimatedSearch },
  { id: "l2", label: "L2 Handoff", icon: AnimatedArrowRightLeft },
];

const AGENTS: { name: string; icon: LucideIcon }[] = [
  { name: "summarizer", icon: Brain },
  { name: "attack_chain", icon: Link2 },
  { name: "simulation_validator", icon: ShieldCheck },
  { name: "escalation", icon: AlertTriangle },
  { name: "investigation", icon: Microscope },
];

function NavItems({
  page,
  onPageChange,
}: {
  page: DashboardPage;
  onPageChange: (page: DashboardPage) => void;
}) {
  const [hoveredId, setHoveredId] = useState<DashboardPage | null>(null);

  return (
    <nav className="mt-3 flex flex-col gap-0.5 px-2">
      {PAGES.map(({ id, label, icon: Icon }, i) => {
        const active = page === id;

        return (
          <motion.button
            key={id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            onClick={() => onPageChange(id)}
            onMouseEnter={() => setHoveredId(id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`
              group relative flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-300
              ${active
                ? "bg-accent/10 text-accent shadow-glow-sm"
                : "text-white/60 hover:bg-white/[0.04] hover:text-white/90"
              }
            `}
          >
            {active && (
              <motion.div
                layoutId="sidebar-indicator"
                className="absolute -left-2 inset-y-1 w-[3px] rounded-r-full bg-accent shadow-glow-accent"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <Icon
              animate={hoveredId === id}
              className={`h-4 w-4 shrink-0 transition-colors ${active ? "text-accent" : "text-white/40 group-hover:text-white/70"}`}
            />
            <span className="leading-tight">{label}</span>
          </motion.button>
        );
      })}
    </nav>
  );
}

export function Sidebar({
  page,
  onPageChange,
  onRefresh,
  onRunAutonomous,
  onRunAgent,
  loading,
  open = false,
  onClose,
}: SidebarProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const content = (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.02] to-transparent pointer-events-none" />

      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 md:hidden">
        <span className="text-sm font-semibold text-white">Menu</span>
        <button
          type="button"
          onClick={onClose}
          className="h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white flex"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex-1 overflow-y-auto py-4 md:py-6">
        <div className="px-4">
          <h2 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-accent/60">
            <span className="h-px flex-1 bg-gradient-to-r from-accent/20 to-transparent" />
            Navigation
            <span className="h-px flex-1 bg-gradient-to-l from-accent/20 to-transparent" />
          </h2>
        </div>

        <NavItems page={page} onPageChange={onPageChange} />

        <div className="mt-6 px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>

        <div className="mt-6 px-4">
          <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-accent/60">
            <span className="h-px flex-1 bg-gradient-to-r from-accent/20 to-transparent" />
            Controls
            <span className="h-px flex-1 bg-gradient-to-l from-accent/20 to-transparent" />
          </h3>
          <div className="mt-3 flex flex-col gap-2">
            <Button
              variant="outline"
              fullWidth
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={onRunAutonomous}
              disabled={loading}
            >
              <Zap className="h-4 w-4" />
              Run Autonomous
            </Button>
          </div>
        </div>

        <div className="mt-6 px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>

        <div className="mt-6 px-4 pb-6 md:pb-0">
          <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-accent/60">
            <span className="h-px flex-1 bg-gradient-to-r from-accent/20 to-transparent" />
            Agents
            <span className="h-px flex-1 bg-gradient-to-l from-accent/20 to-transparent" />
          </h3>
          <div className="mt-3 flex flex-col gap-1.5">
            {AGENTS.map(({ name, icon: Icon }) => (
              <Button
                key={name}
                variant="ghost"
                fullWidth
                onClick={() => onRunAgent(name)}
                disabled={loading}
              >
                <Icon className="h-3.5 w-3.5 text-white/40" />
                Run {name.replace(/_/g, " ")}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-accent/10 via-transparent to-accent/10 pointer-events-none" />
    </>
  );

  return (
    <>
      {/* Desktop: always visible sidebar */}
      <aside className="hidden md:flex relative w-64 flex-shrink-0 flex-col border-r border-white/[0.06] bg-primary-dark/40 backdrop-blur-sm">
        {content}
      </aside>

      {/* Mobile: overlay + drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={onClose}
              aria-hidden
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 flex w-[min(280px,85vw)] flex-col border-r border-white/[0.06] bg-primary-dark shadow-xl md:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
