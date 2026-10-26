"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { ShieldCheck, LogOut, ArrowRight } from "lucide-react";

interface NavbarProps {
  currentRole?: "STAFF" | "AUDITOR" | "GUEST";
}

export default function Navbar({ currentRole }: NavbarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const effectiveRole = currentRole || user?.role || "GUEST";

  const staffLinks = [
    { label: "Beranda Staf", href: "/beranda-staf" },
    { label: "Input Pengeluaran", href: "/input-pengeluaran" },
    { label: "Riwayat Webhook", href: "/riwayat-disbursement" },
    { label: "Panduan SOP", href: "/panduan-kepatuhan" },
  ];

  const auditorLinks = [
    { label: "Antrean Review", href: "/antrean-review" },
    { label: "Audit Trail", href: "/audit-trail-log" },
    { label: "Riwayat Webhook", href: "/riwayat-disbursement" },
    { label: "Panduan SOP", href: "/panduan-kepatuhan" },
  ];

  const activeLinks = effectiveRole === "AUDITOR" ? auditorLinks : staffLinks;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-white border-b border-slate-200 shadow-xs">
      <div className="w-full max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Role Badge */}
        <div className="flex items-center gap-4">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 inline-flex items-center justify-center text-white shrink-0 group-hover:bg-blue-700 transition-colors shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 leading-tight">
                Smart<span className="text-blue-600">Audit</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                ENTERPRISE v4.0
              </span>
            </div>
          </Link>

          {effectiveRole !== "GUEST" && (
            <div className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
              <span
                className={`w-2 h-2 rounded-full ${
                  effectiveRole === "AUDITOR" ? "bg-rose-500" : "bg-blue-600"
                }`}
              ></span>
              <span className="font-semibold">{effectiveRole === "AUDITOR" ? "Auditor Forensik" : "Staf Keuangan"}</span>
            </div>
          )}

          {/* Navigation Links */}
          {effectiveRole !== "GUEST" && (
            <nav className="hidden md:flex items-center gap-1.5 ml-4">
              {activeLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={false}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-blue-700 bg-blue-50 font-semibold border border-blue-100"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right Action: User Info & Logout */}
        <div className="flex items-center gap-3">
          {effectiveRole === "GUEST" ? (
            <div className="flex items-center gap-3">
              <Link
                href="/panduan-kepatuhan"
                prefetch={false}
                className="hidden sm:inline-flex px-3 py-1.5 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
              >
                Panduan SOP
              </Link>
              <Link
                href="/login"
                prefetch={false}
                className="h-9 px-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium transition-colors shadow-xs"
              >
                <span>Masuk Sistem</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* User Profile Pill */}
              <div className="flex items-center gap-2.5 pl-2">
                <div
                  className={`w-8 h-8 rounded-full inline-flex items-center justify-center text-white font-semibold text-xs shrink-0 shadow-xs ${
                    effectiveRole === "AUDITOR" ? "bg-rose-600" : "bg-blue-600"
                  }`}
                >
                  {effectiveRole === "AUDITOR" ? "BH" : "SR"}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-sm text-slate-900 leading-tight font-semibold">
                    {effectiveRole === "AUDITOR" ? "Bambang Haryanto" : "Siti Rahma"}
                  </span>
                  <span className="text-xs text-slate-500 leading-tight">
                    {effectiveRole === "AUDITOR" ? "Lead Auditor" : "Bendahara"}
                  </span>
                </div>
              </div>

              {/* Dedicated Logout Button */}
              <button
                type="button"
                onClick={logout}
                className="h-9 px-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
                title="Keluar dari akun saat ini"
              >
                <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
