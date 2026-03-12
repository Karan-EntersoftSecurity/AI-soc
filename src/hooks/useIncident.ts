"use client";

import { useCallback, useState } from "react";
import { api } from "@/lib/api";
import type { FinalReport, Incident } from "@/types";
import { safeDict } from "@/lib/utils";

export function useIncident() {
  const [incidentPayload, setIncidentPayload] = useState<{
    ok: boolean;
    incident?: Incident;
    error?: string;
    message?: string;
  } | null>(null);
  const [agentResults, setAgentResults] = useState<Record<string, unknown>>({});
  const [finalReport, setFinalReport] = useState<FinalReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadIncident = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await api.getIncident();
    setIncidentPayload({
      ok: res.ok,
      incident: res.incident,
      error: res.error,
      message: res.message,
    });
    setLoading(false);
    return res;
  }, []);

  const runAgent = useCallback(async (agentName: string) => {
    setLoading(true);
    setError(null);
    const res = await api.runAgent(agentName);
    if (res.ok && res.result != null) {
      setAgentResults((prev) => ({ ...prev, [agentName]: res }));
    } else {
      setError(res.error ?? "Agent run failed");
    }
    setLoading(false);
    return res;
  }, []);

  const runAutonomous = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await api.runAutonomous();
    if (res.ok && res.final_report) {
      setFinalReport(res.final_report);
      setAgentResults(safeDict(res.agent_outputs));
    } else {
      setError(res.error ?? "Autonomous run failed");
    }
    setLoading(false);
    return res;
  }, []);

  const incident = incidentPayload?.ok ? incidentPayload.incident : null;

  return {
    incident,
    incidentPayload,
    agentResults,
    finalReport,
    loading,
    error,
    loadIncident,
    runAgent,
    runAutonomous,
    setError,
  };
}
