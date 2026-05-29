/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { navLinks, userActions } from '@/data/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';

export function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const userName = user?.user_metadata?.full_name || 'Traveler';
  const userEmail = user?.email || '';
  const userAvatar = user?.user_metadata?.avatar_url || '';
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    setDropdownOpen(false);
    await signOut();
    router.push('/');
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container-app">
          <div className="flex h-14 items-center justify-between md:h-16">
            {/* Mobile: Hamburger */}
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            {/* Mobile: User avatar with dropdown */}
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 md:hidden"
                aria-label="Keluar"
              >
                <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
            ) : (
              <Link href="/login" className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 md:hidden" aria-label="Masuk">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
              </Link>
            )}

            {/* Logo — hidden on mobile, shown on desktop */}
            <Link href="/" className="hidden items-center gap-2.5 md:flex">
              <NextImage src="https://res.cloudinary.com/dqjh7utdb/image/upload/e_background_removal/f_png,w_120,q_auto,f_auto/v1779950494/owbbuyhkedcppgjiaeyo.jpg" alt="Octaf Kreasi" width={40} height={40} className="h-10 w-auto" />
              <span className="text-xl font-bold tracking-tight text-gray-900">
                Octaf <span className="text-primary">Kreasi</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    pathname === link.href ? 'text-primary' : 'text-gray-600'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop User Actions */}
            <div className="hidden items-center gap-3 md:flex">
              {userActions.filter(a => a.icon !== 'user').map((action) => (
                <Link
                  key={action.label}
                  href={action.href || '#'}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary"
                  aria-label={action.label}
                >
                  <UserActionIcon icon={action.icon} />
                  {action.badge !== undefined && action.badge > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                      {action.badge}
                    </span>
                  )}
                </Link>
              ))}

              {/* Profile Avatar + Dropdown */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 ring-2 ring-white shadow-sm transition-all hover:ring-blue-200 hover:shadow-md"
                    aria-label="Menu profil"
                  >
                    {userAvatar ? (
                      <img src={userAvatar} alt={userName} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-white">{userInitial}</span>
                    )}
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-11 z-50 w-60 animate-[fadeIn_0.15s_ease-out] rounded-2xl bg-white shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5">
                      {/* User info */}
                      <div className="px-4 py-3.5 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-800 truncate">{userName}</p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{userEmail}</p>
                      </div>
                      {/* Menu items */}
                      <div className="p-1.5 space-y-0.5">
                        <Link href="/akun"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900">
                          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                          </svg>
                          Akun Saya
                        </Link>
                        <Link href="/akun/tiket"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900">
                          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                          </svg>
                          E-Tiket
                        </Link>
                      </div>
                      {/* Divider + Logout */}
                      <div className="border-t border-slate-100 p-1.5">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                          </svg>
                          Keluar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md"
                >
                  Masuk
                </Link>
              )}
            </div>


          </div>
        </div>
      </header>

      {/* ===== MOBILE SIDEBAR OVERLAY ===== */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 animate-[fadeIn_0.3s_ease-out] bg-black/30"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Sidebar Panel — matches screenshot exactly */}
          <aside className="absolute inset-y-0 left-0 flex w-[280px] animate-[slideInLeft_0.3s_ease-out] flex-col overflow-y-auto bg-white shadow-2xl">
            {/* Logo */}
            <div className="px-6 pt-8">
              <Link href="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                <NextImage src="https://res.cloudinary.com/dqjh7utdb/image/upload/e_background_removal/f_png,w_120,q_auto,f_auto/v1779950494/owbbuyhkedcppgjiaeyo.jpg" alt="Octaf Kreasi" width={40} height={40} className="h-10 w-auto" />
                <span className="text-xl font-bold text-gray-900">
                  Octaf <span className="text-primary">Kreasi</span>
                </span>
              </Link>
            </div>

            {/* Tagline + Plane */}
            <div className="relative px-6 pt-8">
              <p className="text-xl font-semibold leading-snug text-gray-800">
                Explore the <span className="text-primary underline decoration-primary/30 decoration-2 underline-offset-4">world</span>,
                <br />create your <span className="text-primary underline decoration-primary/30 decoration-2 underline-offset-4">story</span>.
              </p>
              {/* Dashed path + plane */}
              <div className="absolute right-6 top-6">
                <svg className="h-16 w-16 text-primary" viewBox="0 0 64 64" fill="none">
                  {/* Dashed curve */}
                  <path d="M10 50 C20 30, 40 20, 55 15" stroke="#93C5FD" strokeWidth="1.5" strokeDasharray="4 3" fill="none"/>
                  {/* Plane */}
                  <g transform="translate(45, 8) rotate(-30)">
                    <path d="M0 4L12 0L10 4L12 8L0 4Z" fill="#2563EB"/>
                    <path d="M3 4L8 2.5V5.5L3 4Z" fill="#1D4ED8"/>
                  </g>
                </svg>
              </div>
            </div>

            {/* Feature Items */}
            <div className="flex-1 space-y-5 px-6 pt-10">{/* Destinasi Terbaik */}<div className="flex animate-[slideUp_0.4s_ease-out_0.1s_both] items-start gap-4">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-500 shadow-lg shadow-blue-500/30">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path fillRule="evenodd" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" clipRule="evenodd" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-900">Destinasi Terbaik</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                    Temukan destinasi menakjubkan di seluruh dunia.
                  </p>
                </div>
              </div>

              {/* Pemesanan Mudah */}<div className="flex animate-[slideUp_0.4s_ease-out_0.2s_both] items-start gap-4">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-green-500 shadow-lg shadow-green-500/30">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-900">Pemesanan Mudah</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                    Pesan tour dengan mudah dan aman.
                  </p>
                </div>
              </div>

              {/* Aman & Terpercaya */}<div className="flex animate-[slideUp_0.4s_ease-out_0.3s_both] items-start gap-4">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-purple-500 shadow-lg shadow-purple-500/30">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-900">Aman & Terpercaya</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                    Layanan terpercaya untuk perjalanan tanpa khawatir.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Illustration — Travel Image */}
            <div className="relative mt-auto px-4 pb-6 pt-6">
              <div className="flex items-end justify-center">
                <img
                  src="https://res.cloudinary.com/ddbq1mlsc/image/upload/f_auto,q_auto/Sightseeing_Photos_-_Download_Free_High-Quality_Pictures___Freepik-removebg-preview_lfwle8"
                  alt="Travel illustration"
                  className="h-40 w-auto animate-[bounceIn_0.5s_ease-out_0.4s_both] object-contain"
                />
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ===== MOBILE BOTTOM NAVIGATION ===== */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white pb-safe md:hidden" aria-label="Mobile bottom navigation">
        <div className="flex items-center justify-around px-2 py-2">
          <BottomNavItem href="/" icon="home" label="Home" isActive={pathname === '/'} />
          <BottomNavItem href="/destinasi" icon="destinasi" label="Destinasi" isActive={pathname.startsWith('/destinasi')} />
          <BottomNavItem href="/blog" icon="blog" label="Blog" isActive={pathname.startsWith('/blog')} />
          <BottomNavItem href="/wishlist" icon="favorit" label="Favorit" isActive={pathname === '/wishlist'} />
          {user ? (
            <BottomNavItem href="/akun" icon="profil" label="Profil" isActive={pathname === '/akun'} />
          ) : (
            <BottomNavItem href="/login" icon="profil" label="Masuk" isActive={false} />
          )}
        </div>
      </nav>

    </>
  );
}

// ===== Sub-components =====

function BottomNavItem({ href, icon, label, isActive }: { href: string; icon: string; label: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors',
        isActive ? 'text-primary' : 'text-gray-400'
      )}
    >
      <BottomNavIcon icon={icon} isActive={isActive} />
      <span>{label}</span>
    </Link>
  );
}

function BottomNavIcon({ icon, isActive }: { icon: string; isActive: boolean }) {
  const cls = cn('h-5 w-5', isActive ? 'text-primary' : 'text-gray-400');
  switch (icon) {
    case 'home':
      return (
        <svg className={cls} fill={isActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 0 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      );
    case 'destinasi':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
      );
    case 'blog':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
        </svg>
      );
    case 'favorit':
      return (
        <svg className={cls} fill={isActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 0 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      );
    case 'profil':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      );
    default:
      return null;
  }
}

function UserActionIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'heart':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      );
    case 'bell':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
      );
    case 'user':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      );
    default:
      return null;
  }
}
