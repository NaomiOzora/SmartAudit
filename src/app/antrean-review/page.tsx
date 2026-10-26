"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AuditorSidebar from "@/components/AuditorSidebar";
import { useAuth } from "@/lib/auth";
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  Search,
  ArrowUpDown,
  ArrowRight,
  Eye,
  RefreshCw,
  FileSearch,
  BrainCircuit,
  LogOut,
  AlertTriangle,
  Receipt,
  FileClock,
} from "lucide-react";

interface Transaction {
  id: string;
  code: string;
  applicantName: string;
  department: string;
  category: string;
  vendor: string;
  amount: number;
  date: string;
  status: string;
  description: string;
  receipt?: {
    imageUrl: string;
    extractedVendor?: string;
    extractedDate?: string;
    extractedAmount?: number;
    phashFingerprint?: string;
    sha256Hash?: string;
  };
  fraudAnalysis?: {
    riskScore: number;
    riskLevel: string;
    reasonXai: string;
    pointsBreakdown?: string;
    isDuplicate: boolean;
    duplicateTarget?: string;
    duplicateSim?: number;
    isSplitBill: boolean;
    isAnomalyAmount: boolean;
    isHighRiskCat: boolean;
    isOffHours: boolean;
    isRoundAmount: boolean;
  };
}

