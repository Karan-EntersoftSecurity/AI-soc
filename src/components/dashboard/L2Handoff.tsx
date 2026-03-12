"use client";

import { motion } from "framer-motion";
import {
  ArrowRightLeft,
  Download,
  FileJson2,
  ListChecks,
  GitBranch,
  ChevronDown,
  Fingerprint,
  ShieldAlert,
  Gavel,
  Shield,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TriageTraceRenderer } from "./TriageTraceRenderer";
import { severityColor } from "@/lib/utils";
import type { FinalReport } from "@/types";
import { safeList, safeDict } from "@/lib/utils";

interface L2HandoffProps {
  finalReport: FinalReport | null;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function L2Handoff({ finalReport }: L2HandoffProps) {
  if (!finalReport) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
            <ArrowRightLeft className="h-4 w-4 text-accent" />
          </div>
          <h2 className="text-xl font-semibold text-white">
            L2 Analyst Handoff
          </h2>
        </div>
        <p className="text-white/40">
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
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
          <ArrowRightLeft className="h-4 w-4 text-accent" />
        </div>
        <h2 className="text-xl font-semibold text-white">
          L2 Analyst Handoff
        </h2>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <div className="flex items-center gap-2">
            <Fingerprint className="h-3.5 w-3.5 text-accent/40" />
            <p className="text-[11px] uppercase tracking-wider text-white/40">Incident ID</p>
          </div>
          <p className="mt-1 font-medium text-white">
            {finalReport.incident_id}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-3.5 w-3.5 text-accent/40" />
            <p className="text-[11px] uppercase tracking-wider text-white/40">Severity</p>
          </div>
          <p className={`mt-1 font-medium ${severityColor(finalReport.severity)}`}>
            {finalReport.severity}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <Gavel className="h-3.5 w-3.5 text-accent/40" />
            <p className="text-[11px] uppercase tracking-wider text-white/40">Verdict</p>
          </div>
          <p className="mt-1 font-medium text-white">
            {finalReport.final_verdict}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-accent/40" />
            <p className="text-[11px] uppercase tracking-wider text-white/40">Containment</p>
          </div>
          <p className="mt-1 font-medium text-white">
            {String(finalReport.containment_recommended ?? false)}
          </p>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <FileJson2 className="h-4 w-4 text-accent/60" />
            <h3 className="text-lg font-semibold text-white">
              Handoff Summary
            </h3>
          </div>
          <div className="space-y-2.5 text-sm text-white/70">
            <p>
              <span className="font-medium text-white/40">Host:</span>{" "}
              <span className="text-white">{finalReport.host}</span>
            </p>
            <p>
              <span className="font-medium text-white/40">Agent ID:</span>{" "}
              <span className="text-white">{finalReport.agent_id}</span>
            </p>
            <p>
              <span className="font-medium text-white/40">First Seen:</span>{" "}
              <span className="font-mono text-accent/60">{finalReport.first_seen ?? "-"}</span>
            </p>
            <p>
              <span className="font-medium text-white/40">Last Seen:</span>{" "}
              <span className="font-mono text-accent/60">{finalReport.last_seen ?? "-"}</span>
            </p>
            <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-white/80">
              {finalReport.executive_summary}
            </div>
            <p className="mt-2">
              <span className="font-medium text-white/40">
                Severity Justification:
              </span>{" "}
              {finalReport.severity_justification ?? "-"}
            </p>
            <p className="mt-2">
              <span className="font-medium text-white/40">
                Recommended Next Step:
              </span>{" "}
              <span className="text-accent/80">{finalReport.recommended_next_step ?? "-"}</span>
            </p>
            <p className="mt-2">
              <span className="font-medium text-white/40">
                Investigator Note:
              </span>{" "}
              {finalReport.investigator_note ?? "-"}
            </p>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-accent/60" />
            <h3 className="text-lg font-semibold text-white">
              Recommended L2 Actions
            </h3>
          </div>
          {actions.length ? (
            <ol className="list-decimal space-y-2 pl-5 text-sm text-white/70">
              {actions.map((action, i) => (
                <li key={i} className="transition-colors hover:text-white/90">{String(action)}</li>
              ))}
            </ol>
          ) : (
            <p className="text-white/40">No recommended actions available.</p>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-accent/60" />
            <h3 className="text-lg font-semibold text-white">
              Triage Trace
            </h3>
          </div>
          <TriageTraceRenderer triageTrace={triageTrace} />
        </Card>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <FileJson2 className="h-4 w-4 shrink-0 text-accent/60" />
              <h3 className="text-lg font-semibold text-white">
                Report Summary
              </h3>
            </div>
            <Button variant="primary" onClick={handleDownload} className="w-full sm:w-auto">
              <Download className="h-4 w-4" />
              Download JSON
            </Button>
          </div>

          <div className="space-y-5">
            <section>
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                Incident
              </h4>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-sm">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <span className="text-white/40">ID</span>
                    <p className="font-mono text-white">{finalReport.incident_id}</p>
                  </div>
                  <div>
                    <span className="text-white/40">Host</span>
                    <p className="text-white">{finalReport.host}</p>
                  </div>
                  <div>
                    <span className="text-white/40">Agent ID</span>
                    <p className="text-white">{finalReport.agent_id}</p>
                  </div>
                  <div>
                    <span className="text-white/40">Alert count</span>
                    <p className="text-white">{finalReport.alert_count}</p>
                  </div>
                  <div>
                    <span className="text-white/40">First seen</span>
                    <p className="font-mono text-accent/80 text-xs">{finalReport.first_seen ?? "-"}</p>
                  </div>
                  <div>
                    <span className="text-white/40">Last seen</span>
                    <p className="font-mono text-accent/80 text-xs">{finalReport.last_seen ?? "-"}</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                Verdict &amp; severity
              </h4>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-sm">
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-white/40">Verdict</span>
                    <p className={`font-medium ${severityColor(finalReport.final_verdict)}`}>
                      {finalReport.final_verdict}
                    </p>
                  </div>
                  <div>
                    <span className="text-white/40">Severity</span>
                    <p className={`font-medium ${severityColor(finalReport.severity)}`}>
                      {finalReport.severity}
                    </p>
                  </div>
                  <div>
                    <span className="text-white/40">Containment recommended</span>
                    <p className="text-white">
                      {String(finalReport.containment_recommended ?? false)}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                Executive summary
              </h4>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-sm text-white/85 leading-relaxed break-words">
                {finalReport.executive_summary ?? "-"}
              </div>
            </section>

            {finalReport.severity_justification && (
              <section>
                <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  Severity justification
                </h4>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-sm text-white/85 leading-relaxed break-words">
                  {finalReport.severity_justification}
                </div>
              </section>
            )}

            {finalReport.recommended_next_step && (
              <section>
                <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  Recommended next step
                </h4>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-sm text-accent/90 break-words">
                  {finalReport.recommended_next_step}
                </div>
              </section>
            )}

            {finalReport.investigator_note && (
              <section>
                <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  Investigator note
                </h4>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-sm text-white/85 leading-relaxed break-words">
                  {finalReport.investigator_note}
                </div>
              </section>
            )}

            {finalReport.evidence && Object.keys(finalReport.evidence).length > 0 && (
              <section>
                <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  Evidence
                </h4>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-sm">
                  <pre className="whitespace-pre-wrap break-words font-sans text-white/80">
                    {JSON.stringify(finalReport.evidence, null, 2)}
                  </pre>
                </div>
              </section>
            )}
          </div>

          <details className="group mt-5">
            <summary className="flex cursor-pointer items-center gap-2 text-sm text-accent hover:text-accent-light">
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
              View raw JSON
            </summary>
            <pre className="mt-3 max-h-80 overflow-auto rounded-lg border border-white/[0.06] bg-black/20 p-4 text-xs text-white/60 whitespace-pre-wrap break-words">
              {JSON.stringify(finalReport, null, 2)}
            </pre>
          </details>
        </Card>
      </motion.div>
    </motion.div>
  );
}
