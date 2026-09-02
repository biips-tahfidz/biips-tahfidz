-- ==========================================
-- SEED DATA SETORAN TAHFIDZ BIIPS
-- Untuk Pengujian Kelas 1, Kelas 2, dan Kelas 3
-- ==========================================

-- 1. KELAS 1: Santri fatimah
INSERT INTO setoran (santri_id, santri_name, kelas, surah, ayat, audio_url, status, created_at)
SELECT id, username, kelas, 'An-Nas', '1-6', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'pending', NOW() - INTERVAL '2 hours'
FROM users WHERE username = 'fatimah';

INSERT INTO setoran (santri_id, santri_name, kelas, surah, ayat, audio_url, status, nilai_tajwid, nilai_kelancaran, catatan_ustadz, ustadz_name, created_at)
SELECT id, username, kelas, 'Al-Ikhlas', '1-4', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'dinilai', 'A', 'A', 'Mumtaz! Hafalan sangat mulus dan tajwid sempurna.', 'ratih', NOW() - INTERVAL '1 day'
FROM users WHERE username = 'fatimah';

-- 2. KELAS 2: Santri hafshoh
INSERT INTO setoran (santri_id, santri_name, kelas, surah, ayat, audio_url, status, created_at)
SELECT id, username, kelas, 'Al-Ala', '1-19', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 'pending', NOW() - INTERVAL '1 hour'
FROM users WHERE username = 'hafshoh';

INSERT INTO setoran (santri_id, santri_name, kelas, surah, ayat, audio_url, status, nilai_tajwid, nilai_kelancaran, catatan_ustadz, ustadz_name, created_at)
SELECT id, username, kelas, 'At-Tariq', '1-17', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 'dinilai', 'B+', 'A', 'Sangat bagus, pertahankan kelancarannya.', 'hijri', NOW() - INTERVAL '2 days'
FROM users WHERE username = 'hafshoh';

-- 3. KELAS 3: Santri faqih
INSERT INTO setoran (santri_id, santri_name, kelas, surah, ayat, audio_url, status, created_at)
SELECT id, username, kelas, 'An-Naba', '1-20', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 'pending', NOW() - INTERVAL '30 minutes'
FROM users WHERE username = 'faqih';

INSERT INTO setoran (santri_id, santri_name, kelas, surah, ayat, audio_url, status, nilai_tajwid, nilai_kelancaran, catatan_ustadz, ustadz_name, created_at)
SELECT id, username, kelas, 'An-Naziat', '1-46', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 'dinilai', 'A', 'A', 'Alhamdulillah hafalan sangat luar biasa.', 'hanifah', NOW() - INTERVAL '3 days'
FROM users WHERE username = 'faqih';
