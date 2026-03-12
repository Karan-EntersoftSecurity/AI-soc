"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { MetricCard } from "./MetricCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { severityColor, topFromAlerts, safeList, safeDict } from "@/lib/utils";
import type {
  FinalReport,
  Incident,
  NormalizedAlert,
  TimelineEntry,
} from "@/types";

interface ExecutiveOverviewProps {
  incident: Incident | null;
  finalReport: FinalReport | null;
}

export function ExecutiveOverview({
  incident,
  finalReport,
}: ExecutiveOverviewProps) {
  if (!incident) return null;

  const alerts = safeList<NormalizedAlert>(incident.alerts);
  const timeline = safeList<TimelineEntry>(incident.timeline);
  const processesData = topFromAlerts(alerts, "process", 10);
  const severityBuckets = alerts.reduce(
    (acc, a) => {
      const lvl = Number(a.rule_level);
      if (lvl >= 12) acc["High (12+)"]++;
      else if (lvl >= 8) acc["Medium (8-11)"]++;
      else acc["Low (<8)"]++;
      return acc;
    },
    { "High (12+)": 0, "Medium (8-11)": 0, "Low (<8)": 0 } as Record<string, number>
  );
  const severityData = Object.entries(severityBuckets).map(([bucket, count]) => ({
    bucket,
    count,
  }));
  const timelineCounts = timeline.reduce(
    (acc, t) => {
      const time = t.time ?? "";
      acc[time] = (acc[time] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const timelineChartData = Object.entries(timelineCounts)
    .map(([time, count]) => ({ time, count }))
    .sort((a, b) => String(a.time).localeCompare(String(b.time)));

  const evidence = finalReport
    ? safeDict<FinalReport["evidence"]>(finalReport.evidence)
    : ({} as FinalReport["evidence"]);
  const topRules = safeList(evidence.top_rules).slice(0, 6);
  const topProcesses = safeList(evidence.top_processes).slice(0, 6);
  const mitreMapping = safeList(evidence.mitre_mapping).slice(0, 6);

  const firstSeen =
    finalReport?.first_seen ??
    (timeline.length ? timeline.map((t) => t.time).filter(Boolean)[0] : "-");
  const lastSeen =
    finalReport?.last_seen ??
    (timeline.length
      ? timeline.map((t) => t.time).filter(Boolean).slice(-1)[0]
      : "-");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <MetricCard label="Host" value={incident.host ?? "-"} delay={0} />
        <MetricCard label="Agent ID" value={incident.agent_id ?? "-"} delay={0.05} />
        <MetricCard label="Alert Count" value={incident.alert_count ?? 0} delay={0.1} />
        <MetricCard
          label="Verdict"
          value={finalReport?.final_verdict ?? "-"}
          delay={0.15}
        />
        <MetricCard
          label="Containment"
          value={String(finalReport?.containment_recommended ?? false)}
          delay={0.2}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Executive Summary
          </h3>
          {finalReport ? (
            <div className="space-y-2 text-sm text-white/90">
              <p>
                <span className="font-medium text-white/70">Incident ID:</span>{" "}
                {finalReport.incident_id}
              </p>
              <p>
                <span className="font-medium text-white/70">Severity:</span>{" "}
                <span className={severityColor(finalReport.severity)}>
                  {finalReport.severity}
                </span>
              </p>
              <p>
                <span className="font-medium text-white/70">Verdict:</span>{" "}
                {finalReport.final_verdict}
              </p>
              <p>
                <span className="font-medium text-white/70">First Seen:</span>{" "}
                {String(firstSeen)}
              </p>
              <p>
                <span className="font-medium text-white/70">Last Seen:</span>{" "}
                {String(lastSeen)}
              </p>
              <p className="mt-4">{finalReport.executive_summary}</p>
              <p className="mt-2">
                <span className="font-medium text-white/70">
                  Recommended Next Step:
                </span>{" "}
                {finalReport.recommended_next_step ?? "-"}
              </p>
            </div>
          ) : (
            <p className="text-white/60">
              Run Autonomous Incident Simulation to generate executive summary.
            </p>
          )}
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Top Risk Signals
          </h3>
          <div className="space-y-4">
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
            <div>
              <p className="mb-2 text-xs font-medium text-white/60">
                MITRE Mapping
              </p>
              <div className="flex flex-wrap gap-2">
                {mitreMapping.length
                  ? mitreMapping.map((m) => (
                      <Badge key={String(m)}>{String(m)}</Badge>
                    ))
                  : "-"}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Top Suspicious Processes
          </h3>
          {processesData.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processesData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    stroke="#94a3b8"
                    fontSize={11}
                    tickFormatter={(v) =>
                      String(v).length > 20 ? String(v).slice(0, 20) + "…" : v
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1e293b",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Bar dataKey="count" fill="#00C9C9" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-white/60">No process data.</p>
          )}
        </Card>
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Severity Distribution
          </h3>
          {severityData.some((d) => d.count > 0) ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData}>
                  <XAxis dataKey="bucket" stroke="#94a3b8" fontSize={12} />
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
            <p className="text-white/60">No severity distribution.</p>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 text-lg font-semibold text-white">
          Incident Activity Trend
        </h3>
        {timelineChartData.length ? (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineChartData}>
                <XAxis
                  dataKey="time"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(v) =>
                    typeof v === "string" && v.length > 18 ? v.slice(0, 18) + "…" : v
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
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#00C9C9"
                  strokeWidth={2}
                  dot={{ fill: "#00C9C9" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-white/60">No timeline chart data.</p>
        )}
      </Card>
    </motion.div>
  );
}
