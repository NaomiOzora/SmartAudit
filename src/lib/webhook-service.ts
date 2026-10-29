import prisma from "./prisma";

export async function triggerDisbursementWebhook(transaction: {
  id: string;
  code: string;
  vendor: string;
  amount: number;
  applicantName: string;
  department: string;
  riskScore: number;
  approvalType: "AUTO_FAST_TRACK" | "AUDITOR_MANUAL";
  auditorNotes?: string;
}) {
  const webhookUrl =
    process.env.DISBURSEMENT_WEBHOOK_URL ||
    "http://localhost:3000/api/webhook/finance/disbursement";

  const payload = {
    event: "DISBURSEMENT_PAYMENT_AUTHORIZED",
    transactionId: transaction.code,
    systemId: transaction.id,
    vendor: transaction.vendor,
    amount: transaction.amount,
    currency: "IDR",
    applicant: transaction.applicantName,
    department: transaction.department,
    riskScore: transaction.riskScore,
    approvalType: transaction.approvalType,
    notes: transaction.auditorNotes || "Pencairan disetujui tanpa catatan anomali.",
    timestamp: new Date().toISOString(),
  };

  const isLocalSimulation =
    !process.env.DISBURSEMENT_WEBHOOK_URL ||
    webhookUrl.includes("/api/webhook/finance/disbursement");

  if (isLocalSimulation) {
    const paymentRef = `DISB-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    const disbursedAt = new Date().toISOString();
    const simulatedResponse = JSON.stringify({
      status: "SUCCESS",
      message: "Instruksi pencairan kas berhasil diterima oleh ERP Bank Kasir.",
      paymentRef,
      disbursedAt,
      receivedPayload: payload,
    });

    console.log("[WEBHOOK OUTBOUND LOCAL SIMULATION] Pencairan Kas Diproses:", {
      transactionId: payload.transactionId,
      amount: payload.amount,
      vendor: payload.vendor,
      paymentRef,
    });

    try {
      await prisma.webhookLog.create({
        data: {
          transactionId: transaction.id,
          targetUrl: webhookUrl,
          payload: JSON.stringify(payload),
          statusCode: 200,
          responseBody: simulatedResponse,
          status: "SUCCESS",
        },
      });
    } catch (dbErr) {
      console.warn("Gagal mencatat webhook log simulasi:", dbErr);
    }

    return { success: true, statusCode: 200, responseText: simulatedResponse };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const responseText = await res.text();

    await prisma.webhookLog.create({
      data: {
        transactionId: transaction.id,
        targetUrl: webhookUrl,
        payload: JSON.stringify(payload),
        statusCode: res.status,
        responseBody: responseText,
        status: res.ok ? "SUCCESS" : "FAILED",
      },
    });

    return { success: res.ok, statusCode: res.status, responseText };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Gagal menembak outbound webhook pencairan:", err);

    await prisma.webhookLog.create({
      data: {
        transactionId: transaction.id,
        targetUrl: webhookUrl,
        payload: JSON.stringify(payload),
        statusCode: 500,
        responseBody: JSON.stringify({ error: errorMessage }),
        status: "FAILED",
      },
    });

    return { success: false, error: errorMessage };
  }
}

/**
 * Trigger Pembatalan Webhook Pencairan Kas saat Auditor Menolak Transaksi
 * Memastikan sistem ERP / Kasir membatalkan proses transfer/pencairan dana (VOID).
 */
export async function triggerCancellationWebhook(transaction: {
  id: string;
  code: string;
  vendor: string;
  amount: number;
  applicantName: string;
  department: string;
  auditorName: string;
  rejectionReason: string;
}) {
  const webhookUrl =
    process.env.DISBURSEMENT_WEBHOOK_URL ||
    "http://localhost:3000/api/webhook/finance/disbursement";

  const payload = {
    event: "DISBURSEMENT_PAYMENT_CANCELLED_VOID",
    action: "CANCEL_PAYMENT",
    transactionId: transaction.code,
    systemId: transaction.id,
    vendor: transaction.vendor,
    amount: transaction.amount,
    currency: "IDR",
    applicant: transaction.applicantName,
    department: transaction.department,
    cancelledBy: transaction.auditorName,
    cancellationReason: transaction.rejectionReason,
    status: "VOID",
    timestamp: new Date().toISOString(),
  };

  const isLocalSimulation =
    !process.env.DISBURSEMENT_WEBHOOK_URL ||
    webhookUrl.includes("/api/webhook/finance/disbursement");

  if (isLocalSimulation) {
    const voidRef = `VOID-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    const simulatedResponse = JSON.stringify({
      status: "CANCELLED",
      message: `Instruksi pencairan untuk berkas ${payload.transactionId} telah DIBATALKAN / VOID oleh Auditor Forensik. Pembayaran dibatalkan dan dana kas tidak dicairkan.`,
      voidRef,
      cancelledAt: new Date().toISOString(),
      cancellationReason: payload.cancellationReason || "Ditolak dalam audit investigatif",
      receivedPayload: payload,
    });

    console.log("[WEBHOOK OUTBOUND LOCAL SIMULATION] Pembatalan Pencairan Kas Diterima ERP:", {
      transactionId: payload.transactionId,
      amount: payload.amount,
      cancelledBy: payload.cancelledBy,
      reason: payload.cancellationReason,
      voidRef,
    });

    try {
      await prisma.webhookLog.create({
        data: {
          transactionId: transaction.id,
          targetUrl: webhookUrl,
          payload: JSON.stringify(payload),
          statusCode: 200,
          responseBody: simulatedResponse,
          status: "CANCELLED",
        },
      });
    } catch (dbErr) {
      console.warn("Gagal mencatat webhook log simulasi pembatalan:", dbErr);
    }

    return { success: true, statusCode: 200, responseText: simulatedResponse };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const responseText = await res.text();

    await prisma.webhookLog.create({
      data: {
        transactionId: transaction.id,
        targetUrl: webhookUrl,
        payload: JSON.stringify(payload),
        statusCode: res.status,
        responseBody: responseText,
        status: "CANCELLED",
      },
    });

    return { success: res.ok, statusCode: res.status, responseText };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Gagal menembak outbound cancellation webhook:", err);

    await prisma.webhookLog.create({
      data: {
        transactionId: transaction.id,
        targetUrl: webhookUrl,
        payload: JSON.stringify(payload),
        statusCode: 500,
        responseBody: JSON.stringify({ error: errorMessage }),
        status: "CANCELLED",
      },
    });

    return { success: false, error: errorMessage };
  }
}
