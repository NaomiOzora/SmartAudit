"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import {
  ChevronRight,
  RefreshCw,
  FileCode,
  X,
  FileClock,
  Radio,
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

      <main className="w-full min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-16 bg-slate-50">
        <div className="w-full max-w-7xl mx-auto space-y-6 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider mb-1 font-semibold">
                <span>Modul Integrasi Kas</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-blue-600 font-semibold">Outbound Webhook Telemetry</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Riwayat Pencairan Kas & Outbound Webhook
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Monitoring transmisi otomatis instruksi pencairan dana ke sistem ERP / Bank Kasir eksternal.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchWebhookLogs}
              className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold inline-flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-xs self-start"
            >
              <RefreshCw className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Segarkan Telemetri</span>
            </button>
          </div>

          {/* Table Container - Generous & Roomy */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <span className="text-base font-bold text-slate-900">
                Log Transmisi Webhook Eksternal
              </span>
              <span className="font-mono text-xs text-emerald-700 font-semibold px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                POST /api/webhook/finance/disbursement
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-600 font-bold text-xs uppercase tracking-wider border-b border-slate-200/80">
                    <th className="py-3.5 px-6 font-semibold">Waktu Dispatch</th>
                    <th className="py-3.5 px-4 font-semibold">Kode Transaksi</th>
                    <th className="py-3.5 px-4 font-semibold">Penerima & Divisi</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Nominal</th>
                    <th className="py-3.5 px-4 font-semibold text-center">Status HTTP</th>
                    <th className="py-3.5 px-6 font-semibold text-right">Payload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <FileClock className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                        <p className="mt-2 text-sm">Memuat log webhook...</p>
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Radio className="w-10 h-10 text-slate-300 mx-auto" />
                        <p className="mt-2 font-semibold text-sm text-slate-600">Belum ada pengiriman webhook</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Transaksi yang disetujui otomatis atau disetujui auditor akan memicu transmisi webhook.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => {
                      const isOk = log.statusCode === 200;
                      return (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6 font-mono text-slate-500 text-xs whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString("id-ID")}
                          </td>
                          <td className="py-4 px-4 font-mono text-blue-600 font-bold text-sm">
                            {log.transaction?.code || "TX-UNKNOWN"}
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-semibold text-slate-900 block text-sm">
                              {log.transaction?.vendor}
                            </span>
                            <span className="text-xs text-slate-500 mt-0.5 block">
                              {log.transaction?.applicantName} &bull; {log.transaction?.department}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono font-bold text-right text-slate-900 whitespace-nowrap text-sm">
                            Rp {(log.transaction?.amount || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                                isOk
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${isOk ? "bg-emerald-500" : "bg-rose-500"}`}
                              ></span>
                              <span>HTTP {log.statusCode} {log.status}</span>
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedPayload(log.payload)}
                              className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors border border-slate-200"
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
              <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="inline-flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-blue-600 shrink-0" />
                    <h3 className="text-base font-bold text-slate-900">
                      Outbound Webhook JSON Payload
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPayload(null)}
                    className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 bg-slate-900 p-4 rounded-xl overflow-x-auto max-h-96 border border-slate-800">
                  <pre className="font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {JSON.stringify(JSON.parse(selectedPayload), null, 2)}
                  </pre>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedPayload(null)}
                    className="h-10 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors"
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
