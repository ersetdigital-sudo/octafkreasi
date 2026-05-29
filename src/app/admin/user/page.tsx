'use client';

import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { formatRupiah } from '@/lib/format';

// ── Types ──────────────────────────────────────────────────────────────
interface UserProfile {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
  email?: string;
  phone?: string;
  status?: string;
}

interface Order {
  id: string;
  total_price: number;
  destination_name: string;
  status: string;
  created_at: string;
}

interface UserWithStats extends UserProfile {
  total_orders: number;
  total_spent: number;
  last_trip: string | null;
}

// ── Badge System ───────────────────────────────────────────────────────
function getMemberBadge(totalSpent: number): { label: string; color: string; bg: string } {
  if (totalSpent >= 25000000) return { label: 'VIP', color: 'text-amber-700', bg: 'bg-amber-50 ring-amber-200' };
  if (totalSpent >= 10000000) return { label: 'Gold', color: 'text-yellow-700', bg: 'bg-yellow-50 ring-yellow-200' };
  if (totalSpent >= 5000000) return { label: 'Silver', color: 'text-slate-600', bg: 'bg-slate-50 ring-slate-200' };
  return { label: 'Regular', color: 'text-gray-600', bg: 'bg-gray-50 ring-gray-200' };
}

// ── Stat Card ──────────────────────────────────────────────────────────
function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: number; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        <p className="text-[11px] text-gray-500">{label}</p>
      </div>
    </div>
  );
}

// ── Action Menu ────────────────────────────────────────────────────────
function ActionMenu({ user, onViewDetail, onViewOrders, onToggleStatus, onChangeRole, onDelete }: {
  user: UserWithStats;
  onViewDetail: () => void;
  onViewOrders: () => void;
  onToggleStatus: () => void;
  onChangeRole: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-30 w-44 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
          <button type="button" onClick={() => { setOpen(false); onViewDetail(); }} className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-[13px] text-gray-700 hover:bg-gray-50">
            <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Lihat Detail
          </button>
          <button type="button" onClick={() => { setOpen(false); onViewOrders(); }} className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-[13px] text-gray-700 hover:bg-gray-50">
            <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>
            Lihat Pesanan
          </button>
          <div className="my-1 border-t border-gray-100" />
          <button type="button" onClick={() => { setOpen(false); onChangeRole(); }} className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-[13px] text-gray-700 hover:bg-gray-50">
            <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Ubah Role
          </button>
          <button type="button" onClick={() => { setOpen(false); onToggleStatus(); }} className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-[13px] text-red-600 hover:bg-red-50">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
            {user.status === 'inactive' ? 'Aktifkan User' : 'Nonaktifkan User'}
          </button>
          <button type="button" onClick={() => { setOpen(false); onDelete(); }} className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-[13px] text-red-600 hover:bg-red-50">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
            Hapus User
          </button>
        </div>
      )}
    </div>
  );
}

