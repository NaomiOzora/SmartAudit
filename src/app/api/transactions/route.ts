import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { evaluateTransactionFraud } from "@/lib/fraud-engine";
import { triggerDisbursementWebhook } from "@/lib/webhook-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const risk = searchParams.get("risk"); // "ALL", "HIGH", "MEDIUM", "LOW"
    const department = searchParams.get("department");
    const status = searchParams.get("status"); // "PENDING_REVIEW", "AUTO_APPROVED", dll.
    const sort = searchParams.get("sort") || "risk"; // "risk" (highest first) | "date" (newest first)

    const where: any = {};

    if (search) {
      where.OR = [
        { code: { contains: search } },
        { vendor: { contains: search } },
        { applicantName: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (department && department !== "all") {
      where.department = { equals: department };
    }

    if (status && status !== "all") {
      where.status = status;
    }

    if (risk && risk !== "ALL") {
      where.fraudAnalysis = {
        riskLevel: risk,
      };
    }

    let orderBy: any = [{ createdAt: "desc" }];
    if (sort === "risk") {
      orderBy = [
        {
          fraudAnalysis: {
            riskScore: "desc",
          },
        },
        { createdAt: "desc" },
      ];
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        receipt: true,
        fraudAnalysis: true,
        auditLogs: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy,
    });

    return NextResponse.json({ success: true, data: transactions });
  } catch (error: unknown) {
    console.error("Gagal mengambil data transaksi:", error);
    return NextResponse.json(
      { error: "Gagal memuat antrean transaksi." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Dukung Bulk CSV Array atau Single Ingestion Object
    const isBulk = Array.isArray(body);
    const items = isBulk ? body : [body];
    const createdResults = [];

    for (const item of items) {
      const {
        applicantName,
        department,
        category,
        vendor,
        date,
        amount,
        description,
        receipt, // { imageUrl, ocrRawText, extractedVendor, extractedDate, extractedAmount, phashFingerprint, sha256Hash, mimeType, fileSizeKb, ocrConfidence, ocrLatencyMs }
      } = item;

      if (!applicantName || !department || !vendor || !amount) {
        if (!isBulk) {
          return NextResponse.json(
            {
              success: false,
              error:
                "Data formulir belum lengkap. Pastikan Nama Pemohon, Departemen, Vendor, dan Nominal Grand Total telah terisi.",
            },
            { status: 400 }
          );
        }
        continue;
      }

      // Pastikan tanggal valid untuk database
      let safeTxnDate = new Date();
      if (date) {
        const parsed = new Date(date);
        if (!isNaN(parsed.getTime())) {
          safeTxnDate = parsed;
        }
      }

      // Generate random kode transaksi berurutan unik (format TX-XXXXX)
      let code = item.code;
      if (!code) {
        let attempts = 0;
        while (attempts < 5) {
          const candidate = `TX-${Math.floor(10000 + Math.random() * 90000)}`;
          const existing = await prisma.transaction.findUnique({ where: { code: candidate } });
          if (!existing) {
            code = candidate;
            break;
          }
          attempts++;
        }
        if (!code) {
          code = `TX-${Date.now().toString().slice(-5)}`;
        }
      }

      // Ekstrak parameter forensik dari receipt.ocrRawText jika tersedia
      let ocrParsed: any = null;
      if (receipt?.ocrRawText) {
        try {
          ocrParsed = JSON.parse(receipt.ocrRawText);
        } catch {}
      }

      const invoiceNumber = ocrParsed?.invoiceNumber || receipt?.invoiceNumber || item.invoiceNumber;
      const poNumber = ocrParsed?.poNumber || receipt?.poNumber || item.poNumber;
      const dueDate = ocrParsed?.dueDate || receipt?.dueDate || item.dueDate;
      const vendorDetails = ocrParsed?.vendorDetails || receipt?.vendorDetails || item.vendorDetails;
      const customerDetails = ocrParsed?.customerDetails || receipt?.customerDetails || item.customerDetails;
      const taxId = ocrParsed?.taxId || receipt?.taxId || item.taxId;
      const kopTaxId = ocrParsed?.kopTaxId || receipt?.kopTaxId || item.kopTaxId;
      const subtotal = ocrParsed?.subtotal !== undefined ? Number(ocrParsed.subtotal) : (receipt?.subtotal !== undefined ? Number(receipt.subtotal) : undefined);
      const taxPpn = ocrParsed?.taxPpn !== undefined ? Number(ocrParsed.taxPpn) : (receipt?.taxPpn !== undefined ? Number(receipt.taxPpn) : undefined);
      const dpp = ocrParsed?.dpp !== undefined ? Number(ocrParsed.dpp) : (receipt?.dpp !== undefined ? Number(receipt.dpp) : undefined);
      const paymentInfo = ocrParsed?.paymentInfo || receipt?.paymentInfo || item.paymentInfo;
      const signatures = ocrParsed?.signatures || receipt?.signatures || item.signatures;
      const itemsList = ocrParsed?.items || receipt?.items || item.items || [];
      const rawOcrText = ocrParsed?.rawText || receipt?.ocrRawText || "";

      // 1. Evaluasi Fraud Engine (Rule-based + pHash + XAI + Verifikasi Faktur & Pajak Forensik)
      const evaluation = await evaluateTransactionFraud({
        vendor,
        date: safeTxnDate,
        amount: Number(amount),
        category: category || "operasional",
        department,
        applicantName,
        phashFingerprint: receipt?.phashFingerprint,
        description,
        extractedAmount: receipt?.extractedAmount !== undefined ? Number(receipt.extractedAmount) : undefined,
        invoiceArithmeticValid: receipt?.invoiceArithmeticValid,
        invoiceArithmeticDiff: receipt?.invoiceArithmeticDiff ? Number(receipt.invoiceArithmeticDiff) : undefined,
        tamperDetected: receipt?.tamperDetected,
        invoiceNumber,
        poNumber,
        dueDate,
        vendorDetails,
        customerDetails,
        taxId,
        kopTaxId,
        subtotal,
        discount: ocrParsed?.discount,
        dpp,
        taxPpn,
        taxPph: ocrParsed?.taxPph,
        otherFees: ocrParsed?.otherFees,
        paymentInfo,
        signatures,
        items: itemsList,
        rawOcrText,
      });

      // Status awal berdasarkan ambang batas PRD (< 40 = AUTO_APPROVED, >= 40 = PENDING_REVIEW)
      const initialStatus = evaluation.isAutoApproved
        ? "AUTO_APPROVED"
        : "PENDING_REVIEW";

      // 2. Simpan ke Database via Prisma
      const txn = await prisma.transaction.create({
        data: {
          code,
          applicantName,
          department,
          category: category || "operasional",
          vendor,
          date: safeTxnDate,
          amount: Number(amount),
          description: description || "Pengajuan pengeluaran kas mandiri staf.",
          status: initialStatus,
          receipt: receipt
            ? {
                create: {
                  imageUrl: receipt.imageUrl || "/mock-receipts/placeholder.jpg",
                  ocrRawText: receipt.ocrRawText || "",
                  extractedVendor: receipt.extractedVendor || vendor,
                  extractedDate: receipt.extractedDate || safeTxnDate.toISOString().split("T")[0],
                  extractedAmount: receipt.extractedAmount !== undefined ? Number(receipt.extractedAmount) : 0,
                  phashFingerprint: receipt.phashFingerprint || null,
                  sha256Hash: receipt.sha256Hash || null,
                  mimeType: receipt.mimeType || "image/jpeg",
                  fileSizeKb: Math.round(Number(receipt.fileSizeKb || 1200)),
                  ocrConfidence: Number(receipt.ocrConfidence || 0.95),
                  ocrLatencyMs: Math.round(Number(receipt.ocrLatencyMs || 1200)),
                },
              }
            : undefined,
          fraudAnalysis: {
            create: {
              riskScore: evaluation.finalScore,
              riskLevel: evaluation.riskLevel,
              reasonXai: evaluation.reasonXai,
              pointsBreakdown: JSON.stringify(evaluation.pointsBreakdown),
              isDuplicate: evaluation.flags.isDuplicate,
              duplicateTarget: evaluation.flags.duplicateTarget,
              duplicateSim: evaluation.flags.duplicateSim,
              isSplitBill: evaluation.flags.isSplitBill,
              isAnomalyAmount: evaluation.flags.isAnomalyAmount,
              isHighRiskCat: evaluation.flags.isHighRiskCat,
              isOffHours: evaluation.flags.isOffHours,
              isRoundAmount: evaluation.flags.isRoundAmount,
            },
          },
          auditLogs: {
            create: {
              auditorName: "Sistem Otomasi SmartAudit",
              action: initialStatus,
              notes: evaluation.reasonXai,
              tamperHash: receipt?.sha256Hash || `sha256:${code}`,
            },
          },
        },
        include: {
          receipt: true,
          fraudAnalysis: true,
        },
      });

      // 3. Jika Fast-Track Auto Approved (< 40%), trigger outbound webhook secara instan!
      if (evaluation.isAutoApproved) {
        try {
          await triggerDisbursementWebhook({
            id: txn.id,
            code: txn.code,
            vendor: txn.vendor,
            amount: txn.amount,
            applicantName: txn.applicantName,
            department: txn.department,
            riskScore: evaluation.finalScore,
            approvalType: "AUTO_FAST_TRACK",
            auditorNotes: "Pencairan instan diautentikasi oleh SmartAudit AI Engine.",
          });
        } catch (webhookErr) {
          console.error("Non-blocking outbound webhook error:", webhookErr);
        }
      }

      createdResults.push(txn);
    }

    if (createdResults.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Tidak ada transaksi yang dapat diproses. Periksa kelengkapan data.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: isBulk
        ? `${createdResults.length} transaksi massal berhasil diproses.`
        : "Pengajuan berhasil disimpan dan dievaluasi.",
      data: isBulk ? createdResults : createdResults[0],
    });
  } catch (error: unknown) {
    console.error("Gagal menyimpan transaksi:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan pengajuan transaksi." },
      { status: 500 }
    );
  }
}
