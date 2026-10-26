import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function PanduanKepatuhanPage() {
  return (
    <>
      <Navbar currentRole="STAFF" />

      <main className="w-full pt-14 bg-slate-50 min-h-screen pb-12">
        {/* Banner */}
        <section className="w-full bg-white px-4 sm:px-6 py-5 border-b border-slate-200">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
                  SOP Kepatuhan v4.0
                </span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-xs text-slate-500">
                  Pedoman Verifikasi Kas
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Panduan Kepatuhan & Kebijakan Kas
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Batas plafon otorisasi kas dan parameter evaluasi deteksi anomali SmartAudit.
              </p>
            </div>

            <Link
              href="/input-pengeluaran"
              prefetch={false}
              className="h-8 px-3.5 bg-blue-600 text-white text-xs rounded-lg inline-flex items-center gap-1.5 shadow-xs hover:bg-blue-700 transition-colors font-medium self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[15px] shrink-0">add</span>
              <span>Buat Pengajuan Baru</span>
            </Link>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-5 flex flex-col gap-5">
          {/* Section 1: Tier Limit Matrix */}
          <section className="flex flex-col gap-3">
            <div>
              <span className="text-xs text-blue-600 uppercase tracking-wider font-semibold">
                Tingkat Otorisasi
              </span>
              <h2 className="text-sm font-semibold text-slate-900">
                Plafon & Persyaratan Verifikasi
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Tier 1 */}
              <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] uppercase font-medium">
                      Tier 01 &bull; Rutin
                    </span>
                    <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0">bolt</span>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Batas Pengajuan</div>
                    <div className="text-lg font-bold text-slate-900 font-mono">
                      &lt; Rp 5.000.000
                    </div>
                    <div className="text-xs text-emerald-700 font-medium mt-0.5">
                      Fast-Track Auto Approval
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                    Langsung dicairkan otomatis via Webhook jika skor risiko anomali &lt; 40%.
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                    <li className="inline-flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-emerald-600 shrink-0">check_circle</span>
                      <span>Struk cetak / nota digital terbaca</span>
                    </li>
                    <li className="inline-flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-emerald-600 shrink-0">check_circle</span>
                      <span>SLA Proses: &le; 4 Jam Kerja</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Tier 2 */}
              <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] uppercase font-medium border border-blue-200">
                      Tier 02 &bull; Operasional
                    </span>
                    <span className="material-symbols-outlined text-blue-600 text-[18px] shrink-0">supervisor_account</span>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Rentang Nilai</div>
                    <div className="text-lg font-bold text-slate-900 font-mono">
                      Rp 5 Jt &ndash; 15 Jt
                    </div>
                    <div className="text-xs text-blue-700 font-medium mt-0.5">
                      Verifikasi Standar
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                    Memerlukan validasi kuitansi dan pemeriksaan bebas duplikasi pHash.
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                    <li className="inline-flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-blue-600 shrink-0">check_circle</span>
                      <span>Faktur resmi bernomor seri</span>
                    </li>
                    <li className="inline-flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-blue-600 shrink-0">check_circle</span>
                      <span>SLA Proses: &le; 24 Jam Kerja</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Tier 3 */}
              <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[11px] uppercase font-medium border border-rose-200">
                      Tier 03 &bull; Strategis
                    </span>
                    <span className="material-symbols-outlined text-rose-600 text-[18px] shrink-0">policy</span>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Batas Pengeluaran</div>
                    <div className="text-lg font-bold text-slate-900 font-mono">
                      &gt; Rp 15.000.000
                    </div>
                    <div className="text-xs text-rose-700 font-medium mt-0.5">
                      Review Auditor Forensik
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                    Wajib ditinjau auditor forensik dengan penerbitan BAP berstempel SHA-256.
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                    <li className="inline-flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-rose-600 shrink-0">check_circle</span>
                      <span>e-Faktur resmi DJP / Rekanan</span>
                    </li>
                    <li className="inline-flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-rose-600 shrink-0">check_circle</span>
                      <span>Pengecekan indikasi split bill</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: 6 Parameters Matrix */}
          <section className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3.5">
            <div>
              <span className="text-xs text-blue-600 uppercase tracking-wider font-semibold">
                Matriks Parameter Fraud
              </span>
              <h2 className="text-sm font-semibold text-slate-900">
                Kombinasi Rule Engine & AI Scoring (0 - 100 Poin)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">1. Duplikasi Dokumen Grafis</div>
                  <p className="text-slate-500 mt-0.5">
                    Perceptual Hashing (dHash) kemiripan &gt; 85% atau kecocokan data kuitansi sebelumnya.
                  </p>
                </div>
                <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 shrink-0">
                  +40 Poin
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">2. Indikasi Split Bill</div>
                  <p className="text-slate-500 mt-0.5">
                    Transaksi berulang ke vendor yang sama dalam selisih waktu &lt; 2 jam untuk hindari limitasi.
                  </p>
                </div>
                <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 shrink-0">
                  +35 Poin
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">3. Anomali Nominal vs Historis</div>
                  <p className="text-slate-500 mt-0.5">
                    Pengeluaran melampaui &gt; 3 standar deviasi dari rata-rata pengeluaran historis divisi.
                  </p>
                </div>
                <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 shrink-0">
                  +25 Poin
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">4. Kategori Beban Berisiko Tinggi</div>
                  <p className="text-slate-500 mt-0.5">
                    Beban kategori entertainment, lounge, atau representasi mewah non-operasional.
                  </p>
                </div>
                <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 shrink-0">
                  +20 Poin
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">5. Di Luar Jam / Hari Kerja</div>
                  <p className="text-slate-500 mt-0.5">
                    Pengeluaran diajukan pada malam/dini hari (21:00 - 05:00) atau akhir pekan tanpa penugasan.
                  </p>
                </div>
                <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">
                  +15 Poin
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">6. Nominal Bulat Sempurna</div>
                  <p className="text-slate-500 mt-0.5">
                    Nominal genap bulat (misal Rp 10.000.000) tanpa rincian pecahan pajak PPN/PPh tertera.
                  </p>
                </div>
                <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">
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
