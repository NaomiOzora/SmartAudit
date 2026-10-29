"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, Bot, FileSearch, History, RefreshCw, BookOpen, ShieldCheck } from "lucide-react";

export default function AuditorSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Antrean Review",
      href: "/antrean-review",
      icon: Inbox,
    },
    {
      label: "Validasi Otomatis AI",
      href: "/validasi-ai",
      icon: Bot,
    },
    {
      label: "Detail Inspeksi Kas",
      href: "/detail-inspeksi/TX-88219",
      icon: FileSearch,
      activeMatch: "/detail-inspeksi",
    },
    {
      label: "Jejak Audit Trail",
      href: "/audit-trail-log",
      icon: History,
    },
    {
      label: "Riwayat Webhook ERP",
      href: "/riwayat-disbursement",
      icon: RefreshCw,
    },
    {
      label: "SOP Audit Forensik",
      href: "/panduan-kepatuhan",
      icon: BookOpen,
    },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 bg-white z-40 flex-col py-4 border-r border-slate-200">
      <nav className="flex-1 px-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = item.activeMatch
            ? pathname.startsWith(item.activeMatch)
            : pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={`inline-flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors text-sm ${
                isActive
                  ? "bg-rose-50 text-rose-700 font-semibold border border-rose-200 shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-rose-600" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Engine Status Box */}
      <div className="px-4 pt-3 mt-auto">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-semibold">Status Mesin Forensik</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="text-xs text-slate-800 font-semibold inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>pHash & Gemini Aktif</span>
          </div>
          <p className="text-xs text-slate-500 leading-tight">
            SLA Ekstraksi &le; 5.0 detik &bull; ISO 27001
          </p>
        </div>
      </div>
    </aside>
  );
}
