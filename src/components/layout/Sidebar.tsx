"use client";

import { motion } from "framer-motion";
import type { DashboardPage } from "@/types";
import { Button } from "@/components/ui/Button";
import {
  LayoutDashboard,
  Wrench,
  Zap,
  Fingerprint,
  Share2,
  RefreshCw,
  Play,
  FileText,
  GitBranch,
  ShieldCheck,
  ArrowUpCircle,
  Search,
  Bot,
  PanelLeftClose,
} from "@/components/icons";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  page: DashboardPage;
  onPageChange: (page: DashboardPage) => void;
  onRefresh: () => void;
  onRunAutonomous: () => void;
  onRunAgent: (name: string) => void;
  loading: boolean;
}

const PAGES: {
  id: DashboardPage;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "executive", label: "Executive Overview", Icon: LayoutDashboard },
  { id: "workbench", label: "Incident Workbench", Icon: Wrench },
  { id: "autonomous", label: "Autonomous AI SOC", Icon: Zap },
  { id: "evidence", label: "Evidence & Forensics", Icon: Fingerprint },
  { id: "l2", label: "L2 Handoff", Icon: Share2 },
];

const AGENTS: {
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { name: "summarizer", Icon: FileText },
  { name: "attack_chain", Icon: GitBranch },
  { name: "simulation_validator", Icon: ShieldCheck },
  { name: "escalation", Icon: ArrowUpCircle },
  { name: "investigation", Icon: Search },
];

export function Sidebar({
  open,
  onClose,
  page,
  onPageChange,
  onRefresh,
  onRunAutonomous,
  onRunAgent,
  loading,
}: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}
      <aside
        className={`
          flex shrink-0 flex-col border-r border-surface-border bg-primary-dark/80 py-6
          transition-[transform,width] duration-300 ease-in-out
          max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:w-64 max-md:shadow-xl
          ${open ? "max-md:translate-x-0" : "max-md:-translate-x-full"}
          md:relative
          ${open ? "md:w-64" : "md:w-0 md:overflow-hidden"}
        `}
      >
        <div className="flex h-full w-64 shrink-0 flex-col overflow-y-auto">
          <div className="flex items-end justify-end px-2 pt-1 md:hidden">
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close sidebar"
            >
              <PanelLeftClose className="h-4 w-4" aria-hidden />
            </button>
          </div>
      <nav className="mt-2 flex flex-col gap-0.5 px-2 md:mt-4">
        {PAGES.map(({ id, label, Icon }, i) => (
          <motion.button
            key={id}
            type="button"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPageChange(id);
            }}
            className={`
              flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors
              ${
                page === id
                  ? "bg-accent/20 text-accent"
                  : "text-white/80 hover:bg-white/5 hover:text-white"
              }
            `}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {label}
          </motion.button>
        ))}
      </nav>
      <div className="mt-8 border-t border-surface-border px-4 pt-6">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white/80">
          <RefreshCw className="h-4 w-4" aria-hidden />
          Controls
        </h3>
        <div className="mt-3 flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={onRefresh}
            disabled={loading}
            loading={loading}
          >
            <RefreshCw className="h-4 w-4 shrink-0" aria-hidden />
            Refresh Incident Data
          </Button>
          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={onRunAutonomous}
            disabled={loading}
            loading={loading}
          >
            <Play className="h-4 w-4 shrink-0" aria-hidden />
            Run Autonomous Simulation
          </Button>
        </div>
      </div>
      <div className="mt-6 border-t border-surface-border px-4 pt-6">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white/80">
          <Bot className="h-4 w-4" aria-hidden />
          Manual Agents
        </h3>
        <div className="mt-3 flex flex-col gap-2">
          {AGENTS.map(({ name, Icon }) => {
            const handleClick = () => {
              onRunAgent(name);
            };
            return (
              <Button
                key={name}
                type="button"
                variant="ghost"
                fullWidth
                onClick={handleClick}
                disabled={loading}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                Run {name.replace(/_/g, " ")}
              </Button>
            );
          })}
        </div>
      </div>
        </div>
      </aside>
    </>
  );
}
