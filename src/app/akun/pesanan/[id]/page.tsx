'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { formatRupiah } from '@/lib/format';

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

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Menunggu Pembayaran', color: 'text-yellow-700', bg: 'bg-yellow-50 ring-1 ring-yellow-200' },
  paid: { label: 'Lunas', color: 'text-green-700', bg: 'bg-green-50 ring-1 ring-green-200' },
  confirmed: { label: 'Dikonfirmasi', color: 'text-blue-700', bg: 'bg-blue-50 ring-1 ring-blue-200' },
  completed: { label: 'Selesai', color: 'text-gray-700', bg: 'bg-gray-50 ring-1 ring-gray-200' },
  cancelled: { label: 'Dibatalkan', color: 'text-red-700', bg: 'bg-red-50 ring-1 ring-red-200' },
};

export default function OrderDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user && orderId) loadOrder();
  }, [user, authLoading, orderId, router]);

  const loadOrder = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) { setLoading(false); return; }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', currentUser.id)  // pastikan order milik user yang login
      .single();

    if (error || !data) {
      setNotFound(true);
    } else {
      setOrder(data as OrderDetail);
    }
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container-app py-16 text-center">
          <div className="mx-auto max-w-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="mt-4 text-sm font-medium text-gray-700">Pesanan tidak ditemukan</p>
            <p className="mt-1 text-xs text-gray-400">Pesanan mungkin sudah dihapus atau ID tidak valid</p>
            <Link href="/akun" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-700">
              ← Kembali ke Profil
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;
  const orderDate = new Date(order.created_at).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container-app py-6 md:py-10">
        {/* Back button */}
        <Link href="/akun" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-700">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Kembali
        </Link>

        <div className="mt-4 mx-auto max-w-2xl">
          {/* Order Header */}
          <div className="rounded-2xl bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-gray-400">ID Pesanan</p>
                <p className="mt-0.5 font-mono text-xs text-gray-500">{order.id}</p>
              </div>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${status.bg} ${status.color}`}>
                {status.label}
              </span>
            </div>

            <div className="mt-5 border-t border-gray-100 pt-5">
              <h1 className="text-lg font-bold text-gray-800">{order.package_name || order.destination_name}</h1>
              <p className="mt-0.5 text-sm text-gray-500">{order.destination_name}</p>
              {order.package_duration && (
                <p className="mt-0.5 text-xs text-gray-400">{order.package_duration}</p>
              )}
            </div>

            {/* Info Grid */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-[10px] font-medium text-gray-400">Tanggal Berangkat</p>
                <p className="mt-0.5 text-sm font-semibold text-gray-700">{order.date || '-'}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-[10px] font-medium text-gray-400">Peserta</p>
                <p className="mt-0.5 text-sm font-semibold text-gray-700">
                  {order.adults} Dewasa{order.children > 0 ? `, ${order.children} Anak` : ''}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-[10px] font-medium text-gray-400">Tanggal Pesan</p>
                <p className="mt-0.5 text-sm font-semibold text-gray-700">{orderDate}</p>
              </div>
            </div>

            {/* Customer Info */}
            {(order.customer_name || order.customer_email) && (
              <div className="mt-5 border-t border-gray-100 pt-5">
                <p className="text-xs font-semibold text-gray-500 mb-2">Informasi Pemesan</p>
                <div className="space-y-1 text-sm text-gray-600">
                  {order.customer_name && <p>{order.customer_name}</p>}
                  {order.customer_email && <p>{order.customer_email}</p>}
                </div>
              </div>
            )}

            {/* Payment Info */}
            <div className="mt-5 border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500">Total Pembayaran</p>
                  <p className="mt-1 text-xl font-bold text-primary">{formatRupiah(order.total_price)}</p>
                </div>
                {order.payment_method && (
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Metode</p>
                    <p className="mt-0.5 text-sm font-medium text-gray-600 capitalize">
                      {order.payment_method.replace('-', ' ')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 border-t border-gray-100 pt-5 flex flex-col gap-3 sm:flex-row">
              {order.status === 'pending' && (
                <Link
                  href={`/pembayaran?order=${order.id}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                  Bayar Sekarang
                </Link>
              )}
              <Link
                href={`/destinasi/${order.destination_slug}`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Lihat Destinasi
              </Link>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Butuh bantuan?</p>
                <p className="mt-0.5 text-xs text-gray-400">
                  Hubungi tim kami via WhatsApp jika ada pertanyaan tentang pesanan ini.
                </p>
                <Link
                  href="/bantuan"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-700"
                >
                  Hubungi Kami
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
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
