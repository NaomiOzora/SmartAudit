const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding SmartAudit database with restructured corporate hierarchy...");

  // Clean existing data
  await prisma.webhookLog.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.fraudAnalysis.deleteMany({});
  await prisma.receipt.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Independent Audit Body: Satuan Audit Penjamin Keuangan (AUDITOR)
  const auditor1 = await prisma.user.create({
    data: {
      nip: "19840212",
      name: "Bambang H.",
      email: "bambang.h@instansi.go.id",
      role: "AUDITOR",
      department: "Satuan Audit Penjamin Keuangan",
    },
  });

  const auditor2 = await prisma.user.create({
    data: {
      nip: "19860514",
      name: "Dra. Maya Anggraeni, Ak.",
      email: "maya.anggraeni@smartaudit.co.id",
      role: "AUDITOR",
      department: "Satuan Audit Penjamin Keuangan",
    },
  });

  const auditor3 = await prisma.user.create({
    data: {
      nip: "19830920",
      name: "Raden Wijaya, CA., CFE",
      email: "raden.wijaya@smartaudit.co.id",
      role: "AUDITOR",
      department: "Satuan Audit Penjamin Keuangan",
    },
  });

  console.log("Satuan Audit Penjamin Keuangan (3 Auditors) created.");

  // 2. The 9 Operational Departments (3 Purchasing & Procurement Administrators each = 27 Staff)

  // Dept 1: Sales & Commercial
  const salesStaff1 = await prisma.user.create({
    data: {
      nip: "19910105",
      name: "Bagus Saputra",
      email: "bagus.saputra@smartaudit.co.id",
      role: "STAFF",
      department: "Sales & Commercial",
    },
  });
  const salesStaff2 = await prisma.user.create({
    data: {
      nip: "19930812",
      name: "Clarissa Utami",
      email: "clarissa.utami@smartaudit.co.id",
      role: "STAFF",
      department: "Sales & Commercial",
    },
  });
  const salesStaff3 = await prisma.user.create({
    data: {
      nip: "19950422",
      name: "Kevin Adiputra",
      email: "kevin.adiputra@smartaudit.co.id",
      role: "STAFF",
      department: "Sales & Commercial",
    },
  });

  // Dept 2: Marketing & Brand Management
  const mktStaff1 = await prisma.user.create({
    data: {
      nip: "19870305",
      name: "Hendra Kusuma",
      email: "hendra.kusuma@instansi.go.id",
      role: "STAFF",
      department: "Marketing & Brand Management",
    },
  });
  const mktStaff2 = await prisma.user.create({
    data: {
      nip: "19941108",
      name: "Alika Nadia",
      email: "alika.nadia@smartaudit.co.id",
      role: "STAFF",
      department: "Marketing & Brand Management",
    },
  });
  const mktStaff3 = await prisma.user.create({
    data: {
      nip: "19920617",
      name: "Rendy Prasetyo",
      email: "rendy.prasetyo@smartaudit.co.id",
      role: "STAFF",
      department: "Marketing & Brand Management",
    },
  });

  // Dept 3: Supply Chain & Logistics
  const scStaff1 = await prisma.user.create({
    data: {
      nip: "19881112",
      name: "Rian Pratama",
      email: "rian.pratama@instansi.go.id",
      role: "STAFF",
      department: "Supply Chain & Logistics",
    },
  });
  const scStaff2 = await prisma.user.create({
    data: {
      nip: "19900219",
      name: "Dewi Lestari",
      email: "dewi.lestari@smartaudit.co.id",
      role: "STAFF",
      department: "Supply Chain & Logistics",
    },
  });
  const scStaff3 = await prisma.user.create({
    data: {
      nip: "19890915",
      name: "Budi Santoso",
      email: "budi.santoso@smartaudit.co.id",
      role: "STAFF",
      department: "Supply Chain & Logistics",
    },
  });

  // Dept 4: Manufacturing & Operations
  const mfgStaff1 = await prisma.user.create({
    data: {
      nip: "19850720",
      name: "Joko Triwahyudi",
      email: "joko.triwahyudi@smartaudit.co.id",
      role: "STAFF",
      department: "Manufacturing & Operations",
    },
  });
  const mfgStaff2 = await prisma.user.create({
    data: {
      nip: "19911204",
      name: "Ratna Wulandari",
      email: "ratna.wulandari@smartaudit.co.id",
      role: "STAFF",
      department: "Manufacturing & Operations",
    },
  });
  const mfgStaff3 = await prisma.user.create({
    data: {
      nip: "19880311",
      name: "Arif Budiman",
      email: "arif.budiman@smartaudit.co.id",
      role: "STAFF",
      department: "Manufacturing & Operations",
    },
  });

  // Dept 5: Research & Development (R&D) & Regulatory Affairs
  const rdStaff1 = await prisma.user.create({
    data: {
      nip: "19860416",
      name: "Dr. Farhan Maulana",
      email: "farhan.maulana@smartaudit.co.id",
      role: "STAFF",
      department: "Research & Development (R&D) & Regulatory Affairs",
    },
  });
  const rdStaff2 = await prisma.user.create({
    data: {
      nip: "19920830",
      name: "Nurul Hidayah, M.Sc",
      email: "nurul.hidayah@smartaudit.co.id",
      role: "STAFF",
      department: "Research & Development (R&D) & Regulatory Affairs",
    },
  });
  const rdStaff3 = await prisma.user.create({
    data: {
      nip: "19940525",
      name: "Ilham Ramadhan",
      email: "ilham.ramadhan@smartaudit.co.id",
      role: "STAFF",
      department: "Research & Development (R&D) & Regulatory Affairs",
    },
  });

  // Dept 6: Finance, Accounting & Tax
  const finStaff1 = await prisma.user.create({
    data: {
      nip: "19920415",
      name: "Siti Rahma",
      email: "siti.rahma@instansi.go.id",
      role: "STAFF",
      department: "Finance, Accounting & Tax",
    },
  });
  const finStaff2 = await prisma.user.create({
    data: {
      nip: "19890814",
      name: "Wahyu Pratama, SE",
      email: "wahyu.pratama@smartaudit.co.id",
      role: "STAFF",
      department: "Finance, Accounting & Tax",
    },
  });
  const finStaff3 = await prisma.user.create({
    data: {
      nip: "19950319",
      name: "Melani Putri",
      email: "melani.putri@smartaudit.co.id",
      role: "STAFF",
      department: "Finance, Accounting & Tax",
    },
  });

  // Dept 7: Human Resources & Corporate Affairs
  const hrStaff1 = await prisma.user.create({
    data: {
      nip: "19900912",
      name: "Anisa Fitriani",
      email: "anisa.fitriani@smartaudit.co.id",
      role: "STAFF",
      department: "Human Resources & Corporate Affairs",
    },
  });
  const hrStaff2 = await prisma.user.create({
    data: {
      nip: "19871103",
      name: "Dedi Suryadi",
      email: "dedi.suryadi@smartaudit.co.id",
      role: "STAFF",
      department: "Human Resources & Corporate Affairs",
    },
  });
  const hrStaff3 = await prisma.user.create({
    data: {
      nip: "19931021",
      name: "Nadia Safitri",
      email: "nadia.safitri@smartaudit.co.id",
      role: "STAFF",
      department: "Human Resources & Corporate Affairs",
    },
  });

  // Dept 8: Information Technology & Digital Transformation
  const itStaff1 = await prisma.user.create({
    data: {
      nip: "19900823",
      name: "Dimas Pratama",
      email: "dimas.pratama@instansi.go.id",
      role: "STAFF",
      department: "Information Technology & Digital Transformation",
    },
  });
  const itStaff2 = await prisma.user.create({
    data: {
      nip: "19940718",
      name: "Dina Marlina",
      email: "dina.marlina@instansi.go.id",
      role: "STAFF",
      department: "Information Technology & Digital Transformation",
    },
  });
  const itStaff3 = await prisma.user.create({
    data: {
      nip: "19960114",
      name: "Reza Oktaviano",
      email: "reza.oktaviano@smartaudit.co.id",
      role: "STAFF",
      department: "Information Technology & Digital Transformation",
    },
  });

  // Dept 9: Legal, Compliance & Corporate Governance
  const legalStaff1 = await prisma.user.create({
    data: {
      nip: "19880126",
      name: "Faisal Akbar, SH",
      email: "faisal.akbar@smartaudit.co.id",
      role: "STAFF",
      department: "Legal, Compliance & Corporate Governance",
    },
  });
  const legalStaff2 = await prisma.user.create({
    data: {
      nip: "19910518",
      name: "Pratiwi Handayani, MH",
      email: "pratiwi.handayani@smartaudit.co.id",
      role: "STAFF",
      department: "Legal, Compliance & Corporate Governance",
    },
  });
  const legalStaff3 = await prisma.user.create({
    data: {
      nip: "19930709",
      name: "Bayu Wicaksono",
      email: "bayu.wicaksono@smartaudit.co.id",
      role: "STAFF",
      department: "Legal, Compliance & Corporate Governance",
    },
  });

  console.log("All 9 Operational Departments (27 Staff) created successfully.");

  // Authentic Physical Invoice Image Path
  const realInvoiceImagePath = "/invoices/faktur-template-asli.jpg";

  // 3. Transactions Across All Departments

  // TX 1: Supply Chain & Logistics (High Risk 92% - Split Bill)
  const t1 = await prisma.transaction.create({
    data: {
      code: "TX-88219",
      applicantName: "Rian Pratama",
      department: "Supply Chain & Logistics",
      category: "hardware",
      vendor: "PT Cahaya Mandiri Sukses",
      date: new Date("2025-10-24T14:22:00Z"),
      amount: 48950000,
      description: "Pengadaan Server Storage & Switch Cluster Kantor Cabang",
      status: "PENDING_REVIEW",
      userId: scStaff1.id,
      receipt: {
        create: {
          imageUrl: realInvoiceImagePath,
          ocrRawText: JSON.stringify({
            documentType: "FAKTUR_KOMERSIAL",
            vendor: "PT Cahaya Mandiri Sukses",
            taxId: "01.345.678.9-021.000",
            invoiceNumber: "INV-GK-8821",
            poNumber: "PO-SCL-2025-091",
            date: "2025-10-24",
            items: [
              { no: 1, name: "SSD NVMe Enterprise 2TB", qty: 10, unitPrice: 3200000, totalPrice: 32000000 },
              { no: 2, name: "RAM Server DDR4 64GB ECC", qty: 4, unitPrice: 3022522, totalPrice: 12090090 },
            ],
            subtotal: 44090090,
            taxPpn: 4850000,
            otherFees: 9910,
            amount: 48950000,
            currency: "IDR",
            terbilang: "Empat Puluh Delapan Juta Sembilan Ratus Lima Puluh Ribu Rupiah",
            customerDetails: { name: "PT SmartAudit Enterprise", taxId: "01.234.567.8-012.000" },
            paymentInfo: { bank: "Bank Mandiri", accountNumber: "122-00-998821-3", terms: "Kredit 30 Hari" },
            arithmeticValidation: {
              isValid: true,
              expectedTotal: 48950000,
              actualTotal: 48950000,
              difference: 0,
              notes: "Perhitungan Subtotal + PPN 11% sesuai dengan Grand Total faktur fisik.",
            },
          }),
          extractedVendor: "PT Cahaya Mandiri Sukses",
          extractedDate: "2025-10-24",
          extractedAmount: 48950000,
          phashFingerprint: "d8f3a91cb2410e7a",
          sha256Hash: "d8f3e284a91cf923184b912adfc0192837461928a01f9283948291038192038",
          mimeType: "image/jpeg",
          fileSizeKb: 153,
          ocrConfidence: 0.98,
          ocrLatencyMs: 1420,
        },
      },
      fraudAnalysis: {
        create: {
          riskScore: 92,
          riskLevel: "CRITICAL",
          reasonXai: "Terdeteksi indikasi kuat Split Bill (3 pengajuan berturut-turut bernilai tepat di bawah ambang batas otorisasi direksi Rp 50.000.000 dari vendor sama dalam waktu < 2 jam), ditambah anomali waktu pengajuan di luar jam kerja (pukul 02:11 WIB). Berkas memerlukan pemeriksaan manual dan pengujian bukti fisik kuitansi oleh Satuan Audit Penjamin Keuangan.",
          pointsBreakdown: JSON.stringify([
            { rule: "Indikasi Split Bill (3x Pengajuan < Rp 50jt)", points: 35, category: "SPLIT_BILL" },
            { rule: "Anomali Nominal (> 3 Standar Deviasi per divisi Supply Chain & Logistics)", points: 25, category: "ANOMALY_AMOUNT" },
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

  // TX 2: Information Technology & Digital Transformation (High Risk 88% - Duplicate Hash)
  const t2 = await prisma.transaction.create({
    data: {
      code: "TX-88204",
      applicantName: "Dina Marlina",
      department: "Information Technology & Digital Transformation",
      category: "hardware",
      vendor: "CV Sumber Aneka IT",
      date: new Date("2025-10-24T11:05:00Z"),
      amount: 34200000,
      description: "Pengadaan Komponen Cadangan NVMe Server Storage",
      status: "PENDING_REVIEW",
      userId: itStaff2.id,
      receipt: {
        create: {
          imageUrl: realInvoiceImagePath,
          ocrRawText: JSON.stringify({
            documentType: "FAKTUR_KOMERSIAL",
            vendor: "CV Sumber Aneka IT",
            taxId: "02.888.777.6-041.000",
            invoiceNumber: "SAI-2025-9901",
            date: "2025-10-24",
            items: [{ no: 1, name: "Enterprise NVMe Gen4 2TB", qty: 8, unitPrice: 4275000, totalPrice: 34200000 }],
            subtotal: 30810810,
            taxPpn: 3389190,
            amount: 34200000,
          }),
          extractedVendor: "CV Sumber Aneka IT",
          extractedDate: "2025-10-24",
          extractedAmount: 34200000,
          phashFingerprint: "41b28f50cc391a2f",
          sha256Hash: "41b28f50c0294821a93821038102391038192038910293847581920394857102",
          mimeType: "image/jpeg",
          fileSizeKb: 153,
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

  // TX 3: Marketing & Brand Management (Score 65% - High Risk Cat)
  const t3 = await prisma.transaction.create({
    data: {
      code: "TX-88195",
      applicantName: "Hendra Kusuma",
      department: "Marketing & Brand Management",
      category: "entertainment",
      vendor: "Sky Lounge & Fine Dining Jakarta",
      date: new Date("2025-10-23T21:40:00Z"),
      amount: 18500000,
      description: "Jamuan Makan Malam & Diskusi Kemitraan Brand Q4",
      status: "PENDING_REVIEW",
      userId: mktStaff1.id,
      receipt: {
        create: {
          imageUrl: realInvoiceImagePath,
          ocrRawText: JSON.stringify({
            documentType: "RECEIPT_RESTORAN",
            vendor: "Sky Lounge & Fine Dining Jakarta",
            taxId: "03.222.111.4-015.000",
            invoiceNumber: "SL-99214",
            date: "2025-10-23",
            items: [{ no: 1, name: "Private Dining Room + VIP Set Course x 8", qty: 1, unitPrice: 18500000, totalPrice: 18500000 }],
            subtotal: 16666667,
            taxPpn: 1833333,
            amount: 18500000,
          }),
          extractedVendor: "Sky Lounge & Fine Dining Jakarta",
          extractedDate: "2025-10-23",
          extractedAmount: 18500000,
          phashFingerprint: "9e7a2b3c1d4e5f60",
          sha256Hash: "9e7a2b3c1d4e5f60718293a4b5c6d7e8f9012345a1b2c3d4e5f60718293a4b5c",
          mimeType: "image/jpeg",
          fileSizeKb: 153,
          ocrConfidence: 0.94,
          ocrLatencyMs: 1380,
        },
      },
      fraudAnalysis: {
        create: {
          riskScore: 65,
          riskLevel: "MEDIUM",
          reasonXai: "Kategori Berisiko Tinggi (Entertainment/Hiburan) bernilai melebihi pagu operasional standar divisi Marketing, nominal genap bulat tanpa lampiran rincian e-Faktur Pajak, dan transaksi tercatat pada malam hari (21:40 WIB).",
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

  // TX 4: Finance, Accounting & Tax (Score 15% - Fast Track Auto Approved)
  const t4 = await prisma.transaction.create({
    data: {
      code: "TX-88180",
      applicantName: "Siti Rahma",
      department: "Finance, Accounting & Tax",
      category: "hardware",
      vendor: "PT Mega Sentosa Komputindo",
      date: new Date("2025-03-14T09:15:00Z"),
      amount: 4750000,
      description: "Pengadaan Switch Hub 24-Port & Patch Cord Tim Pajak",
      status: "AUTO_APPROVED",
      userId: finStaff1.id,
      receipt: {
        create: {
          imageUrl: realInvoiceImagePath,
          ocrRawText: JSON.stringify({
            documentType: "FAKTUR_KOMERSIAL",
            vendor: "PT Mega Sentosa Komputindo",
            taxId: "01.345.678.9-021.000",
            invoiceNumber: "STR-20250314-INV-042",
            date: "2025-03-14",
            items: [
              { no: 1, name: "Gigabit Switch 24-Port", qty: 1, unitPrice: 3200000, totalPrice: 3200000 },
              { no: 2, name: "Box Cat6 UTP Cable", qty: 5, unitPrice: 310000, totalPrice: 1550000 },
            ],
            subtotal: 4279279,
            taxPpn: 470721,
            amount: 4750000,
          }),
          extractedVendor: "PT Mega Sentosa Komputindo",
          extractedDate: "2025-03-14",
          extractedAmount: 4750000,
          phashFingerprint: "1a2b3c4d5e6f7a8b",
          sha256Hash: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
          mimeType: "image/jpeg",
          fileSizeKb: 153,
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

  // TX 5: Information Technology & Digital Transformation (Score 10% - Fast Track AWS Cloud)
  const t5 = await prisma.transaction.create({
    data: {
      code: "TX-88172",
      applicantName: "Dimas Pratama",
      department: "Information Technology & Digital Transformation",
      category: "operasional",
      vendor: "Amazon Web Services Indonesia",
      date: new Date("2025-10-24T10:00:00Z"),
      amount: 24350000,
      description: "Langganan Cloud Server & Kubernetes Cluster AWS Q4",
      status: "AUTO_APPROVED",
      userId: itStaff1.id,
      receipt: {
        create: {
          imageUrl: realInvoiceImagePath,
          ocrRawText: JSON.stringify({
            documentType: "FAKTUR_PAJAK_ELEKTRONIK",
            vendor: "Amazon Web Services Indonesia",
            taxId: "01.000.123.4-051.000",
            invoiceNumber: "AWS-ID-2025-Q4-0192",
            date: "2025-10-24",
            items: [{ no: 1, name: "AWS Cloud Infrastructure Services Q4", qty: 1, unitPrice: 24350000, totalPrice: 24350000 }],
            amount: 24350000,
          }),
          extractedVendor: "Amazon Web Services Indonesia",
          extractedDate: "2025-10-24",
          extractedAmount: 24350000,
          phashFingerprint: "fe01ab45c9284910",
          sha256Hash: "fe01ab45c9284910a92847192837461928374619283746192837461928374619",
          mimeType: "image/jpeg",
          fileSizeKb: 153,
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

  // TX 6: Supply Chain & Logistics (Score 20% - Fast Track Konsumsi)
  const t6 = await prisma.transaction.create({
    data: {
      code: "TX-88165",
      applicantName: "Rian Pratama",
      department: "Supply Chain & Logistics",
      category: "konsumsi",
      vendor: "Katering Dapur Sejahtera",
      date: new Date("2025-10-19T12:30:00Z"),
      amount: 3750000,
      description: "Konsumsi Pelatihan & Workshop Integrasi Sistem Gudang",
      status: "AUTO_APPROVED",
      userId: scStaff1.id,
      receipt: {
        create: {
          imageUrl: realInvoiceImagePath,
          ocrRawText: JSON.stringify({
            documentType: "NOTA_KONSUMSI",
            vendor: "Katering Dapur Sejahtera",
            invoiceNumber: "KDS-8921",
            date: "2025-10-19",
            items: [{ no: 1, name: "Paket Prasmanan 50 Pax", qty: 50, unitPrice: 75000, totalPrice: 3750000 }],
            amount: 3750000,
          }),
          extractedVendor: "Katering Dapur Sejahtera",
          extractedDate: "2025-10-19",
          extractedAmount: 3750000,
          phashFingerprint: "0011223344556677",
          sha256Hash: "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
          mimeType: "image/jpeg",
          fileSizeKb: 153,
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

  // TX 7: Sales & Commercial (Approved by Auditor)
  const t7 = await prisma.transaction.create({
    data: {
      code: "TX-88150",
      applicantName: "Bagus Saputra",
      department: "Sales & Commercial",
      category: "transportasi",
      vendor: "Garuda Indonesia Tiket Korporat",
      date: new Date("2025-10-18T08:00:00Z"),
      amount: 14800000,
      description: "Tiket Pesawat & Perjalanan Dinas Tim Sales Expo Surabaya",
      status: "APPROVED",
      userId: salesStaff1.id,
      receipt: {
        create: {
          imageUrl: realInvoiceImagePath,
          ocrRawText: JSON.stringify({
            documentType: "E_TIKET",
            vendor: "Garuda Indonesia Tiket Korporat",
            invoiceNumber: "GA-CORP-9921",
            date: "2025-10-18",
            items: [{ no: 1, name: "Tiket PP Jakarta - Surabaya x 4 Pax", qty: 4, unitPrice: 3700000, totalPrice: 14800000 }],
            amount: 14800000,
          }),
          extractedVendor: "Garuda Indonesia Tiket Korporat",
          extractedDate: "2025-10-18",
          extractedAmount: 14800000,
          phashFingerprint: "1122334455667788",
          sha256Hash: "112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
          mimeType: "image/jpeg",
          fileSizeKb: 153,
          ocrConfidence: 0.99,
        },
      },
      fraudAnalysis: {
        create: {
          riskScore: 25,
          riskLevel: "LOW",
          reasonXai: "Tiket resmi maskapai nasional, surat tugas dinas direksi terlampir.",
          pointsBreakdown: JSON.stringify([
            { rule: "Sesuai Pagu Perjalanan Dinas", points: 25, category: "NORMAL" }
          ]),
        },
      },
    },
  });

  // TX 8: Manufacturing & Operations (Rejected by Auditor)
  const t8 = await prisma.transaction.create({
    data: {
      code: "TX-88142",
      applicantName: "Joko Triwahyudi",
      department: "Manufacturing & Operations",
      category: "operasional",
      vendor: "CV Mesin Perkasa Teknik",
      date: new Date("2025-10-17T16:00:00Z"),
      amount: 58000000,
      description: "Penggantian Sparepart Mesin Turbin Jalur Produksi A",
      status: "REJECTED",
      userId: mfgStaff1.id,
      receipt: {
        create: {
          imageUrl: realInvoiceImagePath,
          ocrRawText: JSON.stringify({
            documentType: "FAKTUR_KOMERSIAL",
            vendor: "CV Mesin Perkasa Teknik",
            invoiceNumber: "MPT-2025-012",
            date: "2025-10-17",
            items: [{ no: 1, name: "Sparepart Rotor Turbin", qty: 2, unitPrice: 29000000, totalPrice: 58000000 }],
            amount: 58000000,
          }),
          extractedVendor: "CV Mesin Perkasa Teknik",
          extractedDate: "2025-10-17",
          extractedAmount: 58000000,
          phashFingerprint: "aabbccddeeff0011",
          sha256Hash: "aabbccddeeff00112233445566778899aabbccddeeff001122334455667788",
          mimeType: "image/jpeg",
          fileSizeKb: 153,
          ocrConfidence: 0.92,
        },
      },
      fraudAnalysis: {
        create: {
          riskScore: 85,
          riskLevel: "HIGH",
          reasonXai: "Nilai pengadaan Rp 58 Jt melampaui limit pagu deviasi divisi tanpa persetujuan komite teknis, nomor faktur tidak terdaftar di e-Faktur resmi.",
          pointsBreakdown: JSON.stringify([
            { rule: "Melampaui Pagu Pengadaan Tanpa Tender", points: 45, category: "ANOMALY_AMOUNT" },
            { rule: "NPWP Rekanan Tidak Aktif", points: 40, category: "ANOMALY_AMOUNT" }
          ]),
          isAnomalyAmount: true,
        },
      },
    },
  });

  // TX 9: Research & Development (R&D) & Regulatory Affairs (Auto Approved)
  const t9 = await prisma.transaction.create({
    data: {
      code: "TX-88135",
      applicantName: "Dr. Farhan Maulana",
      department: "Research & Development (R&D) & Regulatory Affairs",
      category: "operasional",
      vendor: "Laboratorium Kimia Analitika UI",
      date: new Date("2025-10-16T11:00:00Z"),
      amount: 12500000,
      description: "Uji Sampel Spektrometri & Validasi Klinis Formula Baru",
      status: "AUTO_APPROVED",
      userId: rdStaff1.id,
      receipt: {
        create: {
          imageUrl: realInvoiceImagePath,
          ocrRawText: JSON.stringify({
            documentType: "FAKTUR_UJI_LAB",
            vendor: "Laboratorium Kimia Analitika UI",
            invoiceNumber: "LAB-UI-2025-88",
            date: "2025-10-16",
            items: [{ no: 1, name: "Uji Spektrometri Massa 5 Sampel", qty: 5, unitPrice: 2500000, totalPrice: 12500000 }],
            amount: 12500000,
          }),
          extractedVendor: "Laboratorium Kimia Analitika UI",
          extractedDate: "2025-10-16",
          extractedAmount: 12500000,
          phashFingerprint: "1100229988776655",
          sha256Hash: "11002299887766554433221100aabbccddeeff00112233445566778899aabb",
          mimeType: "image/jpeg",
          fileSizeKb: 153,
          ocrConfidence: 0.98,
        },
      },
      fraudAnalysis: {
        create: {
          riskScore: 12,
          riskLevel: "LOW",
          reasonXai: "Lembaga riset terafiliasi perguruan tinggi negeri, dokumen kontrak uji terlampir lengkap.",
          pointsBreakdown: JSON.stringify([
            { rule: "Vendor Resmi Terdaftar Tier 1", points: 12, category: "NORMAL" }
          ]),
        },
      },
      webhookLogs: {
        create: {
          targetUrl: "http://localhost:3000/api/webhook/finance/disbursement",
          payload: JSON.stringify({
            event: "DISBURSEMENT_AUTO_APPROVED",
            transactionId: "TX-88135",
            amount: 12500000,
            timestamp: new Date("2025-10-16T11:00:03Z").toISOString()
          }),
          statusCode: 200,
          status: "SUCCESS"
        }
      }
    },
  });

  // TX 10: Human Resources & Corporate Affairs (Approved by Auditor)
  const t10 = await prisma.transaction.create({
    data: {
      code: "TX-88128",
      applicantName: "Anisa Fitriani",
      department: "Human Resources & Corporate Affairs",
      category: "operasional",
      vendor: "PT Asuransi Jiwa Sejahtera",
      date: new Date("2025-10-15T10:00:00Z"),
      amount: 18200000,
      description: "Premi Asuransi Kesehatan Karyawan Baru Q4",
      status: "APPROVED",
      userId: hrStaff1.id,
      receipt: {
        create: {
          imageUrl: realInvoiceImagePath,
          ocrRawText: JSON.stringify({
            documentType: "PREMI_ASURANSI",
            vendor: "PT Asuransi Jiwa Sejahtera",
            invoiceNumber: "INS-2025-10-99",
            date: "2025-10-15",
            items: [{ no: 1, name: "Premi Kesehatan Karyawan x 14", qty: 14, unitPrice: 1300000, totalPrice: 18200000 }],
            amount: 18200000,
          }),
          extractedVendor: "PT Asuransi Jiwa Sejahtera",
          extractedDate: "2025-10-15",
          extractedAmount: 18200000,
          phashFingerprint: "9988776655443322",
          sha256Hash: "99887766554433221100aabbccddeeff00112233445566778899aabbccddeeff",
          mimeType: "image/jpeg",
          fileSizeKb: 153,
          ocrConfidence: 0.99,
        },
      },
      fraudAnalysis: {
        create: {
          riskScore: 18,
          riskLevel: "LOW",
          reasonXai: "Sesuai polis induk asuransi korporat yang disetujui HR & Keuangan.",
          pointsBreakdown: JSON.stringify([
            { rule: "Sesuai Pagu Benefit Karyawan", points: 18, category: "NORMAL" }
          ]),
        },
      },
    },
  });

  // TX 11: Legal, Compliance & Corporate Governance (Pending Review)
  const t11 = await prisma.transaction.create({
    data: {
      code: "TX-88119",
      applicantName: "Faisal Akbar, SH",
      department: "Legal, Compliance & Corporate Governance",
      category: "operasional",
      vendor: "Kantor Notaris & PPAT Sudirman",
      date: new Date("2025-10-14T14:00:00Z"),
      amount: 22000000,
      description: "Akta Notaris Perubahan Anggaran Dasar & Pengesahan Kemenkumham",
      status: "PENDING_REVIEW",
      userId: legalStaff1.id,
      receipt: {
        create: {
          imageUrl: realInvoiceImagePath,
          ocrRawText: JSON.stringify({
            documentType: "FAKTUR_NOTARIS",
            vendor: "Kantor Notaris & PPAT Sudirman",
            invoiceNumber: "NOT-2025-081",
            date: "2025-10-14",
            items: [{ no: 1, name: "Jasa Pembuatan Akta & PNBP Kemenkumham", qty: 1, unitPrice: 22000000, totalPrice: 22000000 }],
            amount: 22000000,
          }),
          extractedVendor: "Kantor Notaris & PPAT Sudirman",
          extractedDate: "2025-10-14",
          extractedAmount: 22000000,
          phashFingerprint: "7766554433221100",
          sha256Hash: "7766554433221100aabbccddeeff00112233445566778899aabbccddeeff00",
          mimeType: "image/jpeg",
          fileSizeKb: 153,
          ocrConfidence: 0.97,
        },
      },
      fraudAnalysis: {
        create: {
          riskScore: 42,
          riskLevel: "MEDIUM",
          reasonXai: "Jasa konsultasi hukum dan notaris memerlukan verifikasi salinan SK Kemenkumham dan bukti setoran PNBP.",
          pointsBreakdown: JSON.stringify([
            { rule: "Verifikasi Kelengkapan Bukti Setor PNBP", points: 42, category: "ANOMALY_AMOUNT" }
          ]),
        },
      },
    },
  });

  // TX 12: Finance, Accounting & Tax (Rejected by Auditor)
  const t12 = await prisma.transaction.create({
    data: {
      code: "TX-88110",
      applicantName: "Wahyu Pratama, SE",
      department: "Finance, Accounting & Tax",
      category: "atk",
      vendor: "Toko ATK Mega Perkasa",
      date: new Date("2025-10-13T10:00:00Z"),
      amount: 9500000,
      description: "Pengadaan Kertas HVS & Map Arsip Keuangan Bulanan",
      status: "REJECTED",
      userId: finStaff2.id,
      receipt: {
        create: {
          imageUrl: realInvoiceImagePath,
          ocrRawText: JSON.stringify({
            documentType: "KWITANSI_ATK",
            vendor: "Toko ATK Mega Perkasa",
            invoiceNumber: "KW-ATK-019",
            date: "2025-10-13",
            items: [{ no: 1, name: "Kertas HVS A4 80gr 100 Rim", qty: 100, unitPrice: 95000, totalPrice: 9500000 }],
            amount: 9500000,
          }),
          extractedVendor: "Toko ATK Mega Perkasa",
          extractedDate: "2025-10-13",
          extractedAmount: 9500000,
          phashFingerprint: "3344556677889900",
          sha256Hash: "3344556677889900aabbccddeeff00112233445566778899aabbccddeeff11",
          mimeType: "image/jpeg",
          fileSizeKb: 153,
          ocrConfidence: 0.95,
        },
      },
      fraudAnalysis: {
        create: {
          riskScore: 78,
          riskLevel: "HIGH",
          reasonXai: "Harga satuan barang (Rp 95.000/rim) terdeteksi mark-up 65% di atas e-Katalog LKPP / harga pasar acuan resmi ATK.",
          pointsBreakdown: JSON.stringify([
            { rule: "Indikasi Mark-Up Harga Satuan Barang", points: 48, category: "ANOMALY_AMOUNT" },
            { rule: "Stempel Toko Tidak Memiliki NPWP", points: 30, category: "ANOMALY_AMOUNT" }
          ]),
          isAnomalyAmount: true,
        },
      },
    },
  });

  // 4. Sample Audit Logs
  await prisma.auditLog.create({
    data: {
      transactionId: t1.id,
      userId: auditor1.id,
      auditorName: "Bambang H.",
      action: "PENDING_REVIEW",
      notes: "Sistem mendeteksi transaksi TX-88219 masuk antrean review karena skor risiko 92% (Split Bill & Dini Hari). Menunggu investigasi forensik bukti fisik kuitansi.",
      tamperHash: "sha256:d8f3e284a91cf923184b912adfc0192837461928",
    },
  });

  await prisma.auditLog.create({
    data: {
      transactionId: t8.id,
      userId: auditor2.id,
      auditorName: "Dra. Maya Anggraeni, Ak.",
      action: "REJECTED",
      notes: "Pengajuan ditolak oleh Auditor. Transaksi melebihi batas pengadaan tanpa lelang dan NPWP penyedia fiktif.",
      tamperHash: "sha256:aabbccddeeff00112233445566778899aabbccdd",
    },
  });

  await prisma.auditLog.create({
    data: {
      transactionId: t12.id,
      userId: auditor3.id,
      auditorName: "Raden Wijaya, CA., CFE",
      action: "REJECTED",
      notes: "Ditolak: Indikasi penggelembungan harga (mark-up) satuan kertas ATK di atas harga pasar wajar.",
      tamperHash: "sha256:3344556677889900aabbccddeeff001122334455",
    },
  });

  console.log("Database seeded successfully with 30 users (3 Auditors + 27 Staff across 9 departments) and 12 rich audit cases!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
