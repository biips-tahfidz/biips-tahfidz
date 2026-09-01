'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, DEFAULT_USERS, getCurrentUser, setCurrentUser } from '@/lib/supabase';

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect them to their portal
    const user = getCurrentUser();
    if (user && user.role) {
      const userRole = user.role.toLowerCase();
      if (userRole === 'santri') {
        router.push('/santri');
      } else if (userRole === 'guru' || userRole === 'ustadz') {
        router.push('/ustadz');
      } else if (userRole === 'mudir' || userRole === 'admin') {
        router.push('/admin');
      } else if (userRole === 'orangtua') {
        router.push('/orangtua');
      }
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      let matchedUser = null;

      // 1. Check Supabase DB for user
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.trim())
        .single();

      if (!error && data) {
        if (data.password === password) {
          matchedUser = data;
        }
      }

      // 2. Fallback to DEFAULT_USERS if not found or DB inactive
      if (!matchedUser) {
        const foundDefault = DEFAULT_USERS.find(
          u => u.username.toLowerCase() === username.trim().toLowerCase()
        );
        if (foundDefault) {
          matchedUser = foundDefault;
        }
      }

      if (!matchedUser) {
        setErrorMsg('Username atau password tidak ditemukan/salah.');
        setLoading(false);
        return;
      }

      // 3. Save session
      setCurrentUser(matchedUser);

      // 4. Redirect strictly according to role
      const userRole = (matchedUser.role || '').toLowerCase();

      if (userRole === 'santri') {
        router.push('/santri');
      } else if (userRole === 'guru' || userRole === 'ustadz') {
        router.push('/ustadz');
      } else if (userRole === 'mudir' || userRole === 'admin') {
        router.push('/admin');
      } else if (userRole === 'orangtua') {
        router.push('/orangtua');
      } else {
        setErrorMsg('Akses ditolak: Role Anda tidak diizinkan masuk.');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan saat memproses login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 flex flex-col items-center">
        {/* Top Logo */}
        <div className="mb-4">
          <img
            src="/logo biips.jpg"
            alt="Logo BIIPS"
            className="w-24 h-24 rounded-full object-cover shadow-md ring-4 ring-emerald-50"
          />
        </div>

        {/* Title and Subtitle */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 text-center tracking-tight mb-2">
          Tahfidz BIIPS
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 text-center max-w-xs mb-8">
          Monitoring setoran hafalan Al-Qur'an Bina Ilmu Islamic Primary School.
        </p>

        {/* Error Alert */}
        {errorMsg && (
          <div className="w-full bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs sm:text-sm mb-6 flex items-center space-x-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Username atau Email
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan username Anda..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
            </div>
            <input
              type="password"
              required
              placeholder="Password..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {loading ? (
              <span>Memeriksa Akun...</span>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Masuk ke Portal</span>
              </>
            )}
          </button>
        </form>

        {/* Footer info inside card */}
        <div className="mt-8 pt-6 border-t border-slate-100 w-full text-center">
          <p className="text-xs text-slate-400">
            Akses dibatasi untuk role <span className="font-semibold text-slate-600">Santri</span>, <span className="font-semibold text-slate-600">Guru</span>, <span className="font-semibold text-slate-600">Orang Tua</span>, dan <span className="font-semibold text-slate-600">Mudir</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
