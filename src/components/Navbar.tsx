"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

interface NavbarProps {
  currentRole?: "STAFF" | "AUDITOR" | "GUEST";
}

export default function Navbar({ currentRole }: NavbarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // If currentRole prop is passed explicitly, we respect it, otherwise fallback to session user role
  const effectiveRole = currentRole || user?.role || "GUEST";

  const staffLinks = [
    { label: "Beranda", href: "/beranda-staf" },
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
    <header className="fixed top-0 left-0 right-0 h-14 z-50 bg-white border-b border-slate-200">
      <div className="w-full h-14 px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo & Role Badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-blue-600 inline-flex items-center justify-center text-white shrink-0 group-hover:bg-blue-700 transition-colors">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-900">
              Smart<span className="text-blue-600">Audit</span>
            </span>
          </Link>

          {effectiveRole !== "GUEST" && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  effectiveRole === "AUDITOR" ? "bg-rose-500" : "bg-blue-600"
                }`}
              ></span>
              <span>{effectiveRole === "AUDITOR" ? "Auditor Forensik" : "Staf Keuangan"}</span>
            </div>
          )}

          {/* Navigation Links */}
          {effectiveRole !== "GUEST" && (
            <nav className="hidden md:flex items-center gap-1 ml-3">
              {activeLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={false}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? "text-blue-600 bg-blue-50/80 font-semibold"
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
        <div className="flex items-center gap-2">
          {effectiveRole === "GUEST" ? (
            <div className="flex items-center gap-2">
              <Link
                href="/panduan-kepatuhan"
                prefetch={false}
                className="hidden sm:inline-flex px-3 py-1.5 text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors"
              >
                Panduan SOP
              </Link>
              <Link
                href="/login"
                prefetch={false}
                className="h-8 px-3.5 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium transition-colors shadow-xs"
              >
                <span>Masuk Sistem</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* User Profile Pill */}
              <div className="flex items-center gap-2 pl-1">
                <div
                  className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-white font-semibold text-xs shrink-0 ${
                    effectiveRole === "AUDITOR" ? "bg-rose-600" : "bg-blue-600"
                  }`}
                >
                  {effectiveRole === "AUDITOR" ? "BH" : "SR"}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs text-slate-900 leading-tight font-semibold">
                    {effectiveRole === "AUDITOR" ? "Bambang Haryanto" : "Siti Rahma"}
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight">
                    {effectiveRole === "AUDITOR" ? "Lead Auditor" : "Bendahara"}
                  </span>
                </div>
              </div>

              {/* Dedicated Logout Button */}
              <button
                type="button"
                onClick={logout}
                className="h-8 px-2.5 sm:px-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 text-xs font-medium transition-colors shadow-xs"
                title="Keluar dari akun saat ini"
              >
                <span className="material-symbols-outlined text-[15px] text-slate-400 group-hover:text-rose-600">
                  logout
                </span>
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
