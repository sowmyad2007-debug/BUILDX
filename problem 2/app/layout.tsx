import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "CampusFlow AI — Autonomous Campus Event Planning & Coordination Agent",
  description: "AI-Powered multi-agent platform for converting natural-language campus event requirements into validated schedules, resource allocations, dynamic conflict detection, and real-time replanning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
