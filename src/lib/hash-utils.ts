import crypto from "crypto";
import jpeg from "jpeg-js";
import { PNG } from "pngjs";
import prisma from "./prisma";

/**
 * Menghitung SHA-256 hash standar untuk integritas dokumen
 */
export function computeSha256(data: Buffer | string): string {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
}

/**
 * Menghitung Perceptual Hash (dHash - Difference Hashing) 64-bit
 * Tahan terhadap kompresi, rotasi kecil, dan perubahan resolusi.
 */
export async function computePerceptualHash(imageBuffer: Buffer): Promise<string> {
  try {
    let width = 0;
    let height = 0;
    let data: Uint8Array | Buffer | null = null;

    // Deteksi format JPEG / JPG
    if (imageBuffer[0] === 0xff && imageBuffer[1] === 0xd8) {
      const decoded = jpeg.decode(imageBuffer, { useTArray: true, formatAsRGBA: true });
      width = decoded.width;
      height = decoded.height;
      data = decoded.data;
    }
    // Deteksi format PNG
    else if (
      imageBuffer[0] === 0x89 &&
      imageBuffer[1] === 0x50 &&
      imageBuffer[2] === 0x4e &&
      imageBuffer[3] === 0x47
    ) {
      const png = PNG.sync.read(imageBuffer);
      width = png.width;
      height = png.height;
      data = png.data;
    }

    if (data && width > 0 && height > 0) {
      // Buat thumbnail 9x8 grayscale
      const targetW = 9;
      const targetH = 8;
      const grayMatrix: number[][] = [];

      for (let y = 0; y < targetH; y++) {
        grayMatrix[y] = [];
        const origY = Math.floor((y * height) / targetH);
        for (let x = 0; x < targetW; x++) {
          const origX = Math.floor((x * width) / targetW);
          const idx = (origY * width + origX) * 4;
          const r = data[idx] ?? 0;
          const g = data[idx + 1] ?? 0;
          const b = data[idx + 2] ?? 0;
          // Grayscale luminance ITU-R BT.601
          const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
          grayMatrix[y].push(gray);
        }
      }

      // Hitung 64 bit perbandingan perbedaan adjacent pixel (dHash)
      let bitString = "";
      for (let y = 0; y < targetH; y++) {
        for (let x = 0; x < targetW - 1; x++) {
          const bit = grayMatrix[y][x] > grayMatrix[y][x + 1] ? "1" : "0";
          bitString += bit;
        }
      }

      // Konversi bit string (64-bit) ke hex (16 karakter)
      let hexHash = "";
      for (let i = 0; i < bitString.length; i += 4) {
        const nibble = bitString.substring(i, i + 4);
        hexHash += parseInt(nibble, 2).toString(16);
      }
      return hexHash.padStart(16, "0");
    }
  } catch (err) {
    console.warn("Gagal mengekstrak pixel bitmap langsung, menggunakan fallback byte chunk hashing:", err);
  }

  // Fallback Perceptual Hash jika parser bitmap gagal (misal SVG atau file PDF)
  // Menghasilkan 16-hex fingerprint berbasis sampling distribusi spasial
  const sampleLength = Math.min(imageBuffer.length, 4096);
  const step = Math.max(1, Math.floor(sampleLength / 64));
  let fallbackBits = "";
  for (let i = 0; i < 64; i++) {
    const idx = (i * step) % imageBuffer.length;
    const nextIdx = ((i + 1) * step) % imageBuffer.length;
    fallbackBits += imageBuffer[idx] > imageBuffer[nextIdx] ? "1" : "0";
  }

  let hex = "";
  for (let i = 0; i < fallbackBits.length; i += 4) {
    hex += parseInt(fallbackBits.substring(i, i + 4), 2).toString(16);
  }
  return hex.padStart(16, "0");
}

/**
 * Menghitung Hamming Distance antara dua 16-karakter hex hash
 */
export function calculateHammingDistance(hash1: string, hash2: string): number {
  if (!hash1 || !hash2) return 64;
  let distance = 0;

  // Samakan panjang jika perlu
  const h1 = hash1.padStart(16, "0").slice(0, 16);
  const h2 = hash2.padStart(16, "0").slice(0, 16);

  for (let i = 0; i < 16; i++) {
    const n1 = parseInt(h1[i], 16);
    const n2 = parseInt(h2[i], 16);
    let xor = n1 ^ n2;
    // Hitung jumlah bit 1 pada xor
    while (xor > 0) {
      distance += xor & 1;
      xor >>= 1;
    }
  }
  return distance;
}

/**
 * Menghitung tingkat kesamaan grafis (Similarity Percentage 0.0 - 1.0)
 * 0 hamming distance = 1.0 (100% mirip)
 * <= 9 bit distance = > 85.9% mirip (indikasi kuat duplikasi/fotokopi/crop)
 */
export function calculateHashSimilarity(hash1: string, hash2: string): number {
  const distance = calculateHammingDistance(hash1, hash2);
  const similarity = Math.max(0, 1 - distance / 64);
  return Number(similarity.toFixed(3));
}

/**
 * Mencari apakah ada kuitansi di database dengan pHash mirip (> 85%)
 */
export async function checkDatabaseDuplicateHash(
  currentPhash: string,
  excludeTransactionId?: string
): Promise<{
  isDuplicate: boolean;
  targetTransactionCode?: string;
  targetTransactionId?: string;
  similarity: number;
} | null> {
  // Cegah false positive jika pHash kosong atau dummy all-zero
  if (!currentPhash || currentPhash === "0000000000000000" || /^0+$/.test(currentPhash)) {
    return {
      isDuplicate: false,
      similarity: 0,
    };
  }

  const existingReceipts = await prisma.receipt.findMany({
    where: excludeTransactionId
      ? {
          transactionId: { not: excludeTransactionId },
          phashFingerprint: { not: null },
        }
      : {
          phashFingerprint: { not: null },
        },
    include: {
      transaction: true,
    },
  });

  let highestSim = 0;
  let matchedReceipt: (typeof existingReceipts)[0] | null = null;

  for (const item of existingReceipts) {
    if (!item.phashFingerprint || item.phashFingerprint === "0000000000000000" || /^0+$/.test(item.phashFingerprint)) {
      continue;
    }
    const sim = calculateHashSimilarity(currentPhash, item.phashFingerprint);
    if (sim > highestSim) {
      highestSim = sim;
      matchedReceipt = item;
    }
  }

  // Ambang batas standar pHash: >= 85% (0.85)
  if (highestSim >= 0.85 && matchedReceipt) {
    return {
      isDuplicate: true,
      targetTransactionCode: matchedReceipt.transaction.code,
      targetTransactionId: matchedReceipt.transaction.id,
      similarity: highestSim,
    };
  }

  return {
    isDuplicate: false,
    similarity: highestSim,
  };
}
