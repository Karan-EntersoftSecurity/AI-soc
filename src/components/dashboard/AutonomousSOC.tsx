"use client";

import { motion } from "framer-motion";
import { MetricCard } from "./MetricCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { severityColor } from "@/lib/utils";
import type { FinalReport } from "@/types";

const ORDERED_AGENTS = [
  "summarizer",
  "attack_chain",
  "simulation_validator",
  "escalation",
  "investigation",
];

interface AutonomousSOCProps {
  finalReport: FinalReport | null;
  agentResults: Record<string, unknown>;
  onRunAutonomous: () => void;
  loading: boolean;
}

export function AutonomousSOC({
  finalReport,
  agentResults,
  onRunAutonomous,
  loading,
}: AutonomousSOCProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold text-white">Autonomous AI SOC</h2>

      <Card>
        <p className="text-white/90">
          <strong className="text-white">Autonomous Incident Simulation Mode</strong>
          <br />
          This mode detects alerts, builds the incident, runs all AI agents
          sequentially, and generates a final L2 handoff report.
        </p>
      </Card>

      <div className="flex flex-wrap items-center gap-4">
        <Button
          variant="primary"
          onClick={onRunAutonomous}
          disabled={loading}
          loading={loading}
        >
          Run Autonomous Incident Simulation
        </Button>
        {finalReport && (
          <Card className="flex-1 min-w-[200px]">
            <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              <div>
                <span className="text-white/60">Incident ID</span>
                <p className="font-medium text-white">
                  {finalReport.incident_id}
                </p>
              </div>
              <div>
                <span className="text-white/60">Severity</span>
                <p className={severityColor(finalReport.severity)}>
                  {finalReport.severity}
                </p>
              </div>
              <div>
                <span className="text-white/60">Verdict</span>
                <p className="font-medium text-white">
                  {finalReport.final_verdict}
                </p>
              </div>
              <div>
                <span className="text-white/60">Containment</span>
                <p className="font-medium text-white">
                  {String(finalReport.containment_recommended ?? false)}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {!finalReport && (
        <p className="text-white/60">
          No autonomous report generated yet.
        </p>
      )}

      <div>
        <h3 className="mb-3 text-lg font-medium text-white">
          Agent Execution Trace
        </h3>
        {Object.keys(agentResults).length === 0 ? (
          <p className="text-white/60">No agent execution trace yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {ORDERED_AGENTS.map((name) => {
              const hasOutput =
                typeof agentResults[name] === "object" &&
                agentResults[name] !== null &&
                Object.keys(agentResults[name] as object).length > 0;
              return (
                <MetricCard
                  key={name}
                  label={name.replace(/_/g, " ")}
                  value={hasOutput ? "Completed" : "Pending"}
                />
              );
            })}
          </div>
        )}
      </div>

      <Card>
        <h3 className="mb-4 text-lg font-semibold text-white">
          Final Report
        </h3>
        {finalReport ? (
          <pre className="max-h-[500px] overflow-auto rounded-lg bg-black/30 p-4 text-xs text-white/90">
            {JSON.stringify(finalReport, null, 2)}
          </pre>
        ) : (
          <p className="text-white/60">
            Run autonomous mode to see the final L2 incident report.
          </p>
        )}
      </Card>
    </motion.div>
  );
}
