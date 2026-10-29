import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || typeof identifier !== "string") {
      return NextResponse.json(
        { error: "NIP atau Email kedinasan wajib diisi." },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Cari user berdasarkan Email atau NIP
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: cleanIdentifier } },
          { nip: { equals: cleanIdentifier } },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Akun dengan NIP / Email tersebut tidak terdaftar di pangkalan data SmartAudit. Silakan hubungi Administrator Kepegawaian & TI.",
        },
        { status: 401 }
      );
    }

    // Verifikasi format password dasar (minimal 6 karakter)
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Kata sandi tidak valid (minimal 6 karakter)." },
        { status: 400 }
      );
    }

    const role = user.role.toUpperCase() === "AUDITOR" ? "AUDITOR" : "STAFF";
    const title =
      role === "AUDITOR"
        ? "Auditor - Satuan Audit Penjamin Keuangan"
        : `Purchasing & Pengadaan - ${user.department || "Operasional"}`;

    return NextResponse.json({
      success: true,
      message: `Selamat datang kembali, ${user.name}.`,
      user: {
        id: user.id,
        nip: user.nip,
        name: user.name,
        email: user.email,
        role,
        department: user.department || "Operasional",
        title,
      },
    });
  } catch (error: unknown) {
    console.error("Gagal memproses autentikasi login:", error);
    return NextResponse.json(
      { error: "Terjadi gangguan pada server autentikasi." },
      { status: 500 }
    );
  }
}
