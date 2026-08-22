"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ORGANIZER" | "ADMIN";
  studentId?: string;
  department?: string;
  year?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (userData: AuthUser) => void;
  demoLogin: (role: "STUDENT" | "ORGANIZER" | "ADMIN") => Promise<void>;
  logout: () => Promise<void>;
}

const DEFAULT_DEMO_USERS: Record<string, AuthUser> = {
  STUDENT: {
    id: "usr-student-01",
    name: "Rahul Deshmukh",
    email: "rahul.d@campus.edu",
    role: "STUDENT",
    studentId: "STU-2023-CS042",
    department: "Computer Science",
    year: "3rd Year",
  },
  ORGANIZER: {
    id: "usr-organizer-01",
    name: "Dr. Arvind Swaminathan",
    email: "arvind.s@campus.edu",
    role: "ORGANIZER",
    department: "Computer Science & Engineering",
  },
  ADMIN: {
    id: "usr-admin-01",
    name: "Dr. Rajeshwari K. (Dean)",
    email: "dean.studentaffairs@campus.edu",
    role: "ADMIN",
    department: "Dean of Student Affairs",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // 1. Recover from localStorage on client load
    try {
      const stored = localStorage.getItem("campusflow_auth_user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default to student demo user
        setUser(DEFAULT_DEMO_USERS.STUDENT);
        localStorage.setItem("campusflow_auth_user", JSON.stringify(DEFAULT_DEMO_USERS.STUDENT));
      }
    } catch {
      setUser(DEFAULT_DEMO_USERS.STUDENT);
    }
  }, []);

  const login = (userData: AuthUser) => {
    setUser(userData);
    try {
      localStorage.setItem("campusflow_auth_user", JSON.stringify(userData));
    } catch (e) {
      console.error(e);
    }
  };

  const demoLogin = async (role: "STUDENT" | "ORGANIZER" | "ADMIN") => {
    const demoUser = DEFAULT_DEMO_USERS[role];
    setUser(demoUser);
    try {
      localStorage.setItem("campusflow_auth_user", JSON.stringify(demoUser));
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demoRole: role }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const logout = async () => {
    setUser(null);
    try {
      localStorage.removeItem("campusflow_auth_user");
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
