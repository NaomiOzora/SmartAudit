"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AuditorSidebar from "@/components/AuditorSidebar";
import { useAuth } from "@/lib/auth";
import {
  Bot,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  LogOut,
  FileClock,
  Receipt,
  ShieldCheck,
  Ban,
  ArrowUpRight,
  X,
  FileSearch,
} from "lucide-react";

interface Transaction {
  id: string;
  code: string;
  applicantName: string;
  department: string;
  category: string;
  vendor: string;
  date: string;
  amount: number;
  description: string;
  status: string;
  fraudAnalysis?: {
    riskScore: number;
    riskLevel: string;
    reasonXai?: string;
  };
}

export default function ValidasiAiPage() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTxForInterrupt, setSelectedTxForInterrupt] = useState<Transaction | null>(null);
  const [interruptAction, setInterruptAction] = useState<"INTERRUPT_REJECT" | "PULL_TO_REVIEW">(
    "INTERRUPT_REJECT"
  );
  const [interruptReason, setInterruptReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchAutoApproved = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch("/api/transactions?status=AUTO_APPROVED&sort=date");
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (err) {
      console.error("Gagal memuat transaksi validasi AI:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutoApproved();

    const interval = setInterval(() => {
      fetchAutoApproved(true);
    }, 4000);

    const handleUpdate = () => fetchAutoApproved(true);
    window.addEventListener("focus", handleUpdate);
    window.addEventListener("transaction-updated", handleUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleUpdate);
      window.removeEventListener("transaction-updated", handleUpdate);
    };
  }, []);

  const handleInterruptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxForInterrupt) return;

    if (!interruptReason.trim()) {
      alert("Silakan masukkan alasan intervensi / catatan auditor.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auditor/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: selectedTxForInterrupt.id,
          action: interruptAction,
          notes: interruptReason.trim(),
          auditorName: user?.name || "Bambang H. (Auditor Forensik)",
        }),
      });

      const json = await res.json();
      if (json.success) {
        const msg =
          interruptAction === "INTERRUPT_REJECT"
            ? `Transaksi ${selectedTxForInterrupt.code} berhasil dianulir & ditolak (Instruksi kasir VOID).`
            : `Transaksi ${selectedTxForInterrupt.code} ditarik kembali ke antrean evaluasi manual.`;
        setToastMessage(msg);

        // Broadcast event real-time ke semua tab/komponen
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("transaction-updated"));
        }

        setSelectedTxForInterrupt(null);
        setInterruptReason("");
        fetchAutoApproved(true);
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        alert(json.error || "Gagal menerapkan intervensi putusan AI.");
      }
    } catch (err) {
      console.error("Error submit interrupt:", err);
      alert("Terjadi kesalahan sistem saat intervensi putusan AI.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Proteksi Akses Khusus Auditor
  if (user && user.role !== "AUDITOR") {
    return (
      <>
        <Navbar currentRole="STAFF" />
        <main className="w-full min-h-screen pt-24 px-4 flex items-center justify-center bg-slate-50">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md max-w-md text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 inline-flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Akses Khusus Auditor Forensik</h2>
            <p className="text-sm text-slate-600 mt-2 mb-6 leading-relaxed">
              Anda saat ini masuk sebagai <strong>{user.name}</strong> (Staf Keuangan). Halaman uji silang validasi AI hanya dapat diakses oleh Auditor.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/beranda-staf"
                prefetch={false}
                className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors shadow-xs"
              >
                <span>Kembali ke Beranda Staf</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="h-10 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  const filtered = transactions.filter((tx) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      tx.code.toLowerCase().includes(q) ||
      tx.vendor.toLowerCase().includes(q) ||
      tx.applicantName.toLowerCase().includes(q) ||
      tx.department.toLowerCase().includes(q)
    );
  });

  const totalAmount = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <>
      <Navbar currentRole="AUDITOR" />
      <AuditorSidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen bg-slate-50 pt-16">
        <main className="w-full flex-1 px-6 sm:px-8 lg:px-10 py-6">
          <div className="w-full max-w-[1600px] mx-auto space-y-6">
            {/* Header Ringkas & Memanjang */}
            <div className="flex items-center justify-between gap-4 pb-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      Validasi Otomatis AI (Fast-Track)
                    </h1>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                      {transactions.length} berkas lolos AI
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ruang kendali auditor untuk uji silang (*cross-check*) dan intervensi (*interrupt*) transaksi yang disetujui otomatis oleh AI.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => fetchAutoApproved()}
                className="h-9 px-3.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-colors border border-slate-200 shadow-xs cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${loading ? "animate-spin" : ""}`} />
                <span>Segarkan</span>
              </button>
            </div>

            {/* Toast Notifikasi */}
            {toastMessage && (
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs sm:text-sm flex items-center justify-between shadow-xs animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{toastMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setToastMessage(null)}
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Metrik Ringkas AI Fast-Track (1 Baris Rapi, Tidak Menumpuk) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Total Berkas Lolos AI
                  </span>
                  <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">
                    {transactions.length} <span className="text-xs font-normal text-slate-500">Berkas</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Total Nilai Transaksi Cair
                  </span>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                    Rp {totalAmount.toLocaleString("id-ID")}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Otoritas Intervensi
                  </span>
                  <div className="text-sm font-bold text-slate-800 mt-1">
                    Tersedia Hak Anulir (VOID)
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Ban className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Daftar Transaksi Lolos Validasi AI Otomatis
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Transaksi di bawah ini otomatis disetujui sistem AI karena memenuhi standar kepatuhan. Klik tombol *Intervensi* untuk membatalkan jika diperlukan.
                  </p>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari transaksi lolos AI..."
                    className="h-9 pl-9 pr-4 bg-slate-50 text-slate-900 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 border border-slate-200 transition-all w-60 sm:w-64"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200/80 font-bold">
                      <th className="py-3 px-4 font-semibold">Kode Transaksi</th>
                      <th className="py-3 px-4 font-semibold">Tanggal</th>
                      <th className="py-3 px-4 font-semibold">Pemohon & Divisi</th>
                      <th className="py-3 px-4 font-semibold">Toko / Rekanan</th>
                      <th className="py-3 px-4 font-semibold text-right">Nominal</th>
                      <th className="py-3 px-4 font-semibold text-center">Skor Risiko AI</th>
                      <th className="py-3 px-4 font-semibold text-right">Aksi Intervensi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <FileClock className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                          <p className="mt-2 text-sm font-medium">Memuat data validasi AI...</p>
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
                          <p className="mt-2 text-sm font-semibold text-slate-600">
                            Tidak ada transaksi dengan status validasi otomatis AI
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((tx) => {
                        const score = tx.fraudAnalysis?.riskScore || 0;

                        return (
                          <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-xs sm:text-sm text-blue-600">
                              {tx.code}
                            </td>
                            <td className="py-3.5 px-4 text-slate-500 font-mono text-xs whitespace-nowrap">
                              {new Date(tx.date).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                                {tx.applicantName}
                              </span>
                              <span className="text-slate-400 text-xs ml-1.5">
                                ({tx.department})
                              </span>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap text-xs sm:text-sm text-slate-800">
                              {tx.vendor}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap text-xs sm:text-sm">
                              Rp {tx.amount.toLocaleString("id-ID")}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                                {score}% (Rendah)
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  href={`/detail-inspeksi/${tx.id}`}
                                  className="h-8 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Inspeksi Berkas Lengkap"
                                >
                                  <FileSearch className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Inspeksi</span>
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedTxForInterrupt(tx);
                                    setInterruptReason("");
                                    setInterruptAction("INTERRUPT_REJECT");
                                  }}
                                  className="h-8 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                                  title="Anulir putusan AI"
                                >
                                  <Ban className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                  <span>Intervensi</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL INTERVENSI PUTUSAN AI */}
      {selectedTxForInterrupt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <Ban className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Intervensi Putusan Otomatis AI
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    Berkas: {selectedTxForInterrupt.code}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTxForInterrupt(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInterruptSubmit} className="p-6 space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Pemohon:</span>
                  <strong className="text-slate-800">{selectedTxForInterrupt.applicantName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rekanan:</span>
                  <strong className="text-slate-800">{selectedTxForInterrupt.vendor}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nominal:</span>
                  <strong className="text-slate-900 font-mono text-sm">
                    Rp {selectedTxForInterrupt.amount.toLocaleString("id-ID")}
                  </strong>
                </div>
              </div>

              {/* Pilihan Bentuk Intervensi */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Tindakan Auditor:
                </label>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <label
                    className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-colors ${
                      interruptAction === "INTERRUPT_REJECT"
                        ? "bg-rose-50 border-rose-300 text-rose-900 ring-1 ring-rose-300"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="action"
                      value="INTERRUPT_REJECT"
                      checked={interruptAction === "INTERRUPT_REJECT"}
                      onChange={() => setInterruptAction("INTERRUPT_REJECT")}
                      className="mt-0.5 text-rose-600"
                    />
                    <div>
                      <strong className="block text-rose-800">
                        Anulir & Tolak Transaksi (Batalkan Pencairan / VOID)
                      </strong>
                      <span className="text-xs text-slate-500 block mt-0.5">
                        Mengubah status menjadi REJECTED dan mengirimkan instruksi pembatalan webhook ke kasir.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-colors ${
                      interruptAction === "PULL_TO_REVIEW"
                        ? "bg-amber-50 border-amber-300 text-amber-900 ring-1 ring-amber-300"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="action"
                      value="PULL_TO_REVIEW"
                      checked={interruptAction === "PULL_TO_REVIEW"}
                      onChange={() => setInterruptAction("PULL_TO_REVIEW")}
                      className="mt-0.5 text-amber-600"
                    />
                    <div>
                      <strong className="block text-amber-800">
                        Tarik Kembali ke Antrean Review Manual
                      </strong>
                      <span className="text-xs text-slate-500 block mt-0.5">
                        Mengubah status menjadi PENDING_REVIEW agar masuk ke antrean investigasi forensik manual.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Alasan Intervensi */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Catatan / Alasan Intervensi Auditor (Wajib):
                </label>
                <textarea
                  required
                  rows={3}
                  value={interruptReason}
                  onChange={(e) => setInterruptReason(e.target.value)}
                  placeholder="Contoh: Ditemukan kecurigaan bukti kuitansi buram atau vendor terafiliasi yang lolos model AI..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedTxForInterrupt(null)}
                  className="h-9 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-9 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs inline-flex items-center gap-1.5 transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Ban className="w-3.5 h-3.5" />
                  )}
                  <span>Terapkan Intervensi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
