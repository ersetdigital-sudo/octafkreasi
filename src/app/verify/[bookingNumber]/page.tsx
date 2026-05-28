'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface TicketData {
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
  created_at: string;
}

export default function VerifyTicketPage() {
  const params = useParams();
  const bookingNumber = params.bookingNumber as string;
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (bookingNumber) loadTicket();
  }, [bookingNumber]);

  const loadTicket = async () => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('booking_number', bookingNumber)
      .single();

    if (error || !data) {
      setNotFound(true);
    } else {
      setTicket(data as TicketData);
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    if (!ticket) return;
    const now = new Date().toISOString();
    
    // Try with verified_at, fallback to just ticket_status
    const { error } = await supabase
      .from('tickets')
      .update({ ticket_status: 'used', verified_at: now })
      .eq('id', ticket.id);

    if (error) {
      await supabase
        .from('tickets')
        .update({ ticket_status: 'used' })
        .eq('id', ticket.id);
    }
    setVerified(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm text-gray-500">Memverifikasi tiket...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="mt-5 text-xl font-bold text-gray-800">Tiket Tidak Ditemukan</h1>
          <p className="mt-2 text-sm text-gray-500">
            Kode booking <span className="font-mono font-semibold">{bookingNumber}</span> tidak valid atau tidak terdaftar dalam sistem kami.
          </p>
          <Link href="/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  const isValid = ticket.payment_status === 'paid' && ticket.ticket_status !== 'cancelled';
  const ticketDate = new Date(ticket.created_at).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M3 12L7.5 7.5L12 12L16.5 7.5L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 17L7.5 12.5L12 17L16.5 12.5L21 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
            </svg>
          </div>
          <p className="mt-2 text-xs font-semibold text-gray-500">VERIFIKASI TIKET</p>
        </div>

        {/* Card */}
        <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-100">
          {/* Status Banner */}
          {verified ? (
            <div className="bg-green-500 px-5 py-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-sm font-bold text-white">CHECK-IN BERHASIL</span>
              </div>
            </div>
          ) : isValid ? (
            <div className="bg-blue-600 px-5 py-3 text-center">
              <span className="text-sm font-bold text-white">✓ TIKET VALID</span>
            </div>
          ) : (
            <div className="bg-red-500 px-5 py-3 text-center">
              <span className="text-sm font-bold text-white">✗ TIKET TIDAK VALID</span>
            </div>
          )}

          {/* Ticket Info */}
          <div className="p-5 space-y-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Kode Booking</p>
              <p className="mt-0.5 font-mono text-lg font-bold text-gray-800">{ticket.booking_number}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-[10px] font-medium text-gray-400">Destinasi</p>
                <p className="mt-0.5 text-sm font-semibold text-gray-700">{ticket.destination_name}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-[10px] font-medium text-gray-400">Tanggal</p>
                <p className="mt-0.5 text-sm font-semibold text-gray-700">{ticket.date || '-'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-[10px] font-medium text-gray-400">Nama Pemesan</p>
                <p className="mt-0.5 text-sm font-semibold text-gray-700">{ticket.customer_name}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-[10px] font-medium text-gray-400">Peserta</p>
                <p className="mt-0.5 text-sm font-semibold text-gray-700">
                  {ticket.adults} Dewasa{ticket.children > 0 ? `, ${ticket.children} Anak` : ''}
                </p>
              </div>
            </div>

            {ticket.package_name && (
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-[10px] font-medium text-gray-400">Paket</p>
                <p className="mt-0.5 text-sm font-semibold text-gray-700">{ticket.package_name}</p>
              </div>
            )}

            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-[10px] font-medium text-gray-400">Status Pembayaran</p>
              <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                ticket.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${ticket.payment_status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                {ticket.payment_status === 'paid' ? 'Lunas' : 'Belum Lunas'}
              </span>
            </div>

            <p className="text-[10px] text-gray-400 text-center">Tiket dibuat: {ticketDate}</p>

            {/* Verify Button - only for staff */}
            {isValid && !verified && (
              <button
                type="button"
                onClick={handleVerify}
                className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md active:scale-[0.98]"
              >
                ✓ Konfirmasi Check-in
              </button>
            )}

            {verified && (
              <div className="rounded-xl bg-green-50 p-3 text-center ring-1 ring-green-200">
                <p className="text-sm font-semibold text-green-700">Tamu sudah check-in ✓</p>
                <p className="mt-0.5 text-[11px] text-green-600">
                  {new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )}

            {!isValid && (
              <div className="rounded-xl bg-red-50 p-3 text-center ring-1 ring-red-200">
                <p className="text-xs text-red-600">
                  {ticket.payment_status !== 'paid' ? 'Pembayaran belum lunas.' : 'Tiket telah dibatalkan.'}
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] text-gray-400">
          octafkreasi — Sistem Verifikasi Tiket
        </p>
      </div>
    </div>
  );
}
