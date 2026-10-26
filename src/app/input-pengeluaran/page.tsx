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
} from "lucide-react";

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
    vendor?: string;
    date?: string;
    amount?: number;
    sha256Hash?: string;
    phashFingerprint?: string;
    latencyMs?: number;
    confidence?: number;
    engineUsed?: string;
    fallbackTriggered?: boolean;
    rawText?: string;
  } | null>(null);

  // State Form Transaksi
  const [applicantName, setApplicantName] = useState("Siti Rahma");
  const [department, setDepartment] = useState("IT & Digital");
  const [category, setCategory] = useState("hardware");
  const [vendor, setVendor] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setApplicantName(user.name);
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

  if (user && user.role !== "STAFF") {
    return (
      <>
        <Navbar currentRole="STAFF" />
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
          vendor: d.vendor,
          date: d.date,
          amount: d.amount,
          sha256Hash: d.sha256Hash,
          phashFingerprint: d.phashFingerprint,
          latencyMs: d.latencyMs,
          confidence: d.confidence,
          engineUsed: d.engineUsed,
          fallbackTriggered: d.fallbackTriggered,
          rawText: d.rawText,
        });

        if (d.vendor) setVendor(d.vendor);
        if (d.date) setDate(d.date);
        if (d.amount) setAmount(d.amount);
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
    if (!vendor || !amount) {
      alert("Harap lengkapi nama vendor dan nominal transaksi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        applicantName,
        department,
        category,
        vendor,
        amount: Number(amount),
        date,
        description: description || "Pengeluaran operasional kedinasan",
        receipt: ocrData
          ? {
              imageUrl: previewUrl || "/sample-receipt.jpg",
              ocrRawText: ocrData.rawText || "",
              extractedVendor: ocrData.vendor || vendor,
              extractedDate: ocrData.date || date,
              extractedAmount: ocrData.amount || Number(amount),
              phashFingerprint: ocrData.phashFingerprint || "0000000000000000",
              sha256Hash: ocrData.sha256Hash || "sha256-dummy",
              fileSizeKb: file ? Math.round(file.size / 1024) : 100,
              ocrConfidence: ocrData.confidence || 0.95,
              ocrLatencyMs: ocrData.latencyMs || 500,
            }
          : undefined,
      };

      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSubmissionResult({
          code: json.data.code,
          status: json.data.status,
          riskScore: json.data.fraudAnalysis?.riskScore || 0,
          riskLevel: json.data.fraudAnalysis?.riskLevel || "LOW",
          reasonXai: json.data.fraudAnalysis?.reasonXai || "Evaluasi selesai.",
          isAutoApproved: json.data.status === "AUTO_APPROVED",
        });
      }
    } catch (err) {
      console.error("Error submit single:", err);
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
      if (json.success) {
        alert(`Berhasil memproses ${csvRows.length} transaksi massal.`);
        router.push("/beranda-staf");
      }
    } catch (err) {
      console.error("Error bulk CSV:", err);
    } finally {
      setBulkSubmitting(false);
    }
  };

  return (
    <>
      <Navbar currentRole="STAFF" />

      <main className="w-full min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-16 bg-slate-50">
        <div className="w-full max-w-7xl mx-auto space-y-6 pt-2">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider mb-1 font-semibold">
                <span>Modul Kas</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-blue-600 font-semibold">Pengajuan Baru</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Pengajuan Pengeluaran Kas
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Unggah bukti kuitansi fisik dan periksa rincian data transaksi sebelum dievaluasi sistem AI
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setMode("SINGLE")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all inline-flex items-center gap-2 ${
                  mode === "SINGLE"
                    ? "bg-white text-blue-700 shadow-xs border border-slate-200/60"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Scan className="w-4 h-4 shrink-0" />
                <span>Kuitansi + AI OCR</span>
              </button>
              <button
                type="button"
                onClick={() => setMode("BULK_CSV")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all inline-flex items-center gap-2 ${
                  mode === "BULK_CSV"
                    ? "bg-white text-blue-700 shadow-xs border border-slate-200/60"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Table className="w-4 h-4 shrink-0" />
                <span>Impor CSV Massal</span>
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

                      {/* OCR Result Chips */}
                      {ocrData && (
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col gap-2">
                          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                            Data Terdeteksi Otomatis:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono text-xs font-semibold border border-slate-200">
                              {ocrData.vendor}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono text-xs font-semibold border border-slate-200">
                              {ocrData.date}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold text-xs border border-blue-200">
                              Rp {(ocrData.amount || 0).toLocaleString("id-ID")}
                            </span>
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

                    {/* Divisi */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Divisi Pemohon <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-lg bg-slate-50 text-slate-900 text-sm border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none cursor-pointer"
                      >
                        <option value="IT & Digital">IT & Digital</option>
                        <option value="TI & Infrastruktur">TI & Infrastruktur</option>
                        <option value="Pengadaan & Logistik">Pengadaan & Logistik</option>
                        <option value="Pemasaran & Humas">Pemasaran & Humas</option>
                        <option value="Operasional">Operasional</option>
                      </select>
                    </div>

                    {/* Kategori */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Kategori Belanja <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-lg bg-slate-50 text-slate-900 text-sm border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none cursor-pointer"
                      >
                        <option value="hardware">Hardware & Komputer</option>
                        <option value="konsumsi">Konsumsi & Rapat</option>
                        <option value="transportasi">Transportasi & Akomodasi</option>
                        <option value="atk">Alat Tulis Kantor (ATK)</option>
                        <option value="entertainment">Entertainment / Representasi</option>
                        <option value="operasional">Operasional Rutin</option>
                      </select>
                    </div>

                    {/* Tanggal */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Tanggal Transaksi <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-lg bg-slate-50 text-slate-900 text-sm border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all font-mono"
                      />
                    </div>

                    {/* Vendor */}
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                        <span>Nama Toko / Rekanan Vendor <span className="text-rose-500">*</span></span>
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

                    {/* Nominal */}
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                        <span>Nominal Transaksi (IDR) <span className="text-rose-500">*</span></span>
                        <span className="text-xs text-emerald-700 font-medium">
                          Plafon Fast-Track Auto Approval: &lt; Rp 5.000.000
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
                          placeholder="4750000"
                          className="w-full h-10 pl-11 pr-3.5 rounded-lg bg-slate-50 text-slate-900 font-mono font-bold text-base border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                        />
                      </div>
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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div
                    className={`w-10 h-10 rounded-xl inline-flex items-center justify-center text-white shrink-0 shadow-xs ${
                      submissionResult.isAutoApproved ? "bg-emerald-600" : "bg-rose-600"
                    }`}
                  >
                    {submissionResult.isAutoApproved ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
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
                        : "bg-rose-50 border-rose-200 text-rose-900"
                    }`}
                  >
                    <div className="font-bold text-sm mb-1">
                      {submissionResult.isAutoApproved
                        ? "Disetujui Otomatis (Fast-Track Auto Approval)"
                        : "Masuk Antrean Review Auditor Forensik"}
                    </div>
                    {submissionResult.reasonXai}
                  </div>

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
                          : "bg-rose-100 text-rose-800"
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
        </div>
      </main>
    </>
  );
}
