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
      where.department = { contains: department };
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
        continue;
      }

      // Generate random kode transaksi berurutan jika tidak ada (format TX-XXXXX)
      const code = item.code || `TX-${Math.floor(10000 + Math.random() * 90000)}`;

      // 1. Evaluasi Fraud Engine (Rule-based + pHash + XAI + Verifikasi Faktur & Pajak)
      const evaluation = await evaluateTransactionFraud({
        vendor,
        date: new Date(date || new Date()),
        amount: Number(amount),
        category: category || "operasional",
        department,
        phashFingerprint: receipt?.phashFingerprint,
        description,
        extractedAmount: receipt?.extractedAmount !== undefined ? Number(receipt.extractedAmount) : undefined,
        invoiceArithmeticValid: receipt?.invoiceArithmeticValid,
        invoiceArithmeticDiff: receipt?.invoiceArithmeticDiff ? Number(receipt.invoiceArithmeticDiff) : undefined,
        tamperDetected: receipt?.tamperDetected,
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
          date: new Date(date || new Date()),
          amount: Number(amount),
          description: description || "Pengajuan pengeluaran kas mandiri staf.",
          status: initialStatus,
          receipt: receipt
            ? {
                create: {
                  imageUrl: receipt.imageUrl || "/mock-receipts/placeholder.jpg",
                  ocrRawText: receipt.ocrRawText || "",
                  extractedVendor: receipt.extractedVendor || vendor,
                  extractedDate: receipt.extractedDate || (date ? String(date) : ""),
                  extractedAmount: Number(receipt.extractedAmount || amount),
                  phashFingerprint: receipt.phashFingerprint || null,
                  sha256Hash: receipt.sha256Hash || null,
                  mimeType: receipt.mimeType || "image/jpeg",
                  fileSizeKb: Number(receipt.fileSizeKb || 1200),
                  ocrConfidence: Number(receipt.ocrConfidence || 0.95),
                  ocrLatencyMs: Number(receipt.ocrLatencyMs || 1200),
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
      }

      createdResults.push(txn);
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
