# Aplikasi Setoran Hafalan Tahfidz BIIPS (GitHub Pages + Supabase)

Aplikasi web setoran hafalan Al-Qur'an untuk **Bina Ilmu Islamic Primary School (BIIPS)** dengan arsitektur **Situs Statis (Static Export)**, di-host langsung melalui **GitHub Pages** (`https://biips-tahfidz.github.io/biips-tahfidz/`) dan mengandalkan **Supabase** sebagai Database PostgreSQL & Storage File Audio.

---

## 🏗️ Struktur Proyek

```text
biips-tahfidz/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions Workflow otomatisasi deploy ke GitHub Pages
├── app/                        # Next.js App Router (Static Client Pages)
│   ├── page.jsx                # Landing Page & Form Login Role
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
├── next.config.js              # Konfigurasi Next.js (`output: 'export'`, `basePath: '/biips-tahfidz'`)
├── .env.local                  # Template Variabel Lingkungan Supabase
├── package.json                # Dependencies Proyek
└── README.md                   # Dokumentasi
```

---

## 🚀 Cara Mengaktifkan GitHub Pages agar URL `https://biips-tahfidz.github.io/biips-tahfidz/` Buka

Jika URL `https://biips-tahfidz.github.io/biips-tahfidz/` muncul **404 Error (There isn't a GitHub Pages site here)**, Anda perlu mengaktifkan fitur **GitHub Pages** pada Repositori GitHub Anda:

1. Buka Repositori GitHub: `biips-tahfidz/biips-tahfidz`.
2. Masuk ke menu **Settings** > **Pages** (di sidebar sebelah kiri).
3. Pada bagian **Build and deployment** -> **Source**, ubah dari `Deploy from a branch` menjadi **GitHub Actions**.
4. Setelah diubah ke **GitHub Actions**, alur kerja `.github/workflows/deploy.yml` akan otomatis berjalan setiap kali ada pembaruan kode ke cabang `main` atau `master`.
5. Tunggu proses build selesai (dapat dilihat di tab **Actions** di GitHub). Setelah hijau / berhasil, situs web akan langsung aktif di `https://biips-tahfidz.github.io/biips-tahfidz/`.

---

## 🔑 Supabase Setup
1. Buat proyek baru di [Supabase Dashboard](https://supabase.com).
2. Jalankan skrip di `supabase/schema.sql` pada SQL Editor Supabase.
3. Jalankan skrip di `supabase/storage-policy.sql` untuk membuat bucket `audio-setoran`.
4. Tambahkan **Repository Secrets** di GitHub (**Settings** > **Secrets and variables** > **Actions**):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 👥 Fitur & Role Akses
* **Login Form (`/`):** Pengguna memasukkan username dan password. Sistem menentukan role dan mengarahkan pengguna secara otomatis ke portal sesuai role.
* **Santri (`/santri`):** Merekam suara langsung dari mikrofon atau mengunggah file audio hafalan.
* **Ustadz / Guru (`/ustadz`):** Mengulas rekaman setoran, memberi nilai, dan mengirim laporan progress ke WhatsApp.
* **Mudir / Admin (`/admin`):** Mengelola akun pengguna serta melihat rekapitulasi kelas.
