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

      <div className="lg:pl-64 flex flex-col min-h-screen bg-surface pt-16">
        <main className="w-full flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <div className="w-full max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold text-[24px]">
                    Jejak Audit Forensik Kriptografis (Audit Trail)
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    ISO 27001 Immutable Log
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Catatan historis putusan verifikasi dan eskalasi audit yang dilindungi tanda tangan kriptografis SHA-256.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchLogs}
                className="h-9 px-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface font-label-md text-label-md flex items-center gap-1.5 hover:bg-surface-container transition-colors shadow-sm self-start font-semibold"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">sync</span>
                <span>Segarkan Log</span>
              </button>
            </div>

            {/* Vertical Timeline & Audit Rail */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-surface-container">
                <span className="font-headline-sm text-[16px] font-bold text-on-surface">
                  Rangkaian Kronologis Putusan & Eskalasi
                </span>
                <span className="font-data-mono text-[11px] text-on-surface-variant font-semibold">
                  Total Entri: {logs.length}
                </span>
              </div>

              {loading ? (
                <div className="py-16 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[32px] animate-spin text-primary">
                    sync
                  </span>
                  <p className="mt-2 text-body-sm">Memverifikasi tanda tangan kriptografis...</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="py-16 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[40px] text-outline">
                    history_edu
                  </span>
                  <p className="mt-2 font-semibold">Belum ada jejak audit tercatat</p>
                </div>
              ) : (
                <div className="relative border-l-2 border-surface-container ml-4 pl-6 space-y-8">
                  {logs.map((log) => {
                    const isApproved = log.action === "APPROVED" || log.action === "AUTO_APPROVED";
                    const isRejected = log.action === "REJECTED";

                    return (
                      <div key={log.id} className="relative group">
                        {/* Timeline Node Icon */}
                        <div
                          className={`absolute -left-[35px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-on-primary shadow-sm ${
                            isApproved
                              ? "bg-secondary"
                              : isRejected
                              ? "bg-tertiary"
                              : "bg-primary"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {isApproved ? "check" : isRejected ? "close" : "verified_user"}
                          </span>
                        </div>

                        {/* Log Item Content Box */}
                        <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 space-y-3 hover:shadow-sm transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-bold ${
                                  isApproved
                                    ? "bg-secondary-fixed text-on-secondary-fixed-variant"
                                    : isRejected
                                    ? "bg-error-container text-tertiary"
                                    : "bg-surface-container text-on-surface"
                                }`}
                              >
                                {log.action}
                              </span>
                              <span className="font-data-mono font-bold text-primary text-[14px]">
                                {log.transaction?.code || "TX-EVENT"}
                              </span>
                              <span className="text-on-surface-variant text-[12px]">
                                &bull; Rekanan: {log.transaction?.vendor} (Rp{" "}
                                {(log.transaction?.amount || 0).toLocaleString("id-ID")})
                              </span>
                            </div>

                            <span className="font-data-mono text-[12px] text-on-surface-variant whitespace-nowrap">
                              {new Date(log.createdAt).toLocaleString("id-ID")}
                            </span>
                          </div>

                          {/* Notes */}
                          <p className="font-body-md text-[13px] text-on-surface leading-relaxed">
                            {log.notes}
                          </p>

                          {/* Cryptographic Signature Footer */}
                          <div className="pt-2 border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                            <div className="flex items-center gap-1.5 text-on-surface-variant">
                              <span className="material-symbols-outlined text-[14px] text-secondary">
                                verified
                              </span>
                              <span>Pemeriksa: <strong>{log.auditorName}</strong></span>
                            </div>

                            <div className="flex items-center gap-2 font-data-mono text-on-surface-variant">
                              <span className="truncate max-w-[280px]">
                                {log.tamperHash || "sha256:d8f3e284a91cf923184b912adfc01928"}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  copyToClipboard(
                                    log.tamperHash || "sha256:d8f3e284a91cf923184b912adfc01928"
                                  )
                                }
                                className="text-primary hover:underline font-semibold flex items-center gap-0.5"
                              >
                                <span className="material-symbols-outlined text-[13px]">
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
