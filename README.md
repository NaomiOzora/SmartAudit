# 🛡️ SmartAudit v4.0 - Sistem Deteksi Fraud Pengeluaran Kas Berbasis AI

> **Capstone Project - Semester 7**  
> Sistem Otomasi Deteksi Fraud & Forensik Digital Pengeluaran Kas Terintegrasi (Fast-Track Auto Approval, 3-Sigma Pagu Wajar, Explainable AI & Jejak Audit ISO 27001).

---

## 📋 Daftar Isi
1. [Prasyarat Sistem](#-prasyarat-sistem)
2. [Panduan Menjalankan Project (Step-by-Step)](#-panduan-menjalankan-project-step-by-step)
3. [Akun Login Uji Coba (Demo Accounts)](#-akun-login-uji-coba-demo-accounts)
4. [Skenario Software Testing untuk Kelompok](#-skenario-software-testing-untuk-kelompok)
5. [Fitur Utama & Arsitektur Kepatuhan](#-fitur-utama--arsitektur-kepatuhan)
6. [Troubleshooting & Solusi Kendala](#-troubleshooting--solusi-kendala)

---

## 💻 Prasyarat Sistem

Sebelum menjalankan project di laptop masing-masing, pastikan sudah terinstal:
- **Node.js**: Versi `18.x`, `20.x` (LTS), atau `22.x`. (Cek di terminal: `node -v`)
- **Git**: Untuk clone repositori. (Cek di terminal: `git --version`)
- **Web Browser**: Google Chrome, Microsoft Edge, atau Mozilla Firefox.

---

## 🚀 Panduan Menjalankan Project (Step-by-Step)

Ikuti 5 langkah mudah berikut di terminal laptop masing-masing:

### 1. Clone Repositori
```bash
git clone <URL_REPO_GITHUB_ANDA>
cd SmartAudit
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Buat File Environment (`.env`)
Salin file `.env.example` menjadi `.env`:
- **Windows (Command Prompt / PowerShell):**
  ```powershell
  copy .env.example .env
  ```
- **macOS / Linux:**
  ```bash
  cp .env.example .env
  ```
> **Catatan API Key:** File `.env` sudah terisi konfigurasi bawaan (SQLite zero-config). Anda dapat memasukkan API Key Google Gemini gratis pada variabel `GEMINI_API_KEY=""` jika ingin mengaktifkan model Vision AI online secara live. Jika dikosongkan, sistem tetap berjalan normal menggunakan mesin ekstraksi lokal *SmartAudit Fallback Engine*.

### 4. Sinkronisasi Skema & Inisialisasi Database
Jalankan sinkronisasi database SQLite lokal dan isi data awal (*seed*):
```bash
npx prisma db push
npm run prisma:seed
```
*Perintah di atas akan otomatis membuat file database `dev.db` serta mengisi data 3 Auditor Forensik, 27 Staf FMCG dari 9 Divisi, dan riwayat transaksi awal.*

### 5. Jalankan Server Aplikasi
```bash
npm run dev
```
Buka browser dan akses: **[http://localhost:3000](http://localhost:3000)** 🎉

---

## 🔑 Akun Login Uji Coba (Demo Accounts)

Di halaman **`/login`**, Anda dapat menggunakan tombol **1-Click Quick Demo Login** atau mengetikkan NIP berikut:

| Peran | Nama Pengguna | NIP / Akun | Divisi / Satuan Kerja | Dashboard |
|---|---|---|---|---|
| **Auditor Forensik** | Bambang H. | `19840212` | Satuan Audit Penjamin Keuangan | `/antrean-review` |
| **Auditor Forensik** | Dra. Maya Anggraeni, Ak. | `19860514` | Satuan Audit Penjamin Keuangan | `/antrean-review` |
| **Staf Pemohon** | Nurul Hidayah, M.Sc | `19940822` | Research & Development (R&D) | `/beranda-staf` |
| **Staf Pemohon** | Bagus Saputra | `19910105` | Sales & Commercial | `/beranda-staf` |
| **Staf Pemohon** | Siti Rahma | `19900315` | Finance, Accounting & Tax | `/beranda-staf` |

---

## 🧪 Skenario Software Testing untuk Kelompok

Untuk mempermudah rekan kelompok menguji sistem dan memberikan *feedback*, berikut panduan skenario pengujian yang dapat dicoba:

### Skenario 1: Pengajuan Kuitansi & Auto Lolos AI (Fast-Track)
1. Login sebagai **Staf** (misal: Nurul Hidayah / R&D).
2. Masuk ke menu **Ajukan Pengeluaran** (`/input-pengeluaran`).
3. Unggah file kuitansi faktur bersih dengan nominal di bawah pagu wajar divisinya (misal Rp 15.000.000 s/d Rp 35.000.000).
4. **Yang Perlu Diamati**:
   - AI otomatis mendeteksi vendor, tanggal, nominal, dan PPN 11%.
   - Kategori otomatis terklasifikasi cerdas (badge: `✨ Auto-AI`).
   - Tekan **Kirim Pengajuan Kas**.
   - Sistem langsung menyetujui secara otomatis (**AUTO_APPROVED**, Skor Risiko `0%`), dan dana langsung dikirim ke kasir via webhook.

### Skenario 2: Anomali Nominal (> 3 Standar Deviasi per Divisi)
1. Di form pengajuan staf R&D, coba masukkan nominal yang melompat di atas pagu wajar divisinya (Pagu R&D adalah **Rp 45.000.000**, coba isi Rp 50.000.000).
2. **Yang Perlu Diamati**:
   - Form input memunculkan banner informasi kepatuhan SOP 3-Sigma real-time.
   - Saat dikirim, berkas **tidak ditolak**, melainkan dialihkan ke antrean review manual oleh Auditor Forensik karena memerlukan verifikasi fisik.

### Skenario 3: Verifikasi Forensik Cacat Pajak PPN 11%
1. Di form pengajuan, coba isi Subtotal `Rp 10.000.000` tapi isi PPN `Rp 900.000` (seharusnya Rp 1.100.000).
2. **Yang Perlu Diamati**:
   - Muncul peringatan real-time bahwa terdapat kecacatan kalkulasi pajak PPN 11% (+45 Poin).
   - Jika faktur memiliki diskon, sistem secara cerdas menghitung PPN dari $\text{DPP} = \text{Subtotal} - \text{Diskon}$ sehingga tidak menimbulkan alarm palsu.

### Skenario 4: Pemeriksaan Berkas oleh Auditor Forensik
1. Logout lalu login sebagai **Auditor** (Bambang H.).
2. Buka menu **Antrean Review** (`/antrean-review`).
3. Pilih salah satu transaksi bertanda `PENDING_REVIEW` untuk masuk ke halaman **Detail Inspeksi** (`/detail-inspeksi/[id]`).
4. **Yang Perlu Diamati**:
   - Fitur *Side-by-Side Visualizer*: Zoom In, Zoom Out, Reset, dan mode Data Ekstraksi OCR.
   - Kotak Analisis Risiko Explainable AI (XAI) yang merinci poin pelanggaran.
   - Lembar Putusan Auditor (*Adjudication Sheet*): Pilih **Setujui**, **Tolak**, atau **Klarifikasi**, masukkan catatan BAP, dan centang segel ISO 27001.

### Skenario 5: Jejak Audit Kebal Manipulasi (Audit Trail Log)
1. Masuk ke menu **Jejak Audit** (`/audit-trail-log`) dan **Riwayat Pencairan** (`/riwayat-disbursement`).
2. Periksa apakah setiap tindakan audit tercatat lengkap dengan tanda tangan digital SHA-256 dan log webhook ERP kasir.

---

## 🏗️ Fitur Utama & Arsitektur Kepatuhan

- **Next.js 14 App Router & TypeScript**: Arsitektur modern berorientasi komponen, tipe data aman (*type-safe*).
- **Matriks Pagu Wajar 3-Sigma FMCG**: Dihitung matematis ($\text{Limit} = \mu + 3\sigma$) per 9 divisi perusahaan dengan plafon auto-approval maksimal **Rp 75.000.000**.
- **Auto-Categorization Cerdas**: 18 kategori belanja korporat FMCG terstruktur yang otomatis diklasifikasikan oleh AI berdasarkan isi barang/jasa faktur.
- **Deteksi Anti-Kolusi Terisolasi**: Membandingkan nomor kontak penjual dan perwakilan pembeli tanpa false positive akibat format judul dokumen.
- **Perceptual Hashing (dHash 64-bit)**: Deteksi kembar grafis nota duplikat yang diedit secara visual.

---

## ❓ Troubleshooting & Solusi Kendala

| Kendala | Penyebab | Solusi |
|---|---|---|
| `Port 3000 is already in use` | Ada aplikasi lain yang memakai port 3000 | Jalankan di port lain: `npm run dev -- -p 3001` |
| `PrismaClientInitializationError` / Database error | File database belum ter-generate | Jalankan: `npx prisma db push && npm run prisma:seed` |
| `Cannot find module ...` | Dependensi belum terinstal sempurna | Jalankan ulang: `npm install` |
| Perubahan kode konflik di git | File database lokal ikut ter-commit | Jalankan `git checkout -- prisma/dev.db` lalu `git pull` |

---
*Dikembangkan untuk Tugas Akhir / Capstone Project - SmartAudit Team 2026.*
