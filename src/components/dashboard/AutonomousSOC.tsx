"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Zap,
  CheckCircle2,
  Clock,
  FileText,
  ChevronDown,
} from "lucide-react";
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

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function AutonomousSOC({
  finalReport,
  agentResults,
  onRunAutonomous,
  loading,
}: AutonomousSOCProps) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft-ui-blue">
          <Bot className="h-4 w-4 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-text-primary">Autonomous AI SOC</h2>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-soft-ui-blue">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-text-primary">
                Autonomous Incident Simulation Mode
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Detects alerts, builds the incident, runs all AI agents
                sequentially, and generates a final L2 handoff report.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
        <Button
          variant="primary"
          onClick={onRunAutonomous}
          disabled={loading}
          loading={loading}
        >
          <Zap className="h-4 w-4" />
          Run Autonomous Simulation
        </Button>
        {finalReport && (
          <Card className="flex-1 min-w-[200px]">
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-text-secondary">Incident ID</span>
                <p className="mt-0.5 font-medium text-text-primary">
                  {finalReport.incident_id}
                </p>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-text-secondary">Severity</span>
                <p className={`mt-0.5 font-medium ${severityColor(finalReport.severity)}`}>
                  {finalReport.severity}
                </p>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-text-secondary">Verdict</span>
                <p className="mt-0.5 font-medium text-text-primary">
                  {finalReport.final_verdict}
                </p>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-text-secondary">Containment</span>
                <p className="mt-0.5 font-medium text-text-primary">
                  {String(finalReport.containment_recommended ?? false)}
                </p>
              </div>
            </div>
          </Card>
        )}
      </motion.div>

      {!finalReport && (
        <motion.p variants={fadeUp} className="text-text-secondary">
          No autonomous report generated yet.
        </motion.p>
      )}

      <motion.div variants={fadeUp}>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-text-secondary">
          <Clock className="h-4 w-4" />
          Agent Execution Trace
        </h3>
        {Object.keys(agentResults).length === 0 ? (
          <p className="text-text-secondary">No agent execution trace yet.</p>
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
                  value={
                    <span className={`flex items-center gap-1.5 ${hasOutput ? "text-success" : "text-text-secondary"}`}>
                      {hasOutput ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                      {hasOutput ? "Completed" : "Pending"}
                    </span>
                  }
                />
              );
            })}
          </div>
        )}
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary/70" />
            <h3 className="text-lg font-semibold text-text-primary">Final Report</h3>
          </div>
          {finalReport ? (
            <details className="group">
              <summary className="flex cursor-pointer items-center gap-2 text-sm text-primary">
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                View full report JSON
              </summary>
              <pre className="mt-3 max-h-[500px] overflow-auto rounded-lg border border-border-soft bg-soft-ui-blue p-4 text-xs text-text-primary">
                {JSON.stringify(finalReport, null, 2)}
              </pre>
            </details>
          ) : (
            <p className="text-text-secondary">
              Run autonomous mode to see the final L2 incident report.
            </p>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}
