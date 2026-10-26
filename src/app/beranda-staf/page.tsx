"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";

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
  const { user, logout } = useAuth();
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

  if (user && user.role !== "STAFF") {
    return (
      <>
        <Navbar currentRole="STAFF" />
        <main className="w-full min-h-screen pt-20 px-4 flex items-center justify-center bg-slate-50">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs max-w-md text-center">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 inline-flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[20px]">policy</span>
            </div>
            <h2 className="text-sm font-semibold text-slate-900">Peran Sesi: Auditor Forensik</h2>
            <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
              Anda saat ini masuk sebagai <strong>{user.name}</strong> (Auditor). Untuk membuat pengajuan kas baru, silakan keluar terlebih dahulu.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Link
                href="/antrean-review"
                prefetch={false}
                className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Ke Antrean Review</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="h-8 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">logout</span>
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  const totalAmount = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const autoApprovedCount = transactions.filter(
    (t) => t.status === "AUTO_APPROVED" || t.status === "APPROVED"
  ).length;
  const pendingCount = transactions.filter((t) => t.status === "PENDING_REVIEW").length;

  return (
    <>
      <Navbar currentRole="STAFF" />

      <main className="w-full min-h-screen pt-16 px-4 sm:px-6 pb-12 bg-slate-50">
        <div className="w-full max-w-6xl mx-auto space-y-5 pt-2">
          {/* Top Greeting & Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Halo, {user?.name || "Siti Rahma"}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Bendahara Pengeluaran
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Rekapitulasi permohonan kas dan status verifikasi kuitansi.
              </p>
            </div>

            <Link
              href="/input-pengeluaran"
              prefetch={false}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[16px] shrink-0">add</span>
              <span>Ajukan Pengeluaran Baru</span>
            </Link>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Total Diajukan
                </span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 inline-flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xl font-bold text-slate-900 font-mono">
                  Rp {totalAmount.toLocaleString("id-ID")}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Periode berjalan</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Disetujui / Cair
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 inline-flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px]">task_alt</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xl font-bold text-slate-900 font-mono">
                  {autoApprovedCount} <span className="text-xs font-normal text-slate-500">Transaksi</span>
                </div>
                <div className="text-xs text-emerald-600 font-medium mt-0.5">
                  Lolos verifikasi kas
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Menunggu Review
                </span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 inline-flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px]">pending_actions</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xl font-bold text-slate-900 font-mono">
                  {pendingCount} <span className="text-xs font-normal text-slate-500">Transaksi</span>
                </div>
                <div className="text-xs text-amber-600 font-medium mt-0.5">
                  Dalam antrean auditor
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-semibold text-slate-900">
                  Riwayat Pengajuan Terakhir
                </h3>
                <p className="text-xs text-slate-400">
                  Daftar transaksi pengeluaran kas yang telah diajukan
                </p>
              </div>

              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[15px] text-slate-400 pointer-events-none shrink-0">
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari transaksi..."
                  className="h-8 pl-8 pr-3 bg-slate-50 text-slate-900 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 border border-slate-200 transition-all w-56"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 text-[11px] uppercase tracking-wider border-b border-slate-200/70">
                    <th className="py-2.5 px-4 font-semibold">ID Transaksi</th>
                    <th className="py-2.5 px-3 font-semibold">Tanggal</th>
                    <th className="py-2.5 px-3 font-semibold">Keperluan & Rekanan</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Nominal</th>
                    <th className="py-2.5 px-4 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400">
                        <span className="material-symbols-outlined text-[22px] animate-spin text-blue-600">
                          sync
                        </span>
                        <p className="mt-1 text-xs">Memuat data...</p>
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400">
                        <span className="material-symbols-outlined text-[28px] text-slate-300">
                          receipt_long
                        </span>
                        <p className="mt-1 text-xs font-medium text-slate-600">Belum ada transaksi</p>
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => {
                      const isAuto = tx.status === "AUTO_APPROVED";
                      const isApproved = tx.status === "APPROVED";
                      const isRejected = tx.status === "REJECTED";

                      return (
                        <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-4 font-mono text-blue-600 font-medium">
                            {tx.code}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 font-mono whitespace-nowrap">
                            {new Date(tx.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-medium text-slate-900 block">
                              {tx.vendor}
                            </span>
                            <span className="text-slate-400 text-[11px] block truncate max-w-xs">
                              {tx.description}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-900 whitespace-nowrap">
                            Rp {tx.amount.toLocaleString("id-ID")}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                                isAuto
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                  : isApproved
                                  ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                                  : isRejected
                                  ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                                  : "bg-amber-50 text-amber-700 border border-amber-200/60"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  isAuto || isApproved
                                    ? "bg-emerald-500"
                                    : isRejected
                                    ? "bg-rose-500"
                                    : "bg-amber-500"
                                }`}
                              ></span>
                              <span>
                                {isAuto
                                  ? "Auto-Approved"
                                  : isApproved
                                  ? "Disetujui"
                                  : isRejected
                                  ? "Ditolak"
                                  : "Review Auditor"}
                              </span>
                            </span>
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
