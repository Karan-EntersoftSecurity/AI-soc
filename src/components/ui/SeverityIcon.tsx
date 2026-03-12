"use client";

import { AlertCircle, AlertTriangle, CheckCircle, MinusCircle } from "@/components/icons";

interface SeverityIconProps {
  severity: string;
  className?: string;
}

export function SeverityIcon({ severity, className = "h-4 w-4" }: SeverityIconProps) {
  const s = (severity ?? "").trim().toLowerCase();
  if (s === "critical")
    return <AlertCircle className={`text-severity-critical ${className}`} aria-hidden />;
  if (s === "high")
    return <AlertTriangle className={`text-severity-high ${className}`} aria-hidden />;
  if (s === "medium")
    return <MinusCircle className={`text-severity-medium ${className}`} aria-hidden />;
  return <CheckCircle className={`text-severity-low ${className}`} aria-hidden />;
}
