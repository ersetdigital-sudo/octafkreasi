'use client';

import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface TicketResult {
  id: string;
  booking_number: string;
  destination_name: string;
  package_name: string;
  date: string;
  adults: number;
  children: number;
  customer_name: string;
  payment_status: string;
  ticket_status: string;
  verified_at: string | null;
  created_at: string;
}

type TabKey = 'verifikasi' | 'riwayat';

const TICKET_BADGE: Record<string, { label: string; cls: string }> = {
  active:     { label: 'Aktif',      cls: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
  checked_in: { label: 'Check-in',   cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  used:       { label: 'Digunakan',  cls: 'bg-slate-50 text-slate-600 ring-1 ring-slate-200' },
  cancelled:  { label: 'Dibatalkan', cls: 'bg-red-50 text-red-600 ring-1 ring-red-200' },
  pending:    { label: 'Pending',    cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
};

export default function AdminVerifikasiPage() {
  const [activeTab, setActiveTab]   = useState<TabKey>('verifikasi');
  const [search, setSearch]         = useState('');
  const [ticket, setTicket]         = useState<TicketResult | null>(null);
  const [loading, setLoading]       = useState(false);
  const [notFound, setNotFound]     = useState(false);
  const [scanning, setScanning]     = useState(false);
  const [history, setHistory]       = useState<TicketResult[]>([]);
  const [allTickets, setAllTickets] = useState<TicketResult[]>([]);
  const [histSearch, setHistSearch] = useState('');
  const [toast, setToast]           = useState<{ ok: boolean; msg: string } | null>(null);
  const scannerRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [histRes, allRes] = await Promise.all([
      supabase.from('tickets').select('*').eq('ticket_status', 'used').order('verified_at', { ascending: false }).limit(50),
      supabase.from('tickets').select('*').order('created_at', { ascending: false }),
    ]);
    setHistory((histRes.data as TicketResult[]) || []);
    setAllTickets((allRes.data as TicketResult[]) || []);
  };

  const showToast = (ok: boolean, msg: string) => {
    setToast({ ok, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const today = new Date().toDateString();
  const checkinToday  = history.filter(h => h.verified_at && new Date(h.verified_at).toDateString() === today).length;
  const activeTickets = allTickets.filter(t => t.ticket_status === 'active' || t.ticket_status === 'not_sent' || t.ticket_status === 'sent').length;
  const pendingTickets = allTickets.filter(t => t.payment_status === 'pending').length;
  const totalCheckin  = history.length;
  const totalCancelled = allTickets.filter(t => t.ticket_status === 'cancelled').length;

  const extractCode = (text: string) => {
    const m = text.match(/verify\/([A-Z0-9-]+)/i);
    return m ? m[1].toUpperCase() : text.trim().toUpperCase();
  };

  const startScanner = async () => {
    setScanning(true);
    const { Html5Qrcode } = await import('html5-qrcode');
    setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decoded: string) => { const code = extractCode(decoded); stopScanner(); setSearch(code); searchByCode(code); },
          () => {}
        );
      } catch {
        setScanning(false);
        showToast(false, 'Tidak bisa mengakses kamera. Aktifkan izin kamera.');
      }
    }, 200);
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); scannerRef.current.clear(); } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
  };

  useEffect(() => { return () => { stopScanner(); }; }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const searchByCode = async (code: string) => {
    setLoading(true); setNotFound(false); setTicket(null);
    const { data, error } = await supabase.from('tickets').select('*').eq('booking_number', code).single();
    if (error || !data) { setNotFound(true); showToast(false, 'Tiket tidak ditemukan'); }
    else setTicket(data as TicketResult);
    setLoading(false);
  };

  const handleVerify = async () => {
    if (!ticket) return;
    const now = new Date().toISOString();

    // Try update with verified_at first
    const { error } = await supabase
      .from('tickets')
      .update({ ticket_status: 'used', verified_at: now })
      .eq('id', ticket.id);

    if (error) {
      // If verified_at column doesn't exist, update without it
      const { error: e2 } = await supabase
        .from('tickets')
        .update({ ticket_status: 'used' })
        .eq('id', ticket.id);

      if (e2) { showToast(false, 'Gagal check-in: ' + e2.message); return; }

      // Try adding verified_at column via RPC or direct update again
      await supabase.from('tickets').update({ verified_at: now }).eq('id', ticket.id);
    }

    setTicket({ ...ticket, ticket_status: 'used', verified_at: now });
    showToast(true, '✓ Check-in berhasil!');
    loadData();
  };

  const isCheckedIn = ticket?.ticket_status === 'used';
  const isValid     = ticket && ticket.payment_status === 'paid' && ticket.ticket_status !== 'cancelled' && ticket.ticket_status !== 'used';
  const isInvalid   = ticket && (!ticket.payment_status || ticket.payment_status !== 'paid' || ticket.ticket_status === 'cancelled');

  const filteredHistory = history.filter(h =>
    (h.customer_name || '').toLowerCase().includes(histSearch.toLowerCase()) ||
    h.booking_number.toLowerCase().includes(histSearch.toLowerCase()) ||
    h.destination_name.toLowerCase().includes(histSearch.toLowerCase())
  );

  const formatCheckinTime = (dt: string | null) => {
    if (!dt) return '—';
    const d = new Date(dt);
    return `${d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} · ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className={`fixed right-5 top-5 z-50 flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold shadow-xl animate-[slideUp_0.2s_ease-out] ${toast.ok ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.ok
            ? <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            : <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          }
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <h1 className="text-xl font-bold text-gray-900">Verifikasi Tiket</h1>

      {/* Tab Pills */}
      <div className="flex gap-2">
        {([
          { key: 'verifikasi', label: 'Verifikasi Tiket', icon: 'M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5zM13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z' },
          { key: 'riwayat',    label: 'Riwayat Check-in', icon: 'M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
        ] as { key: TabKey; label: string; icon: string }[]).map((tab) => (
          <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150 ${
              activeTab === tab.key
                ? 'text-white shadow-md shadow-blue-600/25'
                : 'bg-white text-gray-500 ring-1 ring-gray-200 hover:text-gray-700'
            }`}
            style={activeTab === tab.key ? { background: 'linear-gradient(135deg, #2563FF, #1E40AF)' } : {}}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content — fade transition */}
      <div className="animate-[fadeIn_0.15s_ease-out]">

        {/* ══════════════ TAB 1: VERIFIKASI ══════════════ */}
        {activeTab === 'verifikasi' && (
          <div className="space-y-5">

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-3 overflow-hidden rounded-2xl p-5 text-white"
              style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563FF 60%, #3B82F6 100%)' }}>
              {[
                { label: 'Check-in Hari Ini', value: checkinToday },
                { label: 'Tiket Aktif',        value: activeTickets },
                { label: 'Tiket Pending',       value: pendingTickets },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-extrabold">{s.value}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-blue-200">{s.label}</p>
                </div>
              ))}
            </div>

            {/* QR Area */}
            {!scanning ? (
              <button type="button" onClick={startScanner}
                className="flex w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-[#2563FF]/30 bg-blue-50/40 px-6 py-10 transition-all hover:border-[#2563FF]/60 hover:bg-blue-50">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-blue-100">
                  <svg className="h-8 w-8 text-[#2563FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#2563FF]">Scan QR Code</p>
                  <p className="mt-0.5 text-xs text-gray-400">Arahkan kamera ke QR Code tiket</p>
                </div>
              </button>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                <div id="qr-reader" className="w-full" />
                <button type="button" onClick={stopScanner}
                  className="flex w-full items-center justify-center gap-2 border-t border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  Tutup Scanner
                </button>
              </div>
            )}

            {/* Manual input */}
            <div className="flex gap-2">
              <input type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && search.trim() && searchByCode(search.trim().toUpperCase())}
                placeholder="Masukkan kode booking..."
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-mono text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button type="button"
                onClick={() => search.trim() && searchByCode(search.trim().toUpperCase())}
                disabled={loading}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #2563FF, #1E40AF)' }}>
                {loading ? '...' : 'Cari'}
              </button>
            </div>

            {/* Result: Sudah Check-in */}
            {ticket && isCheckedIn && (
              <div className="animate-[slideUp_0.25s_ease-out] overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-md">
                <div className="flex items-center gap-3 bg-blue-600 px-5 py-4">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-sm font-bold text-white">Sudah Check-in</p>
                </div>
                <div className="divide-y divide-[#F8FAFF]">
                  {[['Nama', ticket.customer_name], ['Destinasi', ticket.destination_name], ['Tanggal', ticket.date || '—'], ['Peserta', `${ticket.adults} Dewasa${ticket.children > 0 ? `, ${ticket.children} Anak` : ''}`], ['Booking', ticket.booking_number], ['Check-in', formatCheckinTime(ticket.verified_at)]].map(([l, v]) => (
                    <div key={l} className="flex justify-between px-5 py-2.5">
                      <span className="text-xs text-gray-400">{l}</span>
                      <span className="text-sm font-medium text-[#0F172A] text-right max-w-[220px]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Result: Valid */}
            {ticket && isValid && (
              <div className="animate-[slideUp_0.25s_ease-out] overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-md">
                <div className="flex items-center gap-3 bg-emerald-500 px-5 py-4">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  <p className="text-sm font-bold text-white">Tiket Valid — Siap Check-in</p>
                </div>
                <div className="divide-y divide-[#F8FAFF]">
                  {[['Nama', ticket.customer_name], ['Destinasi', ticket.destination_name], ['Tanggal', ticket.date || '—'], ['Peserta', `${ticket.adults} Dewasa${ticket.children > 0 ? `, ${ticket.children} Anak` : ''}`], ['Booking', ticket.booking_number]].map(([l, v]) => (
                    <div key={l} className="flex justify-between px-5 py-2.5">
                      <span className="text-xs text-gray-400">{l}</span>
                      <span className="text-sm font-medium text-[#0F172A] text-right max-w-[220px]">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="px-5 pb-5 pt-3">
                  <button type="button" onClick={handleVerify}
                    className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]">
                    ✓ Konfirmasi Check-in
                  </button>
                </div>
              </div>
            )}

            {/* Result: Invalid */}
            {ticket && isInvalid && (
              <div className="animate-[slideUp_0.25s_ease-out] overflow-hidden rounded-2xl border border-red-200 bg-white shadow-md">
                <div className="flex items-center gap-3 bg-red-500 px-5 py-4">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  <p className="text-sm font-bold text-white">Tiket Tidak Valid</p>
                </div>
                <div className="p-5">
                  <div className="rounded-xl bg-red-50 px-4 py-3 text-center mb-3">
                    <p className="text-sm font-medium text-red-700">{ticket.payment_status !== 'paid' ? 'Pembayaran belum lunas' : 'Tiket telah dibatalkan'}</p>
                  </div>
                  {[['Nama', ticket.customer_name], ['Destinasi', ticket.destination_name], ['Booking', ticket.booking_number]].map(([l, v]) => (
                    <div key={l} className="flex justify-between py-2 border-b border-[#F8FAFF]">
                      <span className="text-xs text-gray-400">{l}</span>
                      <span className="text-sm font-medium text-[#0F172A]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════ TAB 2: RIWAYAT ══════════════ */}
        {activeTab === 'riwayat' && (
          <div className="space-y-5">

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-3 overflow-hidden rounded-2xl p-5 text-white"
              style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563FF 60%, #3B82F6 100%)' }}>
              {[
                { label: 'Total Check-in',    value: totalCheckin },
                { label: 'Tiket Checked-in',  value: history.filter(h => h.ticket_status === 'used').length },
                { label: 'Tiket Dibatalkan',  value: totalCancelled },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-extrabold">{s.value}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-blue-200">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input type="text" value={histSearch} onChange={(e) => setHistSearch(e.target.value)}
                placeholder="Cari nama, kode, destinasi..."
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: '#0F172A' }}>
                      {['NAMA CUSTOMER', 'DESTINASI', 'KODE BOOKING', 'WAKTU CHECK-IN', 'STATUS'].map((col, i) => (
                        <th key={i} className="px-4 text-left text-white"
                          style={{ height: '48px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', borderRight: i < 4 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-16 text-center text-sm text-gray-400">Belum ada riwayat check-in</td></tr>
                    ) : (
                      filteredHistory.map((h) => {
                        const tb = TICKET_BADGE[h.ticket_status] || TICKET_BADGE.pending;
                        return (
                          <tr key={h.id} className="transition-colors duration-150 hover:bg-[#F8FAFF]"
                            style={{ height: '52px', borderBottom: '1px solid #E2E8F0' }}>
                            <td className="px-4" style={{ borderRight: '1px solid #F1F5F9' }}>
                              <p className="font-semibold text-[#0F172A]" style={{ fontSize: '13px' }}>{h.customer_name || 'Guest'}</p>
                            </td>
                            <td className="px-4" style={{ borderRight: '1px solid #F1F5F9', fontSize: '13px', color: '#475569' }}>
                              {h.destination_name}
                            </td>
                            <td className="px-4" style={{ borderRight: '1px solid #F1F5F9' }}>
                              <p className="font-mono font-bold text-[#0F172A]" style={{ fontSize: '12px' }}>{h.booking_number}</p>
                            </td>
                            <td className="px-4" style={{ borderRight: '1px solid #F1F5F9', fontSize: '13px', color: '#475569' }}>
                              {formatCheckinTime(h.verified_at)}
                            </td>
                            <td className="px-4">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tb.cls}`}>
                                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                                {tb.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              {filteredHistory.length > 0 && (
                <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-2.5">
                  <p className="text-xs text-gray-400">
                    Menampilkan <span className="font-semibold text-gray-600">{filteredHistory.length}</span> riwayat check-in
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
