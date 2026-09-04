'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { logoutUser } from '@/lib/supabase';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      if (typeof window !== 'undefined') {
        const savedUser = localStorage.getItem('biips_user');
        setIsLoggedIn(Boolean(savedUser) && pathname !== '/');
      }
    };
    checkUser();
  }, [pathname]);

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <header className="bg-emerald-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-3">
          <img
            src="/logo biips.jpg"
            alt="Logo BIIPS"
            className="w-12 h-12 rounded-full object-contain bg-white p-0.5 shadow-md border border-amber-300/40"
          />
          <div>
            <h1 className="text-xl font-bold tracking-wide">Tahfidz BIIPS</h1>
            <p className="text-xs text-emerald-100">Bina Ilmu Islamic Primary School</p>
          </div>
        </div>
        <nav className="flex items-center space-x-4 text-sm font-medium mt-2 sm:mt-0">
          <Link href="/" className="hover:text-emerald-200 transition">Beranda</Link>
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-1.5 rounded-lg transition font-semibold shadow"
            >
              🚪 Logout / Keluar
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
