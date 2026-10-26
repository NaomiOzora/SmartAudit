"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface TransactionItem {
  id: string;
  code: string;
  applicantName: string;
  department: string;
  vendor: string;
  amount: number;
  description: string;
  status: string;
  date: string;
  fraudAnalysis?: {
    riskScore: number;
    riskLevel: string;
  };
}

export default function BerandaStafPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [search]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const url = search
        ? `/api/transactions?search=${encodeURIComponent(search)}`
        : "/api/transactions";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (err) {
      console.error("Gagal memuat data:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const autoApprovedCount = transactions.filter(
    (t) => t.status === "AUTO_APPROVED" || t.status === "APPROVED"
  ).length;
  const pendingCount = transactions.filter((t) => t.status === "PENDING_REVIEW").length;

  return (
    <>
      <Navbar currentRole="STAFF" />

      <main className="w-full min-h-screen pt-16 px-4 sm:px-6 pb-12 bg-slate-50/50">
        <div className="w-full max-w-6xl mx-auto space-y-5">
          {/* Top Greeting & Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">
                  Halo, Siti Rahma
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Staf Keuangan Aktif
                </span>
              </div>
              <p className="text-[13px] text-slate-500 mt-0.5">
                Divisi IT & Digital &bull; Rekapitulasi permohonan dana dan pengeluaran operasional.
              </p>
            </div>

            <Link
              href="/input-pengeluaran"
              className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-lg text-[13px] font-semibold shadow-sm hover:bg-blue-700 transition-colors self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[17px]">add</span>
              <span>Ajukan Pengeluaran Baru</span>
            </Link>
          </div>

          {/* Metric Cards (Calm & Balanced) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stat 1 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">
                  Total Diajukan Periode Ini
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-[20px] font-bold text-slate-900 font-data-mono">
                  Rp {totalAmount.toLocaleString("id-ID")}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Periode Berjalan</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">
                  Disetujui Otomatis
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">task_alt</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[20px] font-bold text-slate-900 font-data-mono">
                    {autoApprovedCount}
                  </span>
                  <span className="text-[12px] text-slate-500">Transaksi</span>
                </div>
                <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[13px]">verified</span> Terverifikasi Fast-Track
                </div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">
                  Menunggu Peninjauan
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">pending_actions</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[20px] font-bold text-slate-900 font-data-mono">
                    {pendingCount}
                  </span>
                  <span className="text-[12px] text-slate-500">Transaksi</span>
                </div>
                <div className="text-[11px] text-amber-700 font-medium flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[13px]">schedule</span> Tahap review verifikator
                </div>
              </div>
            </div>
          </div>

          {/* Guidance Banner */}
          <div className="bg-blue-50/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-blue-200/60">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white text-blue-600 border border-blue-200/60 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-slate-900">
                  Pedoman Kuitansi Kas Valid (SOP)
                </h4>
                <p className="text-[12px] text-slate-600 mt-0.5 leading-relaxed max-w-2xl">
                  Pastikan kuitansi fisik diunggah tegak lurus, nama toko/rekanan terbaca utuh, serta nominal tertera jelas agar AI dapat mengekstrak secara instan (&le; 5 detik).
                </p>
              </div>
            </div>
            <Link
              href="/panduan-kepatuhan"
              className="inline-flex items-center gap-1 text-blue-700 text-[12px] font-semibold hover:underline shrink-0"
            >
              <span>Aturan Kepatuhan</span>
              <span className="material-symbols-outlined text-[15px]">chevron_right</span>
            </Link>
          </div>

          {/* Transactions Table Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200">
              <div>
                <h3 className="text-[14px] font-bold text-slate-900">
                  Riwayat Pengajuan Terakhir Saya
                </h3>
                <p className="text-[12px] text-slate-500">
                  Daftar permohonan pencairan kas mandiri yang terdata
                </p>
              </div>

              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari transaksi..."
                  className="h-8 pl-8 pr-3 bg-slate-50 text-slate-900 rounded-lg text-[12px] focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 border border-slate-200 transition-all w-56"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 text-[11px] uppercase tracking-wider border-b border-slate-200">
                    <th className="py-2.5 px-4 font-semibold">ID Transaksi</th>
                    <th className="py-2.5 px-3 font-semibold">Tanggal</th>
                    <th className="py-2.5 px-3 font-semibold">Keperluan / Rekanan</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Nominal</th>
                    <th className="py-2.5 px-4 font-semibold text-center">Status Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400">
                        <span className="material-symbols-outlined text-[24px] animate-spin text-blue-600">
                          sync
                        </span>
                        <p className="mt-1 text-[12px]">Memuat data pengajuan...</p>
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400">
                        <span className="material-symbols-outlined text-[30px] text-slate-300">
                          receipt_long
                        </span>
                        <p className="mt-1 text-[13px] font-medium text-slate-600">Belum ada transaksi</p>
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => {
                      const isAuto = tx.status === "AUTO_APPROVED";
                      const isApproved = tx.status === "APPROVED";
                      const isRejected = tx.status === "REJECTED";
                      const isPending = tx.status === "PENDING_REVIEW";

                      return (
                        <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-4 font-data-mono text-blue-600 font-semibold text-[12px]">
                            {tx.code}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 font-data-mono text-[12px] whitespace-nowrap">
                            {new Date(tx.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-medium text-slate-900 block leading-tight">
                              {tx.description || tx.vendor}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {tx.vendor} &bull; {tx.department}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-data-mono font-semibold text-right whitespace-nowrap text-[13px]">
                            Rp {tx.amount.toLocaleString("id-ID")}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            {isAuto && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                                Disetujui Otomatis
                              </span>
                            )}
                            {isApproved && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                                <span className="material-symbols-outlined text-[13px]">verified</span>
                                Disetujui Auditor
                              </span>
                            )}
                            {isPending && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-semibold border border-amber-200">
                                <span className="material-symbols-outlined text-[13px]">schedule</span>
                                Review (Skor {tx.fraudAnalysis?.riskScore || 0}%)
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-semibold border border-rose-200">
                                <span className="material-symbols-outlined text-[13px]">cancel</span>
                                Ditolak / Fraud
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
