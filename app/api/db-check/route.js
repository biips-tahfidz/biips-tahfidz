import { supabase } from '../../../lib/supabase.js';

export async function GET(request) {
  const status = {
    supabase_connected: false,
    vercel_blob_configured: !!process.env.BLOB_READ_WRITE_TOKEN,
    timestamp: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('users').select('id').limit(1);
      if (!error) {
        status.supabase_connected = true;
      }
    } catch (e) {
      status.supabase_connected = false;
    }
  }

  return Response.json(status);
}
