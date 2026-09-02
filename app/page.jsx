'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, DEFAULT_USERS } from '@/lib/supabase';

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

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

      // Store session user in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('biips_user', JSON.stringify(matchedUser));
      }

      // 3. Restrict role strictly to santri, guru, and mudir
      const userRole = (matchedUser.role || '').toLowerCase();

      if (userRole === 'santri') {
        router.push('/santri');
      } else if (userRole === 'guru' || userRole === 'ustadz') {
        router.push('/ustadz');
      } else if (userRole === 'mudir' || userRole === 'admin') {
        router.push('/admin');
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
    <div className="space-y-8 max-w-xl mx-auto">
      <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-8 text-white shadow-lg text-center">
        <h2 className="text-3xl font-extrabold mb-3">Login Setoran Hafalan BIIPS</h2>
        <p className="text-emerald-50 text-sm">
          Masukkan username dan password Anda untuk masuk ke portal hafalan sesuai role (Santri, Guru, atau Mudir).
        </p>
      </section>

      <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6 text-center border-b pb-4">Masuk ke Sistem</h3>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-sm mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Username</label>
            <input
              type="text"
              required
              placeholder="Masukkan username Anda..."
              className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="Masukkan password Anda..."
              className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white font-medium py-3 rounded-lg hover:bg-emerald-700 transition shadow"
          >
            {loading ? 'Memeriksa Data...' : 'Masuk / Login'}
          </button>
        </form>

        <div className="mt-6 text-xs text-slate-400 text-center border-t pt-4">
          Akses dibatasi untuk role <strong>Santri</strong>, <strong>Guru (Ustadz)</strong>, dan <strong>Mudir</strong>.
        </div>
      </div>
    </div>
  );
}
