/**
 * Single Source of Truth (SSOT): Master Katalog Kategori Pengeluaran Korporasi FMCG
 * Digunakan untuk klasifikasi otomatis AI, validasi kepatuhan SOP, dan filter antarmuka.
 */

export interface ExpenseCategory {
  id: string;
  name: string;
  group: string;
  icon: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  recommendedDepartments: string[];
  requiresJustification: boolean;
  description: string;
  keywords: string[];
}

export const EXPENSE_CATEGORY_GROUPS = [
  "Riset, Pengujian & Regulasi (R&D)",
  "Pabrik, Manufaktur & Operasional",
  "Rantai Pasok, Logistik & Distribusi",
  "Teknologi Informasi & Digital",
  "Pemasaran, Promosi & Komersial",
  "Legal, Kepatuhan & Keuangan",
  "SDM, Kesejahteraan & Pelatihan",
  "Administrasi & Fasilitas Kantor",
  "Perjalanan Dinas & Konsumsi Kerja",
  "Representasi & Kategori Khusus",
] as const;

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  // 1. Riset, Pengujian & Regulasi
  {
    id: "lab_testing",
    name: "Uji Laboratorium & Riset Bahan Baku",
    group: "Riset, Pengujian & Regulasi (R&D)",
    icon: "🔬",
    riskLevel: "LOW",
    recommendedDepartments: ["Research & Development (R&D) & Regulatory Affairs"],
    requiresJustification: false,
    description: "Pengujian komposisi sampel, uji mikrobiologi, stabilitas produk & riset formulasi",
    keywords: ["uji", "laboratorium", "lab", "sampel", "mikroba", "cemaran", "stabilitas", "komposisi", "analisis", "reagen", "spektro"],
  },
  {
    id: "regulatory_halal_bpom",
    name: "Sertifikasi Halal, BPOM & Regulasi",
    group: "Riset, Pengujian & Regulasi (R&D)",
    icon: "📜",
    riskLevel: "LOW",
    recommendedDepartments: [
      "Research & Development (R&D) & Regulatory Affairs",
      "Legal, Compliance & Corporate Governance",
    ],
    requiresJustification: false,
    description: "Biaya registrasi izin edar BPOM, audit Halal LPPOM/BPJPH & uji klinis regulatori",
    keywords: ["bpom", "halal", "sertifikasi", "regulasi", "lppom", "bpjph", "izin edar", "standarisasi", "iso"],
  },

  // 2. Pabrik, Manufaktur & Operasional
  {
    id: "machinery_maintenance",
    name: "Pemeliharaan Mesin & Suku Cadang Pabrik",
    group: "Pabrik, Manufaktur & Operasional",
    icon: "🏭",
    riskLevel: "LOW",
    recommendedDepartments: ["Manufacturing & Operations"],
    requiresJustification: false,
    description: "Servis mesin industri, overhaul boiler, suku cadang conveyor, motor & utilitas pabrik",
    keywords: ["mesin", "boiler", "conveyor", "sparepart", "suku cadang", "pabrik", "bengkel", "kalibrasi mesin", "maintenance", "servis"],
  },
  {
    id: "industrial_utilities",
    name: "Bahan Penolong & Utilitas Industri",
    group: "Pabrik, Manufaktur & Operasional",
    icon: "⚡",
    riskLevel: "LOW",
    recommendedDepartments: ["Manufacturing & Operations"],
    requiresJustification: false,
    description: "Pelumas industri, gas industri, filter air limbah & bahan penolong proses produksi",
    keywords: ["pelumas", "oli", "gas", "filter", "limbah", "palet", "kemasan", "karton", "drum"],
  },

  // 3. Rantai Pasok, Logistik & Distribusi
  {
    id: "logistics_freight",
    name: "Ekspedisi Kargo, Kontainer & Sewa Truk",
    group: "Rantai Pasok, Logistik & Distribusi",
    icon: "🚚",
    riskLevel: "LOW",
    recommendedDepartments: ["Supply Chain & Logistics", "Sales & Commercial"],
    requiresJustification: false,
    description: "Jasa kargo kontainer antarpulau, sewa armada truk wingbox, ongkir ekspedisi & handling",
    keywords: ["kargo", "ekspedisi", "truk", "kontainer", "ongkir", "freight", "forwarding", "surat jalan", "delivery", "shipping"],
  },
  {
    id: "warehouse_storage",
    name: "Sewa Gudang Distribusi & Cold Storage",
    group: "Rantai Pasok, Logistik & Distribusi",
    icon: "🏬",
    riskLevel: "LOW",
    recommendedDepartments: ["Supply Chain & Logistics"],
    requiresJustification: false,
    description: "Biaya sewa hub gudang regional, fasilitas cold storage chiller & sewa forklift",
    keywords: ["gudang", "warehouse", "storage", "chiller", "cold storage", "sewa gudang", "forklift", "staging"],
  },

  // 4. Teknologi Informasi & Digital
  {
    id: "hardware",
    name: "Hardware, Server & Perangkat Jaringan",
    group: "Teknologi Informasi & Digital",
    icon: "💻",
    riskLevel: "LOW",
    recommendedDepartments: ["Information Technology & Digital Transformation"],
    requiresJustification: false,
    description: "Komputer kantor, server rack, access point, switch Cisco, router & printer kantor",
    keywords: ["komputer", "laptop", "pc", "server", "router", "switch", "cisco", "mikrotik", "hardware", "printer", "ups", "ram", "harddisk", "ssd"],
  },
  {
    id: "it_software_cloud",
    name: "Lisensi Software Enterprise & Cloud Hosting",
    group: "Teknologi Informasi & Digital",
    icon: "☁️",
    riskLevel: "LOW",
    recommendedDepartments: ["Information Technology & Digital Transformation"],
    requiresJustification: false,
    description: "Langganan cloud AWS/GCP, lisensi SAP ERP, Microsoft 365, database & keamanan siber",
    keywords: ["software", "cloud", "aws", "gcp", "azure", "lisensi", "license", "saas", "hosting", "domain", "antivirus", "sap", "erp"],
  },

  // 5. Pemasaran, Promosi & Komersial
  {
    id: "marketing_ads",
    name: "Iklan Media, Digital Ads & Influencer",
    group: "Pemasaran, Promosi & Komersial",
    icon: "📢",
    riskLevel: "LOW",
    recommendedDepartments: ["Marketing & Brand Management", "Sales & Commercial"],
    requiresJustification: false,
    description: "Kampanye digital Google/Meta Ads, penayangan TVC, agensi iklan & endorsement influencer",
    keywords: ["iklan", "ads", "advertising", "meta", "google ads", "billboard", "influencer", "endorse", "agensi", "kampanye", "creative"],
  },
  {
    id: "event_booth_activation",
    name: "Event, Aktivasi Booth & Trade Promo",
    group: "Pemasaran, Promosi & Komersial",
    icon: "🎪",
    riskLevel: "LOW",
    recommendedDepartments: ["Marketing & Brand Management", "Sales & Commercial"],
    requiresJustification: false,
    description: "Sewa booth pameran mall/supermarket, material promosi, banner, merchandise POSM",
    keywords: ["booth", "event", "pameran", "expo", "bazaar", "posm", "merchandise", "gimmick", "spg", "display", "promo"],
  },

  // 6. Legal, Kepatuhan & Keuangan
  {
    id: "legal_notary",
    name: "Jasa Notaris, Pendaftaran HKI & Konsultan Hukum",
    group: "Legal, Kepatuhan & Keuangan",
    icon: "⚖️",
    riskLevel: "LOW",
    recommendedDepartments: ["Legal, Compliance & Corporate Governance"],
    requiresJustification: false,
    description: "Akta notaris, pendaftaran merek HKI ke Ditjen KI, perpanjangan paten & retensi advokat",
    keywords: ["notaris", "akta", "hki", "merek", "paten", "legal", "hukum", "advokat", "perjanjian", "kontrak"],
  },
  {
    id: "audit_tax_consulting",
    name: "Jasa Audit Eksternal KAP, Konsultan & Pajak",
    group: "Legal, Kepatuhan & Keuangan",
    icon: "📊",
    riskLevel: "LOW",
    recommendedDepartments: ["Finance, Accounting & Tax"],
    requiresJustification: false,
    description: "Fee audit laporan keuangan independen KAP, appraisal aset, konsultan pajak & meterai",
    keywords: ["audit", "kap", "akuntan", "pajak", "tax", "appraisal", "konsultan keuangan", "meterai"],
  },

  // 7. SDM, Kesejahteraan & Pelatihan
  {
    id: "training_recruitment",
    name: "Pelatihan Karyawan, Sertifikasi & Rekrutmen",
    group: "SDM, Kesejahteraan & Pelatihan",
    icon: "🎓",
    riskLevel: "LOW",
    recommendedDepartments: ["HR & Corporate Affairs"],
    requiresJustification: false,
    description: "Workshop kompetensi, sertifikasi profesi BNSP, portal lowongan kerja & psikotes",
    keywords: ["training", "pelatihan", "sertifikasi", "workshop", "kursus", "rekrutmen", "psikotes", "jobfair", "seminar"],
  },
  {
    id: "employee_welfare",
    name: "Kesehatan, Medical Check-Up & Seragam Staf",
    group: "SDM, Kesejahteraan & Pelatihan",
    icon: "🩺",
    riskLevel: "LOW",
    recommendedDepartments: ["HR & Corporate Affairs"],
    requiresJustification: false,
    description: "MCU tahunan karyawan pabrik/kantor, kotak P3K, seragam APD kerja & kegiatan CSR",
    keywords: ["mcu", "medical", "check-up", "kesehatan", "klinik", "dokter", "obat", "p3k", "seragam", "apd", "csr"],
  },

  // 8. Administrasi & Fasilitas Kantor
  {
    id: "atk",
    name: "Alat Tulis Kantor (ATK) & Percetakan Dokumen",
    group: "Administrasi & Fasilitas Kantor",
    icon: "✏️",
    riskLevel: "LOW",
    recommendedDepartments: [],
    requiresJustification: false,
    description: "Kertas rim, tinta/toner printer, binder, map, buku register & fotokopi berkas",
    keywords: ["kertas", "atk", "tinta", "toner", "alat tulis", "pulpen", "spidol", "binder", "map", "fotokopi", "percetakan"],
  },
  {
    id: "facility_utility",
    name: "Fasilitas Kantor, Utilitas & Perbaikan Umum",
    group: "Administrasi & Fasilitas Kantor",
    icon: "🏢",
    riskLevel: "LOW",
    recommendedDepartments: [],
    requiresJustification: false,
    description: "Listrik, air PAM, internet kantor, jasa cleaning service & perbaikan gedung",
    keywords: ["listrik", "pln", "air", "pam", "internet", "telkom", "indihome", "cleaning", "kebersihan", "ac", "renovasi"],
  },

  // 9. Perjalanan Dinas & Konsumsi Kerja
  {
    id: "transportasi",
    name: "Transportasi, Tiket & Akomodasi Perjalanan Dinas",
    group: "Perjalanan Dinas & Konsumsi Kerja",
    icon: "✈️",
    riskLevel: "LOW",
    recommendedDepartments: [],
    requiresJustification: false,
    description: "Tiket pesawat/kereta perjalanan dinas luar kota, voucher hotel kedinasan, taksi & BBM dinas",
    keywords: ["tiket", "pesawat", "garuda", "citilink", "kereta", "hotel", "penginapan", "taksi", "grab", "toll", "tol", "bbm dinas"],
  },
  {
    id: "konsumsi",
    name: "Konsumsi Rapat Kerja & Jamuan Internal",
    group: "Perjalanan Dinas & Konsumsi Kerja",
    icon: "🍱",
    riskLevel: "LOW",
    recommendedDepartments: [],
    requiresJustification: false,
    description: "Nasi boks makan siang rapat koordinasi internal, snack box pelatihan & konsumsi lembur",
    keywords: ["konsumsi", "makan", "lunch", "snack", "catering", "katering", "nasi boks", "kopi", "rapat", "lembur"],
  },

  // 10. Representasi & Kategori Khusus
  {
    id: "entertainment",
    name: "Entertainment & Representasi Klien (High Risk)",
    group: "Representasi & Kategori Khusus",
    icon: "🍸",
    riskLevel: "HIGH",
    recommendedDepartments: ["Marketing & Brand Management", "Sales & Commercial"],
    requiresJustification: true,
    description: "Jamuan makan malam relasi bisnis eksternal, hospitality klien & entertainment resmi",
    keywords: ["entertainment", "hiburan", "fine dining", "vip", "karaoke", "lounge", "spa", "golf", "jamuan tamu", "representasi"],
  },
  {
    id: "operasional",
    name: "Operasional Rutin & Pengeluaran Umum",
    group: "Representasi & Kategori Khusus",
    icon: "📦",
    riskLevel: "LOW",
    recommendedDepartments: [],
    requiresJustification: false,
    description: "Beban belanja operasional umum harian yang tidak masuk ke dalam kategori spesifik",
    keywords: ["operasional", "umum", "rutin", "lain-lain", "lainnya"],
  },
];

