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
            <Shield className="h-5 w-5 text-accent/60" />
            <h3 className="text-lg font-semibold text-white">
              Executive Summary
            </h3>
          </div>
          {finalReport ? (
            <div className="space-y-2.5 text-sm text-white/80">
              <p>
                <span className="font-medium text-white/50">Incident ID:</span>{" "}
                <span className="text-white">{finalReport.incident_id}</span>
              </p>
              <p>
                <span className="font-medium text-white/50">Severity:</span>{" "}
                <span className={severityColor(finalReport.severity)}>
                  {finalReport.severity}
                </span>
              </p>
              <p>
                <span className="font-medium text-white/50">Verdict:</span>{" "}
                <span className="text-white">{finalReport.final_verdict}</span>
              </p>
              <p>
                <span className="font-medium text-white/50">First Seen:</span>{" "}
                {String(firstSeen)}
              </p>
              <p>
                <span className="font-medium text-white/50">Last Seen:</span>{" "}
                {String(lastSeen)}
              </p>
              <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-white/80">
                {finalReport.executive_summary}
              </div>
              <p className="mt-2">
                <span className="font-medium text-white/50">
                  Recommended Next Step:
                </span>{" "}
                <span className="text-accent/80">
                  {finalReport.recommended_next_step ?? "-"}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-white/40">
              Run Autonomous Incident Simulation to generate executive summary.
            </p>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-accent/60" />
            <h3 className="text-lg font-semibold text-white">
              Top Risk Signals
            </h3>
          </div>
          <div className="space-y-4">
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
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-white/40">
                MITRE Mapping
              </p>
              <div className="flex flex-wrap gap-2">
                {mitreMapping.length
                  ? mitreMapping.map((m) => (
                      <Badge key={String(m)} variant="warning">{String(m)}</Badge>
                    ))
                  : <span className="text-white/30">-</span>}
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
                  <XAxis type="number" stroke="#475569" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    stroke="#475569"
                    fontSize={11}
                    tickFormatter={(v) =>
                      String(v).length > 20 ? String(v).slice(0, 20) + "…" : v
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10,15,30,0.95)",
                      border: "1px solid rgba(0,229,255,0.15)",
                      borderRadius: "8px",
                      boxShadow: "0 0 20px rgba(0,229,255,0.1)",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                    cursor={{ fill: "rgba(0,229,255,0.06)" }}
                  />
                  <Bar dataKey="count" fill="url(#barGradient)" radius={[0, 4, 4, 0]}>
                  </Bar>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-white/40">No process data.</p>
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
                  <XAxis dataKey="bucket" stroke="#475569" fontSize={12} />
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
                  <Bar dataKey="count" fill="url(#sevGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="sevGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4df0ff" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#00b8d4" stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-white/40">No severity distribution.</p>
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
                    stroke="#475569"
                    fontSize={11}
                    tickFormatter={(v) =>
                      typeof v === "string" && v.length > 18 ? v.slice(0, 18) + "…" : v
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
                    cursor={{ stroke: "rgba(0,229,255,0.15)" }}
                  />
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#00e5ff" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="url(#lineGradient)"
                    strokeWidth={2.5}
                    dot={{ fill: "#00e5ff", strokeWidth: 0, r: 4 }}
                    activeDot={{ fill: "#00e5ff", strokeWidth: 0, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-white/40">No timeline chart data.</p>
          )}
        </ChartTableCard>
      </motion.div>
    </motion.div>
  );
}
