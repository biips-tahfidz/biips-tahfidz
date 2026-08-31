import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
