import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LandingPage() {
  return (
    <>
      <Navbar currentRole="GUEST" />

      <main className="w-full flex-1 bg-slate-50/50 pt-14">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden py-12 md:py-16">
          <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 sm:px-6 text-center">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50/80 px-3 py-1 text-[11px] font-semibold tracking-wider text-blue-700 border border-blue-200/70 shadow-sm">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              <span>SISTEM DETEKSI FRAUD PENGELUARAN KAS BERBASIS AI</span>
            </div>

            {/* Headline */}
            <h1 className="mt-4 font-bold tracking-tight text-slate-900 text-[24px] sm:text-[30px] md:text-[36px] max-w-3xl leading-snug">
              Audit Pengeluaran Kas Lebih Cepat, Akurat, dan Transparan
            </h1>

            {/* Description */}
            <p className="mt-3 max-w-2xl text-[14px] sm:text-[15px] text-slate-600 leading-relaxed">
              Otomatisasi verifikasi kuitansi fisik, deteksi klaim ganda menggunakan Perceptual Hashing (pHash), dan evaluasi kepatuhan anggaran berbasis Hybrid Rule-Engine dan Explainable AI.
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/login"
                className="flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                <span>Masuk ke Sistem</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
              <a
                href="#fitur"
                className="flex h-10 items-center rounded-lg border border-slate-300 bg-white px-5 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50 shadow-sm"
              >
                <span>Pelajari Fitur</span>
              </a>
            </div>

            {/* Trust Metrics */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-[12px] text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
                <span>99.4% Presisi Pembacaan OCR</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
                <span>Deteksi Klaim Ganda &lt; 0.8 Detik</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
                <span>Audit Trail ISO 27001 Kriptografis</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full bg-white py-12 border-y border-slate-200/80" id="fitur">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                Kemampuan Inti
              </span>
              <h2 className="mt-1.5 text-slate-900 font-bold text-[20px] sm:text-[24px]">
                Dirancang untuk Ketelitian Maksimal Pemeriksa Keuangan
              </h2>
              <p className="mt-2 max-w-xl text-[13px] text-slate-600">
                Pangkas waktu verifikasi berkas hingga 85% dengan presisi setingkat auditor forensik bersertifikasi.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col justify-between rounded-xl bg-slate-50/70 p-5 border border-slate-200 hover:border-slate-300 transition-colors">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                    <span className="material-symbols-outlined text-[20px]">document_scanner</span>
                  </div>
                  <h3 className="mt-3.5 text-[15px] font-semibold text-slate-900">
                    Ekstraksi OCR Cerdas
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
                    Ekstraksi instan dengan SLA &le; 5 detik. Dilengkapi formulir edit manual terintegrasi jika kuitansi miring atau buram.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[12px] font-semibold text-blue-600">
                  <span>Otomatisasi Ekstraksi</span>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col justify-between rounded-xl bg-slate-50/70 p-5 border border-slate-200 hover:border-slate-300 transition-colors">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                    <span className="material-symbols-outlined text-[20px]">troubleshoot</span>
                  </div>
                  <h3 className="mt-3.5 text-[15px] font-semibold text-slate-900">
                    Deteksi Anomali Real-Time
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
                    Pencegahan klaim kuitansi ganda lewat Perceptual Hashing (&gt;85% kemiripan grafis), split bill, dan anomali jam kerja.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[12px] font-semibold text-blue-600">
                  <span>Algoritma Deteksi Fraud</span>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col justify-between rounded-xl bg-slate-50/70 p-5 border border-slate-200 hover:border-slate-300 transition-colors">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                    <span className="material-symbols-outlined text-[20px]">fact_check</span>
                  </div>
                  <h3 className="mt-3.5 text-[15px] font-semibold text-slate-900">
                    Explainable AI & Audit Trail
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
                    Skor risiko transparan (0-100) dengan narasi justifikasi audit forensik dan jejak digital SHA-256 yang kebal manipulasi.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[12px] font-semibold text-blue-600">
                  <span>Kepatuhan Regulasi Penuh</span>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Summary Section */}
        <section className="w-full bg-slate-50/50 py-12">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                Alur Kerja Sistem
              </span>
              <h2 className="mt-1.5 text-slate-900 font-bold text-[20px] sm:text-[24px]">
                Tiga Langkah Menuju Integritas Keuangan Mutlak
              </h2>
              <p className="mt-2 max-w-lg text-[13px] text-slate-600">
                Penyederhanaan siklus verifikasi kas kecil dan reimbursement instansi.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="relative flex flex-col items-center text-center p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-blue-700 font-bold text-[14px] border border-slate-200">
                  01
                </div>
                <h3 className="mt-3 text-[15px] font-semibold text-slate-900">
                  Staf Unggah Kuitansi
                </h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-slate-600 max-w-xs">
                  Unggah foto kuitansi/nota via form atau impor data massal berkas CSV.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-[14px]">
                  02
                </div>
                <h3 className="mt-3 text-[15px] font-semibold text-slate-900">
                  AI Scan & Deteksi Fraud
                </h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-slate-600 max-w-xs">
                  Mesin OCR membaca data; fraud engine mengevaluasi indikasi duplikasi, split bill, dan nominal.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-blue-700 font-bold text-[14px] border border-slate-200">
                  03
                </div>
                <h3 className="mt-3 text-[15px] font-semibold text-slate-900">
                  Auto-Approval / Review
                </h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-slate-600 max-w-xs">
                  Skor &lt; 40% langsung dicairkan via Webhook ERP, skor &ge; 40% dievaluasi auditor secara forensik.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Proof / Stats Card */}
        <section className="w-full bg-white py-12 border-t border-slate-200/80">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                  Standar Forensik Institusional
                </span>
                <h2 className="mt-1.5 text-slate-900 font-bold text-[20px] sm:text-[24px] leading-snug">
                  Hentikan Kerugian Finansial Sebelum Dana Dicairkan
                </h2>
                <p className="mt-2 text-[13px] text-slate-600 leading-relaxed">
                  Sistem pengawasan tradisional umumnya hanya melakukan sampling acak setelah kas keluar. SmartAudit mengubah ini menjadi pencegahan dini yang terotomatisasi secara menyeluruh.
                </p>

                <div className="mt-5 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-blue-600 text-[18px] mt-0.5">check_circle</span>
                    <span className="text-[13px] text-slate-700">
                      Validasi otomatis identitas rekanan vendor dan nomor faktur.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-blue-600 text-[18px] mt-0.5">check_circle</span>
                    <span className="text-[13px] text-slate-700">
                      Pencegahan manipulasi grafis melalui sidik jari Perceptual Hashing (dHash).
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-blue-600 text-[18px] mt-0.5">check_circle</span>
                    <span className="text-[13px] text-slate-700">
                      Integrasi Outbound Webhook ke modul ERP kasir untuk pencairan aman.
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="rounded-xl bg-slate-50 p-5 border border-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-[14px] font-semibold text-slate-900">
                    Ringkasan Integritas Kas Berjalan
                  </span>
                  <span className="rounded-md bg-white border border-slate-200 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                    Audit Q4 2025
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="rounded-lg bg-white p-3.5 border border-slate-200/80">
                    <div className="text-[11px] text-slate-500 font-medium">Total Pengeluaran Diperiksa</div>
                    <div className="mt-1 text-[20px] font-bold text-slate-900 font-data-mono">Rp 1.428 M</div>
                    <div className="mt-0.5 text-[11px] text-blue-600 font-medium">100% Tercakup Otomatis</div>
                  </div>

                  <div className="rounded-lg bg-white p-3.5 border border-slate-200/80">
                    <div className="text-[11px] text-slate-500 font-medium">Potensi Fraud Dicegah</div>
                    <div className="mt-1 text-[20px] font-bold text-rose-600 font-data-mono">Rp 64.2 Jt</div>
                    <div className="mt-0.5 text-[11px] text-slate-500">14 Transaksi Terblokir</div>
                  </div>
                </div>

                <div className="mt-3 rounded-lg bg-white p-3.5 border border-slate-200/80">
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span>Rata-rata Waktu Verifikasi Berkas</span>
                    <span className="font-bold text-slate-900 font-data-mono">1.2 Menit / Dokumen</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-1.5 rounded-full bg-blue-600" style={{ width: "95%" }}></div>
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-slate-500">
                    <span>Sebelumnya: 28 Menit</span>
                    <span className="text-emerald-700 font-semibold">Efisiensi: +95%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Badges */}
        <section className="w-full bg-slate-50 py-8 border-t border-slate-200">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[13px] font-bold text-slate-900">
                Keamanan Enkripsi Standar Institusional
              </div>
              <p className="text-[12px] text-slate-500">
                Data transaksi dilindungi standar enkripsi SHA-256 dan jejak audit digital.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-white text-[11px] font-semibold text-slate-700 border border-slate-200">
                ISO 27001 Ready
              </span>
              <span className="px-2.5 py-1 rounded bg-white text-[11px] font-semibold text-slate-700 border border-slate-200">
                Enkripsi SHA-256
              </span>
              <span className="px-2.5 py-1 rounded bg-white text-[11px] font-semibold text-slate-700 border border-slate-200">
                Data Residency ID
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[12px]">
          <div>&copy; 2026 SmartAudit Systems. Hak Cipta Dilindungi Undang-Undang.</div>
          <div className="flex items-center gap-4 text-[12px]">
            <Link href="/panduan-kepatuhan" className="hover:text-slate-900 transition-colors">
              SOP Kebijakan
            </Link>
            <Link href="/audit-trail-log" className="hover:text-slate-900 transition-colors">
              Audit Trail
            </Link>
            <Link href="/login" className="hover:text-slate-900 transition-colors">
              Masuk Sistem
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
