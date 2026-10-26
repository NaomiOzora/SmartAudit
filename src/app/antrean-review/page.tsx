"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AuditorSidebar from "@/components/AuditorSidebar";

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

  // Metrik antrean
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

      <div className="lg:pl-64 flex flex-col min-h-screen bg-surface pt-16">
        <main className="w-full flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <div className="w-full max-w-7xl mx-auto space-y-6">
            {/* Top Workspace Context */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold text-[24px]">
                    Antrean Review Transaksi Berisiko
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Akses Auditor Forensik
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Pemeriksaan anomali pengeluaran sebelum pemindahbukuan dana. Dikelola otomatis oleh SmartAudit AI Engine.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/beranda-staf"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all shadow-sm border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    switch_account
                  </span>
                  <span>Beralih ke Tampilan Staf</span>
                </Link>
                <button
                  type="button"
                  onClick={fetchQueue}
                  className="w-10 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors shadow-sm border border-outline-variant/30"
                  title="Segarkan Antrean"
                >
                  <span className="material-symbols-outlined text-[18px]">sync</span>
                </button>
              </div>
            </div>

            {/* Executive Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Metric 1 */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                      Perlu Tindakan Forensik
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-display-lg text-display-lg text-on-surface font-bold text-[32px] font-data-mono">
                        {criticalCount}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        berkas risiko tinggi
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error-container text-tertiary font-label-sm text-label-sm font-bold">
                    <span className="material-symbols-outlined text-[14px]">priority_high</span>
                    Antrean Tertunda
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                  <span>
                    Total eksposur: <strong className="text-on-surface font-data-mono">Rp {(totalExposure / 1000000).toFixed(1)} Jt</strong>
                  </span>
                  <span className="text-tertiary font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                    Audit Prioritas
                  </span>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                      Disetujui Otomatis (Fast-Track)
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-display-lg text-display-lg text-on-surface font-bold text-[32px] font-data-mono">
                        {transactions.filter((t) => t.status === "AUTO_APPROVED").length}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        dari {transactions.length} total
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed/50 text-secondary font-label-sm text-label-sm font-bold">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Lolos Auto
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                  <span>
                    Rata-rata verifikasi: <strong className="text-on-surface font-data-mono">1.2 menit/kasus</strong>
                  </span>
                  <span className="text-secondary font-semibold">SLA Dipenuhi</span>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                      Presisi Algoritma AI
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-display-lg text-display-lg text-primary font-bold text-[32px] font-data-mono">
                        99.4%
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        tingkat kepastian
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-bold">
                    <span className="material-symbols-outlined text-[14px]">psychology</span>
                    pHash + Rule Engine
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                  <span>
                    Toleransi pHash: <strong className="text-on-surface font-data-mono">&gt; 85% Duplikasi</strong>
                  </span>
                  <span className="text-secondary font-semibold">ISO 27001 Ready</span>
                </div>
              </div>
            </div>

            {/* Filter Control Bar */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-lg">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline">
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari ID transaksi, nama vendor, atau pemohon..."
                  className="w-full h-10 pl-9 pr-4 bg-surface-container-low rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 border border-outline-variant/30 transition-all"
                />
              </div>

              {/* Buttons and dropdowns */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Risk Level Filter */}
                <div className="inline-flex p-1 bg-surface-container-low rounded-xl border border-outline-variant/20">
                  <button
                    type="button"
                    onClick={() => setRiskFilter("ALL")}
                    className={`px-3 py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-all ${
                      riskFilter === "ALL"
                        ? "bg-surface-container-lowest text-on-surface shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Semua ({transactions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRiskFilter("HIGH")}
                    className={`px-3 py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-all ${
                      riskFilter === "HIGH"
                        ? "bg-surface-container-lowest text-tertiary shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Tinggi (&ge; 70%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRiskFilter("MEDIUM")}
                    className={`px-3 py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-all ${
                      riskFilter === "MEDIUM"
                        ? "bg-surface-container-lowest text-secondary shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Sedang (40-70%)
                  </button>
                </div>

                {/* Division Filter */}
                <div className="relative">
                  <select
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    className="h-10 pl-3 pr-8 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md rounded-xl appearance-none cursor-pointer focus:outline-none border border-outline-variant/30 transition-colors"
                  >
                    <option value="all">Semua Divisi</option>
                    <option value="Pengadaan">Pengadaan & Logistik</option>
                    <option value="TI">TI & Infrastruktur</option>
                    <option value="Pemasaran">Pemasaran & Humas</option>
                    <option value="Operasional">Operasional</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">
                    expand_more
                  </span>
                </div>

                {/* Sort Toggle */}
                <button
                  type="button"
                  onClick={() => setSortBy(sortBy === "risk" ? "date" : "risk")}
                  className="h-10 px-3 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md rounded-xl inline-flex items-center gap-1.5 border border-outline-variant/30 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">sort</span>
                  <span>{sortBy === "risk" ? "Urut Skor Risiko" : "Urut Tanggal"}</span>
                </button>
              </div>
            </div>

            {/* Main Section: Ledger Table + Inline Preview */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Table Container (8 Cols on XL) */}
              <div className="xl:col-span-8 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
                <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-surface-container">
                  <div className="flex items-center gap-2">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold text-[16px]">
                      Daftar Transaksi Perlu Evaluasi
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container font-data-mono text-[11px] text-on-surface-variant font-semibold">
                      {transactions.length} berkas
                    </span>
                  </div>
                  <span className="font-label-sm text-[11px] text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">info</span>
                    Klik baris untuk pratinjau instan
                  </span>
                </div>

                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-surface-container">
                        <th className="py-3 px-6 font-semibold">ID TRANSAKSI</th>
                        <th className="py-3 px-4 font-semibold">PEMOHON & DIVISI</th>
                        <th className="py-3 px-4 font-semibold">TANGGAL</th>
                        <th className="py-3 px-4 font-semibold text-right">NOMINAL</th>
                        <th className="py-3 px-4 font-semibold">INDIKASI SINGKAT AI</th>
                        <th className="py-3 px-4 font-semibold text-center">SKOR RISIKO</th>
                        <th className="py-3 px-6 font-semibold text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="font-body-md text-body-md divide-y divide-surface-container">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                            <span className="material-symbols-outlined text-[28px] animate-spin text-primary">
                              sync
                            </span>
                            <p className="mt-2 text-body-sm">Memuat antrean audit forensik...</p>
                          </td>
                        </tr>
                      ) : transactions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                            <span className="material-symbols-outlined text-[36px] text-outline">
                              verified
                            </span>
                            <p className="mt-2 font-semibold">Tidak ada transaksi yang sesuai kriteria</p>
                          </td>
                        </tr>
                      ) : (
                        transactions.map((tx) => {
                          const score = tx.fraudAnalysis?.riskScore || 0;
                          const isHigh = score >= 70;
                          const isMed = score >= 40 && score < 70;
                          const isSelected = selectedTx?.id === tx.id;

                          // Ambil label anomali
                          let anomalyLabel = "Normal SOP";
                          if (tx.fraudAnalysis?.isSplitBill) anomalyLabel = "Indikasi Split Bill";
                          else if (tx.fraudAnalysis?.isDuplicate) anomalyLabel = "Duplikasi Nota pHash";
                          else if (tx.fraudAnalysis?.isHighRiskCat) anomalyLabel = "Kategori Berisiko";
                          else if (tx.fraudAnalysis?.isOffHours) anomalyLabel = "Di Luar Jam Kerja";
                          else if (tx.fraudAnalysis?.isAnomalyAmount) anomalyLabel = "Anomali Nominal";

                          return (
                            <tr
                              key={tx.id}
                              onClick={() => setSelectedTx(tx)}
                              className={`cursor-pointer transition-colors ${
                                isSelected
                                  ? isHigh
                                    ? "bg-error-container/30 border-l-4 border-l-tertiary"
                                    : "bg-surface-container-high border-l-4 border-l-primary"
                                  : isHigh
                                  ? "hover:bg-error-container/15"
                                  : "hover:bg-surface-container-low"
                              }`}
                            >
                              <td className="py-3.5 px-6 font-data-mono text-primary font-bold">
                                {tx.code}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="flex flex-col">
                                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                                    {tx.applicantName}
                                  </span>
                                  <span className="font-body-sm text-[12px] text-on-surface-variant">
                                    {tx.department}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-on-surface-variant font-data-mono text-[12px] whitespace-nowrap">
                                {new Date(tx.date).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="py-3.5 px-4 font-data-mono text-on-surface font-bold text-right whitespace-nowrap">
                                Rp {tx.amount.toLocaleString("id-ID")}
                              </td>
                              <td className="py-3.5 px-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 font-label-sm text-[12px] font-semibold ${
                                    isHigh
                                      ? "text-tertiary"
                                      : isMed
                                      ? "text-secondary"
                                      : "text-on-surface-variant"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      isHigh ? "bg-tertiary" : isMed ? "bg-secondary" : "bg-outline"
                                    }`}
                                  ></span>
                                  {anomalyLabel}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-data-mono text-[12px] font-bold ${
                                    isHigh
                                      ? "bg-error-container text-on-error-container"
                                      : isMed
                                      ? "bg-secondary-fixed text-on-secondary-fixed-variant"
                                      : "bg-surface-container text-on-surface-variant"
                                  }`}
                                >
                                  {score}%
                                </span>
                              </td>
                              <td className="py-3.5 px-6 text-right">
                                <Link
                                  href={`/detail-inspeksi/${tx.code}`}
                                  className="px-3.5 py-1.5 rounded-xl bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md font-semibold transition-all shadow-sm inline-flex items-center gap-1"
                                >
                                  <span>Periksa</span>
                                  <span className="material-symbols-outlined text-[16px]">
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

              {/* Inline Quick Preview Drawer / Card (4 Cols on XL) */}
              <div className="xl:col-span-4 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      visibility
                    </span>
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface text-[15px]">
                      Pratinjau Cepat Forensik
                    </span>
                  </div>
                  {selectedTx && (
                    <span className="font-data-mono text-[12px] text-primary font-bold">
                      {selectedTx.code}
                    </span>
                  )}
                </div>

                {selectedTx ? (
                  <div className="space-y-4">
                    {/* Score badge & Status */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                      <div>
                        <span className="text-[11px] text-on-surface-variant uppercase font-semibold block">
                          Tingkat Risiko AI
                        </span>
                        <span className="font-headline-sm text-[18px] font-bold text-tertiary font-data-mono">
                          {selectedTx.fraudAnalysis?.riskScore || 0}% &bull;{" "}
                          {selectedTx.fraudAnalysis?.riskLevel || "LOW"}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-[11px] font-semibold">
                        Status: {selectedTx.status}
                      </span>
                    </div>

                    {/* Vendor and Amount */}
                    <div className="space-y-1">
                      <span className="text-[11px] text-on-surface-variant uppercase font-semibold">
                        Vendor & Rekanan
                      </span>
                      <div className="font-semibold text-on-surface text-[15px]">
                        {selectedTx.vendor}
                      </div>
                      <div className="font-data-mono text-[20px] font-bold text-primary">
                        Rp {selectedTx.amount.toLocaleString("id-ID")}
                      </div>
                      <div className="text-[12px] text-on-surface-variant">
                        Pemohon: <strong>{selectedTx.applicantName}</strong> ({selectedTx.department})
                      </div>
                    </div>

                    {/* XAI Narrative Box */}
                    <div className="p-3.5 rounded-xl bg-error-container/40 border border-tertiary/20 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-tertiary font-bold text-[12px]">
                        <span className="material-symbols-outlined text-[16px]">psychology</span>
                        <span>Analisis Faktor Kunci (XAI):</span>
                      </div>
                      <p className="font-body-sm text-[12px] text-on-surface leading-relaxed">
                        {selectedTx.fraudAnalysis?.reasonXai || "Memenuhi SOP validitas kas standar."}
                      </p>
                    </div>

                    {/* Receipt Thumbnail if available */}
                    {selectedTx.receipt && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] text-on-surface-variant uppercase font-semibold">
                          Pratinjau Kuitansi Fisik:
                        </span>
                        <div className="relative h-32 rounded-xl overflow-hidden bg-surface-container border border-outline-variant/30 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={selectedTx.receipt.imageUrl}
                            alt="Receipt"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 left-2 bg-surface-container-lowest/90 px-2 py-0.5 rounded text-[10px] font-data-mono font-semibold">
                            pHash: {selectedTx.receipt.phashFingerprint?.slice(0, 10)}...
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Full Inspection CTA button */}
                    <Link
                      href={`/detail-inspeksi/${selectedTx.code}`}
                      className="w-full h-11 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-headline-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        document_scanner
                      </span>
                      <span>Buka Inspeksi Forensik Penuh</span>
                    </Link>
                  </div>
                ) : (
                  <p className="text-body-sm text-on-surface-variant text-center py-8">
                    Pilih baris pada tabel untuk melihat analisis instan.
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
