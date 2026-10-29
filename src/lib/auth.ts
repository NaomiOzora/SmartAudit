"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface UserSession {
  id: string;
  nip: string;
  name: string;
  email: string;
  role: "STAFF" | "AUDITOR";
  department?: string | null;
  title: string;
}

const STORAGE_KEY = "smartaudit_user_session";

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
      const current = getStoredSession();
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

  const logout = () => {
    clearSession();
    setUser(null);
    router.push("/login");
  };

  const isAuthorized = !requiredRole || (user && user.role === requiredRole);

  return {
    user,
    loading,
    logout,
    isAuthorized,
  };
}
