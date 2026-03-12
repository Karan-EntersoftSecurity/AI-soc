"use client";

import { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import type { DashboardPage } from "@/types";

interface DashboardLayoutProps {
  children: ReactNode;
  page: DashboardPage;
  onPageChange: (page: DashboardPage) => void;
  onRefresh: () => void;
  onRunAutonomous: () => void;
  onRunAgent: (name: string) => void;
  loading: boolean;
}

export function DashboardLayout({
  children,
  page,
  onPageChange,
  onRefresh,
  onRunAutonomous,
  onRunAgent,
  loading,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-primary">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          page={page}
          onPageChange={onPageChange}
          onRefresh={onRefresh}
          onRunAutonomous={onRunAutonomous}
          onRunAgent={onRunAgent}
          loading={loading}
        />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
