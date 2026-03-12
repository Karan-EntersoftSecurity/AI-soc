export interface TimelineEntry {
  time?: string;
  event?: string;
}

export interface NormalizedAlert {
  time?: string;
  rule_id?: string;
  rule_level?: number;
  rule_description?: string;
  rule_groups?: string[];
  mitre?: { id?: string[] };
  agent_name?: string;
  agent_id?: string;
  process?: string;
  parent_process?: string;
  command_line?: string;
  user?: string;
  event_id?: number;
  channel?: string;
}

export interface Incident {
  host: string;
  agent_id: string;
  alert_count: number;
  timeline: TimelineEntry[];
  alerts: NormalizedAlert[];
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  error?: string;
  message?: string;
  incident?: Incident;
  memory_key?: string;
  result?: T;
  report?: T;
  final_report?: FinalReport;
  agent_outputs?: Record<string, unknown>;
  agents?: Record<string, string>;
  count?: number;
  alerts?: NormalizedAlert[];
}

export interface FinalReport {
  incident_id: string;
  host: string;
  agent_id: string;
  first_seen?: string;
  last_seen?: string;
  alert_count: number;
  final_verdict: string;
  severity: string;
  executive_summary: string;
  triage_trace: Record<string, unknown>;
  evidence: {
    top_rules?: string[];
    top_processes?: string[];
    mitre_mapping?: string[];
    key_timestamps?: string[];
    users?: string[];
  };
  recommended_l2_actions?: string[];
  containment_recommended?: boolean;
  investigator_note?: string;
  severity_justification?: string;
  recommended_next_step?: string;
}

export type DashboardPage =
  | "executive"
  | "workbench"
  | "autonomous"
  | "evidence"
  | "l2";
