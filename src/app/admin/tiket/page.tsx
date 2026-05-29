'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatRupiah } from '@/lib/format';

interface Ticket {
  id: string;
  booking_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  destination_name: string;
  date: string | null;
  adults: number;
  children: number;
  total_price: number;
  payment_status: string;
  ticket_status: string;
  created_at: string;
}

const FILTER_TABS = [
  { value: 'all',        label: 'Semua' },
  { value: 'not_sent',   label: 'Belum Dikirim' },
  { value: 'sent',       label: 'Sudah Dikirim' },
  { value: 'cancelled',  label: 'Dibatalkan' },
];

const PAYMENT_BADGE: Record<string, { label: string; cls: string }> = {
  paid:      { label: 'Lunas',        cls: 'bg-[#22C55E] text-white' },
  confirmed: { label: 'Dikonfirmasi', cls: 'bg-[#3B82F6] text-white' },
  completed: { label: 'Selesai',      cls: 'bg-[#64748B] text-white' },
  pending:   { label: 'Pending',      cls: 'bg-[#EAB308] text-white' },
};

const TICKET_BADGE: Record<string, { label: string; cls: string }> = {
  active:     { label: 'Aktif',       cls: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
  not_sent:   { label: 'Belum Kirim', cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
  sent:       { label: 'Terkirim',    cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  checked_in: { label: 'Check-in',    cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  used:       { label: 'Digunakan',   cls: 'bg-slate-50 text-slate-600 ring-1 ring-slate-200' },
  cancelled:  { label: 'Dibatalkan',  cls: 'bg-red-50 text-red-600 ring-1 ring-red-200' },
};

export default function AdminTiketPage() {
  const [tickets, setTickets]   = useState<Ticket[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');
  const [toast, setToast]       = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => { loadData(); }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    setLoading(true);
    let query = supabase.from('tickets').select('*').order('created_at', { ascending: false });
    if (filter !== 'all') query = query.eq('ticket_status', filter);
    const { data } = await query;
    setTickets(data || []);
    setLoading(false);
  };

  const showToast = (ok: boolean, msg: string) => {
    setToast({ ok, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSendWA = (ticket: Ticket) => {
    const phone = ticket.customer_phone?.replace(/\D/g, '');
    if (!phone) { showToast(false, 'Nomor WhatsApp customer tidak tersedia'); return; }
    const peserta = `${ticket.adults} Dewasa${ticket.children > 0 ? `, ${ticket.children} Anak` : ''}`;
    const msg = encodeURIComponent(
      `Halo ${ticket.customer_name || 'Pelanggan'}!\n\nBerikut e-tiket perjalanan Anda bersama Octaf Kreasi:\n\nDestinasi: ${ticket.destination_name}\nTanggal: ${ticket.date || '-'}\nKode Booking: ${ticket.booking_number}\nPeserta: ${peserta}\n\nTunjukkan kode booking ini saat check-in. Selamat menikmati perjalanan!\n\n- Tim Octaf Kreasi`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const filtered = tickets.filter((t) =>
    (t.customer_name || '').toLowerCase().includes(search.toLowerCase()) ||
    t.booking_number.toLowerCase().includes(search.toLowerCase()) ||
    t.destination_name.toLowerCase().includes(search.toLowerCase())
  );

  const counts = tickets.reduce((acc, t) => {
    acc[t.ticket_status] = (acc[t.ticket_status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4">

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

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Kelola Tiket</h1>
        <button type="button" onClick={loadData}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 shadow-sm transition hover:bg-gray-50">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-72">
        <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, booking, destinasi..."
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* Filter Tabs */}
        <div className="flex gap-0 overflow-x-auto border-b border-gray-200 px-1">
          {FILTER_TABS.map((tab) => {
            const count = tab.value === 'all' ? tickets.length : (counts[tab.value] || 0);
            const isActive = filter === tab.value;
            return (
              <button key={tab.value} type="button" onClick={() => setFilter(tab.value)}
                className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-3.5 text-[13px] font-medium transition-colors ${isActive ? 'text-[#2563FF]' : 'text-gray-500 hover:text-gray-700'}`}>
                {tab.label}
                {count > 0 && (
                  <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${isActive ? 'bg-[#2563FF] text-white' : 'bg-gray-100 text-gray-500'}`}>{count}</span>
                )}
                {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#2563FF]" />}
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#0F172A' }}>
                {[
                  { label: 'BOOKING',    cls: 'w-[160px]' },
                  { label: 'CUSTOMER',   cls: '' },
                  { label: 'DESTINASI',  cls: 'hidden md:table-cell' },
                  { label: 'TOTAL',      cls: 'hidden sm:table-cell' },
                  { label: 'STATUS',     cls: '' },
                  { label: 'AKSI',       cls: 'text-right' },
                ].map((col, i) => (
                  <th key={i} className={`px-4 text-left text-white ${col.cls}`}
                    style={{ height: '48px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', borderRight: i < 5 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} style={{ height: '52px', borderBottom: '1px solid #E2E8F0' }} className="animate-pulse">
                    <td className="px-4"><div className="h-3 w-24 rounded bg-gray-100" /></td>
                    <td className="px-4"><div className="h-3 w-28 rounded bg-gray-100" /></td>
                    <td className="hidden px-4 md:table-cell"><div className="h-3 w-24 rounded bg-gray-100" /></td>
                    <td className="hidden px-4 sm:table-cell"><div className="h-3 w-20 rounded bg-gray-100" /></td>
                    <td className="px-4"><div className="h-5 w-20 rounded bg-gray-100" /></td>
                    <td className="px-4"><div className="h-7 w-24 rounded bg-gray-100 ml-auto" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-16 text-center text-sm text-gray-400">Tidak ada tiket ditemukan</td></tr>
              ) : (
                filtered.map((ticket) => {
                  const pb = PAYMENT_BADGE[ticket.payment_status] || PAYMENT_BADGE.pending;
                  const tb = TICKET_BADGE[ticket.ticket_status] || TICKET_BADGE.not_sent;
                  return (
                    <tr key={ticket.id} className="transition-colors duration-150 hover:bg-[#F8FAFF]"
                      style={{ height: '52px', borderBottom: '1px solid #E2E8F0' }}>

                      {/* Booking */}
                      <td className="px-4" style={{ borderRight: '1px solid #F1F5F9' }}>
                        <p className="font-mono font-bold text-[#0F172A]" style={{ fontSize: '13px' }}>{ticket.booking_number}</p>
                        <p style={{ fontSize: '11px', color: '#94A3B8' }}>
                          {new Date(ticket.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit' })}
                        </p>
                      </td>

                      {/* Customer */}
                      <td className="px-4" style={{ borderRight: '1px solid #F1F5F9' }}>
                        <p className="font-bold text-[#0F172A]" style={{ fontSize: '13px' }}>{ticket.customer_name || 'Guest'}</p>
                        <p className="truncate max-w-[180px]" style={{ fontSize: '11px', color: '#94A3B8' }}>{ticket.customer_email || '—'}</p>
                      </td>

                      {/* Destinasi */}
                      <td className="hidden px-4 md:table-cell" style={{ borderRight: '1px solid #F1F5F9' }}>
                        <p className="font-semibold text-[#0F172A]" style={{ fontSize: '13px' }}>{ticket.destination_name}</p>
                        {ticket.date && <p style={{ fontSize: '11px', color: '#94A3B8' }}>{ticket.date}</p>}
                      </td>

                      {/* Total */}
                      <td className="hidden px-4 sm:table-cell" style={{ borderRight: '1px solid #F1F5F9', fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                        {formatRupiah(ticket.total_price)}
                      </td>

                      {/* Status — 2 badges */}
                      <td className="px-4" style={{ borderRight: '1px solid #F1F5F9' }}>
                        <div className="flex flex-col gap-1">
                          <span className={`inline-block text-white text-[11px] font-bold ${pb.cls}`}
                            style={{ borderRadius: '5px', padding: '2px 8px', width: 'fit-content' }}>
                            {pb.label}
                          </span>
                          <span className={`inline-flex items-center rounded-full text-[10px] font-semibold ${tb.cls}`}
                            style={{ padding: '2px 8px', width: 'fit-content' }}>
                            {tb.label}
                          </span>
                        </div>
                      </td>

                      {/* Aksi — Kirim ke WA */}
                      <td className="px-4">
                        <div className="flex justify-end">
                          {ticket.ticket_status !== 'cancelled' && (
                            <button type="button" onClick={() => handleSendWA(ticket)}
                              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white transition-all hover:opacity-90 hover:shadow-md"
                              style={{ backgroundColor: '#25D366' }}>
                              {/* WhatsApp icon */}
                              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                              Kirim ke WA
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-2.5">
            <p className="text-xs text-gray-400">
              Menampilkan <span className="font-semibold text-gray-600">{filtered.length}</span> dari <span className="font-semibold text-gray-600">{tickets.length}</span> tiket
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
