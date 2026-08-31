import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Setoran Hafalan Tahfidz BIIPS',
  description: 'Aplikasi Web Setoran Hafalan Tahfidz Statis dengan Supabase Database dan Supabase File Storage',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-800 min-h-screen flex flex-col">
        <header className="bg-emerald-700 text-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-700 font-bold text-xl shadow">
                B
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wide">Tahfidz BIIPS</h1>
                <p className="text-xs text-emerald-100">Bina Ilmu Islamic Primary School</p>
              </div>
            </div>
            <nav className="flex space-x-4 text-sm font-medium mt-2 sm:mt-0">
              <Link href="/" className="hover:text-emerald-200 transition">Beranda</Link>
              <Link href="/santri" className="hover:text-emerald-200 transition">Santri</Link>
              <Link href="/orangtua" className="hover:text-emerald-200 transition">Orang Tua</Link>
              <Link href="/ustadz" className="hover:text-emerald-200 transition">Ustadz / Guru</Link>
              <Link href="/admin" className="hover:text-emerald-200 transition">Mudir / Admin</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6">
          {children}
        </main>

        <footer className="bg-slate-800 text-slate-400 py-6 border-t border-slate-700 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Aplikasi Setoran Tahfidz BIIPS. Powered by Next.js Static Export & Supabase Client.</p>
        </footer>
      </body>
    </html>
  );
}
