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
import { SeverityIcon } from "@/components/ui/SeverityIcon";
import { FileText, Shield, BarChart3, TrendingUp } from "@/components/icons";
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
  const SEVERITY_ORDER = ["High (12+)", "Medium (8-11)", "Low (<8)"];
  const severityData = SEVERITY_ORDER.map((bucket) => ({
    bucket,
    count: severityBuckets[bucket] ?? 0,
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
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <FileText className="h-5 w-5 text-accent" aria-hidden />
            Executive Summary
          </h3>
          {finalReport ? (
            <div className="space-y-2 text-sm text-white/90">
              <p>
                <span className="font-medium text-white/70">Incident ID:</span>{" "}
                {finalReport.incident_id}
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium text-white/70">Severity:</span>
                <SeverityIcon severity={finalReport.severity} className="h-4 w-4" />
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
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Shield className="h-5 w-5 text-accent" aria-hidden />
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
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <BarChart3 className="h-5 w-5 text-accent" aria-hidden />
            Top Suspicious Processes
          </h3>
          {processesData.length ? (
            <div className="space-y-3">
              {processesData.map((row, i) => {
                const maxCount = Math.max(
                  ...processesData.map((d) => d.count),
                  1
                );
                const pct = (row.count / maxCount) * 100;
                return (
                  <div
                    key={`${row.name}-${i}`}
                    className="group flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="min-w-0 truncate text-sm text-white/90"
                        title={row.name}
                      >
                        {row.name}
                      </span>
                      <span className="shrink-0 rounded bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent">
                        {row.count}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-accent transition-[width] duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-white/60">No process data.</p>
          )}
        </Card>
        <Card>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Shield className="h-5 w-5 text-accent" aria-hidden />
            Severity Distribution
          </h3>
          {severityData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={severityData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="bucket"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    domain={[0, "auto"]}
                    allowDecimals={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1e293b",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#4DCAF0"
                    radius={[4, 4, 0, 0]}
                    minPointSize={2}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-white/60">No severity distribution.</p>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <TrendingUp className="h-5 w-5 text-accent" aria-hidden />
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
