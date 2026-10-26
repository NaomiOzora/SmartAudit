"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  currentRole?: "STAFF" | "AUDITOR" | "GUEST";
}

export default function Navbar({ currentRole = "GUEST" }: NavbarProps) {
  const pathname = usePathname();

  // Mode Staf Nav items
  const staffLinks = [
    { label: "Beranda Staf", href: "/beranda-staf" },
    { label: "Input Pengeluaran", href: "/input-pengeluaran" },
    { label: "Riwayat Disbursement", href: "/riwayat-disbursement" },
    { label: "Panduan Kepatuhan", href: "/panduan-kepatuhan" },
  ];

  // Mode Auditor Nav items
  const auditorLinks = [
    { label: "Antrean Review", href: "/antrean-review" },
    { label: "Audit Trail Log", href: "/audit-trail-log" },
    { label: "Riwayat Webhook", href: "/riwayat-disbursement" },
    { label: "Panduan Kepatuhan", href: "/panduan-kepatuhan" },
  ];

  const activeLinks = currentRole === "AUDITOR" ? auditorLinks : staffLinks;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-surface-container-lowest/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container">
      <div className="w-full h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Role Pill */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 text-primary group">
            <div className="w-8 h-8 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </div>
            <span className="font-headline-md text-headline-md tracking-tight text-on-surface font-bold">
              Smart<span className="text-primary">Audit</span>
            </span>
          </Link>

          {currentRole !== "GUEST" && (
            <div className="hidden sm:flex items-center px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5 animate-pulse"></span>
              <span>{currentRole === "AUDITOR" ? "AUDITOR FORENSIK" : "STAF KEUANGAN"}</span>
            </div>
          )}

          {/* Desktop Navigation Links */}
          {currentRole !== "GUEST" && (
            <nav className="hidden md:flex items-center gap-1 ml-2">
              {activeLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-colors ${
                      isActive
                        ? "text-primary-container font-semibold bg-surface-container-low"
                        : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
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
        <div className="flex items-center gap-3">
          {currentRole === "GUEST" ? (
            <div className="flex items-center gap-2">
              <Link
                href="/panduan-kepatuhan"
                className="hidden sm:inline-flex px-3 py-1.5 text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors"
              >
                Kebijakan SOP
              </Link>
              <Link
                href="/login"
                className="h-9 px-4 flex items-center gap-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary/90 font-label-md text-label-md font-semibold transition-colors shadow-sm"
              >
                <span>Masuk Sistem</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          ) : (
            <>
              {/* Quick Role Switcher Pill */}
              <Link
                href={currentRole === "AUDITOR" ? "/beranda-staf" : "/antrean-review"}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors border border-outline-variant/30"
                title="Beralih peran secara instan"
              >
                <span className="material-symbols-outlined text-[16px] text-primary-container">
                  swap_horiz
                </span>
                <span className="hidden lg:inline text-on-surface-variant text-body-sm">
                  Ganti ke:
                </span>
                <span className="font-semibold text-primary-container">
                  {currentRole === "AUDITOR" ? "Staf Keuangan" : "Auditor"}
                </span>
              </Link>

              {/* Notification icon */}
              <button
                type="button"
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors relative"
                title="Notifikasi"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-tertiary"></span>
              </button>

              <div className="h-6 w-px bg-outline-variant/30 hidden sm:block"></div>

              {/* User Avatar & Name */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shadow-sm">
                  {currentRole === "AUDITOR" ? "BH" : "SR"}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="font-label-md text-label-md text-on-surface leading-tight font-semibold">
                    {currentRole === "AUDITOR" ? "Bambang H." : "Siti Rahma"}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
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
