-- Create storage bucket for audio setoran if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-setoran', 'audio-setoran', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies for public uploads and downloads
CREATE POLICY "Public Read Audio Setoran"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio-setoran');

CREATE POLICY "Public Insert Audio Setoran"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'audio-setoran');

CREATE POLICY "Public Update Audio Setoran"
ON storage.objects FOR UPDATE
USING (bucket_id = 'audio-setoran');

CREATE POLICY "Public Delete Audio Setoran"
ON storage.objects FOR DELETE
USING (bucket_id = 'audio-setoran');
