"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import AuditorSidebar from "@/components/AuditorSidebar";
import { useAuth } from "@/lib/auth";
import {
  ShieldCheck,
  Zap,
  Users,
  FileWarning,
  CheckCircle2,
  Copy,
  Split,
  TrendingUp,
  AlertTriangle,
  Moon,
  Hash,
  ArrowRight,
  Plus,
  Inbox,
  Gavel,
  ShieldAlert,
  Ban,
  FileText,
  Clock,
  Building,
  Info,
  Check,
  Receipt,
  FileSpreadsheet,
} from "lucide-react";
import { DEPARTMENT_SOP_LIMITS_ARRAY } from "@/lib/division-limits";

const DEPARTMENT_SOP_LIMITS = DEPARTMENT_SOP_LIMITS_ARRAY;

export default function PanduanKepatuhanPage() {
  const { user } = useAuth();
  const isAuditor = user?.role === "AUDITOR";

  if (isAuditor) {
    // ==========================================
    // DIMENSI AUDITOR: SOP AUDIT FORENSIK KAS
    // ==========================================
    return (
      <>
        <Navbar currentRole="AUDITOR" />
        <AuditorSidebar />

        <div className="lg:pl-64 flex flex-col min-h-screen bg-slate-50 pt-16 pb-20">
          {/* Header Dimensi Auditor */}
          <section className="w-full bg-white px-6 sm:px-8 lg:px-12 py-5 border-b border-slate-200">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 inline-flex items-center justify-center border border-rose-200 shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Pedoman SOP Audit Forensik
                    </h1>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200 whitespace-nowrap">
                      ISO 27001
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Prosedur Adjudikasi, Standar Pembobotan Risiko & Kebijakan Pembatalan Webhook
                  </p>
                </div>
              </div>

              <Link
                href="/antrean-review"
                prefetch={false}
                className="h-10 px-5 bg-rose-600 text-white text-sm rounded-xl inline-flex items-center gap-2 hover:bg-rose-700 transition-colors font-bold cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
              >
                <Inbox className="w-4 h-4" />
                <span>Buka Antrean Review</span>
              </Link>
            </div>
          </section>

          {/* Content Dimensi Auditor */}
          <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 py-8 flex flex-col gap-10">
            {/* Section 1: Matriks Poin Pelanggaran Fraud Engine */}
            <section className="flex flex-col gap-5">
              <div>
                <span className="text-xs sm:text-sm text-rose-600 uppercase tracking-wider font-bold">
                  Rule-Based & AI Forensics
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  Matriks Parameter & Poin Pembobotan Fraud
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Formula Evaluasi Otomatis:{" "}
                  <code className="font-mono text-slate-900 bg-slate-200/80 px-2 py-0.5 rounded font-bold text-xs sm:text-sm">
                    Skor Akhir = MIN(100, &Sigma; Poin Pelanggaran)
                  </code>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Rule 1 */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs sm:text-sm font-mono font-bold border border-rose-200">
                        +40 Poin
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                        <Copy className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      Duplikasi Dokumen Grafis & Teks
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Kemiripan visual perceptual hash (pHash 64-bit) &ge; 85% terhadap kuitansi lama, atau kesamaan eksak kombinasi Vendor + Tanggal + Nominal di basis data.
                    </p>
                  </div>
                  <div className="mt-5 pt-3.5 border-t border-slate-100 text-xs sm:text-sm text-slate-600 font-medium">
                    <strong className="text-slate-800">Tindakan SOP:</strong> Wajib pengujian fisik kuitansi asli dan telusuri ID pengajuan lama.
                  </div>
                </div>

                {/* Rule 2 */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs sm:text-sm font-mono font-bold border border-amber-200">
                        +35 Poin
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                        <Split className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      Indikasi Split Bill (Pemecahan Nota)
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Pengajuan beruntun ke vendor yang sama dalam selisih waktu &lt; 2 jam, atau mendekati ambang batas limitasi plafon Tier 01 (&lt; Rp 5 Jt).
                    </p>
                  </div>
                  <div className="mt-5 pt-3.5 border-t border-slate-100 text-xs sm:text-sm text-slate-600 font-medium">
                    <strong className="text-slate-800">Tindakan SOP:</strong> Telusuri riwayat transaksi pemohon dan gabungkan berkas menjadi satu pengajuan.
                  </div>
                </div>

                {/* Rule 3 */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs sm:text-sm font-mono font-bold border border-amber-200">
                        +25 Poin
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      Anomali Nominal (&gt; 3 Sigma Deviasi)
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Nominal transaksi melompat melebihi 3 standar deviasi dari batas pengeluaran wajar historis per divisi pemohon (Pagu: Rp 35 Jt s/d Rp 75 Jt, Plafon Maksimal Auto-Approve Rp 75 Jt).
                    </p>
                  </div>
                  <div className="mt-5 pt-3.5 border-t border-slate-100 text-xs sm:text-sm text-slate-600 font-medium">
                    <strong className="text-slate-800">Tindakan SOP:</strong> Verifikasi SPK/kontrak kerja sama dan cocokkan alokasi pagu divisi.
                  </div>
                </div>

                {/* Rule 4 */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs sm:text-sm font-mono font-bold border border-blue-200">
                        +20 Poin
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      Kategori Beban Berisiko Tinggi
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Pengeluaran kategori entertainment, lounge mewah, representasi pribadi, karaoke, atau spa tanpa surat penugasan resmi pimpinan.
                    </p>
                  </div>
                  <div className="mt-5 pt-3.5 border-t border-slate-100 text-xs sm:text-sm text-slate-600 font-medium">
                    <strong className="text-slate-800">Tindakan SOP:</strong> Verifikasi surat tugas dinas, daftar tamu yang diundang, dan memo persetujuan.
                  </div>
                </div>

                {/* Rule 5 */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs sm:text-sm font-mono font-bold border border-indigo-200">
                        +15 Poin
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                        <Moon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      Pengajuan Di Luar Jam/Hari Kerja
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Pengunggahan berkas pada dini hari (21:00 - 05:00 WIB) atau pada hari libur akhir pekan tanpa lampiran Surat Perintah Kerja Lembur.
                    </p>
                  </div>
                  <div className="mt-5 pt-3.5 border-t border-slate-100 text-xs sm:text-sm text-slate-600 font-medium">
                    <strong className="text-slate-800">Tindakan SOP:</strong> Verifikasi surat perintah lembur yang ditandatangani atasan langsung.
                  </div>
                </div>

                {/* Rule 6 */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs sm:text-sm font-mono font-bold border border-slate-200">
                        +10 Poin
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
                        <Hash className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      Nominal Bulat Tanpa Rincian Pajak
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Nominal pengeluaran &ge; Rp 5.000.000 dalam angka bulat penuh tanpa komponen rincian PPN 11% atau potongan PPh yang lazim.
                    </p>
                  </div>
                  <div className="mt-5 pt-3.5 border-t border-slate-100 text-xs sm:text-sm text-slate-600 font-medium">
                    <strong className="text-slate-800">Tindakan SOP:</strong> Periksa faktur pajak elektronik (e-Faktur) dan bukti potong PPh.
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Prosedur Adjudikasi BAP & Pembatalan Webhook */}
            <section className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 shrink-0">
                  <Gavel className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    Prosedur Adjudikasi & Pembatalan Webhook Otomatis (ISO 27001)
                  </h3>
                  <p className="text-sm text-slate-500">
                    Standar Operasional Auditor Forensik saat mengambil keputusan final penjaminan kas
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">
                <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <span className="font-extrabold block text-base text-emerald-900">
                      1. Putusan Disetujui (APPROVED)
                    </span>
                    <p className="leading-relaxed text-emerald-800">
                      Diterapkan jika hasil inspeksi <em>side-by-side</em> membuktikan faktur fisik asli, nomor faktur valid, dan tidak ada klaim ganda.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-100/70 border border-emerald-300/80 text-xs sm:text-sm font-semibold text-emerald-900">
                    Aksi Sistem: Webhook ERP bank kasir ditembak otomatis untuk pencairan seketika.
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <span className="font-extrabold block text-base text-rose-900">
                      2. Putusan Ditolak (REJECTED)
                    </span>
                    <p className="leading-relaxed text-rose-800">
                      Jika terbukti ada rekayasa dokumen, nota palsu, atau pemecahan nota (split bill).
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-rose-100/70 border border-rose-300/80 text-xs sm:text-sm font-semibold text-rose-900">
                    Aksi Sistem: Instruksi Webhook DIBATALKAN / VOID seketika & pemohon dicatat di log audit.
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <span className="font-extrabold block text-base text-amber-900">
                      3. Minta Klarifikasi (NEED CLARIFICATION)
                    </span>
                    <p className="leading-relaxed text-amber-800">
                      Jika bukti fisik terpotong, buram, atau faktur memerlukan konfirmasi spesifikasi barang kepada kepala bagian pemohon.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-100/70 border border-amber-300/80 text-xs sm:text-sm font-semibold text-amber-900">
                    Aksi Sistem: Berkas dikembalikan ke pemohon untuk pengunggahan ulang dokumen pendukung.
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </>
    );
  }

  // ==========================================
  // DIMENSI STAF: SOP PENGAJUAN PENGELUARAN KAS
  // ==========================================
  return (
    <>
      <Navbar currentRole="STAFF" />

      <main className="w-full pt-16 bg-slate-50 min-h-screen pb-20">
        {/* Banner Dimensi Staf */}
        <section className="w-full bg-white px-6 sm:px-8 lg:px-12 py-5 border-b border-slate-200">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 inline-flex items-center justify-center border border-blue-200 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Panduan SOP Pengajuan Kas
                  </h1>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200 whitespace-nowrap">
                    Staf Keuangan & Operasional
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">
                  Standar Tingkat Otorisasi, Pagu 3-Sigma Deviasi per Divisi & Dokumen Persyaratan Fisik
                </p>
              </div>
            </div>

            <Link
              href="/input-pengeluaran"
              prefetch={false}
              className="h-10 px-5 bg-blue-600 text-white text-sm rounded-xl inline-flex items-center gap-2 hover:bg-blue-700 transition-colors font-bold cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Pengajuan Baru</span>
            </Link>
          </div>
        </section>

        {/* Content Dimensi Staf */}
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 py-8 flex flex-col gap-10">
          
          {/* Section 1: Tier Limit Matrix */}
          <section className="flex flex-col gap-5">
            <div>
              <span className="text-xs sm:text-sm text-blue-600 uppercase tracking-wider font-bold">
                Tingkat Otorisasi Berjenjang
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Matriks Plafon, Alur Pencairan & Dokumen Wajib
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Ketahui alur persetujuan, batas nominal pengajuan kas, serta kelengkapan dokumen yang wajib Anda siapkan.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
              
              {/* Card Tier 01 */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all gap-5">
                <div className="space-y-5">
                  {/* Header Badge & SLA */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs sm:text-sm uppercase font-extrabold border border-emerald-200">
                      Tier 01 &bull; Rutin & Cepat
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      SLA: &lt; 5 Menit
                    </span>
                  </div>

                  {/* Nominal Plafon */}
                  <div>
                    <span className="text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-wider block">
                      Batas Nominal Pengajuan
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight mt-1">
                      &lt; Rp 5.000.000
                    </div>
                    <div className="text-sm font-bold text-emerald-700 mt-1.5 inline-flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-emerald-600" />
                      Fast-Track Auto Approval (Tanpa Antrean)
                    </div>
                  </div>

                  {/* Alur Kas Box */}
                  <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs sm:text-sm text-emerald-950 leading-relaxed space-y-1">
                    <strong className="block font-bold text-emerald-900 text-sm">
                      Mekanisme Pencairan Otomatis:
                    </strong>
                    <p className="text-emerald-900/90">
                      Sistem langsung mengirim instruksi webhook pencairan dana kas ke ERP kasir dalam hitungan detik apabila skor risiko anomali AI &lt; 40 Poin.
                    </p>
                  </div>

                  {/* Checklist Dokumen (Vertikal ke bawah) */}
                  <div className="space-y-2.5 pt-1">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      Persyaratan Dokumen Fisik:
                    </div>
                    <ul className="flex flex-col gap-2.5">
                      <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Struk cetak kasir (thermal receipt) atau nota digital minimal 300 DPI.</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Rincian item belanja, kuantitas (qty), dan harga satuan terbaca jelas oleh AI.</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Stempel toko resmi atau paraf kasir yang sah.</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Diterbitkan pada jam operasional kerja resmi kantor.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Footer Card Catatan Kritis */}
                <div className="pt-3.5 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-600">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Dilarang keras <em>Split Bill</em> (memecah nota) untuk memaksakan masuk ke Tier 01.
                  </span>
                </div>
              </div>

              {/* Card Tier 02 */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all gap-5">
                <div className="space-y-5">
                  {/* Header Badge & SLA */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 text-xs sm:text-sm uppercase font-extrabold border border-blue-200">
                      Tier 02 &bull; Menengah
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      SLA: 1 - 2 Jam
                    </span>
                  </div>

                  {/* Nominal Plafon */}
                  <div>
                    <span className="text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-wider block">
                      Batas Nominal Pengajuan
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight mt-1">
                      Rp 5 Jt - 75 Jt
                    </div>
                    <div className="text-sm font-bold text-blue-700 mt-1.5 inline-flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-600" />
                      Verifikasi Auditor Forensik
                    </div>
                  </div>

                  {/* Alur Kas Box */}
                  <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs sm:text-sm text-blue-950 leading-relaxed space-y-1">
                    <strong className="block font-bold text-blue-900 text-sm">
                      Inspeksi Dokumen Side-by-Side:
                    </strong>
                    <p className="text-blue-900/90">
                      Pengajuan masuk ke Antrean Auditor Forensik untuk verifikasi nomor faktur, NPWP, dan uji keaslian dokumen sebelum pencairan disetujui.
                    </p>
                  </div>

                  {/* Checklist Dokumen (Vertikal ke bawah) */}
                  <div className="space-y-2.5 pt-1">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      Persyaratan Dokumen Fisik:
                    </div>
                    <ul className="flex flex-col gap-2.5">
                      <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 mt-0.5" />
                        <span>Faktur Pajak resmi (e-Faktur) atau Invoice berkop surat rekanan ber-NPWP.</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 mt-0.5" />
                        <span>Surat Perintah Kerja (SPK) atau PO bertanda tangan Kepala Departemen.</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 mt-0.5" />
                        <span>Validasi aritmatika Subtotal, DPP, dan PPN 11% wajib 100% klop.</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 mt-0.5" />
                        <span>Surat jalan / bukti tanda terima barang jika berupa fisik.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Footer Card Catatan Kritis */}
                <div className="pt-3.5 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-600">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Jika nominal &gt; pagu 3-sigma divisi, wajib lampirkan Berita Acara Kebutuhan Khusus.
                  </span>
                </div>
              </div>

              {/* Card Tier 03 */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all gap-5">
                <div className="space-y-5">
                  {/* Header Badge & SLA */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-800 text-xs sm:text-sm uppercase font-extrabold border border-purple-200">
                      Tier 03 &bull; Khusus & Capex
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5 text-purple-600" />
                      SLA: 1 - 3 Hari
                    </span>
                  </div>

                  {/* Nominal Plafon */}
                  <div>
                    <span className="text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-wider block">
                      Batas Nominal Pengajuan
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight mt-1">
                      &gt; Rp 75.000.000
                    </div>
                    <div className="text-sm font-bold text-purple-700 mt-1.5 inline-flex items-center gap-1.5">
                      <FileWarning className="w-4 h-4 text-purple-600" />
                      Otorisasi Direksi & Tender
                    </div>
                  </div>

                  {/* Alur Kas Box */}
                  <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200 text-xs sm:text-sm text-purple-950 leading-relaxed space-y-1">
                    <strong className="block font-bold text-purple-900 text-sm">
                      Adjudikasi Direksi & Audit ISO 27001:
                    </strong>
                    <p className="text-purple-900/90">
                      Memerlukan persetujuan bertingkat Direktur Keuangan (CFO) dan Satuan Audit Forensik. Pembayaran wajib kliring Giro / Transfer bank rekanan PT.
                    </p>
                  </div>

                  {/* Checklist Dokumen (Vertikal ke bawah) */}
                  <div className="space-y-2.5 pt-1">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-600" />
                      Persyaratan Dokumen Fisik:
                    </div>
                    <ul className="flex flex-col gap-2.5">
                      <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 shrink-0 mt-0.5" />
                        <span>Surat Keputusan (SK) Otorisasi Direksi / Surat Persetujuan Dewan.</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 shrink-0 mt-0.5" />
                        <span>Kontrak Kerjasama Pengadaan (PKS) bermeterai Rp 10.000 resmi.</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 shrink-0 mt-0.5" />
                        <span>Berita Acara Serah Terima (BAST) & Berita Acara Uji Kelayakan Barang.</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 shrink-0 mt-0.5" />
                        <span>Salinan buku rekening koran perusahaan rekanan (Bukan perorangan).</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Footer Card Catatan Kritis */}
                <div className="pt-3.5 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-600">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Dilarang pembayaran tunai (cash). Wajib melampirkan minimal 3 penawaran vendor tender.
                  </span>
                </div>
              </div>

            </div>
          </section>

          {/* Section 2: Tabel Pagu Ambang Batas Wajar 3-Sigma per Departemen */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-blue-600 font-bold uppercase tracking-wider mb-1">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span>Aturan Kepatuhan 3-Sigma Deviasi (&mu; + 3&sigma;)</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Pagu Wajar Historis & Batas Pencairan Otomatis per Departemen
                </h3>
                <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-4xl leading-relaxed">
                  Batas di bawah ini dihitung dari rata-rata pengeluaran historis normal divisi (&mu;) ditambah 3 kali standar deviasi (3&sigma;). 
                  <strong> Pengajuan nominal di atas batas ini BUKAN berarti ditolak</strong>, melainkan dialihkan dari pencairan instan ke <strong>Antrean Review Auditor Forensik</strong> untuk pemeriksaan fisik dokumen (SPK/PO/BAST).
                </p>
              </div>

              <div className="px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm shrink-0 self-start sm:self-auto font-bold">
                Plafon Umum Fast-Track: <strong>&lt; Rp 5.000.000</strong>
              </div>
            </div>

            {/* Note Edukasi Transparansi */}
            <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-950 text-sm sm:text-base flex items-start gap-3.5 leading-relaxed">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-amber-950 mb-1">
                  Mengapa Pengajuan Tetap Berstatus Pending Review Meskipun Skor Risiko Rendah (LOW Risk)?
                </strong>
                Pencairan otomatis tanpa verifikasi manusia (*Fast-Track Auto Approval*) memiliki kebijakan <em>zero-tolerance</em> terhadap anomali pagu. 
                Jika nominal melompat di atas batas 3-sigma divisi (misalnya pengajuan &gt; Rp 40.000.000 pada divisi Legal atau melampaui plafon maksimal auto-approval Rp 75.000.000), sistem mengamankan pencairan instan dan memindahkan berkas ke meja Auditor Satuan Audit Penjamin Keuangan sebagai kontrol pengamanan dana kas korporasi.
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold">
                    <th className="py-3.5 px-3 w-12 text-center">No</th>
                    <th className="py-3.5 px-4">Departemen Pemohon</th>
                    <th className="py-3.5 px-3 text-center">Rata-rata (&mu;)</th>
                    <th className="py-3.5 px-3 text-center">Deviasi (&sigma;)</th>
                    <th className="py-3.5 px-4">Pagu Wajar (3&sigma; Max)</th>
                    <th className="py-3.5 px-4">Cakupan Beban Pengeluaran Normal</th>
                    <th className="py-3.5 px-4">Tindakan Jika Melebihi Batas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {DEPARTMENT_SOP_LIMITS.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-3 text-center font-bold text-slate-400 font-mono text-sm">
                        {idx + 1}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-900 text-sm sm:text-base block">{item.name}</span>
                      </td>
                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        <span className="font-mono text-xs sm:text-sm text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                          Rp {item.mean.toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        <span className="font-mono text-xs sm:text-sm text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                          Rp {item.sigma.toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 text-sm sm:text-base inline-block">
                          Rp {item.limit.toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600 leading-relaxed text-sm">
                        {item.scope}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold border border-slate-200 text-xs sm:text-sm">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                          {item.action}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Ketentuan & Larangan Pengajuan */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 shrink-0">
                <Ban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Larangan Mutlak Pengajuan Kas (Pelanggaran Berat)
                </h3>
                <p className="text-sm text-slate-500">
                  Pelanggaran berikut akan langsung dideteksi oleh mesin forensik dan dikenai sanksi audit korporasi
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-base block">Dilarang Split Bill (Pemecahan Nota)</span>
                  <span className="px-2.5 py-0.5 rounded bg-rose-100 text-rose-800 font-mono font-bold text-xs">+35 Poin</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Memecah transaksi bernilai besar menjadi beberapa struk kecil di bawah Rp 5 Jt untuk menghindari persetujuan atasan adalah pelanggaran SOP berat dan akan terdeteksi otomatis oleh AI SmartAudit.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-base block">Dilarang Pengajuan Ganda (Duplikasi)</span>
                  <span className="px-2.5 py-0.5 rounded bg-rose-100 text-rose-800 font-mono font-bold text-xs">+40 Poin</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Mengajukan kembali foto kuitansi lama yang sudah pernah dicairkan oleh staf lain akan langsung ditandai oleh sistem pemindaian sidik jari gambar (pHash & SHA-256).
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-base block">Dilarang Pengajuan Di Luar Jam Kerja Tanpa SPK</span>
                  <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-bold text-xs">+15 Poin</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Pengajuan kuitansi pada dini hari (21:00 - 05:00 WIB) atau hari libur wajib disertai Surat Perintah Kerja Lembur resmi dari pimpinan unit kerja.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-base block">Dilarang Rekayasa Hitungan Pajak & Faktur Palsu</span>
                  <span className="px-2.5 py-0.5 rounded bg-rose-100 text-rose-800 font-mono font-bold text-xs">+50 Poin (KRITIS)</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Memasukkan faktur dengan nomor NPWP fiktif atau mengubah angka total secara manual yang tidak klop dengan perhitungan aritmatika subtotal + PPN 11% akan membekukan pencairan seketika.
                </p>
              </div>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}