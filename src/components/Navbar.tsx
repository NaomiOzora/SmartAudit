"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { ShieldCheck, LogOut, ArrowRight, UserCircle2 } from "lucide-react";

interface NavbarProps {
  currentRole?: "STAFF" | "AUDITOR" | "GUEST";
}

export default function Navbar({ currentRole }: NavbarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const effectiveRole = currentRole || user?.role || "GUEST";

  // Dimensi Menu Staf Keuangan (Sederhana & Ringkas)
  const staffLinks = [
    { label: "Beranda", href: "/beranda-staf" },
    { label: "Input Pengeluaran", href: "/input-pengeluaran" },
    { label: "Panduan SOP", href: "/panduan-kepatuhan" },
  ];

  // Mobile links for auditor (on desktop, sidebar is used)
  const auditorLinks = [
    { label: "Antrean", href: "/antrean-review" },
    { label: "Validasi AI", href: "/validasi-ai" },
    { label: "Audit Trail", href: "/audit-trail-log" },
    { label: "Webhook ERP", href: "/riwayat-disbursement" },
    { label: "SOP", href: "/panduan-kepatuhan" },
  ];

  const brandHref =
    effectiveRole === "AUDITOR"
      ? "/antrean-review"
      : effectiveRole === "STAFF"
      ? "/beranda-staf"
      : "/";

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-white border-b border-slate-200">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Brand Logo & Ringkas Badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href={brandHref} className="inline-flex items-center gap-2.5 group">
            <div
              className={`w-9 h-9 rounded-xl inline-flex items-center justify-center text-white shrink-0 transition-colors shadow-xs ${
                effectiveRole === "AUDITOR"
                  ? "bg-rose-600 group-hover:bg-rose-700"
                  : "bg-blue-600 group-hover:bg-blue-700"
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold tracking-tight text-slate-900">
                Smart<span className={effectiveRole === "AUDITOR" ? "text-rose-600" : "text-blue-600"}>Audit</span>
              </span>
            </div>
          </Link>

          {effectiveRole !== "GUEST" && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap shrink-0">
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  effectiveRole === "AUDITOR" ? "bg-rose-600" : "bg-blue-600"
                }`}
              ></span>
              <span
                className={`whitespace-nowrap ${
                  effectiveRole === "AUDITOR" ? "text-rose-700" : "text-blue-700"
                }`}
              >
                {effectiveRole === "AUDITOR" ? "Satuan Audit Penjamin Keuangan" : "Purchasing & Pengadaan"}
              </span>
            </div>
          )}

          {/* Navigation Links for Staff */}
          {effectiveRole === "STAFF" && (
            <nav className="hidden md:flex items-center gap-1 ml-2">
              {staffLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={false}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      isActive
                        ? "text-blue-700 bg-blue-50 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Navigation Links for Auditor on Mobile Only (Desktop uses AuditorSidebar) */}
          {effectiveRole === "AUDITOR" && (
            <nav className="flex lg:hidden items-center gap-1 ml-2">
              {auditorLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={false}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? "text-rose-700 bg-rose-50 font-semibold border border-rose-200"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
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
                href="/login"
                prefetch={false}
                className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors shadow-xs"
              >
                <span>Masuk Akun</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-right">
                <span className="text-xs font-semibold text-slate-800">
                  {user?.name || (effectiveRole === "AUDITOR" ? "Bambang H." : "Siti Rahma")}
                </span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-xs text-slate-500">
                  {user?.department || (effectiveRole === "AUDITOR" ? "Satuan Audit Penjamin Keuangan" : "Finance, Accounting & Tax")}
                </span>
              </div>

              <button
                type="button"
                onClick={logout}
                title="Keluar dari sesi"
                className="h-8 px-3 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
