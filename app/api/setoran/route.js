import { getSetoran, addSetoran, updateSetoran } from '../lib/db.js';

export async function GET(request) {
  try {
    const list = await getSetoran();
    return Response.json(list);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { santri_id, santri_name, kelas, surah, ayat, audio_url } = body;

    if (!santri_name || !surah || !ayat || !audio_url) {
      return Response.json({ error: 'Nama santri, surah, ayat, dan audio_url wajib diisi.' }, { status: 400 });
    }

    const newItem = await addSetoran({
      santri_id,
      santri_name,
      kelas: kelas || '1',
      surah,
      ayat,
      audio_url,
      status: 'pending'
    });

    return Response.json(newItem, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, nilai_tajwid, nilai_kelancaran, catatan_ustadz, ustadz_name } = body;

    if (!id) {
      return Response.json({ error: 'ID setoran wajib dikirim.' }, { status: 400 });
    }

    const updated = await updateSetoran(id, {
      nilai_tajwid,
      nilai_kelancaran,
      catatan_ustadz,
      ustadz_name,
      status: 'dinilai'
    });

    if (!updated) {
      return Response.json({ error: 'Data setoran tidak ditemukan.' }, { status: 404 });
    }

    return Response.json(updated);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
