'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, DEFAULT_USERS, getCurrentUser, logoutUser } from '@/lib/supabase';
import AssessmentForm from '../ustadz/form';

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUserSession] = useState(null);
  const [users, setUsers] = useState([]);
  const [setoranList, setSetoranList] = useState([]);
  const [selectedClassFilter, setSelectedClassFilter] = useState('semua');
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'evaluasi'
  const [activeItem, setActiveItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('santri');
  const [kelas, setKelas] = useState('1');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/');
      return;
    }

    const userRole = (user.role || '').toLowerCase();
    if (userRole !== 'mudir' && userRole !== 'admin') {
      alert('Akses Ditolak: Halaman ini khusus untuk Mudir / Kepala Sekolah.');
      router.push('/');
      return;
    }

    setCurrentUserSession(user);
    fetchData();
  }, [router]);

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

      const { data: setoranData, error: setoranError } = await supabase
        .from('setoran')
        .select('*')
        .order('created_at', { ascending: false });

      if (!setoranError && setoranData) {
        setSetoranList(setoranData);
      }
    } catch (e) {
      console.error('Error fetching admin data from Supabase:', e);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredUsers = users.filter(u => {
    if (selectedClassFilter === 'semua') return true;
    const cleanUserClass = (u.kelas || '').toString().toUpperCase().replace('KELAS', '').trim();
    const cleanFilterClass = selectedClassFilter.toUpperCase().replace('KELAS', '').trim();
    return cleanUserClass === cleanFilterClass;
  });

  const filteredSetoran = setoranList.filter(s => {
    if (selectedClassFilter === 'semua') return true;
    const cleanClass = (s.kelas || '').toString().toUpperCase().replace('KELAS', '').trim();
    return cleanClass === selectedClassFilter.toUpperCase().replace('KELAS', '').trim();
  });

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
          <p className="text-slate-500 text-sm">
            Selamat datang, <span className="font-semibold text-purple-700">{currentUser?.username || 'Mudir'}</span>! Kelola pengguna, evaluasi setoran guru, serta rekapitulasi laporan progress.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <a
            href={generateClassWaReportUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition shadow flex items-center space-x-1"
          >
            <span>📲 Kirim Rekap Kelas WA</span>
          </a>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold uppercase">
            Role Mudir
          </span>
          <button
            onClick={logoutUser}
            className="bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {activeItem && (
        <AssessmentForm
          item={activeItem}
          onSaved={() => {
            setActiveItem(null);
            fetchData();
          }}
          onCancel={() => setActiveItem(null)}
        />
      )}

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 font-semibold text-sm transition border-b-2 ${activeTab === 'users' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          👥 Kelola Pengguna & Akun
        </button>
        <button
          onClick={() => setActiveTab('evaluasi')}
          className={`pb-3 font-semibold text-sm transition border-b-2 ${activeTab === 'evaluasi' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          📖 Evaluasi Setoran & Role Guru ({filteredSetoran.length})
        </button>
      </div>

      {activeTab === 'users' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
              <h3 className="text-lg font-bold text-slate-800">Daftar Pengguna ({filteredUsers.length})</h3>
              <div className="flex items-center space-x-2">
                <label className="text-xs text-slate-500">Filter Kelas:</label>
                <select
                  className="border rounded-lg p-1.5 text-xs"
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
      ) : (
        <div className="bg-white p-6 rounded-xl shadow border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
            <h3 className="text-lg font-bold text-slate-800">Evaluasi & Pengawasan Setoran Santri</h3>
            <div className="flex items-center space-x-2">
              <label className="text-xs text-slate-500">Filter Kelas:</label>
              <select
                className="border rounded-lg p-1.5 text-xs"
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

          {filteredSetoran.length === 0 ? (
            <p className="text-slate-400 text-center py-6 text-sm">Belum ada data setoran hafalan.</p>
          ) : (
            <div className="space-y-4">
              {filteredSetoran.map((item) => (
                <div key={item.id} className="border rounded-xl p-5 hover:border-purple-200 transition bg-slate-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-slate-800 text-base">{item.santri_name}</span>
                      <span className="text-xs bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded">
                        Kelas {item.kelas}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${item.status === 'dinilai' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {item.status === 'dinilai' ? 'Sudah Dinilai' : 'Perlu Penilaian'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">
                      Surah <span className="text-purple-600 font-bold">{item.surah}</span> (Ayat {item.ayat})
                    </p>

                    {item.audio_url && (
                      <div className="pt-1 max-w-md">
                        <audio controls src={item.audio_url} className="w-full h-8" />
                      </div>
                    )}

                    {item.status === 'dinilai' && (
                      <div className="text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-100 mt-2 space-y-1">
                        <p><span className="font-bold">Evaluasi:</span> Tajwid ({item.nilai_tajwid || '-'}), Kelancaran ({item.nilai_kelancaran || '-'}) oleh {item.ustadz_name || 'Ustadz'}</p>
                        {item.catatan_ustadz && <p className="italic">"{item.catatan_ustadz}"</p>}
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      onClick={() => setActiveItem(item)}
                      className="bg-purple-600 text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-purple-700 transition shadow"
                    >
                      {item.status === 'dinilai' ? 'Edit Nilai' : 'Beri Nilai'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
