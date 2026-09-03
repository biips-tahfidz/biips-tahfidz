-- ==========================================
-- SEED DATA SETORAN TAHFIDZ BIIPS
-- Untuk Pengujian Kelas 1, Kelas 2, dan Kelas 3
-- ==========================================

INSERT INTO setoran (santri_name, kelas, surah, ayat, audio_url, status, created_at)
VALUES
('aisyahkarangjati', '1', 'An-Nas', '1-6', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'pending', NOW() - INTERVAL '2 hours'),
('salman', '1', 'Al-Falaq', '1-5', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'dinilai', NOW() - INTERVAL '1 day'),
('muhammad', '1', 'Al-Ikhlas', '1-4', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 'pending', NOW() - INTERVAL '3 hours'),
('fatimah', '1', 'Al-Masad', '1-5', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 'dinilai', NOW() - INTERVAL '2 days'),
('hafshoh', '2', 'Al-Ala', '1-19', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 'pending', NOW() - INTERVAL '1 hour'),
('alwi', '2', 'At-Tariq', '1-17', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 'dinilai', NOW() - INTERVAL '2 days'),
('faqih', '3', 'An-Naba', '1-20', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', 'pending', NOW() - INTERVAL '30 minutes'),
('abdullah', '3', 'An-Naziat', '1-46', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 'dinilai', NOW() - INTERVAL '3 days');

UPDATE setoran
SET nilai_tajwid = 'A', nilai_kelancaran = 'A', catatan_ustadz = 'Mumtaz! Hafalan lancar dan fasih.', ustadz_name = 'ratih'
WHERE santri_name = 'salman';

UPDATE setoran
SET nilai_tajwid = 'A-', nilai_kelancaran = 'A', catatan_ustadz = 'Alhamdulillah bacaan sangat baik.', ustadz_name = 'ratih'
WHERE santri_name = 'fatimah';

UPDATE setoran
SET nilai_tajwid = 'B+', nilai_kelancaran = 'A', catatan_ustadz = 'Bagus, perhatikan panjang pendek bacaan.', ustadz_name = 'hijri'
WHERE santri_name = 'alwi';

UPDATE setoran
SET nilai_tajwid = 'A', nilai_kelancaran = 'A', catatan_ustadz = 'Barakallahu fiik, hafalan sangat lancar.', ustadz_name = 'hanifah'
WHERE santri_name = 'abdullah';
