"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AuditorSidebar from "@/components/AuditorSidebar";
import { useAuth } from "@/lib/auth";
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  ArrowUpDown,
  Search,
  FileClock,
  ArrowRight,
  LogOut,
  RefreshCw,
  Receipt,
  Bot,
  Check,
  FileSearch,
} from "lucide-react";

interface Transaction {
  id: string;
  code: string;
  applicantName: string;
  department: string;
  category: string;
  vendor: string;
  date: string;
  amount: number;
  description: string;
  status: string;
  receipt?: {
    imageUrl: string;
    extractedVendor?: string;
    extractedAmount?: number;
    extractedDate?: string;
  };
  fraudAnalysis?: {
    riskScore: number;
    riskLevel: string;
    reasonXai: string;
    isDuplicate: boolean;
    isSplitBill: boolean;
    isAnomalyAmount: boolean;
    isHighRiskCat: boolean;
    isOffHours: boolean;
    isRoundAmount: boolean;
  };
  auditLogs?: Array<{
    id?: string;
    auditorName: string;
    action: string;
    notes: string;
    createdAt: string;
  }>;
}

export default function AntreanReviewPage() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<"ALL" | "HIGH" | "MEDIUM">("ALL");
  const [deptFilter, setDeptFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"risk" | "date">("risk");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"PENDING" | "COMPLETED">("PENDING");

  useEffect(() => {
    fetchQueue();

    const interval = setInterval(() => {
      fetchQueue(true);
    }, 3500);

    const handleFocus = () => fetchQueue(true);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("transaction-updated", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("transaction-updated", handleFocus);
    };
  }, [search, riskFilter, deptFilter, sortBy]);

  const fetchQueue = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (riskFilter !== "ALL") params.append("risk", riskFilter);
      if (deptFilter !== "all") params.append("department", deptFilter);
      params.append("sort", sortBy);

      const res = await fetch(`/api/transactions?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (err) {
      console.error("Gagal memuat antrean:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  if (user && user.role !== "AUDITOR") {
    return (
      <>
        <Navbar currentRole="STAFF" />
        <main className="w-full min-h-screen pt-24 px-4 flex items-center justify-center bg-slate-50">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md max-w-md text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 inline-flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Akses Khusus Auditor Forensik</h2>
            <p className="text-sm text-slate-600 mt-2 mb-6 leading-relaxed">
              Anda saat ini masuk sebagai <strong>{user.name}</strong> (Staf Keuangan). Antrean review dan penyelidikan transaksi kas hanya dapat diakses oleh Auditor.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/beranda-staf"
                prefetch={false}
                className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors shadow-xs"
              >
                <span>Kembali ke Beranda Staf</span>
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

  // Pemisahan ketat:
  // 1. Pending: HANYA yang belum diperiksa (PENDING_REVIEW)
  // 2. Completed: Yang sudah diputus auditor (APPROVED, REJECTED, NEED_CLARIFICATION)
  // 3. AutoApproved: Yang lolos AI (AUTO_APPROVED)
  const pendingTransactions = transactions.filter((t) => t.status === "PENDING_REVIEW");
  const completedTransactions = transactions.filter(
    (t) => t.status === "APPROVED" || t.status === "REJECTED" || t.status === "NEED_CLARIFICATION"
  );
  const autoApprovedTransactions = transactions.filter((t) => t.status === "AUTO_APPROVED");

  const activeList = activeTab === "PENDING" ? pendingTransactions : completedTransactions;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Disetujui Auditor
          </span>
        );
      case "REJECTED":
        return (
          <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            Ditolak
          </span>
        );
      case "NEED_CLARIFICATION":
        return (
          <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Klarifikasi
          </span>
        );
      default:
        return (
          <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            Pending
          </span>
        );
    }
  };

  return (
    <>
      <Navbar currentRole="AUDITOR" />
      <AuditorSidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen bg-slate-50 pt-16">
        <main className="w-full flex-1 px-6 sm:px-8 lg:px-10 py-6">
          <div className="w-full max-w-[1600px] mx-auto space-y-6">
            {/* Header Ringkas & Memanjang */}
            <div className="flex items-center justify-between gap-4 pb-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Antrean Review
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                  {pendingTransactions.length} berkas perlu evaluasi
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/validasi-ai"
                  className="h-9 px-3.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors border border-emerald-200 shadow-xs cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-emerald-600" />
                  <span>Validasi Otomatis AI ({autoApprovedTransactions.length})</span>
                </Link>

                <button
                  type="button"
                  onClick={() => fetchQueue()}
                  className="h-9 px-3.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-colors border border-slate-200 shadow-xs cursor-pointer"
                  title="Segarkan antrean"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${loading ? "animate-spin" : ""}`} />
                  <span>Segarkan</span>
                </button>
              </div>
            </div>

            {/* Metrics Cards: 1 Baris Rapi, Tidak Menumpuk */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Box 1: Perlu Evaluasi (Pending) */}
              <button
                type="button"
                onClick={() => setActiveTab("PENDING")}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  activeTab === "PENDING"
                    ? "bg-white border-rose-500 ring-2 ring-rose-500/20 shadow-sm"
                    : "bg-white border-slate-200/90 hover:border-slate-300 shadow-xs"
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Perlu Evaluasi
                  </span>
                  <div className="text-2xl font-extrabold text-rose-600 font-mono mt-1">
                    {pendingTransactions.length} <span className="text-xs font-normal text-slate-500">Berkas</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
              </button>

              {/* Box 2: Sudah Selesai Diperiksa */}
              <button
                type="button"
                onClick={() => setActiveTab("COMPLETED")}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  activeTab === "COMPLETED"
                    ? "bg-white border-blue-500 ring-2 ring-blue-500/20 shadow-sm"
                    : "bg-white border-slate-200/90 hover:border-slate-300 shadow-xs"
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Sudah Selesai Diperiksa
                  </span>
                  <div className="text-2xl font-extrabold text-blue-600 font-mono mt-1">
                    {completedTransactions.length} <span className="text-xs font-normal text-slate-500">Berkas</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </button>

              {/* Box 3: Disetujui Otomatis AI (Fast-Track) */}
              <Link
                href="/validasi-ai"
                className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-300 transition-all shadow-xs flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Disetujui Otomatis AI
                  </span>
                  <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">
                    {autoApprovedTransactions.length} <span className="text-xs font-normal text-slate-500">Berkas</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
              </Link>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari ID, rekanan, atau nama pemohon..."
                  className="w-full h-10 pl-10 pr-4 bg-slate-50 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 border border-slate-200 transition-all"
                />
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Risk Filter Pills */}
                <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setRiskFilter("ALL")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      riskFilter === "ALL"
                        ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Semua ({activeList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRiskFilter("HIGH")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      riskFilter === "HIGH"
                        ? "bg-white text-rose-700 shadow-xs border border-slate-200/60"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Tinggi (&ge;70%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRiskFilter("MEDIUM")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      riskFilter === "MEDIUM"
                        ? "bg-white text-amber-700 shadow-xs border border-slate-200/60"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Sedang (40-70%)
                  </button>
                </div>

                {/* Division Dropdown */}
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="h-10 px-3 bg-slate-50 hover:bg-slate-100 text-slate-800 text-sm font-medium rounded-xl cursor-pointer focus:outline-none border border-slate-200"
                >
                  <option value="all">Semua Departemen</option>
                  <option value="Sales & Commercial">Sales & Commercial</option>
                  <option value="Marketing & Brand Management">Marketing & Brand Management</option>
                  <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                  <option value="Manufacturing & Operations">Manufacturing & Operations</option>
                  <option value="Research & Development (R&D) & Regulatory Affairs">Research & Development (R&D) & Regulatory Affairs</option>
                  <option value="Finance, Accounting & Tax">Finance, Accounting & Tax</option>
                  <option value="Human Resources & Corporate Affairs">Human Resources & Corporate Affairs</option>
                  <option value="Information Technology & Digital Transformation">Information Technology & Digital Transformation</option>
                  <option value="Legal, Compliance & Corporate Governance">Legal, Compliance & Corporate Governance</option>
                </select>

                {/* Sort Toggle */}
                <button
                  type="button"
                  onClick={() => setSortBy(sortBy === "risk" ? "date" : "risk")}
                  className="h-10 px-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl inline-flex items-center gap-2 border border-slate-200 transition-colors cursor-pointer"
                >
                  <ArrowUpDown className="w-4 h-4 text-slate-500" />
                  <span>{sortBy === "risk" ? "Skor Risiko" : "Tanggal"}</span>
                </button>
              </div>
            </div>

            {/* Full-Width Table Container (Tanpa Menu Pratinjau Terpilih yang Menumpuk) */}
            <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              {/* Tab Switcher Header (Perlu Evaluasi vs Sudah Diperiksa) */}
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab("PENDING")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                      activeTab === "PENDING"
                        ? "bg-white text-rose-700 shadow-xs border border-slate-200/60"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Perlu Evaluasi ({pendingTransactions.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("COMPLETED")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                      activeTab === "COMPLETED"
                        ? "bg-white text-blue-700 shadow-xs border border-slate-200/60"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Sudah Selesai Diperiksa ({completedTransactions.length})</span>
                  </button>
                </div>

                <span className="text-xs text-slate-400">
                  {activeTab === "PENDING"
                    ? "Hanya berkas yang belum diputus"
                    : "Riwayat putusan & catatan BAP auditor"}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-600 uppercase tracking-wider text-xs border-b border-slate-200/80 font-bold whitespace-nowrap">
                      <th className="py-3 px-4 font-semibold">Kode</th>
                      <th className="py-3 px-4 font-semibold">Pemohon & Divisi</th>
                      <th className="py-3 px-4 font-semibold">Toko / Rekanan</th>
                      <th className="py-3 px-4 font-semibold">Tanggal</th>
                      <th className="py-3 px-4 font-semibold text-right">Nominal</th>
                      {activeTab === "PENDING" ? (
                        <>
                          <th className="py-3 px-4 font-semibold">Indikasi AI</th>
                          <th className="py-3 px-4 font-semibold text-center">Skor Risiko</th>
                        </>
                      ) : (
                        <>
                          <th className="py-3 px-4 font-semibold text-center">Status Putusan</th>
                          <th className="py-3 px-4 font-semibold">Catatan BAP Auditor</th>
                        </>
                      )}
                      <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          <FileClock className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                          <p className="mt-2 text-sm font-medium">Memuat antrean...</p>
                        </td>
                      </tr>
                    ) : activeList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          {activeTab === "PENDING" ? (
                            <div className="max-w-md mx-auto">
                              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 inline-flex items-center justify-center mx-auto mb-3">
                                <CheckCircle2 className="w-6 h-6" />
                              </div>
                              <h4 className="font-bold text-slate-800 text-base">
                                Semua Transaksi Selesai Dievaluasi
                              </h4>
                              <p className="text-xs text-slate-500 mt-1">
                                Tidak ada berkas yang menunggu tindakan audit. Semua pengajuan telah diputus atau lolos validasi otomatis AI.
                              </p>
                              <div className="mt-4 flex items-center justify-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => setActiveTab("COMPLETED")}
                                  className="px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                                >
                                  Lihat Berkas Selesai ({completedTransactions.length})
                                </button>
                                <Link
                                  href="/validasi-ai"
                                  className="px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                                >
                                  Validasi Otomatis AI ({autoApprovedTransactions.length})
                                </Link>
                              </div>
                            </div>
                          ) : (
                            <div className="max-w-md mx-auto">
                              <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
                              <p className="mt-2 font-semibold text-sm text-slate-700">
                                Belum ada transaksi yang diputus oleh auditor
                              </p>
                            </div>
                          )}
                        </td>
                      </tr>
                    ) : (
                      activeList.map((tx) => {
                        const score = tx.fraudAnalysis?.riskScore || 0;
                        const isHigh = score >= 70;
                        const isMed = score >= 40 && score < 70;

                        let anomalyLabel = "Normal SOP";
                        if (tx.fraudAnalysis?.isSplitBill) anomalyLabel = "Split Bill";
                        else if (tx.fraudAnalysis?.isDuplicate) anomalyLabel = "Duplikasi pHash";
                        else if (tx.fraudAnalysis?.isHighRiskCat) anomalyLabel = "Kategori Berisiko";
                        else if (tx.fraudAnalysis?.isOffHours) anomalyLabel = "Luar Jam Kerja";
                        else if (tx.fraudAnalysis?.isAnomalyAmount) anomalyLabel = "Anomali 3-Sigma";

                        return (
                          <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4 font-mono text-blue-600 font-semibold text-xs sm:text-sm whitespace-nowrap">
                              {tx.code}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                                {tx.applicantName}
                              </span>
                              <span className="text-slate-400 text-xs ml-1.5">
                                ({tx.department})
                              </span>
                            </td>
                            <td className="py-3 px-4 text-xs sm:text-sm text-slate-800 whitespace-nowrap">
                              {tx.vendor}
                            </td>
                            <td className="py-3 px-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                              {new Date(tx.date).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-right whitespace-nowrap text-xs sm:text-sm text-slate-900">
                              Rp {tx.amount.toLocaleString("id-ID")}
                            </td>

                            {activeTab === "PENDING" ? (
                              <>
                                <td className="py-3 px-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                                      isHigh
                                        ? "text-rose-700"
                                        : isMed
                                        ? "text-amber-700"
                                        : "text-slate-500"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                        isHigh
                                          ? "bg-rose-600"
                                          : isMed
                                          ? "bg-amber-600"
                                          : "bg-slate-400"
                                      }`}
                                    ></span>
                                    <span>{anomalyLabel}</span>
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-center whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                                      isHigh
                                        ? "bg-rose-100 text-rose-800"
                                        : isMed
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-slate-100 text-slate-700"
                                    }`}
                                  >
                                    {score}%
                                  </span>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="py-3 px-4 text-center whitespace-nowrap">
                                  {getStatusBadge(tx.status)}
                                </td>
                                <td className="py-3 px-4 text-xs max-w-xs truncate">
                                  <span className="text-slate-700">
                                    {tx.auditLogs?.[0]?.notes || "-"}
                                  </span>
                                </td>
                              </>
                            )}

                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <Link
                                href={`/detail-inspeksi/${tx.code}`}
                                prefetch={false}
                                className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                              >
                                <span>{activeTab === "PENDING" ? "Inspeksi" : "BAP"}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
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
      </div>
    </>
  );
}
