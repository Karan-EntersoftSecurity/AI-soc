"use client";

import { motion } from "framer-motion";
import {
  Monitor,
  Fingerprint,
  AlertCircle,
  ShieldAlert,
  Clock,
  FileWarning,
  ChevronDown,
  Play,
  Layers,
} from "lucide-react";
import { MetricCard } from "./MetricCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TriageTraceRenderer } from "./TriageTraceRenderer";
import { severityColor, normalizeAgentPayload, safeList } from "@/lib/utils";
import type {
  FinalReport,
  Incident,
  NormalizedAlert,
  TimelineEntry,
} from "@/types";

interface IncidentWorkbenchProps {
  incident: Incident | null;
  finalReport: FinalReport | null;
  agentResults: Record<string, unknown>;
  onRunAgent: (name: string) => void;
  loading: boolean;
}

const AGENTS = [
  "summarizer",
  "attack_chain",
  "simulation_validator",
  "escalation",
  "investigation",
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function IncidentWorkbench({
  incident,
  finalReport,
  agentResults,
  onRunAgent,
  loading,
}: IncidentWorkbenchProps) {
  if (!incident) return null;

  const timeline = safeList<TimelineEntry>(incident.timeline);
  const alerts = safeList<NormalizedAlert>(incident.alerts);
  const finalSeverity = finalReport?.severity ?? "-";

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
          <FileWarning className="h-4 w-4 text-accent" />
        </div>
        <h2 className="text-xl font-semibold text-white">Incident Workbench</h2>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
        <MetricCard label="Host" value={incident.host ?? "-"} icon={Monitor} />
        <MetricCard label="Agent ID" value={incident.agent_id ?? "-"} icon={Fingerprint} />
        <MetricCard label="Alerts" value={incident.alert_count ?? 0} icon={AlertCircle} />
        <MetricCard
          label="Final Severity"
          value={
            <span className={severityColor(String(finalSeverity))}>
              {finalSeverity}
            </span>
          }
          icon={ShieldAlert}
        />
      </motion.div>

      <motion.div variants={fadeUp}>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-white/40">
          Manual Agent Controls
        </h3>
        <div className="flex flex-wrap gap-2">
          {AGENTS.map((name) => (
            <Button
              key={name}
              variant="outline"
              onClick={() => onRunAgent(name)}
              disabled={loading}
            >
              <Play className="h-3.5 w-3.5" />
              Run {name.replace(/_/g, " ")}
            </Button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent/60" />
            <h3 className="text-lg font-semibold text-white">Timeline</h3>
          </div>
          {timeline.length ? (
            <div className="max-h-96 overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left">
                    <th className="pb-2 pr-4 text-xs font-medium uppercase tracking-wider text-white/30">Time</th>
                    <th className="pb-2 text-xs font-medium uppercase tracking-wider text-white/30">Event</th>
                  </tr>
                </thead>
                <tbody>
                  {timeline.map((t, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/[0.04] text-white/80 transition-colors hover:bg-accent/[0.03]"
                    >
                      <td className="py-2 pr-4 font-mono text-xs text-accent/60">
                        {String(t.time ?? "-")}
                      </td>
                      <td className="py-2">{String(t.event ?? "-")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-white/40">No timeline entries.</p>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-accent/60" />
            <h3 className="text-lg font-semibold text-white">
              Normalized Alerts
            </h3>
          </div>
          {alerts.length ? (
            <div className="max-h-96 overflow-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left">
                    <th className="pb-2 pr-2 text-[11px] font-medium uppercase tracking-wider text-white/30">Time</th>
                    <th className="pb-2 pr-2 text-[11px] font-medium uppercase tracking-wider text-white/30">Rule</th>
                    <th className="pb-2 pr-2 text-[11px] font-medium uppercase tracking-wider text-white/30">Process</th>
                    <th className="pb-2 text-[11px] font-medium uppercase tracking-wider text-white/30">User</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.slice(0, 50).map((a, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/[0.04] text-white/70 transition-colors hover:bg-accent/[0.03]"
                    >
                      <td className="py-1.5 pr-2 font-mono text-accent/50">
                        {String(a.time ?? "-").slice(0, 19)}
                      </td>
                      <td className="max-w-[120px] truncate py-1.5 pr-2">
                        {String(a.rule_description ?? "-")}
                      </td>
                      <td className="max-w-[100px] truncate py-1.5 pr-2">
                        {String(a.process ?? "-")}
                      </td>
                      <td className="py-1.5">{String(a.user ?? "-")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {alerts.length > 50 && (
                <p className="mt-2 text-xs text-white/30">
                  Showing 50 of {alerts.length}
                </p>
              )}
            </div>
          ) : (
            <p className="text-white/40">No normalized alerts.</p>
          )}
        </Card>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Layers className="h-4 w-4 text-accent/60" />
            <h3 className="text-lg font-semibold text-white">
              Agent Outputs
            </h3>
          </div>
          {Object.keys(agentResults).length === 0 ? (
            <p className="text-white/40">
              No agent outputs yet. Run one or more agents from the sidebar or
              buttons above.
            </p>
          ) : (
            <TriageTraceRenderer
              triageTrace={Object.fromEntries(
                Object.entries(agentResults).map(([key, payload]) => [
                  key,
                  normalizeAgentPayload(
                    (payload as { result?: unknown })?.result ?? payload
                  ),
                ])
              )}
            />
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}
