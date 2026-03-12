"use client";

import {
  Brain,
  Link2,
  ShieldCheck,
  AlertTriangle,
  Microscope,
  ChevronDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  List,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { LucideIcon } from "lucide-react";

const AGENT_META: Record<string, { icon: LucideIcon; label: string }> = {
  summarizer: { icon: Brain, label: "Summarizer" },
  attack_chain: { icon: Link2, label: "Attack Chain" },
  simulation_validator: { icon: ShieldCheck, label: "Simulation Validator" },
  escalation: { icon: AlertTriangle, label: "Escalation" },
  investigation: { icon: Microscope, label: "Investigation" },
};

function isStringArray(val: unknown): val is string[] {
  return Array.isArray(val) && val.every((v) => typeof v === "string");
}

function isObjectArray(val: unknown): val is Record<string, unknown>[] {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    val.every((v) => typeof v === "object" && v !== null && !Array.isArray(v))
  );
}

function formatKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function VerdictBadge({ value }: { value: string }) {
  const lower = value.toLowerCase();
  let variant: "success" | "danger" | "warning" | "accent" = "accent";
  if (lower.includes("malicious") || lower.includes("true_positive"))
    variant = "danger";
  else if (lower.includes("benign") || lower.includes("false_positive"))
    variant = "success";
  else if (lower.includes("suspicious") || lower.includes("needs_review"))
    variant = "warning";

  return <Badge variant={variant}>{value}</Badge>;
}

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color =
    pct >= 80
      ? "from-severity-critical to-severity-high"
      : pct >= 50
        ? "from-severity-medium to-severity-medium"
        : "from-cyber-green to-cyber-green";

  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-white">{pct}%</span>
    </div>
  );
}

