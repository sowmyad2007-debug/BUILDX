"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Bell, 
  Sparkles, 
  RotateCcw, 
  UserCheck, 
  LogIn,
  LogOut,
  UserPlus,
  Shield,
  GraduationCap,
  Briefcase
} from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState("STUDENT");
  const [unreadCount, setUnreadCount] = useState(2);
  const [isResetting, setIsResetting] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchCurrentUser();
    fetchNotifications();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/users/me");
      const json = await res.json();
      if (json.success && json.isAuthenticated && json.user) {
        setUser(json.user);
        setRole(json.user.role);
      } else {
        setUser(null);
      }
    } catch {
      // Fallback
    }
  };

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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demoRole: newRole }),
      });
      const json = await res.json();
      if (json.success && json.user) {
        setUser(json.user);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoggingOut(false);
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

  const getRoleIcon = (userRole: string) => {
    switch (userRole) {
      case "ADMIN":
        return <Shield className="h-3.5 w-3.5 text-emerald-400" />;
      case "ORGANIZER":
        return <Briefcase className="h-3.5 w-3.5 text-purple-400" />;
      default:
        return <GraduationCap className="h-3.5 w-3.5 text-blue-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 sm:px-6 backdrop-blur-md">
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
        <div className="hidden xl:flex items-center gap-1 text-xs font-semibold pl-4">
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

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Reset Demo State Button */}
        <button
          onClick={handleResetDemo}
          disabled={isResetting}
          className="hidden md:flex items-center gap-1.5 rounded-lg bg-indigo-600/20 px-2.5 py-1.5 text-xs font-semibold text-indigo-400 border border-indigo-500/30 transition hover:bg-indigo-600/30 hover:text-indigo-300"
          title="Reset database to realistic 9-event demo state"
        >
          <RotateCcw className={`h-3.5 w-3.5 ${isResetting ? "animate-spin" : ""}`} />
          <span>{isResetting ? "Resetting..." : "Reset 9 Events"}</span>
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

        {/* Authentication State & Actions */}
        {user ? (
          <div className="flex items-center gap-2">
            {/* Active User Switcher / Profile Badge */}
            <div className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-800/90 pl-2.5 pr-1.5 py-1 text-xs text-slate-300 border border-slate-700">
              <div className="flex items-center gap-1.5">
                {getRoleIcon(user.role)}
                <span className="font-bold text-slate-200 truncate max-w-[120px]">{user.name.split(" ")[0]}</span>
              </div>
              
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value)}
                aria-label="Switch User Role"
                className="rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-bold text-slate-200 border border-slate-700/80 focus:outline-none cursor-pointer"
              >
                <option value="STUDENT" className="bg-slate-900 text-white">Student</option>
                <option value="ORGANIZER" className="bg-slate-900 text-white">Organizer</option>
                <option value="ADMIN" className="bg-slate-900 text-white">Admin</option>
              </select>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 text-xs font-bold text-rose-400 border border-rose-500/30 transition active:scale-95"
              title="Sign Out of Campus Flow"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{isLoggingOut ? "Signing Out..." : "Log Out"}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-bold text-slate-200 border border-slate-700 transition"
            >
              <LogIn className="h-3.5 w-3.5 text-blue-400" />
              <span>Log In</span>
            </Link>
            <Link
              href="/register"
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-bold text-white shadow-md transition"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Sign Up</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
