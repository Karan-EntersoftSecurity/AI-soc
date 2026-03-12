import type {
  ApiResponse,
  FinalReport,
  Incident,
  NormalizedAlert,
} from "@/types";

// Use same-origin proxy to avoid CORS; proxy forwards to backend
const API_BASE =
  typeof window !== "undefined"
    ? "/api/proxy"
    : process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function fetchApi<T>(
  path: string,
  options?: { timeout?: number }
): Promise<ApiResponse<T>> {
  const { timeout = 120000 } = options ?? {};
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
    });
    clearTimeout(id);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data?.detail ?? res.statusText };
    return data as ApiResponse<T>;
  } catch (e) {
    clearTimeout(id);
    const message =
      e instanceof Error ? e.message : "Network or timeout error";
    return { ok: false, error: message };
  }
}

export const api = {
  health: () => fetchApi<{ status: string }>("/health", { timeout: 10000 }),
  getIncident: () =>
    fetchApi<Incident>("/incident", { timeout: 60000 }),
  getAlerts: () =>
    fetchApi<{ count: number; alerts: NormalizedAlert[] }>("/alerts", {
      timeout: 30000,
    }),
  getAgents: () =>
    fetchApi<{ agents: Record<string, string> }>("/agents", {
      timeout: 10000,
    }),
  runAgent: (agentName: string) =>
    fetchApi<unknown>(`/run-agent/${agentName}`, { timeout: 180000 }),
  runAutonomous: () =>
    fetchApi<{
      incident: Incident;
      agent_outputs: Record<string, unknown>;
      final_report: FinalReport;
    }>("/run-autonomous", { timeout: 240000 }),
};
