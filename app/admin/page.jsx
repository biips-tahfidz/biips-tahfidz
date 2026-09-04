'use client';

import { useState, useEffect } from 'react';
import { supabase, DEFAULT_USERS, DEFAULT_SETORAN } from '@/lib/supabase';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [setoranList, setSetoranList] = useState([]);
  const [selectedClassFilter, setSelectedClassFilter] = useState('semua');
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('santri');
  const [kelas, setKelas] = useState('1');
  const [msg, setMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (!usersError && usersData && usersData.length > 0) {
        setUsers(usersData);
      } else {
        setUsers(DEFAULT_USERS);
      }

      let localSetoran = DEFAULT_SETORAN;
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('biips_setoran');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              localSetoran = parsed;
            }
          }
        } catch (err) {
          console.error('Error reading biips_setoran:', err);
        }
      }

      const { data: setoranData, error: setoranError } = await supabase
        .from('setoran')
        .select('*')
        .order('created_at', { ascending: false });

      if (!setoranError && setoranData) {
        const dbIds = new Set(setoranData.map(s => s.id));
        const localOnly = localSetoran.filter(s => !dbIds.has(s.id));
        const merged = [...setoranData, ...localOnly];
        setSetoranList(merged);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('biips_setoran', JSON.stringify(merged));
          } catch (e) {
            console.warn('localStorage quota exceeded:', e);
          }
        }
      } else {
        setSetoranList(localSetoran);
      }
    } catch (e) {
      console.error('Error fetching admin data from Supabase:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
      const newUser = {
        username,
        password,
        role,
        kelas
      };

      const { data, error } = await supabase
        .from('users')
        .insert([newUser])
        .select();

      if (error) {
        console.warn('Supabase DB user insert error:', error.message);
        setUsers(prev => [newUser, ...prev]);
        setMsg('Pengguna disimpan secara lokal!');
      } else {
        setMsg('Pengguna berhasil ditambahkan ke Supabase!');
        fetchData();
      }

      setUsername('');
      setPassword('');
    } catch (err) {
      setMsg(err.message || 'Gagal menambahkan pengguna.');
    }
  };

  const handleDeleteSetoran = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data setoran ini?')) return;
    try {
      const { error } = await supabase
        .from('setoran')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Error deleting from Supabase:', error.message);
      }

      const updated = setoranList.filter(s => s.id !== id);
      setSetoranList(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('biips_setoran', JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Error in handleDeleteSetoran:', err);
    }
  };

  const filteredUsers = users.filter(u => {
    if (selectedClassFilter === 'semua') return true;
    const cleanUserClass = (u.kelas || '').toString().toUpperCase().replace('KELAS', '').trim();
    const cleanFilterClass = selectedClassFilter.toUpperCase().replace('KELAS', '').trim();
    return cleanUserClass === cleanFilterClass;
  });

  const filteredSetoran = setoranList.filter(s => {
    if (selectedClassFilter === 'semua') return true;
    const cleanSetoranClass = (s.kelas || '').toString().toUpperCase().replace('KELAS', '').trim();
    const cleanFilterClass = selectedClassFilter.toUpperCase().replace('KELAS', '').trim();
    return cleanSetoranClass === cleanFilterClass;
  });

  const pendingSetoran = filteredSetoran.filter(s => s.status !== 'dinilai');
  const evaluatedSetoran = filteredSetoran.filter(s => s.status === 'dinilai');

  const generateClassWaReportUrl = () => {
    const totalSantri = filteredUsers.filter(u => u.role === 'santri').length;
    const totalSetoran = filteredSetoran.length;

    let text = `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\n` +
      `📋 *Laporan Rekapitulasi Hafalan BIIPS*\n` +
      `🏫 *Filter Kelas:* ${selectedClassFilter === 'semua' ? 'Semua Kelas' : 'Kelas ' + selectedClassFilter}\n` +
      `👥 *Total Santri Terdaftar:* ${totalSantri} Santri\n` +
      `📖 *Total Audio Setoran Masuk:* ${totalSetoran} Setoran\n\n` +
      `Alhamdulillah, program hafalan Al-Qur'an BIIPS berjalan lancar. Barokallahu Fiikum.\n` +
      `- *Mudir / Pengelola Tahfidz BIIPS*`;

    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard Mudir / Admin</h2>
          <p className="text-slate-500 text-sm">Kelola akun pengguna, pantau seluruh setoran hafalan siswa, serta rekapitulasi pengiriman laporan progress via WhatsApp.</p>
        </div>
        <div className="flex items-center space-x-3">
          <a
            href={generateClassWaReportUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow flex items-center space-x-1"
          >
            <span>📲 Kirim Rekap Kelas WA</span>
          </a>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold uppercase">
            Role Mudir
          </span>
        </div>
      </div>

      {/* Filter Kelas Utama */}
      <div className="bg-white p-4 rounded-xl shadow border border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-bold text-slate-800 text-sm">Filter Monitoring Keseluruhan</h3>
        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-600">Filter Kelas:</label>
          <select
            className="border rounded-lg p-2 text-xs font-medium focus:ring-2 focus:ring-purple-500"
            value={selectedClassFilter}
            onChange={e => setSelectedClassFilter(e.target.value)}
          >
            <option value="semua">Semua Kelas</option>
            <option value="1">Kelas 1</option>
            <option value="2">Kelas 2</option>
            <option value="3">Kelas 3</option>
          </select>
        </div>
      </div>

      {/* Section Monitoring Setoran Hafalan */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-xl font-bold text-slate-800">
            📊 Rekapitulasi Setoran Hafalan ({filteredSetoran.length})
          </h3>
          <span className="text-xs text-slate-500">
            Menunggu: <strong className="text-amber-600">{pendingSetoran.length}</strong> | Selesai: <strong className="text-emerald-600">{evaluatedSetoran.length}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daftar Menunggu Penilaian */}
          <div className="bg-white p-6 rounded-xl shadow border border-amber-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="font-bold text-amber-800 text-base flex items-center gap-2">
                ⏳ Menunggu Penilaian ({pendingSetoran.length})
              </h4>
            </div>

            {pendingSetoran.length === 0 ? (
              <p className="text-slate-400 text-center py-6 text-xs">Tidak ada setoran yang belum dinilai.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {pendingSetoran.map(item => (
                  <div key={item.id} className="border border-amber-100 rounded-lg p-3 bg-amber-50/40 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-800 text-sm">{item.santri_name}</span>
                        <span className="text-xs text-slate-500 ml-2">(Kelas {item.kelas})</span>
                        <p className="text-xs font-semibold text-emerald-700 mt-0.5">Surah {item.surah} (Ayat {item.ayat})</p>
                      </div>
                      <button
                        onClick={() => handleDeleteSetoran(item.id)}
                        className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 px-2 py-0.5 rounded border border-rose-200 transition"
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                    {item.audio_url && (
                      <audio controls src={item.audio_url} className="w-full h-8" />
                    )}
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>{new Date(item.created_at || Date.now()).toLocaleString('id-ID')}</span>
                      <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Pending</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Daftar Sudah Dinilai */}
          <div className="bg-white p-6 rounded-xl shadow border border-emerald-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="font-bold text-emerald-800 text-base flex items-center gap-2">
                ✅ Sudah Dinilai ({evaluatedSetoran.length})
              </h4>
            </div>

            {evaluatedSetoran.length === 0 ? (
              <p className="text-slate-400 text-center py-6 text-xs">Belum ada setoran yang sudah dinilai.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {evaluatedSetoran.map(item => (
                  <div key={item.id} className="border border-emerald-100 rounded-lg p-3 bg-emerald-50/40 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-800 text-sm">{item.santri_name}</span>
                        <span className="text-xs text-slate-500 ml-2">(Kelas {item.kelas})</span>
                        <p className="text-xs font-semibold text-emerald-700 mt-0.5">Surah {item.surah} (Ayat {item.ayat})</p>
                      </div>
                      <button
                        onClick={() => handleDeleteSetoran(item.id)}
                        className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 px-2 py-0.5 rounded border border-rose-200 transition"
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                    {item.audio_url && (
                      <audio controls src={item.audio_url} className="w-full h-8" />
                    )}
                    <div className="bg-white p-2.5 rounded border border-slate-200 text-xs space-y-1">
                      <p><span className="font-semibold text-slate-700">Tajwid:</span> {item.nilai_tajwid} | <span className="font-semibold text-slate-700">Kelancaran:</span> {item.nilai_kelancaran}</p>
                      <p><span className="font-semibold text-slate-700">Pengampu:</span> {item.ustadz_name || 'Ustadz'}</p>
                      {item.catatan_ustadz && <p className="italic text-slate-600">"{item.catatan_ustadz}"</p>}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      <span>{new Date(item.created_at || Date.now()).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        <div className="bg-white p-6 rounded-xl shadow border border-slate-100 h-fit space-y-4">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Tambah Pengguna Baru</h3>
          {msg && (
            <div className={`p-3 rounded text-sm ${msg.includes('berhasil') || msg.includes('lokal') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              {msg}
            </div>
          )}
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Username</label>
              <input
                type="text"
                required
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-purple-500"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-purple-500"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Role</label>
              <select
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-purple-500"
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option value="santri">Santri</option>
                <option value="guru">Guru / Ustadz</option>
                <option value="orangtua">Orang Tua</option>
                <option value="mudir">Mudir</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Kelas</label>
              <select
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-purple-500"
                value={kelas}
                onChange={e => setKelas(e.target.value)}
              >
                <option value="1">Kelas 1</option>
                <option value="2">Kelas 2</option>
                <option value="3">Kelas 3</option>
                <option value="semua">Semua Kelas</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white font-medium py-2.5 rounded-lg hover:bg-purple-700 transition"
            >
              Simpan Pengguna
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow border border-slate-100 space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-lg font-bold text-slate-800">Daftar Pengguna ({filteredUsers.length})</h3>
          </div>

          {loading ? (
            <p className="text-slate-500 text-center py-4 text-sm">Memuat data...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
                  <tr>
                    <th className="p-3">Username</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Kelas</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map((u, idx) => (
                    <tr key={u.id || idx} className="hover:bg-slate-50">
                      <td className="p-3 font-medium text-slate-800">{u.username}</td>
                      <td className="p-3">
                        <span className="capitalize text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{u.kelas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
