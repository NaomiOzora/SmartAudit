import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function PanduanKepatuhanPage() {
  return (
    <>
      <Navbar currentRole="STAFF" />

      <main className="w-full pt-14 bg-slate-50/50 min-h-screen">
        {/* Banner */}
        <section className="w-full bg-white px-4 sm:px-6 py-6 border-b border-slate-200">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] uppercase tracking-wider font-semibold border border-blue-200">
                  SOP Kepatuhan v4.0 / 2026
                </span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-[12px] text-slate-500 font-medium">
                  Pedoman Verifikasi Audit Keuangan
                </span>
              </div>
              <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">
                Panduan Kepatuhan & Kebijakan Pengeluaran Kas
              </h1>
              <p className="text-[13px] text-slate-600 mt-0.5 max-w-xl">
                Standar Operasional Prosedur (SOP) pengajuan klaim, batas limitasi otorisasi bertingkat, dan matriks parameter fraud SmartAudit.
              </p>
            </div>

            <Link
              href="/input-pengeluaran"
              className="h-8.5 px-3.5 bg-blue-600 text-white text-[12px] rounded-lg flex items-center gap-1.5 shadow-xs hover:bg-blue-700 transition-colors font-semibold self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Buat Pengajuan Baru</span>
            </Link>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col gap-6">
          {/* Section 1: Tier Limit Matrix */}
          <section className="flex flex-col gap-3">
            <div>
              <span className="text-[11px] text-blue-600 uppercase tracking-wider font-semibold">
                Parameter Tingkat Otoritas
              </span>
              <h2 className="text-[16px] font-bold text-slate-900">
                Matriks Limitasi & Otorisasi Pengeluaran Kas
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tier 1 */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] uppercase font-semibold">
                      Tier 01 &bull; Rutin
                    </span>
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">bolt</span>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Batas Pengajuan</div>
                    <div className="text-[18px] font-bold text-slate-900 font-data-mono">
                      &lt; Rp 5.000.000
                    </div>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                      Biaya Operasional Rutin Staf
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                    <strong className="text-slate-900 block font-semibold mb-0.5">Otomatis AI Fast-Track</strong>
                    Langsung diteruskan ke pencairan kas via Webhook jika skor risiko anomali &lt; 40%.
                  </div>

                  <ul className="space-y-1.5 text-[11px] text-slate-600 pt-1">
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
                      Struk cetak / nota digital 300 DPI
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
                      SLA Pencairan: &le; 4 Jam Kerja
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
                      Tanpa antrean review manual
                    </li>
                  </ul>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-500">
                  <span>Pengawasan: Minimum</span>
                  <span className="font-bold text-emerald-700">25%</span>
                </div>
              </div>

              {/* Tier 2 */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] uppercase font-semibold border border-blue-200">
                      Tier 02 &bull; Operasional
                    </span>
                    <span className="material-symbols-outlined text-blue-600 text-[18px]">supervisor_account</span>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Rentang Nilai</div>
                    <div className="text-[18px] font-bold text-slate-900 font-data-mono">
                      Rp 5 Jt &ndash; 15 Jt
                    </div>
                    <div className="text-[11px] text-blue-700 font-semibold mt-0.5">
                      Biaya Operasional Divisi
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                    <strong className="text-slate-900 block font-semibold mb-0.5">Verifikasi Manajer + AI</strong>
                    Memerlukan otorisasi digital setelah kuitansi melewati pengujian duplikasi pHash.
                  </div>

                  <ul className="space-y-1.5 text-[11px] text-slate-600 pt-1">
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-blue-600">check_circle</span>
                      Faktur resmi bernomor seri
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-blue-600">check_circle</span>
                      SLA Pencairan: &le; 24 Jam Kerja
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-blue-600">check_circle</span>
                      Wajib rincian alokasi anggaran
                    </li>
                  </ul>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-500">
                  <span>Pengawasan: Menengah</span>
                  <span className="font-bold text-blue-700">65%</span>
                </div>
              </div>

              {/* Tier 3 */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] uppercase font-semibold border border-rose-200">
                      Tier 03 &bull; Strategis
                    </span>
                    <span className="material-symbols-outlined text-rose-600 text-[18px]">policy</span>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Batas Pengeluaran</div>
                    <div className="text-[18px] font-bold text-slate-900 font-data-mono">
                      &gt; Rp 15.000.000
                    </div>
                    <div className="text-[11px] text-rose-700 font-semibold mt-0.5">
                      Belanja Modal & Kontrak
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                    <strong className="text-slate-900 block font-semibold mb-0.5">Audit Forensik Ketat</strong>
                    Wajib melewati meja Auditor Forensik, inspeksi side-by-side berkas fisik, dan BAP.
                  </div>

                  <ul className="space-y-1.5 text-[11px] text-slate-600 pt-1">
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-rose-600">check_circle</span>
                      e-Faktur Pajak resmi DJP
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-rose-600">check_circle</span>
                      Cek silang split bill vendor
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-rose-600">check_circle</span>
                      Tanda tangan digital ISO 27001
                    </li>
                  </ul>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-500">
                  <span>Pengawasan: Maksimum</span>
                  <span className="font-bold text-rose-700">100%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: 6 Parameters Matrix */}
          <section className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div>
              <span className="text-[11px] text-blue-600 uppercase tracking-wider font-semibold">
                Matriks Parameter Fraud
              </span>
              <h2 className="text-[15px] font-bold text-slate-900">
                Kombinasi Rule Engine & AI Scoring (0 - 100 Poin)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px]">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">1. Duplikasi Dokumen Grafis</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Perceptual Hashing (dHash) kemiripan &gt; 85% atau Exact Match (Vendor + Tanggal + Nominal).
                  </p>
                </div>
                <span className="font-data-mono font-bold text-[11px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 shrink-0">
                  +40 Poin
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">2. Indikasi Split Bill</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Vendor dan tanggal sama dengan selisih &lt; 2 jam untuk menghindari batas pagu otorisasi.
                  </p>
                </div>
                <span className="font-data-mono font-bold text-[11px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 shrink-0">
                  +35 Poin
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">3. Anomali Nominal vs Historis</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pengeluaran melampaui &gt; 3 Standar Deviasi dari data rata-rata historis per divisi.
                  </p>
                </div>
                <span className="font-data-mono font-bold text-[11px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 shrink-0">
                  +25 Poin
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">4. Kategori Beban Berisiko Tinggi</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Beban kategori entertainment, karaoke, lounge, representasi mewah non-operasional.
                  </p>
                </div>
                <span className="font-data-mono font-bold text-[11px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 shrink-0">
                  +20 Poin
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">5. Di Luar Jam / Hari Kerja</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Transaksi diajukan pada dini hari (21:00 - 05:00 WIB) atau pada hari libur akhir pekan.
                  </p>
                </div>
                <span className="font-data-mono font-bold text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">
                  +15 Poin
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">6. Nominal Bulat Sempurna</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Nominal genap bulat (misal Rp 10.000.000) tanpa komponen pecahan pajak PPN/PPh tertera.
                  </p>
                </div>
                <span className="font-data-mono font-bold text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">
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
