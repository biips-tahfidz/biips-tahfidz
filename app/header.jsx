'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/supabase';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

  return (
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
        <nav className="flex items-center space-x-4 text-sm font-medium mt-2 sm:mt-0">
          <Link href="/" className="hover:text-emerald-200 transition">Beranda</Link>
          <Link href="/santri" className="hover:text-emerald-200 transition">Santri</Link>
          <Link href="/orangtua" className="hover:text-emerald-200 transition">Orang Tua</Link>
          <Link href="/ustadz" className="hover:text-emerald-200 transition">Ustadz / Guru</Link>
          <Link href="/admin" className="hover:text-emerald-200 transition">Mudir / Admin</Link>
          <button
            onClick={handleLogout}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-1.5 rounded-lg transition font-semibold shadow"
          >
            🚪 Logout / Keluar
          </button>
        </nav>
      </div>
    </header>
  );
}
