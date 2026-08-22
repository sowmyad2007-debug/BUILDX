"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Package,
  Users,
  AlertTriangle,
  RefreshCw,
  CheckSquare,
  FileCheck2,
  Bell,
  FileText,
  Workflow,
  Code2,
  PlusCircle,
  Cpu,
  Calendar,
  BarChart3,
  QrCode,
  LogIn,
  LogOut,
  User,
  Shield,
  Briefcase,
  GraduationCap,
  Bot
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const studentNav: NavItem[] = [
    { label: "9 Campus Events", href: "/events", icon: Calendar, badge: "Catalog", badgeColor: "bg-blue-500/20 text-blue-400 border border-blue-500/30" },
    { label: "My Passes & Dashboard", href: "/dashboard", icon: QrCode },
    { label: "AI Event Assistant", href: "/assistant", icon: Bot, badge: "Bot", badgeColor: "bg-purple-500/20 text-purple-400 border border-purple-500/30" },
  ];

  const organizerNav: NavItem[] = [
    { label: "AI Requirement Intake", href: "/organizer/create-event", icon: PlusCircle, badge: "NLP", badgeColor: "bg-purple-500/20 text-purple-400 border border-purple-500/30" },
    { label: "AI Assistant Studio", href: "/assistant", icon: Bot, badge: "Chat", badgeColor: "bg-purple-500/20 text-purple-400 border border-purple-500/30" },
    { label: "Operational Planning", href: "/organizer/planning", icon: Cpu },
    { label: "Venue Planning", href: "/venues", icon: MapPin },
    { label: "Equipment Inventory", href: "/equipment", icon: Package },
    { label: "Volunteer Squads", href: "/volunteers", icon: Users },
    { label: "Conflict Engine", href: "/conflicts", icon: AlertTriangle, badge: "Live", badgeColor: "bg-rose-500/20 text-rose-400 border border-rose-500/30" },
    { label: "Dynamic Replanner", href: "/replan", icon: RefreshCw, badge: "9-Step", badgeColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30" },
    { label: "Human Approvals", href: "/organizer/approvals", icon: FileCheck2 },
    { label: "Tasks & Checklists", href: "/tasks", icon: CheckSquare },
    { label: "Admin Analytics", href: "/admin", icon: BarChart3, badge: "Dean", badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" },
    { label: "Stakeholder Briefings", href: "/briefings", icon: FileText },
    { label: "Notifications Feed", href: "/notifications", icon: Bell },
    { label: "System Architecture", href: "/system-flow", icon: Workflow, badge: "Judges", badgeColor: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" },
    { label: "REST API Docs", href: "/api-docs", icon: Code2 },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900/95 flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)] space-y-6">
      <div className="space-y-5">
        {/* Student Section */}
        <div className="space-y-1">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Student Portal
          </div>
          <nav className="space-y-0.5">
            {studentNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold shadow-sm"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Organizer Section */}
        <div className="space-y-1">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-400">
            Organizer & Admin Suite
          </div>
          <nav className="space-y-0.5">
            {organizerNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                    isActive
                      ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold shadow-sm"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? "text-purple-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Session & Authentication Box */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        {user ? (
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold text-xs">
                  {user.name ? user.name.charAt(0) : "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-900">
              <span className="rounded-md bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-300">
                {user.role}
              </span>
              <button
                onClick={() => logout()}
                className="flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300 transition"
              >
                <LogOut className="h-3 w-3" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-2">
            <p className="text-xs font-bold text-slate-300">Account Access</p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                className="flex items-center justify-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 py-1.5 text-xs font-bold text-slate-200 border border-slate-700 transition"
              >
                <LogIn className="h-3 w-3 text-blue-400" />
                <span>Log In</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-500 py-1.5 text-xs font-bold text-white shadow-sm transition"
              >
                <span>Register</span>
              </Link>
            </div>
          </div>
        )}

        {/* System Status Indicator */}
        <div className="flex items-center justify-between px-2 text-[10px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Campus Flow 1.0</span>
          </div>
          <span>Online</span>
        </div>
      </div>
    </aside>
  );
}
