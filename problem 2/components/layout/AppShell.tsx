"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { AuthProvider } from "@/lib/auth-context";
import { AiChatbotWidget } from "@/components/chat/AiChatbotWidget";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative">
        <Navbar />
        {isLandingPage || isAuthPage ? (
          <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gradient-to-b from-slate-900/50 to-slate-950">
              <div className="mx-auto max-w-7xl">{children}</div>
            </main>
          </div>
        )}

        {/* Global Floating AI Chatbot Widget */}
        <AiChatbotWidget />
      </div>
    </AuthProvider>
  );
}
