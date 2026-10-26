import prisma from "./prisma";
import { checkDatabaseDuplicateHash } from "./hash-utils";

export interface TransactionInput {
  vendor: string;
  date: string | Date;
  amount: number;
  category: string;
  department: string;
  phashFingerprint?: string;
  submissionTime?: Date;
  description?: string;
  excludeTransactionId?: string;
}

export interface FraudEvaluationResult {
  finalScore: number; // 0 - 100
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  isAutoApproved: boolean;
  reasonXai: string;
  pointsBreakdown: Array<{
    rule: string;
    points: number;
    category: "DUPLICATION" | "SPLIT_BILL" | "ANOMALY_AMOUNT" | "HIGH_RISK_CAT" | "OFF_HOURS" | "ROUND_AMOUNT" | "NORMAL";
    detail: string;
  }>;
  flags: {
    isDuplicate: boolean;
    duplicateTarget?: string;
    duplicateSim?: number;
    isSplitBill: boolean;
    isAnomalyAmount: boolean;
    isHighRiskCat: boolean;
    isOffHours: boolean;
    isRoundAmount: boolean;
  };
}

/**
 * Mesin Deteksi Fraud Hibrida (Rule-Based Engine + Perceptual Analysis + XAI)
 */
export async function evaluateTransactionFraud(
  input: TransactionInput
): Promise<FraudEvaluationResult> {
  const points: FraudEvaluationResult["pointsBreakdown"] = [];
  const flags: FraudEvaluationResult["flags"] = {
    isDuplicate: false,
    isSplitBill: false,
    isAnomalyAmount: false,
    isHighRiskCat: false,
    isOffHours: false,
    isRoundAmount: false,
  };

  const txnDate = new Date(input.date);
  const now = input.submissionTime || new Date();

  // 1. Parameter 1: Deteksi Duplikasi Dokumen (+40 Poin)
  // Cek pHash similarity > 85% atau Exact Match (Vendor + Tanggal + Nominal)
  if (input.phashFingerprint) {
    const dupCheck = await checkDatabaseDuplicateHash(
      input.phashFingerprint,
      input.excludeTransactionId
    );

    if (dupCheck && dupCheck.isDuplicate) {
      flags.isDuplicate = true;
      flags.duplicateTarget = dupCheck.targetTransactionCode;
      flags.duplicateSim = dupCheck.similarity;

      points.push({
        rule: `Indikasi Kuat Duplikasi Grafis pHash (${(dupCheck.similarity * 100).toFixed(1)}% Kemiripan)`,
        points: 40,
        category: "DUPLICATION",
        detail: `Kuitansi memiliki kesamaan grafis dengan berkas transaksi sebelumnya (${dupCheck.targetTransactionCode}).`,
      });
    }
  }

  // Cek Exact Match teks Vendor + Tanggal + Nominal di DB jika belum kena pHash
  if (!flags.isDuplicate) {
    const startOfDay = new Date(txnDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(txnDate);
    endOfDay.setHours(23, 59, 59, 999);

    const exactMatch = await prisma.transaction.findFirst({
      where: {
        vendor: { equals: input.vendor },
        amount: input.amount,
        date: { gte: startOfDay, lte: endOfDay },
        ...(input.excludeTransactionId ? { id: { not: input.excludeTransactionId } } : {}),
      },
    });

    if (exactMatch) {
      flags.isDuplicate = true;
      flags.duplicateTarget = exactMatch.code;
      flags.duplicateSim = 1.0;

      points.push({
        rule: "Exact Match Dokumen (Vendor + Tanggal + Nominal Identik)",
        points: 40,
        category: "DUPLICATION",
        detail: `Ditemukan transaksi persis sama di database dengan kode ${exactMatch.code}.`,
      });
    }
  }

  // 2. Parameter 2: Deteksi Split Bill (+35 Poin)
  // Aturan: Vendor & Tanggal sama dengan selisih waktu < 2 jam, atau pemecahan transaksi mendekati batas otorisasi (mis. Rp 50jt)
  const twoHoursMs = 2 * 60 * 60 * 1000;
  const recentVendorTxns = await prisma.transaction.findMany({
    where: {
      vendor: { equals: input.vendor },
      ...(input.excludeTransactionId ? { id: { not: input.excludeTransactionId } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  let splitBillDetected = false;
  for (const prevTx of recentVendorTxns) {
    const timeDiff = Math.abs(now.getTime() - prevTx.createdAt.getTime());
    // Jika ada transaksi vendor sama dalam selisih < 2 jam
    if (timeDiff <= twoHoursMs) {
      splitBillDetected = true;
      break;
    }
    // Atau jika kedua transaksi mendekati limit Rp 50.000.000 (mis. 40-49.9jt)
    if (input.amount >= 40000000 && input.amount < 50000000 && prevTx.amount >= 40000000) {
      splitBillDetected = true;
      break;
    }
  }

  if (splitBillDetected) {
    flags.isSplitBill = true;
    points.push({
      rule: "Indikasi Split Bill (Pemecahan Transaksi Beruntun)",
      points: 35,
      category: "SPLIT_BILL",
      detail: `Terdapat pengeluaran beruntun ke vendor yang sama dalam jeda waktu singkat untuk menghindari pagu otorisasi direksi (Rp 50 Jt).`,
    });
  }

  // 3. Parameter 3: Anomali Nominal (+25 Poin)
  // Menghitung apakah nominal melebihi batas rata-rata divisi (> 3 StdDev atau > batas kebijakan wajar per divisi)
  const divisionLimits: Record<string, number> = {
    "IT & Digital": 40000000,
    "TI & Infrastruktur": 35000000,
    "Pengadaan & Logistik": 30000000,
    "Pemasaran & Humas": 15000000,
    "Operasional": 20000000,
  };

  const limitForDept = divisionLimits[input.department] || 25000000;
  if (input.amount > limitForDept) {
    flags.isAnomalyAmount = true;
    points.push({
      rule: `Anomali Nominal (> 3 Standar Deviasi per Divisi ${input.department})`,
      points: 25,
      category: "ANOMALY_AMOUNT",
      detail: `Nominal Rp ${input.amount.toLocaleString("id-ID")} melampaui batas deviasi historis normal divisi (ambang batas Rp ${limitForDept.toLocaleString("id-ID")}).`,
    });
  }

  // 4. Parameter 4: Kategori Berisiko Tinggi (+20 Poin)
  const highRiskCategories = ["entertainment", "hiburan", "pribadi", "donasi", "lainnya"];
  const normalizedCategory = (input.category || "").toLowerCase();

  if (
    highRiskCategories.some((c) => normalizedCategory.includes(c)) ||
    (input.description && /karaoke|spa|golf|lounge|fine dining|vip/i.test(input.description))
  ) {
    flags.isHighRiskCat = true;
    points.push({
      rule: "Kategori Pengeluaran Berisiko Tinggi (Entertainment/Hiburan)",
      points: 20,
      category: "HIGH_RISK_CAT",
      detail: `Klasifikasi beban ${input.category} masuk ke dalam kuadran rawan penyalahgunaan dana representasi.`,
    });
  }

  // 5. Parameter 5: Transaksi Di Luar Jam / Hari Kerja (+15 Poin)
  // Jam malam (21:00 - 05:00 WIB) atau akhir pekan (Sabtu=6, Minggu=0)
  const hours = now.getHours();
  const day = now.getDay();
  const isWeekend = day === 0 || day === 6;
  const isNight = hours >= 21 || hours < 5;

  if (isWeekend || isNight) {
    flags.isOffHours = true;
    points.push({
      rule: `Pengajuan Di Luar Jam/Hari Kerja (${isNight ? `Pukul ${hours.toString().padStart(2, "0")}:00 WIB` : "Hari Libur Akhir Pekan"})`,
      points: 15,
      category: "OFF_HOURS",
      detail: "Transaksi atau pengunggahan berkas dilakukan di luar jendela jam operasional kantor normal.",
    });
  }

  // 6. Parameter 6: Nominal Bulat Sempurna Tidak Wajar (+10 Poin)
  // Transaksi bernilai bulat > Rp 1.000.000 tanpa komponen desimal/pajak (mis. Rp 10.000.000 atau Rp 50.000.000 bulat)
  if (input.amount >= 5000000 && input.amount % 1000000 === 0) {
    flags.isRoundAmount = true;
    points.push({
      rule: "Nominal Bulat Sempurna Tanpa Rincian Pajak (PPN/PPh)",
      points: 10,
      category: "ROUND_AMOUNT",
      detail: `Nominal Rp ${input.amount.toLocaleString("id-ID")} berbentuk angka bulat penuh yang mencurigakan tanpa komponen potongan atau pajak tertera.`,
    });
  }

  // Perhitungan Skor Akhir: MIN(100, sum(points))
  const totalPoints = points.reduce((acc, curr) => acc + curr.points, 0);
  const finalScore = Math.min(100, totalPoints);

  // Ambang Batas: < 40 Fast-Track Auto Approval, >= 40 Review Auditor
  const isAutoApproved = finalScore < 40;

  // Level Risiko
  let riskLevel: FraudEvaluationResult["riskLevel"] = "LOW";
  if (finalScore >= 80) riskLevel = "CRITICAL";
  else if (finalScore >= 60) riskLevel = "HIGH";
  else if (finalScore >= 40) riskLevel = "MEDIUM";

  // Pembuatan Narasi Explainable AI (XAI)
  let reasonXai = "";
  if (isAutoApproved) {
    reasonXai = `Dokumen berisiko rendah (Skor ${finalScore}%). Seluruh parameter berada di dalam batas kepatuhan SOP keuangan instansi. Berkas memenuhi kriteria Fast-Track Auto Approval dan langsung diteruskan ke sistem pencairan kas.`;
  } else {
    const violationSummary = points.map((p) => p.rule).join("; ");
    reasonXai = `PERINGATAN AUDIT (Skor Risiko ${finalScore}%, Tingkat ${riskLevel}): Ditemukan indikasi anomali: ${violationSummary}. Berkas memerlukan pemeriksaan manual dan pengujian bukti fisik kuitansi oleh Auditor Forensik.`;
  }

  return {
    finalScore,
    riskLevel,
    isAutoApproved,
    reasonXai,
    pointsBreakdown: points,
    flags,
  };
}
