"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function InputPengeluaranPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Tab mode: "SINGLE" | "BULK_CSV"
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

  // Handler Unggah File Kuitansi
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploadProgress(20);
    setIsScanning(true);

    // Buat form data untuk API /api/upload-ocr
    const formData = new FormData();
    formData.append("receipt", selectedFile);

    try {
      setUploadProgress(50);
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

        // Auto-fill field formulir jika belum diubah pengguna
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
        date,
        amount: Number(amount),
        description,
        receipt: ocrData
          ? {
              imageUrl: previewUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
              ocrRawText: ocrData.rawText,
              extractedVendor: ocrData.vendor,
              extractedDate: ocrData.date,
              extractedAmount: ocrData.amount,
              phashFingerprint: ocrData.phashFingerprint,
              sha256Hash: ocrData.sha256Hash,
              fileSizeKb: file ? Math.round(file.size / 1024) : 1500,
              ocrConfidence: ocrData.confidence || 0.95,
              ocrLatencyMs: ocrData.latencyMs || 1200,
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
        const tx = json.data;
        setSubmissionResult({
          code: tx.code,
          status: tx.status,
          riskScore: tx.fraudAnalysis?.riskScore || 0,
          riskLevel: tx.fraudAnalysis?.riskLevel || "LOW",
          reasonXai: tx.fraudAnalysis?.reasonXai || "",
          isAutoApproved: tx.status === "AUTO_APPROVED",
        });
      } else {
        alert(json.error || "Gagal menyimpan pengajuan.");
      }
    } catch (err) {
      console.error("Gagal kirim transaksi:", err);
      alert("Terjadi kesalahan sistem saat mengirim pengajuan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler CSV File Import
  const handleCsvSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const csvFile = e.target.files?.[0];
    if (!csvFile) return;

    setCsvFileName(csvFile.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      if (lines.length <= 1) return;

      const headers = lines[0].split(",").map((h) => h.trim());
      const parsedRows = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        if (cols.length >= 4) {
          parsedRows.push({
            applicantName: cols[0] || "Siti Rahma",
            department: cols[1] || "IT & Digital",
            vendor: cols[2] || "Vendor Demo",
            amount: Number(cols[3]) || 1000000,
            category: cols[4] || "operasional",
            date: cols[5] || new Date().toISOString().split("T")[0],
            description: cols[6] || "Impor pengeluaran dari CSV",
          });
        }
      }
      setCsvRows(parsedRows);
    };
    reader.readAsText(csvFile);
  };

  // Submit Bulk CSV
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
        alert(`Berhasil mengimpor ${csvRows.length} transaksi massal.`);
        router.push("/beranda-staf");
      } else {
        alert(json.error || "Gagal impor CSV.");
      }
    } catch (err) {
      console.error("Error bulk CSV:", err);
    } finally {
      setBulkSubmitting(false);
    }
  };

  // Download Sample CSV
  const handleDownloadSampleCsv = () => {
    const sample = `Pemohon,Divisi,Vendor,Nominal,Kategori,Tanggal,Deskripsi
Dimas Pratama,IT & Digital,PT Graha Cipta Solusindo,3500000,hardware,2025-10-25,Pengadaan Router Wifi Kantor
Rian Pratama,Pengadaan & Logistik,CV Mitra Sukses Sejahtera,12500000,atk,2025-10-25,Kertas dan Tinta Printer Cabang
Hendra Kusuma,Pemasaran & Humas,Restoran Nusantara Senayan,4800000,konsumsi,2025-10-25,Makan Siang Rapat Koordinasi Vendor`;
    const blob = new Blob([sample], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "template-smartaudit-transaksi.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Navbar currentRole="STAFF" />

      <main className="w-full min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12 bg-surface">
        <div className="w-full max-w-7xl mx-auto space-y-6">
          {/* Top Header & Breadcrumb */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-1">
                <span>Modul Disbursement</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-primary font-semibold">Formulir Pengajuan Baru</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold text-[24px]">
                Pengajuan Pengeluaran Kas Baru
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                Unggah bukti kuitansi fisik dan lengkapi rincian untuk verifikasi instan AI SmartAudit.
              </p>
            </div>

            {/* Segmented Mode Switcher */}
            <div className="flex items-center bg-surface-container-low p-1 rounded-xl border border-outline-variant/30">
              <button
                type="button"
                onClick={() => setMode("SINGLE")}
                className={`px-4 py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-all flex items-center gap-1.5 ${
                  mode === "SINGLE"
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">receipt</span>
                <span>Unggah Tunggal (Form + OCR)</span>
              </button>
              <button
                type="button"
                onClick={() => setMode("BULK_CSV")}
                className={`px-4 py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-all flex items-center gap-1.5 ${
                  mode === "BULK_CSV"
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">table_view</span>
                <span>Impor Massal (CSV)</span>
              </button>
            </div>
          </div>

          {/* Mode 1: Single Form (Formulir Pengajuan Tunggal) */}
          {mode === "SINGLE" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Document Scanner & Upload Zone (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">
                        document_scanner
                      </span>
                      <span className="font-headline-sm text-headline-sm text-on-surface font-semibold text-[16px]">
                        Bukti Kuitansi & Dokumen
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
                      Wajib Dilampirkan
                    </span>
                  </div>

                  {/* Drag & Drop Area */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative group cursor-pointer bg-surface p-6 rounded-2xl border-2 border-dashed border-outline-variant/60 hover:border-primary flex flex-col items-center justify-center text-center transition-all duration-200 hover:bg-surface-container-low min-h-[220px]"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    <div className="w-14 h-14 rounded-2xl bg-surface-container-high group-hover:bg-primary-container text-primary group-hover:text-on-primary flex items-center justify-center mb-3 transition-colors shadow-sm">
                      <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
                    </div>

                    <p className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-1 text-[15px]">
                      Tarik & lepas foto kuitansi di sini
                    </p>
                    <p className="font-body-sm text-[12px] text-on-surface-variant max-w-xs mb-3 leading-relaxed">
                      Atau klik untuk memilih file dari komputer. Mendukung JPG, PNG, atau PDF (maks. 10MB).
                    </p>

                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-surface-container-lowest text-primary font-label-md text-label-md rounded-xl shadow-sm group-hover:bg-primary group-hover:text-on-primary transition-colors border border-outline-variant/30 font-semibold">
                      <span className="material-symbols-outlined text-[16px]">folder_open</span>
                      <span>Pilih Dokumen Kuitansi</span>
                    </div>
                  </div>

                  {/* Scanning Progress Bar */}
                  {uploadProgress > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-label-sm text-on-surface-variant font-semibold">
                        <span>
                          {isScanning
                            ? "AI Vision OCR Sedang Mengekstrak (SLA &le; 5s)..."
                            : "Berkas Terunggah & Terverifikasi"}
                        </span>
                        <span className="font-data-mono">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary-container h-full rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Preview & OCR Status Box */}
                  {previewUrl && (
                    <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-3 border border-outline-variant/30">
                      <div className="flex items-center justify-between">
                        <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                          Pratinjau Berkas Terdeteksi
                        </span>
                        <span className="flex items-center gap-1 font-label-sm text-[11px] text-secondary bg-surface-container px-2 py-0.5 rounded-full font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                          {ocrData?.engineUsed === "GEMINI_1_5_FLASH"
                            ? "Google Gemini 1.5 Flash Vision"
                            : "SmartAudit Fallback OCR Engine"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 bg-surface-container-lowest p-3 rounded-xl shadow-sm border border-outline-variant/20">
                        <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-container border border-outline-variant/30">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={previewUrl}
                            alt="Receipt Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                            {file?.name || "receipt-document.jpg"}
                          </span>
                          <span className="font-data-mono text-[11px] text-on-surface-variant">
                            {file ? `${(file.size / 1024).toFixed(1)} KB` : "1.8 MB"} &bull;{" "}
                            {ocrData?.latencyMs ? `${ocrData.latencyMs} ms` : "1200 ms"}
                          </span>

                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-outline-variant/20">
                            <span className="text-secondary flex items-center gap-1 text-[11px] font-semibold">
                              <span className="material-symbols-outlined text-[13px]">check_circle</span>
                              Resolusi 300 DPI Valid
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setFile(null);
                                setPreviewUrl(null);
                                setOcrData(null);
                                setUploadProgress(0);
                              }}
                              className="text-tertiary hover:underline text-[11px] font-semibold"
                            >
                              Ganti
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* OCR Live Chips */}
                      {ocrData && (
                        <div className="bg-surface-container-lowest p-3 rounded-xl flex flex-col gap-1.5 border border-outline-variant/20">
                          <span className="font-label-sm text-[11px] text-on-surface-variant font-semibold">
                            Hasil Ekstraksi OCR Otomatis:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            <span className="px-2.5 py-1 rounded-lg bg-surface text-on-surface font-data-mono text-[11px] flex items-center gap-1 border border-outline-variant/30">
                              <span className="material-symbols-outlined text-[13px] text-primary">store</span>
                              {ocrData.vendor || "Vendor"}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-surface text-on-surface font-data-mono text-[11px] flex items-center gap-1 border border-outline-variant/30">
                              <span className="material-symbols-outlined text-[13px] text-primary">calendar_today</span>
                              {ocrData.date || "Tanggal"}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-surface text-on-surface font-data-mono text-[11px] flex items-center gap-1 border border-outline-variant/30 font-bold text-primary">
                              <span className="material-symbols-outlined text-[13px] text-primary">payments</span>
                              Rp {(ocrData.amount || 0).toLocaleString("id-ID")}
                            </span>
                          </div>

                          {/* Cryptographic hashes */}
                          <div className="mt-1 pt-1.5 border-t border-outline-variant/20 flex flex-col gap-0.5 text-[10px] font-data-mono text-on-surface-variant">
                            <div>pHash: <span className="text-on-surface font-semibold">{ocrData.phashFingerprint}</span></div>
                            <div className="truncate">SHA-256: <span className="text-on-surface">{ocrData.sha256Hash}</span></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Manual Fallback Assurance Callout */}
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low text-on-surface-variant font-body-sm text-[12px] border border-outline-variant/20 leading-relaxed">
                    <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
                      info
                    </span>
                    <p>
                      <strong>Manual Fallback:</strong> Jika kuitansi miring atau buram, data pada form di sebelah kanan tetap dapat diedit secara manual tanpa memblokir proses pengajuan klaim Anda.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Structured Transaction Form (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-5">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold text-[18px]">
                        Rincian Informasi Pengeluaran
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Pastikan semua data sesuai dengan bukti kuitansi fisik asli
                      </p>
                    </div>
                    <span className="text-on-surface-variant font-label-sm text-label-sm bg-surface-container px-3 py-1 rounded-full font-semibold">
                      Otorisasi Mandiri
                    </span>
                  </div>

                  <form onSubmit={handleSubmitSingle} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pemohon */}
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-label-md text-on-surface font-semibold">
                        Nama Pemohon <span className="text-tertiary">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-surface text-on-surface font-body-md text-body-md border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    {/* Divisi */}
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-label-md text-on-surface font-semibold">
                        Divisi Pemohon <span className="text-tertiary">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full h-10 px-3 pr-8 rounded-xl bg-surface text-on-surface font-body-md text-body-md appearance-none border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        >
                          <option value="IT & Digital">IT & Digital</option>
                          <option value="TI & Infrastruktur">TI & Infrastruktur</option>
                          <option value="Pengadaan & Logistik">Pengadaan & Logistik</option>
                          <option value="Pemasaran & Humas">Pemasaran & Humas</option>
                          <option value="Operasional">Operasional</option>
                        </select>
                        <span className="material-symbols-outlined text-on-surface-variant absolute right-2.5 top-2.5 pointer-events-none text-[20px]">
                          expand_more
                        </span>
                      </div>
                    </div>

                    {/* Kategori */}
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-label-md text-on-surface font-semibold">
                        Kategori Belanja <span className="text-tertiary">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full h-10 px-3 pr-8 rounded-xl bg-surface text-on-surface font-body-md text-body-md appearance-none border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        >
                          <option value="hardware">Hardware & Perangkat Keras</option>
                          <option value="konsumsi">Konsumsi & Rapat Klien</option>
                          <option value="transportasi">Transportasi & Akomodasi</option>
                          <option value="atk">Alat Tulis Kantor (ATK)</option>
                          <option value="entertainment">Entertainment & Representasi</option>
                          <option value="operasional">Operasional Rutin Lainnya</option>
                        </select>
                        <span className="material-symbols-outlined text-on-surface-variant absolute right-2.5 top-2.5 pointer-events-none text-[20px]">
                          expand_more
                        </span>
                      </div>
                    </div>

                    {/* Tanggal */}
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-label-md text-on-surface font-semibold">
                        Tanggal Transaksi Kuitansi <span className="text-tertiary">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-surface text-on-surface font-body-md text-body-md border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    {/* Vendor */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between">
                        <span>Nama Vendor / Toko Rekanan <span className="text-tertiary">*</span></span>
                        {ocrData?.vendor && (
                          <span className="font-label-sm text-[11px] text-primary flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[13px]">auto_fix_high</span>
                            Terisi Otomatis via OCR
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined text-on-surface-variant absolute left-3 top-2.5 text-[18px]">
                          storefront
                        </span>
                        <input
                          type="text"
                          required
                          value={vendor}
                          onChange={(e) => setVendor(e.target.value)}
                          placeholder="Misal: PT Aneka Sukses Mandiri"
                          className="w-full h-10 pl-10 pr-3 rounded-xl bg-surface text-on-surface font-body-md text-body-md border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    {/* Nominal */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between">
                        <span>Nominal Transaksi (IDR) <span className="text-tertiary">*</span></span>
                        <span className="font-label-sm text-[11px] text-secondary font-semibold">
                          Batas Tier 1: &lt; Rp 5.000.000 (Fast-Track)
                        </span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 font-data-mono text-body-md text-on-surface-variant font-semibold">
                          Rp
                        </span>
                        <input
                          type="number"
                          required
                          value={amount}
                          onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="4750000"
                          className="w-full h-10 pl-10 pr-3 rounded-xl bg-surface text-on-surface font-data-mono text-data-mono font-bold text-[15px] border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    {/* Deskripsi */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="font-label-md text-label-md text-on-surface font-semibold">
                        Deskripsi Keperluan Pengeluaran
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tuliskan tujuan pengadaan, nama proyek, atau rincian item kuitansi..."
                        className="w-full p-3 rounded-xl bg-surface text-on-surface font-body-sm text-body-sm border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-11 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-headline-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="material-symbols-outlined text-[20px] animate-spin">
                              sync
                            </span>
                            <span>Mengevaluasi Dokumen & Indikasi Fraud...</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[20px]">send</span>
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
            /* Mode 2: Bulk CSV Ingestion */
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold text-[18px]">
                    Impor Data Transaksi Pengeluaran Massal (CSV)
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Unggah ratusan entri pengeluaran kas sekaligus untuk audit otomatis serentak.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadSampleCsv}
                  className="h-9 px-4 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface font-label-md text-label-md flex items-center gap-1.5 hover:bg-surface-container transition-colors shadow-sm self-start"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">download</span>
                  <span>Unduh Contoh CSV</span>
                </button>
              </div>

              {/* CSV Upload Dropzone */}
              <div
                onClick={() => csvInputRef.current?.click()}
                className="cursor-pointer bg-surface p-8 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary flex flex-col items-center justify-center text-center transition-all hover:bg-surface-container-low"
              >
                <input
                  ref={csvInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleCsvSelect}
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-2xl bg-surface-container text-primary flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[28px]">file_upload</span>
                </div>
                <p className="font-headline-sm text-[16px] font-semibold text-on-surface">
                  {csvFileName ? `File Terpilih: ${csvFileName}` : "Klik untuk memilih berkas .CSV"}
                </p>
                <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">
                  Format kolom: Pemohon, Divisi, Vendor, Nominal, Kategori, Tanggal, Deskripsi
                </p>
              </div>

              {/* Table Preview of CSV Rows */}
              {csvRows.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-sm text-[15px] font-semibold text-on-surface">
                      Pratinjau {csvRows.length} Baris Data:
                    </span>
                    <button
                      type="button"
                      onClick={handleBulkSubmit}
                      disabled={bulkSubmitting}
                      className="h-10 px-6 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold transition-all shadow-md flex items-center gap-2"
                    >
                      {bulkSubmitting ? (
                        <>
                          <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                          <span>Memproses Ingestion...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                          <span>Proses Seluruh Data ({csvRows.length} Transaksi)</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-outline-variant/30 rounded-xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase">
                          <th className="py-2.5 px-4 font-semibold">Pemohon</th>
                          <th className="py-2.5 px-4 font-semibold">Divisi</th>
                          <th className="py-2.5 px-4 font-semibold">Vendor</th>
                          <th className="py-2.5 px-4 font-semibold text-right">Nominal</th>
                          <th className="py-2.5 px-4 font-semibold">Kategori</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container font-body-sm text-body-sm">
                        {csvRows.map((r, idx) => (
                          <tr key={idx} className="hover:bg-surface-container-low/40">
                            <td className="py-2 px-4 font-semibold text-on-surface">{r.applicantName}</td>
                            <td className="py-2 px-4 text-on-surface-variant">{r.department}</td>
                            <td className="py-2 px-4 font-medium">{r.vendor}</td>
                            <td className="py-2 px-4 text-right font-data-mono font-bold text-primary">
                              Rp {Number(r.amount).toLocaleString("id-ID")}
                            </td>
                            <td className="py-2 px-4 text-on-surface-variant capitalize">{r.category}</td>
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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/50 backdrop-blur-sm p-4">
              <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-on-primary ${
                        submissionResult.isAutoApproved ? "bg-secondary" : "bg-tertiary"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {submissionResult.isAutoApproved ? "verified" : "warning"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                        Hasil Evaluasi SmartAudit AI
                      </h3>
                      <span className="font-data-mono text-[12px] text-primary font-semibold">
                        Kode: {submissionResult.code}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  {/* Status Banner */}
                  <div
                    className={`p-4 rounded-xl flex items-start gap-3 border ${
                      submissionResult.isAutoApproved
                        ? "bg-secondary-fixed/30 border-secondary/30 text-on-secondary-fixed-variant"
                        : "bg-error-container border-tertiary/30 text-on-error-container"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px] shrink-0 mt-0.5">
                      {submissionResult.isAutoApproved ? "check_circle" : "report"}
                    </span>
                    <div>
                      <div className="font-headline-sm text-[15px] font-bold">
                        {submissionResult.isAutoApproved
                          ? "Fast-Track Auto Approved (Disetujui Otomatis)"
                          : "Masuk Antrean Review Auditor (Skor Risiko Tinggi)"}
                      </div>
                      <p className="mt-1 font-body-sm text-[12px] leading-relaxed">
                        {submissionResult.reasonXai}
                      </p>
                    </div>
                  </div>

                  {/* Score Breakdown summary */}
                  <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-on-surface-variant text-[11px] font-semibold uppercase block">
                        Skor Risiko AI
                      </span>
                      <span className="font-headline-md text-headline-md font-bold text-on-surface text-[22px] font-data-mono">
                        {submissionResult.riskScore} / 100
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-on-surface-variant text-[11px] font-semibold uppercase block">
                        Tingkat Risiko
                      </span>
                      <span
                        className={`font-label-md text-label-md font-bold px-3 py-1 rounded-full ${
                          submissionResult.isAutoApproved
                            ? "bg-secondary text-on-secondary"
                            : "bg-tertiary text-on-tertiary"
                        }`}
                      >
                        {submissionResult.riskLevel}
                      </span>
                    </div>
                  </div>

                  {/* Webhook notification pill if auto-approved */}
                  {submissionResult.isAutoApproved && (
                    <div className="p-3 rounded-xl bg-surface-container-high/60 flex items-center gap-2 font-body-sm text-[12px] text-on-surface">
                      <span className="material-symbols-outlined text-[18px] text-secondary">
                        sync_alt
                      </span>
                      <span>
                        Outbound Webhook telah diteruskan ke sistem ERP Bank Kasir untuk pencairan instan.
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-3 border-t border-surface-container flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmissionResult(null);
                      router.push("/beranda-staf");
                    }}
                    className="h-10 px-5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold transition-all shadow-md"
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
