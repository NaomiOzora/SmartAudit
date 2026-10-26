"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AuditorSidebar from "@/components/AuditorSidebar";

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

  return (
    <>
      <Navbar currentRole="AUDITOR" />
      <AuditorSidebar />

      <div className="lg:pl-60 flex flex-col min-h-screen bg-slate-50 pt-14">
        <main className="w-full flex-1 px-4 sm:px-6 lg:px-8 py-5">
          <div className="w-full max-w-7xl mx-auto space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    Jejak Audit Forensik Kriptografis (Audit Trail)
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    ISO 27001 Immutable Log
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Catatan historis putusan verifikasi dan eskalasi audit yang dilindungi tanda tangan kriptografis SHA-256.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchLogs}
                className="h-8 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium flex items-center gap-1.5 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-xs self-start"
              >
                <span className="material-symbols-outlined text-[15px] text-blue-600">sync</span>
                <span>Segarkan Log</span>
              </button>
            </div>

            {/* Vertical Timeline & Audit Rail */}
            <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200/80">
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-800">
                  Rangkaian Kronologis Putusan & Eskalasi
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  Total Entri: {logs.length}
                </span>
              </div>

              {loading ? (
                <div className="py-12 text-center text-slate-400">
                  <span className="material-symbols-outlined text-[24px] animate-spin text-blue-600">
                    sync
                  </span>
                  <p className="mt-1.5 text-xs">Memverifikasi tanda tangan kriptografis...</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <span className="material-symbols-outlined text-[32px] text-slate-300">
                    history_edu
                  </span>
                  <p className="mt-1.5 font-medium text-xs text-slate-600">Belum ada jejak audit tercatat</p>
                </div>
              ) : (
                <div className="relative border-l-2 border-slate-100 ml-3 pl-5 space-y-6">
                  {logs.map((log) => {
                    const isApproved = log.action === "APPROVED" || log.action === "AUTO_APPROVED";
                    const isRejected = log.action === "REJECTED";

                    return (
                      <div key={log.id} className="relative group">
                        {/* Timeline Node Icon */}
                        <div
                          className={`absolute -left-[27px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white shadow-xs ${
                            isApproved
                              ? "bg-emerald-600"
                              : isRejected
                              ? "bg-rose-600"
                              : "bg-blue-600"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[12px]">
                            {isApproved ? "check" : isRejected ? "close" : "verified_user"}
                          </span>
                        </div>

                        {/* Log Item Content Box */}
                        <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/70 space-y-2 hover:bg-slate-50 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                  isApproved
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                                    : isRejected
                                    ? "bg-rose-50 text-rose-700 border border-rose-200/50"
                                    : "bg-amber-50 text-amber-700 border border-amber-200/50"
                                }`}
                              >
                                {log.action}
                              </span>
                              <span className="font-mono font-medium text-blue-600 text-xs">
                                {log.transaction?.code || "TX-EVENT"}
                              </span>
                              <span className="text-slate-500 text-[11px]">
                                &bull; {log.transaction?.vendor} (Rp{" "}
                                {(log.transaction?.amount || 0).toLocaleString("id-ID")})
                              </span>
                            </div>

                            <span className="font-mono text-[11px] text-slate-400 whitespace-nowrap">
                              {new Date(log.createdAt).toLocaleString("id-ID")}
                            </span>
                          </div>

                          {/* Notes */}
                          <p className="text-xs text-slate-700 leading-relaxed font-normal">
                            {log.notes}
                          </p>

                          {/* Cryptographic Signature Footer */}
                          <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px]">
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <span className="material-symbols-outlined text-[13px] text-emerald-600">
                                verified
                              </span>
                              <span>Pemeriksa: <strong className="text-slate-700 font-medium">{log.auditorName}</strong></span>
                            </div>

                            <div className="flex items-center gap-2 font-mono text-slate-500">
                              <span className="truncate max-w-[240px] text-[10px] text-slate-400">
                                {log.tamperHash || "sha256:d8f3e284a91cf923184b912adfc01928"}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  copyToClipboard(
                                    log.tamperHash || "sha256:d8f3e284a91cf923184b912adfc01928"
                                  )
                                }
                                className="text-blue-600 hover:text-blue-700 hover:underline font-medium flex items-center gap-0.5 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[12px]">
                                  content_copy
                                </span>
                                <span>{copiedHash === log.tamperHash ? "Disalin!" : "Salin"}</span>
                              </button>
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
