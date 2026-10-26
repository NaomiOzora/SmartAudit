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

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

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
