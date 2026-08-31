'use client';

import { useState, useEffect, useRef } from 'react';

export default function OrangTuaDashboard() {
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
    try {
      const uRes = await fetch('/api/users');
      const uData = await uRes.json();
      const santris = uData.filter(u => u.role === 'santri');
      setSantriList(santris);
      if (santris.length > 0 && !selectedSantri) {
        setSelectedSantri(santris[0].username);
        setKelas(santris[0].kelas || '1');
      }

      const sRes = await fetch('/api/setoran');
      const sData = await sRes.json();
      setSetoranHistory(sData);
    } catch (e) {
      console.error(e);
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
      const formData = new FormData();
      if (recordedBlob) {
        formData.append('audio', recordedBlob, `setoran-${Date.now()}.webm`);
      } else if (audioFile) {
        formData.append('audio', audioFile);
      }

      const uploadRes = await fetch('/api/upload-vercel', {
        method: 'POST',
        body: formData
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.error || 'Gagal mengunggah audio ke server.');
      }

      const setoranRes = await fetch('/api/setoran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          santri_name: selectedSantri || 'Anonim',
          kelas: kelas,
          surah: surah,
          ayat: ayat,
          audio_url: uploadData.url
        })
      });

      if (setoranRes.ok) {
        setMsg('Alhamdulillah, setoran hafalan putra/putri berhasil dikirim!');
        setSurah('');
        setAyat('');
        setAudioFile(null);
        setRecordedBlob(null);
        setAudioPreviewUrl('');
        fetchData();
      } else {
        const errData = await setoranRes.json();
        throw new Error(errData.error || 'Gagal menyimpan data setoran.');
      }
    } catch (err) {
      setMsg(err.message);
    } finally {
      setUploading(false);
    }
  };

  const myChildHistory = setoranHistory.filter(s => s.santri_name === selectedSantri);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow border border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Portal Orang Tua Santri</h2>
          <p className="text-slate-500 text-sm">Bantu rekam setoran anak dan pantau catatan serta nilai dari Ustadz/Ustadzah.</p>
        </div>
        <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-semibold uppercase">
          Role Orang Tua
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow border border-slate-100 h-fit space-y-4">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Kirim Setoran Hafalan Anak</h3>

          {msg && (
            <div className={`p-3 rounded text-sm ${msg.includes('berhasil') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Pilih Nama Anak (Santri)</label>
              <select
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-teal-500"
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
                  className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-teal-500"
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
                  className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-teal-500"
                  value={ayat}
                  onChange={e => setAyat(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-slate-600">Media Rekaman / Audio</label>

              <div className="flex space-x-2">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="flex-1 bg-rose-600 text-white text-xs font-medium py-2 rounded-lg hover:bg-rose-700 transition flex items-center justify-center space-x-1"
                  >
                    <span>🔴 Rekam Hafalan</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="flex-1 bg-amber-600 text-white text-xs font-medium py-2 rounded-lg hover:bg-amber-700 transition flex items-center justify-center space-x-1 animate-pulse"
                  >
                    <span>⏹️ Selesai Rekam</span>
                  </button>
                )}
              </div>

              <div className="text-center text-xs text-slate-400 font-medium">-- ATAU --</div>

              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
            </div>

            {audioPreviewUrl && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="text-xs font-semibold text-slate-600">Preview Rekaman Audio:</span>
                <audio controls src={audioPreviewUrl} className="w-full h-8" />
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-teal-600 text-white font-medium py-2.5 rounded-lg hover:bg-teal-700 transition shadow"
            >
              {uploading ? 'Mengunggah Data...' : 'Kirim Setoran Anak'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow border border-slate-100 space-y-4">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-4">Progres & Evaluasi Hafalan Anak ({myChildHistory.length})</h3>

          {myChildHistory.length === 0 ? (
            <p className="text-slate-400 text-center py-8 text-sm">Belum ada riwayat setoran hafalan untuk anak ini.</p>
          ) : (
            <div className="space-y-4">
              {myChildHistory.map((item) => (
                <div key={item.id} className="border rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800">Surah {item.surah} (Ayat {item.ayat})</h4>
                      <p className="text-xs text-slate-500">{new Date(item.created_at).toLocaleString('id-ID')}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${item.status === 'dinilai' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {item.status === 'dinilai' ? 'Telah Dievaluasi' : 'Dalam Antrean'}
                    </span>
                  </div>

                  {item.audio_url && (
                    <audio controls src={item.audio_url} className="w-full h-8" />
                  )}

                  {item.status === 'dinilai' && (
                    <div className="bg-teal-50/60 p-3 rounded-lg border border-teal-100 text-xs space-y-1 text-teal-900">
                      <p><span className="font-bold">Nilai Tajwid:</span> {item.nilai_tajwid} | <span className="font-bold">Kelancaran:</span> {item.nilai_kelancaran}</p>
                      <p><span className="font-bold">Ustadz Penilai:</span> {item.ustadz_name || 'Ustadz'}</p>
                      {item.catatan_ustadz && <p className="italic">"{item.catatan_ustadz}"</p>}
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
