'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { formatRupiah } from '@/lib/format';
import { destinations } from '@/data/destinations';

interface OrderDetail {
  id: string;
  destination_slug: string;
  destination_name: string;
  package_name: string | null;
  package_duration: string | null;
  date: string | null;
  adults: number;
  children: number;
  total_price: number;
  status: string;
  payment_method: string | null;
  customer_name: string | null;
  customer_email: string | null;
  addons: string[] | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  pending: { label: 'Menunggu Pembayaran', color: 'text-amber-700', bg: 'bg-amber-50 ring-1 ring-amber-200', dot: 'bg-amber-400' },
  paid: { label: 'Lunas', color: 'text-emerald-700', bg: 'bg-emerald-50 ring-1 ring-emerald-200', dot: 'bg-emerald-400' },
  confirmed: { label: 'Dikonfirmasi', color: 'text-blue-700', bg: 'bg-blue-50 ring-1 ring-blue-200', dot: 'bg-blue-400' },
  completed: { label: 'Selesai', color: 'text-slate-700', bg: 'bg-slate-50 ring-1 ring-slate-200', dot: 'bg-slate-400' },
  cancelled: { label: 'Dibatalkan', color: 'text-red-700', bg: 'bg-red-50 ring-1 ring-red-200', dot: 'bg-red-400' },
};

