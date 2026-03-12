"use client";

import { motion } from "framer-motion";
import { MetricCard } from "./MetricCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SeverityIcon } from "@/components/ui/SeverityIcon";
import { Wrench, Clock, List, Bot } from "@/components/icons";
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
        <Wrench className="h-6 w-6 text-accent" aria-hidden />
        Incident Workbench
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Host" value={incident.host ?? "-"} />
        <MetricCard label="Agent ID" value={incident.agent_id ?? "-"} />
        <MetricCard label="Alerts" value={incident.alert_count ?? 0} />
        <MetricCard
          label="Final Severity"
          value={
            <span className="flex items-center gap-1.5">
              <SeverityIcon severity={String(finalSeverity)} className="h-4 w-4" />
              <span className={severityColor(String(finalSeverity))}>
                {finalSeverity}
              </span>
            </span>
          }
        />
      </div>

      <div>
        <h3 className="mb-3 text-lg font-medium text-white">
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
              Run {name.replace(/_/g, " ")}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Card>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Clock className="h-5 w-5 text-accent" aria-hidden />
            Timeline
          </h3>
          {timeline.length ? (
            <div className="max-h-96 overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-white/70">
                    <th className="pb-2 pr-4">Time</th>
                    <th className="pb-2">Event</th>
                  </tr>
                </thead>
                <tbody>
                  {timeline.map((t, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/5 text-white/90"
                    >
                      <td className="py-2 pr-4 font-mono text-xs">
                        {String(t.time ?? "-")}
                      </td>
                      <td className="py-2">{String(t.event ?? "-")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-white/60">No timeline entries.</p>
          )}
        </Card>

        <Card>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <List className="h-5 w-5 text-accent" aria-hidden />
            Normalized Alerts
          </h3>
          {alerts.length ? (
            <div className="max-h-96 overflow-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-left text-white/70">
                    <th className="pb-2 pr-2">Time</th>
                    <th className="pb-2 pr-2">Rule</th>
                    <th className="pb-2 pr-2">Process</th>
                    <th className="pb-2">User</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.slice(0, 50).map((a, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/5 text-white/80"
                    >
                      <td className="py-1.5 pr-2 font-mono">
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
                <p className="mt-2 text-xs text-white/50">
                  Showing 50 of {alerts.length}
                </p>
              )}
            </div>
          ) : (
            <p className="text-white/60">No normalized alerts.</p>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Bot className="h-5 w-5 text-accent" aria-hidden />
          Agent Outputs
        </h3>
        {Object.keys(agentResults).length === 0 ? (
          <p className="text-white/60">
            No agent outputs yet. Run one or more agents from the sidebar or
            buttons above.
          </p>
        ) : (
          <div className="space-y-3">
            {Object.entries(agentResults).map(([key, payload]) => {
              const result = normalizeAgentPayload(
                (payload as { result?: unknown })?.result ?? payload
              );
              return (
                <details
                  key={key}
                  className="rounded-lg border border-white/10 bg-white/5"
                >
                  <summary className="cursor-pointer px-4 py-2 font-medium text-accent">
                    {key}
                  </summary>
                  <pre className="overflow-auto p-4 text-xs text-white/90">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              );
            })}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
