let put;
try {
  const blobModule = await import('@vercel/blob');
  put = blobModule.put;
} catch (e) {
  put = null;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') || formData.get('audio');

    if (!file) {
      return Response.json({ error: 'File audio tidak ditemukan.' }, { status: 400 });
    }

    if (put && process.env.BLOB_READ_WRITE_TOKEN) {
      const filename = `setoran-${Date.now()}-${file.name || 'audio.webm'}`;
      const blob = await put(filename, file, { access: 'public' });
      return Response.json({ url: blob.url });
    }

    return Response.json({
      url: `https://fake-vercel-blob.storage.com/audio-${Date.now()}.webm`,
      message: 'Mock upload URL returned (BLOB_READ_WRITE_TOKEN not set)'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
