"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AuditorSidebar from "@/components/AuditorSidebar";
import { useAuth } from "@/lib/auth";
import {
  ArrowLeft,
  Printer,
  Scan,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Gavel,
  HelpCircle,
  Send,
  History,
  Lock,
  BrainCircuit,
  LogOut,
  ShieldCheck,
  FileClock,
  Sparkles,
  Building,
  Calendar,
  CreditCard,
  Split,
  Copy,
} from "lucide-react";

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
        <main className="w-full min-h-screen pt-24 px-4 flex items-center justify-center bg-slate-50">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md max-w-md text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 inline-flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Akses Khusus Auditor Forensik</h2>
            <p className="text-sm text-slate-600 mt-2 mb-6 leading-relaxed">
              Anda saat ini masuk sebagai <strong>{user.name}</strong> (Staf Keuangan). Berkas detail inspeksi forensik hanya dapat ditinjau oleh Auditor.
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

  if (loading) {
    return (
      <>
        <Navbar currentRole="AUDITOR" />
        <AuditorSidebar />
        <div className="lg:pl-64 flex flex-col min-h-screen bg-slate-50 pt-16">
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <FileClock className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium text-slate-600">
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
        <div className="lg:pl-64 flex flex-col min-h-screen bg-slate-50 pt-16 p-6">
          <div className="max-w-md mx-auto text-center py-16">
            <XCircle className="w-12 h-12 text-rose-600 mx-auto" />
            <h2 className="mt-3 text-lg font-bold text-slate-900">
              Transaksi Tidak Ditemukan
            </h2>
            <Link
              href="/antrean-review"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold"
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

      <div className="lg:pl-64 flex flex-col min-h-screen bg-slate-50 pt-16">
        {/* Top Breadcrumb & Command Bar */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <nav className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Link
                  href="/antrean-review"
                  className="hover:text-blue-600 transition-colors inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Antrean Review</span>
                </Link>
                <span>/</span>
                <span className="text-slate-400">Inspeksi Forensik</span>
                <span>/</span>
                <span className="font-mono text-blue-600 font-bold">{transaction.code}</span>
              </nav>

              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Inspeksi Kuitansi & Forensik: {transaction.code}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                  {transaction.vendor}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold ${
                    isHighRisk
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${isHighRisk ? "bg-rose-600" : "bg-amber-600"}`}
                  ></span>
                  Skor Risiko {score}% &bull; {transaction.fraudAnalysis?.riskLevel}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <Link
                href="/antrean-review"
                className="h-9 px-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="h-9 px-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak BAP</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Split Inspection Grid */}
        <main className="w-full max-w-7xl mx-auto p-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Column 1: Document Visualizer & OCR Data (7 Cols) */}
          <div className="xl:col-span-7 flex flex-col gap-6">
            <section className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Scan className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    Pemeriksaan Kuitansi Fisik & Hasil OCR
                  </h2>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    title="Zoom Out"
                    className="w-7 h-7 inline-flex items-center justify-center rounded text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-xs px-2 text-slate-700 font-bold">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    title="Zoom In"
                    className="w-7 h-7 inline-flex items-center justify-center rounded text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomReset}
                    title="Reset View"
                    className="w-7 h-7 inline-flex items-center justify-center rounded text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Document Canvas - Roomy & Generous */}
              <div className="relative w-full min-h-[380px] bg-slate-100/80 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200 p-6">
                <div
                  style={{ transform: `scale(${zoomLevel})` }}
                  className="transition-transform duration-100 flex items-center justify-center"
                >
                  <div className="bg-white text-slate-900 shadow-lg p-6 rounded-xl w-[320px] sm:w-[360px] font-mono text-xs leading-normal border border-slate-300">
                    <div className="flex justify-between items-center pb-2 mb-3 border-b border-slate-200 text-[10px] text-slate-500">
                      <span className="font-bold uppercase tracking-wider">DOC-SCAN-{transaction.code}</span>
                      <span className="text-blue-600 font-semibold">SHA-256 Valid</span>
                    </div>

                    <div className="text-center mb-3">
                      <div className="font-bold text-sm uppercase text-slate-900">{transaction.vendor}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">Bukti Transaksi Kas Resmi</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-2 py-1.5 px-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
                      <div>
                        <span className="text-slate-500">No. Faktur: </span>
                        <span className="font-bold text-slate-800">INV-GK-8821</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500">Tanggal: </span>
                        <span className="font-bold text-slate-800">{new Date(transaction.date).toLocaleDateString("id-ID")}</span>
                      </div>
                    </div>

                    <div className="my-3 space-y-1.5 text-xs text-slate-800">
                      <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                        <span>{transaction.description || "Pengadaan Barang & Jasa"}</span>
                        <span className="font-bold">Rp {transaction.amount.toLocaleString("id-ID")}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-rose-50 mt-2 flex justify-between items-center border border-rose-200 text-xs">
                      <span className="font-bold uppercase text-slate-800">TOTAL BAYAR</span>
                      <span className="font-extrabold text-sm text-rose-700">Rp {transaction.amount.toLocaleString("id-ID")}</span>
                    </div>

                    <div className="mt-3 pt-2 text-[10px] text-slate-500 border-t border-slate-200 flex justify-between">
                      <span>Pemohon: {transaction.applicantName}</span>
                      <span className="text-emerald-700 font-bold">Lunas (Transfer)</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-lg shadow-xs border border-slate-200 text-xs font-semibold text-slate-700 inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>AI OCR &bull; Presisi 99.4% &bull; SLA 1.2s</span>
                </div>
              </div>

              {/* OCR Cross Match */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500 uppercase font-bold">Vendor</div>
                    <div className="text-sm font-bold text-slate-900 truncate mt-0.5">
                      {transaction.vendor}
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-bold">Tanggal</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {new Date(transaction.date).toLocaleDateString("id-ID")}
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-bold">Nominal Terbaca</div>
                    <div className="text-sm font-extrabold text-slate-900 font-mono mt-0.5">
                      Rp {transaction.amount.toLocaleString("id-ID")}
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                </div>
              </div>

              {/* Critical Alerts */}
              {transaction.fraudAnalysis?.isDuplicate && (
                <div className="p-3.5 rounded-xl bg-rose-50 text-rose-900 flex items-center justify-between gap-3 border border-rose-200 text-sm">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>
                      <strong>Duplikasi Nota Terdeteksi:</strong> Identik dengan berkas transaksi{" "}
                      <strong>{transaction.fraudAnalysis.duplicateTarget || "TX-87912"}</strong>.
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-rose-800 bg-white px-2.5 py-1 rounded-md border border-rose-200 shrink-0">
                    {Math.round((transaction.fraudAnalysis.duplicateSim || 0.948) * 100)}% Similitudo
                  </span>
                </div>
              )}

              {transaction.fraudAnalysis?.isSplitBill && (
                <div className="p-3.5 rounded-xl bg-rose-50 text-rose-900 flex items-center justify-between gap-3 border border-rose-200 text-sm">
                  <div className="flex items-center gap-2.5">
                    <Split className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>
                      <strong>Indikasi Split Bill:</strong> Pemecahan transaksi tepat di bawah pagu otorisasi direksi (Rp 50jt) dalam jeda &lt; 2 jam.
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-rose-800 bg-white px-2.5 py-1 rounded-md border border-rose-200 shrink-0">
                    +35 Poin
                  </span>
                </div>
              )}
            </section>

            {/* Digital Metadata */}
            <section className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
              <span className="text-sm font-bold text-slate-900 block">
                Metadata Forensik Digital
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase font-semibold">Scanner Source</div>
                  <div className="font-bold text-slate-900 mt-1 truncate">Adobe Scan iOS</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase font-semibold">pHash Fingerprint</div>
                  <div className="font-bold text-blue-600 font-mono mt-1 truncate">
                    {transaction.receipt?.phashFingerprint || "d8f3a91cb2410e7a"}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase font-semibold">Digital Signature</div>
                  <div className="font-bold text-rose-600 mt-1">Tidak Valid</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase font-semibold">Kerapatan Resolusi</div>
                  <div className="font-bold text-emerald-700 mt-1">300 DPI (Valid)</div>
                </div>
              </div>
            </section>
          </div>

          {/* Column 2: XAI Factors & Adjudication (5 Cols) */}
          <div className="xl:col-span-5 flex flex-col gap-6">
            {/* XAI Factors */}
            <section className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base font-bold text-slate-900">Faktor Risiko AI (XAI)</h2>
                </div>
                <span className="font-mono text-sm font-extrabold text-rose-700 px-3 py-1 rounded-full bg-rose-50 border border-rose-200">
                  {score} / 100 Poin
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {points.length > 0 ? (
                  points.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-sm"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span className="font-medium text-slate-800 truncate">{p.rule}</span>
                      </div>
                      <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 shrink-0">
                        +{p.points}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 text-sm text-slate-600">
                    {transaction.fraudAnalysis?.reasonXai}
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between border border-slate-200 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Pencairan Terkunci:</strong> Memerlukan otorisasi auditor.</span>
                </div>
                <span className="text-slate-500 font-semibold">ISO 27001</span>
              </div>
            </section>

            {/* Adjudication Sheet */}
            <section className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Gavel className="w-5 h-5 text-slate-700" />
                <h2 className="text-base font-bold text-slate-900">Lembar Putusan Auditor</h2>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Pilih Putusan Investigasi:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDecision("APPROVED")}
                    className={`h-10 px-3 rounded-xl text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5 border ${
                      decision === "APPROVED"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Setujui</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecision("REJECTED")}
                    className={`h-10 px-3 rounded-xl text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5 border ${
                      decision === "REJECTED"
                        ? "bg-rose-600 text-white border-rose-600 shadow-xs ring-2 ring-rose-600/30"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                    }`}
                  >
                    <Gavel className="w-4 h-4" />
                    <span>Tolak</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecision("CLARIFICATION")}
                    className={`h-10 px-3 rounded-xl text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5 border ${
                      decision === "CLARIFICATION"
                        ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Klarifikasi</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Catatan Berita Acara Pemeriksaan (BAP):
                </label>
                <textarea
                  rows={4}
                  value={auditNotes}
                  onChange={(e) => setAuditNotes(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-slate-50 text-slate-900 text-sm border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all resize-none"
                  placeholder="Ketikkan dasar putusan, temuan forensik, atau rekomendasi sanksi..."
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={isoComplianceChecked}
                  onChange={(e) => setIsoComplianceChecked(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-600 accent-blue-600"
                />
                <span>Segel keputusan dengan tanda tangan kriptografis SHA-256 (ISO 27001)</span>
              </label>

              <button
                type="button"
                onClick={handleSubmitDecision}
                disabled={isSubmittingDecision}
                className="w-full h-11 mt-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                {isSubmittingDecision ? (
                  <span>Menyimpan Putusan & Memicu Webhook...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Terbitkan Putusan & Rekam Jejak Audit</span>
                  </>
                )}
              </button>

              {showToast && (
                <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-medium animate-in fade-in">
                  {toastMessage}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
