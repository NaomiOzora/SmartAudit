"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface TransactionItem {
  id: string;
  code: string;
  applicantName: string;
  department: string;
  vendor: string;
  amount: number;
  description: string;
  status: string;
  date: string;
  fraudAnalysis?: {
    riskScore: number;
    riskLevel: string;
  };
}

export default function BerandaStafPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [search]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const url = search
        ? `/api/transactions?search=${encodeURIComponent(search)}`
        : "/api/transactions";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (err) {
      console.error("Gagal memuat data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Hitung metrik dinamis
  const totalAmount = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const autoApprovedCount = transactions.filter((t) => t.status === "AUTO_APPROVED" || t.status === "APPROVED").length;
  const pendingCount = transactions.filter((t) => t.status === "PENDING_REVIEW").length;

  return (
    <>
      <Navbar currentRole="STAFF" />

      <main className="w-full min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12 bg-surface">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          {/* Top Greeting & Primary Action Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-headline-lg text-headline-lg text-on-surface font-bold text-[26px]">
                  Halo, Siti Rahma
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-secondary-fixed/50 text-secondary font-label-sm text-label-sm font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                  Staf Keuangan Aktif
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Divisi IT & Digital &bull; Rekapitulasi permohonan dana dan pengeluaran operasional Anda.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/input-pengeluaran"
                className="group inline-flex items-center gap-2 bg-primary-container text-on-primary px-5 py-2.5 rounded-xl font-label-md text-label-md font-semibold shadow-md hover:bg-primary transition-all duration-200"
              >
                <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-90">
                  add
                </span>
                <span>Ajukan Pengeluaran Baru</span>
              </Link>
            </div>
          </div>

          {/* Minimalist Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat 1 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                  Total Diajukan Periode Ini
                </span>
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight text-[26px] font-data-mono">
                  Rp {totalAmount.toLocaleString("id-ID")}
                </span>
                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                  <span className="text-secondary font-medium">&bull;</span> Periode Aktif Berjalan
                </p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                  Disetujui Otomatis
                </span>
                <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[20px]">task_alt</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-bold text-[28px] font-data-mono">
                    {autoApprovedCount}
                  </span>
                  <span className="font-body-md text-body-md text-on-surface-variant">Transaksi</span>
                </div>
                <p className="mt-1 font-body-sm text-body-sm text-secondary flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">verified</span> Terverifikasi AI SmartAudit
                </p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                  Menunggu Peninjauan
                </span>
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-[20px]">pending_actions</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-bold text-[28px] font-data-mono">
                    {pendingCount}
                  </span>
                  <span className="font-body-md text-body-md text-on-surface-variant">Transaksi</span>
                </div>
                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span> Tahap review verifikator
                </p>
              </div>
            </div>
          </div>

          {/* Informational Guidance Banner */}
          <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm border border-outline-variant/30">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-surface-container-lowest text-primary shadow-sm mt-0.5 border border-outline-variant/20">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-[16px]">
                  Pedoman Bukti Kas Valid
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 max-w-2xl leading-relaxed">
                  Pastikan kuitansi fisik diunggah tegak lurus, stempel toko terbaca utuh, serta memiliki resolusi minimal 300 DPI agar verifikasi AI berjalan instan (SLA &le; 5 detik).
                </p>
              </div>
            </div>
            <Link
              href="/panduan-kepatuhan"
              className="inline-flex items-center gap-1 text-primary font-label-md text-label-md hover:underline whitespace-nowrap font-semibold"
            >
              <span>Baca Aturan Kepatuhan</span>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </Link>
          </div>

          {/* Transaction Table Card */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-container">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold text-[18px]">
                  Riwayat Pengajuan Terakhir Saya
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Menampilkan permohonan pencairan kas mandiri yang tercatat di sistem
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
                    search
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari transaksi atau vendor..."
                    className="h-9 pl-9 pr-4 bg-surface-container-low text-on-surface rounded-xl font-body-sm text-body-sm focus:outline-none focus:bg-surface-container placeholder:text-on-surface-variant/70 border border-outline-variant/30 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/60 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-surface-container">
                    <th className="py-3 px-6 font-semibold">ID Transaksi</th>
                    <th className="py-3 px-4 font-semibold">Tanggal</th>
                    <th className="py-3 px-4 font-semibold">Keperluan / Rekanan</th>
                    <th className="py-3 px-4 font-semibold text-right">Nominal</th>
                    <th className="py-3 px-6 font-semibold text-center">Status Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container text-on-surface font-body-md text-body-md">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-[28px] animate-spin text-primary">
                          sync
                        </span>
                        <p className="mt-2 text-body-sm">Memuat data pengajuan kas...</p>
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-[36px] text-outline">
                          receipt_long
                        </span>
                        <p className="mt-2 font-semibold">Belum ada transaksi ditemukan</p>
                        <p className="text-body-sm text-on-surface-variant">
                          Klik &quot;Ajukan Pengeluaran Baru&quot; untuk mengunggah kuitansi pertama Anda.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => {
                      const isAuto = tx.status === "AUTO_APPROVED";
                      const isApproved = tx.status === "APPROVED";
                      const isRejected = tx.status === "REJECTED";
                      const isPending = tx.status === "PENDING_REVIEW";

                      return (
                        <tr
                          key={tx.id}
                          className="hover:bg-surface-container-low/50 transition-colors"
                        >
                          <td className="py-4 px-6 font-data-mono text-data-mono text-primary font-semibold">
                            {tx.code}
                          </td>
                          <td className="py-4 px-4 text-on-surface-variant font-data-mono text-data-mono whitespace-nowrap text-[13px]">
                            {new Date(tx.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-semibold text-on-surface block">
                              {tx.description || tx.vendor}
                            </span>
                            <span className="font-body-sm text-[12px] text-on-surface-variant">
                              {tx.vendor} &bull; {tx.department}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-data-mono text-data-mono font-bold text-right whitespace-nowrap">
                            Rp {tx.amount.toLocaleString("id-ID")}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {isAuto && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed/50 text-secondary font-label-sm text-label-sm font-semibold">
                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                Disetujui Otomatis
                              </span>
                            )}
                            {isApproved && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed/50 text-secondary font-label-sm text-label-sm font-semibold">
                                <span className="material-symbols-outlined text-[14px]">verified</span>
                                Disetujui Auditor
                              </span>
                            )}
                            {isPending && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
                                <span className="material-symbols-outlined text-[14px]">pending</span>
                                Menunggu Review (Skor {tx.fraudAnalysis?.riskScore || 0}%)
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-error-container text-tertiary font-label-sm text-label-sm font-semibold">
                                <span className="material-symbols-outlined text-[14px]">cancel</span>
                                Ditolak / Fraud
                              </span>
                            )}
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
    </>
  );
}
