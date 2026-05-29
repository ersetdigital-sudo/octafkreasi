import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { apiKey } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'API Key kosong' }, { status: 400 });
    }

    // Test connection to Fonnte
    const res = await fetch('https://api.fonnte.com/device', {
      method: 'POST',
      headers: { 'Authorization': apiKey },
    });

    const data = await res.json();
    const connected = data.status === true;

    return NextResponse.json({
      success: connected,
      device: connected ? data.device : null,
      error: connected ? null : (data.reason || 'Koneksi gagal'),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
