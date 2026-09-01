'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, getCurrentUser, logoutUser } from '@/lib/supabase';

export default function OrangTuaDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUserSession] = useState(null);
  const [setoranList, setSetoranList] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/');
      return;
    }

    const role = (user.role || '').toLowerCase();
    if (role !== 'orangtua' && role !== 'mudir' && role !== 'admin') {
      alert('Akses Ditolak: Halaman ini khusus untuk Orang Tua Santri.');
      router.push('/');
      return;
    }

    setCurrentUserSession(user);
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('setoran')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setSetoranList(data);
      }
    } catch (e) {
      console.error('Error fetching setoran for parents from Supabase:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredList = setoranList.filter(item => {
    if (!searchName.trim()) return true;
    return (item.santri_name || '').toLowerCase().includes(searchName.toLowerCase().trim());
  });

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Portal Monitoring Orang Tua</h2>
          <p className="text-slate-500 text-sm">
            Selamat datang, <span className="font-semibold text-sky-700">{currentUser?.username || 'Orang Tua'}</span>! Pantau perkembangan hafalan, dengarkan rekaman audio, dan lihat nilai evaluasi ustadz.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-semibold uppercase">
            Role Orang Tua
          </span>
          <button
            onClick={logoutUser}
            className="bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-slate-100 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
          <h3 className="text-lg font-bold text-slate-800">Laporan Progress Hafalan Santri</h3>
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Cari nama santri..."
              className="w-full sm:w-64 border rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-sky-500"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p className="text-slate-500 text-center py-6 text-sm">Memuat data perkembangan...</p>
        ) : filteredList.length === 0 ? (
          <p className="text-slate-400 text-center py-6 text-sm">Data setoran tidak ditemukan.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredList.map((item) => (
              <div key={item.id} className="border rounded-xl p-5 bg-slate-50/50 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800">{item.santri_name} <span className="text-xs font-normal text-slate-500">(Kelas {item.kelas})</span></h4>
                    <p className="text-xs text-slate-600 font-medium">Surah <span className="text-sky-600 font-bold">{item.surah}</span> (Ayat {item.ayat})</p>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${item.status === 'dinilai' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {item.status === 'dinilai' ? 'Sudah Dinilai' : 'Menunggu Penilaian'}
                  </span>
                </div>

                {item.audio_url && (
                  <audio controls src={item.audio_url} className="w-full h-8" />
                )}

                {item.status === 'dinilai' ? (
                  <div className="bg-white p-3 rounded-lg border text-xs space-y-1">
                    <p><span className="font-semibold text-slate-700">Tajwid:</span> {item.nilai_tajwid} | <span className="font-semibold text-slate-700">Kelancaran:</span> {item.nilai_kelancaran}</p>
                    <p><span className="font-semibold text-slate-700">Pengampu:</span> {item.ustadz_name || 'Ustadz'}</p>
                    {item.catatan_ustadz && <p className="italic text-slate-600">"{item.catatan_ustadz}"</p>}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Setoran sedang diaudit oleh Ustadz pengampu.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
