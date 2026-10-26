import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LandingPage() {
  return (
    <>
      <Navbar currentRole="GUEST" />

      <main className="w-full flex-1 bg-surface pt-16">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden bg-surface py-12 lg:py-20">
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary-fixed/40 via-surface-container/20 to-transparent blur-3xl"></div>

          <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 sm:px-6 lg:px-8 py-10 lg:py-16 text-center">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-surface-container px-4 py-1.5 font-label-sm text-label-sm font-semibold tracking-wider text-primary shadow-sm border border-outline-variant/30">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>SISTEM DETEKSI FRAUD PENGELUARAN KAS BERBASIS AI</span>
            </div>

            {/* Headline */}
            <h1 className="mt-6 font-headline-lg font-bold tracking-tight text-on-surface text-[30px] md:text-[40px] lg:text-[48px] lg:leading-[56px] max-w-4xl">
              Audit Pengeluaran Kas Lebih Cepat, Akurat, dan Transparan
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-2xl font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Otomatisasi verifikasi kuitansi fisik, deteksi klaim ganda menggunakan Perceptual Hashing, dan kepatuhan anggaran berbasis Hybrid Rule-Engine dan Explainable AI.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/login"
                className="flex h-12 items-center gap-2 rounded-xl bg-primary px-6 font-label-md text-label-md font-semibold text-on-primary shadow-md transition hover:bg-primary/90 hover:shadow-lg"
              >
                <span>Masuk ke Sistem</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <a
                href="#fitur"
                className="flex h-12 items-center rounded-xl border border-outline-variant bg-surface-container-lowest px-6 font-label-md text-label-md font-semibold text-on-surface transition hover:bg-surface-container-low shadow-sm"
              >
                <span>Pelajari Fitur</span>
              </a>
            </div>

            {/* Trust Metrics */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 font-label-md text-label-md text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                <span>99.4% Presisi Pembacaan OCR</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                <span>Deteksi Klaim Ganda &lt; 0.8 Detik</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                <span>Audit Trail Tak Terbantahkan</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full bg-surface-container-low/40 py-16" id="fitur">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-primary">
                Kemampuan Inti
              </span>
              <h2 className="mt-2 font-headline-lg text-headline-lg font-bold text-on-surface text-[26px] md:text-[32px] leading-tight">
                Dirancang untuk Ketelitian Maksimal Pemeriksa Keuangan
              </h2>
              <p className="mt-3 max-w-2xl font-body-md text-body-md text-on-surface-variant">
                Pangkas waktu verifikasi hingga 85% dengan presisi setingkat auditor forensik bersertifikasi.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col justify-between rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30 transition hover:shadow-md">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container text-primary">
                    <span className="material-symbols-outlined text-[26px]">document_scanner</span>
                  </div>
                  <h3 className="mt-5 font-headline-sm text-headline-sm font-bold text-on-surface">
                    Ekstraksi OCR Cerdas
                  </h3>
                  <p className="mt-2.5 font-body-md text-body-md leading-relaxed text-on-surface-variant">
                    Baca kuitansi dan nota fisik otomatis dengan batas SLA &le; 5 detik. Dilengkapi formulir koreksi manual jika AI mendeteksi dokumen miring atau buram.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 font-label-md text-label-md font-semibold text-primary">
                  <span>Otomatisasi Ekstraksi</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col justify-between rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30 transition hover:shadow-md">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container text-primary">
                    <span className="material-symbols-outlined text-[26px]">troubleshoot</span>
                  </div>
                  <h3 className="mt-5 font-headline-sm text-headline-sm font-bold text-on-surface">
                    Deteksi Anomali Real-Time
                  </h3>
                  <p className="mt-2.5 font-body-md text-body-md leading-relaxed text-on-surface-variant">
                    Tandai indikasi split bill, overbilling, dan nota duplikat secara instan melalui algoritma Perceptual Hashing (pHash similarity &gt; 85%).
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 font-label-md text-label-md font-semibold text-primary">
                  <span>Algoritma Deteksi Fraud</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col justify-between rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30 transition hover:shadow-md">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container text-primary">
                    <span className="material-symbols-outlined text-[26px]">fact_check</span>
                  </div>
                  <h3 className="mt-5 font-headline-sm text-headline-sm font-bold text-on-surface">
                    Explainable AI & Audit Trail
                  </h3>
                  <p className="mt-2.5 font-body-md text-body-md leading-relaxed text-on-surface-variant">
                    Skor risiko transparan (0-100) dengan narasi justifikasi audit forensik dan pencatatan jejak digital SHA-256 yang kebal manipulasi data.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 font-label-md text-label-md font-semibold text-primary">
                  <span>Kepatuhan Regulasi Penuh</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Summary Section */}
        <section className="w-full bg-surface py-16">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-primary">
                Alur Kerja Sistem
              </span>
              <h2 className="mt-2 font-headline-lg text-headline-lg font-bold text-on-surface text-[26px] md:text-[32px]">
                Tiga Langkah Menuju Integritas Keuangan Mutlak
              </h2>
              <p className="mt-3 max-w-xl font-body-md text-body-md text-on-surface-variant">
                Penyederhanaan siklus verifikasi kas kecil dan penggantian biaya (reimbursement) instansi.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="relative flex flex-col items-center text-center p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container text-primary shadow-sm font-headline-sm text-headline-sm font-bold">
                  01
                </div>
                <h3 className="mt-4 font-headline-sm text-headline-sm font-bold text-on-surface">
                  Staf Unggah Nota
                </h3>
                <p className="mt-2 font-body-md text-body-md leading-relaxed text-on-surface-variant max-w-xs">
                  Unggah foto kuitansi atau faktur PDF langsung via form atau impor massal berkas data transaksi CSV.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm font-headline-sm text-headline-sm font-bold">
                  02
                </div>
                <h3 className="mt-4 font-headline-sm text-headline-sm font-bold text-on-surface">
                  AI Scan & Deteksi Fraud
                </h3>
                <p className="mt-2 font-body-md text-body-md leading-relaxed text-on-surface-variant max-w-xs">
                  Mesin OCR membaca data otomatis; fraud engine menguji duplikasi pHash, split bill, anomali jam, dan kategori berisiko.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container text-primary shadow-sm font-headline-sm text-headline-sm font-bold">
                  03
                </div>
                <h3 className="mt-4 font-headline-sm text-headline-sm font-bold text-on-surface">
                  Auto-Approval / Review Auditor
                </h3>
                <p className="mt-2 font-body-md text-body-md leading-relaxed text-on-surface-variant max-w-xs">
                  Skor &lt; 40% langsung dicairkan via Webhook ERP, sedangkan skor &ge; 40% dievaluasi auditor secara forensik.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Proof Section */}
        <section className="w-full bg-surface-container-low/30 py-16 border-y border-outline-variant/30">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-primary">
                  Standar Forensik Tingkat Tinggi
                </span>
                <h2 className="mt-2 font-headline-lg text-headline-lg font-bold text-on-surface text-[26px] md:text-[32px] leading-tight">
                  Hentikan Kerugian Finansial Sebelum Dana Dicairkan
                </h2>
                <p className="mt-3 font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  Sistem pengawasan tradisional seringkali hanya melakukan sampling acak setelah kas telah keluar. SmartAudit mengubah paradigma ini menjadi pencegahan dini yang proaktif dan terotomatisasi secara menyeluruh.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined mt-0.5 text-primary text-[20px]">check_box</span>
                    <span className="font-body-md text-body-md text-on-surface">
                      Validasi otomatis Nomor Pokok Wajib Pajak (NPWP) dan legalitas rekanan vendor.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined mt-0.5 text-primary text-[20px]">check_box</span>
                    <span className="font-body-md text-body-md text-on-surface">
                      Pencegahan manipulasi grafis kuitansi melalui analisis Perceptual Hashing (dHash 64-bit).
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined mt-0.5 text-primary text-[20px]">check_box</span>
                    <span className="font-body-md text-body-md text-on-surface">
                      Integrasi Outbound Webhook ke modul disbursement ERP untuk pencairan langsung aman.
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Metric Showcase Card */}
              <div className="overflow-hidden rounded-2xl bg-surface-container-lowest p-6 shadow-md border border-outline-variant/30">
                <div className="flex items-center justify-between pb-4 border-b border-surface-container">
                  <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                    Ringkasan Integritas Kas Berjalan
                  </span>
                  <span className="rounded-full bg-surface-container px-3 py-1 font-label-sm text-label-sm font-medium text-on-surface">
                    Audit Q4 2025
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="rounded-xl bg-surface-container-low p-4">
                    <div className="font-label-sm text-label-sm text-on-surface-variant">Total Pengeluaran Diperiksa</div>
                    <div className="mt-1 font-headline-md text-headline-md font-bold text-on-surface">Rp 1.428 M</div>
                    <div className="mt-1 font-label-sm text-label-sm text-primary font-medium">100% Tercakup Otomatis</div>
                  </div>

                  <div className="rounded-xl bg-surface-container-low p-4">
                    <div className="font-label-sm text-label-sm text-on-surface-variant">Potensi Fraud Dicegah</div>
                    <div className="mt-1 font-headline-md text-headline-md font-bold text-tertiary">Rp 64.2 Jt</div>
                    <div className="mt-1 font-label-sm text-label-sm text-on-surface-variant">14 Transaksi Diblokir</div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-surface-container-low p-4">
                  <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                    <span>Rata-rata Waktu Verifikasi Berkas</span>
                    <span className="font-data-mono font-bold text-on-surface">1.2 Menit / Dokumen</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-surface-container overflow-hidden">
                    <div className="h-2 rounded-full bg-primary" style={{ width: "95%" }}></div>
                  </div>
                  <div className="mt-1 flex justify-between font-label-sm text-[11px] text-on-surface-variant">
                    <span>Sebelumnya: 28 Menit manual</span>
                    <span className="text-secondary font-semibold">Efisiensi: +95%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Compliance Badges */}
        <section className="w-full bg-surface-container-lowest py-12 border-t border-outline-variant/30">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div>
                <div className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  Keamanan Enkripsi Standar Institusional
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Data transaksi keuangan terlindungi dengan standar enkripsi militer dan jejak audit kriptografis.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-xl bg-surface-container-low px-4 py-2 font-label-sm text-label-sm font-semibold text-on-surface border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                  <span>ISO 27001 Ready</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-surface-container-low px-4 py-2 font-label-sm text-label-sm font-semibold text-on-surface border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[18px]">lock</span>
                  <span>Enkripsi SHA-256</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-surface-container-low px-4 py-2 font-label-sm text-label-sm font-semibold text-on-surface border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[18px]">database</span>
                  <span>Data Residency ID</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low shadow-[0_-1px_6px_rgba(0,0,0,0.02)] border-t border-surface-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-on-surface-variant">
          <div className="font-body-sm text-body-sm">
            &copy; 2026 SmartAudit Systems. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-6 font-label-sm text-label-sm">
            <Link href="/panduan-kepatuhan" className="hover:text-on-surface transition-colors">
              SOP Kebijakan
            </Link>
            <Link href="/audit-trail-log" className="hover:text-on-surface transition-colors">
              Audit Trail
            </Link>
            <Link href="/login" className="hover:text-on-surface transition-colors">
              Portal Akses
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
