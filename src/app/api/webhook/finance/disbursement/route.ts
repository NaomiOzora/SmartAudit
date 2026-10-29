import { NextRequest, NextResponse } from "next/server";

/**
 * Endpoint Simulasi Webhook Eksternal Sistem Kasir / ERP Keuangan
 * Menerima payload instruksi pencairan dana (Disbursement Instruction)
 * dan instruksi pembatalan pencairan (Cancellation / Void)
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // 1. Tangani Pembatalan Pencairan Kas (Cancellation / Void)
    if (
      payload.event === "DISBURSEMENT_PAYMENT_CANCELLED_VOID" ||
      payload.action === "CANCEL_PAYMENT" ||
      payload.status === "VOID"
    ) {
      const voidRef = `VOID-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
      console.log("[WEBHOOK OUTBOUND CANCELLATION] Pembatalan Pencairan Kas Diterima ERP:", {
        transactionId: payload.transactionId,
        amount: payload.amount,
        cancelledBy: payload.cancelledBy,
        reason: payload.cancellationReason,
        voidRef,
      });

      return NextResponse.json(
        {
          status: "CANCELLED",
          message: `Instruksi pencairan untuk berkas ${payload.transactionId} telah DIBATALKAN / VOID oleh Auditor Forensik. Pembayaran dibatalkan dan dana kas tidak dicairkan.`,
          voidRef,
          cancelledAt: new Date().toISOString(),
          cancellationReason: payload.cancellationReason || "Ditolak dalam audit investigatif",
          receivedPayload: payload,
        },
        { status: 200 }
      );
    }

    // 2. Tangani Otorisasi Pencairan Kas (Disbursement Authorization)
    const paymentRef = `DISB-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    const disbursedAt = new Date().toISOString();

    console.log("[WEBHOOK OUTBOUND RECEIVED] Instruksi Pencairan:", {
      transactionId: payload.transactionId,
      amount: payload.amount,
      vendor: payload.vendor,
      paymentRef,
    });

    return NextResponse.json(
      {
        status: "SUCCESS",
        message: "Instruksi pencairan kas berhasil diterima oleh ERP Bank Kasir.",
        paymentRef,
        disbursedAt,
        receivedPayload: payload,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Gagal memproses webhook pencairan:", error);
    return NextResponse.json(
      { error: "Format payload webhook tidak valid." },
      { status: 400 }
    );
  }
}
