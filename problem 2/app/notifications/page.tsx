"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  RefreshCw,
  Clock,
  Sparkles,
  Layers,
  Filter
} from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const json = await res.json();
      if (json.success) {
        setNotifications(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      const json = await res.json();
      if (json.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = notifications.filter((n) => {
    if (filterType === "ALL") return true;
    return n.type === filterType;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-blue-400 border border-blue-500/30">
              Notification Hub
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            Live Agent Notification Center
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-2xl">
            Autonomous multi-agent alert feed notifying organizers and squad leads when conflicts occur, dynamic replans finish, or approvals are required.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkAllRead}
            className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition"
          >
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {["ALL", "CONFLICT", "REPLAN", "APPROVAL", "TASK", "GENERAL"].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              filterType === t
                ? "bg-blue-600 text-white shadow"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            {t} ALERTS
          </button>
        ))}
      </div>

      {/* Notifications Feed */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-slate-900/80 p-8 border border-slate-800 text-center space-y-2">
          <Bell className="h-8 w-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Notifications in this Category</h3>
          <p className="text-xs text-slate-400">All alerts are currently cleared.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`rounded-2xl p-5 border transition flex items-start justify-between gap-4 ${
                n.isRead
                  ? "bg-slate-900/60 border-slate-800/80 text-slate-300"
                  : "bg-slate-900/95 border-blue-900/40 text-slate-100 shadow-md"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`rounded-xl p-2.5 shrink-0 mt-0.5 ${
                    n.type === "CONFLICT"
                      ? "bg-rose-500/20 text-rose-400"
                      : n.type === "REPLAN"
                      ? "bg-amber-500/20 text-amber-400"
                      : n.type === "APPROVAL"
                      ? "bg-indigo-500/20 text-indigo-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {n.type === "CONFLICT" ? (
                    <AlertTriangle className="h-5 w-5" />
                  ) : n.type === "REPLAN" ? (
                    <RefreshCw className="h-5 w-5" />
                  ) : n.type === "APPROVAL" ? (
                    <FileCheck2 className="h-5 w-5" />
                  ) : (
                    <Bell className="h-5 w-5" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">{n.title}</h3>
                    {!n.isRead && (
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">{n.message}</p>
                </div>
              </div>

              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 border border-slate-700">
                {n.roleTarget}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
