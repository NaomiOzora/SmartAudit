import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { computeSha256 } from "@/lib/hash-utils";
import { triggerDisbursementWebhook } from "@/lib/webhook-service";

export async function POST(req: NextRequest) {
  try {
    const { transactionId, action, notes, auditorName } = await req.json();

    if (!transactionId || !action) {
      return NextResponse.json(
        { error: "Parameter transactionId dan action wajib disertakan." },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        OR: [{ id: transactionId }, { code: transactionId }],
      },
      include: {
        fraudAnalysis: true,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaksi tidak ditemukan." },
        { status: 404 }
      );
    }

    // Tentukan status baru transaksi
    let newStatus = "PENDING_REVIEW";
    if (action === "APPROVED") newStatus = "APPROVED";
    else if (action === "REJECTED") newStatus = "REJECTED";
    else if (action === "CLARIFICATION") newStatus = "NEED_CLARIFICATION";

    // Buat tanda tangan tamper-evident hash kriptografis untuk audit ISO 27001
    const signer = auditorName || "Bambang H. (Auditor Forensik)";
    const timestamp = new Date().toISOString();
    const tamperHash = computeSha256(
      `${transaction.code}|${action}|${signer}|${notes || ""}|${timestamp}`
    );

    // Update status transaksi & simpan AuditLog
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: newStatus,
        auditLogs: {
          create: {
            auditorName: signer,
            action,
            notes: notes || "Putusan dicatat ke lembar berita acara.",
            tamperHash: `sha256:${tamperHash}`,
          },
        },
      },
      include: {
        auditLogs: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    // Jika Auditor menyetujui ("APPROVED"), segera trigger outbound disbursement webhook!
    if (action === "APPROVED") {
      await triggerDisbursementWebhook({
        id: transaction.id,
        code: transaction.code,
        vendor: transaction.vendor,
        amount: transaction.amount,
        applicantName: transaction.applicantName,
        department: transaction.department,
        riskScore: transaction.fraudAnalysis?.riskScore || 50,
        approvalType: "AUDITOR_MANUAL",
        auditorNotes: notes,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Putusan ${action} berhasil diterapkan pada berkas ${transaction.code}.`,
      data: updatedTransaction,
    });
  } catch (error: unknown) {
    console.error("Gagal menyimpan putusan auditor:", error);
    return NextResponse.json(
      { error: "Gagal memproses putusan auditor." },
      { status: 500 }
    );
  }
}
