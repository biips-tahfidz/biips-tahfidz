import { POST as vercelUploadPOST } from '../upload-vercel/route.js';

export async function POST(request) {
  return vercelUploadPOST(request);
}