export default function AntreanReviewPage() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<"ALL" | "HIGH" | "MEDIUM">("ALL");
  const [deptFilter, setDeptFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"risk" | "date">("risk");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, [search, riskFilter, deptFilter, sortBy]);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (riskFilter !== "ALL") params.append("risk", riskFilter);
      if (deptFilter !== "all") params.append("department", deptFilter);
      params.append("sort", sortBy);

      const res = await fetch(`/api/transactions?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
        if (data.data.length > 0 && !selectedTx) {
          setSelectedTx(data.data[0]);
        }
      }
    } catch (err) {
      console.error("Gagal memuat antrean:", err);
    } finally {
      setLoading(false);
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

  const pendingTransactions = transactions.filter(
    (t) => (t.fraudAnalysis?.riskScore || 0) >= 40
  );
  const criticalCount = pendingTransactions.filter(
    (t) => (t.fraudAnalysis?.riskScore || 0) >= 70
  ).length;
  const totalExposure = pendingTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <>
      <Navbar currentRole="AUDITOR" />
      <AuditorSidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen bg-slate-50 pt-16">
        <main className="w-full flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <div className="w-full max-w-7xl mx-auto space-y-6">
            {/* Top Workspace Context */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2.5">
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Antrean Review Transaksi Berisiko
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                    Auditor Forensik
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Pemeriksaan anomali dan justifikasi pengeluaran kas sebelum otorisasi pemindahbukuan dana.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={fetchQueue}
                  className="h-10 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold inline-flex items-center gap-2 transition-colors border border-slate-200 shadow-xs"
                  title="Segarkan antrean"
                >
                  <RefreshCw className="w-4 h-4 text-blue-600" />
                  <span>Segarkan Antrean</span>
                </button>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Metric 1 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Perlu Evaluasi Forensik
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                        {criticalCount}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">berkas risiko tinggi</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                    Kritis
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Eksposur: <strong className="text-slate-800 font-mono text-sm">Rp {(totalExposure / 1000000).toFixed(1)} Jt</strong></span>
                  <span className="text-rose-600 font-semibold">Prioritas Utama</span>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Disetujui Otomatis
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                        {transactions.filter((t) => t.status === "AUTO_APPROVED").length}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">dari {transactions.length} total</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    Fast-Track
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Rata-rata Ekstraksi: <strong className="text-slate-800 text-sm">1.2 dtk</strong></span>
                  <span className="text-emerald-700 font-semibold">SLA Terpenuhi</span>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Presisi Algoritma AI
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-mono">
                        99.4%
                      </span>
                      <span className="text-xs text-slate-500 font-medium">akurasi deteksi</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                    pHash + Rules
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Toleransi pHash: <strong className="text-slate-800 text-sm">&gt; 85%</strong></span>
                  <span className="text-slate-600 font-semibold">ISO 27001</span>
                </div>
              </div>
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
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      riskFilter === "ALL"
                        ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Semua ({transactions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRiskFilter("HIGH")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
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
                    className={`px-3 py-1.5 rounded-lg transition-all ${
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
                  <option value="all">Semua Divisi</option>
                  <option value="Pengadaan">Pengadaan & Logistik</option>
                  <option value="TI">TI & Infrastruktur</option>
                  <option value="Pemasaran">Pemasaran & Humas</option>
                  <option value="Operasional">Operasional</option>
                </select>

                {/* Sort Toggle */}
                <button
                  type="button"
                  onClick={() => setSortBy(sortBy === "risk" ? "date" : "risk")}
                  className="h-10 px-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl inline-flex items-center gap-2 border border-slate-200 transition-colors"
                >
                  <ArrowUpDown className="w-4 h-4 text-slate-500" />
                  <span>{sortBy === "risk" ? "Urut: Skor Risiko" : "Urut: Tanggal"}</span>
                </button>
              </div>
            </div>

            {/* Main Split Grid: Table (8 Cols) + Quick Preview (4 Cols) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Table Container */}
              <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
                  <span className="text-base font-bold text-slate-900">
                    Daftar Transaksi Perlu Evaluasi
                  </span>
                  <span className="text-xs text-slate-500">
                    Pilih baris pada tabel untuk pratinjau cepat
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 text-slate-600 uppercase tracking-wider text-xs border-b border-slate-200/80 font-bold">
                        <th className="py-3.5 px-4 font-semibold">Kode</th>
                        <th className="py-3.5 px-4 font-semibold">Pemohon & Divisi</th>
                        <th className="py-3.5 px-4 font-semibold">Tanggal</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Nominal</th>
                        <th className="py-3.5 px-4 font-semibold">Indikasi AI</th>
                        <th className="py-3.5 px-3 font-semibold text-center">Skor</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            <FileClock className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                            <p className="mt-2 text-sm">Memuat antrean...</p>
                          </td>
                        </tr>
                      ) : transactions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
                            <p className="mt-2 font-semibold text-sm">Tidak ada transaksi ditemukan</p>
                          </td>
                        </tr>
                      ) : (
                        transactions.map((tx) => {
                          const score = tx.fraudAnalysis?.riskScore || 0;
                          const isHigh = score >= 70;
                          const isMed = score >= 40 && score < 70;
                          const isSelected = selectedTx?.id === tx.id;

                          let anomalyLabel = "Normal SOP";
                          if (tx.fraudAnalysis?.isSplitBill) anomalyLabel = "Split Bill";
                          else if (tx.fraudAnalysis?.isDuplicate) anomalyLabel = "Duplikasi pHash";
                          else if (tx.fraudAnalysis?.isHighRiskCat) anomalyLabel = "Kategori Berisiko";
                          else if (tx.fraudAnalysis?.isOffHours) anomalyLabel = "Luar Jam Kerja";
                          else if (tx.fraudAnalysis?.isAnomalyAmount) anomalyLabel = "Anomali Nominal";

                          return (
                            <tr
                              key={tx.id}
                              onClick={() => setSelectedTx(tx)}
                              className={`cursor-pointer transition-colors ${
                                isSelected
                                  ? isHigh
                                    ? "bg-rose-50/70 border-l-4 border-l-rose-600"
                                    : "bg-blue-50/60 border-l-4 border-l-blue-600"
                                  : isHigh
                                  ? "hover:bg-rose-50/30"
                                  : "hover:bg-slate-50/70"
                              }`}
                            >
                              <td className="py-3.5 px-4 font-mono text-blue-600 font-semibold text-sm">
                                {tx.code}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-semibold text-slate-900 leading-tight">
                                  {tx.applicantName}
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">
                                  {tx.department}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                                {new Date(tx.date).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </td>
                              <td className="py-3.5 px-4 font-mono font-bold text-right whitespace-nowrap text-sm text-slate-900">
                                Rp {tx.amount.toLocaleString("id-ID")}
                              </td>
                              <td className="py-3.5 px-4">
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
                                    className={`w-2 h-2 rounded-full shrink-0 ${
                                      isHigh ? "bg-rose-600" : isMed ? "bg-amber-600" : "bg-slate-400"
                                    }`}
                                  ></span>
                                  <span>{anomalyLabel}</span>
                                </span>
                              </td>
                              <td className="py-3.5 px-3 text-center">
                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
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
                              <td className="py-3.5 px-4 text-right">
                                <Link
                                  href={`/detail-inspeksi/${tx.code}`}
                                  prefetch={false}
                                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold transition-colors inline-flex items-center gap-1 shadow-xs"
                                >
                                  <span>Periksa</span>
                                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
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

              {/* Quick Preview Card */}
              <div className="xl:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="inline-flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-sm font-bold text-slate-900">
                      Pratinjau Berkas Terpilih
                    </span>
                  </div>
                  {selectedTx && (
                    <span className="font-mono text-xs text-blue-600 font-bold">
                      {selectedTx.code}
                    </span>
                  )}
                </div>

                {selectedTx ? (
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <span className="text-xs text-slate-500 uppercase font-bold block">
                          Tingkat Risiko
                        </span>
                        <span className="font-mono font-bold text-base text-rose-700">
                          {selectedTx.fraudAnalysis?.riskScore || 0}% &bull;{" "}
                          {selectedTx.fraudAnalysis?.riskLevel}
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white text-slate-700 font-semibold text-xs border border-slate-200 shadow-xs">
                        {selectedTx.status}
                      </span>
                    </div>

                    <div>
                      <div className="text-base font-bold text-slate-900 leading-tight">
                        {selectedTx.vendor}
                      </div>
                      <div className="font-mono text-lg font-bold text-blue-600 mt-1">
                        Rp {selectedTx.amount.toLocaleString("id-ID")}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Diajukan oleh: <strong>{selectedTx.applicantName}</strong> ({selectedTx.department})
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1.5">
                      <div className="inline-flex items-center gap-1.5 text-rose-800 font-bold text-xs">
                        <BrainCircuit className="w-4 h-4 shrink-0" />
                        <span>Faktor Kunci XAI:</span>
                      </div>
                      <p className="text-xs text-rose-950 leading-relaxed font-normal">
                        {selectedTx.fraudAnalysis?.reasonXai}
                      </p>
                    </div>

                    {selectedTx.receipt && (
                      <div className="space-y-1.5">
                        <span className="text-xs text-slate-500 uppercase font-bold">
                          Foto Kuitansi Fisik:
                        </span>
                        <div className="relative h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={selectedTx.receipt.imageUrl}
                            alt="Receipt"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    <Link
                      href={`/detail-inspeksi/${selectedTx.code}`}
                      prefetch={false}
                      className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <FileSearch className="w-4 h-4 shrink-0" />
                      <span>Inspeksi Forensik Lengkap</span>
                    </Link>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 text-center py-8">
                    Pilih baris pada tabel untuk melihat rincian kasus.
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
