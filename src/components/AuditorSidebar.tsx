"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuditorSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Antrean Review",
      href: "/antrean-review",
      icon: "inbox",
    },
    {
      label: "Detail Inspeksi Forensik",
      href: "/detail-inspeksi/TX-88219",
      icon: "document_scanner",
      activeMatch: "/detail-inspeksi",
    },
    {
      label: "Audit Trail Log",
      href: "/audit-trail-log",
      icon: "history_edu",
    },
    {
      label: "Riwayat Webhook",
      href: "/riwayat-disbursement",
      icon: "sync_alt",
    },
    {
      label: "Panduan Kepatuhan",
      href: "/panduan-kepatuhan",
      icon: "menu_book",
    },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 bg-surface-container-lowest z-40 flex-col py-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.03)] border-r border-surface-container">
      <div className="px-space-lg pb-space-md flex items-center justify-between">
        <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase font-semibold">
          Investigasi & Audit
        </span>
        <span className="font-label-sm text-[10px] bg-tertiary-container/10 text-tertiary px-1.5 py-0.5 rounded font-bold">
          STRICT
        </span>
      </div>

      <nav className="flex-1 px-space-md flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = item.activeMatch
            ? pathname.startsWith(item.activeMatch)
            : pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-space-md px-space-md py-2.5 rounded-xl transition-all font-body-md text-body-md ${
                isActive
                  ? "bg-primary-container text-on-primary-container font-semibold shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Engine Status & Rigor Box */}
      <div className="px-space-md pt-space-md mt-auto">
        <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">
              AI Verification v4.2
            </span>
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          </div>
          <div className="font-body-sm text-body-sm text-on-surface font-medium flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
            <span>pHash & Gemini Ready</span>
          </div>
          <p className="text-[11px] text-on-surface-variant leading-tight">
            SLA Verifikasi &le; 5.0s &bull; Kepatuhan ISO 27001
          </p>
        </div>
      </div>
    </aside>
  );
}
