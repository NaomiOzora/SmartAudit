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
      label: "Detail Inspeksi Kas",
      href: "/detail-inspeksi/TX-88219",
      icon: "document_scanner",
      activeMatch: "/detail-inspeksi",
    },
    {
      label: "Jejak Audit Trail",
      href: "/audit-trail-log",
      icon: "history_edu",
    },
    {
      label: "Riwayat Webhook",
      href: "/riwayat-disbursement",
      icon: "sync_alt",
    },
    {
      label: "Panduan SOP",
      href: "/panduan-kepatuhan",
      icon: "menu_book",
    },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-14 bottom-0 w-60 bg-white z-40 flex-col py-4 border-r border-slate-200">
      <div className="px-4 pb-3 flex items-center justify-between border-b border-slate-100 mb-2">
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
          Investigasi & Audit
        </span>
        <span className="text-[11px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-medium border border-rose-200">
          STRICT
        </span>
      </div>

      <nav className="flex-1 px-3 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive = item.activeMatch
            ? pathname.startsWith(item.activeMatch)
            : pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={`inline-flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-xs ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold border border-blue-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[18px] shrink-0 ${
                  isActive ? "text-blue-600" : "text-slate-400"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Engine Status Box */}
      <div className="px-3 pt-3 mt-auto">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Status Mesin Audit</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-xs text-slate-800 font-medium inline-flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-blue-600 shrink-0">
              verified
            </span>
            <span>pHash & Gemini Aktif</span>
          </div>
          <p className="text-[11px] text-slate-500">
            SLA Verifikasi &le; 5.0 detik
          </p>
        </div>
      </div>
    </aside>
  );
}
