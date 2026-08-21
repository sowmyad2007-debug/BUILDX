"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Bell, 
  Sparkles, 
  RotateCcw, 
  UserCheck, 
  Calendar,
  Layers,
  QrCode,
  ShieldAlert
} from "lucide-react";

export function Navbar() {
  const [role, setRole] = useState("STUDENT");
  const [unreadCount, setUnreadCount] = useState(2);
  const [isResetting, setIsResetting] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const json = await res.json();
      if (json.success) {
        setNotifications(json.data.slice(0, 5));
        setUnreadCount(json.unreadCount);
      }
    } catch {
      // Fallback
    }
  };

  const handleRoleChange = async (newRole: string) => {
    setRole(newRole);
    try {
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demoRole: newRole }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      const res = await fetch("/api/demo/seed", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shadow-blue-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white">CAMPUS<span className="text-blue-500">FLOW</span></span>
            <span className="hidden ml-2 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400 border border-blue-500/20 sm:inline-block">Plan Better. Coordinate Smarter.</span>
          </div>
        </Link>

        {/* Quick Nav Links */}
        <div className="hidden lg:flex items-center gap-1 text-xs font-semibold pl-4">
          <Link href="/events" className="rounded-lg px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 transition">
            9 Campus Events
          </Link>
          <Link href="/dashboard" className="rounded-lg px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 transition">
            My Passes
          </Link>
          <Link href="/organizer/create-event" className="rounded-lg px-3 py-1.5 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition">
            AI Event Intake
          </Link>
          <Link href="/organizer/planning" className="rounded-lg px-3 py-1.5 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition">
            Planning Studio
          </Link>
          <Link href="/admin" className="rounded-lg px-3 py-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition">
            Admin
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Role Selector Switcher */}
        <div className="relative flex items-center">
          <div className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300 border border-slate-700">
            <UserCheck className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-slate-400">User:</span>
            <select
              value={role}
              onChange={(e) => handleRoleChange(e.target.value)}
              aria-label="Select User Role"
              className="bg-transparent font-bold text-slate-100 focus:outline-none cursor-pointer"
            >
              <option value="STUDENT" className="bg-slate-900 text-white">🎓 Rahul (Student)</option>
              <option value="ORGANIZER" className="bg-slate-900 text-white">🧭 Prof. Arvind (Organizer)</option>
              <option value="ADMIN" className="bg-slate-900 text-white">🛡️ Dean (Executive Admin)</option>
            </select>
          </div>
        </div>

        {/* Load / Reset Demo Mode Button */}
        <button
          onClick={handleResetDemo}
          disabled={isResetting}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600/20 px-3 py-1.5 text-xs font-semibold text-indigo-400 border border-indigo-500/30 transition hover:bg-indigo-600/30 hover:text-indigo-300"
          title="Reset database to realistic 9-event demo state"
        >
          <RotateCcw className={`h-3.5 w-3.5 ${isResetting ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{isResetting ? "Resetting..." : "Reset 9 Events"}</span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700/80 transition"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 p-3 shadow-2xl border border-slate-800 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-200">Campus Flow Notifications</span>
                <Link href="/notifications" onClick={() => setIsNotifOpen(false)} className="text-[11px] text-blue-400 hover:underline">
                  View All
                </Link>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-3">No new notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="rounded-lg bg-slate-800/80 p-2 text-xs border border-slate-700/50">
                      <p className="font-semibold text-slate-200">{n.title}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
