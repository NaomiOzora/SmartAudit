/**
 * Single Source of Truth (SSOT): Matriks Pagu Wajar 3-Sigma per Departemen
 * Standar Korporasi FMCG SmartAudit (Plafon Maksimal Auto-Approve Rp 75.000.000)
 */

export interface DivisionLimitInfo {
  name: string;
  limit: number;
  mean: number;
  sigma: number;
  desc: string;
  scope: string;
  action: string;
}

export const MAX_3SIGMA_AUTO_LIMIT = 75000000;
export const FALLBACK_DIVISION_LIMIT = 40000000;

export const DIVISION_3SIGMA_MAP: Record<string, DivisionLimitInfo> = {
  "Manufacturing & Operations": {
    name: "Manufacturing & Operations",
    limit: 75000000,
    mean: 30000000,
    sigma: 15000000,
    desc: "Pemeliharaan mesin pabrik, utilitas & suku cadang industri",
    scope: "Pemeliharaan mesin industri pabrik, boiler, utilitas, spare parts & suku cadang mesin",
    action: "Review SPK Pabrik, BAST & Garansi Mesin",
  },
  "Supply Chain & Logistics": {
    name: "Supply Chain & Logistics",
    limit: 70000000,
    mean: 28000000,
    sigma: 14000000,
    desc: "Armada truk logistik, kargo pengiriman & sewa pergudangan",
    scope: "Armada pengiriman kontainer, biaya kargo logistik, BBM armada & sewa pergudangan",
    action: "Review Surat Jalan & Delivery Order (DO)",
  },
  "Information Technology & Digital Transformation": {
    name: "Information Technology & Digital Transformation",
    limit: 65000000,
    mean: 26000000,
    sigma: 13000000,
    desc: "Perangkat server, infrastruktur cloud & lisensi software enterprise",
    scope: "Server hardware, infrastruktur cloud AWS/GCP, lisensi enterprise software & jaringan",
    action: "Review SLA Vendor & Lisensi Enterprise",
  },
  "Marketing & Brand Management": {
    name: "Marketing & Brand Management",
    limit: 60000000,
    mean: 24000000,
    sigma: 12000000,
    desc: "Belanja iklan digital, media placement & materi promosi ritel",
    scope: "Belanja iklan digital (Google/Meta Ads), materi baliho promosi & kampanye ritel",
    action: "Review Rincian Media Plan & Bukti Tayang Iklan",
  },
  "Finance, Accounting & Tax": {
    name: "Finance, Accounting & Tax",
    limit: 55000000,
    mean: 22000000,
    sigma: 11000000,
    desc: "Jasa audit eksternal, konsultan perpajakan & perbankan",
    scope: "Jasa audit akuntan publik, konsultan perpajakan & biaya administrasi perbankan",
    action: "Review Kontrak Audit & Faktur Pajak Resmi",
  },
  "Sales & Commercial": {
    name: "Sales & Commercial",
    limit: 50000000,
    mean: 20000000,
    sigma: 10000000,
    desc: "Aktivitas komersial, promosi penjualan & kemitraan distributor",
    scope: "Ekspansi jaringan penjualan, sewa booth promosi ritel & kemitraan distributor",
    action: "Review Perjanjian Agen & Berita Acara Promosi",
  },
  "Research & Development (R&D) & Regulatory Affairs": {
    name: "Research & Development (R&D) & Regulatory Affairs",
    limit: 45000000,
    mean: 18000000,
    sigma: 9000000,
    desc: "Pengujian lab mutu, pendaftaran izin BPOM/Halal & reagen riset",
    scope: "Pengujian lab mutu, pendaftaran izin edar BPOM/Halal & reagen riset pangan",
    action: "Review Sertifikasi Uji Mutu & SK BPOM",
  },
  "Legal, Compliance & Corporate Governance": {
    name: "Legal, Compliance & Corporate Governance",
    limit: 40000000,
    mean: 16000000,
    sigma: 8000000,
    desc: "Retainer fee penasihat hukum korporasi, akta notaris & HAKI",
    scope: "Retainer fee penasihat hukum korporasi, akta notaris & pendaftaran HAKI merek",
    action: "Review Berita Acara Legal & Salinan Akta",
  },
  "Human Resources & Corporate Affairs": {
    name: "Human Resources & Corporate Affairs",
    limit: 35000000,
    mean: 14000000,
    sigma: 7000000,
    desc: "Program pelatihan staf, rekrutmen massal & fasilitas karyawan",
    scope: "Pelatihan internal SDM, konsumsi korporasi, rekrutmen massal & seragam kerja",
    action: "Review Daftar Hadir, Silabus & Invoice Vendor",
  },
};

export const DIVISION_ALIASES_MAP: Record<string, string> = {
  "IT & Digital": "Information Technology & Digital Transformation",
  "TI & Infrastruktur": "Information Technology & Digital Transformation",
  "Pengadaan & Logistik": "Supply Chain & Logistics",
  "Pemasaran & Humas": "Marketing & Brand Management",
  "Operasional": "Manufacturing & Operations",
};

export function getDivisionLimitInfo(department?: string | null): DivisionLimitInfo {
  if (!department) {
    return {
      name: "Umum",
      limit: FALLBACK_DIVISION_LIMIT,
      mean: 16000000,
      sigma: 8000000,
      desc: "Belanja operasional umum instansi",
      scope: "Pengeluaran umum sesuai otorisasi standar",
      action: "Review Dokumen & Bukti Fisik",
    };
  }
  const normalizedDept = DIVISION_ALIASES_MAP[department] || department;
  return (
    DIVISION_3SIGMA_MAP[normalizedDept] || {
      name: department,
      limit: FALLBACK_DIVISION_LIMIT,
      mean: 16000000,
      sigma: 8000000,
      desc: "Belanja operasional departemen",
      scope: "Pengeluaran sesuai otorisasi standar departemen",
      action: "Review Dokumen & Bukti Fisik",
    }
  );
}

export function getDivisionLimit(department?: string | null): number {
  return getDivisionLimitInfo(department).limit;
}

export const DEPARTMENT_LIST = Object.keys(DIVISION_3SIGMA_MAP);
export const DEPARTMENT_SOP_LIMITS_ARRAY = Object.values(DIVISION_3SIGMA_MAP);
