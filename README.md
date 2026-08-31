# Aplikasi Setoran Hafalan Tahfidz BIIPS

Aplikasi web modern setoran hafalan Al-Qur'an untuk Bina Ilmu Islamic Primary School (BIIPS) yang dibangun menggunakan **Next.js 14 App Router**, **Tailwind CSS**, **Vercel Blob Storage** (untuk penyimpanan file audio setoran), dan **Supabase PostgreSQL Database** (untuk penyimpanan data pengguna dan rekam hafalan).

---

## 🗂️ Hierarki Struktur Aplikasi

```
biips-tahfidz/
├── app/                        # Next.js App Router & Client/Server Pages
│   ├── page.jsx                # Landing Page & Role Selector
│   ├── layout.jsx              # Root Layout dengan Navigasi Header
│   ├── globals.css             # Tailwind CSS & Global Styles
│   ├── admin/
│   │   └── page.jsx            # Dashboard Mudir / Admin (Kelola Pengguna, Filter Kelas, Rekap WA)
│   ├── ustadz/
│   │   ├── page.jsx            # Dashboard Ustadz (Daftar Setoran, Progress Chart, Kirim Laporan WA)
│   │   └── form.jsx            # Form Evaluasi Penilaian Setoran (Nilai Tajwid, Kelancaran, Catatan)
│   ├── santri/
│   │   └── page.jsx            # Portal Santri (Rekam Audio Mic, Upload File, Preview Player, Riwayat)
│   ├── orangtua/
│   │   └── page.jsx            # Portal Orang Tua (Dampingi Rekam Setoran Anak & Pantau Nilai Ustadz)
│   └── api/                    # Next.js Serverless API Routes
│       ├── lib/
│       │   └── db.js           # Database Helper (Supabase REST -> Tiered Fallback Storage)
│       ├── users/
│       │   └── route.js        # API User Management (Restriksi Role Mudir/Admin)
│       ├── setoran/
│       │   └── route.js        # API CRUD Setoran & Evaluasi Ustadz
│       ├── upload-vercel/
│       │   └── route.js        # API Endpoint Upload Audio ke Vercel Blob
│       ├── upload-drive/
│       │   └── route.js        # Legacy Redirect Route ke Vercel Blob Upload
│       └── db-check/
│           └── route.js        # API System Health Check (Supabase & Vercel Blob status)
├── lib/
│   └── supabase.js             # Client Helper Supabase REST API
├── supabase/
│   └── schema.sql              # Supabase PostgreSQL Database Schema & Seed Data (26 User)
├── test.js                     # Integration Test Suite (`npm test`)
├── package.json                # Project Dependencies & Scripts
└── README.md                   # Dokumentasi Aplikasi & Petunjuk Deployment
```

---

## 🚀 Fitur Utama Aplikasi

1. **Penyimpanan Media Audio di Vercel Blob:**
   - Santri & Orang Tua dapat merekam suara hafalan langsung dari mikrofon browser atau mengunggah file audio.
   - File audio diunggah secara aman dan publik ke Vercel Blob Storage (`/api/upload-vercel`).

2. **Database Supabase PostgreSQL & Fallback System:**
   - Menyediakan `supabase/schema.sql` yang efisien dan idempotent.
   - Menggunakan tiered fallback system di `app/api/lib/db.js` sehingga sistem tetap dapat berjalan lancar menggunakan in-memory storage jika database Supabase sedang tidak terhubung.

3. **Multi-Role Portal (4 Akses Role):**
   - **Santri:** Mengirimkan setoran surah/ayat, rekam mic, preview audio, dan melihat riwayat evaluasi.
   - **Orang Tua:** Dampingi setoran anak dan memantau catatan ustadz.
   - **Ustadz / Pengampu:** Menilai tajwid & kelancaran hafalan, memberi catatan, melihat progress chart santri, serta **mengirimkan laporan progress perkembangan hafalan anak via WhatsApp**.
   - **Mudir / Admin:** Menambah akun pengguna baru, memfilter santri per kelas, dan mengirimkan rekapitulasi kelas via WhatsApp.

4. **Integrasi WhatsApp Report:**
   - Ustadz & Mudir dapat menekan tombol **📲 Kirim WA Progress** yang secara otomatis menggenerasi format ringkasan laporan dan membuka WhatsApp (`https://wa.me/`).

---

## 🛠️ Cara Menjalankan Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Jalankan Integration Test
```bash
npm test
```

### 3. Jalankan Server Lokal
```bash
npm run dev
```
Akses di browser pada `http://localhost:3000`.

---

## 🌍 Environment Variables (Vercel & Supabase Setup)

Untuk menghubungkan ke instance Supabase dan Vercel Blob secara live, tambahkan variabel lingkungan di Vercel/`.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
BLOB_READ_WRITE_TOKEN=your-vercel-blob-read-write-token
```
