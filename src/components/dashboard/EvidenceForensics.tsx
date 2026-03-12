"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Search,
  Users,
  Shield,
  Cpu,
  Target,
  ClipboardList,
  Clock,
  Table2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ChartTableCard } from "@/components/ui/ChartTableCard";
import { topFromAlerts, safeList, safeDict, normalizeAgentPayload } from "@/lib/utils";
import type { FinalReport, Incident, NormalizedAlert } from "@/types";

interface EvidenceForensicsProps {
  incident: Incident | null;
  finalReport: FinalReport | null;
  agentResults: Record<string, unknown>;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function EvidenceForensics({
  incident,
  finalReport,
  agentResults,
}: EvidenceForensicsProps) {
  const alerts = incident ? safeList<NormalizedAlert>(incident.alerts) : [];
  const evidence = finalReport
    ? safeDict<FinalReport["evidence"]>(finalReport.evidence)
    : ({} as FinalReport["evidence"]);
  const users = safeList(evidence.users);
  const topRules = safeList(evidence.top_rules);
  const topProcesses = safeList(evidence.top_processes);
  const mitreMapping = safeList(evidence.mitre_mapping);
  const timestamps = safeList(evidence.key_timestamps);

  const invPayload = normalizeAgentPayload(agentResults.investigation);
  const evidenceToCollect = safeList(
    (invPayload as { evidence_to_collect?: unknown }).evidence_to_collect
  );

  const rulesData = topFromAlerts(alerts, "rule_description", 10);
  const usersData = topFromAlerts(alerts, "user", 10);

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
          <Search className="h-4 w-4 text-accent" />
        </div>
        <h2 className="text-xl font-semibold text-white">
          Evidence & Forensics
        </h2>
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-accent/60" />
            <h3 className="text-lg font-semibold text-white">
              Evidence Highlights
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-white/40">
                <Users className="mb-0.5 mr-1 inline h-3 w-3" />
                Users Involved
              </p>
              <div className="flex flex-wrap gap-2">
                {users.length
                  ? users.map((u) => <Badge key={String(u)}>{String(u)}</Badge>)
                  : <span className="text-white/30">-</span>}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-white/40">
                <Shield className="mb-0.5 mr-1 inline h-3 w-3" />
                MITRE Techniques
              </p>
              <div className="flex flex-wrap gap-2">
                {mitreMapping.length
                  ? mitreMapping.map((m) => (
                      <Badge key={String(m)} variant="warning">{String(m)}</Badge>
                    ))
                  : <span className="text-white/30">-</span>}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-white/40">
                Top Rules
              </p>
              <div className="flex flex-wrap gap-2">
                {topRules.length
                  ? topRules.map((r) => <Badge key={String(r)} variant="accent">{String(r)}</Badge>)
                  : <span className="text-white/30">-</span>}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-white/40">
                <Cpu className="mb-0.5 mr-1 inline h-3 w-3" />
                Top Processes
              </p>
              <div className="flex flex-wrap gap-2">
                {topProcesses.length
                  ? topProcesses.map((p) => (
                      <Badge key={String(p)}>{String(p)}</Badge>
                    ))
                  : <span className="text-white/30">-</span>}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-accent/60" />
            <h3 className="text-lg font-semibold text-white">
              Recommended Evidence Collection
            </h3>
          </div>
          {evidenceToCollect.length ? (
            <ol className="list-decimal space-y-2 pl-5 text-sm text-white/70">
              {evidenceToCollect.map((item, i) => (
                <li key={i} className="transition-colors hover:text-white/90">{String(item)}</li>
              ))}
            </ol>
          ) : (
            <p className="text-white/40">
              No investigation evidence collection guidance yet.
            </p>
          )}
        </Card>
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-6 lg:grid-cols-2">
        <ChartTableCard
          title="Rule Frequency"
          columns={[
            { key: "name", label: "Rule" },
            { key: "count", label: "Count" },
          ]}
          data={rulesData}
          csvFilename="rule_frequency.csv"
        >
          {rulesData.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rulesData}>
                  <XAxis
                    dataKey="name"
                    stroke="#475569"
                    fontSize={11}
                    tickFormatter={(v) =>
                      String(v).length > 25 ? String(v).slice(0, 25) + "…" : v
                    }
                  />
                  <YAxis stroke="#475569" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10,15,30,0.95)",
                      border: "1px solid rgba(0,229,255,0.15)",
                      borderRadius: "8px",
                      boxShadow: "0 0 20px rgba(0,229,255,0.1)",
                    }}
                    cursor={{ fill: "rgba(0,229,255,0.06)" }}
                  />
                  <Bar dataKey="count" fill="url(#ruleGrad)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="ruleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#00e5ff" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-white/40">No rule frequency data.</p>
          )}
        </ChartTableCard>

        <ChartTableCard
          title="User / Process Review"
          columns={[
            { key: "name", label: "User" },
            { key: "count", label: "Count" },
          ]}
          data={usersData}
          csvFilename="user_process_review.csv"
        >
          {usersData.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usersData}>
                  <XAxis
                    dataKey="name"
                    stroke="#475569"
                    fontSize={11}
                  />
                  <YAxis stroke="#475569" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10,15,30,0.95)",
                      border: "1px solid rgba(0,229,255,0.15)",
                      borderRadius: "8px",
                      boxShadow: "0 0 20px rgba(0,229,255,0.1)",
                    }}
                    cursor={{ fill: "rgba(0,229,255,0.06)" }}
                  />
                  <Bar dataKey="count" fill="url(#userGrad)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-white/40">No user data.</p>
          )}
        </ChartTableCard>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent/60" />
            <h3 className="text-lg font-semibold text-white">
              Key Timestamps
            </h3>
          </div>
          {timestamps.length ? (
            <div className="max-h-40 overflow-auto">
              <table className="w-full text-sm">
                <tbody>
                  {timestamps.map((ts, i) => (
                    <tr key={i} className="border-b border-white/[0.04] transition-colors hover:bg-accent/[0.03]">
                      <td className="py-1.5 font-mono text-xs text-accent/50">{String(ts)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-white/40">
              No timestamps in final evidence pack.
            </p>
          )}
        </Card>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Table2 className="h-4 w-4 text-accent/60" />
            <h3 className="text-lg font-semibold text-white">
              Full Alert Evidence Table
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
                  {alerts.map((a, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/[0.04] text-white/70 transition-colors hover:bg-accent/[0.03]"
                    >
                      <td className="py-1.5 pr-2 font-mono text-accent/50">
                        {String(a.time ?? "-").slice(0, 19)}
                      </td>
                      <td className="max-w-[180px] truncate py-1.5 pr-2">
                        {String(a.rule_description ?? "-")}
                      </td>
                      <td className="max-w-[120px] truncate py-1.5 pr-2">
                        {String(a.process ?? "-")}
                      </td>
                      <td className="py-1.5">{String(a.user ?? "-")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-white/40">No alert evidence available.</p>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}
