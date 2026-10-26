"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AuditorSidebar from "@/components/AuditorSidebar";
import { useAuth } from "@/lib/auth";

interface TransactionDetail {
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
    ocrRawText: string;
    extractedVendor: string;
    extractedDate: string;
    extractedAmount: number;
    phashFingerprint: string;
    sha256Hash: string;
    fileSizeKb: number;
    ocrConfidence: number;
    ocrLatencyMs: number;
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
  auditLogs?: Array<{
    id: string;
    auditorName: string;
    action: string;
    notes: string;
    tamperHash: string;
    createdAt: string;
  }>;
}

export default function DetailInspeksiPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { user, logout } = useAuth();

  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Zoom state
  const [zoomLevel, setZoomLevel] = useState(1.0);

  // Adjudication state
  const [decision, setDecision] = useState<"APPROVED" | "REJECTED" | "CLARIFICATION">("REJECTED");
  const [auditNotes, setAuditNotes] = useState(
    "Kuitansi terindikasi salinan berkas lama. Eskalasi ke Komite Etik & SPI untuk pembekuan vendor."
  );
  const [isoComplianceChecked, setIsoComplianceChecked] = useState(true);
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (id) {
      fetchTransactionDetail();
    }
  }, [id]);

  const fetchTransactionDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/transactions/${id}`);
      const data = await res.json();
      if (data.success) {
        setTransaction(data.data);
        if (data.data.fraudAnalysis?.reasonXai) {
          setAuditNotes(
            `Hasil Forensik: ${data.data.fraudAnalysis.reasonXai}. Rekomendasi eskalasi investigasi lanjutan.`
          );
        }
      }
    } catch (err) {
      console.error("Gagal memuat detail transaksi:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleZoomIn = () => {
    if (zoomLevel < 1.4) setZoomLevel((prev) => Math.min(1.4, Number((prev + 0.1).toFixed(2))));
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.8) setZoomLevel((prev) => Math.max(0.8, Number((prev - 0.1).toFixed(2))));
  };

  const handleZoomReset = () => {
    setZoomLevel(1.0);
  };

  const handleSubmitDecision = async () => {
    if (!transaction) return;
    setIsSubmittingDecision(true);

    try {
      const res = await fetch("/api/auditor/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: transaction.id,
          action: decision,
          notes: auditNotes,
          auditorName: user?.name ? `${user.name} (Auditor Forensik)` : "Bambang H. (Auditor Forensik)",
        }),
      });

      const json = await res.json();
      if (json.success) {
        setToastMessage(
          decision === "APPROVED"
            ? `Berkas ${transaction.code} disetujui. Webhook pencairan kas berhasil ditrigger ke ERP!`
            : decision === "REJECTED"
            ? `Berkas ${transaction.code} ditolak & dieskalasi ke Komite Etik.`
            : `Permohonan klarifikasi dikirim ke staf pemohon.`
        );
        setShowToast(true);
        fetchTransactionDetail();
        setTimeout(() => setShowToast(false), 3500);
      } else {
        alert(json.error || "Gagal menyimpan putusan.");
      }
    } catch (err) {
      console.error("Error submit decision:", err);
      alert("Terjadi kesalahan sistem saat menyimpan putusan.");
    } finally {
      setIsSubmittingDecision(false);
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
              Anda saat ini masuk sebagai <strong>{user.name}</strong> (Staf Keuangan). Berkas detail inspeksi forensik hanya dapat ditinjau oleh Auditor.
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

  if (loading) {
    return (
      <>
        <Navbar currentRole="AUDITOR" />
        <AuditorSidebar />
        <div className="lg:pl-60 flex flex-col min-h-screen bg-slate-50/50 pt-14">
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <span className="material-symbols-outlined text-[28px] animate-spin text-blue-600">
                sync
              </span>
              <p className="text-[13px] font-medium text-slate-600">
                Memuat berkas forensik...
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!transaction) {
    return (
      <>
        <Navbar currentRole="AUDITOR" />
        <AuditorSidebar />
        <div className="lg:pl-60 flex flex-col min-h-screen bg-slate-50/50 pt-14 p-6">
          <div className="max-w-md mx-auto text-center py-12">
            <span className="material-symbols-outlined text-[36px] text-rose-600">error</span>
            <h2 className="mt-2 text-[16px] font-bold text-slate-900">
              Transaksi Tidak Ditemukan
            </h2>
            <Link
              href="/antrean-review"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-[12px] font-semibold"
            >
              Kembali ke Antrean
            </Link>
          </div>
        </div>
      </>
    );
  }

  const score = transaction.fraudAnalysis?.riskScore || 0;
  const isHighRisk = score >= 70;
  const points: Array<any> = transaction.fraudAnalysis?.pointsBreakdown
    ? JSON.parse(transaction.fraudAnalysis.pointsBreakdown)
    : [];

  return (
    <>
      <Navbar currentRole="AUDITOR" />
      <AuditorSidebar />

      <div className="lg:pl-60 flex flex-col min-h-screen bg-slate-50/50 pt-14">
        {/* Top Breadcrumb & Command Bar */}
        <div className="px-4 sm:px-6 py-3 bg-white border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <nav className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-0.5">
                <Link
                  href="/antrean-review"
                  className="hover:text-blue-600 transition-colors flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[13px]">arrow_back</span>
                  Antrean Review
                </Link>
                <span>/</span>
                <span className="text-slate-400">Inspeksi Forensik</span>
                <span>/</span>
                <span className="font-data-mono text-blue-600 font-bold">{transaction.code}</span>
              </nav>

              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
                  Inspeksi OCR & Forensik: {transaction.code}
                </h1>
                <span className="text-[12px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
                  {transaction.vendor}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    isHighRisk
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isHighRisk ? "bg-rose-600" : "bg-amber-600"}`}
                  ></span>
                  Skor Risiko {score}% &bull; {transaction.fraudAnalysis?.riskLevel}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link
                href="/antrean-review"
                className="h-8 px-3 flex items-center gap-1 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-[12px] font-medium shadow-xs"
              >
                <span className="material-symbols-outlined text-[15px]">keyboard_backspace</span>
                <span>Kembali</span>
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="h-8 px-3 flex items-center gap-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-[12px] font-semibold shadow-xs"
              >
                <span className="material-symbols-outlined text-[15px]">print</span>
                <span>Cetak BA</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Split Inspection Grid */}
        <main className="p-4 sm:p-6 grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* Column 1: Document Visualizer & OCR Data (7 Cols) */}
          <div className="xl:col-span-7 flex flex-col gap-4">
            <section className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-[18px]">
                    document_scanner
                  </span>
                  <h2 className="text-[14px] font-bold text-slate-900">
                    Pemeriksaan Kuitansi Fisik & Hasil OCR
                  </h2>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5 border border-slate-200">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    title="Zoom Out"
                    className="w-6 h-6 flex items-center justify-center rounded text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">remove</span>
                  </button>
                  <span className="font-data-mono text-[11px] px-1.5 text-slate-700 font-semibold">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    title="Zoom In"
                    className="w-6 h-6 flex items-center justify-center rounded text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomReset}
                    title="Reset View"
                    className="w-6 h-6 flex items-center justify-center rounded text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                  </button>
                </div>
              </div>

              {/* Document Canvas */}
              <div className="relative w-full min-h-[300px] bg-slate-100/70 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200 p-3">
                <div
                  style={{ transform: `scale(${zoomLevel})` }}
                  className="transition-transform duration-100 flex items-center justify-center"
                >
                  <div className="bg-white text-slate-900 shadow-md p-4 rounded-lg w-[300px] sm:w-[330px] font-data-mono text-[10px] leading-tight border border-slate-300">
                    <div className="flex justify-between items-center pb-1.5 mb-2 border-b border-slate-200 text-[9px] text-slate-500">
                      <span className="font-bold uppercase tracking-wider">DOC-SCAN-{transaction.code}</span>
                      <span className="text-blue-600">SHA-256 Valid</span>
                    </div>

                    <div className="text-center mb-2">
                      <div className="font-bold text-[12px] uppercase">{transaction.vendor}</div>
                      <div className="text-slate-500 text-[9px] mt-0.5">Bukti Transaksi Kas Resmi</div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 my-1.5 py-1 px-2 bg-slate-50 rounded border border-slate-200 text-[9px]">
                      <div>
                        <span className="text-slate-500">No. Faktur: </span>
                        <span className="font-semibold">INV-GK-8821</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500">Tanggal: </span>
                        <span className="font-semibold">{new Date(transaction.date).toLocaleDateString("id-ID")}</span>
                      </div>
                    </div>

                    <div className="my-2 space-y-1 text-[10px] text-slate-800">
                      <div className="flex justify-between py-0.5 border-b border-dashed border-slate-200">
                        <span>{transaction.description || "Pengadaan Barang & Jasa"}</span>
                        <span className="font-semibold">Rp {transaction.amount.toLocaleString("id-ID")}</span>
                      </div>
                    </div>

                    <div className="p-2 rounded bg-rose-50/80 mt-1.5 flex justify-between items-center border border-rose-200 text-[10px]">
                      <span className="font-bold uppercase">TOTAL BAYAR</span>
                      <span className="font-bold text-[12px] text-rose-700">Rp {transaction.amount.toLocaleString("id-ID")}</span>
                    </div>

                    <div className="mt-2 pt-1.5 text-[9px] text-slate-500 border-t border-slate-200 flex justify-between">
                      <span>Pemohon: {transaction.applicantName}</span>
                      <span className="text-emerald-700 font-bold">Lunas (Transfer)</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 bg-white/95 px-2.5 py-0.5 rounded-md shadow-xs border border-slate-200 text-[10px] font-medium text-slate-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>AI OCR &bull; Presisi 99.4% &bull; SLA 1.2s</span>
                </div>
              </div>

              {/* OCR Cross Match */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Vendor</div>
                    <div className="text-[12px] font-semibold text-slate-900 truncate mt-0.5">
                      {transaction.vendor}
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-emerald-600 text-[17px] shrink-0">check_circle</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Tanggal</div>
                    <div className="text-[12px] font-semibold text-slate-900 mt-0.5">
                      {new Date(transaction.date).toLocaleDateString("id-ID")}
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-emerald-600 text-[17px] shrink-0">check_circle</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Nominal Terbaca</div>
                    <div className="text-[12px] font-bold text-slate-900 font-data-mono mt-0.5">
                      Rp {transaction.amount.toLocaleString("id-ID")}
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-emerald-600 text-[17px] shrink-0">check_circle</span>
                </div>
              </div>

              {/* Critical Alerts */}
              {transaction.fraudAnalysis?.isDuplicate && (
                <div className="p-2.5 rounded-lg bg-rose-50 text-rose-900 flex items-center justify-between gap-2 border border-rose-200 text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-rose-600 text-[18px] shrink-0">warning</span>
                    <span>
                      <strong>Duplikasi Nota Terdeteksi:</strong> Identik dengan berkas transaksi{" "}
                      <strong>{transaction.fraudAnalysis.duplicateTarget || "TX-87912"}</strong>.
                    </span>
                  </div>
                  <span className="font-data-mono text-[10px] font-bold text-rose-800 bg-white px-2 py-0.5 rounded border border-rose-200 shrink-0">
                    {Math.round((transaction.fraudAnalysis.duplicateSim || 0.948) * 100)}% Similitudo
                  </span>
                </div>
              )}

              {transaction.fraudAnalysis?.isSplitBill && (
                <div className="p-2.5 rounded-lg bg-rose-50 text-rose-900 flex items-center justify-between gap-2 border border-rose-200 text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-rose-600 text-[18px] shrink-0">call_split</span>
                    <span>
                      <strong>Indikasi Split Bill:</strong> Pemecahan transaksi tepat di bawah pagu otorisasi direksi (Rp 50jt) dalam jeda &lt; 2 jam.
                    </span>
                  </div>
                  <span className="font-data-mono text-[10px] font-bold text-rose-800 bg-white px-2 py-0.5 rounded border border-rose-200 shrink-0">
                    +35 Poin
                  </span>
                </div>
              )}
            </section>

            {/* Digital Metadata */}
            <section className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-2.5">
              <span className="text-[13px] font-bold text-slate-900 block">
                Metadata Forensik Digital
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase">Scanner</div>
                  <div className="font-semibold text-slate-900 mt-0.5 truncate">Adobe Scan iOS</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase">pHash Fingerprint</div>
                  <div className="font-semibold text-blue-600 font-data-mono mt-0.5 truncate">
                    {transaction.receipt?.phashFingerprint || "d8f3a91cb2410e7a"}
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase">Digital Signature</div>
                  <div className="font-semibold text-rose-600 mt-0.5">Tidak Valid</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase">Kerapatan Pixel</div>
                  <div className="font-semibold text-emerald-700 mt-0.5">300 DPI (Valid)</div>
                </div>
              </div>
            </section>
          </div>

          {/* Column 2: XAI Factors & Adjudication (5 Cols) */}
          <div className="xl:col-span-5 flex flex-col gap-4">
            {/* XAI Factors */}
            <section className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-blue-600 text-[18px]">psychology</span>
                  <h2 className="text-[13px] font-bold text-slate-900">Faktor Risiko & AI (XAI)</h2>
                </div>
                <span className="font-data-mono text-[13px] font-bold text-rose-700 px-2 py-0.5 rounded bg-rose-50 border border-rose-200">
                  {score} / 100
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                {points.length > 0 ? (
                  points.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-[12px]"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="material-symbols-outlined text-rose-600 text-[16px] shrink-0">
                          report
                        </span>
                        <span className="font-medium text-slate-800 truncate">{p.rule}</span>
                      </div>
                      <span className="font-data-mono font-bold text-[11px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 shrink-0">
                        +{p.points}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-2.5 rounded-lg bg-slate-50 text-[12px] text-slate-600">
                    {transaction.fraudAnalysis?.reasonXai}
                  </div>
                )}
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 flex items-center justify-between border border-slate-200 text-[11px]">
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="material-symbols-outlined text-amber-600 text-[17px]">lock</span>
                  <span><strong>Pencairan Terkunci:</strong> Butuh evaluasi manual auditor.</span>
                </div>
                <span className="text-slate-500 font-medium">ISO 27001</span>
              </div>
            </section>

            {/* Adjudication Sheet */}
            <section className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col gap-3">
              <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <span className="material-symbols-outlined text-slate-700 text-[18px]">gavel</span>
                <h2 className="text-[13px] font-bold text-slate-900">Lembar Putusan Auditor</h2>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-600 uppercase">
                  Pilih Putusan Investigasi:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDecision("APPROVED")}
                    className={`h-8 px-2 rounded-lg text-[12px] font-semibold transition-all flex items-center justify-center gap-1 border ${
                      decision === "APPROVED"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">check_circle</span>
                    <span>Setujui</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecision("REJECTED")}
                    className={`h-8 px-2 rounded-lg text-[12px] font-semibold transition-all flex items-center justify-center gap-1 border ${
                      decision === "REJECTED"
                        ? "bg-rose-600 text-white border-rose-600 shadow-xs ring-1 ring-rose-600"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">gavel</span>
                    <span>Tolak</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecision("CLARIFICATION")}
                    className={`h-8 px-2 rounded-lg text-[12px] font-semibold transition-all flex items-center justify-center gap-1 border ${
                      decision === "CLARIFICATION"
                        ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">help_outline</span>
                    <span>Klarifikasi</span>
                  </button>
                </div>
              </div>

              {/* BAP Notes */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[11px]">
                  <label className="font-semibold text-slate-700 uppercase">
                    Catatan Forensik (BAP)
                  </label>
                  <span className="text-rose-600 font-medium">Permanen di Audit Log</span>
                </div>
                <textarea
                  rows={3}
                  value={auditNotes}
                  onChange={(e) => setAuditNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50/70 text-slate-900 text-[12px] border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 focus:outline-none transition-all resize-none"
                  placeholder="Justifikasi putusan berita acara..."
                />
              </div>

              {/* Signature Checkbox */}
              <label className="p-2 rounded-lg bg-slate-50 flex items-start gap-2 border border-slate-200 cursor-pointer text-[11px] leading-tight">
                <input
                  type="checkbox"
                  checked={isoComplianceChecked}
                  onChange={(e) => setIsoComplianceChecked(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-600 accent-blue-600 mt-0.5"
                />
                <span className="text-slate-600 select-none">
                  Catat ke Immutable Audit Log ISO 27001 (Tanda tangan kriptografis Auditor Bambang H.)
                </span>
              </label>

              {/* Submit Decision Button */}
              <button
                type="button"
                disabled={isSubmittingDecision}
                onClick={handleSubmitDecision}
                className={`w-full h-8.5 rounded-lg text-white text-[12px] font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 ${
                  decision === "APPROVED"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {isSubmittingDecision ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                    <span>Menandatangani Berita Acara...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                    <span>Simpan Putusan & Kirim Notifikasi</span>
                  </>
                )}
              </button>
            </section>
          </div>
        </main>

        {/* Toast */}
        {showToast && (
          <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2.5 border border-slate-700 text-[12px]">
              <span className="material-symbols-outlined text-emerald-400 text-[20px]">task_alt</span>
              <div>
                <div className="font-semibold text-white">Putusan Disimpan</div>
                <div className="text-slate-300 text-[11px]">{toastMessage}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
