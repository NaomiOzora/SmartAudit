"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";

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
  const { user } = useAuth();
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

  return (
    <>
      <Navbar currentRole={user?.role || "STAFF"} />

      <main className="w-full min-h-screen pt-16 px-4 sm:px-6 lg:px-8 pb-12 bg-slate-50">
        <div className="w-full max-w-7xl mx-auto space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-slate-500 text-[11px] uppercase tracking-wider mb-0.5 font-medium">
                <span>Modul Integrasi Kas</span>
                <span className="material-symbols-outlined text-[13px] shrink-0">chevron_right</span>
                <span className="text-blue-600 font-medium">Outbound Webhook Telemetry</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Riwayat Pencairan Kas & Outbound Webhook
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring transmisi instruksi pencairan dana ke sistem ERP / Bank Kasir eksternal.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchWebhookLogs}
              className="h-8 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium inline-flex items-center gap-1.5 hover:bg-slate-50 transition-colors shadow-xs self-start"
            >
              <span className="material-symbols-outlined text-[15px] text-blue-600 shrink-0">sync</span>
              <span>Segarkan Telemetri</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white">
              <span className="text-xs font-semibold text-slate-800">
                Log Transmisi Webhook Eksternal
              </span>
              <span className="font-mono text-[11px] text-emerald-700 font-medium px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200/60">
                POST /api/webhook/finance/disbursement
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 font-medium text-[11px] uppercase tracking-wider border-b border-slate-200/70">
                    <th className="py-2.5 px-4 font-semibold">Waktu Dispatch</th>
                    <th className="py-2.5 px-3 font-semibold">Kode Transaksi</th>
                    <th className="py-2.5 px-3 font-semibold">Penerima & Divisi</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Nominal</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Status HTTP</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Payload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <span className="material-symbols-outlined text-[24px] animate-spin text-blue-600">
                          sync
                        </span>
                        <p className="mt-1.5 text-xs">Memuat log webhook...</p>
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <span className="material-symbols-outlined text-[32px] text-slate-300">
                          sync_alt
                        </span>
                        <p className="mt-1.5 font-medium text-xs text-slate-600">Belum ada pengiriman webhook</p>
                        <p className="text-[11px] text-slate-400">
                          Transaksi yang disetujui otomatis atau disetujui auditor akan memicu transmisi webhook.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => {
                      const isOk = log.statusCode === 200;
                      return (
                        <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString("id-ID")}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-blue-600 font-medium">
                            {log.transaction?.code || "TX-UNKNOWN"}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-medium text-slate-800 block text-xs">
                              {log.transaction?.vendor}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {log.transaction?.applicantName} &bull; {log.transaction?.department}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono font-semibold text-right text-slate-900 whitespace-nowrap">
                            Rp {(log.transaction?.amount || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                                isOk
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                                  : "bg-rose-50 text-rose-700 border border-rose-200/50"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${isOk ? "bg-emerald-500" : "bg-rose-500"}`}
                              ></span>
                              <span>HTTP {log.statusCode} {log.status}</span>
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedPayload(log.payload)}
                              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors border border-slate-200/60"
                            >
                              Lihat JSON
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

          {/* JSON Payload Inspector Modal */}
          {selectedPayload && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
              <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <div className="inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-blue-600 text-[18px] shrink-0">code</span>
                    <h3 className="text-xs font-semibold text-slate-900">
                      Outbound Webhook JSON Payload
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPayload(null)}
                    className="w-7 h-7 rounded-md inline-flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>

                <div className="mt-3 bg-slate-900 p-3.5 rounded-lg overflow-x-auto max-h-80 border border-slate-800">
                  <pre className="font-mono text-[11px] text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {JSON.stringify(JSON.parse(selectedPayload), null, 2)}
                  </pre>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedPayload(null)}
                    className="h-8 px-3.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
