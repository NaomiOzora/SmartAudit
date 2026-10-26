"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AuditorSidebar from "@/components/AuditorSidebar";

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

  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Zoom Visualizer state
  const [zoomLevel, setZoomLevel] = useState(1.0);

  // Putusan Auditor state
  const [decision, setDecision] = useState<"APPROVED" | "REJECTED" | "CLARIFICATION">("REJECTED");
  const [auditNotes, setAuditNotes] = useState(
    "Kuitansi terindikasi salinan berkas lama (#INV-GK-8821). Eskalasi ke Komite Etik & Satuan Pengawas Intern (SPI) untuk pembekuan vendor."
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
    if (zoomLevel < 1.6) setZoomLevel((prev) => Math.min(1.6, Number((prev + 0.15).toFixed(2))));
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.7) setZoomLevel((prev) => Math.max(0.7, Number((prev - 0.15).toFixed(2))));
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
          auditorName: "Bambang H. (Auditor Forensik)",
        }),
      });

      const json = await res.json();
      if (json.success) {
        setToastMessage(
          decision === "APPROVED"
            ? `Berkas ${transaction.code} disetujui. Webhook pencairan kas berhasil ditrigger ke ERP!`
            : decision === "REJECTED"
            ? `Berkas ${transaction.code} ditolak dan dieskalasi ke Komite Etik & SPI.`
            : `Permohonan klarifikasi telah diteruskan ke staf pemohon.`
        );
        setShowToast(true);

        // Perbarui data lokal
        fetchTransactionDetail();

        setTimeout(() => {
          setShowToast(false);
        }, 4000);
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

  if (loading) {
    return (
      <>
        <Navbar currentRole="AUDITOR" />
        <AuditorSidebar />
        <div className="lg:pl-64 flex flex-col min-h-screen bg-surface pt-16">
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-[36px] animate-spin text-primary">
                sync
              </span>
              <p className="font-semibold text-body-md">
                Memuat berkas forensik dan visualisasi kuitansi...
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
        <div className="lg:pl-64 flex flex-col min-h-screen bg-surface pt-16 p-8">
          <div className="max-w-md mx-auto text-center py-16">
            <span className="material-symbols-outlined text-[48px] text-tertiary">error</span>
            <h2 className="mt-4 font-headline-md text-headline-md font-bold">
              Transaksi Tidak Ditemukan
            </h2>
            <p className="mt-2 text-body-md text-on-surface-variant">
              ID atau kode berkas &quot;{id}&quot; tidak terdaftar di sistem.
            </p>
            <Link
              href="/antrean-review"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold"
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

      <div className="lg:pl-64 flex flex-col min-h-screen bg-surface pt-16">
        {/* Top Command Context Bar */}
        <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4 bg-surface-container-low shadow-sm border-b border-surface-container">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <nav className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant mb-1">
                <Link
                  href="/antrean-review"
                  className="hover:text-primary transition-colors flex items-center gap-1 font-semibold"
                >
                  <span className="material-symbols-outlined text-[15px]">arrow_back</span>
                  Antrean Review
                </Link>
                <span>/</span>
                <span className="text-on-surface-variant">Detail Inspeksi OCR</span>
                <span>/</span>
                <span className="font-data-mono text-primary font-bold">{transaction.code}</span>
              </nav>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface text-[22px] tracking-tight">
                  Detail Inspeksi OCR & Forensik: {transaction.code}
                </h1>
                <span className="font-label-md text-label-md px-3 py-1 rounded-xl bg-surface-container-high text-on-surface-variant font-medium">
                  {transaction.vendor}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-label-sm font-bold ${
                    isHighRisk
                      ? "bg-error-container text-tertiary"
                      : "bg-secondary-fixed text-on-secondary-fixed-variant"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      isHighRisk ? "bg-tertiary" : "bg-secondary"
                    }`}
                  ></span>
                  Skor Risiko ({score}%) - {transaction.fraudAnalysis?.riskLevel || "HIGH"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/antrean-review"
                className="h-9 px-3.5 flex items-center gap-1.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">keyboard_backspace</span>
                <span>Antrean Review</span>
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="h-9 px-4 flex items-center gap-1.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-colors font-label-md text-label-md shadow-sm font-semibold"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Cetak Berita Acara</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content 2-Column Split Inspection Grid */}
        <main className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* COLUMN 1: Visual Evidences, OCR Mapping & Forensic Telemetry (7 Cols) */}
          <div className="xl:col-span-7 flex flex-col gap-6">
            {/* Card: Berkas Fisik & Hasil OCR */}
            <section className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex flex-col gap-5 border border-outline-variant/30">
              {/* Header with Zoom Controls */}
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">document_scanner</span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface text-[16px]">
                    Pemeriksaan Kuitansi Fisik & Hasil OCR
                  </h2>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center bg-surface-container-low rounded-xl p-0.5 gap-1 border border-outline-variant/30">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    title="Zoom Out"
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">remove</span>
                  </button>
                  <span className="font-data-mono text-[12px] px-2 text-on-surface font-bold">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    title="Zoom In"
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomReset}
                    title="Reset View"
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                  </button>
                </div>
              </div>

              {/* Receipt Visualizer Canvas */}
              <div className="relative w-full min-h-[380px] bg-surface-container-low rounded-xl overflow-hidden flex items-center justify-center border border-outline-variant/40 p-4">
                <div
                  style={{ transform: `scale(${zoomLevel})` }}
                  className="relative transition-transform duration-150 ease-out flex items-center justify-center p-2"
                >
                  {/* Physical Document Mockup Render */}
                  <div className="bg-surface-container-lowest text-on-surface shadow-lg p-5 rounded-xl w-[330px] sm:w-[380px] font-data-mono text-[11px] leading-tight border border-outline-variant/40">
                    <div className="flex justify-between items-center pb-2 mb-3 border-b border-outline-variant/40 text-[10px] text-on-surface-variant">
                      <span className="font-bold uppercase tracking-wider">
                        DOC-SCAN-{transaction.code}
                      </span>
                      <span className="text-primary truncate max-w-[150px]">
                        SHA-256: {transaction.receipt?.sha256Hash?.slice(0, 10)}...
                      </span>
                    </div>

                    <div className="text-center mb-3">
                      <div className="font-bold text-[14px] text-on-surface uppercase">
                        {transaction.vendor}
                      </div>
                      <div className="text-on-surface-variant text-[10px] mt-0.5">
                        Bukti Pembayaran Pengeluaran Kas Resmi
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-2 py-1.5 px-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-[10px]">
                      <div>
                        <span className="text-on-surface-variant">No. Faktur: </span>
                        <span className="font-bold text-on-surface">INV-GK-8821</span>
                      </div>
                      <div className="text-right">
                        <span className="text-on-surface-variant">Tanggal: </span>
                        <span className="font-bold text-on-surface">
                          {new Date(transaction.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="my-3 space-y-1.5 text-on-surface text-[11px]">
                      <div className="flex justify-between py-0.5 border-b border-dashed border-outline-variant/30">
                        <span>{transaction.description || "Pengadaan Perangkat & Jasa Operasional"}</span>
                        <span className="font-semibold">
                          Rp {transaction.amount.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-tertiary/10 mt-2 flex justify-between items-center border border-tertiary/30">
                      <span className="font-bold text-[11px] uppercase text-on-surface">
                        TOTAL PEMBAYARAN
                      </span>
                      <span className="font-bold text-[14px] text-tertiary">
                        Rp {transaction.amount.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 text-[10px] text-on-surface-variant border-t border-outline-variant/30 flex justify-between items-center">
                      <span>Pemohon: {transaction.applicantName}</span>
                      <span className="text-secondary font-bold">Lunas (Transfer Bank)</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 bg-surface-container-lowest/90 backdrop-blur px-3 py-1 rounded-full shadow-sm border border-outline-variant/30 flex items-center gap-1.5 text-[11px] font-medium text-on-surface">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span>AI Vision OCR &bull; Akurasi 99.4% &bull; SLA 1.2s</span>
                </div>
              </div>

              {/* OCR Cross-Verification Data Field Match */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
                  <div>
                    <div className="font-label-sm text-[10px] text-on-surface-variant uppercase font-semibold">
                      Identitas Vendor
                    </div>
                    <div className="font-headline-sm text-[13px] font-bold text-on-surface mt-0.5 truncate">
                      {transaction.vendor}
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                    check_circle
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
                  <div>
                    <div className="font-label-sm text-[10px] text-on-surface-variant uppercase font-semibold">
                      Tanggal Nota
                    </div>
                    <div className="font-headline-sm text-[13px] font-bold text-on-surface mt-0.5">
                      {new Date(transaction.date).toLocaleDateString("id-ID")}
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                    check_circle
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
                  <div>
                    <div className="font-label-sm text-[10px] text-on-surface-variant uppercase font-semibold">
                      Nominal Terbaca
                    </div>
                    <div className="font-headline-sm text-[13px] font-bold text-on-surface mt-0.5 font-data-mono">
                      Rp {transaction.amount.toLocaleString("id-ID")}
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                    check_circle
                  </span>
                </div>
              </div>

              {/* Critical Alert if duplicate or split bill */}
              {transaction.fraudAnalysis?.isDuplicate && (
                <div className="p-3.5 rounded-xl bg-error-container text-on-error-container flex items-center justify-between gap-3 border border-tertiary/20">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-tertiary text-[22px] shrink-0">
                      warning
                    </span>
                    <span className="font-body-sm text-body-sm text-on-tertiary-fixed-variant">
                      <strong className="text-tertiary font-bold">Duplikasi Terdeteksi:</strong>{" "}
                      Struktur grafis nota identik dengan transaksi{" "}
                      <strong>{transaction.fraudAnalysis.duplicateTarget || "TX-87912"}</strong>.
                    </span>
                  </div>
                  <span className="font-data-mono text-[11px] font-bold text-tertiary shrink-0 px-2.5 py-1 bg-surface-container-lowest rounded-lg shadow-sm">
                    {Math.round((transaction.fraudAnalysis.duplicateSim || 0.948) * 100)}% Similitudo
                  </span>
                </div>
              )}

              {transaction.fraudAnalysis?.isSplitBill && (
                <div className="p-3.5 rounded-xl bg-error-container text-on-error-container flex items-center justify-between gap-3 border border-tertiary/20">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-tertiary text-[22px] shrink-0">
                      call_split
                    </span>
                    <span className="font-body-sm text-body-sm text-on-tertiary-fixed-variant">
                      <strong className="text-tertiary font-bold">Indikasi Split Bill:</strong>{" "}
                      Pengajuan berturut-turut bernilai tepat di bawah pagu otorisasi direksi (Rp 50jt) dalam rentang &lt; 2 jam.
                    </span>
                  </div>
                  <span className="font-data-mono text-[11px] font-bold text-tertiary shrink-0 px-2.5 py-1 bg-surface-container-lowest rounded-lg shadow-sm">
                    +35 Poin
                  </span>
                </div>
              )}
            </section>

            {/* Digital Forensic Metadata */}
            <section className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 border border-outline-variant/30 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <span className="font-headline-sm text-[15px] font-bold text-on-surface">
                  Data Forensik Berkas Digital
                </span>
                <span className="font-data-mono text-label-sm text-on-surface-variant">
                  JPEG &bull; {transaction.receipt?.fileSizeKb || 1840} KB &bull; 3024&times;4032 px
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-on-surface">
                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <div className="font-label-sm text-[10px] text-on-surface-variant uppercase font-semibold">
                    Software Scanner
                  </div>
                  <div className="font-data-mono text-body-sm font-semibold mt-0.5 truncate">
                    Adobe Scan iOS
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <div className="font-label-sm text-[10px] text-on-surface-variant uppercase font-semibold">
                    pHash Fingerprint
                  </div>
                  <div className="font-data-mono text-body-sm font-semibold mt-0.5 truncate text-primary">
                    {transaction.receipt?.phashFingerprint || "d8f3a91cb2410e7a"}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <div className="font-label-sm text-[10px] text-on-surface-variant uppercase font-semibold">
                    Digital Signature
                  </div>
                  <div className="font-data-mono text-body-sm text-tertiary font-bold mt-0.5 truncate flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">cancel</span>
                    Tidak Valid
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <div className="font-label-sm text-[10px] text-on-surface-variant uppercase font-semibold">
                    Kerapatan Pixel
                  </div>
                  <div className="font-data-mono text-body-sm text-secondary font-bold mt-0.5 truncate flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    300 DPI (Valid)
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* COLUMN 2: Explainable AI Breakdown & Auditor Adjudication Panel (5 Cols) */}
          <div className="xl:col-span-5 flex flex-col gap-6">
            {/* Card: Explainable AI (XAI) Risk Factors */}
            <section className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex flex-col gap-5 border border-outline-variant/30">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface text-[16px]">
                    Faktor Risiko & AI (XAI)
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                    Skor:
                  </span>
                  <span className="font-data-mono text-headline-sm font-bold text-tertiary px-3 py-1 rounded-xl bg-error-container">
                    {score} / 100
                  </span>
                </div>
              </div>

              {/* Point Breakdown Rows */}
              <div className="flex flex-col gap-2.5">
                {points.length > 0 ? (
                  points.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0">
                          {p.category === "SPLIT_BILL"
                            ? "call_split"
                            : p.category === "DUPLICATION"
                            ? "file_copy"
                            : p.category === "OFF_HOURS"
                            ? "schedule"
                            : "report"}
                        </span>
                        <span className="font-body-md font-semibold text-on-surface truncate text-[13px]">
                          {p.rule}
                        </span>
                      </div>
                      <span className="font-data-mono font-bold text-label-sm px-2.5 py-1 rounded-lg bg-tertiary text-on-tertiary shrink-0">
                        +{p.points} Poin
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-xl bg-surface-container-low text-body-sm text-on-surface-variant">
                    {transaction.fraudAnalysis?.reasonXai}
                  </div>
                )}
              </div>

              {/* Ring status warning */}
              <div className="p-3.5 rounded-xl bg-surface-container-high/40 flex items-center justify-between border border-outline-variant/30">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-tertiary text-[20px]">lock</span>
                  <div className="font-body-sm text-[12px] text-on-surface leading-tight">
                    <strong className="font-semibold">Pencairan Otomatis Terkunci:</strong> Memerlukan tinjauan manual auditor.
                  </div>
                </div>
                <span className="font-label-sm text-[11px] text-on-surface-variant font-medium">
                  ISO 27001
                </span>
              </div>
            </section>

            {/* Card: Lembar Putusan & Berita Acara Auditor */}
            <section className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex flex-col gap-5 border border-outline-variant/30">
              <div className="flex items-center gap-2.5 pb-3 border-b border-surface-container">
                <div className="w-8 h-8 rounded-xl bg-primary-container text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">gavel</span>
                </div>
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface text-[16px]">
                  Lembar Putusan Auditor Forensik
                </h2>
              </div>

              {/* Action Selection Pills */}
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase">
                  Pilih Putusan Investigasi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDecision("APPROVED")}
                    className={`h-10 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 font-label-md text-label-md border ${
                      decision === "APPROVED"
                        ? "bg-secondary text-on-secondary font-bold shadow-sm"
                        : "bg-surface-container-low text-on-surface hover:bg-surface-container-high border-outline-variant/30"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>Setujui</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecision("REJECTED")}
                    className={`h-10 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 font-label-md text-label-md border ${
                      decision === "REJECTED"
                        ? "bg-tertiary text-on-tertiary font-bold shadow-sm ring-2 ring-tertiary ring-offset-2"
                        : "bg-surface-container-low text-on-surface hover:bg-surface-container-high border-outline-variant/30"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">gavel</span>
                    <span>Tolak</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecision("CLARIFICATION")}
                    className={`h-10 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 font-label-md text-label-md border ${
                      decision === "CLARIFICATION"
                        ? "bg-surface-container-highest text-on-surface font-bold shadow-sm ring-2 ring-primary"
                        : "bg-surface-container-low text-on-surface hover:bg-surface-container-high border-outline-variant/30"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">help_outline</span>
                    <span>Klarifikasi</span>
                  </button>
                </div>
              </div>

              {/* Auditor Note Text Area */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-label-sm text-label-sm font-bold text-on-surface uppercase">
                    Catatan Forensik (BAP)
                  </label>
                  <span className="font-label-sm text-[11px] text-tertiary font-bold">
                    Permanen di Audit Trail
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={auditNotes}
                  onChange={(e) => setAuditNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm border border-outline-variant/40 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
                  placeholder="Tuliskan justifikasi berita acara pemeriksaan..."
                />
              </div>

              {/* ISO 27001 Cryptographic Signature Checkbox */}
              <div className="space-y-3 pt-1">
                <label className="p-3 rounded-xl bg-surface-container-low flex items-start gap-2.5 border border-outline-variant/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isoComplianceChecked}
                    onChange={(e) => setIsoComplianceChecked(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer mt-0.5"
                  />
                  <span className="font-body-sm text-[12px] text-on-surface select-none leading-relaxed">
                    Catat ke Immutable Audit Log ISO 27001 (Ditandatangani secara kriptografis oleh Auditor Bambang H.)
                  </span>
                </label>

                {/* Submit Decision Button */}
                <button
                  type="button"
                  disabled={isSubmittingDecision}
                  onClick={handleSubmitDecision}
                  className={`w-full h-11 px-4 rounded-xl font-headline-sm text-[14px] font-bold shadow-md transition-all flex items-center justify-center gap-2 text-on-primary ${
                    decision === "APPROVED"
                      ? "bg-secondary hover:bg-secondary/90"
                      : "bg-tertiary hover:bg-tertiary-container"
                  }`}
                >
                  {isSubmittingDecision ? (
                    <>
                      <span className="material-symbols-outlined text-[20px] animate-spin">
                        sync
                      </span>
                      <span>Menandatangani Berita Acara & Dispatch Webhook...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">verified_user</span>
                      <span>Simpan Putusan & Kirim Notifikasi</span>
                    </>
                  )}
                </button>
              </div>
            </section>
          </div>
        </main>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="bg-inverse-surface text-inverse-on-surface px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-outline-variant/20">
              <span className="material-symbols-outlined text-secondary text-[24px]">task_alt</span>
              <div>
                <div className="font-label-md text-label-md font-bold">Putusan Forensik Disimpan</div>
                <div className="font-body-sm text-body-sm text-inverse-on-surface/90">
                  {toastMessage}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
