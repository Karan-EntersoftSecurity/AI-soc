"use client";

import { ReactNode, useState } from "react";
import { BarChart3, Table2, Download } from "lucide-react";
import { Card } from "./Card";

interface Column {
  key: string;
  label: string;
}

interface ChartTableCardProps {
  title: string;
  columns: Column[];
  data: Record<string, unknown>[];
  children: ReactNode;
  csvFilename?: string;
}

function downloadCSV(
  columns: Column[],
  data: Record<string, unknown>[],
  filename: string
) {
  const header = columns.map((c) => c.label).join(",");
  const rows = data.map((row) =>
    columns
      .map((c) => {
        const val = String(row[c.key] ?? "");
        return val.includes(",") || val.includes('"')
          ? `"${val.replace(/"/g, '""')}"`
          : val;
      })
      .join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ChartTableCard({
  title,
  columns,
  data,
  children,
  csvFilename = "data.csv",
}: ChartTableCardProps) {
  const [view, setView] = useState<"chart" | "table">("chart");

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <div className="flex items-center gap-1 rounded-lg border border-border-soft bg-soft-ui-blue p-0.5">
          <button
            onClick={() => setView("chart")}
            title="Chart view"
            className={`rounded-md p-1.5 transition-all duration-200 ${
              view === "chart"
                ? "bg-soft-ui-blue text-primary shadow-glow-sm"
                : "text-text-secondary hover:bg-hover-highlight hover:text-text-primary"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("table")}
            title="Table view"
            className={`rounded-md p-1.5 transition-all duration-200 ${
              view === "table"
                ? "bg-soft-ui-blue text-primary shadow-glow-sm"
                : "text-text-secondary hover:bg-hover-highlight hover:text-text-primary"
            }`}
          >
            <Table2 className="h-4 w-4" />
          </button>
          <div className="mx-0.5 h-4 w-px bg-border-soft" />
          <button
            onClick={() => downloadCSV(columns, data, csvFilename)}
            title="Download CSV"
            className="rounded-md p-1.5 text-text-secondary transition-all duration-200 hover:bg-hover-highlight hover:text-primary"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {view === "chart" ? (
        children
      ) : (
        <div className="overflow-auto rounded-lg border border-border-soft">
          <table className="w-full text-sm text-text-primary">
            <thead>
              <tr className="border-b border-border-soft bg-soft-ui-blue">
                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                  #
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-text-secondary"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-border-soft last:border-b-0 transition-colors hover:bg-hover-highlight/50"
                >
                  <td className="px-4 py-2.5 text-text-secondary font-mono text-xs">{i}</td>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-2.5">
                      {String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-8 text-center text-text-secondary"
                  >
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
