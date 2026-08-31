# Aplikasi Setoran Hafalan Tahfidz BIIPS (GitHub Pages + Supabase)

Aplikasi web setoran hafalan Al-Qur'an untuk **Bina Ilmu Islamic Primary School (BIIPS)** dengan arsitektur **Situs Statis (Static Export)**, di-host langsung melalui **GitHub / GitHub Pages** dan mengandalkan **Supabase** sebagai Database PostgreSQL & Storage File Audio.

---

## 🏗️ Struktur Proyek

```text
biips-tahfidz/
├── app/                        # Next.js App Router (Static Client Pages)
│   ├── page.jsx                # Landing Page & Role Selector
│   ├── layout.jsx              # Root Layout dengan Navigasi Header
│   ├── globals.css             # Tailwind CSS & Global Styles
│   ├── admin/
│   │   └── page.jsx            # Dashboard Mudir (Kelola User via Supabase Client)
│   ├── ustadz/
│   │   ├── page.jsx            # Dashboard Ustadz (Daftar Setoran & Progress Chart)
│   │   └── form.jsx            # Form Evaluasi Penilaian Setoran
│   ├── santri/
│   │   └── page.jsx            # Portal Santri (Rekam Audio Mic & Direct Upload ke Supabase)
│   └── orangtua/
│       └── page.jsx            # Portal Orang Tua (Pantau Progress Anak)
│
├── lib/
│   └── supabase.js             # Supabase Client SDK (Inisialisasi URL & Anon Key)
│
├── supabase/
│   ├── schema.sql              # PostgreSQL Database Schema (Tabel User, Setoran, Nilai)
│   └── storage-policy.sql      # Konfigurasi Akses Public Storage Bucket Audio
│
├── public/                     # Aset Statis (Logo BIIPS, Gambar, Favicon)
├── next.config.js              # Konfigurasi Next.js (`output: 'export'`)
├── package.json                # Dependencies Proyek
└── README.md                   # Dokumentasi
```

---

## 🚀 Panduan Setup & Deploy

### 1. Supabase Setup
1. Buat proyek baru di [Supabase Dashboard](https://supabase.com).
2. Jalankan skrip di `supabase/schema.sql` pada SQL Editor Supabase untuk membuat tabel `users` dan `setoran`.
3. Jalankan skrip di `supabase/storage-policy.sql` untuk membuat bucket `audio-setoran` dan mengatur izin akses publik.

### 2. Variabel Lingkungan (.env.local)
Buat file `.env.local` pada root proyek:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Build & Static Export untuk GitHub Pages
Aplikasi ini menggunakan `output: 'export'` pada `next.config.js`.

Untuk memunculkan static output:
```bash
npm run build
```
Hasil build statis akan tersimpan di folder `out/`. Folder ini dapat dideploy ke **GitHub Pages**.

---

## 👥 Fitur & Role Akses
* **Santri:** Merekam suara langsung dari mikrofon atau mengunggah file audio hafalan langsung ke Supabase Storage (`audio-setoran`).
* **Orang Tua:** Mendampingi rekaman audio hafalan anak serta memantau hasil evaluasi & nilai tajwid dari Ustadz.
* **Ustadz:** Mengulas rekaman setoran, memberi nilai Tajwid & Kelancaran, serta membuat laporan rekap progress via WhatsApp.
* **Mudir / Admin:** Mengelola akun pengguna (Santri, Guru, Orang Tua, Mudir) serta mengirimkan ringkasan rekap kelas ke WhatsApp.
