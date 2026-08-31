'use client';

import { useState } from 'react';

export default function AssessmentForm({ item, onSaved, onCancel }) {
  const [nilaiTajwid, setNilaiTajwid] = useState(item.nilai_tajwid || 'A');
  const [nilaiKelancaran, setNilaiKelancaran] = useState(item.nilai_kelancaran || 'A');
  const [catatan, setCatatan] = useState(item.catatan_ustadz || '');
  const [ustadzName, setUstadzName] = useState(item.ustadz_name || 'Ustadz Pengampu');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/setoran', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          nilai_tajwid: nilaiTajwid,
          nilai_kelancaran: nilaiKelancaran,
          catatan_ustadz: catatan,
          ustadz_name: ustadzName
        })
      });

      if (res.ok) {
        onSaved();
      } else {
        alert('Gagal menyimpan penilaian.');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-indigo-100 space-y-4">
      <div className="flex justify-between items-center border-b pb-3">
        <h3 className="text-lg font-bold text-slate-800">Form Penilaian Setoran</h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 text-sm">Batal</button>
      </div>

      <div className="bg-slate-50 p-3 rounded text-sm space-y-1">
        <p><span className="font-semibold text-slate-700">Santri:</span> {item.santri_name} (Kelas {item.kelas})</p>
        <p><span className="font-semibold text-slate-700">Hafalan:</span> Surah {item.surah} Ayat {item.ayat}</p>
        {item.audio_url && (
          <div className="pt-2">
            <audio controls src={item.audio_url} className="w-full h-8" />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Ustadz / Evaluator</label>
          <input
            type="text"
            required
            className="w-full border rounded-lg p-2 text-sm"
            value={ustadzName}
            onChange={e => setUstadzName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nilai Tajwid</label>
            <select
              className="w-full border rounded-lg p-2 text-sm"
              value={nilaiTajwid}
              onChange={e => setNilaiTajwid(e.target.value)}
            >
              <option value="A">A (Sangat Baik)</option>
              <option value="B">B (Baik)</option>
              <option value="C">C (Cukup)</option>
              <option value="D">D (Perlu Perbaikan)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nilai Kelancaran</label>
            <select
              className="w-full border rounded-lg p-2 text-sm"
              value={nilaiKelancaran}
              onChange={e => setNilaiKelancaran(e.target.value)}
            >
              <option value="A">A (Sangat Lancar)</option>
              <option value="B">B (Lancar)</option>
              <option value="C">C (Cukup Lancar)</option>
              <option value="D">D (Kurang Lancar)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Catatan Ustadz</label>
          <textarea
            rows="3"
            placeholder="Tambahkan catatan tajwid, makhorijul huruf, atau nasehat..."
            className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
            value={catatan}
            onChange={e => setCatatan(e.target.value)}
          />
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {submitting ? 'Menyimpan...' : 'Simpan Penilaian'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 bg-slate-100 text-slate-600 font-medium py-2 rounded-lg hover:bg-slate-200 transition"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
