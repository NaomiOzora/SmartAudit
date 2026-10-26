import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const logs = await prisma.webhookLog.findMany({
      include: {
        transaction: {
          select: {
            code: true,
            vendor: true,
            amount: true,
            applicantName: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: logs });
  } catch (error: unknown) {
    console.error("Gagal mengambil log webhook:", error);
    return NextResponse.json(
      { error: "Gagal memuat riwayat disbursement." },
      { status: 500 }
    );
  }
}
