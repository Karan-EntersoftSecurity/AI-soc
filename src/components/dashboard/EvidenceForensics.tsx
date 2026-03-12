"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { topFromAlerts, safeList, safeDict, normalizeAgentPayload } from "@/lib/utils";
import type { FinalReport, Incident, NormalizedAlert } from "@/types";

interface EvidenceForensicsProps {
  incident: Incident | null;
  finalReport: FinalReport | null;
  agentResults: Record<string, unknown>;
}

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold text-white">
        Evidence & Forensics
      </h2>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Evidence Highlights
          </h3>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium text-white/60">
                Users Involved
              </p>
              <div className="flex flex-wrap gap-2">
                {users.length
                  ? users.map((u) => <Badge key={String(u)}>{String(u)}</Badge>)
                  : "-"}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-white/60">
                MITRE Techniques
              </p>
              <div className="flex flex-wrap gap-2">
                {mitreMapping.length
                  ? mitreMapping.map((m) => (
                      <Badge key={String(m)}>{String(m)}</Badge>
                    ))
                  : "-"}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-white/60">
                Top Rules
              </p>
              <div className="flex flex-wrap gap-2">
                {topRules.length
                  ? topRules.map((r) => <Badge key={String(r)}>{String(r)}</Badge>)
                  : "-"}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-white/60">
                Top Processes
              </p>
              <div className="flex flex-wrap gap-2">
                {topProcesses.length
                  ? topProcesses.map((p) => (
                      <Badge key={String(p)}>{String(p)}</Badge>
                    ))
                  : "-"}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Recommended Evidence Collection
          </h3>
          {evidenceToCollect.length ? (
            <ol className="list-decimal space-y-2 pl-5 text-sm text-white/90">
              {evidenceToCollect.map((item, i) => (
                <li key={i}>{String(item)}</li>
              ))}
            </ol>
          ) : (
            <p className="text-white/60">
              No investigation evidence collection guidance yet.
            </p>
          )}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Rule Frequency
          </h3>
          {rulesData.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rulesData}>
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickFormatter={(v) =>
                      String(v).length > 25 ? String(v).slice(0, 25) + "…" : v
                    }
                  />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "#1e293b",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="#00C9C9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-white/60">No rule frequency data.</p>
          )}
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">
            User / Process Review
          </h3>
          {usersData.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usersData}>
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                  />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "#1e293b",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="#4DCAF0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-white/60">No user data.</p>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 text-lg font-semibold text-white">
          Key Timestamps
        </h3>
        {timestamps.length ? (
          <div className="max-h-40 overflow-auto">
            <table className="w-full text-sm">
              <tbody>
                {timestamps.map((ts, i) => (
                  <tr key={i} className="border-b border-white/5 text-white/90">
                    <td className="py-1 font-mono text-xs">{String(ts)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-white/60">
            No timestamps in final evidence pack.
          </p>
        )}
      </Card>

      <Card>
        <h3 className="mb-4 text-lg font-semibold text-white">
          Full Alert Evidence Table
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
                {alerts.map((a, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 text-white/80"
                  >
                    <td className="py-1.5 pr-2 font-mono">
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
          <p className="text-white/60">No alert evidence available.</p>
        )}
      </Card>
    </motion.div>
  );
}
