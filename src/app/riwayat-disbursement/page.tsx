"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AuditorSidebar from "@/components/AuditorSidebar";
import { useAuth } from "@/lib/auth";
import {
  ChevronRight,
  RefreshCw,
  FileCode,
  X,
  FileClock,
  Radio,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Ban,
} from "lucide-react";

interface WebhookLogItem {
  id: string;
  transactionId: string;
  targetUrl: string;
  payload: string;
  statusCode: number;
  responseBody: string;
  status: string;
  createdAt: string;
  transaction?: {
    code: string;
    vendor: string;
    amount: number;
    applicantName: string;
    department: string;
  };
}

export default function RiwayatDisbursementPage() {
  const { user } = useAuth("AUDITOR");
  const [logs, setLogs] = useState<WebhookLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayload, setSelectedPayload] = useState<string | null>(null);

  useEffect(() => {
    fetchWebhookLogs();
  }, []);

  const fetchWebhookLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/webhook-logs");
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
      }
    } catch (err) {
      console.error("Gagal memuat log webhook:", err);
    } finally {
      setLoading(false);
    }
  };

  // Proteksi Akses Dimensi: Staf Biasa Dilarang Mengakses Telemetri Webhook Kasir
  if (user && user.role !== "AUDITOR") {
    return (
      <>
        <Navbar currentRole="STAFF" />
        <main className="w-full min-h-screen pt-24 px-4 flex items-center justify-center bg-slate-50">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md max-w-md text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 inline-flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Akses Dibatasi: Khusus Auditor Forensik</h2>
            <p className="text-sm text-slate-600 mt-2 mb-6 leading-relaxed">
              Modul telemetri riwayat webhook pencairan kas ERP diperuntukkan bagi <strong>Auditor Forensik & Verifikator Sistem</strong>.
            </p>
            <Link
              href="/beranda-staf"
              prefetch={false}
              className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors shadow-xs"
            >
              <span>Kembali ke Beranda Staf</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
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
        <main className="w-full max-w-[1600px] mx-auto p-6 sm:px-8 lg:px-10 py-6 space-y-6">
          {/* Header Ringkas & Memanjang */}
          <div className="flex items-center justify-between gap-4 pb-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Riwayat Webhook ERP
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                {logs.length} transmisi
              </span>
            </div>

            <button
              type="button"
              onClick={fetchWebhookLogs}
              className="h-9 px-3.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm font-medium inline-flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 shrink-0 ${loading ? "animate-spin" : ""}`} />
              <span>Segarkan</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white flex-wrap gap-2">
              <span className="text-base font-bold text-slate-900">
                Log Transmisi Webhook Eksternal
              </span>
              <span className="font-mono text-xs text-slate-700 font-semibold px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                Target: POST /api/webhook/finance/disbursement
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-600 font-bold text-xs uppercase tracking-wider border-b border-slate-200/80">
                    <th className="py-3.5 px-6 font-semibold">Waktu Dispatch</th>
                    <th className="py-3.5 px-4 font-semibold">Kode Transaksi</th>
                    <th className="py-3.5 px-4 font-semibold">Event / Penerima</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Nominal</th>
                    <th className="py-3.5 px-4 font-semibold text-center">Status Transmisi</th>
                    <th className="py-3.5 px-6 font-semibold text-right">Payload JSON</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <FileClock className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                        <p className="mt-2 text-sm font-medium">Memuat log webhook...</p>
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        <Radio className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
                        <p className="font-semibold text-slate-800">Belum Ada Transmisi Webhook</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Webhook otomatis tertembak saat transaksi disetujui (Approved) atau dibatalkan (Cancelled).
                        </p>
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => {
                      let parsedPayload: any = {};
                      try {
                        parsedPayload = JSON.parse(log.payload);
                      } catch {}

                      const isCancelled = log.status === "CANCELLED" || parsedPayload.event?.includes("CANCEL");
                      const isSuccess = log.status === "SUCCESS";

                      return (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-6 text-xs text-slate-500 font-mono whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString("id-ID")}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-xs">
                            {log.transaction?.code || parsedPayload.transactionId || "-"}
                          </td>
                          <td className="py-3.5 px-4 text-xs">
                            <span className="font-semibold text-slate-900 block truncate max-w-[200px]">
                              {log.transaction?.vendor || parsedPayload.vendor || "Kasir Eksternal"}
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              {parsedPayload.applicant ? `Pemohon: ${parsedPayload.applicant}` : ""}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-xs font-mono font-bold text-right text-slate-900">
                            Rp {(log.transaction?.amount || parsedPayload.amount || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {isCancelled ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap shrink-0">
                                <Ban className="w-3 h-3 text-rose-600 shrink-0" />
                                <span>VOID (Dibatalkan)</span>
                              </span>
                            ) : isSuccess ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap shrink-0">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>200 OK (Terkirim)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap shrink-0">
                                <XCircle className="w-3 h-3 text-rose-600 shrink-0" />
                                <span>{log.statusCode || 500} Gagal</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedPayload(log.payload)}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-blue-600 font-semibold text-xs inline-flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <FileCode className="w-3.5 h-3.5" />
                              <span>Lihat JSON</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* JSON Payload Inspector Modal */}
      {selectedPayload && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Inspeksi Payload JSON Webhook</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPayload(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-500 inline-flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-slate-950 font-mono text-xs text-emerald-400">
              <pre className="whitespace-pre-wrap leading-relaxed">
                {(() => {
                  try {
                    return JSON.stringify(JSON.parse(selectedPayload), null, 2);
                  } catch {
                    return selectedPayload;
                  }
                })()}
              </pre>
            </div>

            <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-white text-xs text-slate-500">
              <span>Paket data transmisi mesin kasir eksternal.</span>
              <button
                type="button"
                onClick={() => setSelectedPayload(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
