"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

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
      <Navbar currentRole="STAFF" />

      <main className="w-full min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12 bg-surface">
        <div className="w-full max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-1 font-semibold">
                <span>Modul Integrasi Kas</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-primary font-semibold">Outbound Webhook Telemetry</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold text-[24px]">
                Riwayat Pencairan Kas & Outbound Webhook
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                Monitoring otomatis transmisi instruksi pencairan dana ke sistem ERP Bank Kasir eksternal.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchWebhookLogs}
              className="h-9 px-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface font-label-md text-label-md flex items-center gap-1.5 hover:bg-surface-container transition-colors shadow-sm self-start font-semibold"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">sync</span>
              <span>Segarkan Telemetri</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-container flex items-center justify-between">
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface text-[16px]">
                Log Transmisi Webhook Eksternal
              </span>
              <span className="font-data-mono text-[11px] text-secondary font-bold px-2.5 py-0.5 rounded-full bg-secondary-fixed/50">
                POST /api/webhook/finance/disbursement
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-surface-container">
                    <th className="py-3 px-6 font-semibold">Waktu Dispatch</th>
                    <th className="py-3 px-4 font-semibold">Kode Transaksi</th>
                    <th className="py-3 px-4 font-semibold">Penerima & Divisi</th>
                    <th className="py-3 px-4 font-semibold text-right">Nominal</th>
                    <th className="py-3 px-4 font-semibold text-center">Status HTTP</th>
                    <th className="py-3 px-6 font-semibold text-right">Payload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container font-body-md text-body-md">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-[28px] animate-spin text-primary">
                          sync
                        </span>
                        <p className="mt-2 text-body-sm">Memuat log webhook...</p>
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-[36px] text-outline">
                          sync_alt
                        </span>
                        <p className="mt-2 font-semibold">Belum ada pengiriman webhook</p>
                        <p className="text-body-sm text-on-surface-variant">
                          Transaksi yang disetujui otomatis atau disetujui auditor akan memicu transmisi webhook.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => {
                      const isOk = log.statusCode === 200;
                      return (
                        <tr key={log.id} className="hover:bg-surface-container-low/40 transition-colors">
                          <td className="py-3.5 px-6 font-data-mono text-on-surface-variant text-[12px] whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString("id-ID")}
                          </td>
                          <td className="py-3.5 px-4 font-data-mono text-primary font-bold">
                            {log.transaction?.code || "TX-UNKNOWN"}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-on-surface block text-[13px]">
                              {log.transaction?.vendor}
                            </span>
                            <span className="font-body-sm text-[11px] text-on-surface-variant">
                              {log.transaction?.applicantName} &bull; {log.transaction?.department}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-data-mono font-bold text-right text-primary whitespace-nowrap">
                            Rp {(log.transaction?.amount || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-data-mono text-[11px] font-bold ${
                                isOk
                                  ? "bg-secondary-fixed/50 text-secondary"
                                  : "bg-error-container text-tertiary"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${isOk ? "bg-secondary" : "bg-tertiary"}`}
                              ></span>
                              HTTP {log.statusCode} {log.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedPayload(log.payload)}
                              className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-[12px] font-semibold transition-colors border border-outline-variant/30"
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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/50 backdrop-blur-sm p-4">
              <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-outline-variant/30">
                <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">code</span>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      Outbound Webhook JSON Payload
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPayload(null)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                <div className="mt-4 bg-surface-container-low p-4 rounded-xl overflow-x-auto max-h-96">
                  <pre className="font-data-mono text-[12px] text-on-surface leading-relaxed whitespace-pre-wrap">
                    {JSON.stringify(JSON.parse(selectedPayload), null, 2)}
                  </pre>
                </div>

                <div className="mt-4 pt-3 border-t border-surface-container flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedPayload(null)}
                    className="h-9 px-4 rounded-xl bg-primary text-on-primary font-semibold text-body-sm"
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
