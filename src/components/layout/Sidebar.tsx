"use client";

import { motion } from "framer-motion";
import type { DashboardPage } from "@/types";
import { Button } from "@/components/ui/Button";

interface SidebarProps {
  page: DashboardPage;
  onPageChange: (page: DashboardPage) => void;
  onRefresh: () => void;
  onRunAutonomous: () => void;
  onRunAgent: (name: string) => void;
  loading: boolean;
}

const PAGES: { id: DashboardPage; label: string }[] = [
  { id: "executive", label: "Executive Overview" },
  { id: "workbench", label: "Incident Workbench" },
  { id: "autonomous", label: "Autonomous AI SOC" },
  { id: "evidence", label: "Evidence & Forensics" },
  { id: "l2", label: "L2 Handoff" },
];

const AGENTS = [
  "summarizer",
  "attack_chain",
  "simulation_validator",
  "escalation",
  "investigation",
];

export function Sidebar({
  page,
  onPageChange,
  onRefresh,
  onRunAutonomous,
  onRunAgent,
  loading,
}: SidebarProps) {
  return (
    <aside className="flex w-64 flex-col border-r border-surface-border bg-primary-dark/80 py-6">
      <div className="px-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-white/80">
          Navigation
        </h2>
        <p className="mt-1 text-xs text-white/50">Go to</p>
      </div>
      <nav className="mt-4 flex flex-col gap-0.5 px-2">
        {PAGES.map(({ id, label }, i) => (
          <motion.button
            key={id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onPageChange(id)}
            className={`
              rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors
              ${
                page === id
                  ? "bg-accent/20 text-accent"
                  : "text-white/80 hover:bg-white/5 hover:text-white"
              }
            `}
          >
            {label}
          </motion.button>
        ))}
      </nav>
      <div className="mt-8 border-t border-surface-border px-4 pt-6">
        <h3 className="text-sm font-semibold text-white/80">Controls</h3>
        <div className="mt-3 flex flex-col gap-2">
          <Button
            variant="outline"
            fullWidth
            onClick={onRefresh}
            disabled={loading}
            loading={loading}
          >
            Refresh Incident Data
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={onRunAutonomous}
            disabled={loading}
            loading={loading}
          >
            Run Autonomous Simulation
          </Button>
        </div>
      </div>
      <div className="mt-6 border-t border-surface-border px-4 pt-6">
        <h3 className="text-sm font-semibold text-white/80">Manual Agents</h3>
        <div className="mt-3 flex flex-col gap-2">
          {AGENTS.map((name) => (
            <Button
              key={name}
              variant="ghost"
              fullWidth
              onClick={() => onRunAgent(name)}
              disabled={loading}
            >
              Run {name.replace(/_/g, " ")}
            </Button>
          ))}
        </div>
      </div>
    </aside>
  );
}
