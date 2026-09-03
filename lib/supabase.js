import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('biips_user');
  }
};

export const DEFAULT_USERS = [
  { username: 'aminawa', role: 'mudir', kelas: 'semua' },
  { username: 'ratih', role: 'guru', kelas: '1' },
  { username: 'hijri', role: 'guru', kelas: '2' },
  { username: 'hanifah', role: 'guru', kelas: '3' },
  { username: 'hasan', role: 'santri', kelas: '3' },
  { username: 'abdullah', role: 'santri', kelas: '3' },
  { username: 'aisyahblora', role: 'santri', kelas: '3' },
  { username: 'hamzah', role: 'santri', kelas: '3' },
  { username: 'almubarok', role: 'santri', kelas: '3' },
  { username: 'faqih', role: 'santri', kelas: '3' },
  { username: 'rosyid', role: 'santri', kelas: '2' },
  { username: 'fadheela', role: 'santri', kelas: '2' },
  { username: 'hafshoh', role: 'santri', kelas: '2' },
  { username: 'alwi', role: 'santri', kelas: '2' },
  { username: 'qilabah', role: 'santri', kelas: '2' },
  { username: 'syarif', role: 'santri', kelas: '2' },
  { username: 'zizah', role: 'santri', kelas: '2' },
  { username: 'aisyahseso', role: 'santri', kelas: '1' },
  { username: 'aisyahkarangjati', role: 'santri', kelas: '1' },
  { username: 'mesya', role: 'santri', kelas: '1' },
  { username: 'fatimah', role: 'santri', kelas: '1' },
  { username: 'hilyah', role: 'santri', kelas: '1' },
  { username: 'salman', role: 'santri', kelas: '1' },
  { username: 'tegar', role: 'santri', kelas: '1' },
  { username: 'ishaq', role: 'santri', kelas: '1' },
  { username: 'muhammad', role: 'santri', kelas: '1' }
];

export const DEFAULT_SETORAN = [
  {
    id: 'seed-1',
    santri_name: 'aisyahkarangjati',
    kelas: '1',
    surah: 'An-Nas',
    ayat: '1-6',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'seed-2',
    santri_name: 'salman',
    kelas: '1',
    surah: 'Al-Falaq',
    ayat: '1-5',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    status: 'dinilai',
    nilai_tajwid: 'A',
    nilai_kelancaran: 'A',
    catatan_ustadz: 'Mumtaz! Hafalan sangat lancar dan fasih.',
    ustadz_name: 'ratih',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'seed-3',
    santri_name: 'hafshoh',
    kelas: '2',
    surah: 'Al-Ala',
    ayat: '1-19',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: 'seed-4',
    santri_name: 'alwi',
    kelas: '2',
    surah: 'At-Tariq',
    ayat: '1-17',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    status: 'dinilai',
    nilai_tajwid: 'B+',
    nilai_kelancaran: 'A',
    catatan_ustadz: 'Bagus, perhatikan tajwid dan ikhfa.',
    ustadz_name: 'hijri',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 'seed-5',
    santri_name: 'faqih',
    kelas: '3',
    surah: 'An-Naba',
    ayat: '1-20',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 0.5).toISOString()
  },
  {
    id: 'seed-6',
    santri_name: 'abdullah',
    kelas: '3',
    surah: 'An-Naziat',
    ayat: '1-46',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    status: 'dinilai',
    nilai_tajwid: 'A',
    nilai_kelancaran: 'A',
    catatan_ustadz: 'Barakallahu fiik, hafalan sangat lancar.',
    ustadz_name: 'hanifah',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString()
  }
];
