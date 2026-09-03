'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase, DEFAULT_USERS, DEFAULT_SETORAN } from '@/lib/supabase';

export default function SantriDashboard() {
  const [santriList, setSantriList] = useState([]);
  const [selectedSantri, setSelectedSantri] = useState('');
  const [kelas, setKelas] = useState('1');
  const [surah, setSurah] = useState('');
  const [ayat, setAyat] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);

  const [setoranHistory, setSetoranHistory] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const fetchData = async () => {
    let santris = DEFAULT_USERS.filter(u => u.role === 'santri');
    try {
      // 1. Fetch Users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*');

      if (!usersError && usersData && usersData.length > 0) {
        const fetchedSantris = usersData.filter(u => u.role === 'santri');
        if (fetchedSantris.length > 0) {
          santris = fetchedSantris;
        }
      }
    } catch (e) {
      console.error('Error fetching users from Supabase:', e);
    }

    setSantriList(santris);

    let loggedUser = null;
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('biips_user');
        if (savedUser) loggedUser = JSON.parse(savedUser);
      } catch (err) {
        console.error('Error reading biips_user:', err);
      }
    }

    setSelectedSantri(prev => {
      if (prev) return prev;
      if (loggedUser && loggedUser.username) {
        const found = santris.find(s => s.username.toLowerCase() === loggedUser.username.toLowerCase());
        if (found) {
          setKelas(found.kelas || '1');
          return found.username;
        }
        setKelas(loggedUser.kelas || '1');
        return loggedUser.username;
      }
      if (santris.length > 0) {
        setKelas(santris[0].kelas || '1');
        return santris[0].username;
      }
      return prev;
    });

    // 2. Fetch Setoran History with localStorage & DEFAULT_SETORAN persistence
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

    try {
      const { data: setoranData, error: setoranError } = await supabase
        .from('setoran')
        .select('*')
        .order('created_at', { ascending: false });

      if (!setoranError && setoranData) {
        const dbIds = new Set(setoranData.map(s => s.id));
        const localOnly = localSetoran.filter(s => !dbIds.has(s.id));
        const merged = [...setoranData, ...localOnly];
        setSetoranHistory(merged);
        if (typeof window !== 'undefined') {
          localStorage.setItem('biips_setoran', JSON.stringify(merged));
        }
      } else {
        setSetoranHistory(localSetoran);
      }
    } catch (e) {
      console.error('Error fetching setoran from Supabase:', e);
      setSetoranHistory(localSetoran);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSantriChange = (e) => {
    const val = e.target.value;
    setSelectedSantri(val);
    const found = santriList.find(s => s.username === val);
    if (found) {
      setKelas(found.kelas || '1');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      setRecordedBlob(null);
      setAudioPreviewUrl(URL.createObjectURL(file));
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        setAudioFile(null);
        setAudioPreviewUrl(URL.createObjectURL(blob));
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert('Tidak dapat mengakses mikrofon: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!surah || !ayat) {
      alert('Surah dan ayat wajib diisi.');
      return;
    }

    if (!audioFile && !recordedBlob) {
      alert('Pilih file audio atau rekam audio hafalan terlebih dahulu.');
      return;
    }

    setUploading(true);
    setMsg('');

    try {
      let audioUrl = '';
      const fileToUpload = recordedBlob
        ? new File([recordedBlob], `setoran-${Date.now()}.webm`, { type: 'audio/webm' })
        : audioFile;

      const fileName = `${Date.now()}-${fileToUpload.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      // Upload directly to Supabase Storage bucket 'audio-setoran'
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('audio-setoran')
        .upload(fileName, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.warn('Direct upload error to Supabase Storage bucket:', uploadError.message);
        // Convert audio file to Base64 data URL so audio is saved in DB and accessible across devices/users
        audioUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => resolve(audioPreviewUrl || '');
          reader.readAsDataURL(fileToUpload);
        });
      } else {
        const { data: publicUrlData } = supabase
          .storage
          .from('audio-setoran')
          .getPublicUrl(fileName);

        audioUrl = publicUrlData?.publicUrl || audioUrl;
      }

      // Find matching santri user to set santri_id if available
      const foundSantri = santriList.find(s => s.username === selectedSantri);

      // Insert record to Supabase DB table 'setoran'
      const newRecord = {
        santri_name: selectedSantri || 'Anonim',
        kelas: kelas,
        surah: surah,
        ayat: ayat,
        audio_url: audioUrl,
        status: 'pending'
      };

      if (foundSantri && foundSantri.id) {
        newRecord.santri_id = foundSantri.id;
      }

      const recordToSave = {
        ...newRecord,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };

      const { data: insertedData, error: dbError } = await supabase
        .from('setoran')
        .insert([newRecord])
        .select();

      const savedItem = (insertedData && insertedData.length > 0) ? insertedData[0] : recordToSave;

      if (dbError) {
        console.warn('DB insert error:', dbError.message);
        setMsg('Setoran disimpan di memori HP/Browser ini. Catatan: Supabase DB belum terhubung. Harap pastikan NEXT_PUBLIC_SUPABASE_URL & ANON_KEY sudah disetting di .env.local / GitHub Secrets.');
      } else {
        setMsg('Alhamdulillah, setoran hafalan berhasil dikirim dan tersimpan di database!');
      }

      setSetoranHistory(prev => {
        const updated = [savedItem, ...prev.filter(item => item.id !== savedItem.id)];
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('biips_setoran', JSON.stringify(updated));
          } catch (e) {
            console.warn('localStorage quota exceeded:', e);
          }
        }
        return updated;
      });
      setSurah('');
      setAyat('');
      setAudioFile(null);
      setRecordedBlob(null);
      setAudioPreviewUrl('');
    } catch (err) {
      setMsg(err.message || 'Terjadi kesalahan saat mengirim setoran.');
    } finally {
      setUploading(false);
    }
  };

  const myHistory = setoranHistory.filter(s => s.santri_name === selectedSantri);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow border border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Portal Setoran Santri</h2>
          <p className="text-slate-500 text-sm">Rekam atau upload audio hafalan Al-Qur'an langsung ke Supabase Storage & Database.</p>
        </div>
        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold uppercase">
          Role Santri
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow border border-slate-100 h-fit space-y-4">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Kirim Setoran Hafalan</h3>

          {msg && (
            <div className={`p-3 rounded text-sm ${msg.includes('berhasil') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Pilih Santri</label>
              <select
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                value={selectedSantri}
                onChange={handleSantriChange}
              >
                {santriList.map((s, idx) => (
                  <option key={s.id || idx} value={s.username}>
                    {s.username} (Kelas {s.kelas})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Surah</label>
                <input
                  type="text"
                  placeholder="Misal: An-Naba"
                  required
                  className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                  value={surah}
                  onChange={e => setSurah(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Ayat</label>
                <input
                  type="text"
                  placeholder="Misal: 1-10"
                  required
                  className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                  value={ayat}
                  onChange={e => setAyat(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-slate-600">Media Audio Setoran</label>

              <div className="flex space-x-2">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="flex-1 bg-rose-600 text-white text-xs font-medium py-2 rounded-lg hover:bg-rose-700 transition flex items-center justify-center space-x-1"
                  >
                    <span>🔴 Rekam Suara</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="flex-1 bg-amber-600 text-white text-xs font-medium py-2 rounded-lg hover:bg-amber-700 transition flex items-center justify-center space-x-1 animate-pulse"
                  >
                    <span>⏹️ Hentikan Rekaman</span>
                  </button>
                )}
              </div>

              <div className="text-center text-xs text-slate-400 font-medium">-- ATAU --</div>

              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
            </div>

            {audioPreviewUrl && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="text-xs font-semibold text-slate-600">Preview Audio Setoran:</span>
                <audio controls src={audioPreviewUrl} className="w-full h-8" />
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-emerald-600 text-white font-medium py-2.5 rounded-lg hover:bg-emerald-700 transition shadow"
            >
              {uploading ? 'Mengunggah & Menyimpan...' : 'Kirim Setoran Hafalan'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow border border-slate-100 space-y-4">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-4">Riwayat Setoran Saya ({myHistory.length})</h3>

          {myHistory.length === 0 ? (
            <p className="text-slate-400 text-center py-8 text-sm">Belum ada riwayat setoran hafalan.</p>
          ) : (
            <div className="space-y-4">
              {myHistory.map((item) => (
                <div key={item.id} className="border rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800">Surah {item.surah} (Ayat {item.ayat})</h4>
                      <p className="text-xs text-slate-500">{new Date(item.created_at || Date.now()).toLocaleString('id-ID')}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${item.status === 'dinilai' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {item.status === 'dinilai' ? 'Sudah Dinilai' : 'Menunggu Penilaian'}
                    </span>
                  </div>

                  {item.audio_url && (
                    <audio controls src={item.audio_url} className="w-full h-8" />
                  )}

                  {item.status === 'dinilai' && (
                    <div className="bg-white p-3 rounded-lg border text-xs space-y-1">
                      <p><span className="font-semibold text-slate-700">Nilai Tajwid:</span> {item.nilai_tajwid} | <span className="font-semibold text-slate-700">Kelancaran:</span> {item.nilai_kelancaran}</p>
                      <p><span className="font-semibold text-slate-700">Pengampu:</span> {item.ustadz_name || 'Ustadz'}</p>
                      {item.catatan_ustadz && <p className="italic text-slate-600">"{item.catatan_ustadz}"</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
