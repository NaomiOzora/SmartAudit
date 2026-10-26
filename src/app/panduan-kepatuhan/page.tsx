import Link from "next/link";
import Navbar from "@/components/Navbar";
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
} from "lucide-react";

export default function PanduanKepatuhanPage() {
  return (
    <>
      <Navbar currentRole="STAFF" />

      <main className="w-full pt-16 bg-slate-50 min-h-screen pb-16">
        {/* Banner */}
        <section className="w-full bg-white px-4 sm:px-6 lg:px-8 py-8 border-b border-slate-200">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                  SOP Kepatuhan v4.0 / 2026
                </span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-xs text-slate-500 font-medium">
                  Pedoman Verifikasi Audit Keuangan
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Panduan Kepatuhan & Kebijakan Pengeluaran Kas
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Standar Operasional Prosedur (SOP) pengajuan klaim, batas limitasi otorisasi bertingkat, dan matriks parameter deteksi fraud SmartAudit.
              </p>
            </div>

            <Link
              href="/input-pengeluaran"
              prefetch={false}
              className="h-10 px-5 bg-blue-600 text-white text-sm rounded-xl inline-flex items-center gap-2 shadow-xs hover:bg-blue-700 transition-colors font-semibold self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Pengajuan Baru</span>
            </Link>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
          {/* Section 1: Tier Limit Matrix */}
          <section className="flex flex-col gap-4">
            <div>
              <span className="text-xs text-blue-600 uppercase tracking-wider font-bold">
                Tingkat Otorisasi
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Matriks Plafon & Ketentuan Otorisasi Kas
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tier 1 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-xs uppercase font-bold">
                      Tier 01 &bull; Rutin
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 inline-flex items-center justify-center border border-emerald-100 shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold">Batas Pengajuan</div>
                    <div className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">
                      &lt; Rp 5.000.000
                    </div>
                    <div className="text-xs text-emerald-700 font-bold mt-1">
                      Fast-Track Auto Approval
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900 block font-bold mb-1">Otomatis AI Fast-Track</strong>
                    Langsung diteruskan ke pencairan kas via Outbound Webhook ke modul ERP jika skor risiko anomali &lt; 40%.
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 pt-1">
                    <li className="inline-flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Struk cetak kasir / nota digital 300 DPI</span>
                    </li>
                    <li className="inline-flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>SLA Pencairan: &le; 4 Jam Kerja</span>
                    </li>
                    <li className="inline-flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Tanpa antrean review manual verifikator</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Tier 2 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs uppercase font-bold border border-blue-200">
                      Tier 02 &bull; Operasional
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 inline-flex items-center justify-center border border-blue-100 shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold">Rentang Nilai</div>
                    <div className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">
                      Rp 5 Jt &ndash; 15 Jt
                    </div>
                    <div className="text-xs text-blue-700 font-bold mt-1">
                      Verifikasi Kepala Divisi + AI
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900 block font-bold mb-1">Verifikasi Manajerial</strong>
                    Memerlukan otorisasi bertingkat setelah berkas kuitansi melewati pengujian duplikasi pHash.
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 pt-1">
                    <li className="inline-flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Faktur resmi bernomor seri rekanan</span>
                    </li>
                    <li className="inline-flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>SLA Pencairan: &le; 24 Jam Kerja</span>
                    </li>
                    <li className="inline-flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Wajib rincian alokasi pos anggaran</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Tier 3 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-md bg-rose-50 text-rose-700 text-xs uppercase font-bold border border-rose-200">
                      Tier 03 &bull; Strategis
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 inline-flex items-center justify-center border border-rose-100 shrink-0">
                      <FileWarning className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold">Batas Pengeluaran</div>
                    <div className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">
                      &gt; Rp 15.000.000
                    </div>
                    <div className="text-xs text-rose-700 font-bold mt-1">
                      Audit Forensik Ketat
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900 block font-bold mb-1">Pemeriksaan Meja Forensik</strong>
                    Wajib ditinjau auditor forensik, inspeksi side-by-side berkas fisik, dan penerbitan BAP berstempel SHA-256.
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 pt-1">
                    <li className="inline-flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>e-Faktur Pajak resmi DJP</span>
                    </li>
                    <li className="inline-flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Cek silang split bill vendor berkala</span>
                    </li>
                    <li className="inline-flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Tanda tangan digital kebal manipulasi</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: 6 Parameters Matrix */}
          <section className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-xs space-y-5">
            <div>
              <span className="text-xs text-blue-600 uppercase tracking-wider font-bold">
                Matriks Parameter Fraud
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Kombinasi Rule Engine & AI Scoring (0 - 100 Poin)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 inline-flex items-center justify-center shrink-0 mt-0.5">
                    <Copy className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">1. Duplikasi Dokumen Grafis</div>
                    <p className="text-xs text-slate-500 mt-1">
                      Perceptual Hashing (dHash 64-bit) kemiripan &gt; 85% atau kecocokan data kuitansi sebelumnya.
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 shrink-0">
                  +40 Poin
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 inline-flex items-center justify-center shrink-0 mt-0.5">
                    <Split className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">2. Indikasi Split Bill</div>
                    <p className="text-xs text-slate-500 mt-1">
                      Transaksi berulang ke vendor yang sama dalam selisih waktu &lt; 2 jam untuk hindari limitasi.
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 shrink-0">
                  +35 Poin
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 inline-flex items-center justify-center shrink-0 mt-0.5">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">3. Anomali Nominal vs Historis</div>
                    <p className="text-xs text-slate-500 mt-1">
                      Pengeluaran melampaui &gt; 3 standar deviasi dari rata-rata pengeluaran historis divisi.
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 shrink-0">
                  +25 Poin
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 inline-flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">4. Kategori Beban Berisiko Tinggi</div>
                    <p className="text-xs text-slate-500 mt-1">
                      Beban kategori entertainment, lounge, atau representasi mewah non-operasional.
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 shrink-0">
                  +20 Poin
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 inline-flex items-center justify-center shrink-0 mt-0.5">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">5. Di Luar Jam / Hari Kerja</div>
                    <p className="text-xs text-slate-500 mt-1">
                      Pengeluaran diajukan pada malam/dini hari (21:00 - 05:00) atau akhir pekan tanpa penugasan.
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 shrink-0">
                  +15 Poin
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 inline-flex items-center justify-center shrink-0 mt-0.5">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">6. Nominal Bulat Sempurna</div>
                    <p className="text-xs text-slate-500 mt-1">
                      Nominal genap bulat (misal Rp 10.000.000) tanpa rincian pecahan pajak PPN/PPh tertera.
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 shrink-0">
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