/**
 * Peta pencarian instan kategori berdasarkan ID
 */
export const EXPENSE_CATEGORIES_MAP: Record<string, ExpenseCategory> = EXPENSE_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  },
  {} as Record<string, ExpenseCategory>
);

/**
 * Heuristik Klasifikasi Kategori Cerdas (Smart AI Auto-Classifier)
 * Menganalisis teks faktur, nama vendor, rincian barang/jasa, dan catatan untuk mendeteksi kategori belanja secara akurat.
 */
export function detectCategoryFromInvoice(params: {
  vendor?: string | null;
  items?: Array<{ name?: string }> | null;
  description?: string | null;
  notes?: string | null;
  rawText?: string | null;
  department?: string | null;
}): { categoryId: string; confidence: number; matchedKeyword?: string; label: string } {
  const combinedText = [
    params.vendor || "",
    (params.items || []).map((i) => i.name || "").join(" "),
    params.description || "",
    params.notes || "",
    params.rawText || "",
  ]
    .join(" ")
    .toLowerCase();

  if (!combinedText.trim()) {
    return {
      categoryId: "operasional",
      confidence: 0.5,
      label: "Operasional Rutin & Pengeluaran Umum",
    };
  }

  // Khusus: Deteksi Kategori Berisiko Tinggi terlebih dahulu untuk perlindungan audit
  const entertainmentCat = EXPENSE_CATEGORIES_MAP["entertainment"];
  for (const kw of entertainmentCat.keywords) {
    if (new RegExp(`\\b${kw}\\b`, "i").test(combinedText)) {
      return {
        categoryId: "entertainment",
        confidence: 0.95,
        matchedKeyword: kw,
        label: entertainmentCat.name,
      };
    }
  }

  // Hitung skor kecocokan kata kunci untuk setiap kategori
  let bestCategory = "operasional";
  let maxScore = 0;
  let matchedKw: string | undefined = undefined;

  for (const cat of EXPENSE_CATEGORIES) {
    if (cat.id === "operasional") continue;

    let score = 0;
    let localMatchedKw: string | undefined;

    for (const kw of cat.keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, "i");
      if (regex.test(combinedText)) {
        score += 3;
        if (!localMatchedKw) localMatchedKw = kw;
      } else if (combinedText.includes(kw)) {
        score += 1;
        if (!localMatchedKw) localMatchedKw = kw;
      }
    }

    // Berikan bobot bonus jika kategori direkomendasikan untuk departemen staf pemohon
    if (params.department && cat.recommendedDepartments.includes(params.department)) {
      score += 2;
    }

    if (score > maxScore) {
      maxScore = score;
      bestCategory = cat.id;
      matchedKw = localMatchedKw;
    }
  }

  const confidence = maxScore >= 6 ? 0.98 : maxScore >= 3 ? 0.85 : maxScore > 0 ? 0.7 : 0.5;

  return {
    categoryId: bestCategory,
    confidence,
    matchedKeyword: matchedKw,
    label: EXPENSE_CATEGORIES_MAP[bestCategory]?.name || "Operasional Rutin & Pengeluaran Umum",
  };
}

/**
 * Format nama kategori untuk ditampilkan rapi di UI
 */
export function formatCategoryLabel(categoryId?: string | null): string {
  if (!categoryId) return "Operasional Rutin";
  return EXPENSE_CATEGORIES_MAP[categoryId]?.name || categoryId;
}

/**
 * Ambil badge info kategori (icon, nama, level risiko)
 */
export function getCategoryBadgeInfo(categoryId?: string | null): {
  id: string;
  name: string;
  icon: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  group: string;
} {
  const cat = EXPENSE_CATEGORIES_MAP[categoryId || ""] || EXPENSE_CATEGORIES_MAP["operasional"];
  return {
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    riskLevel: cat.riskLevel,
    group: cat.group,
  };
}
