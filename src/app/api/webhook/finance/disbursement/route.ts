import { NextRequest, NextResponse } from "next/server";

/**
 * Endpoint Simulasi Webhook Eksternal Sistem Kasir / ERP Keuangan
 * Menerima payload instruksi pencairan dana otomatis (Disbursement Instruction)
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

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
