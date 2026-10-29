import prisma from "./prisma";
import { checkDatabaseDuplicateHash } from "./hash-utils";
import { getDivisionLimit, MAX_3SIGMA_AUTO_LIMIT } from "./division-limits";
import { EXPENSE_CATEGORIES_MAP, formatCategoryLabel } from "./expense-categories";

export interface InvoiceItemInput {
  no?: number;
  name: string;
  qty?: number;
  unit?: string;
  unitPrice?: number;
  totalPrice?: number;
}

export interface TransactionInput {
  vendor: string;
  date: string | Date;
  amount: number;
  category: string;
  department: string;
  applicantName?: string;
  phashFingerprint?: string;
  submissionTime?: Date;
  description?: string;
  excludeTransactionId?: string;
  // Parameter Verifikasi Forensik Faktur:
  extractedAmount?: number;
  invoiceArithmeticValid?: boolean;
  invoiceArithmeticDiff?: number;
  tamperDetected?: boolean;
  // Parameter Forensik Data OCR & Ingestion Lengkap:
  invoiceNumber?: string | null;
  poNumber?: string | null;
  dueDate?: string | Date | null;
  vendorDetails?: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    taxId?: string;
    contactPerson?: string;
  };
  customerDetails?: {
    name?: string;
    address?: string;
    phone?: string;
    taxId?: string;
  };
  taxId?: string | null; // NPWP Penjual
  kopTaxId?: string | null; // NPWP pada Kop/Header
  subtotal?: number;
  discount?: number;
  dpp?: number;
  taxPpn?: number;
  taxPph?: number;
  otherFees?: number;
  paymentInfo?: {
    bank?: string;
    accountNumber?: string;
    accountName?: string;
    terms?: string;
  };
  signatures?: {
    seller?: string;
    buyer?: string;
  };
  items?: InvoiceItemInput[];
  rawOcrText?: string;
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
 * Mesin Deteksi Fraud Hibrida Tingkat Lanjut (Forensic Rule-Based Engine + AI Vision + pHash + XAI)
 * Mendeteksi anomali perpajakan, duplikasi nomor invoice, benturan kepentingan rekening staf,
 * anomali kronologis, evasif pagu deviasi (threshold evasion), dan integritas data pengadaan.
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

  // Flag pelindung fatal untuk mencegah auto approval
  let hasFatalConflictOfInterest = false;
  let hasFatalDuplicateInvoice = false;
  let hasFatalIllegalTax = false;
  let hasFatalCollusionPhone = false;
  let hasFatalInvalidTaxId = false;
  let hasFatalChronologicalAnomaly = false;

  // =========================================================================
  // 1. PARAMETER 1: DETEKSI DUPLIKASI GRAFIS & EXACT MATCH (+40 - +50 POIN)
  // =========================================================================
  // a) pHash similarity > 85%
  if (input.phashFingerprint && input.phashFingerprint !== "0000000000000000") {
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

  // b) Cek Duplikasi Nomor Faktur Resmi di Database (+50 Poin)
  const invoiceNumber = (input.invoiceNumber || "").trim();
  if (
    invoiceNumber &&
    invoiceNumber !== "-" &&
    !/^(nihil|tidak\s*ada|n\/?a|null|undefined)$/i.test(invoiceNumber)
  ) {
    const cleanInvoiceNorm = invoiceNumber.replace(/[\s\-_]/g, "").toLowerCase();

    const existingTxs = await prisma.transaction.findMany({
      where: {
        ...(input.excludeTransactionId ? { id: { not: input.excludeTransactionId } } : {}),
      },
      include: {
        receipt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 60,
    });

    let dupInvoiceTx: any = null;
    for (const tx of existingTxs) {
      if (!tx.receipt?.ocrRawText) continue;
      try {
        const parsed = JSON.parse(tx.receipt.ocrRawText);
        const otherInv = (parsed.invoiceNumber || "").replace(/[\s\-_]/g, "").toLowerCase();
        if (otherInv && otherInv === cleanInvoiceNorm) {
          dupInvoiceTx = tx;
          break;
        }
      } catch {
        if (tx.receipt.ocrRawText.includes(invoiceNumber)) {
          dupInvoiceTx = tx;
          break;
        }
      }
    }

    if (dupInvoiceTx) {
      flags.isDuplicate = true;
      hasFatalDuplicateInvoice = true;
      if (!flags.duplicateTarget) flags.duplicateTarget = dupInvoiceTx.code;
      flags.duplicateSim = 1.0;

      points.push({
        rule: `Duplikasi Nomor Faktur Resmi (${invoiceNumber})`,
        points: 50,
        category: "DUPLICATION",
        detail: `Nomor faktur '${invoiceNumber}' terdeteksi duplikat dengan transaksi terdaftar ${dupInvoiceTx.code} (${dupInvoiceTx.vendor}, Rp ${dupInvoiceTx.amount.toLocaleString("id-ID")}). Berkas faktur komersial dan faktur pajak bersifat unik dan dilarang diajukan berulang.`,
      });
    }
  }

  // c) Cek Exact Match teks Vendor + Tanggal + Nominal di DB jika belum kena pHash
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

  // d) Indikasi Kolusi: Nomor Kontak Penjual Sama dengan Nomor Kontak Pembeli (+50 Poin)
  const vendorPhone = (input.vendorDetails?.phone || "").trim();
  const customerPhone = (input.customerDetails?.phone || "").trim();

  // Helper normalisasi nomor telepon Indonesia secara presisi & kebal false positive
  const normalizePhoneNumbers = (str: string): string[] => {
    if (!str) return [];
    // Pisahkan jika ada multi-nomor seperti "021-23588900 / 08119822301", newline, koma, dsb.
    const parts = str.split(/[\/|;,\n]+/);
    const results: string[] = [];
    for (const part of parts) {
      const digits = part.replace(/\D/g, "");
      if (!digits) continue;
      let norm = digits;
      if (norm.startsWith("62")) norm = "0" + norm.slice(2);
      else if (norm.startsWith("8")) norm = "0" + norm;
      // Standar nomor telepon valid di Indonesia:
      // Landline dengan kode area (9-11 digit, misal 02123588900) & Seluler (10-13 digit, misal 08137845285)
      if (norm.length >= 9 && norm.length <= 13) {
        if (!results.includes(norm)) results.push(norm);
      }
    }
    return results;
  };

  let sellerPhoneText = "";
  let buyerPhoneText = "";
  if (input.rawOcrText) {
    // Hilangkan judul "FAKTUR PEMBELIAN" agar kata PEMBELIAN tidak salah terdeteksi sebagai awal blok pihak pembeli
    const cleanOcr = input.rawOcrText.replace(/\bFAKTUR\s+PEMBELIAN\b/gi, "FAKTUR_PURCHASE");

    // Ambil nomor kontak penjual (dari blok PENJUAL sebelum PEMBELI)
    const sBlockMatch = cleanOcr.match(/\b(?:PIHAK\s+)?PENJUAL\b[\s\S]*?(?=\b(?:PIHAK\s+)?PEMBELI\b|RINCIAN|$)/i);
    if (sBlockMatch) {
      const sMatch = sBlockMatch[0].match(/(?:Nomor\s*Kontak|Telp|Telepon|HP|WA|No\.\s*HP)\s*:\s*([^\n\r]+)/i);
      if (sMatch) sellerPhoneText = sMatch[1].trim();
    } else {
      const sMatch = cleanOcr.match(/\b(?:PIHAK\s+)?PENJUAL\b[\s\S]*?(?:Nomor\s*Kontak|Telp|Telepon)\s*:\s*([^\n\r]+)/i);
      if (sMatch) sellerPhoneText = sMatch[1].trim();
    }

    // Ambil nomor kontak pembeli (dari blok PEMBELI setelah DATA PIHAK)
    const bBlockMatch = cleanOcr.match(/\b(?:PIHAK\s+)?PEMBELI\b[\s\S]*?(?=RINCIAN|TERBILANG|INFORMASI\s*PEMBAYARAN|$)/i);
    if (bBlockMatch) {
      const bMatch = bBlockMatch[0].match(/(?:Nomor\s*Kontak|Telp|Telepon|HP|WA|No\.\s*HP)\s*:\s*([^\n\r]+)/i);
      if (bMatch) buyerPhoneText = bMatch[1].trim();
    }
  }

  const allSellerPhones = [
    ...normalizePhoneNumbers(vendorPhone),
    ...normalizePhoneNumbers(sellerPhoneText),
  ].filter((v, i, a) => a.indexOf(v) === i);

  const allBuyerPhones = [
    ...normalizePhoneNumbers(customerPhone),
    ...normalizePhoneNumbers(buyerPhoneText),
  ].filter((v, i, a) => a.indexOf(v) === i);

  const matchedPhone = allSellerPhones.find((sp) => allBuyerPhones.includes(sp));
  if (matchedPhone) {
    flags.isDuplicate = true;
    hasFatalCollusionPhone = true;

    points.push({
      rule: "Indikasi Kolusi Internal: Nomor Kontak Penjual Sama dengan Kontak Pembeli",
      points: 50,
      category: "DUPLICATION",
      detail: `Nomor kontak pihak penjual ('${vendorPhone || sellerPhoneText}') identik dengan kontak pihak pembeli ('${customerPhone || buyerPhoneText}') [Nomor identik: ${matchedPhone}]. Menandakan transaksi fiktif / self-dealing yang dikendalikan oleh oknum komunikasi yang sama.`,
    });
  }

  // =========================================================================
  // 2. PARAMETER 2: DETEKSI SPLIT BILL (+35 POIN)
  // =========================================================================
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
    if (timeDiff <= twoHoursMs) {
      splitBillDetected = true;
      break;
    }
    if (input.amount >= 50000000 && input.amount < MAX_3SIGMA_AUTO_LIMIT && prevTx.amount >= 50000000) {
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
      detail: `Terdapat pengeluaran beruntun ke vendor yang sama dalam jeda waktu singkat untuk menghindari pagu otorisasi direksi (Rp 75 Jt).`,
    });
  }

  // =========================================================================
  // 3. PARAMETER 3: BENTURAN KEPENTINGAN & REKENING STAF (FATAL +60 POIN)
  // =========================================================================
  const accountName = (input.paymentInfo?.accountName || "").trim().toLowerCase();
  const buyerSigner = (input.signatures?.buyer || "").trim().toLowerCase();
  const applicantName = (input.applicantName || "").trim().toLowerCase();

  const internalStaffKeywords = [
    "bayu aditya",
    "wahyu pratama",
    "clarissa utami",
    "kevin adiputra",
    "hendra kusuma",
    "rian pratama",
    "budi santoso",
    "dewi lestari",
  ];

  const isSignerAccountMatch =
    Boolean(buyerSigner) &&
    (accountName.includes(buyerSigner) || buyerSigner.includes(accountName));
  const isApplicantAccountMatch =
    Boolean(applicantName) &&
    (accountName.includes(applicantName) || applicantName.includes(accountName));
  const isInternalBuyerStaff = internalStaffKeywords.some((staff) =>
    accountName.includes(staff)
  );

  if (accountName && (isSignerAccountMatch || isApplicantAccountMatch || isInternalBuyerStaff)) {
    flags.isAnomalyAmount = true;
    hasFatalConflictOfInterest = true;
    const rawAccountName = input.paymentInfo?.accountName || "Staf Internal Pembeli";

    points.push({
      rule: `Konflik Kepentingan Kritis: Rekening Tujuan Atas Nama Pribadi Wakil Pembeli (${rawAccountName})`,
      points: 60,
      category: "ANOMALY_AMOUNT",
      detail: `Rekening tujuan pembayaran (${input.paymentInfo?.bank || "Bank"} No. ${input.paymentInfo?.accountNumber || "-"} a.n. ${rawAccountName}) terdeteksi merupakan rekening pribadi milik staf perwakilan pembeli (${input.signatures?.buyer || input.applicantName || "Bayu Aditya"}), bukan rekening resmi badan usaha rekanan. Indikasi fatal tindak penggelapan kas instansi (Embezzlement)!`,
    });
  }

  // =========================================================================
  // 4. PARAMETER 4: KEABSAHAN NPWP & PEMUNGUTAN PPN ILEGAL (+40 - +45 POIN)
  // =========================================================================
  const vendorTaxId = (
    input.vendorDetails?.taxId ||
    input.taxId ||
    ""
  ).trim();
  const cleanedNpwpDigits = vendorTaxId.replace(/\D/g, "");

  // Periksa apakah NPWP berformat dummy nol
  const isDummyAllZeroes =
    /^0+$/.test(cleanedNpwpDigits) ||
    /^00\.000\.000/i.test(vendorTaxId);
  const isNpwpLengthInvalid =
    vendorTaxId !== "" &&
    cleanedNpwpDigits.length !== 15 &&
    cleanedNpwpDigits.length !== 16;
  const isVendorTaxIdInvalid =
    !vendorTaxId ||
    vendorTaxId === "-" ||
    isDummyAllZeroes ||
    isNpwpLengthInvalid;

  // Cek inkonsistensi dengan Kop Faktur
  let kopTaxId = (input.kopTaxId || "").trim();
  if (!kopTaxId && input.rawOcrText) {
    const kopMatch = input.rawOcrText.match(/NPWP\s*:\s*([^\n\r|]+)/i);
    if (kopMatch) {
      kopTaxId = kopMatch[1].trim();
    }
  }
  const isKopNpwpEmpty =
    !kopTaxId || kopTaxId === "-" || /^(tidak\s*ada|nihil|\-)$/i.test(kopTaxId);
  const isKopMismatch =
    isKopNpwpEmpty && Boolean(vendorTaxId) && vendorTaxId !== "-";

  if (isVendorTaxIdInvalid || isKopMismatch) {
    flags.isAnomalyAmount = true;
    hasFatalInvalidTaxId = true;

    points.push({
      rule: "NPWP Penjual Tidak Valid & Tidak Sama dengan Kop Faktur",
      points: 40,
      category: "ANOMALY_AMOUNT",
      detail: `NPWP penjual tercatat berformat dummy fiktif ('${vendorTaxId || "-"}') dan terdapat inkonsistensi dengan kop faktur yang mencantumkan NPWP '${kopTaxId || "-"}'. Entitas vendor tidak terverifikasi aktif sebagai Wajib Pajak sah di DJP.`,
    });
  }

  // Cek Pemungutan PPN Ilegal oleh Non-PKP (+45 Poin)
  const ppnVal = Number(input.taxPpn) || 0;
  if (ppnVal > 0 && isVendorTaxIdInvalid) {
    flags.isAnomalyAmount = true;
    hasFatalIllegalTax = true;

    points.push({
      rule: "Pemungutan PPN Ilegal (PPN Dikenakan Tanpa NPWP PKP Valid)",
      points: 45,
      category: "ANOMALY_AMOUNT",
      detail: `Faktur memungut PPN 11% sebesar Rp ${ppnVal.toLocaleString("id-ID")} padahal entitas penjual tidak memiliki NPWP valid / berstatus dummy nol (bukan Pengusaha Kena Pajak resmi). Berdasarkan UU KUP & UU PPN, entitas non-PKP dilarang keras memungut PPN.`,
    });
  }

  // =========================================================================
  // 5. PARAMETER 5: ANOMALI KRONOLOGIS FAKTUR (+40 POIN)
  // =========================================================================
  if (input.dueDate && input.date) {
    const invDateObj = new Date(input.date);
    const dueDateObj = new Date(input.dueDate);

    if (!isNaN(invDateObj.getTime()) && !isNaN(dueDateObj.getTime())) {
      invDateObj.setHours(0, 0, 0, 0);
      dueDateObj.setHours(0, 0, 0, 0);

      if (dueDateObj.getTime() < invDateObj.getTime()) {
        flags.isAnomalyAmount = true;
        hasFatalChronologicalAnomaly = true;
        const diffDays = Math.round(
          (invDateObj.getTime() - dueDateObj.getTime()) / (1000 * 60 * 60 * 24)
        );
        const dueStr = dueDateObj.toISOString().split("T")[0];
        const invStr = invDateObj.toISOString().split("T")[0];

        points.push({
          rule: "Anomali Kronologis (Tanggal Jatuh Tempo Lebih Awal dari Tanggal Faktur)",
          points: 40,
          category: "ANOMALY_AMOUNT",
          detail: `Tanggal jatuh tempo faktur (${dueStr}) tercatat ${diffDays} hari LEBIH AWAL daripada tanggal terbit faktur (${invStr}). Anomali kronologis ini menandakan cacat substansi waktu dokumen atau indikasi kuat faktur dibuat mundur secara rekayasa (backdated).`,
        });
      }
    }
  }

  // =========================================================================
  // 6. PARAMETER 6: KELENGKAPAN PURCHASE ORDER (PO) (+30 POIN)
  // =========================================================================
  const poRaw = (input.poNumber || "").trim();
  const isPoMissing =
    !poRaw ||
    poRaw === "-" ||
    /^(nihil|tidak\s*ada|n\/?a|\-|\s*|null|undefined)$/i.test(poRaw);

  if (isPoMissing && input.amount >= 5000000) {
    flags.isAnomalyAmount = true;
    points.push({
      rule: "Ketiadaan Dokumen Purchase Order (PO Tidak Ada / Nihil)",
      points: 30,
      category: "ANOMALY_AMOUNT",
      detail: `Nomor PO / Referensi tidak dicantumkan ('${poRaw || "-"}') pada transaksi pengeluaran bernilai signifikan (Rp ${input.amount.toLocaleString("id-ID")}). Berdasarkan SOP pengadaan instansi, belanja di atas Rp 5.000.000 wajib dilengkapi Purchase Order resmi yang disahkan bagian Pengadaan.`,
    });
  }

  // =========================================================================
  // 7. PARAMETER 7: ITEM GENERIK TUNGGAL BERNOMINAL BULAT (+35 POIN)
  // =========================================================================
  const itemsList = input.items || [];
  if (itemsList.length === 1) {
    const singleItem = itemsList[0];
    const itemName = (singleItem.name || "").trim();
    const itemUnit = (singleItem.unit || "").toLowerCase();
    const itemPrice = singleItem.totalPrice || singleItem.unitPrice || input.amount;

    const isGenericKeyword =
      /jasa|konsultasi|lain-lain|biaya|pengadaan|operasional|fee|honor|service|miscellaneous|paket|konsultan/i.test(itemName) ||
      /\(lain-lain\)/i.test(itemName) ||
      /\blain[- ]?lain\b/i.test(itemName);

    const isGenericUnit = /paket|lot|kegiatan|ls|lump\s*sum/i.test(itemUnit);
    const isRound =
      itemPrice >= 5000000 &&
      (itemPrice % 100000 === 0 || itemPrice % 1000000 === 0);

    if (isGenericKeyword && (isGenericUnit || isRound || itemPrice >= 10000000)) {
      flags.isAnomalyAmount = true;
      points.push({
        rule: `Item Generik Tunggal Bernominal Bulat Tanpa Rincian ('${itemName}')`,
        points: 35,
        category: "ANOMALY_AMOUNT",
        detail: `Hanya terdapat 1 baris item tunggal bersifat gelondongan generik ('${itemName}', 1 ${singleItem.unit || "Paket"}) bernilai bulat besar (Rp ${itemPrice.toLocaleString("id-ID")}) tanpa rincian spesifikasi teknis pekerjaan, satuan hari/jam kerja, atau deliverables terukur (indikasi penggelembungan biaya / faktur fiktif).`,
      });
    }
  }

  // =========================================================================
  // 8. PARAMETER 8: THRESHOLD EVASION & BATAS DEVIASI PAGU (+25 - +35 POIN)
  // =========================================================================
  const limitForDept = getDivisionLimit(input.department);
  const ratio = input.amount / limitForDept;

  // a) Evasif Ambang Batas (Threshold Evasion: 90% - 99.9% dari Pagu Divisi)
  if (ratio >= 0.90 && ratio < 1.0) {
    flags.isAnomalyAmount = true;
    const percentage = (ratio * 100).toFixed(1);
    points.push({
      rule: `Indikasi Threshold Evasion (Nominal ${percentage}% dari Pagu, Tepat di Bawah Batas Auto-Lolos)`,
      points: 35,
      category: "ANOMALY_AMOUNT",
      detail: `Nominal pengajuan Rp ${input.amount.toLocaleString("id-ID")} mencapai ${percentage}% dari pagu wajar divisi ${input.department} (Rp ${limitForDept.toLocaleString("id-ID")}). Pola nominal yang mematok angka tepat di bawah batas toleransi deviasi (90%-99.9%) merupakan pola anomali penghindaran batas otorisasi (threshold gaming).`,
    });
  } else if (input.amount > limitForDept) {
    // b) Melampaui pagu deviasi historis normal divisi (> 3 Standar Deviasi)
    flags.isAnomalyAmount = true;
    points.push({
      rule: `Anomali Nominal (> 3 Standar Deviasi per Divisi ${input.department})`,
      points: 25,
      category: "ANOMALY_AMOUNT",
      detail: `Nominal Rp ${input.amount.toLocaleString("id-ID")} melampaui batas deviasi historis normal divisi (ambang batas Rp ${limitForDept.toLocaleString("id-ID")}).`,
    });
  }

  // =========================================================================
  // 9. PARAMETER 9: VERIFIKASI ARITMATIKA, DISKREPANSI & TIPOGRAFI
  // =========================================================================
  // a) Ketidaksesuaian nominal yang diinput pemohon vs nominal faktur fisik AI (+50 Poin)
  if (input.extractedAmount !== undefined && input.extractedAmount > 0) {
    const discrepancy = Math.abs(input.amount - input.extractedAmount);
    if (discrepancy > 100) {
      flags.isAnomalyAmount = true;
      points.push({
        rule: `Ketidaksesuaian Nominal Pengajuan vs Faktur Fisik (Selisih Rp ${discrepancy.toLocaleString("id-ID")})`,
        points: 50,
        category: "ANOMALY_AMOUNT",
        detail: `Nominal yang diinput pemohon (Rp ${input.amount.toLocaleString("id-ID")}) berbeda signifikan dengan total faktur yang diverifikasi AI (Rp ${input.extractedAmount.toLocaleString("id-ID")}). Berkas DILARANG dicairkan secara otomatis!`,
      });
    }
  } else {
    flags.isAnomalyAmount = true;
    points.push({
      rule: "Bukti Fisik Faktur Belum Tervalidasi OCR Presisi",
      points: 40,
      category: "ANOMALY_AMOUNT",
      detail: "Total nominal pada berkas fisik kuitansi belum terverifikasi secara akurat oleh sistem vision AI. Wajib diperiksa bukti fisiknya oleh Auditor Forensik.",
    });
  }

  // b) Kecacatan kalkulasi aritmatika dan pajak (Subtotal + PPN != Total) (+45 Poin)
  if (input.invoiceArithmeticValid === false) {
    flags.isAnomalyAmount = true;
    const diff = input.invoiceArithmeticDiff || 0;
    points.push({
      rule: `Kecacatan Kalkulasi Aritmatika & Pajak Faktur${diff > 0 ? ` (Selisih Hitungan Rp ${diff.toLocaleString("id-ID")})` : ""}`,
      points: 45,
      category: "ANOMALY_AMOUNT",
      detail: `Terdapat ketidaksesuaian matematis pada faktur: penjumlahan Subtotal, PPN, dan potongan tidak menghasilkan Grand Total yang tertera pada dokumen.`,
    });
  }

  // c) Indikasi manipulasi / rekayasa fisik dokumen (+50 Poin)
  if (input.tamperDetected === true) {
    flags.isAnomalyAmount = true;
    points.push({
      rule: "Indikasi Manipulasi / Cacat Tipografi Fisik Dokumen",
      points: 50,
      category: "ANOMALY_AMOUNT",
      detail: "AI mendeteksi anomali tipografi, inkonsistensi font pada nominal, atau indikasi penyuntingan grafis pada bukti faktur.",
    });
  }

  // =========================================================================
  // 10. PARAMETER 10: EMAIL DOMAIN GRATIS & KATEGORI BERISIKO TINGGI (+20 POIN)
  // =========================================================================
  // a) Vendor menggunakan email domain gratis publik
  let vendorEmail = (input.vendorDetails?.email || "").trim().toLowerCase();
  if (!vendorEmail && input.rawOcrText) {
    const emailMatch = input.rawOcrText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      vendorEmail = emailMatch[0].toLowerCase();
    }
  }

  const freeEmailDomains = [
    "gmail.com",
    "yahoo.com",
    "ymail.com",
    "hotmail.com",
    "outlook.com",
    "live.com",
    "icloud.com",
    "mail.com",
    "zoho.com",
  ];
  const isFreeDomain = freeEmailDomains.some((domain) => vendorEmail.endsWith("@" + domain));

  if (isFreeDomain) {
    flags.isHighRiskCat = true;
    points.push({
      rule: `Email Vendor Menggunakan Domain Publik Gratis (${vendorEmail})`,
      points: 20,
      category: "HIGH_RISK_CAT",
      detail: `Perusahaan rekanan (${input.vendor}) menggunakan alamat email dari penyedia layanan gratis (${vendorEmail}) dan bukan domain korporat resmi (.co.id / .id / .com badan usaha). Rentan terhadap praktik vendor fiktif atau rekanan tidak berizin resmi.`,
    });
  }

  // b) Kategori hiburan / entertainment berisiko tinggi
  const highRiskCategories = ["entertainment", "hiburan", "pribadi", "donasi", "lainnya"];
  const normalizedCategory = (input.category || "").toLowerCase();
  const isRegisteredHighRisk = EXPENSE_CATEGORIES_MAP[input.category]?.riskLevel === "HIGH";

  if (
    isRegisteredHighRisk ||
    highRiskCategories.some((c) => normalizedCategory.includes(c)) ||
    (input.description && /karaoke|spa|golf|lounge|fine dining|vip/i.test(input.description))
  ) {
    flags.isHighRiskCat = true;
    const catLabel = formatCategoryLabel(input.category);
    points.push({
      rule: "Kategori Pengeluaran Berisiko Tinggi (Entertainment/Representasi)",
      points: 20,
      category: "HIGH_RISK_CAT",
      detail: `Klasifikasi beban '${catLabel}' masuk ke dalam kuadran rawan penyalahgunaan dana representasi dan wajib diverifikasi dokumen justifikasinya.`,
    });
  }

  // =========================================================================
  // 11. PARAMETER 11: TRANSAKSI DI LUAR JAM KERJA (+15 POIN)
  // =========================================================================
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

  // =========================================================================
  // 12. PARAMETER 12: NOMINAL BULAT SEMPURNA (+10 POIN)
  // =========================================================================
  if (input.amount >= 5000000 && input.amount % 1000000 === 0) {
    flags.isRoundAmount = true;
    points.push({
      rule: "Nominal Bulat Sempurna Tanpa Rincian Pajak (PPN/PPh)",
      points: 10,
      category: "ROUND_AMOUNT",
      detail: `Nominal Rp ${input.amount.toLocaleString("id-ID")} berbentuk angka bulat penuh yang mencurigakan tanpa komponen potongan atau pajak tertera.`,
    });
  }

  // =========================================================================
  // PERHITUNGAN SKOR AKHIR & PENENTUAN STATUS PERSETUJUAN OTOMATIS
  // =========================================================================
  const totalPoints = points.reduce((acc, curr) => acc + curr.points, 0);
  const finalScore = Math.min(100, totalPoints);

  const hasNominalDiscrepancy =
    input.extractedAmount !== undefined &&
    input.extractedAmount > 0 &&
    Math.abs(input.amount - input.extractedAmount) > 100;

  const isUnverifiedReceipt =
    input.extractedAmount === undefined || input.extractedAmount <= 0;

  // Pelanggaran fatal yang secara mutlak menggugurkan auto approval
  const hasFatalViolations =
    hasFatalConflictOfInterest ||
    hasFatalDuplicateInvoice ||
    hasFatalIllegalTax ||
    hasFatalCollusionPhone ||
    hasFatalInvalidTaxId ||
    hasFatalChronologicalAnomaly ||
    flags.isDuplicate ||
    flags.isSplitBill ||
    flags.isAnomalyAmount ||
    flags.isHighRiskCat;

  // Kriteria Fast-Track Auto Approval Ketat (SOP Keuangan FMCG):
  // 1. Skor risiko rendah (< 40)
  // 2. Transaksi bernilai wajar di dalam batas pagu 3-sigma divisi (<= MAX_3SIGMA_AUTO_LIMIT / Rp 75.000.000)
  // 3. Mutlak bebas dari seluruh 10 indikasi pelanggaran fatal forensik (termasuk anomali pagu divisi)
  // 4. Kalkulasi aritmatika 100% klop
  // 5. Bukti fisik tervalidasi dan bebas indikasi rekayasa
  const isAutoApproved =
    finalScore < 40 &&
    input.amount <= MAX_3SIGMA_AUTO_LIMIT &&
    !hasFatalViolations &&
    !hasNominalDiscrepancy &&
    !isUnverifiedReceipt &&
    input.invoiceArithmeticValid !== false &&
    input.tamperDetected !== true;

  // Level Risiko: < 40 LOW, 40-59 MEDIUM, 60-79 HIGH, >= 80 CRITICAL
  let riskLevel: FraudEvaluationResult["riskLevel"] = "LOW";
  if (finalScore >= 80) riskLevel = "CRITICAL";
  else if (finalScore >= 60) riskLevel = "HIGH";
  else if (finalScore >= 40) riskLevel = "MEDIUM";

  // Narasi Explainable AI (XAI)
  let reasonXai = "";
  if (isAutoApproved) {
    reasonXai = `Dokumen berisiko rendah (Skor ${finalScore}%). Seluruh parameter berada di dalam batas kepatuhan SOP keuangan instansi dan bukti fisik faktur terverifikasi 100% klop. Berkas memenuhi kriteria Fast-Track Auto Approval dan langsung diteruskan ke kasir pencairan.`;
  } else {
    const violationSummary = points.map((p) => p.rule).join("; ");
    const isCritical = riskLevel === "CRITICAL" || riskLevel === "HIGH";
    reasonXai = isCritical
      ? `PERINGATAN AUDIT KRITIS (Skor Risiko ${finalScore}%, Tingkat ${riskLevel}): Ditemukan ${points.length} indikasi pelanggaran fatal: ${violationSummary}. Pencairan instan otomatis DIBEKUKAN. Berkas wajib diperiksa secara forensik dan diuji keabsahan fisik dokumennya oleh Satuan Audit Penjamin Keuangan.`
      : `PENELAAHAN AUDIT (Skor Risiko ${finalScore}%, Tingkat ${riskLevel}): Terdeteksi parameter SOP: ${violationSummary}. Berkas dialihkan ke Antrean Review Auditor Forensik untuk verifikasi dokumen fisik dan pencocokan pagu anggaran sebelum pencairan dana disetujui.`;
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
