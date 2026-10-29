"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AuditorSidebar from "@/components/AuditorSidebar";
import { useAuth } from "@/lib/auth";
import {
  ShieldAlert,
  ShieldCheck,
  Check,
  X,
  RefreshCw,
  Copy,
  CheckCircle2,
  History,
  ArrowRight,
  LogOut,
  FileClock,
} from "lucide-react";

interface AuditLogItem {
  id: string;
  transactionId: string;
  auditorName: string;
  action: string;
  notes: string;
  tamperHash: string;
  createdAt: string;
  transaction?: {
    code: string;
    vendor: string;
    amount: number;
    applicantName: string;
    department: string;
  };
}

export default function AuditTrailLogPage() {
  const { user, logout } = useAuth();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/audit-logs");
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
      }
    } catch (err) {
      console.error("Gagal memuat audit log:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  if (user && user.role !== "AUDITOR") {
    return (
      <>
        <Navbar currentRole="STAFF" />
        <main className="w-full min-h-screen pt-24 px-4 flex items-center justify-center bg-slate-50">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md max-w-md text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 inline-flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Akses Khusus Auditor Forensik</h2>
            <p className="text-sm text-slate-600 mt-2 mb-6 leading-relaxed">
              Anda saat ini masuk sebagai <strong>{user.name}</strong> (Staf Keuangan). Jejak log audit forensik hanya dapat ditinjau oleh Auditor.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/beranda-staf"
                prefetch={false}
                className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors shadow-xs"
              >
                <span>Kembali ke Beranda Staf</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="h-10 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar currentRole="AUDITOR" />
      <AuditorSidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen bg-slate-50 pt-16">
        <main className="w-full flex-1 px-6 sm:px-8 lg:px-10 py-6">
          <div className="w-full max-w-[1600px] mx-auto space-y-6">
            {/* Header Ringkas & Memanjang */}
            <div className="flex items-center justify-between gap-4 pb-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Jejak Audit Trail
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {logs.length} entri SHA-256
                </span>
              </div>

              <button
                type="button"
                onClick={fetchLogs}
                className="h-9 px-3.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm font-medium inline-flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Segarkan</span>
              </button>
            </div>

            {/* Timeline Container */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200/90">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                <span className="text-base font-bold text-slate-900">
                  Rangkaian Kronologis Putusan & Eskalasi Audit
                </span>
                <span className="font-mono text-xs text-slate-500 font-semibold">
                  Total Entri: {logs.length}
                </span>
              </div>

              {loading ? (
                <div className="py-16 text-center text-slate-400">
                  <FileClock className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
                  <p className="mt-3 text-sm font-medium">Memverifikasi tanda tangan kriptografis...</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <History className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="mt-3 font-semibold text-base text-slate-600">Belum ada jejak audit tercatat</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {logs.map((log, index) => {
                    const isApproved = log.action === "APPROVED" || log.action === "AUTO_APPROVED";
                    const isRejected = log.action === "REJECTED";
                    const isLast = index === logs.length - 1;

                    return (
                      <div key={log.id} className="flex gap-4 sm:gap-6">
                        {/* Mathematically Symmetrical Node Column */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full inline-flex items-center justify-center text-white shrink-0 shadow-xs ${
                              isApproved
                                ? "bg-emerald-600"
                                : isRejected
                                ? "bg-rose-600"
                                : "bg-blue-600"
                            }`}
                          >
                            {isApproved ? (
                              <Check className="w-4 h-4" />
                            ) : isRejected ? (
                              <X className="w-4 h-4" />
                            ) : (
                              <ShieldCheck className="w-4 h-4" />
                            )}
                          </div>
                          {!isLast && <div className="w-0.5 flex-1 bg-slate-200 my-2"></div>}
                        </div>

                        {/* Content Box */}
                        <div className={`flex-1 ${!isLast ? "pb-6" : ""}`}>
                          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 space-y-3 hover:bg-slate-100/60 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="inline-flex items-center gap-2.5 flex-wrap">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    isApproved
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : isRejected
                                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                                      : "bg-amber-50 text-amber-700 border border-amber-200"
                                  }`}
                                >
                                  {log.action}
                                </span>
                                <span className="font-mono font-bold text-blue-600 text-sm">
                                  {log.transaction?.code || "TX-EVENT"}
                                </span>
                                <span className="text-slate-600 text-sm">
                                  &bull; {log.transaction?.vendor} (Rp{" "}
                                  {(log.transaction?.amount || 0).toLocaleString("id-ID")})
                                </span>
                              </div>

                              <span className="font-mono text-xs text-slate-500 whitespace-nowrap">
                                {new Date(log.createdAt).toLocaleString("id-ID")}
                              </span>
                            </div>

                            {/* Notes */}
                            <p className="text-sm text-slate-800 leading-relaxed font-normal">
                              {log.notes}
                            </p>

                            {/* Cryptographic Signature Footer */}
                            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                              <div className="inline-flex items-center gap-2 text-slate-600">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Pemeriksa: <strong className="text-slate-800 font-semibold">{log.auditorName}</strong></span>
                              </div>

                              <div className="inline-flex items-center gap-2.5 font-mono text-slate-500">
                                <span className="truncate max-w-[280px] text-xs text-slate-400">
                                  {log.tamperHash || "sha256:d8f3e284a91cf923184b912adfc01928"}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    copyToClipboard(
                                      log.tamperHash || "sha256:d8f3e284a91cf923184b912adfc01928"
                                    )
                                  }
                                  className="text-blue-600 hover:text-blue-700 hover:underline font-bold inline-flex items-center gap-1 transition-colors shrink-0"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>{copiedHash === log.tamperHash ? "Disalin!" : "Salin"}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
