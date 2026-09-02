-- ==========================================
-- SEED DATA SETORAN TAHFIDZ BIIPS
-- Untuk Pengujian Kelas 1, Kelas 2, dan Kelas 3
-- ==========================================

-- 1. SETORAN KELAS 1 (Santri: aisyahseso)
INSERT INTO setoran (santri_id, santri_name, kelas, surah, ayat, audio_url, status, created_at)
SELECT id, username, kelas, 'An-Nas', '1-6', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'pending', NOW() - INTERVAL '2 hours'
FROM users WHERE username = 'aisyahseso';

INSERT INTO setoran (santri_id, santri_name, kelas, surah, ayat, audio_url, status, nilai_tajwid, nilai_kelancaran, catatan_ustadz, ustadz_name, created_at)
SELECT id, username, kelas, 'Al-Falaq', '1-5', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'dinilai', 'A', 'A', 'Mumtaz! Hafalan sangat lancar dan tajwid tepat.', 'ratih', NOW() - INTERVAL '1 day'
FROM users WHERE username = 'aisyahseso';

-- 2. SETORAN KELAS 2 (Santri: rosyid)
INSERT INTO setoran (santri_id, santri_name, kelas, surah, ayat, audio_url, status, created_at)
SELECT id, username, kelas, 'Al-Ala', '1-19', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 'pending', NOW() - INTERVAL '1 hour'
FROM users WHERE username = 'rosyid';

INSERT INTO setoran (santri_id, santri_name, kelas, surah, ayat, audio_url, status, nilai_tajwid, nilai_kelancaran, catatan_ustadz, ustadz_name, created_at)
SELECT id, username, kelas, 'At-Tariq', '1-17', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 'dinilai', 'B+', 'A', 'Bagus, perhatikan dengung pada ayat 5.', 'hijri', NOW() - INTERVAL '2 days'
FROM users WHERE username = 'rosyid';

-- 3. SETORAN KELAS 3 (Santri: faqih)
INSERT INTO setoran (santri_id, santri_name, kelas, surah, ayat, audio_url, status, created_at)
SELECT id, username, kelas, 'An-Naba', '1-20', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 'pending', NOW() - INTERVAL '30 minutes'
FROM users WHERE username = 'faqih';

INSERT INTO setoran (santri_id, santri_name, kelas, surah, ayat, audio_url, status, nilai_tajwid, nilai_kelancaran, catatan_ustadz, ustadz_name, created_at)
SELECT id, username, kelas, 'An-Naziat', '1-46', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 'dinilai', 'A', 'A', 'Alhamdulillah hafalan lancar dan tajwid fasih.', 'hanifah', NOW() - INTERVAL '3 days'
FROM users WHERE username = 'faqih';
