import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { target, message, orderId } = await req.json();

    if (!target || !message) {
      return NextResponse.json({ success: false, error: 'Target dan message wajib diisi' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get Fonnte API Key from settings
    const { data: settingData } = await supabase
      .from('settings')
      .select('value')
      .eq('id', 'fonnte')
      .single();

    if (!settingData?.value) {
      return NextResponse.json({ success: false, error: 'API Key Fonnte belum diatur di Pengaturan' }, { status: 400 });
    }

    const val = typeof settingData.value === 'string' ? JSON.parse(settingData.value) : settingData.value;
    const apiKey = val.api_key;

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'API Key Fonnte kosong' }, { status: 400 });
    }

    // Send via Fonnte API
    const fonntRes = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target,
        message,
        countryCode: '62',
      }),
    });

    const fonntData = await fonntRes.json();
    const success = fonntData.status === true || fonntData.detail === 'sent';

    // Log pengiriman
    await supabase.from('wa_logs').insert({
      target,
      message,
      order_id: orderId || null,
      status: success ? 'sent' : 'failed',
      response: JSON.stringify(fonntData),
    });

    if (success) {
      return NextResponse.json({ success: true, data: fonntData });
    } else {
      return NextResponse.json({ success: false, error: fonntData.reason || 'Gagal mengirim', data: fonntData }, { status: 400 });
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
