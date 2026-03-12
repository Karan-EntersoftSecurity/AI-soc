"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { severityColor } from "@/lib/utils";
import type { FinalReport } from "@/types";
import { safeList, safeDict } from "@/lib/utils";

interface L2HandoffProps {
  finalReport: FinalReport | null;
}

export function L2Handoff({ finalReport }: L2HandoffProps) {
  if (!finalReport) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <h2 className="text-xl font-semibold text-white">
          L2 Analyst Handoff
        </h2>
        <p className="text-white/60">
          Run Autonomous Incident Simulation to generate the L2 handoff package.
        </p>
      </motion.div>
    );
  }

  const actions = safeList(finalReport.recommended_l2_actions);
  const triageTrace = safeDict(finalReport.triage_trace);

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(finalReport, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${finalReport.incident_id ?? "incident_report"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold text-white">
        L2 Analyst Handoff
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <p className="text-xs text-white/60">Incident ID</p>
          <p className="font-medium text-white">
            {finalReport.incident_id}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-white/60">Severity</p>
          <p className={severityColor(finalReport.severity)}>
            {finalReport.severity}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-white/60">Verdict</p>
          <p className="font-medium text-white">
            {finalReport.final_verdict}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-white/60">Containment</p>
          <p className="font-medium text-white">
            {String(finalReport.containment_recommended ?? false)}
          </p>
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 text-lg font-semibold text-white">
          Handoff Summary
        </h3>
        <div className="space-y-2 text-sm text-white/90">
          <p>
            <span className="font-medium text-white/70">Host:</span>{" "}
            {finalReport.host}
          </p>
          <p>
            <span className="font-medium text-white/70">Agent ID:</span>{" "}
            {finalReport.agent_id}
          </p>
          <p>
            <span className="font-medium text-white/70">First Seen:</span>{" "}
            {finalReport.first_seen ?? "-"}
          </p>
          <p>
            <span className="font-medium text-white/70">Last Seen:</span>{" "}
            {finalReport.last_seen ?? "-"}
          </p>
          <p className="mt-4">{finalReport.executive_summary}</p>
          <p className="mt-2">
            <span className="font-medium text-white/70">
              Severity Justification:
            </span>{" "}
            {finalReport.severity_justification ?? "-"}
          </p>
          <p className="mt-2">
            <span className="font-medium text-white/70">
              Recommended Next Step:
            </span>{" "}
            {finalReport.recommended_next_step ?? "-"}
          </p>
          <p className="mt-2">
            <span className="font-medium text-white/70">
              Investigator Note:
            </span>{" "}
            {finalReport.investigator_note ?? "-"}
          </p>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Recommended L2 Actions
          </h3>
          {actions.length ? (
            <ol className="list-decimal space-y-2 pl-5 text-sm text-white/90">
              {actions.map((action, i) => (
                <li key={i}>{String(action)}</li>
              ))}
            </ol>
          ) : (
            <p className="text-white/60">No recommended actions available.</p>
          )}
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Triage Trace
          </h3>
          {Object.keys(triageTrace).length ? (
            <div className="space-y-2">
              {Object.entries(triageTrace).map(([name, obj]) => (
                <details
                  key={name}
                  className="rounded-lg border border-white/10 bg-white/5"
                >
                  <summary className="cursor-pointer px-3 py-2 font-medium text-accent">
                    {name}
                  </summary>
                  <pre className="max-h-40 overflow-auto p-3 text-xs text-white/80">
                    {JSON.stringify(obj, null, 2)}
                  </pre>
                </details>
              ))}
            </div>
          ) : (
            <p className="text-white/60">No triage trace available.</p>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 text-lg font-semibold text-white">
          Exportable JSON
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" onClick={handleDownload}>
            Download L2 Incident Report JSON
          </Button>
        </div>
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-accent">
            View Raw JSON
          </summary>
          <pre className="mt-2 max-h-80 overflow-auto rounded-lg bg-black/30 p-4 text-xs text-white/80">
            {JSON.stringify(finalReport, null, 2)}
          </pre>
        </details>
      </Card>
    </motion.div>
  );
}
