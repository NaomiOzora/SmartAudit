"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  currentRole?: "STAFF" | "AUDITOR" | "GUEST";
}

export default function Navbar({ currentRole = "GUEST" }: NavbarProps) {
  const pathname = usePathname();

  const staffLinks = [
    { label: "Beranda Staf", href: "/beranda-staf" },
    { label: "Input Pengeluaran", href: "/input-pengeluaran" },
    { label: "Riwayat Pencairan", href: "/riwayat-disbursement" },
    { label: "Panduan SOP", href: "/panduan-kepatuhan" },
  ];

  const auditorLinks = [
    { label: "Antrean Review", href: "/antrean-review" },
    { label: "Audit Trail Log", href: "/audit-trail-log" },
    { label: "Riwayat Webhook", href: "/riwayat-disbursement" },
    { label: "Panduan SOP", href: "/panduan-kepatuhan" },
  ];

  const activeLinks = currentRole === "AUDITOR" ? auditorLinks : staffLinks;

  return (
    <header className="fixed top-0 left-0 right-0 h-14 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="w-full h-14 px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo & Role Pill */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors">
              <span className="material-symbols-outlined text-[17px]">verified_user</span>
            </div>
            <span className="text-[16px] tracking-tight text-slate-900 font-bold">
              Smart<span className="text-blue-600">Audit</span>
            </span>
          </Link>

          {currentRole !== "GUEST" && (
            <div className="hidden sm:flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5 animate-pulse"></span>
              <span>{currentRole === "AUDITOR" ? "AUDITOR FORENSIK" : "STAF KEUANGAN"}</span>
            </div>
          )}

          {/* Navigation Links */}
          {currentRole !== "GUEST" && (
            <nav className="hidden md:flex items-center gap-1 ml-2">
              {activeLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                      isActive
                        ? "text-blue-600 bg-blue-50/70 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right Action Icons & Role Switcher */}
        <div className="flex items-center gap-2.5">
          {currentRole === "GUEST" ? (
            <div className="flex items-center gap-2">
              <Link
                href="/panduan-kepatuhan"
                className="hidden sm:inline-flex px-3 py-1 text-slate-600 hover:text-slate-900 text-[13px] font-medium transition-colors"
              >
                Kebijakan SOP
              </Link>
              <Link
                href="/login"
                className="h-8 px-3.5 flex items-center gap-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-[13px] font-medium transition-colors shadow-sm"
              >
                <span>Masuk Sistem</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </Link>
            </div>
          ) : (
            <>
              {/* Quick Role Switcher Pill */}
              <Link
                href={currentRole === "AUDITOR" ? "/beranda-staf" : "/antrean-review"}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 text-[12px] font-medium transition-colors border border-slate-200"
                title="Beralih peran secara instan"
              >
                <span className="material-symbols-outlined text-[15px] text-blue-600">
                  swap_horiz
                </span>
                <span className="hidden lg:inline text-slate-500">Ganti ke:</span>
                <span className="font-semibold text-blue-700">
                  {currentRole === "AUDITOR" ? "Staf Keuangan" : "Auditor"}
                </span>
              </Link>

              {/* Notification icon */}
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-500 transition-colors relative"
                title="Notifikasi"
              >
                <span className="material-symbols-outlined text-[18px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              </button>

              <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

              {/* User Avatar & Name */}
              <div className="flex items-center gap-2 pl-1">
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-[11px]">
                  {currentRole === "AUDITOR" ? "BH" : "SR"}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-[12px] text-slate-900 leading-tight font-semibold">
                    {currentRole === "AUDITOR" ? "Bambang H." : "Siti Rahma"}
                  </span>
                  <span className="text-[11px] text-slate-500 leading-none">
                    {currentRole === "AUDITOR" ? "Auditor Forensik" : "Finance Officer"}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
