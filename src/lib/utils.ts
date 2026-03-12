export function safeList<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function safeDict<T extends object>(value: unknown): T {
  return (typeof value === "object" && value !== null ? value : {}) as T;
}

export function severityColor(sev: string): string {
  const s = (sev ?? "").trim().toLowerCase();
  if (s === "critical") return "text-severity-critical";
  if (s === "high") return "text-severity-high";
  if (s === "medium") return "text-severity-medium";
  return "text-severity-low";
}

export function topFromAlerts(
  alerts: unknown[],
  key: string,
  topN = 8
): { name: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const a of alerts) {
    const obj = a as Record<string, unknown>;
    const v = obj[key];
    if (v != null && String(v).trim() !== "") {
      const s = String(v);
      counts[s] = (counts[s] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([name, count]) => ({ name, count }));
}

export function normalizeAgentPayload(payload: unknown): Record<string, unknown> {
  if (payload == null) return {};
  const p = payload as Record<string, unknown>;
  if (p.ok && "result" in p) return (p.result as Record<string, unknown>) ?? {};
  return p;
}
