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

## 🔑 Akun Login Uji Coba (30 Akun Siap Pakai di Database)

Sistem **tidak membatasi** akun pengujian. Seluruh **30 pegawai** (3 Auditor Forensik + 27 Staf Purchasing dari 9 Divisi FMCG) yang tersimpan di database dapat digunakan untuk login kapan saja!

Cukup masukkan **NIP** atau **Email** di halaman `/login` dengan kata sandi bebas (minimal 6 karakter, contoh: `password123` atau `123456`).

### 1. Satuan Audit Penjamin Keuangan (Auditor Forensik)
| Nama Auditor | NIP Kedinasan | Email Resmi | Peran & Akses |
|---|---|---|---|
| **Bambang H.** | `19840212` | `bambang.h@instansi.go.id` | Lead Auditor Forensik (`/antrean-review`) |
| **Dra. Maya Anggraeni, Ak.** | `19860514` | `maya.anggraeni@smartaudit.co.id` | Senior Auditor Kepatuhan (`/antrean-review`) |
| **Raden Wijaya, CA., CFE** | `19830920` | `raden.wijaya@smartaudit.co.id` | Certified Fraud Examiner (`/antrean-review`) |

### 2. Staf Purchasing & Pengadaan per 9 Divisi FMCG
| Departemen / Divisi | Pagu 3&sigma; Max | Nama Staf Pengadaan | NIP | Email Login |
|---|---|---|---|---|
| **R&D & Regulatory Affairs** | Rp 45.000.000 | **Nurul Hidayah, M.Sc**<br>Dr. Farhan Maulana<br>Ilham Ramadhan | `19920830`<br>`19860416`<br>`19940525` | `nurul.hidayah@smartaudit.co.id`<br>`farhan.maulana@smartaudit.co.id`<br>`ilham.ramadhan@smartaudit.co.id` |
| **Manufacturing & Operations** | Rp 75.000.000 | **Joko Triwahyudi**<br>Ratna Wulandari<br>Arif Budiman | `19850720`<br>`19911204`<br>`19880311` | `joko.triwahyudi@smartaudit.co.id`<br>`ratna.wulandari@smartaudit.co.id`<br>`arif.budiman@smartaudit.co.id` |
| **Supply Chain & Logistics** | Rp 70.000.000 | **Rian Pratama**<br>Dewi Lestari<br>Budi Santoso | `19881112`<br>`19900219`<br>`19890915` | `rian.pratama@instansi.go.id`<br>`dewi.lestari@smartaudit.co.id`<br>`budi.santoso@smartaudit.co.id` |
| **IT & Digital Transformation** | Rp 65.000.000 | **Dimas Pratama**<br>Dina Marlina<br>Reza Oktaviano | `19900823`<br>`19940718`<br>`19960114` | `dimas.pratama@instansi.go.id`<br>`dina.marlina@instansi.go.id`<br>`reza.oktaviano@smartaudit.co.id` |
| **Marketing & Brand Management**| Rp 60.000.000 | **Hendra Kusuma**<br>Alika Nadia<br>Rendy Prasetyo | `19870305`<br>`19941108`<br>`19920617` | `hendra.kusuma@instansi.go.id`<br>`alika.nadia@smartaudit.co.id`<br>`rendy.prasetyo@smartaudit.co.id` |
| **Finance, Accounting & Tax** | Rp 55.000.000 | **Siti Rahma**<br>Wahyu Pratama, SE<br>Melani Putri | `19920415`<br>`19890814`<br>`19950319` | `siti.rahma@instansi.go.id`<br>`wahyu.pratama@smartaudit.co.id`<br>`melani.putri@smartaudit.co.id` |
| **Sales & Commercial** | Rp 50.000.000 | **Bagus Saputra**<br>Clarissa Utami<br>Kevin Adiputra | `19910105`<br>`19930812`<br>`19950422` | `bagus.saputra@smartaudit.co.id`<br>`clarissa.utami@smartaudit.co.id`<br>`kevin.adiputra@smartaudit.co.id` |
| **Legal & Corporate Governance**| Rp 40.000.000 | **Faisal Akbar, SH**<br>Pratiwi Handayani, MH<br>Bayu Wicaksono | `19880126`<br>`19910518`<br>`19930709` | `faisal.akbar@smartaudit.co.id`<br>`pratiwi.handayani@smartaudit.co.id`<br>`bayu.wicaksono@smartaudit.co.id` |
| **HR & Corporate Affairs** | Rp 35.000.000 | **Anisa Fitriani**<br>Dedi Suryadi<br>Nadia Safitri | `19900912`<br>`19871103`<br>`19931021` | `anisa.fitriani@smartaudit.co.id`<br>`dedi.suryadi@smartaudit.co.id`<br>`nadia.safitri@smartaudit.co.id` |

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
