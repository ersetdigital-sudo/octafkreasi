'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { formatRupiah } from '@/lib/format';

interface Ticket {
  id: string;
  booking_number: string;
  destination_name: string;
  destination_image: string | null;
  package_name: string;
  date: string;
  duration: string;
  adults: number;
  children: number;
  total_price: number;
  service_fee: number;
  insurance_fee: number;
  payment_status: string;
  ticket_status: string;
  customer_name: string;
  meeting_point: string;
  things_to_bring: string;
  contact_number: string;
  additional_notes: string;
  verified_at: string | null;
  created_at: string;
}


export default function TiketSayaPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (user) {
      loadTickets();
    }
  }, [user, authLoading, router]);

  const loadTickets = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) { setLoading(false); return; }
    const { data } = await supabase
      .from('tickets')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false });
    setTickets(data || []);
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container-app py-8 md:py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">Tiket Saya</h1>
            <p className="mt-1 text-sm text-gray-500">{tickets.length} tiket perjalanan</p>
          </div>
          <Link href="/akun" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-700">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Kembali
          </Link>
        </div>

        {tickets.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-card-hover">
                <div className="relative h-36 overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800">
                  {ticket.destination_image && (
                    <img src={ticket.destination_image} alt={ticket.destination_name} className="h-full w-full object-cover opacity-60" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="text-base font-bold text-white">{ticket.destination_name}</p>
                    <p className="text-xs text-white/80">{ticket.package_name}</p>
                  </div>
                  <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm ${
                      ticket.payment_status === 'paid' ? 'bg-green-500/20 text-green-100'
                        : ticket.payment_status === 'cancelled' ? 'bg-red-500/20 text-red-100'
                        : 'bg-yellow-500/20 text-yellow-100'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        ticket.payment_status === 'paid' ? 'bg-green-400' : ticket.payment_status === 'cancelled' ? 'bg-red-400' : 'bg-yellow-400'
                      }`} />
                      {ticket.payment_status === 'paid' ? 'Lunas' : ticket.payment_status === 'cancelled' ? 'Dibatalkan' : 'Menunggu'}
                    </span>
                    {ticket.ticket_status === 'used' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-green-700 backdrop-blur-sm">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Sudah Check-in
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <p className="font-mono text-[11px] text-gray-400">{ticket.booking_number}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      {ticket.date || '-'}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-1.997m0 0A8.96 8.96 0 0112 15a8.966 8.966 0 00-5.982 2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {ticket.adults + ticket.children} orang
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <p className="text-sm font-bold text-gray-900">{formatRupiah(ticket.total_price + (ticket.service_fee || 100000) + (ticket.insurance_fee || 150000))}</p>
                    {ticket.payment_status === 'paid' ? (
                      <button type="button" onClick={() => setSelectedTicket(ticket)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-700">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                        </svg>
                        Lihat Tiket
                      </button>
                    ) : (
                      <span className="text-[11px] text-gray-400">Menunggu konfirmasi</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        ) : (
          <div className="mt-16 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-50">
              <svg className="h-10 w-10 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
              </svg>
            </div>
            <p className="mt-4 text-base font-medium text-gray-700">Belum ada tiket</p>
            <p className="mt-1 text-sm text-gray-500">Tiket perjalananmu akan muncul di sini</p>
            <Link href="/destinasi" className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
              Jelajahi Destinasi
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        )}

        {selectedTicket && (
          <TicketDetail ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
        )}
      </main>
      <Footer />
    </div>
  );
}

function QRCode({ value, size = 100 }: { value: string; size?: number }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&margin=4`;
  return <img src={qrUrl} alt="QR Code" width={size} height={size} className="rounded-lg" />;
}

function OctafkreasiLogo({ className = '', white = false }: { className?: string; white?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill={white ? 'rgba(255,255,255,0.15)' : 'url(#logoGrad)'} />
      <path d="M5 16L11 10.5L16 16L21 10.5L27 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 22L11 16.5L16 22L21 16.5L27 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TicketDetail({ ticket, onClose }: { ticket: Ticket; onClose: () => void }) {
  const ticketRef = useRef<HTMLDivElement>(null);

  const packagePrice = ticket.total_price - (ticket.service_fee || 100000) - (ticket.insurance_fee || 150000);
  const serviceFee = ticket.service_fee || 100000;
  const insuranceFee = ticket.insurance_fee || 150000;
  const grandTotal = ticket.total_price;

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(ticketRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    const link = document.createElement('a');
    link.download = `tiket-${ticket.booking_number}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-8 pb-8 backdrop-blur-md">
      <div className="w-full max-w-md animate-[slideUp_0.3s_ease-out]">
        {/* Close button */}
        <div className="mb-3 flex justify-end">
          <button type="button" onClick={onClose}
            className="rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-white/20">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Ticket Card */}
        <div ref={ticketRef} className="relative overflow-hidden rounded-[28px] bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">

          {/* === HEADER — Premium Gradient with Mountain Silhouette === */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0c1929] via-[#143052] to-[#1d4ed8] px-6 pt-6 pb-8">
            {/* Subtle mountain silhouette */}
            <div className="absolute bottom-0 left-0 right-0 opacity-[0.08]">
              <svg viewBox="0 0 400 80" fill="none" className="w-full">
                <path d="M0 80L40 55L80 70L120 40L160 60L200 30L240 50L280 35L320 55L360 45L400 60V80H0Z" fill="white"/>
              </svg>
            </div>
            {/* Subtle glow circles */}
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-indigo-400/10 blur-2xl" />

            {/* Logo + Status */}
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <OctafkreasiLogo className="h-9 w-9" white />
                <div>
                  <h2 className="text-base font-bold tracking-tight text-white">octafkreasi</h2>
                  <p className="text-[10px] font-medium tracking-wide text-blue-300/80 uppercase">Travel E-Ticket</p>
                </div>
              </div>
              {/* Premium Lunas Badge */}
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1.5 ring-1 ring-emerald-400/25 shadow-[0_0_12px_rgba(52,211,153,0.15)]">
                <svg className="h-3.5 w-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                <span className="text-[11px] font-bold text-emerald-300">Lunas</span>
              </div>
            </div>

            {/* Trip Name — Cinematic Style */}
            <div className="relative mt-6 space-y-1">
              <p className="text-2xl font-bold tracking-tight text-white leading-tight">{ticket.destination_name}</p>
              <p className="text-sm font-medium text-blue-200/70">{ticket.package_name}</p>
            </div>

            {/* Ticket Code — Bold & Trackable */}
            <div className="relative mt-4">
              <div className="inline-flex items-center rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                <span className="font-mono text-xs font-bold tracking-[0.15em] text-white/90">{ticket.booking_number}</span>
              </div>
            </div>
          </div>

          {/* === TICKET NOTCH — Smaller & Subtle === */}
          <div className="relative flex items-center">
            <div className="absolute -left-2.5 h-5 w-5 rounded-full bg-black/50" />
            <div className="w-full border-t-2 border-dashed border-gray-150" />
            <div className="absolute -right-2.5 h-5 w-5 rounded-full bg-black/50" />
          </div>

          {/* === BODY === */}
          <div className="relative px-6 py-6 space-y-5">

            {/* Quick Details — Date & Participants */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
                    <svg className="h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Tanggal</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{ticket.date || '-'}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
                    <svg className="h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-1.997m0 0A8.96 8.96 0 0112 15a8.966 8.966 0 00-5.982 2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Peserta</span>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {ticket.adults} Dewasa{ticket.children > 0 ? `, ${ticket.children} Anak` : ''}
                </p>
              </div>
            </div>

            {/* Customer Info — Compact */}
            <div className="rounded-2xl bg-slate-50 px-4 py-3.5 ring-1 ring-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Nama Pemesan</p>
                  <p className="mt-0.5 text-sm font-bold text-slate-900">{ticket.customer_name}</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Payment Summary — Clean & Aligned */}
            <div className="rounded-2xl border border-slate-100 p-4 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-3">Rincian Pembayaran</p>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-slate-600">Paket Wisata</span>
                  <span className="text-[13px] font-medium text-slate-800">{formatRupiah(packagePrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-slate-600">Biaya Layanan</span>
                  <span className="text-[13px] font-medium text-slate-800">{formatRupiah(serviceFee)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-slate-600">Asuransi Perjalanan</span>
                  <span className="text-[13px] font-medium text-slate-800">{formatRupiah(insuranceFee)}</span>
                </div>
              </div>
              <div className="mt-3 border-t border-dashed border-slate-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Total Pembayaran</span>
                  <span className="text-lg font-bold text-blue-600">{formatRupiah(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Check-in Status */}
            {ticket.ticket_status === 'used' && (
              <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                    <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-800">Check-in Berhasil</p>
                    {ticket.verified_at && (
                      <p className="text-[11px] text-emerald-600">
                        {new Date(ticket.verified_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {' · '}
                        {new Date(ticket.verified_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* QR Code — Smaller, Elegant, Supporting Element */}
            <div className="flex flex-col items-center pt-2">
              <div className="rounded-2xl border border-slate-100 p-3 shadow-sm">
                <QRCode value={`https://www.octafkreasi.com/verify/${ticket.booking_number}`} size={100} />
              </div>
              <p className="mt-3 text-[11px] text-slate-400">Tunjukkan kepada staff saat check-in</p>
            </div>
          </div>

          {/* === FOOTER — Clean & Minimal === */}
          <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 text-center">
            <p className="text-[10px] font-medium tracking-wide text-slate-400">
              Official Travel E-Ticket · Powered by Octafkreasi
            </p>
          </div>
        </div>

        {/* Download Button */}
        <div className="mt-5 flex justify-center">
          <button type="button" onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-slate-900 shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download Tiket
          </button>
        </div>
      </div>
    </div>
  );
}
