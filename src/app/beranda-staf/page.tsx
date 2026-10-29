"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import { getDivisionLimit, getDivisionLimitInfo } from "@/lib/division-limits";
import { formatCategoryLabel, getCategoryBadgeInfo } from "@/lib/expense-categories";
import {
  Plus,
  Wallet,
  CheckCircle2,
  Clock,
  Search,
  AlertTriangle,
  ArrowRight,
  LogOut,
  Receipt,
  FileClock,
  Ban,
  XCircle,
  RefreshCw,
  BellRing,
  X,
  Eye,
  ShieldCheck,
  Building,
  UserCheck,
  FileText,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

interface TransactionItem {
  id: string;
  code: string;
  applicantName: string;
  department: string;
  category?: string;
  vendor: string;
  amount: number;
  description: string;
  status: string;
  date: string;
  receipt?: {
    fileUrl: string;
    fileName?: string;
    ocrText?: string;
    detectedVendor?: string;
    detectedAmount?: number;
  };
  fraudAnalysis?: {
    riskScore: number;
    riskLevel: string;
    reasonXai?: string;
  };
  auditLogs?: Array<{
    id?: string;
    action: string;
    notes: string;
    createdAt: string;
    auditorName: string;
  }>;
  webhookLogs?: Array<{
    id?: string;
    endpoint: string;
    status: string;
    responseBody?: string;
    createdAt: string;
  }>;
}

type FilterType = "ALL" | "DISBURSED" | "REJECTED" | "PENDING_REVIEW";

export default function BerandaStafPage() {
  const { user, logout } = useAuth("STAFF");
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [txDetail, setTxDetail] = useState<TransactionItem | null>(null);

  const searchRef = useRef(search);
  searchRef.current = search;
  const userDeptRef = useRef(user?.department);
  userDeptRef.current = user?.department;

  const fetchTransactions = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setIsRefreshing(true);

      const params = new URLSearchParams();
      if (searchRef.current) params.append("search", searchRef.current);
      if (userDeptRef.current) params.append("department", userDeptRef.current);

      const url = `/api/transactions?${params.toString()}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (err) {
      console.error("Gagal memuat data:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();

    const interval = setInterval(() => {
      fetchTransactions(true);
    }, 3000);

    const handleFocus = () => fetchTransactions(true);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("transaction-updated", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("transaction-updated", handleFocus);
    };
  }, [search, user?.department]);

  // Buka detail modal saat baris diklik
  const handleOpenDetail = async (tx: TransactionItem) => {
    setSelectedTx(tx);
    setTxDetail(tx);
    setLoadingDetail(true);

    try {
      const res = await fetch(`/api/transactions/${tx.id}`);
      const data = await res.json();
      if (data.success && data.data) {
        setTxDetail(data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil rincian transaksi:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Proteksi Dimensi: Jika Auditor Mengakses Halaman Staf
  if (user && user.role !== "STAFF") {
    return (
      <>
        <Navbar currentRole="AUDITOR" />
        <main className="w-full min-h-screen pt-24 px-4 flex items-center justify-center bg-slate-50">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md max-w-md text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 inline-flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Peran Sesi: Auditor Forensik</h2>
            <p className="text-sm text-slate-600 mt-2 mb-6 leading-relaxed">
              Anda saat ini masuk sebagai <strong>{user.name}</strong> (Auditor). Halaman Beranda Staf ini hanya diperuntukkan bagi pengajuan kas staf biasa.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/antrean-review"
                prefetch={false}
                className="h-10 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors shadow-xs"
              >
                <span>Ke Antrean Review</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={logout}
                className="h-10 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
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

  // Kalkulasi Metrik Sesuai Departemen Pengguna
  const totalPengajuanCount = transactions.length;
  const totalPengajuanAmount = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  const disbursedTransactions = transactions.filter(
    (t) => t.status === "AUTO_APPROVED" || t.status === "APPROVED"
  );
  const disbursedCount = disbursedTransactions.length;
  const disbursedAmount = disbursedTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  const rejectedTransactions = transactions.filter((t) => t.status === "REJECTED");
  const rejectedCount = rejectedTransactions.length;
  const rejectedAmount = rejectedTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  const pendingTransactions = transactions.filter(
    (t) => t.status === "PENDING_REVIEW" || t.status === "NEED_CLARIFICATION"
  );
  const pendingCount = pendingTransactions.length;
  const pendingAmount = pendingTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  // Filter Data Transaksi berdasarkan Kartu Metrik yang Diklik
  const filteredTransactions = transactions.filter((tx) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "DISBURSED") return tx.status === "AUTO_APPROVED" || tx.status === "APPROVED";
    if (activeFilter === "REJECTED") return tx.status === "REJECTED";
    if (activeFilter === "PENDING_REVIEW") return tx.status === "PENDING_REVIEW" || tx.status === "NEED_CLARIFICATION";
    return true;
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ALL":
        return "Semua Pengajuan";
      case "DISBURSED":
        return "Pencairan (Disetujui)";
      case "AUTO_APPROVED":
        return "Disetujui Otomatis";
      case "APPROVED":
        return "Disetujui Auditor";
      case "REJECTED":
        return "Ditolak";
      case "PENDING_REVIEW":
        return "Menunggu Review";
      default:
        return status;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AUTO_APPROVED":
        return (
          <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
            Disetujui Otomatis
          </span>
        );
      case "APPROVED":
        return (
          <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
            Disetujui Auditor
          </span>
        );
      case "REJECTED":
        return (
          <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0"></span>
            Ditolak
          </span>
        );
      default:
        return (
          <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
            Menunggu Review
          </span>
        );
    }
  };

  return (
    <>
      <Navbar currentRole="STAFF" />

      <main className="w-full min-h-screen pt-20 px-6 sm:px-8 lg:px-12 pb-16 bg-slate-50">
        <div className="w-full max-w-[1600px] mx-auto space-y-6 pt-2">
          {/* Header Ringkas & Memanjang */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Halo, {user?.name || "Staf Purchasing"}
              </h1>
              <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200 inline-flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{user?.department || "Purchasing & Pengadaan"}</span>
              </span>
              {(() => {
                const deptInfo = getDivisionLimitInfo(user?.department || "");
                return (
                  <Link
                    href="/panduan-kepatuhan"
                    title="Lihat Pedoman Matriks 3-Sigma Perusahaan"
                    className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 inline-flex items-center gap-1.5 hover:bg-emerald-100 hover:border-emerald-300 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Pagu Wajar 3&sigma;: <strong>Rp {deptInfo.limit.toLocaleString("id-ID")}</strong></span>
                  </Link>
                );
              })()}
              {isRefreshing && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                  <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />
                  <span>Live</span>
                </span>
              )}
            </div>

            <Link
              href="/input-pengeluaran"
              prefetch={false}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Ajukan Pengeluaran</span>
            </Link>
          </div>

          {/* Metric Cards - 4 Box Interaktif (1 Baris Rapi: Total Pengajuan, Pencairan, Penolakan, Antrean) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Box 1: Total Pengajuan */}
            <button
              type="button"
              onClick={() => setActiveFilter("ALL")}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                activeFilter === "ALL"
                  ? "bg-white border-blue-500 ring-2 ring-blue-500/20 shadow-sm"
                  : "bg-white border-slate-200/90 hover:border-slate-300 shadow-xs"
              }`}
            >
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Total Pengajuan
                </span>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono mt-1">
                  Rp {totalPengajuanAmount.toLocaleString("id-ID")}
                </div>
                <span className="text-xs text-slate-500 font-medium mt-0.5 block">
                  {totalPengajuanCount} Berkas Diajukan
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
            </button>

            {/* Box 2: Total Pencairan (Disetujui) */}
            <button
              type="button"
              onClick={() => setActiveFilter("DISBURSED")}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                activeFilter === "DISBURSED"
                  ? "bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
                  : "bg-white border-slate-200/90 hover:border-slate-300 shadow-xs"
              }`}
            >
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Pencairan (Disetujui)
                </span>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 font-mono mt-1">
                  Rp {disbursedAmount.toLocaleString("id-ID")}
                </div>
                <span className="text-xs text-slate-500 font-medium mt-0.5 block">
                  {disbursedCount} Berkas Dicairkan
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </button>

            {/* Box 3: Total Penolakan (Batal) */}
            <button
              type="button"
              onClick={() => setActiveFilter("REJECTED")}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                activeFilter === "REJECTED"
                  ? "bg-white border-rose-500 ring-2 ring-rose-500/20 shadow-sm"
                  : "bg-white border-slate-200/90 hover:border-slate-300 shadow-xs"
              }`}
            >
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Penolakan (Batal)
                </span>
                <div className="text-xl sm:text-2xl font-extrabold text-rose-600 font-mono mt-1">
                  Rp {rejectedAmount.toLocaleString("id-ID")}
                </div>
                <span className="text-xs text-slate-500 font-medium mt-0.5 block">
                  {rejectedCount} Berkas Ditolak
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
            </button>

            {/* Box 4: Menunggu Review */}
            <button
              type="button"
              onClick={() => setActiveFilter("PENDING_REVIEW")}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                activeFilter === "PENDING_REVIEW"
                  ? "bg-white border-amber-500 ring-2 ring-amber-500/20 shadow-sm"
                  : "bg-white border-slate-200/90 hover:border-slate-300 shadow-xs"
              }`}
            >
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Menunggu Review
                </span>
                <div className="text-xl sm:text-2xl font-extrabold text-amber-600 font-mono mt-1">
                  Rp {pendingAmount.toLocaleString("id-ID")}
                </div>
                <span className="text-xs text-slate-500 font-medium mt-0.5 block">
                  {pendingCount} Berkas Antrean
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
            </button>
          </div>

          {/* Transactions Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Riwayat Pengajuan Pengeluaran Kas
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Klik pada baris transaksi untuk melihat rincian progres pencairan & catatan auditor
                  </p>
                </div>
                {activeFilter !== "ALL" && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                    <span>Filter: {getStatusLabel(activeFilter)}</span>
                    <button
                      type="button"
                      onClick={() => setActiveFilter("ALL")}
                      className="text-slate-400 hover:text-slate-700 ml-1 cursor-pointer"
                      title="Reset filter"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari kode, rekanan, atau nominal..."
                  className="h-9 pl-9 pr-4 bg-slate-50 text-slate-900 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 border border-slate-200 transition-all w-60 sm:w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200/80 font-bold">
                    <th className="py-3 px-6 font-semibold">Kode Transaksi</th>
                    <th className="py-3 px-4 font-semibold">Tanggal</th>
                    <th className="py-3 px-4 font-semibold">Keperluan & Rekanan</th>
                    <th className="py-3 px-4 font-semibold text-right">Nominal</th>
                    <th className="py-3 px-6 font-semibold text-center">Status Putusan</th>
                    <th className="py-3 px-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <FileClock className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                        <p className="mt-2 text-sm font-medium">Memuat data pengajuan...</p>
                      </td>
                    </tr>
                  ) : filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
                        <p className="mt-2 text-sm font-semibold text-slate-600">
                          {activeFilter !== "ALL"
                            ? `Tidak ada transaksi dengan status "${getStatusLabel(activeFilter)}"`
                            : "Belum ada transaksi pengeluaran"}
                        </p>
                        {activeFilter !== "ALL" && (
                          <button
                            type="button"
                            onClick={() => setActiveFilter("ALL")}
                            className="mt-2 text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                          >
                            Tampilkan Semua Data
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => {
                      const isRejected = tx.status === "REJECTED";

                      return (
                        <tr
                          key={tx.id}
                          onClick={() => handleOpenDetail(tx)}
                          className={`hover:bg-blue-50/40 transition-colors cursor-pointer group ${
                            isRejected ? "bg-rose-50/20" : ""
                          }`}
                        >
                          <td className="py-3.5 px-6 font-mono font-bold text-xs sm:text-sm">
                            <span className={isRejected ? "text-rose-600" : "text-blue-600"}>
                              {tx.code}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-mono text-xs whitespace-nowrap">
                            {new Date(tx.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-3 px-4 max-w-sm truncate whitespace-nowrap">
                            <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                              {tx.vendor}
                            </span>
                            <span className="text-slate-400 text-xs ml-1.5">
                              &bull; {tx.description}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap text-xs sm:text-sm">
                            Rp {tx.amount.toLocaleString("id-ID")}
                          </td>
                          <td className="py-3 px-6 text-center whitespace-nowrap">
                            {getStatusBadge(tx.status)}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetail(tx);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              title="Lihat Rincian & Progres"
                            >
                              <Eye className="w-4 h-4" />
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
        </div>
      </main>

      {/* MODAL RINCIAN PENGAJUAN & PROGRES PENCAIRAN (INFORMATIF & BERSIH) */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-slate-900">
                      {selectedTx.code}
                    </span>
                    {getStatusBadge(selectedTx.status)}
                  </div>
                  <span className="text-xs text-slate-500">
                    Diajukan pada {new Date(selectedTx.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Nominal & Rekanan Highlight */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-500 block">Total Pengeluaran:</span>
                  <span className="text-2xl font-extrabold text-slate-900 font-mono">
                    Rp {selectedTx.amount.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="sm:text-right">
                  <span className="text-xs text-slate-500 block">Toko / Rekanan:</span>
                  <span className="text-sm font-bold text-slate-800">{selectedTx.vendor}</span>
                </div>
              </div>

              {/* Tagging Divisi, Kategori & Ambang Pagu 3-Sigma */}
              <div className="px-4 py-2.5 rounded-xl bg-blue-50/70 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
                <div className="flex items-center gap-1.5 font-medium flex-wrap">
                  <Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Divisi: <strong className="text-slate-800">{selectedTx.department}</strong></span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                    <span>{getCategoryBadgeInfo(selectedTx.category).icon}</span>
                    <span>{formatCategoryLabel(selectedTx.category)}</span>
                  </span>
                </div>
                <span className="font-semibold text-blue-800 whitespace-nowrap">
                  Pagu Wajar 3&sigma;: Rp {getDivisionLimit(selectedTx.department).toLocaleString("id-ID")}
                </span>
              </div>

              {/* Tahapan Progres Pencairan (Visual Stepper) */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Progres Pengajuan & Pencairan
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  {/* Step 1: Submit */}
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold mb-1.5 shadow-xs">
                      ✓
                    </div>
                    <span className="font-semibold text-slate-800">Diajukan</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Staf</span>
                  </div>

                  {/* Step 2: Analisis AI */}
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold mb-1.5 shadow-xs">
                      ✓
                    </div>
                    <span className="font-semibold text-slate-800">Analisis AI</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      Risiko {selectedTx.fraudAnalysis?.riskScore || 0}%
                    </span>
                  </div>

                  {/* Step 3: Putusan */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 shadow-xs ${
                        selectedTx.status === "REJECTED"
                          ? "bg-rose-500 text-white"
                          : selectedTx.status === "PENDING_REVIEW"
                          ? "bg-amber-400 text-white"
                          : "bg-emerald-500 text-white"
                      }`}
                    >
                      {selectedTx.status === "REJECTED"
                        ? "✕"
                        : selectedTx.status === "PENDING_REVIEW"
                        ? "⋯"
                        : "✓"}
                    </div>
                    <span className="font-semibold text-slate-800">
                      {selectedTx.status === "REJECTED"
                        ? "Ditolak"
                        : selectedTx.status === "PENDING_REVIEW"
                        ? "Review"
                        : "Disetujui"}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {selectedTx.status === "AUTO_APPROVED" ? "Otomatis" : "Auditor"}
                    </span>
                  </div>

                  {/* Step 4: Pencairan Kasir */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 shadow-xs ${
                        selectedTx.status === "REJECTED"
                          ? "bg-slate-300 text-slate-500"
                          : selectedTx.status === "PENDING_REVIEW"
                          ? "bg-slate-200 text-slate-400"
                          : "bg-emerald-500 text-white"
                      }`}
                    >
                      {selectedTx.status === "REJECTED" ? "—" : "✓"}
                    </div>
                    <span className="font-semibold text-slate-800">Pencairan</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {selectedTx.status === "REJECTED"
                        ? "Batal (VOID)"
                        : selectedTx.status === "PENDING_REVIEW"
                        ? "Menunggu"
                        : "Cair"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Informasi Keputusan Auditor / AI */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Informasi Status & Catatan Pemeriksaan
                </h4>

                {selectedTx.status === "REJECTED" ? (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase text-rose-800 flex items-center gap-1.5">
                        <Ban className="w-4 h-4 text-rose-600" />
                        Penolakan oleh Auditor Forensik
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-800">
                        STATUS: VOID
                      </span>
                    </div>
                    <div className="text-xs text-rose-800 leading-relaxed bg-white/80 p-3 rounded-xl border border-rose-100">
                      <strong>Catatan / Alasan Penolakan:</strong>
                      <p className="mt-1 text-slate-700">
                        {txDetail?.auditLogs?.[0]?.notes ||
                          selectedTx.auditLogs?.[0]?.notes ||
                          "Faktur terindikasi anomali atau tidak memenuhi standar bukti kuitansi fisik."}
                      </p>
                    </div>
                    <div className="text-[11px] text-rose-700 flex items-center justify-between pt-1">
                      <span>
                        Auditor Penanggung Jawab:{" "}
                        <strong>
                          {txDetail?.auditLogs?.[0]?.auditorName ||
                            selectedTx.auditLogs?.[0]?.auditorName ||
                            "Bambang H. (Inspektorat)"}
                        </strong>
                      </span>
                      <span>Instruksi Kasir ERP Dibatalkan</span>
                    </div>
                  </div>
                ) : selectedTx.status === "APPROVED" ? (
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase text-blue-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        Disetujui oleh Auditor Forensik
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-800">
                        STATUS: CAIR
                      </span>
                    </div>
                    <div className="text-xs text-blue-800 leading-relaxed bg-white/80 p-3 rounded-xl border border-blue-100">
                      <strong>Catatan Auditor:</strong>
                      <p className="mt-1 text-slate-700">
                        {txDetail?.auditLogs?.[0]?.notes ||
                          selectedTx.auditLogs?.[0]?.notes ||
                          "Dokumen fisik dan justifikasi pengeluaran telah diperiksa dan dinyatakan sah."}
                      </p>
                    </div>
                    <div className="text-[11px] text-blue-700 flex items-center justify-between pt-1">
                      <span>
                        Auditor yang Menyetujui:{" "}
                        <strong>
                          {txDetail?.auditLogs?.[0]?.auditorName ||
                            selectedTx.auditLogs?.[0]?.auditorName ||
                            "Bambang H. (Inspektorat)"}
                        </strong>
                      </span>
                      <span>Webhook Kasir Terkirim</span>
                    </div>
                  </div>
                ) : selectedTx.status === "AUTO_APPROVED" ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Disetujui Otomatis oleh Sistem AI
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-800">
                        STATUS: CAIR
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-3 rounded-xl border border-emerald-100">
                      Pengeluaran lolos uji kepatuhan otomatis (skor risiko rendah di bawah batas toleransi). Instruksi pencairan telah dikirimkan ke kasir.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase text-amber-800 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-600" />
                        Dalam Antrean Pemeriksaan
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-800">
                        PENDING
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-3 rounded-xl border border-amber-100">
                      Berkas saat ini sedang dalam antrean verifikasi oleh Auditor Forensik Inspektorat sebelum pencairan dana disetujui.
                    </p>
                  </div>
                )}
              </div>

              {/* Rincian Tambahan Transaksi */}
              <div className="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Pemohon:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedTx.applicantName} ({selectedTx.department})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Keperluan Belanja:</span>
                  <span className="font-semibold text-slate-800">{selectedTx.description}</span>
                </div>
              </div>

              {/* Bukti Kuitansi / Faktur Jika Ada */}
              {selectedTx.receipt?.fileUrl && (
                <div className="border-t border-slate-100 pt-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Lampiran Bukti Faktur / Kuitansi
                  </span>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-semibold text-slate-800 truncate max-w-xs">
                        {selectedTx.receipt.fileName || "Kuitansi Pengeluaran.pdf"}
                      </span>
                    </div>
                    <a
                      href={selectedTx.receipt.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                      <span>Lihat Berkas</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="h-9 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
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
