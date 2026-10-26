import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function PanduanKepatuhanPage() {
  return (
    <>
      <Navbar currentRole="STAFF" />

      <main className="w-full pt-16 bg-surface min-h-screen">
        {/* Top Banner / Editorial Header */}
        <section className="w-full bg-surface-container-low px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden border-b border-surface-container">
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  SOP Kepatuhan v4.0 / 2026
                </span>
                <span className="text-outline-variant font-label-sm text-label-sm">|</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                  Pedoman Verifikasi Audit Keuangan & Kas
                </span>
              </div>
              <h1 className="font-display-lg text-display-lg text-on-surface font-bold text-[28px] md:text-[34px] tracking-tight">
                Panduan Kepatuhan & Kebijakan Pengeluaran Kas
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Standar Operasional Prosedur (SOP) pengajuan klaim biaya operasional, batas limitasi otorisasi bertingkat, dan matriks parameter skor fraud SmartAudit.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              <Link
                href="/input-pengeluaran"
                className="h-10 px-5 bg-primary text-on-primary font-label-md text-label-md rounded-xl flex items-center gap-2 shadow-md hover:bg-primary-container transition-colors font-semibold"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Buat Pengajuan Baru</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
          {/* Section 1: Matriks Limitasi Tiga Tingkat */}
          <section className="flex flex-col gap-6">
            <div>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">
                Parameter Tingkat Otoritas
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold text-[22px]">
                Matriks Limitasi & Otorisasi Pengeluaran Kas
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Batas ambang pemrosesan otomatis AI dan eskalasi tanda tangan pemeriksa forensik.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tier 1 */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-outline-variant/30 hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase font-semibold">
                      Tier 01 &bull; Rutin
                    </span>
                    <span className="material-symbols-outlined text-secondary text-[24px]">bolt</span>
                  </div>
                  <div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">Batas Pengajuan</div>
                    <div className="font-display-lg text-display-lg text-on-surface mt-0.5 tracking-tight font-bold text-[26px] font-data-mono">
                      &lt; Rp 5.000.000
                    </div>
                    <div className="font-label-sm text-label-sm text-secondary font-semibold mt-1">
                      Biaya Operasional Rutin Staf
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-low space-y-2">
                    <div className="font-label-md text-label-md text-on-surface font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-secondary">smart_toy</span>
                      Otomatis AI Fast-Track
                    </div>
                    <p className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed">
                      Langsung diteruskan ke pencairan kas via Webhook jika skor risiko anomali <strong className="text-on-surface">&lt; 40%</strong>.
                    </p>
                  </div>

                  <ul className="space-y-2 font-body-sm text-[12px] text-on-surface-variant pt-2">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                      Struk digital / nota fisik cetak 300 DPI
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                      SLA Pencairan: &le; 4 Jam Kerja
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                      Tanpa antrean review manual
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full rounded-full" style={{ width: "25%" }}></div>
                  </div>
                  <div className="flex justify-between items-center mt-2 font-label-sm text-label-sm text-on-surface-variant font-semibold">
                    <span>Tingkat Pengawasan: Minimum</span>
                    <span className="text-secondary font-bold">25%</span>
                  </div>
                </div>
              </div>

              {/* Tier 2 */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-outline-variant/30 hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm uppercase font-semibold">
                      Tier 02 &bull; Operasional
                    </span>
                    <span className="material-symbols-outlined text-primary text-[24px]">supervisor_account</span>
                  </div>
                  <div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">Rentang Nilai</div>
                    <div className="font-headline-lg text-headline-lg text-on-surface mt-0.5 tracking-tight font-bold text-[22px] font-data-mono">
                      Rp 5 Jt &ndash; Rp 15 Jt
                    </div>
                    <div className="font-label-sm text-label-sm text-primary font-semibold mt-1">
                      Biaya Operasional Divisi & Logistik
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-high space-y-2">
                    <div className="font-label-md text-label-md text-on-surface font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-primary">verified</span>
                      Verifikasi Kepala Unit + AI Scan
                    </div>
                    <p className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed">
                      Memerlukan otorisasi digital setelah kuitansi melewati pengujian duplikasi pHash toleransi &le; 20%.
                    </p>
                  </div>

                  <ul className="space-y-2 font-body-sm text-[12px] text-on-surface-variant pt-2">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                      Faktur resmi bernomor seri valid
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                      SLA Pencairan: &le; 24 Jam Kerja
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                      Wajib lampiran alokasi mata anggaran
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: "65%" }}></div>
                  </div>
                  <div className="flex justify-between items-center mt-2 font-label-sm text-label-sm text-on-surface-variant font-semibold">
                    <span>Tingkat Pengawasan: Menengah</span>
                    <span className="text-primary font-bold">65%</span>
                  </div>
                </div>
              </div>

              {/* Tier 3 */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-outline-variant/30 hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-error-container text-tertiary font-label-sm text-label-sm uppercase font-semibold">
                      Tier 03 &bull; Strategis
                    </span>
                    <span className="material-symbols-outlined text-tertiary text-[24px]">policy</span>
                  </div>
                  <div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">Batas Pengeluaran</div>
                    <div className="font-headline-lg text-headline-lg text-on-surface mt-0.5 tracking-tight font-bold text-[26px] font-data-mono">
                      &gt; Rp 15.000.000
                    </div>
                    <div className="font-label-sm text-label-sm text-tertiary font-semibold mt-1">
                      Belanja Modal & Kontrak Vendor
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-error-container/40 space-y-2 border border-tertiary/20">
                    <div className="font-label-md text-label-md text-tertiary font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">gavel</span>
                      Audit Forensik Ketat
                    </div>
                    <p className="font-body-sm text-[12px] text-on-surface leading-relaxed">
                      Wajib melewati meja Auditor Forensik, inspeksi side-by-side berkas fisik, dan Berita Acara Pemeriksaan (BAP).
                    </p>
                  </div>

                  <ul className="space-y-2 font-body-sm text-[12px] text-on-surface-variant pt-2">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
                      e-Faktur Pajak resmi terdaftar DJP
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
                      Cek silang split bill & multi-rekanan
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
                      Ditandatangani digital ISO 27001
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className="bg-tertiary h-full rounded-full" style={{ width: "100%" }}></div>
                  </div>
                  <div className="flex justify-between items-center mt-2 font-label-sm text-label-sm text-on-surface-variant font-semibold">
                    <span>Tingkat Pengawasan: Maksimum</span>
                    <span className="text-tertiary font-bold">100%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Matriks 6 Parameter Algoritma Fraud */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 space-y-6">
            <div>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">
                Matriks Parameter Poin Fraud
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold text-[22px]">
                Kombinasi Rule-Based Engine & AI Vision Scoring
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Formula: Skor Akhir = MIN(100, &Sigma; (Poin Pelanggaran)). Skor &ge; 40% otomatis masuk antrean auditor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start justify-between gap-4">
                <div>
                  <div className="font-headline-sm text-[15px] font-bold text-on-surface">
                    1. Indikasi Kuat Duplikasi Dokumen
                  </div>
                  <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-relaxed">
                    Perceptual Hashing (dHash) kemiripan &gt; 85% atau Exact Match (Vendor + Tanggal + Nominal identik).
                  </p>
                </div>
                <span className="font-data-mono font-bold text-[13px] px-3 py-1 rounded-lg bg-tertiary text-on-tertiary shrink-0">
                  +40 Poin
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start justify-between gap-4">
                <div>
                  <div className="font-headline-sm text-[15px] font-bold text-on-surface">
                    2. Indikasi Split Bill (Pecah Transaksi)
                  </div>
                  <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-relaxed">
                    Vendor dan tanggal sama diajukan dengan selisih waktu &lt; 2 jam atau pemecahan pengeluaran tepat di bawah pagu otorisasi.
                  </p>
                </div>
                <span className="font-data-mono font-bold text-[13px] px-3 py-1 rounded-lg bg-tertiary text-on-tertiary shrink-0">
                  +35 Poin
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start justify-between gap-4">
                <div>
                  <div className="font-headline-sm text-[15px] font-bold text-on-surface">
                    3. Anomali Nominal vs Historis
                  </div>
                  <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-relaxed">
                    Pengeluaran melampaui &gt; 3 Standar Deviasi dari data historis per divisi pemohon.
                  </p>
                </div>
                <span className="font-data-mono font-bold text-[13px] px-3 py-1 rounded-lg bg-tertiary text-on-tertiary shrink-0">
                  +25 Poin
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start justify-between gap-4">
                <div>
                  <div className="font-headline-sm text-[15px] font-bold text-on-surface">
                    4. Kategori Beban Berisiko Tinggi
                  </div>
                  <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-relaxed">
                    Pengeluaran kategori entertainment, lounge, karaoke, representasi mewah non-operasional inti.
                  </p>
                </div>
                <span className="font-data-mono font-bold text-[13px] px-3 py-1 rounded-lg bg-tertiary text-on-tertiary shrink-0">
                  +20 Poin
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start justify-between gap-4">
                <div>
                  <div className="font-headline-sm text-[15px] font-bold text-on-surface">
                    5. Pengajuan di Luar Jam / Hari Kerja
                  </div>
                  <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-relaxed">
                    Unggah berkas atau transaksi pada dini hari (21:00 - 05:00 WIB) atau hari libur akhir pekan.
                  </p>
                </div>
                <span className="font-data-mono font-bold text-[13px] px-3 py-1 rounded-lg bg-secondary text-on-secondary shrink-0">
                  +15 Poin
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start justify-between gap-4">
                <div>
                  <div className="font-headline-sm text-[15px] font-bold text-on-surface">
                    6. Nominal Bulat Sempurna Tanpa Pajak
                  </div>
                  <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-relaxed">
                    Nominal genap bulat (misal Rp 10.000.000 atau Rp 50.000.000) tanpa komponen pecahan PPN/PPh tertera.
                  </p>
                </div>
                <span className="font-data-mono font-bold text-[13px] px-3 py-1 rounded-lg bg-secondary text-on-secondary shrink-0">
                  +10 Poin
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
