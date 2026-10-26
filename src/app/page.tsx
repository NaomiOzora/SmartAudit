import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  ShieldCheck,
  CheckCircle2,
  Scan,
  Activity,
  FileText,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Cpu,
  Lock,
} from "lucide-react";

export default function LandingPage() {
  return (
    <>
      <Navbar currentRole="GUEST" />

      <main className="w-full flex-1 bg-slate-50 pt-16">
        {/* Hero Section */}
        <section className="relative w-full py-16 md:py-24 border-b border-slate-200 bg-white">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 sm:px-6 lg:px-8 text-center">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700 border border-blue-200 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Sistem Deteksi Fraud Pengeluaran Kas Berbasis AI & Aturan Forensik</span>
            </div>

            {/* Headline */}
            <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight max-w-4xl">
              Audit Pengeluaran Kas Lebih Cepat, Akurat, dan Bebas Anomali
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-3xl text-base sm:text-lg text-slate-600 leading-relaxed">
              Otomasi verifikasi kuitansi fisik dengan AI OCR, deteksi klaim ganda menggunakan Perceptual Hashing (pHash), dan evaluasi kepatuhan anggaran berbasis jejak digital ISO 27001.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/login"
                prefetch={false}
                className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold inline-flex items-center gap-2 transition-all shadow-sm hover:shadow"
              >
                <span>Mulai Akses Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/panduan-kepatuhan"
                prefetch={false}
                className="h-11 px-6 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold inline-flex items-center gap-2 transition-all shadow-xs"
              >
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span>Pelajari Panduan SOP</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 inline-flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600 font-medium">
              <div className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Ekstraksi OCR SLA &le; 5s</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Deteksi Klaim Ganda pHash &gt; 85%</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Tanda Tangan Forensik SHA-256</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full py-16 bg-slate-50">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Kemampuan Inti SmartAudit
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Pencegahan Kebocoran Kas Sebelum Dana Dicairkan
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600">
                Mengintegrasikan pemindaian visi komputer, rule engine multi-parameter, dan audit trail ISO 27001 dalam satu ekosistem terpadu.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="rounded-2xl bg-white p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 inline-flex items-center justify-center border border-blue-100 shrink-0">
                    <Scan className="w-6 h-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    Ekstraksi OCR Visi AI
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    Ekstraksi otomatis tanggal, nama rekanan toko, dan total nominal kuitansi belanja kas secara akurat dengan SLA &le; 5 detik.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-blue-600 inline-flex items-center gap-1">
                  <span>Presisi 99.4% Multi-Format</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="rounded-2xl bg-white p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 inline-flex items-center justify-center border border-rose-100 shrink-0">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    Deteksi Anomali Real-Time
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    Mencegah klaim ganda lewat Perceptual Hashing (dHash 64-bit), indikasi pemecahan transaksi (split bill), dan transaksi di luar jam kerja.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-rose-600 inline-flex items-center gap-1">
                  <span>6 Parameter Fraud Accumulator</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="rounded-2xl bg-white p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 inline-flex items-center justify-center border border-emerald-100 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    Audit Trail & Webhook ERP
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    Pencairan otomatis ke ERP untuk transaksi aman (&lt; 40%), serta putusan BAP auditor yang disegel tanda tangan kriptografis SHA-256.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-emerald-600 inline-flex items-center gap-1">
                  <span>ISO 27001 Immutable Storage</span>
                </div>
              </div>
            </div>

            {/* Quick Demo Jump */}
            <div className="mt-12 p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="text-base font-bold text-slate-900 block">
                  Siap menguji skenario audit kas interaktif?
                </span>
                <span className="text-sm text-slate-500 mt-1 block">
                  Tersedia akun demonstrasi siap pakai untuk Staf Keuangan dan Auditor Forensik dengan data uji riil.
                </span>
              </div>
              <Link
                href="/login"
                prefetch={false}
                className="h-10 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors shrink-0 shadow-xs"
              >
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
