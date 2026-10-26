import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LandingPage() {
  return (
    <>
      <Navbar currentRole="GUEST" />

      <main className="w-full flex-1 bg-slate-50 pt-14">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-16">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 sm:px-6 text-center">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200/70">
              <span className="material-symbols-outlined text-[15px] shrink-0">verified</span>
              <span>Sistem Deteksi Fraud Pengeluaran Kas Berbasis AI</span>
            </div>

            {/* Headline */}
            <h1 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-snug">
              Audit Pengeluaran Kas Lebih Cepat, Akurat, dan Transparan
            </h1>

            {/* Description */}
            <p className="mt-3 max-w-2xl text-xs sm:text-sm text-slate-600 leading-relaxed">
              Otomasi verifikasi kuitansi fisik, deteksi klaim ganda berbasis Perceptual Hashing (pHash), dan evaluasi kepatuhan anggaran dengan integrasi jejak audit kriptografis.
            </p>

            {/* Action Buttons */}
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/login"
                prefetch={false}
                className="h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Masuk ke Sistem</span>
                <span className="material-symbols-outlined text-[15px] shrink-0">arrow_forward</span>
              </Link>
              <Link
                href="/panduan-kepatuhan"
                prefetch={false}
                className="h-9 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium inline-flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px] text-slate-500 shrink-0">
                  menu_book
                </span>
                <span>Panduan SOP</span>
              </Link>
            </div>

            {/* Core Badges */}
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-5 text-xs text-slate-500">
              <div className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-[16px] shrink-0">
                  check_circle
                </span>
                <span>Ekstraksi OCR SLA &le; 5s</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-[16px] shrink-0">
                  check_circle
                </span>
                <span>Deteksi Klaim Ganda pHash &gt; 85%</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-[16px] shrink-0">
                  check_circle
                </span>
                <span>Jejak Audit SHA-256</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full bg-white py-10 border-t border-slate-200">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 inline-flex items-center justify-center border border-blue-100 shrink-0">
                  <span className="material-symbols-outlined text-[18px]">document_scanner</span>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">
                  Ekstraksi OCR Cerdas
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Ekstraksi instan data tanggal, rekanan, dan nominal belanja kuitansi dengan koreksi manual otomatis.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 inline-flex items-center justify-center border border-blue-100 shrink-0">
                  <span className="material-symbols-outlined text-[18px]">troubleshoot</span>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">
                  Deteksi Anomali Kas
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Identifikasi otomatis indikasi nota ganda, split bill menghindari plafon, dan transaksi di luar jam dinas.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 inline-flex items-center justify-center border border-blue-100 shrink-0">
                  <span className="material-symbols-outlined text-[18px]">fact_check</span>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">
                  Audit Trail & Webhook
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Pencairan otomatis ke ERP untuk transaksi aman (&lt; 40%), serta putusan BAP auditor dengan segel SHA-256.
                </p>
              </div>
            </div>

            {/* Quick Demo Jump */}
            <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  Siap menguji skenario audit?
                </span>
                <span className="text-xs text-slate-500">
                  Tersedia akun demonstrasi siap pakai untuk Staf Keuangan dan Auditor Forensik.
                </span>
              </div>
              <Link
                href="/login"
                prefetch={false}
                className="h-8 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors shrink-0"
              >
                <span>Masuk Sekarang</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
