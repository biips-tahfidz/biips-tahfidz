'use client';

export default function HomePage() {
  const roleNavigations = {
    santri: { title: 'Portal Santri', desc: 'Rekam atau unggah audio setoran hafalan surah & ayat Anda.', link: '/santri', color: 'bg-emerald-600' },
    orangtua: { title: 'Portal Orang Tua', desc: 'Dampingi anak menyetorkan audio hafalan dan pantau hasil evaluasi.', link: '/orangtua', color: 'bg-teal-600' },
    ustadz: { title: 'Portal Ustadz / Guru', desc: 'Periksa setoran hafalan santri binaan dan berikan penilaian.', link: '/ustadz', color: 'bg-indigo-600' },
    admin: { title: 'Portal Mudir / Admin', desc: 'Kelola data pengguna, buat akun baru, dan lihat rekapitulasi hafalan.', link: '/admin', color: 'bg-purple-600' }
  };

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-extrabold mb-3">Selamat Datang di Aplikasi Setoran Hafalan BIIPS</h2>
        <p className="text-emerald-50 max-w-2xl text-lg">
          Platform digital setoran tahfidz statis untuk santri Bina Ilmu Islamic Primary School (BIIPS) terintegrasi Supabase Database & File Storage.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(roleNavigations).map(([key, item]) => (
          <div key={key} className="bg-white rounded-xl shadow border border-slate-100 p-6 flex flex-col justify-between hover:shadow-md transition">
            <div>
              <span className={`inline-block text-xs font-semibold uppercase px-2.5 py-1 rounded text-white ${item.color} mb-3`}>
                Role {key}
              </span>
              <h3 className="text-xl font-bold mb-2 text-slate-800">{item.title}</h3>
              <p className="text-slate-600 text-sm mb-6">{item.desc}</p>
            </div>
            <a
              href={item.link}
              className={`w-full py-2.5 text-center text-white font-medium rounded-lg shadow hover:opacity-90 transition ${item.color}`}
            >
              Masuk Portal
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