function RenderValue({ keyName, value }: { keyName: string; value: unknown }) {
  if (value == null) return <span className="text-white/30">-</span>;

  const k = keyName.toLowerCase();

  if (k === "verdict" || k === "final_verdict" || k === "decision") {
    return <VerdictBadge value={String(value)} />;
  }

  if (k === "confidence" && typeof value === "number") {
    return <ConfidenceBar value={value} />;
  }

  if (
    (k === "should_escalate" ||
      k === "containment_recommended" ||
      k === "parse_error") &&
    typeof value === "boolean"
  ) {
    return (
      <div className="flex items-center gap-1.5">
        {value ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-severity-high" />
            <span className="text-severity-high font-medium">Yes</span>
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 text-cyber-green" />
            <span className="text-cyber-green font-medium">No</span>
          </>
        )}
      </div>
    );
  }

  if (typeof value === "boolean") {
    return (
      <Badge variant={value ? "success" : "default"}>
        {value ? "Yes" : "No"}
      </Badge>
    );
  }

  if (typeof value === "number") {
    return <span className="font-mono text-white">{value}</span>;
  }

  if (isStringArray(value)) {
    if (value.length === 0) return <span className="text-white/30">None</span>;
    if (
      k.includes("rule") ||
      k.includes("process") ||
      k.includes("technique") ||
      k.includes("mitre") ||
      k.includes("tactic")
    ) {
      return (
        <div className="flex flex-wrap gap-1.5">
          {value.map((v, i) => (
            <Badge key={i} variant="accent">
              {v}
            </Badge>
          ))}
        </div>
      );
    }
    return (
      <ul className="space-y-1.5">
        {value.map((v, i) => (
          <li key={i} className="flex gap-2 text-sm text-white/70">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
            {v}
          </li>
        ))}
      </ul>
    );
  }

  if (isObjectArray(value)) {
    return (
      <div className="space-y-2">
        {value.map((item, i) => (
          <div
            key={i}
            className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3"
          >
            <div className="grid gap-1.5">
              {Object.entries(item).map(([k2, v2]) => (
                <div key={k2} className="flex gap-2 text-sm">
                  <span className="shrink-0 text-white/40">{formatKey(k2)}:</span>
                  <span className="text-white/80">{String(v2 ?? "-")}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    return (
      <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3">
        <div className="grid gap-1.5">
          {Object.entries(obj).map(([k2, v2]) => (
            <div key={k2} className="flex gap-2 text-sm">
              <span className="shrink-0 text-white/40">{formatKey(k2)}:</span>
              <span className="text-white/80">
                {typeof v2 === "object"
                  ? JSON.stringify(v2, null, 2)
                  : String(v2 ?? "-")}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const str = String(value);
  if (str.length > 200) {
    return (
      <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 text-sm text-white/70 leading-relaxed">
        {str}
      </div>
    );
  }

  return <span className="text-sm text-white/80">{str}</span>;
}

const KEY_ORDER = [
  "summary",
  "verdict",
  "decision",
  "confidence",
  "should_escalate",
  "escalation_reason",
  "reason",
  "reasons",
  "top_rules",
  "top_processes",
  "chain_steps",
  "mitre_techniques",
  "evidence_to_collect",
  "recommended_actions",
  "raw_text",
  "parse_error",
];

function sortKeys(keys: string[]): string[] {
  return keys.sort((a, b) => {
    const ia = KEY_ORDER.indexOf(a);
    const ib = KEY_ORDER.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b);
  });
}

function getFieldIcon(key: string) {
  const k = key.toLowerCase();
  if (k.includes("verdict") || k.includes("decision"))
    return <AlertCircle className="h-3.5 w-3.5 text-accent/40" />;
  if (k.includes("confidence"))
    return <ShieldCheck className="h-3.5 w-3.5 text-accent/40" />;
  if (k.includes("reason") || k.includes("summary"))
    return <Info className="h-3.5 w-3.5 text-accent/40" />;
  if (k.includes("escalat"))
    return <AlertTriangle className="h-3.5 w-3.5 text-accent/40" />;
  if (k.includes("rule") || k.includes("process") || k.includes("evidence"))
    return <List className="h-3.5 w-3.5 text-accent/40" />;
  return null;
}

interface TriageTraceRendererProps {
  triageTrace: Record<string, unknown>;
}

export function TriageTraceRenderer({ triageTrace }: TriageTraceRendererProps) {
  const entries = Object.entries(triageTrace);
  if (entries.length === 0) {
    return <p className="text-white/40">No triage trace available.</p>;
  }

  return (
    <div className="space-y-3">
      {entries.map(([agentName, agentData]) => {
        const meta = AGENT_META[agentName] ?? {
          icon: Info,
          label: formatKey(agentName),
        };
        const Icon = meta.icon;

        const data =
          typeof agentData === "object" && agentData !== null
            ? (agentData as Record<string, unknown>)
            : {};
        const keys = sortKeys(Object.keys(data));

        return (
          <details
            key={agentName}
            className="group rounded-xl border border-white/[0.06] bg-white/[0.02] transition-colors hover:border-accent/15 open:border-accent/20"
          >
            <summary className="flex cursor-pointer items-center gap-3 px-4 py-3">
              <ChevronDown className="h-4 w-4 text-accent/60 transition-transform duration-200 group-open:rotate-180" />
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
                <Icon className="h-3.5 w-3.5 text-accent" />
              </div>
              <span className="text-sm font-semibold text-white">
                {meta.label}
              </span>
              <span className="ml-auto text-[11px] text-white/30">
                {keys.length} fields
              </span>
            </summary>

            <div className="border-t border-white/[0.06] px-4 py-4">
              {keys.length === 0 ? (
                <p className="text-sm text-white/40">No output data.</p>
              ) : (
                <div className="space-y-4">
                  {keys.map((key) => {
                    const icon = getFieldIcon(key);
                    return (
                      <div key={key}>
                        <div className="mb-1.5 flex items-center gap-1.5">
                          {icon}
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                            {formatKey(key)}
                          </span>
                        </div>
                        <div className="pl-5">
                          <RenderValue keyName={key} value={data[key]} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
}
