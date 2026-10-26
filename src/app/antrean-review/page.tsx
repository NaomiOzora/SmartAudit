"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AuditorSidebar from "@/components/AuditorSidebar";
import { useAuth } from "@/lib/auth";

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
        <main className="w-full min-h-screen pt-20 px-4 flex items-center justify-center bg-slate-50">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs max-w-md text-center">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 inline-flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[20px]">security</span>
            </div>
            <h2 className="text-sm font-semibold text-slate-900">Akses Khusus Auditor Forensik</h2>
            <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
              Anda saat ini masuk sebagai <strong>{user.name}</strong> (Staf Keuangan). Antrean review dan verifikasi kasus hanya dapat diakses oleh Auditor.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Link
                href="/beranda-staf"
                prefetch={false}
                className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Kembali ke Beranda Staf</span>
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

      <div className="lg:pl-60 flex flex-col min-h-screen bg-slate-50 pt-14">
        <main className="w-full flex-1 px-4 sm:px-6 py-5">
          <div className="w-full max-w-7xl mx-auto space-y-4">
            {/* Top Workspace Context */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    Antrean Review Transaksi
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-medium border border-rose-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                    Auditor Forensik
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verifikasi transaksi kas terindikasi anomali sebelum pencairan dana.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={fetchQueue}
                  className="h-8 px-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium inline-flex items-center gap-1.5 transition-colors border border-slate-200 shadow-xs"
                  title="Segarkan antrean"
                >
                  <span className="material-symbols-outlined text-[15px] text-blue-600">sync</span>
                  <span>Segarkan</span>
                </button>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Metric 1 */}
              <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                      Perlu Evaluasi Forensik
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-xl font-bold text-slate-900 font-mono">
                        {criticalCount}
                      </span>
                      <span className="text-xs text-slate-500">berkas risiko tinggi</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[11px] font-medium border border-rose-200">
                    Kritis
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Eksposur: <strong className="text-slate-800 font-mono">Rp {(totalExposure / 1000000).toFixed(1)} Jt</strong></span>
                  <span className="text-rose-600 font-medium">Prioritas Tinggi</span>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                      Disetujui Otomatis
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-xl font-bold text-slate-900 font-mono">
                        {transactions.filter((t) => t.status === "AUTO_APPROVED").length}
                      </span>
                      <span className="text-xs text-slate-500">dari {transactions.length} total</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200">
                    Fast-Track
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Rata-rata: <strong className="text-slate-800">1.2 mnt</strong></span>
                  <span className="text-emerald-700 font-medium">SLA Terpenuhi</span>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                      Presisi Algoritma AI
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-xl font-bold text-blue-600 font-mono">
                        99.4%
                      </span>
                      <span className="text-xs text-slate-500">akurasi deteksi</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-medium border border-blue-200">
                    pHash + Rules
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Toleransi pHash: <strong className="text-slate-800">&gt; 85%</strong></span>
                  <span className="text-slate-600 font-medium">ISO 27001</span>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[15px] text-slate-400 pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari ID, rekanan, atau pemohon..."
                  className="w-full h-8 pl-8 pr-3 bg-slate-50 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 border border-slate-200 transition-all"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Risk Filter Pills */}
                <div className="inline-flex p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setRiskFilter("ALL")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      riskFilter === "ALL"
                        ? "bg-white text-slate-900 shadow-xs font-semibold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Semua ({transactions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRiskFilter("HIGH")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      riskFilter === "HIGH"
                        ? "bg-white text-rose-700 shadow-xs font-semibold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Tinggi (&ge;70%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRiskFilter("MEDIUM")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      riskFilter === "MEDIUM"
                        ? "bg-white text-amber-700 shadow-xs font-semibold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Sedang (40-70%)
                  </button>
                </div>

                {/* Division Dropdown */}
                <div className="relative">
                  <select
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    className="h-8 pl-2.5 pr-7 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs rounded-lg appearance-none cursor-pointer focus:outline-none border border-slate-200"
                  >
                    <option value="all">Semua Divisi</option>
                    <option value="Pengadaan">Pengadaan & Logistik</option>
                    <option value="TI">TI & Infrastruktur</option>
                    <option value="Pemasaran">Pemasaran & Humas</option>
                    <option value="Operasional">Operasional</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-400 pointer-events-none">
                    expand_more
                  </span>
                </div>

                {/* Sort Toggle */}
                <button
                  type="button"
                  onClick={() => setSortBy(sortBy === "risk" ? "date" : "risk")}
                  className="h-8 px-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs rounded-lg inline-flex items-center gap-1 border border-slate-200 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">sort</span>
                  <span>{sortBy === "risk" ? "Skor Risiko" : "Tanggal"}</span>
                </button>
              </div>
            </div>

            {/* Main Split Grid: Table (8 Cols) + Quick Preview (4 Cols) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
              {/* Table Container */}
              <div className="xl:col-span-8 bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-900">
                    Daftar Transaksi Perlu Evaluasi
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Pilih baris untuk pratinjau
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200/70">
                        <th className="py-2.5 px-3 font-semibold">ID</th>
                        <th className="py-2.5 px-3 font-semibold">Pemohon & Divisi</th>
                        <th className="py-2.5 px-2.5 font-semibold">Tanggal</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Nominal</th>
                        <th className="py-2.5 px-3 font-semibold">Indikasi AI</th>
                        <th className="py-2.5 px-2 font-semibold text-center">Skor</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-slate-400">
                            <span className="material-symbols-outlined text-[22px] animate-spin text-blue-600">
                              sync
                            </span>
                            <p className="mt-1 text-xs">Memuat antrean...</p>
                          </td>
                        </tr>
                      ) : transactions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-slate-400">
                            <span className="material-symbols-outlined text-[28px] text-slate-300">
                              verified
                            </span>
                            <p className="mt-1 font-medium text-xs">Tidak ada transaksi ditemukan</p>
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
                                    ? "bg-rose-50/70 border-l-2 border-l-rose-600"
                                    : "bg-blue-50/60 border-l-2 border-l-blue-600"
                                  : isHigh
                                  ? "hover:bg-rose-50/30"
                                  : "hover:bg-slate-50/70"
                              }`}
                            >
                              <td className="py-2 px-3 font-mono text-blue-600 font-medium">
                                {tx.code}
                              </td>
                              <td className="py-2 px-3">
                                <div className="font-medium text-slate-900 leading-tight">
                                  {tx.applicantName}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  {tx.department}
                                </div>
                              </td>
                              <td className="py-2 px-2.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                {new Date(tx.date).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </td>
                              <td className="py-2 px-3 font-mono font-medium text-right whitespace-nowrap">
                                Rp {tx.amount.toLocaleString("id-ID")}
                              </td>
                              <td className="py-2 px-3">
                                <span
                                  className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                                    isHigh
                                      ? "text-rose-700"
                                      : isMed
                                      ? "text-amber-700"
                                      : "text-slate-500"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                      isHigh ? "bg-rose-600" : isMed ? "bg-amber-600" : "bg-slate-400"
                                    }`}
                                  ></span>
                                  <span>{anomalyLabel}</span>
                                </span>
                              </td>
                              <td className="py-2 px-2 text-center">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
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
                              <td className="py-2 px-3 text-right">
                                <Link
                                  href={`/detail-inspeksi/${tx.code}`}
                                  prefetch={false}
                                  className="px-2.5 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-[11px] font-medium transition-colors inline-flex items-center gap-0.5"
                                >
                                  <span>Periksa</span>
                                  <span className="material-symbols-outlined text-[13px] shrink-0">
                                    arrow_forward
                                  </span>
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
              <div className="xl:col-span-4 bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-blue-600 text-[16px] shrink-0">
                      visibility
                    </span>
                    <span className="text-xs font-semibold text-slate-900">
                      Pratinjau Instan
                    </span>
                  </div>
                  {selectedTx && (
                    <span className="font-mono text-[11px] text-blue-600 font-semibold">
                      {selectedTx.code}
                    </span>
                  )}
                </div>

                {selectedTx ? (
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-medium block">
                          Tingkat Risiko
                        </span>
                        <span className="font-mono font-bold text-sm text-rose-700">
                          {selectedTx.fraudAnalysis?.riskScore || 0}% &bull;{" "}
                          {selectedTx.fraudAnalysis?.riskLevel}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-white text-slate-700 font-medium text-[11px] border border-slate-200">
                        {selectedTx.status}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-slate-900 leading-tight">
                        {selectedTx.vendor}
                      </div>
                      <div className="font-mono text-sm font-bold text-blue-600 mt-0.5">
                        Rp {selectedTx.amount.toLocaleString("id-ID")}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {selectedTx.applicantName} ({selectedTx.department})
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 space-y-1">
                      <div className="inline-flex items-center gap-1 text-rose-800 font-medium text-[11px]">
                        <span className="material-symbols-outlined text-[13px] shrink-0">psychology</span>
                        <span>Faktor Kunci XAI:</span>
                      </div>
                      <p className="text-[11px] text-rose-950 leading-relaxed font-normal">
                        {selectedTx.fraudAnalysis?.reasonXai}
                      </p>
                    </div>

                    {selectedTx.receipt && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-medium">
                          Foto Kuitansi:
                        </span>
                        <div className="relative h-28 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
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
                      className="w-full h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium inline-flex items-center justify-center gap-1 transition-colors shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[15px] shrink-0">
                        document_scanner
                      </span>
                      <span>Inspeksi Forensik Penuh</span>
                    </Link>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">
                    Pilih baris pada tabel untuk melihat detail.
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
