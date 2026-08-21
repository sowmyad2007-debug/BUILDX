"use client";

import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  ListTodo,
  Clock,
  User,
  Users,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Layers,
  ChevronRight,
  TrendingUp
} from "lucide-react";

export default function TasksAndChecklistPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [checklists, setChecklists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"TASKS" | "CHECKLIST">("CHECKLIST");
  const [currentReadiness, setCurrentReadiness] = useState(84);

  useEffect(() => {
    fetchTasksAndChecklists();
  }, []);

  const fetchTasksAndChecklists = async () => {
    try {
      const [tRes, cRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/checklists"),
      ]);
      const [tJson, cJson] = await Promise.all([tRes.json(), cRes.json()]);

      if (tJson.success) setTasks(tJson.data);
      if (cJson.success) setChecklists(cJson.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChecklist = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/checklists", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isCompleted: !currentStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setChecklists((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isCompleted: !currentStatus } : c))
        );
        if (json.readiness) setCurrentReadiness(json.readiness);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateTaskStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const categories = ["VENUE", "EQUIPMENT", "SECURITY", "VOLUNTEERS", "LOGISTICS"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-blue-400 border border-blue-500/30">
              Operations Execution
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            Task Delegation & Automated Checklist
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-2xl">
            Cross-functional squad task board and verified physical readiness checkpoints. Ticking checklist items automatically increases event readiness in real time.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center rounded-xl bg-slate-900 p-1 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("CHECKLIST")}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
              activeTab === "CHECKLIST"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Readiness Checklist
          </button>
          <button
            onClick={() => setActiveTab("TASKS")}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
              activeTab === "TASKS"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Squad Tasks Board
          </button>
        </div>
      </div>

      {/* CHECKLIST VIEW */}
      {activeTab === "CHECKLIST" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const items = checklists.filter((c) => c.category === cat);
              const completedInCat = items.filter((c) => c.isCompleted).length;

              return (
                <div
                  key={cat}
                  className="rounded-2xl bg-slate-900/90 p-5 border border-slate-800 shadow-lg flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <h3 className="font-bold text-sm text-white tracking-wide">{cat} CHECKPOINTS</h3>
                      <span className="text-[11px] font-bold text-blue-400">
                        {completedInCat} / {items.length} Verified
                      </span>
                    </div>

                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleToggleChecklist(item.id, item.isCompleted)}
                          className={`cursor-pointer rounded-xl p-3 border transition flex items-start gap-2.5 ${
                            item.isCompleted
                              ? "bg-emerald-950/20 border-emerald-900/40 text-slate-300"
                              : "bg-slate-800/60 border-slate-700/50 hover:bg-slate-800 text-slate-200"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={item.isCompleted}
                            onChange={() => {}}
                            className="h-4 w-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer shrink-0 mt-0.5"
                          />
                          <div className="space-y-0.5">
                            <p className={`text-xs font-semibold ${item.isCompleted ? "line-through text-slate-400" : "text-slate-100"}`}>
                              {item.title}
                            </p>
                            {item.description && (
                              <p className="text-[10px] text-slate-400 leading-snug">{item.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TASKS KANBAN VIEW */}
      {activeTab === "TASKS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {["PENDING", "IN_PROGRESS", "COMPLETED", "BLOCKED"].map((status) => {
            const statusTasks = tasks.filter((t) => t.status === status);
            const statusLabels: Record<string, { label: string; color: string }> = {
              PENDING: { label: "To Do / Staged", color: "text-slate-400" },
              IN_PROGRESS: { label: "In Progress", color: "text-blue-400" },
              COMPLETED: { label: "Completed", color: "text-emerald-400" },
              BLOCKED: { label: "Blocked", color: "text-rose-400" },
            };

            return (
              <div key={status} className="rounded-2xl bg-slate-900/80 p-4 border border-slate-800 flex flex-col space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${statusLabels[status].color}`}>
                    {statusLabels[status].label}
                  </h3>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-400">
                    {statusTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {statusTasks.map((t) => (
                    <div
                      key={t.id}
                      className="rounded-xl bg-slate-800/80 p-4 border border-slate-700/60 shadow-sm space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-slate-900 px-2 py-0.5 text-[9px] font-bold text-indigo-400">
                          {t.assignedSquad}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                            t.priority === "CRITICAL" ? "bg-rose-500/20 text-rose-400" : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {t.priority}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-white leading-tight">{t.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-snug">{t.description}</p>

                      <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3 text-slate-500" />
                          <span>{t.assignedTo}</span>
                        </span>

                        <select
                          value={t.status}
                          onChange={(e) => handleUpdateTaskStatus(t.id, e.target.value)}
                          aria-label="Change Task Status"
                          className="bg-slate-900 text-slate-300 font-semibold rounded px-1.5 py-0.5 border border-slate-700 focus:outline-none cursor-pointer"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="BLOCKED">Blocked</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
