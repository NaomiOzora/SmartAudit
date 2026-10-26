import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const transaction = await prisma.transaction.findFirst({
      where: {
        OR: [{ id }, { code: id }],
      },
      include: {
        receipt: true,
        fraudAnalysis: true,
        auditLogs: {
          orderBy: { createdAt: "desc" },
        },
        webhookLogs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaksi tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: transaction });
  } catch (error: unknown) {
    console.error("Gagal mengambil detail transaksi:", error);
    return NextResponse.json(
      { error: "Gagal memuat detail transaksi." },
      { status: 500 }
    );
  }
}
