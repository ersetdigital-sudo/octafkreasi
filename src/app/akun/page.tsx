/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/lib/auth-context';
import { getOrders, type Order } from '@/lib/orders';
import { getWishlists, removeFromWishlist, type WishlistItem } from '@/lib/wishlist';
import { supabase } from '@/lib/supabase';
import { formatRupiah } from '@/lib/format';
import { destinations } from '@/data/destinations';

type TabKey = 'overview' | 'wishlist' | 'ulasan';

const statusLabels: Record<string, { label: string; color: string; dot: string }> = {
  pending: { label: 'Menunggu', color: 'bg-amber-50 text-amber-700 ring-amber-200', dot: 'bg-amber-400' },
  paid: { label: 'Lunas', color: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-400' },
  confirmed: { label: 'Dikonfirmasi', color: 'bg-blue-50 text-blue-700 ring-blue-200', dot: 'bg-blue-400' },
  completed: { label: 'Selesai', color: 'bg-slate-50 text-slate-600 ring-slate-200', dot: 'bg-slate-400' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-50 text-red-600 ring-red-200', dot: 'bg-red-400' },
};

function getMemberStatus(count: number) {
  if (count >= 10) return { label: 'Gold Traveler', icon: '✈️' };
  if (count >= 3) return { label: 'Explorer', icon: '🌟' };
  return { label: 'New Traveler', icon: '👋' };
}

export default function AkunPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlists, setWishlists] = useState<WishlistItem[]>([]);
  const [reviews, setReviews] = useState<{ id: string; destination_id: string | null; author: string; rating: number; content: string; status: string; date: string; created_at: string }[]>([]);
  const [checkedInTickets, setCheckedInTickets] = useState<{ destination_name: string; ticket_status: string }[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return; }
    if (user) loadData();
  }, [user, loading, router]);

  const loadData = async () => {
    setDataLoading(true);
    const [ordersData, wishlistData] = await Promise.all([getOrders(), getWishlists()]);
    setOrders(ordersData);
    setWishlists(wishlistData);
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser) {
      const [reviewsRes, ticketsRes] = await Promise.all([
        supabase.from('reviews').select('id, destination_id, author, content, rating, status, date, created_at').eq('user_id', currentUser.id).order('created_at', { ascending: false }),
        supabase.from('tickets').select('destination_name, ticket_status').eq('user_id', currentUser.id),
      ]);
      setReviews(reviewsRes.data || []);
      setCheckedInTickets(ticketsRes.data || []);
    }
    setDataLoading(false);
  };

  const handleRemoveWishlist = async (slug: string) => {
    const success = await removeFromWishlist(slug);
    if (success) setWishlists((prev) => prev.filter((w) => w.destination_slug !== slug));
  };

  const handleLogout = async () => { await signOut(); router.push('/'); };

  if (loading || dataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 animate-ping rounded-full bg-blue-400/30" />
            <div className="relative h-10 w-10 animate-spin rounded-full border-[3px] border-slate-100 border-t-blue-600" />
          </div>
          <p className="text-sm font-medium text-slate-400">Memuat perjalananmu...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const userName = user.user_metadata?.full_name || 'Traveler';
  const userAvatar = user.user_metadata?.avatar_url || '';
  const userInitial = userName.charAt(0).toUpperCase();

  // ── Trip status logic ──────────────────────────────────────────────────────
  // Active = paid/confirmed (belum check-in, belum selesai)
  const activeOrders = orders.filter(o => o.status === 'paid' || o.status === 'confirmed');
  const upcomingTrip = activeOrders[0] ?? null;
  const upcomingTripImage = upcomingTrip
    ? destinations.find(d => d.slug === upcomingTrip.destination_slug)?.image ?? null
    : null;

  // ── Stats ──────────────────────────────────────────────────────────────────
  // Tiket Aktif = tiket yang belum check-in (bukan 'used', bukan 'cancelled')
  const activeTickets = checkedInTickets.filter(
    t => t.ticket_status !== 'used' && t.ticket_status !== 'cancelled' && t.ticket_status !== 'completed' && t.ticket_status !== 'checked_in'
  ).length;

  // Total Trip & Kota = dari tickets yang sudah used/completed
  const usedTickets = checkedInTickets.filter(
    t => t.ticket_status === 'used' || t.ticket_status === 'completed' || t.ticket_status === 'checked_in'
  );
  // Fallback: jika tickets table kosong, hitung dari orders completed
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalTrips = usedTickets.length > 0 ? usedTickets.length : completedOrders.length;
  const citiesVisited = usedTickets.length > 0
    ? new Set(usedTickets.map(t => t.destination_name)).size
    : new Set(completedOrders.map(o => o.destination_name)).size;

  // Member status berdasarkan total trip (completed + active)
  const memberStatus = getMemberStatus(totalTrips + activeOrders.length);

  // ── Dynamic empty state messages ──────────────────────────────────────────
  const emptyHeroMessages = [
    { title: 'Siap untuk petualangan berikutnya?', sub: 'Temukan destinasi impianmu sekarang' },
    { title: 'Ke mana perjalananmu selanjutnya?', sub: 'Ratusan destinasi menunggumu' },
    { title: 'Saatnya menjelajah lagi 👋', sub: 'Buat kenangan baru yang tak terlupakan' },
  ];
  const heroMsg = emptyHeroMessages[Math.floor((orders.length) % emptyHeroMessages.length)];

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { key: 'wishlist', label: 'Wishlist', icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' },
    { key: 'ulasan', label: 'Ulasan', icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <Header />
      <main className="container-app py-6 md:py-10">

        {/* === GREETING HEADER === */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative h-11 w-11 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 ring-[3px] ring-white">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-base font-bold text-white">{userInitial}</span>
              )}
            </div>
            <div>
              <p className="text-base font-bold text-slate-900 md:text-lg">Halo, {userName.split(' ')[0]} 👋</p>
              <p className="text-xs text-slate-400 md:text-sm">Ready for your next journey?</p>
            </div>
          </div>
          <button type="button" onClick={() => setShowEditModal(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-100 transition-all hover:text-slate-600 hover:shadow-md hover:ring-slate-200">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* === HERO: UPCOMING TRIP or EMPTY TRAVEL STATE === */}
        <div className="mt-6 overflow-hidden rounded-[28px] shadow-2xl shadow-slate-900/20">
          <div className="relative min-h-[200px] bg-gradient-to-br from-[#0a1628] via-[#0f2040] to-[#1a3a6b] px-6 py-8 md:px-8 md:py-10">
            {/* Background image — less dark overlay for more visibility */}
            <img
              src={upcomingTripImage || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=85'}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-40"
              style={{ filter: 'blur(0px)' }}
            />
            {/* Gradient overlay — lighter than before */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/70 via-[#0f2040]/60 to-[#1a3a6b]/65" />
            {/* Noise texture */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.65%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E")' }} />
            {/* Glow */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#2563FF]/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative">
              {upcomingTrip ? (
                <>
                  <div className="flex items-center gap-2 mb-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.1] px-3 py-1.5 text-[11px] font-semibold text-white/80 backdrop-blur-sm ring-1 ring-white/[0.12]">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Perjalanan Berikutnya
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${
                      upcomingTrip.status === 'confirmed'
                        ? 'bg-blue-400/15 text-blue-200 ring-blue-400/25'
                        : 'bg-emerald-400/15 text-emerald-200 ring-emerald-400/25'
                    }`}>
                      {upcomingTrip.status === 'confirmed' ? '✓ Dikonfirmasi' : '✓ Lunas'}
                    </span>
                  </div>
                  <h3 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl" style={{ lineHeight: 1.15 }}>{upcomingTrip.destination_name}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-blue-100/50">{upcomingTrip.package_name || 'Paket Perjalanan'}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 rounded-xl bg-white/[0.08] px-3.5 py-2 backdrop-blur-sm ring-1 ring-white/[0.08]">
                      <svg className="h-3.5 w-3.5 text-blue-300/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      <span className="text-xs font-semibold text-white/80">{upcomingTrip.date || 'Segera'}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white/[0.08] px-3.5 py-2 backdrop-blur-sm ring-1 ring-white/[0.08]">
                      <svg className="h-3.5 w-3.5 text-blue-300/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-1.997m0 0A8.96 8.96 0 0112 15a8.966 8.966 0 00-5.982 2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-xs font-semibold text-white/80">{upcomingTrip.adults + (upcomingTrip.children || 0)} peserta</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.1] px-3 py-1.5 text-[11px] font-semibold text-white/60 backdrop-blur-sm ring-1 ring-white/[0.1] mb-5">
                    <svg className="h-3 w-3 text-[#2563FF]/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                    Jelajahi Dunia
                  </span>
                  <h3 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl" style={{ lineHeight: 1.2 }}>{heroMsg.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-blue-100/50">{heroMsg.sub}</p>
                  <div className="mt-7">
                    <Link href="/destinasi"
                      className="inline-flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#2563FF]/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#2563FF]/40"
                      style={{ background: 'linear-gradient(135deg, #2563FF 0%, #1E40AF 100%)' }}>
                      Jelajahi Destinasi
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* === STATS CARDS === */}
        <div className="mt-5 grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3">
          <div className="rounded-2xl bg-white p-3.5 md:p-4 shadow-sm ring-1 ring-slate-900/[0.04] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-xl text-base md:text-lg" style={{ background: 'linear-gradient(135deg, #EFF6FF, #EEF2FF)' }}>🎫</div>
            <p className="mt-2.5 text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap">{activeTickets}</p>
            <p className="mt-0.5 text-[10px] md:text-[11px] font-semibold text-slate-500">Tiket Aktif</p>
            <p className="mt-1 text-[9px] md:text-[10px] text-slate-300 whitespace-nowrap">{activeTickets === 0 ? 'Tidak ada trip aktif' : `${activeTickets} trip menunggu`}</p>
          </div>
          <div className="rounded-2xl bg-white p-3.5 md:p-4 shadow-sm ring-1 ring-slate-900/[0.04] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-xl text-base md:text-lg" style={{ background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)' }}>✈️</div>
            <p className="mt-2.5 text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap">{totalTrips}</p>
            <p className="mt-0.5 text-[10px] md:text-[11px] font-semibold text-slate-500">Total Trip</p>
            <p className="mt-1 text-[9px] md:text-[10px] text-slate-300 whitespace-nowrap">{totalTrips === 0 ? 'Belum ada trip selesai' : `+${totalTrips} selesai`}</p>
          </div>
          <div className="rounded-2xl bg-white p-3.5 md:p-4 shadow-sm ring-1 ring-slate-900/[0.04] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-xl text-base md:text-lg" style={{ background: 'linear-gradient(135deg, #ECFDF5, #F0FDFA)' }}>🌍</div>
            <p className="mt-2.5 text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap">{citiesVisited}</p>
            <p className="mt-0.5 text-[10px] md:text-[11px] font-semibold text-slate-500">Kota Dikunjungi</p>
            <p className="mt-1 text-[9px] md:text-[10px] text-slate-300 whitespace-nowrap">{citiesVisited === 0 ? 'Jelajahi Indonesia' : 'Indonesia'}</p>
          </div>
          <div className="rounded-2xl bg-white p-3.5 md:p-4 shadow-sm ring-1 ring-slate-900/[0.04] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-xl text-base md:text-lg" style={{ background: 'linear-gradient(135deg, #FFFBEB, #FFF7ED)' }}>{memberStatus.icon}</div>
            <p className="mt-2.5 text-xs md:text-sm font-extrabold text-slate-900 whitespace-nowrap">{memberStatus.label}</p>
            <p className="mt-0.5 text-[10px] md:text-[11px] font-semibold text-slate-500">Member Status</p>
            <p className="mt-1 text-[9px] md:text-[10px] text-slate-300 whitespace-nowrap">{totalTrips >= 10 ? 'Level Tertinggi' : totalTrips >= 3 ? 'Level 2' : 'Level 1'}</p>
          </div>
        </div>

        {/* === E-TICKET QUICK ACCESS — Compact === */}
        {activeTickets > 0 && (
          <Link href="/akun/tiket"
            className="group mt-5 flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#1e3a6b] to-[#3b5998] px-5 py-3.5 shadow-md shadow-blue-900/10 ring-1 ring-white/5 transition-all hover:shadow-lg hover:shadow-blue-900/15 hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                <svg className="h-4 w-4 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{activeTickets} E-Tiket Aktif</p>
                <p className="text-[11px] text-blue-200/60">Tap untuk buka tiket</p>
              </div>
            </div>
            <svg className="h-4 w-4 text-white/50 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        )}

        {/* === TAB NAVIGATION — Modern Floating === */}
        <div className="mt-8 rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/[0.04]">
          <div className="border-b border-slate-100/80 px-1.5 pt-1.5">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
                  className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 md:p-6">
            {activeTab === 'overview' && <TabOverview orders={orders} />}
            {activeTab === 'wishlist' && <TabWishlist wishlists={wishlists} onRemove={handleRemoveWishlist} />}
            {activeTab === 'ulasan' && <TabUlasan reviews={reviews} orders={orders} onReviewSaved={loadData} />}
          </div>
        </div>
      </main>

      {/* Minimal Footer for dashboard */}
      <footer className="border-t border-slate-100 bg-white pb-20 md:pb-0">
        <div className="container-app py-5">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <Link href="/" className="flex items-center gap-2">
              <img src="https://res.cloudinary.com/dqjh7utdb/image/upload/e_background_removal/f_png/v1779950494/owbbuyhkedcppgjiaeyo.jpg" alt="Octaf Kreasi" className="h-7 w-auto" />
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/bantuan" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Bantuan</Link>
              <Link href="/privasi" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Privasi</Link>
              <span className="text-xs text-slate-300">© 2025 octafkreasi</span>
            </div>
          </div>
        </div>
      </footer>

      {showEditModal && (
        <EditProfileModal user={user} onClose={() => setShowEditModal(false)} onSaved={loadData} />
      )}
    </div>
  );
}

/* ============ TAB OVERVIEW ============ */
function TabOverview({ orders }: { orders: Order[] }) {
  const recentOrders = orders.slice(0, 5);
  if (recentOrders.length === 0) {
    return (
      <EmptyState
        title="Mulai petualanganmu"
        description="Jelajahi destinasi dan pesan perjalanan pertamamu"
        actionLabel="Jelajahi Destinasi"
        actionHref="/destinasi"
      />
    );
  }

  const destImages: Record<string, string> = {
    'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=120&q=80',
    'raja-ampat': 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=120&q=80',
    'labuan-bajo': 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=120&q=80',
    'yogyakarta': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=120&q=80',
    'lombok': 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=120&q=80',
    'bromo': 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=120&q=80',
    'wakatobi': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=120&q=80',
  };

  return (
    <div>
      <p className="text-sm font-bold text-slate-800 mb-4">Riwayat Perjalanan</p>

      {/* Desktop layout — luxury horizontal cards */}
      <div className="hidden sm:block space-y-2.5">
        {recentOrders.map((order) => {
          const status = statusLabels[order.status] || statusLabels.pending;
          const thumb = destImages[order.destination_slug] || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&q=80`;
          return (
            <Link key={order.id} href={`/akun/pesanan/${order.id}`}
              className="group flex items-center gap-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-900/[0.04] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-slate-200">
              {/* Thumbnail — cinematic */}
              <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl">
                <img src={thumb} alt={order.destination_name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
              </div>
              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <p className="text-[15px] font-bold text-slate-800 truncate">{order.destination_name}</p>
                  <span className="shrink-0 rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 ring-1 ring-slate-100">Indonesia</span>
                </div>
                <div className="flex items-center gap-2.5 mt-1">
                  <div className="flex items-center gap-1.5">
                    <svg className="h-3 w-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <p className="text-xs text-slate-400">{order.date || new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>
              {/* Price */}
              <p className="text-sm font-bold text-[#2563FF] whitespace-nowrap">{formatRupiah(order.total_price)}</p>
              {/* Status */}
              <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ring-1 ${status.color}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
              {/* Arrow */}
              <svg className="h-4 w-4 text-slate-200 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          );
        })}
      </div>

      {/* Mobile layout — luxury stacked cards */}
      <div className="sm:hidden space-y-3">
        {recentOrders.map((order) => {
          const status = statusLabels[order.status] || statusLabels.pending;
          const thumb = destImages[order.destination_slug] || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&q=80`;
          return (
            <Link key={order.id} href={`/akun/pesanan/${order.id}`}
              className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/[0.04] transition-all duration-200 active:scale-[0.97]">
              {/* Top: Image banner + overlay info */}
              <div className="relative h-28 overflow-hidden">
                <img src={thumb} alt={order.destination_name} className="h-full w-full object-cover transition-transform duration-500 group-active:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                {/* Destination name on image */}
                <div className="absolute bottom-0 left-0 right-0 p-3.5">
                  <p className="text-base font-bold text-white tracking-tight leading-tight">{order.destination_name}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-white/60">Indonesia</p>
                </div>
                {/* Status badge top-right */}
                <span className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm ring-1 ${status.color}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              </div>
              {/* Bottom: Details */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <svg className="h-3.5 w-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <p className="text-xs text-slate-400">
                    {order.date || new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <p className="text-sm font-bold text-[#2563FF] whitespace-nowrap">{formatRupiah(order.total_price)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ============ TAB WISHLIST ============ */
function TabWishlist({ wishlists, onRemove }: { wishlists: WishlistItem[]; onRemove: (slug: string) => void }) {
  if (wishlists.length === 0) {
    return (
      <EmptyState
        title="Wishlist kosong"
        description="Simpan destinasi favoritmu di sini"
        actionLabel="Jelajahi Destinasi"
        actionHref="/destinasi"
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {wishlists.map((item) => (
        <div key={item.id} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all hover:shadow-md">
          <div className="relative h-32 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
            {item.destination_image ? (
              <img src={item.destination_image} alt={item.destination_name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <svg className="h-8 w-8 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
            )}
            <button type="button" onClick={() => onRemove(item.destination_slug)}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm backdrop-blur-sm transition-transform hover:scale-110" title="Hapus">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
          </div>
          <div className="p-3.5">
            <p className="text-sm font-semibold text-slate-700">{item.destination_name}</p>
            <Link href={`/destinasi/${item.destination_slug}`}
              className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-primary-700">
              Pesan Sekarang
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============ TAB ULASAN ============ */
const DEST_IMAGES: Record<string, string> = {
  'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=200&q=80',
  'raja-ampat': 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=200&q=80',
  'labuan-bajo': 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=200&q=80',
  'yogyakarta': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=200&q=80',
  'lombok': 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=200&q=80',
  'bromo': 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=200&q=80',
  'wakatobi': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&q=80',
};

const RATING_LABELS: Record<number, string> = {
  1: 'Buruk', 2: 'Kurang Memuaskan', 3: 'Cukup', 4: 'Menyenangkan', 5: 'Luar Biasa',
};

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button key={star} type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className={`transition-all duration-150 ${filled ? 'scale-110' : 'scale-100'}`}>
            <svg className={`h-8 w-8 transition-colors duration-150 ${filled ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]' : 'text-slate-200'}`}
              fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        );
      })}
      {(hovered || value) > 0 && (
        <span className="ml-1 text-sm font-semibold text-amber-500">{RATING_LABELS[hovered || value]}</span>
      )}
    </div>
  );
}

function ReviewBottomSheet({ order, existingReview, onClose, onSaved }: {
  order: Order;
  existingReview?: { id: string; rating: number; content: string } | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [content, setContent] = useState(existingReview?.content || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const isValid = rating > 0 && content.trim().length >= 20;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    if (existingReview) {
      await supabase.from('reviews').update({ rating, content: content.trim() }).eq('id', existingReview.id);
    } else {
      // Fetch destination_id dari slug
      const { data: destData } = await supabase
        .from('destinations')
        .select('id')
        .eq('slug', order.destination_slug)
        .single();

      const { error: insertError } = await supabase.from('reviews').insert({
        user_id: user.id,
        destination_id: destData?.id || null,
        author: user.user_metadata?.full_name || 'Traveler',
        rating,
        content: content.trim(),
        status: 'pending',
        date: new Date().toISOString(),
        helpful: 0,
      });

      if (insertError) {
        console.error('Insert review error:', insertError);
        setSaving(false);
        return;
      }
    }
    setSaving(false);
    setSuccess(true);
    setTimeout(() => { onSaved(); onClose(); }, 2000);
  };

  const headings = [
    `Bagaimana pengalamanmu di ${order.destination_name}?`,
    `Ceritakan perjalananmu ke ${order.destination_name} ✨`,
    `Gimana seru-nya di ${order.destination_name}? 🌟`,
  ];
  const heading = headings[order.id.charCodeAt(0) % headings.length];

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full animate-[slideUp_0.3s_ease-out] rounded-t-3xl bg-white shadow-2xl md:max-w-lg md:rounded-3xl">
        {/* Drag indicator */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="h-1 w-10 rounded-full bg-slate-200" />
        </div>

        {success ? (
          /* Success state */
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-100 animate-[bounceIn_0.5s_ease-out]">
              <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <p className="mt-4 text-lg font-bold text-slate-800">Ulasan Terkirim!</p>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Terima kasih telah membagikan pengalaman perjalananmu ✨
            </p>
          </div>
        ) : (
          <div className="px-6 pb-8 pt-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1 pr-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#2563FF]">{order.destination_name}</p>
                <h3 className="mt-1 text-base font-bold text-slate-800 leading-snug">{heading}</h3>
              </div>
              <button type="button" onClick={onClose}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Star Rating */}
            <div className="mb-5">
              <p className="mb-2.5 text-xs font-semibold text-slate-500">Rating Perjalanan</p>
              <StarRating value={rating} onChange={setRating} />
              {rating === 0 && <p className="mt-1.5 text-xs text-slate-300">Pilih rating untuk melanjutkan</p>}
            </div>

            {/* Textarea */}
            <div className="mb-5">
              <p className="mb-2 text-xs font-semibold text-slate-500">Ceritakan Pengalamanmu</p>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, 500))}
                placeholder="Ceritakan pengalaman, pelayanan, atau hal menarik selama perjalanan..."
                rows={4}
                className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 transition-all focus:border-[#2563FF] focus:outline-none focus:ring-2 focus:ring-[#2563FF]/15"
              />
              <div className="mt-1.5 flex items-center justify-between">
                <p className={`text-xs ${content.length < 20 ? 'text-slate-300' : 'text-emerald-500'}`}>
                  {content.length < 20 ? `Minimal ${20 - content.length} karakter lagi` : '✓ Cukup'}
                </p>
                <p className="text-xs text-slate-300">{content.length}/500</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button type="button" onClick={onClose}
                className="flex-shrink-0 rounded-2xl px-5 py-3 text-sm font-medium text-slate-400 transition-colors hover:text-slate-600">
                Batal
              </button>
              <button type="button" onClick={handleSubmit} disabled={!isValid || saving}
                className="flex-1 rounded-2xl py-3 text-sm font-bold text-white shadow-lg shadow-[#2563FF]/25 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-40 disabled:translate-y-0 disabled:shadow-none"
                style={{ background: 'linear-gradient(135deg, #2563FF, #1E40AF)' }}>
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Mengirim...
                  </span>
                ) : existingReview ? 'Simpan Perubahan' : 'Kirim Ulasan'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TabUlasan({ reviews, orders, onReviewSaved }: {
  reviews: { id: string; destination_id: string | null; author: string; rating: number; content: string; status: string; date: string; created_at: string }[];
  orders: Order[];
  onReviewSaved: () => void;
}) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editReview, setEditReview] = useState<{ id: string; rating: number; content: string } | null>(null);

  const completedOrders = orders.filter(o => o.status === 'completed');

  if (completedOrders.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
          <svg className="h-8 w-8 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </div>
        <p className="text-sm font-bold text-slate-700">Belum ada perjalanan yang bisa diulas</p>
        <p className="mt-1 text-xs text-slate-400">Selesaikan perjalananmu terlebih dahulu</p>
        <Link href="/destinasi"
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#2563FF]/20 transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #2563FF, #1E40AF)' }}>
          Jelajahi Destinasi
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {completedOrders.map((order) => {
          // Match review by destination_slug via destination_id lookup — fallback by order position
          const review = reviews[completedOrders.indexOf(order)] ?? null;
          const thumb = DEST_IMAGES[order.destination_slug] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80';

          return (
            <div key={order.id}
              className="group overflow-hidden rounded-2xl bg-white ring-1 ring-slate-900/[0.05] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start gap-4 p-4">
                {/* Thumbnail */}
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl">
                  <img src={thumb} alt={order.destination_name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{order.destination_name}</p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <p className="text-xs text-slate-400">{order.date || new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          Selesai
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review preview or CTA */}
                  {review ? (
                    <div className="mt-2.5">
                      <div className="flex items-center gap-1 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-1 text-[10px] font-semibold text-amber-500">{RATING_LABELS[review.rating]}</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{review.content}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-[10px] text-slate-300">{new Date(review.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <button type="button"
                          onClick={() => { setSelectedOrder(order); setEditReview({ id: review.id, rating: review.rating, content: review.content }); }}
                          className="text-[11px] font-semibold text-[#2563FF] hover:underline">
                          Edit Ulasan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <button type="button"
                        onClick={() => { setSelectedOrder(order); setEditReview(null); }}
                        className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#2563FF]/20 transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.97]"
                        style={{ background: 'linear-gradient(135deg, #2563FF, #1E40AF)' }}>
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                        </svg>
                        Tulis Ulasan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sheet */}
      {selectedOrder && (
        <ReviewBottomSheet
          order={selectedOrder}
          existingReview={editReview}
          onClose={() => { setSelectedOrder(null); setEditReview(null); }}
          onSaved={onReviewSaved}
        />
      )}
    </>
  );
}

/* ============ EDIT PROFILE MODAL ============ */
function EditProfileModal({ user, onClose, onSaved }: { user: { user_metadata?: Record<string, string>; phone?: string; email?: string }; onClose: () => void; onSaved: () => void }) {
  const [fullName, setFullName] = useState(user.user_metadata?.full_name || '');
  const [phone, setPhone] = useState(user.user_metadata?.phone || user.phone || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await supabase.auth.updateUser({ data: { full_name: fullName, phone } });
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md">
      <div className="w-full max-w-sm animate-[slideUp_0.25s_ease-out] rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-800">Edit Profil</h3>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500">Email</label>
            <input type="email" value={user.email || ''} readOnly
              className="mt-1.5 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Nama Lengkap</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">WhatsApp</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="081234567890"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20" />
          </div>
          <button type="button" onClick={handleSave} disabled={saving}
            className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 disabled:opacity-50">
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============ EMPTY STATE ============ */
function EmptyState({ title, description, actionLabel, actionHref }: {
  title: string; description: string; actionLabel?: string; actionHref?: string;
}) {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-100">
        <svg className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-700">{title}</p>
      <p className="mt-1 text-xs text-slate-400">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-md">
          {actionLabel}
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      )}
    </div>
  );
}
