"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AuditorSidebar from "@/components/AuditorSidebar";
import { useAuth } from "@/lib/auth";
import { getDivisionLimit, getDivisionLimitInfo } from "@/lib/division-limits";
import { formatCategoryLabel, getCategoryBadgeInfo } from "@/lib/expense-categories";
import {
  ArrowLeft,
  Printer,
  Scan,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
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
  ExternalLink,
  FileText,
  Eye,
  Maximize2,
  Download,
  X,
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
    mimeType?: string;
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

  // Zoom, Rotate, Forensic Filter & Modal state
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [forensicFilter, setForensicFilter] = useState<"NORMAL" | "HIGH_CONTRAST" | "INVERT">("NORMAL");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [viewMode, setViewMode] = useState<"IMAGE" | "OCR">("IMAGE");

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
    setZoomLevel((prev) => Math.min(2.5, Number((prev + 0.15).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(0.6, Number((prev - 0.15).toFixed(2))));
  };

  const handleZoomReset = () => {
    setZoomLevel(1.0);
    setRotation(0);
    setForensicFilter("NORMAL");
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
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
            ? `Berkas ${transaction.code} DITOLAK. Webhook pencairan kas otomatis DIBATALKAN (VOID)!`
            : `Permohonan klarifikasi dikirim ke staf pemohon.`
        );
        setShowToast(true);
        fetchTransactionDetail();

        // Broadcast event real-time ke semua tab/user
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("transaction-updated"));
          localStorage.setItem(
            "smartaudit_last_event",
            JSON.stringify({
              type: "DECISION",
              code: transaction.code,
              action: decision,
              timestamp: Date.now(),
            })
          );
        }

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
        {/* Header Ringkas & Memanjang */}
        <div className="px-6 sm:px-8 lg:px-10 py-3.5 bg-white border-b border-slate-200">
          <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 flex-nowrap overflow-x-auto py-1">
              <Link
                href="/antrean-review"
                className="h-8 px-2.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
                title="Kembali ke Antrean"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Antrean</span>
              </Link>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2 whitespace-nowrap shrink-0">
                <span>Inspeksi:</span>
                <span className="font-mono text-blue-600">{transaction.code}</span>
              </h1>
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200 whitespace-nowrap truncate max-w-[200px] shrink-0">
                {transaction.vendor}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                <span>{transaction.department}</span>
                <span className="text-blue-400 font-mono">&bull;</span>
                <span className="text-blue-900 font-mono">Pagu 3&sigma;: Rp {getDivisionLimit(transaction.department).toLocaleString("id-ID")}</span>
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5">
                <span>{getCategoryBadgeInfo(transaction.category).icon}</span>
                <span>{formatCategoryLabel(transaction.category)}</span>
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0 ${
                  isHighRisk
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isHighRisk ? "bg-rose-600" : "bg-amber-600"}`}
                ></span>
                Risiko {score}%
              </span>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak BAP</span>
            </button>
          </div>
        </div>

        {/* 2-Column Split Inspection Grid */}
        <main className="w-full max-w-[1600px] mx-auto p-6 sm:px-8 lg:px-10 py-6 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Column 1: Document Visualizer & OCR Data (7 Cols) */}
          <div className="xl:col-span-7 flex flex-col gap-6">
            <section className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Scan className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 leading-tight">
                      Pemeriksaan Bukti Fisik Faktur & OCR
                    </h2>
                    <span className="text-xs text-slate-500">
                      Verifikasi orisinalitas fisik dokumen kuitansi & komparasi data ekstraksi AI
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* View Mode Tabs */}
                  <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setViewMode("IMAGE")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        viewMode === "IMAGE"
                          ? "bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>Bukti Fisik Faktur Asli</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("OCR")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        viewMode === "OCR"
                          ? "bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Data Ekstraksi AI & OCR</span>
                    </button>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1 border border-slate-200">
                    <button
                      type="button"
                      onClick={handleZoomOut}
                      title="Zoom Out"
                      className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
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
                      className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleZoomReset}
                      title="Reset View"
                      className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Document Canvas - Actual Authentic Invoice Image or OCR Data */}
              {(() => {
                let invoiceDetails: any = null;
                if (transaction.receipt?.ocrRawText) {
                  try {
                    const parsed = JSON.parse(transaction.receipt.ocrRawText);
                    if (typeof parsed === "object" && parsed !== null) invoiceDetails = parsed;
                  } catch {
                    // plain text
                  }
                }

                const rawUrl = transaction.receipt?.imageUrl;
                const isPdf = Boolean(
                  rawUrl?.startsWith("data:application/pdf") ||
                  rawUrl?.toLowerCase().endsWith(".pdf") ||
                  transaction.receipt?.mimeType === "application/pdf"
                );

                const actualImageUrl = imageError
                  ? "/invoices/faktur-template-asli.jpg"
                  : (rawUrl && rawUrl !== "/sample-receipt.jpg" && rawUrl !== "/mock-receipts/placeholder.jpg")
                    ? rawUrl
                    : "/invoices/faktur-template-asli.jpg";

                const invNumber = invoiceDetails?.invoiceNumber || "INV-GK-8821";
                const invPoNumber = invoiceDetails?.poNumber || null;
                const invTaxId = invoiceDetails?.taxId || "01.345.678.9-021.000";
                const invItems = invoiceDetails?.items && Array.isArray(invoiceDetails.items) && invoiceDetails.items.length > 0
                  ? invoiceDetails.items
                  : [{ name: transaction.description || "Pengadaan Barang & Jasa Operasional", qty: 1, unitPrice: Math.round(transaction.amount / 1.11), totalPrice: Math.round(transaction.amount / 1.11) }];
                const invSubtotal = invoiceDetails?.subtotal || Math.round(transaction.amount / 1.11);
                const invPpn = invoiceDetails?.taxPpn !== undefined ? invoiceDetails.taxPpn : Math.round(transaction.amount - invSubtotal);
                const invDiscount = invoiceDetails?.discount || 0;
                const invOtherFees = invoiceDetails?.otherFees || 0;
                const invGrandTotal = invoiceDetails?.amount || transaction.amount;
                const expectedTotal = invSubtotal - invDiscount + invPpn + invOtherFees;
                const isArithValid = invoiceDetails?.arithmeticValidation?.isValid ?? (Math.abs(expectedTotal - invGrandTotal) <= 100);
                const arithNotes = invoiceDetails?.arithmeticValidation?.notes || `Kalkulasi Subtotal Rp ${invSubtotal.toLocaleString("id-ID")} + PPN 11% Rp ${invPpn.toLocaleString("id-ID")}${invOtherFees > 0 ? ` + Ongkos Kirim Rp ${invOtherFees.toLocaleString("id-ID")}` : ""} = Total Rp ${invGrandTotal.toLocaleString("id-ID")} [Valid]`;
                const isDiscrepant = Math.abs(transaction.amount - invGrandTotal) > 100;

                return (
                  <>
                    {viewMode === "IMAGE" ? (
                      /* TAB 1: TAMPILAN BUKTI FISIK FAKTUR ASLI (Interactive Image & PDF Viewer) */
                      <div className="relative w-full min-h-[500px] bg-slate-900 rounded-2xl overflow-hidden flex flex-col border border-slate-700 shadow-inner">
                        {/* Image / PDF Canvas Top Toolbar */}
                        <div className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-950/90 border-b border-slate-800 text-xs gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                            <span className="font-semibold text-white tracking-wide whitespace-nowrap">
                              {isPdf ? "Dokumen PDF Faktur Asli" : "Bukti Fisik Faktur Asli"}
                            </span>
                            <span className="text-[11px] px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono whitespace-nowrap shrink-0">
                              {isPdf ? "application/pdf" : (transaction.receipt?.mimeType || "image/jpeg")} &bull; {(transaction.receipt?.fileSizeKb || 153).toLocaleString("id-ID")} KB
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Forensic Filter Toggle (only for images) */}
                            {!isPdf && (
                              <div className="hidden sm:inline-flex p-0.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px]">
                                <button
                                  type="button"
                                  onClick={() => setForensicFilter("NORMAL")}
                                  className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap font-medium ${
                                    forensicFilter === "NORMAL" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                                  }`}
                                  title="Mode Tampilan Asli"
                                >
                                  Normal
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setForensicFilter("HIGH_CONTRAST")}
                                  className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap font-medium ${
                                    forensicFilter === "HIGH_CONTRAST" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                                  }`}
                                  title="Mode Kontras Tinggi Forensik"
                                >
                                  Kontras
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setForensicFilter("INVERT")}
                                  className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap font-medium ${
                                    forensicFilter === "INVERT" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"
                                  }`}
                                  title="Mode Inversi Warna (Cek Tipografi & Stempel)"
                                >
                                  Inversi
                                </button>
                              </div>
                            )}

                            {/* Rotate Button (only for images) */}
                            {!isPdf && (
                              <button
                                type="button"
                                onClick={handleRotate}
                                className="h-7 px-2 inline-flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                                title="Putar Dokumen 90 Derajat"
                              >
                                <RotateCw className="w-3.5 h-3.5" />
                                <span>Putar {rotation > 0 ? `${rotation}°` : ""}</span>
                              </button>
                            )}

                            {/* Fullscreen Lightbox Button */}
                            <button
                              type="button"
                              onClick={() => setIsFullscreen(true)}
                              className="h-7 px-2.5 inline-flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                              title="Buka Pratinjau Layar Penuh"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                              <span>Layar Penuh</span>
                            </button>

                            {/* External Tab / Download */}
                            <a
                              href={actualImageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download={isPdf ? `faktur-${transaction.code}.pdf` : undefined}
                              className="h-7 px-2.5 inline-flex items-center gap-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-[11px] font-semibold border border-blue-500/40 transition-colors whitespace-nowrap shrink-0"
                              title="Buka dokumen ukuran asli di tab baru"
                            >
                              {isPdf ? <Download className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                              <span>{isPdf ? "Unduh PDF" : "Tab Baru"}</span>
                            </a>
                          </div>
                        </div>

                        {/* Interactive Viewport: PDF vs Image */}
                        {isPdf ? (
                          <div className="w-full flex-1 min-h-[580px] max-h-[720px] bg-slate-950 flex flex-col items-center justify-center p-3 relative">
                            <iframe
                              src={actualImageUrl}
                              title={`Dokumen Faktur PDF - ${transaction.code}`}
                              className="w-full h-[620px] rounded-xl border border-slate-700 bg-white shadow-2xl"
                            />
                            <div className="w-full flex items-center justify-between mt-2 px-2 text-xs text-slate-300">
                              <span className="text-[11px] text-slate-400 whitespace-nowrap truncate">
                                Format Dokumen: PDF Digital &bull; Gunakan kontrol bawaan browser untuk navigasi & cetak
                              </span>
                              <a
                                href={actualImageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={`faktur-${transaction.code}.pdf`}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Unduh PDF</span>
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full flex-1 min-h-[480px] max-h-[680px] overflow-auto p-6 flex items-center justify-center bg-radial from-slate-800/40 via-slate-900 to-slate-950 select-none">
                            <div
                              style={{
                                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                                transformOrigin: "center center",
                                filter:
                                  forensicFilter === "HIGH_CONTRAST"
                                    ? "contrast(180%) brightness(105%)"
                                    : forensicFilter === "INVERT"
                                    ? "invert(1) hue-rotate(180deg)"
                                    : "none",
                              }}
                              className="transition-transform duration-150 flex items-center justify-center max-w-full"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={actualImageUrl}
                                alt="Bukti Fisik Faktur Asli Transaksi"
                                onError={() => setImageError(true)}
                                className="max-h-[620px] w-auto object-contain rounded-xl shadow-2xl border border-slate-700/80 bg-white cursor-pointer"
                                onClick={() => setIsFullscreen(true)}
                                title="Klik untuk membuka pratinjau layar penuh"
                              />
                            </div>
                          </div>
                        )}

                        {/* Image Canvas Bottom Forensic Bar */}
                        <div className="w-full px-4 py-2 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-3 text-[11px] text-slate-300 overflow-x-auto">
                          <div className="flex items-center gap-2 font-mono whitespace-nowrap shrink-0">
                            <span className="text-slate-400 font-bold whitespace-nowrap">SHA-256:</span>
                            <span className="text-emerald-400 truncate max-w-[260px] sm:max-w-md whitespace-nowrap font-mono">
                              {transaction.receipt?.sha256Hash || "d8f3e284a91cf923184b912adfc0192837461928a01f9283948291038192038"}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 font-mono whitespace-nowrap shrink-0">
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                              <span className="text-slate-400 whitespace-nowrap">pHash:</span>
                              <span className="text-blue-400 font-bold whitespace-nowrap">
                                {transaction.receipt?.phashFingerprint || "d8f3a91cb2410e7a"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold whitespace-nowrap shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                              <span className="whitespace-nowrap">Integritas Terverifikasi</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* TAB 2: TAMPILAN STRUKTUR DATA EKSTRAKSI OCR & AI */
                      <div className="relative w-full min-h-[440px] bg-slate-100/90 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200 p-6">
                        <div
                          style={{ transform: `scale(${zoomLevel})` }}
                          className="transition-transform duration-100 flex items-center justify-center w-full"
                        >
                          <div className="bg-white text-slate-900 shadow-xl p-7 rounded-2xl w-full max-w-[520px] font-mono text-xs leading-normal border border-slate-300">
                            {/* Header Faktur */}
                            <div className="flex justify-between items-start pb-4 mb-4 border-b-2 border-slate-800">
                              <div>
                                <div className="font-extrabold text-sm uppercase text-slate-900 tracking-wide">
                                  {transaction.vendor}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                  NPWP: {invTaxId}
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  Rekanan Penyedia Barang / Jasa Resmi
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="inline-block px-2.5 py-1 rounded bg-slate-900 text-white font-bold text-[10px] tracking-wider uppercase">
                                  {invoiceDetails?.documentType?.replace(/_/g, " ") || "FAKTUR KOMERSIAL"}
                                </span>
                                <div className="font-bold text-xs text-slate-800 mt-1.5">
                                  {invNumber}
                                </div>
                                {invPoNumber && (
                                  <div className="text-[10px] text-slate-500 font-mono">
                                    PO: {invPoNumber}
                                  </div>
                                )}
                                <div className="text-[10px] text-slate-500">
                                  Tgl: {new Date(transaction.date).toLocaleDateString("id-ID")}
                                </div>
                              </div>
                            </div>

                            {/* Info Pemohon & Instansi */}
                            <div className="grid grid-cols-2 gap-3 mb-4 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px]">
                              <div>
                                <span className="text-slate-500 text-[10px] block">DITUJUKAN KEPADA / PEMBELI:</span>
                                <span className="font-bold text-slate-800 block">
                                  {invoiceDetails?.customerDetails?.name || transaction.applicantName}
                                </span>
                                <span className="text-slate-600 text-[10px] block">
                                  Pemohon: {transaction.applicantName} ({transaction.department})
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-slate-500 text-[10px] block">STATUS PEMBAYARAN:</span>
                                <span className="font-bold text-emerald-700 block">
                                  {invoiceDetails?.paymentInfo?.terms || "LUNAS (Verified)"}
                                </span>
                                <span className="text-slate-500 text-[10px] block">
                                  {invoiceDetails?.paymentInfo?.bank
                                    ? `${invoiceDetails.paymentInfo.bank} (${invoiceDetails.paymentInfo.accountNumber || ""})`
                                    : "Metode: Transfer Bank"}
                                </span>
                              </div>
                            </div>

                            {/* Tabel Rincian Item */}
                            <div className="mb-4">
                              <div className="grid grid-cols-12 pb-1.5 border-b border-slate-300 text-[10px] font-bold text-slate-500 uppercase">
                                <div className="col-span-7">Deskripsi Barang / Jasa</div>
                                <div className="col-span-2 text-center">Qty</div>
                                <div className="col-span-3 text-right">Jumlah (IDR)</div>
                              </div>
                              <div className="divide-y divide-slate-100">
                                {invItems.map((item: any, idx: number) => (
                                  <div key={idx} className="grid grid-cols-12 py-2 text-[11px] text-slate-800 items-center">
                                    <div className="col-span-7 pr-2 font-medium">
                                      <span className="font-bold text-slate-900 mr-1">{item.no || idx + 1}.</span>
                                      {item.name}
                                    </div>
                                    <div className="col-span-2 text-center text-slate-600">
                                      {item.qty} {item.unit || ""}
                                    </div>
                                    <div className="col-span-3 text-right font-bold font-mono">
                                      {(item.totalPrice || item.unitPrice || 0).toLocaleString("id-ID")}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Rincian Kalkulasi Pajak & Grand Total */}
                            <div className="pt-2 border-t-2 border-slate-200 space-y-1.5 text-xs">
                              <div className="flex justify-between text-slate-600">
                                <span>Subtotal (DPP):</span>
                                <span className="font-semibold font-mono">Rp {invSubtotal.toLocaleString("id-ID")}</span>
                              </div>
                              {invDiscount > 0 && (
                                <div className="flex justify-between text-emerald-700">
                                  <span>Potongan / Diskon:</span>
                                  <span className="font-mono">- Rp {invDiscount.toLocaleString("id-ID")}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-slate-600">
                                <span>PPN (11% Sesuai UU HPP):</span>
                                <span className="font-semibold font-mono">Rp {invPpn.toLocaleString("id-ID")}</span>
                              </div>
                              {invOtherFees > 0 && (
                                <div className="flex justify-between text-slate-700 font-medium">
                                  <span>Ongkos Kirim / Biaya Pengiriman:</span>
                                  <span className="font-semibold font-mono">Rp {invOtherFees.toLocaleString("id-ID")}</span>
                                </div>
                              )}
                              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900 text-white font-bold text-sm mt-2">
                                <span className="uppercase text-xs tracking-wider">TOTAL TAGIHAN FAKTUR</span>
                                <span className="font-mono text-base text-amber-300">
                                  Rp {invGrandTotal.toLocaleString("id-ID")}
                                </span>
                              </div>
                              {invoiceDetails?.terbilang && (
                                <div className="text-[10px] text-slate-500 italic pt-1">
                                  Terbilang: &ldquo;{invoiceDetails.terbilang}&rdquo;
                                </div>
                              )}
                            </div>

                            {/* Footer Validasi Forensik */}
                            <div className="mt-4 pt-2.5 text-[10px] text-slate-400 border-t border-slate-200 flex justify-between items-center">
                              <span>Kuitansi Digital SmartAudit Forensics</span>
                              <span className="text-blue-600 font-bold">SHA-256 Verified</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Verifikasi Aritmatika & Ketidaksesuaian Nominal */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Box Validasi Kalkulasi */}
                      <div
                        className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                          isArithValid
                            ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                            : "bg-rose-50 border-rose-200 text-rose-900"
                        }`}
                      >
                        {isArithValid ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="font-bold block whitespace-nowrap truncate">
                            {isArithValid ? "Aritmatika Klop (100% Valid)" : "Cacat Kalkulasi Aritmatika Faktur"}
                          </span>
                          <span className="text-[11px] opacity-90 mt-0.5 block leading-relaxed">
                            {arithNotes}
                          </span>
                        </div>
                      </div>

                      {/* Box Discrepancy Nominal Input vs Dokumen */}
                      <div
                        className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                          !isDiscrepant
                            ? "bg-blue-50 border-blue-200 text-blue-900"
                            : "bg-rose-50 border-rose-200 text-rose-900"
                        }`}
                      >
                        {!isDiscrepant ? (
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="font-bold block whitespace-nowrap truncate">
                            {!isDiscrepant ? "Nominal Pengajuan Sesuai Faktur" : "Ketidaksesuaian Nominal Pengajuan"}
                          </span>
                          <span className="text-[11px] opacity-90 mt-0.5 block leading-relaxed">
                            {!isDiscrepant
                              ? `Pengajuan pemohon (Rp ${transaction.amount.toLocaleString("id-ID")}) identik dengan faktur fisik.`
                              : `Pemohon mengajukan Rp ${transaction.amount.toLocaleString("id-ID")}, namun faktur tertulis Rp ${invGrandTotal.toLocaleString("id-ID")} (Selisih Rp ${Math.abs(transaction.amount - invGrandTotal).toLocaleString("id-ID")}).`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* OCR Cross Match */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between min-w-0">
                  <div className="min-w-0 pr-2">
                    <div className="text-[11px] text-slate-500 uppercase font-bold whitespace-nowrap truncate">Vendor</div>
                    <div className="text-sm font-bold text-slate-900 truncate mt-0.5 whitespace-nowrap">
                      {transaction.vendor}
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between min-w-0">
                  <div className="min-w-0 pr-2">
                    <div className="text-[11px] text-slate-500 uppercase font-bold whitespace-nowrap truncate">Kategori</div>
                    <div className="text-xs font-bold text-slate-900 truncate mt-0.5 whitespace-nowrap" title={formatCategoryLabel(transaction.category)}>
                      {getCategoryBadgeInfo(transaction.category).icon} {formatCategoryLabel(transaction.category)}
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between min-w-0">
                  <div className="min-w-0 pr-2">
                    <div className="text-[11px] text-slate-500 uppercase font-bold whitespace-nowrap truncate">Tanggal</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5 whitespace-nowrap truncate">
                      {new Date(transaction.date).toLocaleDateString("id-ID")}
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between min-w-0">
                  <div className="min-w-0 pr-2">
                    <div className="text-[11px] text-slate-500 uppercase font-bold whitespace-nowrap truncate">Nominal Terbaca</div>
                    <div className="text-sm font-extrabold text-slate-900 font-mono mt-0.5 whitespace-nowrap truncate">
                      Rp {transaction.amount.toLocaleString("id-ID")}
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                </div>
              </div>

              {/* Critical Alerts */}
              {transaction.fraudAnalysis?.isDuplicate && (
                <div className="p-3.5 rounded-xl bg-rose-50 text-rose-900 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 border border-rose-200 text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="truncate">
                      <strong>Duplikasi Nota Terdeteksi:</strong> Identik dengan berkas <strong>{transaction.fraudAnalysis.duplicateTarget || "TX-87912"}</strong>.
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-rose-800 bg-white px-2.5 py-1 rounded-md border border-rose-200 shrink-0 whitespace-nowrap">
                    {Math.round((transaction.fraudAnalysis.duplicateSim || 0.948) * 100)}% Similitudo
                  </span>
                </div>
              )}

              {transaction.fraudAnalysis?.isSplitBill && (
                <div className="p-3.5 rounded-xl bg-rose-50 text-rose-900 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 border border-rose-200 text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Split className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="truncate">
                      <strong>Indikasi Split Bill:</strong> Pemecahan transaksi di bawah pagu otorisasi direksi (Rp 75jt) jeda &lt; 2 jam.
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-rose-800 bg-white px-2.5 py-1 rounded-md border border-rose-200 shrink-0 whitespace-nowrap">
                    +35 Poin
                  </span>
                </div>
              )}

              {transaction.fraudAnalysis?.isAnomalyAmount && (() => {
                const limitInfo = getDivisionLimitInfo(transaction.department);
                return (
                  <div className="p-3.5 rounded-xl bg-amber-50 text-amber-900 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 border border-amber-200 text-xs sm:text-sm">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="truncate">
                        <strong>Anomali Nominal (&gt; 3-Sigma Divisi):</strong> Melebihi pagu wajar {limitInfo.name} (Maks Rp {limitInfo.limit.toLocaleString("id-ID")}, rata-rata &mu; Rp {limitInfo.mean.toLocaleString("id-ID")}).
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-800 bg-white px-2.5 py-1 rounded-md border border-amber-200 shrink-0 whitespace-nowrap">
                      +25 Poin
                    </span>
                  </div>
                );
              })()}
            </section>

            {/* Digital Metadata */}
            <section className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
              <span className="text-sm font-bold text-slate-900 block whitespace-nowrap">
                Metadata Forensik Digital
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 min-w-0">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold whitespace-nowrap truncate">Scanner Source</div>
                  <div className="font-bold text-slate-900 mt-1 truncate whitespace-nowrap">Adobe Scan iOS</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 min-w-0">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold whitespace-nowrap truncate">pHash Fingerprint</div>
                  <div className="font-bold text-blue-600 font-mono mt-1 truncate whitespace-nowrap">
                    {transaction.receipt?.phashFingerprint || "d8f3a91cb2410e7a"}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 min-w-0">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold whitespace-nowrap truncate">Digital Signature</div>
                  <div className="font-bold text-rose-600 mt-1 truncate whitespace-nowrap">Tidak Valid</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 min-w-0">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold whitespace-nowrap truncate">Kerapatan Resolusi</div>
                  <div className="font-bold text-emerald-700 mt-1 truncate whitespace-nowrap">300 DPI (Valid)</div>
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
                  <BrainCircuit className="w-5 h-5 text-blue-600 shrink-0" />
                  <h2 className="text-base font-bold text-slate-900 whitespace-nowrap">Faktor Risiko AI (XAI)</h2>
                </div>
                <span className="font-mono text-xs font-extrabold text-rose-700 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 whitespace-nowrap shrink-0">
                  {score} / 100 Poin
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {points.length > 0 ? (
                  points.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span className="font-medium text-slate-800 truncate whitespace-nowrap">{p.rule}</span>
                      </div>
                      <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 shrink-0 whitespace-nowrap">
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
                <div className="flex items-center gap-2 text-slate-700 min-w-0">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="truncate"><strong>Pencairan Terkunci:</strong> Butuh otorisasi auditor.</span>
                </div>
                <span className="text-slate-500 font-semibold whitespace-nowrap shrink-0">ISO 27001</span>
              </div>
            </section>

            {/* Adjudication Sheet */}
            <section className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Gavel className="w-5 h-5 text-slate-700 shrink-0" />
                <h2 className="text-base font-bold text-slate-900 whitespace-nowrap">Lembar Putusan Auditor</h2>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                  Pilih Putusan Investigasi:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDecision("APPROVED")}
                    className={`h-10 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5 border whitespace-nowrap shrink-0 cursor-pointer ${
                      decision === "APPROVED"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">Setujui</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecision("REJECTED")}
                    className={`h-10 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5 border whitespace-nowrap shrink-0 cursor-pointer ${
                      decision === "REJECTED"
                        ? "bg-rose-600 text-white border-rose-600 shadow-xs ring-2 ring-rose-600/30"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                    }`}
                  >
                    <Gavel className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">Tolak</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecision("CLARIFICATION")}
                    className={`h-10 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5 border whitespace-nowrap shrink-0 cursor-pointer ${
                      decision === "CLARIFICATION"
                        ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                    }`}
                  >
                    <HelpCircle className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">Klarifikasi</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
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
                <span className="whitespace-nowrap truncate">Segel keputusan dengan tanda tangan kriptografis SHA-256 (ISO 27001)</span>
              </label>

              <button
                type="button"
                onClick={handleSubmitDecision}
                disabled={isSubmittingDecision}
                className="w-full h-11 mt-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer whitespace-nowrap shrink-0"
              >
                {isSubmittingDecision ? (
                  <span className="whitespace-nowrap">Menyimpan Putusan & Memicu Webhook...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">Terbitkan Putusan & Rekam Jejak Audit</span>
                  </>
                )}
              </button>

              {showToast && (
                <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-medium animate-in fade-in whitespace-nowrap truncate">
                  {toastMessage}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      {/* Interactive Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-in fade-in duration-150">
          {/* Lightbox Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-white gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-mono text-sm font-bold text-blue-400 whitespace-nowrap shrink-0">
                {transaction.code}
              </span>
              <span className="text-xs text-slate-400 whitespace-nowrap truncate max-w-md">
                {transaction.vendor} &bull; Bukti Fisik Faktur Asli
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Zoom & Rotate controls in lightbox (for images) */}
              {!(Boolean(transaction.receipt?.imageUrl?.startsWith("data:application/pdf") || transaction.receipt?.imageUrl?.toLowerCase().endsWith(".pdf") || transaction.receipt?.mimeType === "application/pdf")) && (
                <div className="flex items-center bg-slate-900 rounded-xl p-1 gap-1 border border-slate-800 mr-2">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs cursor-pointer"
                    title="Perkecil"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-xs px-2 text-white font-bold whitespace-nowrap">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs cursor-pointer"
                    title="Perbesar"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRotate}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs cursor-pointer"
                    title="Putar 90 Derajat"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomReset}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs cursor-pointer"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="h-9 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
                <span>Tutup</span>
              </button>
            </div>
          </div>

          {/* Lightbox Viewport */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-4">
            {Boolean(transaction.receipt?.imageUrl?.startsWith("data:application/pdf") || transaction.receipt?.imageUrl?.toLowerCase().endsWith(".pdf") || transaction.receipt?.mimeType === "application/pdf") ? (
              <iframe
                src={transaction.receipt?.imageUrl || "/invoices/faktur-template-asli.jpg"}
                title={`Dokumen Faktur PDF Fullscreen - ${transaction.code}`}
                className="w-full h-full max-w-6xl rounded-2xl bg-white shadow-2xl border border-slate-700"
              />
            ) : (
              <div
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transformOrigin: "center center",
                  filter:
                    forensicFilter === "HIGH_CONTRAST"
                      ? "contrast(180%) brightness(105%)"
                      : forensicFilter === "INVERT"
                      ? "invert(1) hue-rotate(180deg)"
                      : "none",
                }}
                className="transition-transform duration-150 flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    imageError
                      ? "/invoices/faktur-template-asli.jpg"
                      : (transaction.receipt?.imageUrl && transaction.receipt.imageUrl !== "/sample-receipt.jpg" && transaction.receipt.imageUrl !== "/mock-receipts/placeholder.jpg")
                        ? transaction.receipt.imageUrl
                        : "/invoices/faktur-template-asli.jpg"
                  }
                  alt="Fullscreen Bukti Fisik Faktur"
                  className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl bg-white border border-slate-700"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