// ── User Detail Modal ──────────────────────────────────────────────────
function UserDetailModal({ user, orders, onClose }: { user: UserWithStats; orders: Order[]; onClose: () => void }) {
  const badge = getMemberBadge(user.total_spent);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full flex-col overflow-y-auto bg-white shadow-2xl md:w-[440px]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <h2 className="text-sm font-bold text-gray-900">Detail User</h2>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 space-y-5 p-6">
          {/* Profile Card */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-600">
              {(user.full_name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-base font-bold text-gray-900">{user.full_name || 'User'}</p>
              <p className="text-xs text-gray-500">{user.email || '-'}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${badge.bg} ${badge.color}`}>{badge.label}</span>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 ring-purple-200' : 'bg-blue-50 text-blue-700 ring-blue-200'}`}>{user.role}</span>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="rounded-xl border border-gray-100 divide-y divide-gray-50">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-gray-500">WhatsApp</span>
              <span className="text-sm font-medium text-gray-900">{user.phone || '-'}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-gray-500">Status Akun</span>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${user.status === 'inactive' ? 'bg-gray-50 text-gray-500 ring-gray-200' : 'bg-emerald-50 text-emerald-700 ring-emerald-200'}`}>
                {user.status === 'inactive' ? 'Nonaktif' : 'Aktif'}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-gray-500">Tanggal Daftar</span>
              <span className="text-sm text-gray-900">{new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Customer Value */}
          <div className="rounded-xl border border-gray-100 divide-y divide-gray-50">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-gray-500">Total Pesanan</span>
              <span className="text-sm font-bold text-gray-900">{user.total_orders} Pesanan</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-gray-500">Total Pengeluaran</span>
              <span className="text-sm font-bold text-gray-900">{formatRupiah(user.total_spent)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-gray-500">Trip Terakhir</span>
              <span className="text-sm text-gray-900">{user.last_trip || '-'}</span>
            </div>
          </div>

          {/* Recent Orders */}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Pesanan Terakhir</p>
            {orders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-400">Belum ada pesanan</div>
            ) : (
              <div className="space-y-2">
                {orders.slice(0, 5).map((o) => (
                  <div key={o.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5">
                    <div>
                      <p className="text-xs font-medium text-gray-900">{o.destination_name}</p>
                      <p className="text-[11px] text-gray-400">{new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <p className="text-xs font-bold text-gray-900">{formatRupiah(o.total_price)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function AdminUserPage() {
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    // Fetch profiles
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    // Fetch all orders for stats
    const { data: orders } = await supabase.from('orders').select('id, user_id, total_price, destination_name, status, created_at');

    const orderMap = new Map<string, Order[]>();
    (orders || []).forEach((o: Order & { user_id: string }) => {
      const list = orderMap.get(o.user_id) || [];
      list.push(o);
      orderMap.set(o.user_id, list);
    });

    const enriched: UserWithStats[] = (profiles || []).map((p: UserProfile) => {
      const userOrders = orderMap.get(p.id) || [];
      const completedOrders = userOrders.filter(o => o.status !== 'cancelled');
      const totalSpent = completedOrders.reduce((sum, o) => sum + (o.total_price || 0), 0);
      const sorted = [...completedOrders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return {
        ...p,
        total_orders: completedOrders.length,
        total_spent: totalSpent,
        last_trip: sorted[0]?.destination_name || null,
      };
    });

    setUsers(enriched);
    setLoading(false);
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleViewDetail = async (user: UserWithStats) => {
    setSelectedUser(user);
    const { data } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setUserOrders(data || []);
  };

  const handleChangeRole = async (user: UserWithStats) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    if (!confirm(`Ubah role ${user.full_name} menjadi ${newRole}?`)) return;
    await supabase.from('profiles').update({ role: newRole }).eq('id', user.id);
    showToast(`Role diubah ke ${newRole}`);
    loadData();
  };

  const handleToggleStatus = async (user: UserWithStats) => {
    const newStatus = user.status === 'inactive' ? 'active' : 'inactive';
    if (!confirm(`${newStatus === 'inactive' ? 'Nonaktifkan' : 'Aktifkan'} user ${user.full_name}?`)) return;
    await supabase.from('profiles').update({ status: newStatus }).eq('id', user.id);
    showToast(`User ${newStatus === 'inactive' ? 'dinonaktifkan' : 'diaktifkan'}`);
    loadData();
  };

  const handleDeleteUser = async (user: UserWithStats) => {
    if (!confirm(`Hapus user "${user.full_name}"? Data profile akan dihapus permanen.`)) return;
    await supabase.from('profiles').delete().eq('id', user.id);
    showToast(`User ${user.full_name} dihapus`);
    loadData();
  };

  // Stats
  const totalUsers = users.length;
  const totalCustomers = users.filter(u => u.role === 'customer').length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;
  const thisMonth = new Date();
  const newThisMonth = users.filter(u => {
    const d = new Date(u.created_at);
    return d.getMonth() === thisMonth.getMonth() && d.getFullYear() === thisMonth.getFullYear();
  }).length;

  // Filter & Sort
  let filtered = users.filter((u) =>
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );
  if (roleFilter !== 'all') filtered = filtered.filter(u => u.role === roleFilter);

  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'orders': return b.total_orders - a.total_orders;
      case 'spent': return b.total_spent - a.total_spent;
      case 'name': return (a.full_name || '').localeCompare(b.full_name || '');
      default: return 0;
    }
  });

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed right-5 top-5 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-xl">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
          {toast}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Kelola User</h1>
        <p className="text-xs text-gray-500">Customer management & insight</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={<svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>}
          value={totalUsers} label="Total User" color="bg-blue-50"
        />
        <StatCard
          icon={<svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
          value={totalCustomers} label="Customer" color="bg-emerald-50"
        />
        <StatCard
          icon={<svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>}
          value={totalAdmins} label="Admin" color="bg-purple-50"
        />
        <StatCard
          icon={<svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>}
          value={newThisMonth} label="Baru bulan ini" color="bg-amber-50"
        />
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau email..." className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm shadow-sm focus:border-blue-500 focus:outline-none" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none">
          <option value="all">Semua Role</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none">
          <option value="newest">Terbaru</option>
          <option value="orders">Total Pesanan</option>
          <option value="spent">Total Pengeluaran</option>
          <option value="name">Nama A-Z</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/80">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Nama</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Email</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">Pesanan</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">Pengeluaran</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">Role</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Bergabung</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3"><div className="h-4 w-28 rounded bg-gray-100" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-36 rounded bg-gray-100" /></td>
                  <td className="px-4 py-3"><div className="mx-auto h-4 w-8 rounded bg-gray-100" /></td>
                  <td className="px-4 py-3"><div className="ml-auto h-4 w-24 rounded bg-gray-100" /></td>
                  <td className="px-4 py-3"><div className="mx-auto h-4 w-16 rounded bg-gray-100" /></td>
                  <td className="px-4 py-3"><div className="mx-auto h-4 w-14 rounded bg-gray-100" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-20 rounded bg-gray-100" /></td>
                  <td className="px-4 py-3"><div className="mx-auto h-4 w-6 rounded bg-gray-100" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">Tidak ada user ditemukan</td></tr>
            ) : (
              filtered.map((user) => {
                const badge = getMemberBadge(user.total_spent);
                return (
                  <tr key={user.id} className="transition-colors hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                          {(user.full_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-gray-900">{user.full_name || 'User'}</p>
                          {user.total_spent > 0 && (
                            <span className={`inline-flex items-center rounded-full px-1.5 py-0 text-[9px] font-semibold ring-1 ${badge.bg} ${badge.color}`}>{badge.label}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-gray-600">{user.email || '-'}</td>
                    <td className="px-4 py-3 text-center text-[13px] font-medium text-gray-900">{user.total_orders}</td>
                    <td className="px-4 py-3 text-right text-[13px] font-medium text-gray-900">{user.total_spent > 0 ? formatRupiah(user.total_spent) : '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>{user.role}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${user.status === 'inactive' ? 'bg-gray-100 text-gray-500' : 'bg-emerald-50 text-emerald-700'}`}>
                        {user.status === 'inactive' ? 'Nonaktif' : 'Aktif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-gray-500">{new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-4 py-3 text-center">
                      <ActionMenu user={user} onViewDetail={() => handleViewDetail(user)} onViewOrders={() => handleViewDetail(user)} onToggleStatus={() => handleToggleStatus(user)} onChangeRole={() => handleChangeRole(user)} onDelete={() => handleDeleteUser(user)} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-28 rounded bg-gray-100" />
                  <div className="h-3 w-40 rounded bg-gray-100" />
                </div>
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white px-4 py-12 text-center text-sm text-gray-400 shadow-sm">Tidak ada user ditemukan</div>
        ) : (
          filtered.map((user) => {
            const badge = getMemberBadge(user.total_spent);
            return (
              <div key={user.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                      {(user.full_name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.full_name || 'User'}</p>
                      <p className="text-[11px] text-gray-500">{user.email || '-'}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        {user.total_spent > 0 && <span className={`inline-flex rounded-full px-1.5 py-0 text-[9px] font-semibold ring-1 ${badge.bg} ${badge.color}`}>{badge.label}</span>}
                        <span className={`inline-flex rounded-full px-1.5 py-0 text-[9px] font-semibold ${user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>{user.role}</span>
                        <span className={`inline-flex rounded-full px-1.5 py-0 text-[9px] font-semibold ${user.status === 'inactive' ? 'bg-gray-100 text-gray-500' : 'bg-emerald-50 text-emerald-700'}`}>
                          {user.status === 'inactive' ? 'Nonaktif' : 'Aktif'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ActionMenu user={user} onViewDetail={() => handleViewDetail(user)} onViewOrders={() => handleViewDetail(user)} onToggleStatus={() => handleToggleStatus(user)} onChangeRole={() => handleChangeRole(user)} onDelete={() => handleDeleteUser(user)} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-2.5">
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-900">{user.total_orders}</p>
                    <p className="text-[10px] text-gray-500">Pesanan</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-900">{user.total_spent > 0 ? formatRupiah(user.total_spent) : '-'}</p>
                    <p className="text-[10px] text-gray-500">Pengeluaran</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-900 truncate">{user.last_trip || '-'}</p>
                    <p className="text-[10px] text-gray-500">Trip Terakhir</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      {selectedUser && (
        <UserDetailModal user={selectedUser} orders={userOrders} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}
