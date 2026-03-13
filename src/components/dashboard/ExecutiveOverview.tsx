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
import {
  Monitor,
  Fingerprint,
  AlertCircle,
  Gavel,
  ShieldAlert,
  Shield,
  Cpu,
  Clock,
} from "lucide-react";
import { MetricCard } from "./MetricCard";
import { Card } from "@/components/ui/Card";
import { ChartTableCard } from "@/components/ui/ChartTableCard";
import { Badge } from "@/components/ui/Badge";
import { SeverityIcon } from "@/components/ui/SeverityIcon";
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

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

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
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <MetricCard label="Host" value={incident.host ?? "-"} delay={0} icon={Monitor} />
        <MetricCard label="Agent ID" value={incident.agent_id ?? "-"} delay={0.05} icon={Fingerprint} />
        <MetricCard label="Alert Count" value={incident.alert_count ?? 0} delay={0.1} icon={AlertCircle} />
        <MetricCard
          label="Verdict"
          value={finalReport?.final_verdict ?? "-"}
          delay={0.15}
          icon={Gavel}
        />
        <MetricCard
          label="Containment"
          value={String(finalReport?.containment_recommended ?? false)}
          delay={0.2}
          icon={ShieldAlert}
        />
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary/70" />
            <h3 className="text-lg font-semibold text-text-primary">
              Executive Summary
            </h3>
          </div>
          {finalReport ? (
            <div className="space-y-2.5 text-sm text-text-primary">
              <p>
                <span className="font-medium text-text-secondary">Incident ID:</span>{" "}
                <span className="text-text-primary">{finalReport.incident_id}</span>
              </p>
              <p>
                <span className="font-medium text-text-secondary">Severity:</span>{" "}
                <span className={severityColor(finalReport.severity)}>
                  {finalReport.severity}
                </span>
              </p>
              <p>
                <span className="font-medium text-text-secondary">Verdict:</span>{" "}
                <span className="text-text-primary">{finalReport.final_verdict}</span>
              </p>
              <p>
                <span className="font-medium text-text-secondary">First Seen:</span>{" "}
                {String(firstSeen)}
              </p>
              <p>
                <span className="font-medium text-text-secondary">Last Seen:</span>{" "}
                {String(lastSeen)}
              </p>
              <div className="mt-4 rounded-lg border border-border-soft bg-soft-ui-blue p-3 text-text-primary">
                {finalReport.executive_summary}
              </div>
              <p className="mt-2">
                <span className="font-medium text-text-secondary">
                  Recommended Next Step:
                </span>{" "}
                <span className="text-primary">
                  {finalReport.recommended_next_step ?? "-"}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-text-secondary">
              Run Autonomous Incident Simulation to generate executive summary.
            </p>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary/70" />
            <h3 className="text-lg font-semibold text-text-primary">
              Top Risk Signals
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-text-secondary">
                Top Rules
              </p>
              <div className="flex flex-wrap gap-2">
                {topRules.length
                  ? topRules.map((r) => <Badge key={String(r)} variant="accent">{String(r)}</Badge>)
                  : <span className="text-text-secondary">-</span>}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-text-secondary">
                Top Processes
              </p>
              <div className="flex flex-wrap gap-2">
                {topProcesses.length
                  ? topProcesses.map((p) => (
                      <Badge key={String(p)}>{String(p)}</Badge>
                    ))
                  : <span className="text-text-secondary">-</span>}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-text-secondary">
                MITRE Mapping
              </p>
              <div className="flex flex-wrap gap-2">
                {mitreMapping.length
                  ? mitreMapping.map((m) => (
                      <Badge key={String(m)} variant="warning">{String(m)}</Badge>
                    ))
                  : <span className="text-text-secondary">-</span>}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-6 lg:grid-cols-2">
        <ChartTableCard
          title="Top Suspicious Processes"
          columns={[
            { key: "name", label: "name" },
            { key: "count", label: "count" },
          ]}
          data={processesData}
          csvFilename="top_suspicious_processes.csv"
        >
          {processesData.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processesData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" stroke="#6B7280" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    stroke="#6B7280"
                    fontSize={11}
                    tickFormatter={(v) =>
                      String(v).length > 20 ? String(v).slice(0, 20) + "…" : v
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(31,42,68,0.08)",
                    }}
                    labelStyle={{ color: "#1F2A44" }}
                    cursor={{ fill: "rgba(30,107,214,0.06)" }}
                  />
                  <Bar dataKey="count" fill="url(#barGradient)" radius={[0, 4, 4, 0]}>
                  </Bar>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#93C5FD" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-text-secondary">No process data.</p>
          )}
        </ChartTableCard>
        <ChartTableCard
          title="Severity Distribution"
          columns={[
            { key: "bucket", label: "Severity Bucket" },
            { key: "count", label: "Count" },
          ]}
          data={severityData}
          csvFilename="severity_distribution.csv"
        >
          {severityData.some((d) => d.count > 0) ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData}>
                  <XAxis dataKey="bucket" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(31,42,68,0.08)",
                    }}
                    cursor={{ fill: "rgba(30,107,214,0.06)" }}
                  />
                  <Bar dataKey="count" fill="url(#sevGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="sevGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-text-secondary">No severity distribution.</p>
          )}
        </ChartTableCard>
      </motion.div>

      <motion.div variants={fadeUp}>
        <ChartTableCard
          title="Incident Activity Trend"
          columns={[
            { key: "time", label: "Time" },
            { key: "count", label: "Count" },
          ]}
          data={timelineChartData}
          csvFilename="incident_activity_trend.csv"
        >
          {timelineChartData.length ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineChartData}>
                  <XAxis
                    dataKey="time"
                    stroke="#6B7280"
                    fontSize={11}
                    tickFormatter={(v) =>
                      typeof v === "string" && v.length > 18 ? v.slice(0, 18) + "…" : v
                    }
                  />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(31,42,68,0.08)",
                    }}
                    cursor={{ stroke: "rgba(30,107,214,0.2)" }}
                  />
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#93C5FD" />
                    </linearGradient>
                  </defs>
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="url(#lineGradient)"
                    strokeWidth={2.5}
                    dot={{ fill: "#3B82F6", strokeWidth: 0, r: 4 }}
                    activeDot={{ fill: "#3B82F6", strokeWidth: 0, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-text-secondary">No timeline chart data.</p>
          )}
        </ChartTableCard>
      </motion.div>
    </motion.div>
  );
}
