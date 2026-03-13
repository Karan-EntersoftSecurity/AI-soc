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
      <div className="flex min-h-screen items-center justify-center bg-page">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-40 opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-glow-gradient" />
        <div className="relative flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            <div className="absolute inset-0 animate-pulse-ring rounded-full border border-primary/20" />
          </div>
          <p className="text-sm text-text-secondary">Loading incident data...</p>
        </div>
      </div>
    );
  }

  if (incidentPayload && !incidentPayload.ok && incidentPayload.error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page p-4 sm:p-8">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-40 opacity-30" />
        <div className="relative w-full max-w-md rounded-xl border border-danger/20 bg-danger/5 p-6 text-center backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-danger">
            Could not load incident
          </h2>
          <p className="mt-2 text-sm text-text-primary">
            {incidentPayload.error}
          </p>
          <p className="mt-4 text-xs text-text-secondary">
            Ensure the backend API is running at{" "}
            {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}
          </p>
          <button
            type="button"
            onClick={() => loadIncident()}
            className="mt-4 rounded-lg bg-btn-primary px-4 py-2 text-sm font-medium text-white shadow-glow-sm transition-shadow hover:bg-btn-hover"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (incidentPayload?.message && !incident) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page p-4 sm:p-8">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-40 opacity-30" />
        <div className="relative w-full max-w-md rounded-xl border border-border-soft bg-card p-6 text-center backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-text-primary">
            No incident data
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            {incidentPayload.message}
          </p>
          <button
            type="button"
            onClick={() => loadIncident()}
            className="mt-4 rounded-lg bg-btn-primary px-4 py-2 text-sm font-medium text-white shadow-glow-sm transition-shadow hover:bg-btn-hover"
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
        <div className="mb-4 rounded-lg border border-danger/20 bg-danger/5 px-4 py-2.5 text-sm text-danger backdrop-blur-sm">
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
