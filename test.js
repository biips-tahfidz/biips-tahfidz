import assert from 'assert';
import { GET as getUsers, POST as postUser } from './app/api/users/route.js';
import { GET as getSetoran, POST as postSetoran, PUT as putSetoran } from './app/api/setoran/route.js';
import { GET as checkDb } from './app/api/db-check/route.js';

async function runTests() {
  console.log('=== Starting Backend Integration Tests ===');

  // 1. Test GET Users
  console.log('Testing GET /api/users...');
  const usersResponse = await getUsers();
  const usersData = await usersResponse.json();
  assert(Array.isArray(usersData), 'Users response should be an array');
  assert(usersData.length >= 25, 'Should contain seeded users');
  assert(!usersData[0].password, 'Users response should exclude password field');
  console.log('✓ GET /api/users passed (Total users:', usersData.length, ')');

  // 2. Test Role Restriction for Adding User
  console.log('Testing POST /api/users role restriction...');
  const unauthorizedReq = new Request('http://localhost/api/users', {
    method: 'POST',
    body: JSON.stringify({ requester_role: 'santri', username: 'testuser', password: '123', role: 'santri' })
  });
  const unauthRes = await postUser(unauthorizedReq);
  assert.strictEqual(unauthRes.status, 403, 'Santri role should not be allowed to add users');

  const authorizedReq = new Request('http://localhost/api/users', {
    method: 'POST',
    body: JSON.stringify({ requester_role: 'mudir', username: 'tesmudiruser', password: '123', role: 'santri', kelas: '1' })
  });
  const authRes = await postUser(authorizedReq);
  assert.strictEqual(authRes.status, 201, 'Mudir role should be allowed to add users');
  console.log('✓ POST /api/users role restriction passed');

  // 3. Test POST & PUT Setoran
  console.log('Testing Setoran CRUD operations...');
  const setoranReq = new Request('http://localhost/api/setoran', {
    method: 'POST',
    body: JSON.stringify({
      santri_name: 'hasan',
      kelas: '3',
      surah: 'An-Naba',
      ayat: '1-5',
      audio_url: 'https://fake-vercel-blob.storage.com/audio-test.webm'
    })
  });
  const createSetoranRes = await postSetoran(setoranReq);
  assert.strictEqual(createSetoranRes.status, 201);
  const createdSetoran = await createSetoranRes.json();
  assert.strictEqual(createdSetoran.surah, 'An-Naba');
  assert.strictEqual(createdSetoran.status, 'pending');

  const updateSetoranReq = new Request('http://localhost/api/setoran', {
    method: 'PUT',
    body: JSON.stringify({
      id: createdSetoran.id,
      nilai_tajwid: 'A',
      nilai_kelancaran: 'A',
      catatan_ustadz: 'Mumtaz!',
      ustadz_name: 'Ustadz Hanifah'
    })
  });
  const updateRes = await putSetoran(updateSetoranReq);
  const updatedSetoran = await updateRes.json();
  assert.strictEqual(updatedSetoran.status, 'dinilai');
  assert.strictEqual(updatedSetoran.nilai_tajwid, 'A');
  console.log('✓ Setoran POST & PUT passed');

  // 4. Test Health Check
  console.log('Testing System Health Check...');
  const dbCheckRes = await checkDb();
  const dbCheckData = await dbCheckRes.json();
  assert(dbCheckData.timestamp, 'Timestamp should be present in health check');
  console.log('✓ Health check status:', dbCheckData);

  console.log('\n✅ ALL BACKEND TESTS PASSED SUCCESSFULLY!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
