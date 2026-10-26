"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import {
  Plus,
  Wallet,
  CheckCircle2,
  Clock,
  Search,
  FileText,
  AlertTriangle,
  ArrowRight,
  LogOut,
  Receipt,
  FileClock,
} from "lucide-react";

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
        <main className="w-full min-h-screen pt-24 px-4 flex items-center justify-center bg-slate-50">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md max-w-md text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 inline-flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Peran Sesi: Auditor Forensik</h2>
            <p className="text-sm text-slate-600 mt-2 mb-6 leading-relaxed">
              Anda saat ini masuk sebagai <strong>{user.name}</strong> (Auditor Forensik). Dashboard ini dikhususkan bagi Staf Keuangan untuk pengajuan kas.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/antrean-review"
                prefetch={false}
                className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors shadow-xs"
              >
                <span>Ke Antrean Review</span>
                <ArrowRight className="w-4 h-4" />
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

  const totalAmount = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const autoApprovedCount = transactions.filter(
    (t) => t.status === "AUTO_APPROVED" || t.status === "APPROVED"
  ).length;
  const pendingCount = transactions.filter((t) => t.status === "PENDING_REVIEW").length;

  return (
    <>
      <Navbar currentRole="STAFF" />

      <main className="w-full min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-16 bg-slate-50">
        <div className="w-full max-w-7xl mx-auto space-y-6 pt-2">
          {/* Top Greeting & Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Halo, {user?.name || "Siti Rahma"}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  Bendahara Pengeluaran
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Rekapitulasi permohonan dana kas dan monitoring status verifikasi dokumen kuitansi.
              </p>
            </div>

            <Link
              href="/input-pengeluaran"
              prefetch={false}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xs transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Ajukan Pengeluaran Baru</span>
            </Link>
          </div>

          {/* Metric Cards - Generous & Balanced */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Diajukan Periode Ini
                </span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 inline-flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                  Rp {totalAmount.toLocaleString("id-ID")}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">Periode berjalan Q4 2025</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Disetujui / Dicairkan
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 inline-flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                  {autoApprovedCount} <span className="text-base font-normal text-slate-500">Transaksi</span>
                </div>
                <div className="text-xs text-emerald-700 font-semibold mt-1">
                  Lolos verifikasi otomatis & cair ke rekening
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Menunggu Review Auditor
                </span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 inline-flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                  {pendingCount} <span className="text-base font-normal text-slate-500">Transaksi</span>
                </div>
                <div className="text-xs text-amber-700 font-semibold mt-1">
                  Dalam antrean pemeriksaan forensik
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table Card - Full Width and Roomy */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Riwayat Pengajuan Terakhir
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daftar transaksi pengeluaran kas yang telah terekam di sistem
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari transaksi atau rekanan..."
                  className="h-10 pl-10 pr-4 bg-slate-50 text-slate-900 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 border border-slate-200 transition-all w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200/80 font-bold">
                    <th className="py-3.5 px-6 font-semibold">Kode Transaksi</th>
                    <th className="py-3.5 px-4 font-semibold">Tanggal</th>
                    <th className="py-3.5 px-4 font-semibold">Keperluan & Rekanan</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Nominal</th>
                    <th className="py-3.5 px-6 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <FileClock className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                        <p className="mt-2 text-sm">Memuat data pengajuan...</p>
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
                        <p className="mt-2 text-sm font-semibold text-slate-600">Belum ada transaksi</p>
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => {
                      const isAuto = tx.status === "AUTO_APPROVED";
                      const isApproved = tx.status === "APPROVED";
                      const isRejected = tx.status === "REJECTED";

                      return (
                        <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6 font-mono text-blue-600 font-semibold text-sm">
                            {tx.code}
                          </td>
                          <td className="py-4 px-4 text-slate-500 font-mono text-xs whitespace-nowrap">
                            {new Date(tx.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-semibold text-slate-900 block text-sm">
                              {tx.vendor}
                            </span>
                            <span className="text-slate-500 text-xs block truncate max-w-sm mt-0.5">
                              {tx.description}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap text-sm">
                            Rp {tx.amount.toLocaleString("id-ID")}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                isAuto
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : isApproved
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : isRejected
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  isAuto || isApproved
                                    ? "bg-emerald-500"
                                    : isRejected
                                    ? "bg-rose-500"
                                    : "bg-amber-500"
                                }`}
                              ></span>
                              <span>
                                {isAuto
                                  ? "Disetujui Otomatis"
                                  : isApproved
                                  ? "Disetujui Auditor"
                                  : isRejected
                                  ? "Ditolak"
                                  : "Dalam Review"}
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