const TIMELINE_STEPS = [
  { key: 'created', label: 'Pesanan Dibuat', icon: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z' },
  { key: 'paid', label: 'Pembayaran Diterima', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z' },
  { key: 'confirmed', label: 'Tiket Diterbitkan', icon: 'M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z' },
  { key: 'completed', label: 'Perjalanan Dimulai', icon: 'M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5' },
];

function getTimelineProgress(status: string): number {
  switch (status) {
    case 'pending': return 0;
    case 'paid': return 1;
    case 'confirmed': return 2;
    case 'completed': return 3;
    case 'cancelled': return -1;
    default: return 0;
  }
}

export default function OrderDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (user && orderId) loadOrder();
  }, [user, authLoading, orderId, router]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadOrder = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) { setLoading(false); return; }
    const { data, error } = await supabase
      .from('orders').select('*').eq('id', orderId).eq('user_id', currentUser.id).single();
    if (error || !data) setNotFound(true);
    else setOrder(data as OrderDetail);
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fb]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="min-h-screen bg-[#f8f9fb]">
        <Header />
        <main className="container-app py-16 text-center">
          <div className="mx-auto max-w-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="mt-4 text-sm font-medium text-gray-700">Pesanan tidak ditemukan</p>
            <Link href="/akun" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-700">← Kembali</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;
  const timelineProgress = getTimelineProgress(order.status);
  const dest = destinations.find(d => d.slug === order.destination_slug);
  const coverImage = dest?.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';
  const orderDate = new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const orderTime = new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <Header />
      <main className="container-app py-6 md:py-10">
        {/* Back */}
        <Link href="/akun" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          Kembali
        </Link>

        <div className="mt-4 mx-auto max-w-2xl space-y-4">

          {/* ═══ Cover Image + Destination Info ═══ */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="relative h-[180px] md:h-[220px]">
              <img src={coverImage} alt={order.destination_name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h1 className="text-xl font-bold text-white md:text-2xl">{order.package_name || order.destination_name}</h1>
                    <p className="mt-0.5 text-sm text-white/70">{order.destination_name}{order.package_duration ? ` · ${order.package_duration}` : ''}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur-sm ${status.bg} ${status.color}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </div>
              </div>
            </div>

            {/* ═══ Trip Info Cards ═══ */}
            <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
              <div className="p-4 text-center">
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                </div>
                <p className="mt-2 text-xs font-bold text-gray-900">{order.date || '-'}</p>
                <p className="text-[10px] text-gray-400">Berangkat</p>
              </div>
              <div className="p-4 text-center">
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                  <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                </div>
                <p className="mt-2 text-xs font-bold text-gray-900">{order.adults + order.children} Orang</p>
                <p className="text-[10px] text-gray-400">{order.adults}D{order.children > 0 ? ` ${order.children}A` : ''}</p>
              </div>
              <div className="p-4 text-center">
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                  <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="mt-2 text-xs font-bold text-gray-900">{orderDate.split(' ').slice(0, 2).join(' ')}</p>
                <p className="text-[10px] text-gray-400">Dipesan {orderTime}</p>
              </div>
            </div>

            {/* ═══ Timeline Status ═══ */}
            {order.status !== 'cancelled' && (
              <div className="px-5 py-5 md:px-6">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-4">Status Perjalanan</p>
                <div className="flex items-center justify-between">
                  {TIMELINE_STEPS.map((step, i) => {
                    const isCompleted = i <= timelineProgress;
                    const isCurrent = i === timelineProgress;
                    return (
                      <div key={step.key} className="flex flex-1 flex-col items-center relative">
                        {/* Connector line */}
                        {i > 0 && (
                          <div className={`absolute top-4 right-1/2 w-full h-0.5 -translate-y-1/2 ${i <= timelineProgress ? 'bg-emerald-400' : 'bg-gray-200'}`} style={{ left: '-50%', zIndex: 0 }} />
                        )}
                        {/* Circle */}
                        <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                          isCompleted ? 'bg-emerald-500 shadow-md shadow-emerald-500/30' : 'bg-gray-100'
                        } ${isCurrent ? 'ring-4 ring-emerald-100' : ''}`}>
                          {isCompleted ? (
                            <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                          ) : (
                            <svg className="h-3.5 w-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={step.icon} /></svg>
                          )}
                        </div>
                        <p className={`mt-2 text-center text-[10px] font-medium leading-tight ${isCompleted ? 'text-emerald-700' : 'text-gray-400'}`}>{step.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cancelled state */}
            {order.status === 'cancelled' && (
              <div className="px-5 py-5 md:px-6">
                <div className="flex items-center gap-3 rounded-xl bg-red-50 px-4 py-3">
                  <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  <p className="text-sm font-medium text-red-700">Pesanan ini telah dibatalkan</p>
                </div>
              </div>
            )}
          </div>

          {/* ═══ Payment Section ═══ */}
          <div className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-4">Pembayaran</p>

            {/* Total - Hero style */}
            <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-4">
              <div>
                <p className="text-[11px] font-medium text-slate-400">Total Pembayaran</p>
                <p className="mt-0.5 text-2xl font-extrabold text-white">{formatRupiah(order.total_price)}</p>
              </div>
              <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                order.status === 'paid' || order.status === 'confirmed' || order.status === 'completed'
                  ? 'bg-emerald-400/20 text-emerald-300'
                  : order.status === 'cancelled' ? 'bg-red-400/20 text-red-300'
                  : 'bg-amber-400/20 text-amber-300'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  order.status === 'paid' || order.status === 'confirmed' || order.status === 'completed'
                    ? 'bg-emerald-400' : order.status === 'cancelled' ? 'bg-red-400' : 'bg-amber-400 animate-pulse'
                }`} />
                {status.label}
              </div>
            </div>

            {/* Payment details */}
            <div className="mt-4 divide-y divide-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-gray-500">Metode Pembayaran</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{order.payment_method?.replace('-', ' ') || '-'}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-gray-500">ID Pesanan</span>
                <span className="font-mono text-xs text-gray-500">{order.id.slice(0, 8)}...</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-gray-500">Tanggal Transaksi</span>
                <span className="text-sm text-gray-700">{orderDate}</span>
              </div>
            </div>
          </div>

          {/* ═══ Actions ═══ */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {order.status === 'pending' && (
              <Link href={`/pembayaran?order=${order.id}`}
                className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary to-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
                Bayar Sekarang
              </Link>
            )}
            <Link href={`/destinasi/${order.destination_slug}`}
              className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-gray-700 shadow-sm ring-1 ring-gray-200 transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/30 hover:text-primary">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
              Jelajahi Destinasi
            </Link>
          </div>

          {/* ═══ Help ═══ */}
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Butuh bantuan?</p>
                <p className="mt-0.5 text-xs text-gray-400">Hubungi tim kami via WhatsApp untuk pertanyaan tentang pesanan ini.</p>
                <Link href="/bantuan" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-700">
                  Hubungi Kami
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
