# SmartAudit (Sistem Deteksi Fraud Pengeluaran Kas Berbasis AI)

**Versi:** 4.0 (Final Comprehensive Specification)  
**Arsitektur:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma ORM (SQLite / PostgreSQL) + AI Vision & Perceptual Hashing (dHash 64-bit)

---

## 📌 Ringkasan Proyek

SmartAudit adalah platform otomasi berbasis web untuk mendeteksi indikasi kecurangan (*fraud*) pada pengeluaran kas (klaim ganda, pemecahan transaksi/*split bill*, anomali nominal, dan pelanggaran jam kerja). Sistem memadukan **Rule-Based Engine**, **Perceptual Hashing (pHash)**, dan **AI Vision (Google Gemini 1.5 Flash)** dengan *Explainable AI* (XAI) serta mekanisme *outbound webhook* untuk pencairan kas otomatis (*fast-track auto-approval*).

---

## 🚀 Fitur Utama

1. **Multi-Role Authentication**:
   - **Staf Keuangan / Bendahara (Submitter)**: Input pengeluaran tunggal & massal (CSV), unggah kuitansi fisik dengan progress bar, integrasi OCR AI, dan riwayat permohonan dana.
   - **Auditor Forensik (Reviewer)**: Dashboard antrean review, filter skor risiko & divisi, inspeksi *side-by-side* dokumen asli vs hasil OCR, lembar putusan BAP dengan tanda tangan digital SHA-256 ISO 27001.

2. **Ekstraksi OCR Cerdas dengan Fallback SLA &le; 5 Detik**:
   - Ekstraksi otomatis nama vendor, tanggal, nominal, dan rincian item kuitansi.
   - Mendukung Google Gemini 1.5 Flash Vision.
   - **Manual Fallback**: Jika kuitansi miring/buram atau terjadi kendala jaringan, formulir tetap dapat diedit secara manual tanpa memblokir proses klaim staf.

3. **Hybrid Detection Engine & Matriks Poin Fraud**:
   - **Formula**: `Skor Akhir = MIN(100, Σ (Poin Pelanggaran))`
   - **Threshold**:
     - Skor `< 40%`: *Fast-Track Auto Approval* (otomatis memicu *outbound webhook* ke ERP kasir).
     - Skor `≥ 40%`: Masuk ke Antrean Review Auditor.
   - **Matriks Parameter**:
     - `+40 Poin`: Duplikasi Dokumen (*pHash similarity > 85%* atau *Exact Match* Vendor+Tanggal+Nominal).
     - `+35 Poin`: *Split Bill* (Vendor & Tanggal sama, selisih waktu < 2 jam atau pemecahan pagu direksi).
     - `+25 Poin`: Anomali Nominal (> 3 Standar Deviasi per divisi).
     - `+20 Poin`: Kategori Berisiko Tinggi (Entertainment, Lounge, Representasi Mewah).
     - `+15 Poin`: Pengajuan di Luar Jam/Hari Kerja (Dini hari atau akhir pekan).
     - `+10 Poin`: Nominal Bulat Sempurna Tanpa Rincian Pajak (PPN/PPh).

4. **Forensic View & Side-by-Side Inspection**:
   - Visualizer dokumen fisik interaktif (*Zoom In, Zoom Out, Reset*).
   - Validasi metadata forensik (*Software Scanner*, EXIF timestamp, kerapatan 300 DPI, pHash fingerprint).
   - Penjelasan berbasis narasi (*Explainable AI* / XAI) rincian poin pelanggaran.

5. **Outbound Webhook & Immutable Audit Trail**:
   - Webhook otomatis `POST /api/webhook/finance/disbursement` saat transaksi disetujui.
   - Log jejak audit kebal manipulasi (*tamper-evident*) dengan hash SHA-256.

---

## 🛠️ Panduan Menjalankan Aplikasi di Lokal

### 1. Prasyarat
- Node.js v18+ atau v20+ / v22+
- npm atau pnpm

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Persiapan Database (Zero-Config SQLite)
Database SQLite lokal sudah otomatis terkonfigurasi pada file `prisma/dev.db`.
Jika ingin menyinkronkan ulang skema atau membuat database baru:
```bash
npx prisma db push
```

### 4. Isi Data Awal (Seed Data Kasus Demo)
Sistem telah dilengkapi data kasus sesuai tampilan UI:
```bash
npm run prisma:seed
```

### 5. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser di: **`http://localhost:3000`**

---

## 🔑 Akun Demo Cepat (1-Klik di Halaman Login)

Anda dapat langsung memilih kartu demo di halaman `/login`:

| Peran | Email / NIP | Kata Sandi | Halaman Utama |
|---|---|---|---|
| **Staf Keuangan** | `siti.rahma@instansi.go.id` | `forensicPass2025` | `/beranda-staf` |
| **Auditor Forensik** | `bambang.h@instansi.go.id` | `forensicPass2025` | `/antrean-review` |

---

## 📑 Struktur Halaman & Rute

- `/` : Landing Page resmi SmartAudit
- `/login` : Pemilihan Peran & Login Akun Demo
- `/beranda-staf` : Beranda Staf Keuangan & Rekap Pengajuan
- `/input-pengeluaran` : Formulir Pengajuan Kuitansi (Tunggal & Massal CSV)
- `/antrean-review` : Antrean Review Auditor Forensik & Filter Risiko
- `/detail-inspeksi/[id]` : Inspeksi Forensik *Side-by-Side*, BAP & Adjudikasi
- `/panduan-kepatuhan` : Matriks Limitasi Otoritas & SOP Kebijakan Kas
- `/riwayat-disbursement` : Monitoring Outbound Webhook ke ERP Bank Kasir
- `/audit-trail-log` : Jejak Audit Forensik Kriptografis ISO 27001

---

## 🌐 Konfigurasi PostgreSQL (Opsional)

Jika ingin beralih dari SQLite ke PostgreSQL:
1. Buka file `prisma/schema.prisma`
2. Ubah `provider = "sqlite"` menjadi `provider = "postgresql"`
3. Ubah variabel `DATABASE_URL` di `.env`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/smartaudit?schema=public"
   ```
4. Jalankan:
   ```bash
   npx prisma db push
   npm run prisma:seed
   ```
