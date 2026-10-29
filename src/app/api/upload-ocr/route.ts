import { NextRequest, NextResponse } from "next/server";
import { extractReceiptWithAi } from "@/lib/ai-service";
import { computePerceptualHash, computeSha256 } from "@/lib/hash-utils";
import { detectCategoryFromInvoice } from "@/lib/expense-categories";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("receipt") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Berkas kuitansi tidak ditemukan dalam permohonan." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Hitung SHA-256 Integritas Kriptografis
    const sha256Hash = computeSha256(buffer);

    // 2. Hitung Perceptual Hash (dHash) untuk Deteksi Duplikasi Grafis
    const phashFingerprint = await computePerceptualHash(buffer);

    // 3. Jalankan Ekstraksi AI Vision OCR (Google Gemini Flash / Fallback Engine)
    const ocrResult = await extractReceiptWithAi(
      buffer,
      file.type || "image/jpeg",
      file.name
    );

    // 4. Deteksi Kategori Belanja Korporat FMCG Otomatis via AI
    const categoryAnalysis = detectCategoryFromInvoice({
      vendor: ocrResult.vendor,
      items: ocrResult.items,
      description: ocrResult.notes,
      rawText: ocrResult.rawText,
    });

    // 5. Buat URL Data Sementara (base64 preview)
    const previewBase64 = `data:${file.type || "image/jpeg"};base64,${buffer.toString("base64")}`;

    return NextResponse.json({
      success: true,
      data: {
        fileName: file.name,
        fileSizeKb: Number((file.size / 1024).toFixed(1)),
        mimeType: file.type || "image/jpeg",
        sha256Hash,
        phashFingerprint,
        previewUrl: previewBase64,
        suggestedCategory: categoryAnalysis.categoryId,
        categoryLabel: categoryAnalysis.label,
        categoryConfidence: categoryAnalysis.confidence,
        documentType: ocrResult.documentType,
        vendor: ocrResult.vendor,
        vendorDetails: ocrResult.vendorDetails,
        customerDetails: ocrResult.customerDetails,
        taxId: ocrResult.taxId,
        invoiceNumber: ocrResult.invoiceNumber,
        poNumber: ocrResult.poNumber,
        date: ocrResult.date,
        dueDate: ocrResult.dueDate,
        items: ocrResult.items,
        subtotal: ocrResult.subtotal,
        discount: ocrResult.discount,
        dpp: ocrResult.dpp,
        taxPpn: ocrResult.taxPpn,
        taxPph: ocrResult.taxPph,
        otherFees: ocrResult.otherFees,
        amount: ocrResult.amount,
        currency: ocrResult.currency,
        terbilang: ocrResult.terbilang,
        paymentInfo: ocrResult.paymentInfo,
        notes: ocrResult.notes,
        signatures: ocrResult.signatures,
        arithmeticValidation: ocrResult.arithmeticValidation,
        physicalIntegrity: ocrResult.physicalIntegrity,
        rawText: ocrResult.rawText,
        confidence: ocrResult.confidence,
        latencyMs: ocrResult.latencyMs,
        engineUsed: ocrResult.engineUsed,
        fallbackTriggered: ocrResult.fallbackTriggered,
      },
    });
  } catch (error: unknown) {
    console.error("Kesalahan API /api/upload-ocr:", error);
    return NextResponse.json(
      { error: "Gagal memproses berkas kuitansi. Silakan coba kembali." },
      { status: 500 }
    );
  }
}
