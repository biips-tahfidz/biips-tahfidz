import { getUsers, addUser } from '../lib/db.js';

export async function GET(request) {
  try {
    const users = await getUsers();
    const safeUsers = users.map(u => {
      const { password, ...safeUser } = u;
      return safeUser;
    });
    return Response.json(safeUsers);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { requester_role, username, password, role, kelas } = body;

    if (!requester_role || (requester_role !== 'mudir' && requester_role !== 'admin')) {
      return Response.json({ error: 'Akses ditolak: Hanya Mudir / Admin yang diperbolehkan menambah pengguna baru.' }, { status: 403 });
    }

    if (!username || !password || !role) {
      return Response.json({ error: 'Username, password, dan role wajib diisi.' }, { status: 400 });
    }

    const newUser = await addUser({ username, password, role, kelas });
    const { password: _, ...safeNewUser } = newUser;

    return Response.json(safeNewUser, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
