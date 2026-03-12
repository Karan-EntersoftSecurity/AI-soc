import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { FollowCursor } from "@/components/effects/FollowCursor";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "AI SOC Dashboard Pro",
  description:
    "Agentic AI SOC dashboard for incident triage, evidence review, and L2 handoff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">
        {children}
        <FollowCursor color="#00C9C980" zIndex={9999} />
      </body>
    </html>
  );
}
