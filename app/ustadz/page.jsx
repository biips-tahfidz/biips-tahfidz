'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AssessmentForm from './form';
import { supabase, getCurrentUser, logoutUser } from '@/lib/supabase';

export default function UstadzDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUserSession] = useState(null);
  const [setoranList, setSetoranList] = useState([]);
  const [selectedClass, setSelectedClass] = useState('semua');
  const [activeItem, setActiveItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/');
      return;
    }

    const role = (user.role || '').toLowerCase();
    if (role !== 'guru' && role !== 'ustadz' && role !== 'mudir' && role !== 'admin') {
      alert('Akses Ditolak: Halaman ini khusus untuk Ustadz / Guru dan Mudir.');
      router.push('/');
      return;
    }

    setCurrentUserSession(user);
    fetchSetoran();
  }, [router]);

  const fetchSetoran = async () => {
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
      console.error('Error fetching setoran from Supabase:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredList = setoranList.filter(item => {
    if (selectedClass === 'semua') return true;
    const cleanItemClass = (item.kelas || '').toString().toUpperCase().replace('KELAS', '').trim();
    const cleanFilterClass = selectedClass.toUpperCase().replace('KELAS', '').trim();
    return cleanItemClass === cleanFilterClass;
  });

  // Calculate student statistics for progress bar & WhatsApp reporting
  const santriGroup = {};
  filteredList.forEach(item => {
    if (!santriGroup[item.santri_name]) {
      santriGroup[item.santri_name] = {
        name: item.santri_name,
        kelas: item.kelas,
        total: 0,
        dinilai: 0,
        items: []
      };
    }
    santriGroup[item.santri_name].total += 1;
    if (item.status === 'dinilai') santriGroup[item.santri_name].dinilai += 1;
    santriGroup[item.santri_name].items.push(item);
  });

  const generateWaReportUrl = (santriInfo) => {
    const totalSetoran = santriInfo.total;
    const dinilaiSetoran = santriInfo.dinilai;
    const persenProgress = Math.round((dinilaiSetoran / (totalSetoran || 1)) * 100);

    let detailText = `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nBerikut Laporan Progress Hafalan Santri BIIPS:\n` +
      `👤 *Nama Santri:* ${santriInfo.name}\n` +
      `🏫 *Kelas:* ${santriInfo.kelas}\n` +
      `📊 *Progress Evaluasi:* ${persenProgress}% (${dinilaiSetoran}/${totalSetoran} Setoran)\n\n` +
      `*Riwayat Setoran Hafalan:*\n`;

    santriInfo.items.forEach((s, idx) => {
      detailText += `${idx + 1}. Surah ${s.surah} (Ayat ${s.ayat}) - `;
      if (s.status === 'dinilai') {
        detailText += `Tajwid: ${s.nilai_tajwid || '-'}, Kelancaran: ${s.nilai_kelancaran || '-'}`;
        if (s.catatan_ustadz) detailText += ` (Catatan: "${s.catatan_ustadz}")`;
      } else {
        detailText += `[Belum Dievaluasi]`;
      }
      detailText += `\n`;
    });

    detailText += `\nJazakumullah Khairan.\n- *Ustadz ${currentUser?.username || 'Pengampu'} Tahfidz BIIPS*`;

    return `https://wa.me/?text=${encodeURIComponent(detailText)}`;
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard Ustadz / Pengampu Tahfidz</h2>
          <p className="text-slate-500 text-sm">
            Selamat datang, <span className="font-semibold text-indigo-700">Ustadz {currentUser?.username || ''}</span>! Dengarkan audio setoran, berikan penilaian, dan kirim progress hafalan ke WhatsApp Orang Tua.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold uppercase">
            Role Ustadz
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
            fetchSetoran();
          }}
          onCancel={() => setActiveItem(null)}
        />
      )}

      {/* Progress & WhatsApp Report Section */}
      <div className="bg-white p-6 rounded-xl shadow border border-indigo-100 space-y-4">
        <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center justify-between">
          <span>📊 Progress Perkembangan Santri</span>
          <span className="text-xs text-slate-500 font-normal">Kirim Laporan via WhatsApp</span>
        </h3>

        {Object.keys(santriGroup).length === 0 ? (
          <p className="text-slate-400 text-xs text-center py-2">Belum ada data perkembangan santri.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(santriGroup).map((sg) => {
              const progressPercent = Math.round((sg.dinilai / sg.total) * 100);
              return (
                <div key={sg.name} className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-sm text-slate-800">{sg.name}</span>
                      <span className="text-xs text-slate-500 ml-2">(Kelas {sg.kelas})</span>
                    </div>
                    <a
                      href={generateWaReportUrl(sg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-2.5 py-1 rounded-md transition flex items-center space-x-1"
                    >
                      <span>📲 Kirim WA Progress</span>
                    </a>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Perkembangan Evaluasi</span>
                      <span className="font-semibold">{progressPercent}% ({sg.dinilai}/{sg.total})</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-slate-100 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
          <h3 className="text-lg font-bold text-slate-800">Daftar Antrean Setoran Hafalan ({filteredList.length})</h3>
          <div className="flex items-center space-x-2">
            <label className="text-xs text-slate-500">Filter Kelas:</label>
            <select
              className="border rounded-lg p-1.5 text-xs focus:ring-2 focus:ring-indigo-500"
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
            >
              <option value="semua">Semua Kelas</option>
              <option value="1">Kelas 1</option>
              <option value="2">Kelas 2</option>
              <option value="3">Kelas 3</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-500 text-center py-6 text-sm">Memuat data setoran...</p>
        ) : filteredList.length === 0 ? (
          <p className="text-slate-400 text-center py-6 text-sm">Belum ada setoran hafalan yang dikirim.</p>
        ) : (
          <div className="space-y-4">
            {filteredList.map((item) => (
              <div key={item.id} className="border rounded-xl p-5 hover:border-indigo-200 transition bg-slate-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
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
                    Surah <span className="text-indigo-600 font-bold">{item.surah}</span> (Ayat {item.ayat})
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

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 self-start md:self-center">
                  <button
                    onClick={() => setActiveItem(item)}
                    className="bg-indigo-600 text-white font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition shadow"
                  >
                    {item.status === 'dinilai' ? 'Edit Nilai' : 'Beri Nilai'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
