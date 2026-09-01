'use client';

import './globals.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCurrentUser, logoutUser } from '@/lib/supabase';

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check initial user session
    setUser(getCurrentUser());

    // Listen for storage changes across tabs
    const handleStorage = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-800 min-h-screen flex flex-col">
        <header className="bg-emerald-700 text-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <img
                src="/logo biips.jpg"
                alt="Logo BIIPS"
                className="w-10 h-10 rounded-full object-cover shadow border border-white group-hover:opacity-90 transition"
              />
              <div>
                <h1 className="text-xl font-bold tracking-wide">Tahfidz BIIPS</h1>
                <p className="text-xs text-emerald-100">Bina Ilmu Islamic Primary School</p>
              </div>
            </Link>

            <nav className="flex items-center space-x-4 text-sm font-medium mt-2 sm:mt-0">
              <Link href="/" className="hover:text-emerald-200 transition">Beranda</Link>
              <Link href="/santri" className="hover:text-emerald-200 transition">Santri</Link>
              <Link href="/orangtua" className="hover:text-emerald-200 transition">Orang Tua</Link>
              <Link href="/ustadz" className="hover:text-emerald-200 transition">Ustadz / Guru</Link>
              <Link href="/admin" className="hover:text-emerald-200 transition">Mudir / Admin</Link>

              {user && (
                <div className="flex items-center space-x-2 pl-3 border-l border-emerald-600">
                  <span className="text-xs bg-emerald-800 text-emerald-100 px-2.5 py-1 rounded-md font-semibold">
                    👤 {user.username} ({user.role})
                  </span>
                  <button
                    onClick={logoutUser}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-2.5 py-1 rounded-md transition font-medium"
                    title="Logout"
                  >
                    Logout
                  </button>
                </div>
              )}
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
