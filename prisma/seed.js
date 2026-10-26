const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding SmartAudit database...");

  // Clean existing
  await prisma.webhookLog.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.fraudAnalysis.deleteMany({});
  await prisma.receipt.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Users
  const staff1 = await prisma.user.create({
    data: {
      nip: "19920415",
      name: "Siti Rahma",
      email: "siti.rahma@instansi.go.id",
      role: "STAFF",
      department: "IT & Digital",
    },
  });

  const staff2 = await prisma.user.create({
    data: {
      nip: "19900823",
      name: "Dimas Pratama",
      email: "dimas.pratama@instansi.go.id",
      role: "STAFF",
      department: "IT & Digital",
    },
  });

  const staff3 = await prisma.user.create({
    data: {
      nip: "19881112",
      name: "Rian Pratama",
      email: "rian.pratama@instansi.go.id",
      role: "STAFF",
      department: "Pengadaan & Logistik",
    },
  });

  const staff4 = await prisma.user.create({
    data: {
      nip: "19940718",
      name: "Dina Marlina",
      email: "dina.marlina@instansi.go.id",
      role: "STAFF",
      department: "TI & Infrastruktur",
    },
  });

  const staff5 = await prisma.user.create({
    data: {
      nip: "19870305",
      name: "Hendra Kusuma",
      email: "hendra.kusuma@instansi.go.id",
      role: "STAFF",
      department: "Pemasaran & Humas",
    },
  });

  const auditor = await prisma.user.create({
    data: {
      nip: "19840212",
      name: "Bambang H.",
      email: "bambang.h@instansi.go.id",
      role: "AUDITOR",
      department: "Inspektorat Forensik & Verifikasi",
    },
  });

  console.log("Users created.");

  // 2. Transactions & Fraud Analyses & Receipts

  // Transaction 1: TX-88219 (Split Bill + Outside Working Hours) - Score 92%
  const t1 = await prisma.transaction.create({
    data: {
      code: "TX-88219",
      applicantName: "Rian Pratama",
      department: "Pengadaan & Logistik",
      category: "hardware",
      vendor: "PT Cahaya Mandiri Sukses",
      date: new Date("2025-10-24T14:22:00Z"),
      amount: 48950000,
      description: "Pengadaan Server Storage & Switch Cluster Kantor Cabang",
      status: "PENDING_REVIEW",
      userId: staff3.id,
      receipt: {
        create: {
          imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
          ocrRawText: "CV GRAHA KOMPUTINDO / PT CAHAYA MANDIRI SUKSES\nJl. Diponegoro No. 84, Bandung\nNo. Faktur: INV-GK-8821\nTanggal: 24 Okt 2025\n10x SSD NVMe Enterprise 2TB - Rp 32.000.000\n4x RAM Server DDR4 64GB ECC - Rp 17.500.000\nTOTAL: Rp 48.950.000\nKasir: Yanti M. Lunas (Transfer)",
          extractedVendor: "PT Cahaya Mandiri Sukses",
          extractedDate: "2025-10-24",
          extractedAmount: 48950000,
          phashFingerprint: "d8f3a91cb2410e7a",
          sha256Hash: "d8f3e284a91cf923184b912adfc0192837461928a01f9283948291038192038",
          mimeType: "image/jpeg",
          fileSizeKb: 1840,
          ocrConfidence: 0.98,
          ocrLatencyMs: 1420,
        },
      },
      fraudAnalysis: {
        create: {
          riskScore: 92,
          riskLevel: "CRITICAL",
          reasonXai: "Terdeteksi indikasi kuat Split Bill (3 pengajuan berturut-turut bernilai tepat di bawah ambang batas otorisasi direksi Rp 50.000.000 dari vendor sama dalam waktu < 2 jam), ditambah anomali waktu pengajuan di luar jam kerja (pukul 02:11 WIB).",
          pointsBreakdown: JSON.stringify([
            { rule: "Indikasi Split Bill (3x Pengajuan < Rp 50jt)", points: 35, category: "SPLIT_BILL" },
            { rule: "Anomali Nominal (> 3 Standar Deviasi per divisi)", points: 25, category: "ANOMALY_AMOUNT" },
            { rule: "Transaksi Di Luar Jam Kerja (02:11 WIB)", points: 15, category: "OFF_HOURS" },
            { rule: "Nominal Mendekati Batas Pagu tanpa Rincian PPN", points: 17, category: "ROUND_AMOUNT" }
          ]),
          isSplitBill: true,
          isAnomalyAmount: true,
          isOffHours: true,
          isRoundAmount: true,
        },
      },
    },
  });

  // Transaction 2: TX-88204 (Duplicate Receipt pHash 94.8%) - Score 88%
  const t2 = await prisma.transaction.create({
    data: {
      code: "TX-88204",
      applicantName: "Dina Marlina",
      department: "TI & Infrastruktur",
      category: "hardware",
      vendor: "CV Sumber Aneka IT",
      date: new Date("2025-10-24T11:05:00Z"),
      amount: 34200000,
      description: "Pengadaan Komponen Cadangan NVMe Server Storage",
      status: "PENDING_REVIEW",
      userId: staff4.id,
      receipt: {
        create: {
          imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80",
          ocrRawText: "CV SUMBER ANEKA IT\nKompleks Ruko Mega Grosir Cempaka No. 12\nFaktur No: SAI-2025-9901\nTanggal: 24 Okt 2025\n8x Enterprise NVMe Gen4 2TB - Rp 34.200.000\nTotal: Rp 34.200.000",
          extractedVendor: "CV Sumber Aneka IT",
          extractedDate: "2025-10-24",
          extractedAmount: 34200000,
          phashFingerprint: "41b28f50cc391a2f",
          sha256Hash: "41b28f50c0294821a93821038102391038192038910293847581920394857102",
          mimeType: "image/jpeg",
          fileSizeKb: 2150,
          ocrConfidence: 0.96,
          ocrLatencyMs: 1650,
        },
      },
      fraudAnalysis: {
        create: {
          riskScore: 88,
          riskLevel: "HIGH",
          reasonXai: "Klaim Kuitansi Ganda: Analisis Perceptual Hashing (pHash) menemukan kemiripan grafis 94.8% (di atas ambang batas 85%) dengan berkas nota kuitansi pada transaksi TX-87912 yang telah dibayarkan bulan lalu.",
          pointsBreakdown: JSON.stringify([
            { rule: "Indikasi Kuat Duplikasi Grafis pHash (94.8% Similarity)", points: 40, category: "DUPLICATION" },
            { rule: "Anomali Nominal vs Historis TI", points: 25, category: "ANOMALY_AMOUNT" },
            { rule: "Nominal Bulat Sempurna Tanpa Rincian Pajak", points: 10, category: "ROUND_AMOUNT" },
            { rule: "Pengulangan Pemesanan Serial Barang Serupa", points: 13, category: "ANOMALY_AMOUNT" }
          ]),
          isDuplicate: true,
          duplicateTarget: "TX-87912",
          duplicateSim: 0.948,
          isAnomalyAmount: true,
          isRoundAmount: true,
        },
      },
    },
  });

  // Transaction 3: TX-88195 (High-Risk Category + Round Amount) - Score 65%
  const t3 = await prisma.transaction.create({
    data: {
      code: "TX-88195",
      applicantName: "Hendra Kusuma",
      department: "Pemasaran & Humas",
      category: "entertainment",
      vendor: "Sky Lounge & Fine Dining Jakarta",
      date: new Date("2025-10-23T21:40:00Z"),
      amount: 18500000,
      description: "Jamuan Makan Malam & Diskusi Kemitraan Strategis Q4",
      status: "PENDING_REVIEW",
      userId: staff5.id,
      receipt: {
        create: {
          imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
          ocrRawText: "SKY LOUNGE & FINE DINING\nLevel 46 Menara Sudirman, Jakarta\nBill #: SL-99214\nTanggal: 23/10/2025 21:38\nPrivate Dining Room + VIP Set Course x 8\nTotal Tagihan: Rp 18.500.000",
          extractedVendor: "Sky Lounge & Fine Dining Jakarta",
          extractedDate: "2025-10-23",
          extractedAmount: 18500000,
          phashFingerprint: "9e7a2b3c1d4e5f60",
          sha256Hash: "9e7a2b3c1d4e5f60718293a4b5c6d7e8f9012345a1b2c3d4e5f60718293a4b5c",
          mimeType: "image/jpeg",
          fileSizeKb: 1420,
          ocrConfidence: 0.94,
          ocrLatencyMs: 1380,
        },
      },
      fraudAnalysis: {
        create: {
          riskScore: 65,
          riskLevel: "MEDIUM",
          reasonXai: "Kategori Berisiko Tinggi (Entertainment/Hiburan) bernilai melebihi pagu operasional standar divisi, nominal genap bulat tanpa lampiran rincian e-Faktur Pajak, dan transaksi tercatat pada malam hari (21:40 WIB).",
          pointsBreakdown: JSON.stringify([
            { rule: "Kategori Berisiko Tinggi (Entertainment/Hiburan)", points: 20, category: "HIGH_RISK_CAT" },
            { rule: "Transaksi Di Luar Jam Kerja / Malam Hari", points: 15, category: "OFF_HOURS" },
            { rule: "Anomali Nominal vs Rata-rata Katering Pemasaran", points: 20, category: "ANOMALY_AMOUNT" },
            { rule: "Nominal Bulat Tanpa Rincian PPN Resmi", points: 10, category: "ROUND_AMOUNT" }
          ]),
          isHighRiskCat: true,
          isOffHours: true,
          isAnomalyAmount: true,
          isRoundAmount: true,
        },
      },
    },
  });

  // Transaction 4: TX-88180 (Fast-Track Approved < 40%) - Score 15%
  const t4 = await prisma.transaction.create({
    data: {
      code: "TX-88180",
      applicantName: "Siti Rahma",
      department: "IT & Digital",
      category: "hardware",
      vendor: "PT Mega Sentosa Komputindo",
      date: new Date("2025-03-14T09:15:00Z"),
      amount: 4750000,
      description: "Pengadaan Switch Hub 24-Port & Patch Cord Laboratorium",
      status: "AUTO_APPROVED",
      userId: staff1.id,
      receipt: {
        create: {
          imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
          ocrRawText: "PT MEGA SENTOSA KOMPUTINDO\nHarco Mangga Dua Blok B2 No. 15, Jakarta Pusat\nNPWP: 01.345.678.9-021.000\nNo. Invoice: STR-20250314-INV-042\nTanggal: 14 Maret 2025 09:15 WIB\n1x Gigabit Switch 24-Port - Rp 3.200.000\n5x Box Cat6 UTP Cable - Rp 1.550.000\nTOTAL BAYAR: Rp 4.750.000 (LUNAS)",
          extractedVendor: "PT Mega Sentosa Komputindo",
          extractedDate: "2025-03-14",
          extractedAmount: 4750000,
          phashFingerprint: "1a2b3c4d5e6f7a8b",
          sha256Hash: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
          mimeType: "image/jpeg",
          fileSizeKb: 1100,
          ocrConfidence: 0.99,
          ocrLatencyMs: 920,
        },
      },
      fraudAnalysis: {
        create: {
          riskScore: 15,
          riskLevel: "LOW",
          reasonXai: "Dokumen memenuhi seluruh SOP Kepatuhan: Nilai pengeluaran di bawah ambang batas Tier 1 (< Rp 5.000.000), NPWP vendor terverifikasi aktif di DJP, stempel toko tajam (300 DPI), waktu kerja normal, dan tidak ada kesamaan hash. Memenuhi syarat Fast-Track Auto Approval.",
          pointsBreakdown: JSON.stringify([
            { rule: "Sesuai Standar SOP Tier 1 Rutin", points: 0, category: "COMPLIANT" },
            { rule: "Faktor Nominal Non-PPN Khusus", points: 15, category: "NORMAL" }
          ]),
          isDuplicate: false,
          isSplitBill: false,
          isAnomalyAmount: false,
          isHighRiskCat: false,
          isOffHours: false,
          isRoundAmount: false,
        },
      },
      webhookLogs: {
        create: {
          targetUrl: "http://localhost:3000/api/webhook/finance/disbursement",
          payload: JSON.stringify({
            event: "DISBURSEMENT_AUTO_APPROVED",
            transactionId: "TX-88180",
            vendor: "PT Mega Sentosa Komputindo",
            amount: 4750000,
            accountNumber: "Mandiri 122-00-998821-3",
            timestamp: new Date("2025-03-14T09:15:05Z").toISOString(),
            riskScore: 15,
            slaStatus: "FAST_TRACK_DISBURSED"
          }),
          statusCode: 200,
          responseBody: JSON.stringify({ status: "SUCCESS", paymentRef: "PAY-20250314-88180", disbursedAt: "2025-03-14T09:15:06Z" }),
          status: "SUCCESS"
        }
      }
    },
  });

  // Transaction 5: TX-88172 (Fast-Track AWS Server) - Score 10%
  const t5 = await prisma.transaction.create({
    data: {
      code: "TX-88172",
      applicantName: "Dimas Pratama",
      department: "IT & Digital",
      category: "operasional",
      vendor: "Amazon Web Services Indonesia",
      date: new Date("2025-10-24T10:00:00Z"),
      amount: 24350000,
      description: "Langganan Cloud Server & Kubernetes Cluster AWS Q4",
      status: "AUTO_APPROVED",
      userId: staff2.id,
      receipt: {
        create: {
          imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
          ocrRawText: "AMAZON WEB SERVICES INDONESIA\ne-Faktur Pajak Seri: 010.000-25.19284719\nInvoice Number: AWS-ID-2025-Q4-0192\nTanggal: 24 Okt 2025\nTotal Layanan Komputasi Awan: Rp 24.350.000",
          extractedVendor: "Amazon Web Services Indonesia",
          extractedDate: "2025-10-24",
          extractedAmount: 24350000,
          phashFingerprint: "fe01ab45c9284910",
          sha256Hash: "fe01ab45c9284910a92847192837461928374619283746192837461928374619",
          ocrConfidence: 0.99,
          ocrLatencyMs: 840,
        },
      },
      fraudAnalysis: {
        create: {
          riskScore: 10,
          riskLevel: "LOW",
          reasonXai: "Faktur elektronik resmi ber-QR Code DJP valid, langganan rutin operasional terdaftar dalam kontrak pengadaan tahunan.",
          pointsBreakdown: JSON.stringify([
            { rule: "Faktur Pajak Resmi DJP Terdaftar", points: 0, category: "COMPLIANT" },
            { rule: "Sesuai Kontrak Kerja Sama Tahunan", points: 10, category: "NORMAL" }
          ]),
        },
      },
      webhookLogs: {
        create: {
          targetUrl: "http://localhost:3000/api/webhook/finance/disbursement",
          payload: JSON.stringify({
            event: "DISBURSEMENT_AUTO_APPROVED",
            transactionId: "TX-88172",
            vendor: "Amazon Web Services Indonesia",
            amount: 24350000,
            timestamp: new Date("2025-10-24T10:00:02Z").toISOString(),
            riskScore: 10,
            slaStatus: "FAST_TRACK_DISBURSED"
          }),
          statusCode: 200,
          status: "SUCCESS"
        }
      }
    },
  });

  // Transaction 6: TX-88165 (Fast-Track Konsumsi Rapat) - Score 20%
  const t6 = await prisma.transaction.create({
    data: {
      code: "TX-88165",
      applicantName: "Rian Pratama",
      department: "Pengadaan & Logistik",
      category: "konsumsi",
      vendor: "Katering Dapur Sejahtera",
      date: new Date("2025-10-19T12:30:00Z"),
      amount: 3750000,
      description: "Konsumsi Pelatihan & Workshop Integrasi Sistem Pengadaan",
      status: "AUTO_APPROVED",
      userId: staff3.id,
      receipt: {
        create: {
          imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
          ocrRawText: "KATERING DAPUR SEJAHTERA\nNota Bon No: KDS-8921\nTanggal: 19 Okt 2025\nPaket Prasmanan 50 Pax @ Rp 75.000 = Rp 3.750.000\nLunas Tunai",
          extractedVendor: "Katering Dapur Sejahtera",
          extractedDate: "2025-10-19",
          extractedAmount: 3750000,
          phashFingerprint: "0011223344556677",
          sha256Hash: "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
          ocrConfidence: 0.97,
        },
      },
      fraudAnalysis: {
        create: {
          riskScore: 20,
          riskLevel: "LOW",
          reasonXai: "Pengeluaran rutin konsumsi rapat berskala wajar (< Rp 5.000.000), daftar hadir terlampir lengkap.",
          pointsBreakdown: JSON.stringify([
            { rule: "Rutin Konsumsi Rapat Tier 1", points: 20, category: "NORMAL" }
          ]),
        },
      },
      webhookLogs: {
        create: {
          targetUrl: "http://localhost:3000/api/webhook/finance/disbursement",
          payload: JSON.stringify({
            event: "DISBURSEMENT_AUTO_APPROVED",
            transactionId: "TX-88165",
            amount: 3750000,
            timestamp: new Date("2025-10-19T12:30:04Z").toISOString()
          }),
          statusCode: 200,
          status: "SUCCESS"
        }
      }
    },
  });

  // 3. Create Sample Audit Log for Forensic Action
  await prisma.auditLog.create({
    data: {
      transactionId: t1.id,
      userId: auditor.id,
      auditorName: "Bambang H.",
      action: "PENDING_REVIEW",
      notes: "Sistem mendeteksi transaksi TX-88219 masuk antrean review karena skor risiko 92% (Split Bill & Dini Hari). Menunggu investigasi forensik.",
      tamperHash: "sha256:d8f3e284a91cf923184b912adfc0192837461928",
    },
  });

  console.log("Database seeded successfully with 6 comprehensive audit cases!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
