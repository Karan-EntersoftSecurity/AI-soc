"use client";

import { useState, ReactNode } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handlePageChange = (p: DashboardPage) => {
    onPageChange(p);
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          page={page}
          onPageChange={handlePageChange}
          onRefresh={onRefresh}
          onRunAutonomous={onRunAutonomous}
          onRunAgent={onRunAgent}
          loading={loading}
        />
        <main className="relative flex-1 overflow-auto min-w-0">
          <div className="absolute inset-0 bg-grid-pattern bg-grid-40 pointer-events-none opacity-40" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-glow-gradient pointer-events-none" />
          <div className="relative p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
