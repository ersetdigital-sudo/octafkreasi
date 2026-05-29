'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDashboardStats } from '@/lib/admin';
import { formatRupiah } from '@/lib/format';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalDestinations: number;
  totalUsers: number;
  recentOrders: { id: string; total_price: number; status: string; created_at: string; destination_name?: string }[];
}

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'Pending',      cls: 'bg-amber-100 text-amber-700' },
  paid:      { label: 'Lunas',        cls: 'bg-emerald-100 text-emerald-700' },
  confirmed: { label: 'Dikonfirmasi', cls: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Selesai',      cls: 'bg-slate-100 text-slate-600' },
  cancelled: { label: 'Dibatalkan',   cls: 'bg-red-100 text-red-600' },
};

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then((data) => { setStats(data); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl bg-gray-100" />)}
        </div>
        <div className="h-64 rounded-2xl bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-400">Ringkasan performa bisnis</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-gray-400">Live</span>
        </div>
      </div>

      {/* KPI Cards — compact */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Total Pesanan" value={String(stats?.totalOrders || 0)} gradient="from-blue-500 to-indigo-600"
          icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>} />
        <KpiCard label="Revenue" value={formatRupiah(stats?.totalRevenue || 0)} gradient="from-emerald-500 to-teal-600" compact
          icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <KpiCard label="Destinasi" value={String(stats?.totalDestinations || 0)} gradient="from-purple-500 to-violet-600"
          icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>} />
        <KpiCard label="Total User" value={String(stats?.totalUsers || 0)} gradient="from-orange-500 to-amber-600"
          icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">

        {/* Recent Orders — 3 cols */}
        <div className="lg:col-span-3 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between border-b border-gray-50 px-5 py-3.5">
            <div>
              <h2 className="text-sm font-bold text-gray-800">Pesanan Terbaru</h2>
              <p className="text-[10px] text-gray-400">5 transaksi terakhir</p>
            </div>
            <Link href="/admin/pesanan" className="text-[11px] font-semibold text-[#2563FF] hover:underline">Lihat Semua →</Link>
          </div>
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {stats.recentOrders.map((order) => {
                const badge = STATUS_BADGE[order.status] || STATUS_BADGE.pending;
                return (
                  <div key={order.id} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-[#F8FAFF]">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                        <svg className="h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">#{order.id.slice(0, 8)}</p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <p className="text-xs font-bold text-gray-800 whitespace-nowrap">{formatRupiah(order.total_price)}</p>
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${badge.cls}`}>{badge.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center py-10">
              <p className="text-xs text-gray-400">Belum ada pesanan</p>
            </div>
          )}
        </div>

        {/* Right Column — 2 cols */}
        <div className="lg:col-span-2 space-y-4">

          {/* Quick Actions */}
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
            <p className="text-xs font-bold text-gray-700 mb-3">Aksi Cepat</p>
            <div className="space-y-2">
              {[
                { href: '/admin/destinasi', label: 'Tambah Destinasi', desc: 'Buat paket wisata baru', color: 'bg-blue-50 hover:bg-blue-100', icon: <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> },
                { href: '/admin/pesanan', label: 'Kelola Pesanan', desc: 'Update status booking', color: 'bg-emerald-50 hover:bg-emerald-100', icon: <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                { href: '/admin/verifikasi', label: 'Verifikasi Tiket', desc: 'Scan QR check-in', color: 'bg-purple-50 hover:bg-purple-100', icon: <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" /></svg> },
              ].map((action) => (
                <Link key={action.href} href={action.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${action.color}`}>
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                    {action.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800">{action.label}</p>
                    <p className="text-[10px] text-gray-400">{action.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-2xl p-4 text-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #2563FF, #1E40AF)' }}>
            <p className="text-[10px] font-medium text-blue-200">💡 Tips</p>
            <p className="mt-1.5 text-xs font-medium leading-relaxed text-white/90">
              Update status pesanan secara rutin agar customer mendapat notifikasi WhatsApp otomatis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon, gradient, compact }: { label: string; value: string; icon: React.ReactNode; gradient: string; compact?: boolean }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
          <p className={`mt-1.5 font-extrabold text-gray-900 whitespace-nowrap ${compact ? 'text-base' : 'text-xl'}`}>{value}</p>
        </div>
        <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-sm`}>
          {icon}
        </div>
      </div>
      <div className={`absolute -bottom-3 -right-3 h-16 w-16 rounded-full bg-gradient-to-br ${gradient} opacity-[0.04] transition-opacity group-hover:opacity-[0.08]`} />
    </div>
  );
}
