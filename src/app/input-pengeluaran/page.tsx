"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import {
  UploadCloud,
  FileText,
  Scan,
  Table,
  CheckCircle2,
  AlertTriangle,
  Download,
  Send,
  ChevronRight,
  Info,
  Sparkles,
  ArrowRight,
  LogOut,
  RefreshCw,
  Building,
  HelpCircle,
  Clock,
  TrendingUp,
  X,
  ShieldCheck,
} from "lucide-react";
import {
  DIVISION_3SIGMA_MAP,
  getDivisionLimit,
  getDivisionLimitInfo,
  DEPARTMENT_LIST,
} from "@/lib/division-limits";
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_GROUPS,
  getCategoryBadgeInfo,
  formatCategoryLabel,
} from "@/lib/expense-categories";

const STANDARD_DEPARTMENTS = DEPARTMENT_LIST;
const DIVISION_LIMITS_MAP = DIVISION_3SIGMA_MAP;

const toIsoDate = (raw?: string | null): string => {
  const fallback = new Date().toISOString().split("T")[0];
  if (!raw) return fallback;
  const cleaned = String(raw).trim().split("T")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return cleaned;
  const d = new Date(raw);
  if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
  return fallback;
};

export default function InputPengeluaranPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<"SINGLE" | "BULK_CSV">("SINGLE");

  // State Unggah & OCR
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrData, setOcrData] = useState<{
    documentType?: string;
    vendor?: string;
    vendorDetails?: {
      name?: string;
      address?: string;
      phone?: string;
      email?: string;
      taxId?: string;
      contactPerson?: string;
    };
    customerDetails?: {
      name?: string;
      address?: string;
      phone?: string;
      taxId?: string;
    };
    taxId?: string | null;
    invoiceNumber?: string | null;
    poNumber?: string | null;
    date?: string;
    dueDate?: string | null;
    items?: Array<{ no?: number; name: string; qty: number; unit?: string; unitPrice: number; totalPrice: number }>;
    subtotal?: number;
    discount?: number;
    dpp?: number;
    taxPpn?: number;
    taxPph?: number;
    otherFees?: number;
    amount?: number;
    currency?: string;
    terbilang?: string;
    paymentInfo?: {
      bank?: string;
      accountNumber?: string;
      accountName?: string;
      terms?: string;
    };
    signatures?: {
      seller?: string;
      buyer?: string;
    };
    arithmeticValidation?: {
      isValid: boolean;
      expectedTotal: number;
      actualTotal: number;
      difference: number;
      notes: string;
    };
    physicalIntegrity?: {
      tamperDetected: boolean;
      notes: string;
    };
    sha256Hash?: string;
    phashFingerprint?: string;
    latencyMs?: number;
    confidence?: number;
    engineUsed?: string;
    fallbackTriggered?: boolean;
    suggestedCategory?: string;
    categoryLabel?: string;
    categoryConfidence?: number;
    rawText?: string;
    notes?: string;
  } | null>(null);

  // State Form Transaksi
  const [applicantName, setApplicantName] = useState(user?.name || "Siti Rahma");
  const [department, setDepartment] = useState(user?.department || "Finance, Accounting & Tax");
  const [category, setCategory] = useState("operasional");
  const [vendor, setVendor] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [taxId, setTaxId] = useState("");
  const [subtotal, setSubtotal] = useState<number | "">("");
  const [taxPpn, setTaxPpn] = useState<number | "">("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setApplicantName(user.name);
    }
    if (user?.department) {
      setDepartment(user.department);
    }
  }, [user]);

  // State Result Modal
  const [submissionResult, setSubmissionResult] = useState<{
    code: string;
    status: string;
    riskScore: number;
    riskLevel: string;
    reasonXai: string;
    isAutoApproved: boolean;
  } | null>(null);

  // State CSV Bulk Ingestion
  const [csvRows, setCsvRows] = useState<any[]>([]);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [bulkSubmitting, setBulkSubmitting] = useState(false);

  // State Modal Edukasi SOP Pagu 3-Sigma
  const [showSopModal, setShowSopModal] = useState(false);

  if (user && user.role !== "STAFF") {
    return (
      <>
        <Navbar currentRole="AUDITOR" />
        <main className="w-full min-h-screen pt-24 px-4 flex items-center justify-center bg-slate-50">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md max-w-md text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 inline-flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Peran Sesi: Auditor Forensik</h2>
            <p className="text-sm text-slate-600 mt-2 mb-6 leading-relaxed">
              Anda saat ini masuk sebagai <strong>{user.name}</strong> (Auditor). Formulir pengajuan pengeluaran kas diperuntukkan bagi Staf Keuangan.
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

  // Handler Unggah File Kuitansi
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploadProgress(25);
    setIsScanning(true);

    const formData = new FormData();
    formData.append("receipt", selectedFile);

    try {
      setUploadProgress(60);
      const res = await fetch("/api/upload-ocr", {
        method: "POST",
        body: formData,
      });
      setUploadProgress(85);

      const json = await res.json();
      if (json.success) {
        const d = json.data;
        setPreviewUrl(d.previewUrl);
        setOcrData({
          suggestedCategory: d.suggestedCategory,
          categoryLabel: d.categoryLabel,
          categoryConfidence: d.categoryConfidence,
          documentType: d.documentType,
          vendor: d.vendor,
          vendorDetails: d.vendorDetails,
          customerDetails: d.customerDetails,
          taxId: d.taxId,
          invoiceNumber: d.invoiceNumber,
          poNumber: d.poNumber,
          date: d.date,
          dueDate: d.dueDate,
          items: d.items,
          subtotal: d.subtotal,
          discount: d.discount,
          dpp: d.dpp,
          taxPpn: d.taxPpn,
          taxPph: d.taxPph,
          otherFees: d.otherFees,
          amount: d.amount,
          currency: d.currency,
          terbilang: d.terbilang,
          paymentInfo: d.paymentInfo,
          signatures: d.signatures,
          arithmeticValidation: d.arithmeticValidation,
          physicalIntegrity: d.physicalIntegrity,
          sha256Hash: d.sha256Hash,
          phashFingerprint: d.phashFingerprint,
          latencyMs: d.latencyMs,
          confidence: d.confidence,
          engineUsed: d.engineUsed,
          fallbackTriggered: d.fallbackTriggered,
          rawText: d.rawText,
          notes: d.notes,
        });

        if (d.vendor && d.confidence >= 0.5 && !d.vendor.toLowerCase().includes("belum terverifikasi")) {
          setVendor(d.vendor);
        }
        if (d.date) setDate(toIsoDate(d.date));
        if (d.amount !== undefined && d.amount > 0) setAmount(d.amount);
        if (d.invoiceNumber) setInvoiceNumber(d.invoiceNumber);
        if (d.taxId) setTaxId(d.taxId);
        if (d.subtotal !== undefined && d.subtotal > 0) setSubtotal(d.subtotal);
        if (d.taxPpn !== undefined && d.taxPpn > 0) setTaxPpn(d.taxPpn);
        if (d.suggestedCategory) setCategory(d.suggestedCategory);
        if (d.notes || (d.vendor && !d.vendor.toLowerCase().includes("belum terverifikasi"))) {
          setDescription(d.notes || `Pengadaan barang/jasa ${d.vendor} (Faktur No. ${d.invoiceNumber || "-"})`);
        }
      }
    } catch (err) {
      console.error("Gagal OCR:", err);
    } finally {
      setUploadProgress(100);
      setIsScanning(false);
    }
  };

  // Handler Submit Single Transaction
  const handleSubmitSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor || !vendor.trim()) {
      alert("Harap lengkapi nama toko / rekanan vendor transaksi.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      alert("Harap masukkan nominal grand total transaksi yang valid.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Evaluasi Aritmatika Real-Time dari Input Form & OCR
      let dynamicArithmeticValid = ocrData?.arithmeticValidation?.isValid ?? true;
      let dynamicArithmeticDiff = ocrData?.arithmeticValidation?.difference ?? 0;

      const numSubtotal = subtotal !== "" ? Number(subtotal) : (ocrData?.subtotal || 0);
      const numTaxPpn = taxPpn !== "" ? Number(taxPpn) : (ocrData?.taxPpn || 0);
      const numAmount = Number(amount) || (ocrData?.amount || 0);
      const numDpp = (ocrData?.dpp && ocrData.dpp > 0) ? ocrData.dpp : (numSubtotal - (ocrData?.discount || 0));

      if (numTaxPpn > 0 && numDpp > 0) {
        const expectedPpn = Math.round(numDpp * 0.11);
        const ppnDiff = Math.abs(numTaxPpn - expectedPpn);
        if (ppnDiff > 100) {
          dynamicArithmeticValid = false;
          dynamicArithmeticDiff = Math.max(dynamicArithmeticDiff, ppnDiff);
        }
      }

      if (numDpp > 0 && numAmount > 0) {
        const trueTotal = numDpp + (numTaxPpn > 0 ? Math.round(numDpp * 0.11) : 0) + (ocrData?.otherFees || 0) - (ocrData?.taxPph || 0);
        const grandDiff = Math.abs(trueTotal - numAmount);
        if (grandDiff > 100) {
          dynamicArithmeticValid = false;
          dynamicArithmeticDiff = Math.max(dynamicArithmeticDiff, grandDiff);
        }
      }

      const payload = {
        applicantName: applicantName || user?.name || "Staf Keuangan",
        department: department || user?.department || "Finance, Accounting & Tax",
        category: category || "operasional",
        vendor: vendor.trim(),
        amount: Number(amount),
        date: toIsoDate(date),
        description: description || `Pengeluaran faktur ${invoiceNumber ? `No. ${invoiceNumber}` : "operasional kedinasan"}`,
        receipt: ocrData
          ? {
              imageUrl: previewUrl || "/sample-receipt.jpg",
              ocrRawText: JSON.stringify({
                rawText: ocrData.rawText,
                documentType: ocrData.documentType,
                vendor: ocrData.vendor || vendor,
                vendorDetails: ocrData.vendorDetails,
                customerDetails: ocrData.customerDetails,
                invoiceNumber: invoiceNumber || ocrData.invoiceNumber,
                poNumber: ocrData.poNumber,
                taxId: taxId || ocrData.taxId,
                date: toIsoDate(ocrData.date || date),
                dueDate: ocrData.dueDate,
                items: ocrData.items,
                subtotal: subtotal !== "" ? Number(subtotal) : ocrData.subtotal,
                taxPpn: taxPpn !== "" ? Number(taxPpn) : ocrData.taxPpn,
                discount: ocrData.discount,
                dpp: ocrData.dpp,
                taxPph: ocrData.taxPph,
                otherFees: ocrData.otherFees,
                amount: Number(amount) || (ocrData.amount || 0),
                terbilang: ocrData.terbilang,
                paymentInfo: ocrData.paymentInfo,
                notes: ocrData.notes,
                signatures: ocrData.signatures,
                arithmeticValidation: {
                  ...ocrData.arithmeticValidation,
                  isValid: dynamicArithmeticValid,
                  difference: dynamicArithmeticDiff,
                },
                physicalIntegrity: ocrData.physicalIntegrity,
              }),
              extractedVendor: ocrData.vendor || vendor,
              extractedDate: toIsoDate(ocrData.date || date),
              extractedAmount: (ocrData && ocrData.amount !== undefined && ocrData.amount > 0) ? Number(ocrData.amount) : 0,
              phashFingerprint: ocrData.phashFingerprint || "0000000000000000",
              sha256Hash: ocrData.sha256Hash || "sha256-dummy",
              fileSizeKb: file ? Math.round(file.size / 1024) : 100,
              ocrConfidence: ocrData.confidence || 0.95,
              ocrLatencyMs: Math.round(ocrData.latencyMs || 500),
              invoiceArithmeticValid: dynamicArithmeticValid,
              invoiceArithmeticDiff: dynamicArithmeticDiff,
              tamperDetected: ocrData.physicalIntegrity?.tamperDetected,
            }
          : undefined,
      };

      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setSubmissionResult({
          code: json.data.code,
          status: json.data.status,
          riskScore: json.data.fraudAnalysis?.riskScore || 0,
          riskLevel: json.data.fraudAnalysis?.riskLevel || "LOW",
          reasonXai: json.data.fraudAnalysis?.reasonXai || "Evaluasi selesai.",
          isAutoApproved: json.data.status === "AUTO_APPROVED",
        });
      } else {
        alert(json.error || "Gagal menyimpan pengajuan kas. Pastikan seluruh isian formulir sudah sesuai.");
      }
    } catch (err: unknown) {
      console.error("Error submit single:", err);
      const msg = err instanceof Error ? err.message : "Koneksi terputus";
      alert("Terjadi kendala saat mengirim pengajuan kas: " + msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler Unggah Berkas CSV
  const handleCsvSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const csvFile = e.target.files?.[0];
    if (!csvFile) return;

    setCsvFileName(csvFile.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      const parsedRows: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        if (cols.length >= 4) {
          parsedRows.push({
            applicantName: cols[0] || "Staf Pengaju",
            department: cols[1] || "Operasional",
            vendor: cols[2] || "Vendor",
            amount: Number(cols[3]) || 0,
            category: cols[4] || "hardware",
            date: cols[5] || new Date().toISOString().split("T")[0],
            description: cols[6] || "Impor pengeluaran dari CSV",
          });
        }
      }
      setCsvRows(parsedRows);
    };
    reader.readAsText(csvFile);
  };

  const handleBulkSubmit = async () => {
    if (csvRows.length === 0) return;
    setBulkSubmitting(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(csvRows),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        alert(`Berhasil memproses ${csvRows.length} transaksi massal.`);
        router.push("/beranda-staf");
      } else {
        alert(json.error || "Gagal memproses transaksi massal. Periksa format berkas CSV.");
      }
    } catch (err: unknown) {
      console.error("Error bulk CSV:", err);
      const msg = err instanceof Error ? err.message : "Koneksi terputus";
      alert("Terjadi kendala saat mengirim transaksi massal: " + msg);
    } finally {
      setBulkSubmitting(false);
    }
  };

  return (
    <>
      <Navbar currentRole="STAFF" />

      <main className="w-full min-h-screen pt-20 px-6 sm:px-8 lg:px-12 pb-16 bg-slate-50">
        <div className="w-full max-w-[1600px] mx-auto space-y-6 pt-2">
          {/* Header Ringkas & Memanjang */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Pengajuan Pengeluaran
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-200">
                Staf Keuangan
              </span>
            </div>

            {/* Mode Switcher */}
            <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setMode("SINGLE")}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-2 ${
                  mode === "SINGLE"
                    ? "bg-white text-blue-700 shadow-xs border border-slate-200/60"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Scan className="w-3.5 h-3.5 shrink-0" />
                <span>Kuitansi + AI OCR</span>
              </button>
              <button
                type="button"
                onClick={() => setMode("BULK_CSV")}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-2 ${
                  mode === "BULK_CSV"
                    ? "bg-white text-blue-700 shadow-xs border border-slate-200/60"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Table className="w-3.5 h-3.5 shrink-0" />
                <span>Impor CSV</span>
              </button>
            </div>
          </div>

          {/* Single Mode */}
          {mode === "SINGLE" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: OCR Scanner & Upload (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="inline-flex items-center gap-2">
                      <Scan className="w-5 h-5 text-blue-600 shrink-0" />
                      <span className="text-base font-bold text-slate-900">
                        Bukti Kuitansi Fisik
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                      Wajib Dilampirkan
                    </span>
                  </div>

                  {/* Dropzone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative cursor-pointer bg-slate-50 p-6 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-slate-100/70 transition-all flex flex-col items-center justify-center text-center min-h-[160px]"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 inline-flex items-center justify-center mb-3 border border-blue-100 shrink-0">
                      <UploadCloud className="w-6 h-6" />
                    </div>

                    <p className="text-sm font-bold text-slate-800">
                      Pilih atau tarik berkas foto kuitansi
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Mendukung format JPG, PNG, atau PDF (maks. 10MB)
                    </p>
                  </div>

                  {/* Progress bar */}
                  {uploadProgress > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-600 font-semibold">
                        <span>{isScanning ? "Memindai kuitansi dengan AI OCR..." : "Ekstraksi Selesai"}</span>
                        <span className="font-mono">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Preview Box */}
                  {previewUrl && (
                    <div className="bg-slate-50 p-4 rounded-xl flex flex-col gap-3 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                          Pratinjau Kuitansi
                        </span>
                        <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200 inline-flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          Resolusi Valid
                        </span>
                      </div>

                      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
                        <div className="relative w-14 h-18 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={previewUrl} alt="Receipt" className="w-full h-full object-cover" />
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-sm font-bold text-slate-900 truncate">
                            {file?.name || "kuitansi.jpg"}
                          </span>
                          <span className="font-mono text-xs text-slate-500 mt-0.5">
                            {file ? `${(file.size / 1024).toFixed(1)} KB` : "1.8 MB"} &bull; Latensi:{" "}
                            {ocrData?.latencyMs || 850} ms
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setFile(null);
                              setPreviewUrl(null);
                              setOcrData(null);
                              setUploadProgress(0);
                            }}
                            className="text-rose-600 hover:underline text-xs font-semibold self-start mt-1.5"
                          >
                            Ganti Berkas
                          </button>
                        </div>
                      </div>

                      {/* OCR Result Chips & Invoice Breakdown */}
                      {ocrData && (
                        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-3">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                              Hasil Analisis Faktur Pajak & AI
                            </span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                              {ocrData.documentType?.replace(/_/g, " ") || "INVOICE RESMI"}
                            </span>
                          </div>

                          {/* Quick Facts */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                              <span className="text-slate-500 text-[10px] block">No. Faktur</span>
                              <span className="font-bold text-slate-800 font-mono text-[11px] truncate block">
                                {ocrData.invoiceNumber || "-"}
                              </span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                              <span className="text-slate-500 text-[10px] block">No. PO / Ref</span>
                              <span className="font-bold text-slate-800 font-mono text-[11px] truncate block">
                                {ocrData.poNumber || "-"}
                              </span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 col-span-2 sm:col-span-1">
                              <span className="text-slate-500 text-[10px] block">NPWP Penjual</span>
                              <span className="font-bold text-slate-800 font-mono text-[11px] truncate block">
                                {ocrData.taxId || "-"}
                              </span>
                            </div>
                          </div>

                          {/* Data Pihak: Penjual & Pembeli */}
                          {(ocrData.vendor || ocrData.customerDetails?.name) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                              <div>
                                <span className="text-[10px] text-slate-500 font-bold uppercase block">Pihak Penjual:</span>
                                <span className="font-bold text-slate-900 block truncate">{ocrData.vendor}</span>
                                {ocrData.vendorDetails?.contactPerson && (
                                  <span className="text-[10px] text-slate-600 block">PIC: {ocrData.vendorDetails.contactPerson}</span>
                                )}
                              </div>
                              {ocrData.customerDetails?.name && (
                                <div>
                                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Pihak Pembeli:</span>
                                  <span className="font-bold text-slate-900 block truncate">{ocrData.customerDetails.name}</span>
                                  {ocrData.customerDetails.taxId && (
                                    <span className="text-[10px] text-slate-600 block">NPWP: {ocrData.customerDetails.taxId}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Rincian Item Barang */}
                          {ocrData.items && ocrData.items.length > 0 && (
                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[10px] text-slate-500 font-bold uppercase">
                                  Rincian Barang / Jasa ({ocrData.items.length} Item):
                                </span>
                              </div>
                              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                {ocrData.items.map((it, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-[11px] text-slate-700 bg-white p-1.5 rounded border border-slate-100">
                                    <div className="truncate pr-2">
                                      <span className="font-bold text-slate-900">{it.no || idx + 1}.</span> {it.name}
                                      <span className="text-[10px] text-slate-500 ml-1">({it.qty} {it.unit || "Unit"} @ Rp {(it.unitPrice || 0).toLocaleString("id-ID")})</span>
                                    </div>
                                    <span className="font-mono font-bold text-slate-900 shrink-0">
                                      Rp {it.totalPrice.toLocaleString("id-ID")}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Ringkasan Finansial & Pajak */}
                          <div className="space-y-1 text-xs border-t border-slate-100 pt-2">
                            <div className="flex justify-between text-slate-600">
                              <span>Subtotal:</span>
                              <span className="font-mono">Rp {(ocrData.subtotal || 0).toLocaleString("id-ID")}</span>
                            </div>
                            {ocrData.discount ? (
                              <div className="flex justify-between text-emerald-700">
                                <span>Potongan / Diskon:</span>
                                <span className="font-mono">- Rp {ocrData.discount.toLocaleString("id-ID")}</span>
                              </div>
                            ) : null}
                            {ocrData.dpp !== undefined && (
                              <div className="flex justify-between text-slate-600">
                                <span>DPP (Dasar Pengenaan Pajak):</span>
                                <span className="font-mono">Rp {ocrData.dpp.toLocaleString("id-ID")}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-slate-600">
                              <span>PPN (11%):</span>
                              <span className="font-mono">Rp {(ocrData.taxPpn || 0).toLocaleString("id-ID")}</span>
                            </div>
                            {ocrData.otherFees ? (
                              <div className="flex justify-between text-slate-700 font-medium">
                                <span>Ongkos Kirim / Biaya Lain:</span>
                                <span className="font-mono">Rp {ocrData.otherFees.toLocaleString("id-ID")}</span>
                              </div>
                            ) : null}
                            <div className="flex justify-between font-bold text-slate-900 pt-1.5 border-t border-dashed border-slate-200 text-sm">
                              <span>Grand Total Faktur:</span>
                              <span className="font-mono text-blue-700">
                                Rp {(ocrData.amount || 0).toLocaleString("id-ID")}
                              </span>
                            </div>
                            {ocrData.terbilang && (
                              <div className="text-[10px] text-slate-500 italic pt-0.5">
                                Terbilang: &ldquo;{ocrData.terbilang}&rdquo;
                              </div>
                            )}
                          </div>

                          {/* Informasi Pembayaran & Signatures */}
                          {(ocrData.paymentInfo || ocrData.signatures) && (
                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[10px] space-y-1 text-slate-600">
                              {ocrData.paymentInfo?.bank && (
                                <div>
                                  <strong className="text-slate-800">Pembayaran:</strong> {ocrData.paymentInfo.bank} - {ocrData.paymentInfo.accountNumber || ""} ({ocrData.paymentInfo.accountName || ""}) &bull; {ocrData.paymentInfo.terms || "Lunas"}
                                </div>
                              )}
                              {ocrData.signatures?.seller && (
                                <div>
                                  <strong className="text-slate-800">Penandatangan:</strong> Penjual ({ocrData.signatures.seller}){ocrData.signatures.buyer ? ` & Pembeli (${ocrData.signatures.buyer})` : ""}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Arithmetic & Forensic Status */}
                          <div
                            className={`p-2.5 rounded-lg text-xs flex items-start gap-2 border ${
                              ocrData.arithmeticValidation?.isValid
                                ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                                : "bg-rose-50 text-rose-900 border-rose-200"
                            }`}
                          >
                            {ocrData.arithmeticValidation?.isValid ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            )}
                            <div className="leading-snug">
                              <span className="font-bold block">
                                {ocrData.arithmeticValidation?.isValid
                                  ? "Validasi Aritmatika & Pajak Klop (100% Sesuai)"
                                  : "Peringatan Cacat Hitungan Faktur"}
                              </span>
                              <span className="text-[11px] opacity-90">
                                {ocrData.arithmeticValidation?.notes}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="inline-flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 text-slate-600 text-xs border border-slate-200 leading-relaxed">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p>
                      <strong>Koreksi Fleksibel:</strong> Seluruh isian formulir di samping kanan dapat diedit manual jika kuitansi terlipat atau buram.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Form Details (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col gap-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Rincian Pengeluaran Kas
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Lengkapi detail transaksi sesuai nota atau kuitansi pembayaran
                      </p>
                    </div>
                    <span className="text-slate-600 text-xs bg-slate-100 px-3 py-1 rounded-md font-semibold border border-slate-200">
                      Formulir Staf
                    </span>
                  </div>

                  <form onSubmit={handleSubmitSingle} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Pemohon */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Nama Pemohon <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-lg bg-slate-50 text-slate-900 text-sm border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Departemen */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                          <span>Departemen Pemohon</span>
                          <span className="text-rose-500">*</span>
                          {user?.department && (
                            <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium border border-blue-200">
                              Terkunci akun
                            </span>
                          )}
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowSopModal(true)}
                          className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Pagu SOP (3&sigma;)</span>
                        </button>
                      </div>

                      <select
                        value={department}
                        disabled={!!user?.department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className={`w-full h-10 px-3.5 rounded-lg text-slate-900 text-sm border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none ${
                          user?.department ? "bg-slate-100 cursor-not-allowed opacity-90 font-medium" : "bg-slate-50 cursor-pointer"
                        }`}
                      >
                        {STANDARD_DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                        {department && !STANDARD_DEPARTMENTS.includes(department) && (
                          <option value={department}>{department}</option>
                        )}
                      </select>

                      {/* Info Pagu Divisi Terpilih */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                        <span className="inline-flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>Pagu wajar rutin (3&sigma;):</span>
                        </span>
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          Rp {(DIVISION_LIMITS_MAP[department]?.limit || 40000000).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    {/* Kategori */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700">
                          Kategori Belanja <span className="text-rose-500">*</span>
                        </label>
                        {ocrData?.suggestedCategory && (
                          <span className="text-[11px] text-blue-600 font-semibold inline-flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            Auto-AI ({Math.round((ocrData.categoryConfidence || 0.95) * 100)}%)
                          </span>
                        )}
                      </div>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-lg bg-slate-50 text-slate-900 text-sm border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none cursor-pointer"
                      >
                        {EXPENSE_CATEGORY_GROUPS.map((group) => {
                          const groupItems = EXPENSE_CATEGORIES.filter((c) => c.group === group);
                          return (
                            <optgroup key={group} label={group}>
                              {groupItems.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.icon} {cat.name}
                                </option>
                              ))}
                            </optgroup>
                          );
                        })}
                      </select>

                      {/* Info & Indikator Risiko Kategori Terpilih */}
                      {(() => {
                        const catInfo = getCategoryBadgeInfo(category);
                        return (
                          <div className="flex items-center justify-between text-[11px] pt-0.5">
                            <span className="text-slate-500 truncate max-w-[200px] sm:max-w-[250px]" title={catInfo.group}>
                              {catInfo.group}
                            </span>
                            {catInfo.riskLevel === "HIGH" ? (
                              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200 inline-flex items-center gap-1 text-[10px]">
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                Risiko Tinggi (Wajib Justifikasi)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 text-[10px]">
                                SOP Standar
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Tanggal */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Tanggal Transaksi <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={toIsoDate(date)}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-lg bg-slate-50 text-slate-900 text-sm border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all font-mono"
                      />
                    </div>

                    {/* Vendor */}
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                        <span>Nama Toko / Rekanan Rekanan Vendor <span className="text-rose-500">*</span></span>
                        {ocrData?.vendor && (
                          <span className="text-xs text-blue-600 font-semibold inline-flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            Terisi via OCR AI
                          </span>
                        )}
                      </label>
                      <div className="relative flex items-center">
                        <Building className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none shrink-0" />
                        <input
                          type="text"
                          required
                          value={vendor}
                          onChange={(e) => setVendor(e.target.value)}
                          placeholder="Misal: PT Sentosa Komputindo"
                          className="w-full h-10 pl-10 pr-3.5 rounded-lg bg-slate-50 text-slate-900 text-sm border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Nomor Faktur & NPWP */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Nomor Faktur / No. Invoice
                      </label>
                      <input
                        type="text"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        placeholder="Misal: INV-2025/X/8821"
                        className="w-full h-10 px-3.5 rounded-lg bg-slate-50 text-slate-900 font-mono text-xs border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        NPWP Vendor (Wajib Faktur Pajak)
                      </label>
                      <input
                        type="text"
                        value={taxId}
                        onChange={(e) => setTaxId(e.target.value)}
                        placeholder="01.345.678.9-021.000"
                        className="w-full h-10 px-3.5 rounded-lg bg-slate-50 text-slate-900 font-mono text-xs border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Subtotal & PPN */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Subtotal / DPP (Rp)
                      </label>
                      <input
                        type="number"
                        value={subtotal}
                        onChange={(e) => setSubtotal(e.target.value === "" ? "" : Number(e.target.value))}
                        placeholder="4500000"
                        className="w-full h-10 px-3.5 rounded-lg bg-slate-50 text-slate-900 font-mono text-xs border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        PPN 11% / Pajak (Rp)
                      </label>
                      <input
                        type="number"
                        value={taxPpn}
                        onChange={(e) => setTaxPpn(e.target.value === "" ? "" : Number(e.target.value))}
                        placeholder="495000"
                        className="w-full h-10 px-3.5 rounded-lg bg-slate-50 text-slate-900 font-mono text-xs border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Nominal Total */}
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                        <span>Grand Total Pembayaran (IDR) <span className="text-rose-500">*</span></span>
                        <span className="text-xs text-emerald-700 font-medium">
                          Plafon Fast-Track Auto Approval: s/d Rp 75.000.000 (Sesuai Pagu 3&sigma; Divisi)
                        </span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 font-mono text-sm text-slate-500 font-bold pointer-events-none">
                          Rp
                        </span>
                        <input
                          type="number"
                          required
                          value={amount}
                          onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="4995000"
                          className="w-full h-10 pl-11 pr-3.5 rounded-lg bg-slate-50 text-slate-900 font-mono font-bold text-base border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                        />
                      </div>

                      {/* Real-time Tax Rate 11% Arithmetic Mismatch Alert */}
                      {(() => {
                        if (subtotal === "" || Number(subtotal) <= 0 || taxPpn === "" || Number(taxPpn) <= 0) return null;
                        const numSub = Number(subtotal);
                        const numPpn = Number(taxPpn);
                        const discount = ocrData?.discount || 0;
                        const effectiveDpp = (ocrData?.dpp && ocrData.dpp > 0 && Math.abs(ocrData.dpp - (numSub - discount)) <= 100)
                          ? ocrData.dpp
                          : Math.max(0, numSub - discount);
                        const expectedPpn = Math.round(effectiveDpp * 0.11);
                        const diff = Math.abs(numPpn - expectedPpn);
                        
                        if (diff <= 100) return null;

                        const expectedGrandTotal = effectiveDpp + expectedPpn + (ocrData?.otherFees || 0) - (ocrData?.taxPph || 0);

                        return (
                          <div className="mt-2 p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-2.5">
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold block text-rose-950">
                                Peringatan Cacat Kalkulasi PPN 11% (+45 Poin - Anomali Pajak):
                              </span>
                              <span className="leading-relaxed block mt-0.5 text-rose-900">
                                PPN 11% tertulis <strong>Rp {numPpn.toLocaleString("id-ID")}</strong>, seharusnya <strong>Rp {expectedPpn.toLocaleString("id-ID")}</strong> (dihitung dari DPP Rp {effectiveDpp.toLocaleString("id-ID")}{discount > 0 ? ` setelah diskon Rp ${discount.toLocaleString("id-ID")}` : ""}). Selisih <strong>Rp {diff.toLocaleString("id-ID")}</strong> menyebabkan Grand Total ikut salah (seharusnya Rp {expectedGrandTotal.toLocaleString("id-ID")}). Berkas ditandai cacat kalkulasi aritmatika faktur dan wajib diverifikasi manual oleh Auditor.
                              </span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Real-time Mismatch Alert */}
                      {amount !== "" && ocrData?.amount !== undefined && ocrData.amount > 0 && Math.abs(Number(amount) - ocrData.amount) > 100 && (
                        <div className="mt-2 p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-2.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block">
                              Peringatan Ketidaksesuaian Nominal (+50 Poin - KRITIS):
                            </span>
                            <span className="leading-relaxed block mt-0.5">
                              Nominal input (<strong>Rp {Number(amount).toLocaleString("id-ID")}</strong>) berbeda dengan total faktur yang dibaca AI (<strong>Rp {ocrData.amount.toLocaleString("id-ID")}</strong>). Selisih <strong>Rp {Math.abs(Number(amount) - ocrData.amount).toLocaleString("id-ID")}</strong> ditandai oleh mesin forensik sebagai anomali kritis. Pencairan otomatis <strong>DIBEKUKAN</strong> dan wajib diverifikasi Satuan Audit Penjamin Keuangan.
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Real-time Division 3-Sigma Anomaly Notice */}
                      {amount !== "" && Number(amount) > (DIVISION_LIMITS_MAP[department]?.limit || 40000000) && (
                        <div className="mt-2 p-3 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-950 text-xs flex items-start gap-2.5">
                          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block text-amber-950">
                              Pemberitahuan SOP Batas Wajar Divisi (&gt; 3-Sigma Deviasi):
                            </span>
                            <span className="leading-relaxed block mt-0.5 text-amber-900">
                              Nominal pengajuan (<strong>Rp {Number(amount).toLocaleString("id-ID")}</strong>) melampaui batas wajar belanja rutin divisi <strong>{department}</strong> (Rp {(DIVISION_LIMITS_MAP[department]?.limit || 40000000).toLocaleString("id-ID")}).
                              Berkas <strong>tetap dapat dikirim secara normal</strong>, namun pencairan otomatis (Fast-Track) akan dialihkan ke <strong>Antrean Review Auditor Forensik</strong> untuk verifikasi kelengkapan dokumen fisik (SPK/PO/BAST).
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Real-time High Risk Category Alert */}
                      {getCategoryBadgeInfo(category).riskLevel === "HIGH" && (
                        <div className="mt-2 p-3 rounded-xl bg-rose-50/90 border border-rose-300 text-rose-950 text-xs flex items-start gap-2.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block text-rose-950">
                              Pemberitahuan Kepatuhan Kategori Berisiko Tinggi (+20 Poin):
                            </span>
                            <span className="leading-relaxed block mt-0.5 text-rose-900">
                              Kategori <strong>{getCategoryBadgeInfo(category).name}</strong> tergolong beban representasi berisiko tinggi. Wajib menyertakan daftar nama/instansi relasi yang dijamu dan memo otorisasi Kepala Divisi untuk menghindari pembekuan pencairan dana.
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Unverified Receipt Alert */}
                      {ocrData && (ocrData.amount === 0 || (ocrData.confidence !== undefined && ocrData.confidence < 0.5)) && (
                        <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block">
                              Peringatan Kuitansi Belum Terverifikasi AI (+40 Poin):
                            </span>
                            <span className="leading-relaxed block mt-0.5">
                              Berkas kuitansi tidak terbaca otomatis secara presisi oleh AI Vision. Pengajuan ini <strong>DILARANG dicairkan otomatis</strong> dan wajib diuji keabsahan fisik dokumennya oleh Satuan Audit Penjamin Keuangan.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Deskripsi */}
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700">
                        Deskripsi Keperluan Pengeluaran
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tuliskan tujuan pengadaan atau rincian item barang/jasa..."
                        className="w-full p-3 rounded-lg bg-slate-50 text-slate-900 text-sm border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="sm:col-span-2 pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors shadow-xs"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                            <span>Mengevaluasi Aturan Kas & Algoritma Fraud...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 shrink-0" />
                            <span>Kirim Pengajuan Kas & Evaluasi Otomatis</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            /* Bulk CSV Mode */
            <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Impor Pengeluaran Kas Massal (CSV)
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Unggah berkas rekap pengeluaran untuk pemindaian sekaligus secara serentak
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const sample = `Pemohon,Divisi,Vendor,Nominal,Kategori,Tanggal,Deskripsi\nDimas Pratama,IT & Digital,PT Graha Cipta Solusindo,3500000,hardware,2025-10-25,Pengadaan Router Wifi Kantor\nRian Pratama,Pengadaan & Logistik,CV Mitra Sukses Sejahtera,12500000,atk,2025-10-25,Kertas dan Tinta Printer Cabang`;
                    const blob = new Blob([sample], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "template-transaksi.csv");
                    link.click();
                  }}
                  className="h-10 px-4 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold inline-flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-xs self-start"
                >
                  <Download className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Unduh Contoh CSV</span>
                </button>
              </div>

              <div
                onClick={() => csvInputRef.current?.click()}
                className="cursor-pointer bg-slate-50 p-8 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-slate-100/70 flex flex-col items-center justify-center text-center transition-colors min-h-[160px]"
              >
                <input ref={csvInputRef} type="file" accept=".csv" onChange={handleCsvSelect} className="hidden" />
                <Table className="w-8 h-8 text-blue-600 mb-2 shrink-0" />
                <p className="text-base font-bold text-slate-800">
                  {csvFileName ? `Berkas Terpilih: ${csvFileName}` : "Pilih berkas format .CSV"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Format Kolom: Pemohon, Divisi, Vendor, Nominal, Kategori, Tanggal, Deskripsi
                </p>
              </div>

              {csvRows.length > 0 && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-slate-900">
                      Pratinjau {csvRows.length} Baris Transaksi:
                    </span>
                    <button
                      type="button"
                      onClick={handleBulkSubmit}
                      disabled={bulkSubmitting}
                      className="h-10 px-5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-xs inline-flex items-center gap-2"
                    >
                      {bulkSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                          <span>Memproses...</span>
                        </>
                      ) : (
                        `Proses ${csvRows.length} Transaksi Serentak`
                      )}
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-slate-700 uppercase font-bold text-xs border-b border-slate-200">
                          <th className="py-3 px-4">Pemohon</th>
                          <th className="py-3 px-4">Divisi</th>
                          <th className="py-3 px-4">Vendor</th>
                          <th className="py-3 px-4 text-right">Nominal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {csvRows.map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="py-3 px-4 font-semibold text-slate-900">{r.applicantName}</td>
                            <td className="py-3 px-4 text-slate-600">{r.department}</td>
                            <td className="py-3 px-4 text-slate-800">{r.vendor}</td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-blue-600">
                              Rp {Number(r.amount).toLocaleString("id-ID")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Result Feedback Modal */}
          {submissionResult && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div
                    className={`w-10 h-10 rounded-xl inline-flex items-center justify-center text-white shrink-0 shadow-xs ${
                      submissionResult.isAutoApproved
                        ? "bg-emerald-600"
                        : submissionResult.riskLevel === "CRITICAL" || submissionResult.riskLevel === "HIGH"
                        ? "bg-rose-600"
                        : "bg-amber-600"
                    }`}
                  >
                    {submissionResult.isAutoApproved ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : submissionResult.riskLevel === "CRITICAL" || submissionResult.riskLevel === "HIGH" ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Evaluasi SmartAudit AI
                    </h3>
                    <span className="font-mono text-xs text-blue-600 font-bold">
                      Kode: {submissionResult.code}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div
                    className={`p-4 rounded-xl border text-sm leading-relaxed ${
                      submissionResult.isAutoApproved
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                        : submissionResult.riskLevel === "CRITICAL" || submissionResult.riskLevel === "HIGH"
                        ? "bg-rose-50 border-rose-200 text-rose-900"
                        : "bg-amber-50 border-amber-200 text-amber-950"
                    }`}
                  >
                    <div className="font-bold text-sm mb-1">
                      {submissionResult.isAutoApproved
                        ? "Disetujui Otomatis (Fast-Track Auto Approval)"
                        : submissionResult.riskLevel === "CRITICAL" || submissionResult.riskLevel === "HIGH"
                        ? "Peringatan Investigasi Forensik Kas"
                        : "Masuk Antrean Review Auditor Forensik (Bukan Ditolak)"}
                    </div>
                    {submissionResult.reasonXai}
                  </div>

                  {!submissionResult.isAutoApproved && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold text-slate-800 mb-0.5">Informasi Prosedur SOP:</strong>
                        <span>
                          Pengajuan Anda telah berhasil dicatat dengan nomor registrasi resmi di sistem. Berkas saat ini sedang dalam antrean verifikasi bukti fisik oleh Satuan Audit Penjamin Keuangan sesuai prosedur batas deviasi pagu. Anda dapat memantau status persetujuan di Beranda Staf.
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-50 p-3.5 rounded-xl flex items-center justify-between text-sm border border-slate-200">
                    <div>
                      <span className="text-slate-500 text-xs uppercase font-bold block">
                        Skor Risiko
                      </span>
                      <span className="text-lg font-bold font-mono text-slate-900">
                        {submissionResult.riskScore} / 100
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        submissionResult.isAutoApproved
                          ? "bg-emerald-100 text-emerald-800"
                          : submissionResult.riskLevel === "CRITICAL" || submissionResult.riskLevel === "HIGH"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {submissionResult.riskLevel}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmissionResult(null);
                      router.push("/beranda-staf");
                    }}
                    className="h-10 px-5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    Kembali ke Beranda Staf
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Edukasi SOP Pagu 3-Sigma per Departemen */}
          {showSopModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
              <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 inline-flex items-center justify-center border border-blue-100 shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Pagu Wajar Historis & Batas 3-Sigma per Departemen
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Standar Operasional Prosedur (SOP) Pencairan Kas & Otomasi SmartAudit
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSopModal(false)}
                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 inline-flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-4 space-y-4 overflow-y-auto pr-1 flex-1">
                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-blue-900 text-xs leading-relaxed flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Prinsip Kepatuhan 3-Sigma Deviasi (&mu; + 3&sigma;):</strong>
                      <span className="block mt-0.5">
                        Jika nominal pengeluaran melompat melebihi angka di bawah, transaksi <strong>BUKAN berarti salah atau ditolak</strong>. Sistem hanya memindahkan berkas dari pencairan otomatis ke <strong>Antrean Review Auditor Forensik</strong> untuk memverifikasi dokumen fisik dan kontrak secara manual sebelum kas dicairkan.
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                          <th className="py-2.5 px-3.5">Departemen</th>
                          <th className="py-2.5 px-3 text-center">Rata-rata (&mu;)</th>
                          <th className="py-2.5 px-3.5">Pagu Wajar (3&sigma;)</th>
                          <th className="py-2.5 px-3.5">Cakupan Beban Normal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {Object.entries(DIVISION_LIMITS_MAP).map(([deptName, info]) => (
                          <tr
                            key={deptName}
                            className={`hover:bg-slate-50 transition-colors ${
                              deptName === department ? "bg-blue-50/60 font-semibold" : ""
                            }`}
                          >
                            <td className="py-2.5 px-3.5">
                              <span className="text-slate-900 block">{deptName}</span>
                              {deptName === department && (
                                <span className="text-[10px] text-blue-600 font-bold uppercase">&bull; Divisi Anda Terpilih</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                              Rp {info.mean.toLocaleString("id-ID")}
                            </td>
                            <td className="py-2.5 px-3.5 font-mono font-bold text-blue-700 whitespace-nowrap">
                              Rp {info.limit.toLocaleString("id-ID")}
                            </td>
                            <td className="py-2.5 px-3.5 text-slate-500">
                              {info.desc}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Ringkasan 3 Tier */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm pt-1">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-xs text-slate-500 uppercase font-bold block">Tier 1 &bull; Rutin</span>
                      <span className="font-mono font-bold text-slate-900 block text-base">&lt; Rp 5.000.000</span>
                      <span className="text-xs text-emerald-700 font-semibold block">Bisa Fast-Track Otomatis</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-xs text-slate-500 uppercase font-bold block">Tier 2 &bull; Menengah</span>
                      <span className="font-mono font-bold text-slate-900 block text-base">Rp 5 Jt - Rp 75 Jt</span>
                      <span className="text-xs text-blue-700 font-semibold block">Review Pagu 3&sigma; Auditor</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-xs text-slate-500 uppercase font-bold block">Tier 3 &bull; Khusus</span>
                      <span className="font-mono font-bold text-slate-900 block text-base">&gt; Rp 75.000.000</span>
                      <span className="text-xs text-purple-700 font-semibold block">Otorisasi Direksi & Tender</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center shrink-0">
                  <Link
                    href="/panduan-kepatuhan"
                    className="text-xs text-blue-600 hover:underline font-semibold"
                    target="_blank"
                  >
                    Buka Panduan SOP Lengkap &rarr;
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowSopModal(false)}
                    className="h-9 px-4 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
