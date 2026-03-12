"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ExecutiveOverview } from "@/components/dashboard/ExecutiveOverview";
import { IncidentWorkbench } from "@/components/dashboard/IncidentWorkbench";
import { AutonomousSOC } from "@/components/dashboard/AutonomousSOC";
import { EvidenceForensics } from "@/components/dashboard/EvidenceForensics";
import { L2Handoff } from "@/components/dashboard/L2Handoff";
import { useIncident } from "@/hooks/useIncident";
import type { DashboardPage } from "@/types";

export default function DashboardPage() {
  const [page, setPage] = useState<DashboardPage>("executive");
  const {
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
  } = useIncident();

  useEffect(() => {
    loadIncident();
  }, [loadIncident]);

  const handleRunAgent = async (name: string) => {
    setError(null);
    await runAgent(name);
  };

  const handleRunAutonomous = async () => {
    setError(null);
    await runAutonomous();
  };

  if (incidentPayload == null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="text-white/70">Loading incident data...</p>
        </div>
      </div>
    );
  }

  if (incidentPayload && !incidentPayload.ok && incidentPayload.error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary p-8">
        <div className="max-w-md rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <h2 className="text-lg font-semibold text-red-400">
            Could not load incident
          </h2>
          <p className="mt-2 text-sm text-white/80">
            {incidentPayload.error}
          </p>
          <p className="mt-4 text-xs text-white/60">
            Ensure the backend API is running at{" "}
            {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}
          </p>
          <button
            type="button"
            onClick={() => loadIncident()}
            className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-primary-dark hover:bg-accent-light"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (incidentPayload?.message && !incident) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary p-8">
        <div className="max-w-md rounded-xl border border-surface-border bg-surface-card p-6 text-center">
          <h2 className="text-lg font-semibold text-white">
            No incident data
          </h2>
          <p className="mt-2 text-sm text-white/70">
            {incidentPayload.message}
          </p>
          <button
            type="button"
            onClick={() => loadIncident()}
            className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-primary-dark hover:bg-accent-light"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      page={page}
      onPageChange={setPage}
      onRefresh={loadIncident}
      onRunAutonomous={handleRunAutonomous}
      onRunAgent={handleRunAgent}
      loading={loading}
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      {page === "executive" && (
        <ExecutiveOverview incident={incident ?? null} finalReport={finalReport} />
      )}
      {page === "workbench" && (
        <IncidentWorkbench
          incident={incident ?? null}
          finalReport={finalReport}
          agentResults={agentResults}
          onRunAgent={handleRunAgent}
          loading={loading}
        />
      )}
      {page === "autonomous" && (
        <AutonomousSOC
          finalReport={finalReport}
          agentResults={agentResults}
          onRunAutonomous={handleRunAutonomous}
          loading={loading}
        />
      )}
      {page === "evidence" && (
        <EvidenceForensics
          incident={incident ?? null}
          finalReport={finalReport}
          agentResults={agentResults}
        />
      )}
      {page === "l2" && <L2Handoff finalReport={finalReport} />}
    </DashboardLayout>
  );
}
