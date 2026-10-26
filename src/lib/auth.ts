"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: "STAFF" | "AUDITOR";
  title: string;
}

const STORAGE_KEY = "smartaudit_user_session";

export const DEFAULT_USERS: Record<"STAFF" | "AUDITOR", UserSession> = {
  STAFF: {
    id: "USR-001",
    name: "Siti Rahma",
    email: "siti.rahma@instansi.go.id",
    role: "STAFF",
    title: "Bendahara Pengeluaran",
  },
  AUDITOR: {
    id: "USR-002",
    name: "Bambang Haryanto",
    email: "bambang.h@instansi.go.id",
    role: "AUDITOR",
    title: "Lead Auditor Forensik",
  },
};

export function getStoredSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(user: UserSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("auth-state-changed"));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("auth-state-changed"));
}

export function useAuth(requiredRole?: "STAFF" | "AUDITOR") {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncUser = () => {
      let current = getStoredSession();
      // If no session exists yet, default to STAFF so the user can immediately experience the app
      if (!current) {
        current = DEFAULT_USERS.STAFF;
        saveSession(current);
      }
      setUser(current);
      setLoading(false);
    };

    syncUser();

    const handleStorageChange = () => syncUser();
    window.addEventListener("auth-state-changed", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("auth-state-changed", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = (role: "STAFF" | "AUDITOR") => {
    const session = DEFAULT_USERS[role];
    saveSession(session);
    setUser(session);
    if (role === "AUDITOR") {
      router.push("/antrean-review");
    } else {
      router.push("/beranda-staf");
    }
  };

  const logout = () => {
    clearSession();
    setUser(null);
    router.push("/login");
  };

  const isAuthorized = !requiredRole || (user && user.role === requiredRole);

  return {
    user,
    loading,
    login,
    logout,
    isAuthorized,
  };
}
