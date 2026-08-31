import { supabase } from '../../../lib/supabase.js';

export const seedUsers = [
  { id: '10000000-0000-0000-0000-000000000001', username: 'aminawa', password: 'bips00', role: 'mudir', kelas: 'semua' },
  { id: '10000000-0000-0000-0000-000000000002', username: 'ratih', password: 'bips01', role: 'guru', kelas: '1' },
  { id: '10000000-0000-0000-0000-000000000003', username: 'hijri', password: 'bips02', role: 'guru', kelas: '2' },
  { id: '10000000-0000-0000-0000-000000000004', username: 'hanifah', password: 'bips03', role: 'guru', kelas: '3' },
  { id: '10000000-0000-0000-0000-000000000005', username: 'hasan', password: 'hasan', role: 'santri', kelas: '3' },
  { id: '10000000-0000-0000-0000-000000000006', username: 'abdullah', password: 'abdullah', role: 'santri', kelas: '3' },
  { id: '10000000-0000-0000-0000-000000000007', username: 'aisyahblora', password: 'aisyah', role: 'santri', kelas: '3' },
  { id: '10000000-0000-0000-0000-000000000008', username: 'hamzah', password: 'hamzah', role: 'santri', kelas: '3' },
  { id: '10000000-0000-0000-0000-000000000009', username: 'almubarok', password: 'almubarok', role: 'santri', kelas: '3' },
  { id: '10000000-0000-0000-0000-000000000010', username: 'faqih', password: 'faqih', role: 'santri', kelas: '3' },
  { id: '10000000-0000-0000-0000-000000000011', username: 'rosyid', password: 'rosyid', role: 'santri', kelas: '2' },
  { id: '10000000-0000-0000-0000-000000000012', username: 'fadheela', password: 'fadheela', role: 'santri', kelas: '2' },
  { id: '10000000-0000-0000-0000-000000000013', username: 'hafshoh', password: 'hafshoh', role: 'santri', kelas: '2' },
  { id: '10000000-0000-0000-0000-000000000014', username: 'alwi', password: 'alwi', role: 'santri', kelas: '2' },
  { id: '10000000-0000-0000-0000-000000000015', username: 'qilabah', password: 'qilabah', role: 'santri', kelas: '2' },
  { id: '10000000-0000-0000-0000-000000000016', username: 'syarif', password: 'syarif', role: 'santri', kelas: '2' },
  { id: '10000000-0000-0000-0000-000000000017', username: 'zizah', password: 'zizah', role: 'santri', kelas: '2' },
  { id: '10000000-0000-0000-0000-000000000018', username: 'aisyahseso', password: 'aisyahseso', role: 'santri', kelas: '1' },
  { id: '10000000-0000-0000-0000-000000000019', username: 'aisyahkarangjati', password: 'aisyahkarangjati', role: 'santri', kelas: '1' },
  { id: '10000000-0000-0000-0000-000000000020', username: 'mesya', password: 'mesya', role: 'santri', kelas: '1' },
  { id: '10000000-0000-0000-0000-000000000021', username: 'fatimah', password: 'fatimah', role: 'santri', kelas: '1' },
  { id: '10000000-0000-0000-0000-000000000022', username: 'hilyah', password: 'hilyah', role: 'santri', kelas: '1' },
  { id: '10000000-0000-0000-0000-000000000023', username: 'salman', password: 'salman', role: 'santri', kelas: '1' },
  { id: '10000000-0000-0000-0000-000000000024', username: 'tegar', password: 'tegar', role: 'santri', kelas: '1' },
  { id: '10000000-0000-0000-0000-000000000025', username: 'ishaq', password: 'ishaq', role: 'santri', kelas: '1' },
  { id: '10000000-0000-0000-0000-000000000026', username: 'muhammad', password: 'muhammad', role: 'santri', kelas: '1' }
];

let memoryUsers = [...seedUsers];
let memorySetoran = [];

export async function getUsers() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.error('Supabase fetch error, using fallback', e);
    }
  }
  return memoryUsers;
}

export async function addUser(user) {
  const newUser = {
    id: user.id || `user-${Date.now()}`,
    username: user.username,
    password: user.password,
    role: user.role,
    kelas: user.kelas || '1',
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('users').insert([newUser]).select();
      if (!error && data) return data[0];
    } catch (e) {
      console.error('Supabase insert user error', e);
    }
  }

  memoryUsers.push(newUser);
  return newUser;
}

export async function getSetoran() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('setoran').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      console.error('Supabase fetch setoran error', e);
    }
  }
  return memorySetoran;
}

export async function addSetoran(item) {
  const newItem = {
    id: item.id || `setoran-${Date.now()}`,
    santri_id: item.santri_id || null,
    santri_name: item.santri_name,
    kelas: item.kelas || '1',
    surah: item.surah,
    ayat: item.ayat,
    audio_url: item.audio_url,
    status: item.status || 'pending',
    nilai_tajwid: item.nilai_tajwid || null,
    nilai_kelancaran: item.nilai_kelancaran || null,
    catatan_ustadz: item.catatan_ustadz || null,
    ustadz_name: item.ustadz_name || null,
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('setoran').insert([newItem]).select();
      if (!error && data) return data[0];
    } catch (e) {
      console.error('Supabase insert setoran error', e);
    }
  }

  memorySetoran.unshift(newItem);
  return newItem;
}

export async function updateSetoran(id, updateData) {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('setoran').update(updateData).eq('id', id).select();
      if (!error && data) return data[0];
    } catch (e) {
      console.error('Supabase update setoran error', e);
    }
  }

  const index = memorySetoran.findIndex(s => s.id === id);
  if (index !== -1) {
    memorySetoran[index] = { ...memorySetoran[index], ...updateData };
    return memorySetoran[index];
  }
  return null;
}
