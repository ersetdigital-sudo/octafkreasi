'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <main>
        <HeroLanding />
        <TrustStats />
        <FiturUtama />
        <ETicketShowcase />
        <BookingSystem />
        <AdminDashboardShowcase />
        <WhatsAppNotif />
        <TechStack />
        <PricingCTA />
        <FAQ />
        <ContactCTA />
      </main>
      <LandingFooter />
    </div>
  );
}

/* ========== HEADER ========== */
function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
      <div className="container-app flex h-16 items-center justify-between">
        <Link href="/landing" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
            <svg className="h-5 w-5 text-white" viewBox="0 0 32 32" fill="none">
              <path d="M5 16L11 10.5L16 16L21 10.5L27 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 22L11 16.5L16 22L21 16.5L27 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
            </svg>
          </div>
          <span className="text-lg font-bold text-gray-900">
            Octaf <span className="text-primary">Kreasi</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#fitur" className="text-sm font-medium text-gray-600 hover:text-primary">Fitur</a>
          <a href="#demo" className="text-sm font-medium text-gray-600 hover:text-primary">Demo</a>
          <a href="#tech" className="text-sm font-medium text-gray-600 hover:text-primary">Teknologi</a>
          <a href="#harga" className="text-sm font-medium text-gray-600 hover:text-primary">Harga</a>
          <a href="#faq" className="text-sm font-medium text-gray-600 hover:text-primary">FAQ</a>
        </nav>
        <a href="#kontak" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md">
          Hubungi Kami
        </a>
      </div>
    </header>
  );
}

/* ========== HERO ========== */
function HeroLanding() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0c1929] via-[#143052] to-[#1d4ed8] py-20 lg:py-32">
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern></defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container-app relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-blue-200 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Jasa Pembuatan Website Tour & Travel
          </span>
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Website tour travel{' '}
            <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              profesional & siap pakai
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-200/80">
            Dapatkan website booking tour travel lengkap dengan sistem e-tiket digital, 
            pembayaran otomatis, notifikasi WhatsApp, dan admin dashboard. 
            Tinggal pakai, tanpa ribet develop dari nol.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="#kontak" className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-primary shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]">
              Konsultasi Gratis
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a href="https://www.octafkreasi.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10">
              Lihat Demo Live
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
          <p className="mt-6 text-sm text-blue-300/60">
            Demo live: octafkreasi.com — sudah dipakai bisnis tour travel aktif
          </p>
        </div>
      </div>
    </section>
  );
}

/* ========== TRUST STATS ========== */
function TrustStats() {
  return (
    <section className="border-b border-gray-100 bg-gradient-to-r from-blue-50/50 via-white to-blue-50/50 py-10">
      <div className="container-app">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { value: '10+', label: 'Fitur Lengkap' },
            { value: 'Full', label: 'Admin Dashboard' },
            { value: 'Auto', label: 'E-Tiket & QR Code' },
            { value: '24/7', label: 'Notifikasi WhatsApp' },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <p className="text-2xl font-bold text-gray-900 sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== FITUR UTAMA ========== */
function FiturUtama() {
  const features = [
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
        </svg>
      ),
      title: 'E-Tiket Digital + QR Code',
      desc: 'Tiket otomatis terbit setelah bayar. Customer tinggal scan QR code di lokasi. Bisa download sebagai gambar.',
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
        </svg>
      ),
      title: 'Sistem Booking Multi-Step',
      desc: 'Alur pemesanan bertahap: pilih paket, isi data, pilih tanggal, bayar. UX yang smooth dan mobile-friendly.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      ),
      title: 'Notifikasi WhatsApp Otomatis',
      desc: 'Integrasi Fonnte API. Customer otomatis dapat WA: konfirmasi booking, update status, reminder keberangkatan.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
        </svg>
      ),
      title: 'Admin Dashboard Lengkap',
      desc: 'Kelola destinasi, pesanan, tiket, blog, promo, ulasan, user management, dan pengaturan bisnis dari satu panel.',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      ),
      title: 'Blog Editor (Rich Text)',
      desc: 'Editor artikel pakai TipTap: support gambar, tabel, link, formatting. Bantu SEO dan content marketing.',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      ),
      title: 'Kode Promo & Diskon',
      desc: 'Buat kode promo persentase atau fixed. Set min pembelian, max diskon, masa berlaku. Boost penjualan.',
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
      title: 'Wishlist & Ulasan',
      desc: 'Customer bisa simpan favorit dan tulis review. Social proof yang meningkatkan konversi booking.',
      color: 'bg-pink-100 text-pink-600',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      ),
      title: 'Verifikasi Pembayaran',
      desc: 'Upload bukti bayar, admin verifikasi, tiket terbit otomatis. Rekening bank bisa dikelola dari dashboard.',
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
      title: 'Customer Management',
      desc: 'Lihat data customer, riwayat order, total spending. Insight untuk strategi marketing yang tepat.',
      color: 'bg-cyan-100 text-cyan-600',
    },
  ];

  return (
    <section id="fitur" className="py-20 lg:py-28">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-primary-50 px-4 py-1.5 text-xs font-semibold text-primary">
            Fitur Website
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold text-gray-900 sm:text-4xl">
            Semua fitur yang dibutuhkan bisnis tour travel
          </h2>
          <p className="mt-4 text-gray-500">
            Bukan template biasa. Ini sistem booking tour travel yang sudah production-ready 
            dan dipakai bisnis nyata.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.color}`}>
                {f.icon}
              </div>
              <h3 className="mt-4 text-base font-bold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== E-TIKET SHOWCASE ========== */
function ETicketShowcase() {
  return (
    <section id="demo" className="overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20 lg:py-28">
      <div className="container-app">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700">
              Fitur Unggulan
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-gray-900 sm:text-4xl">
              E-Tiket Digital dengan <span className="text-primary">QR Code</span>
            </h2>
            <p className="mt-4 text-gray-500 leading-relaxed">
              Setelah pembayaran diverifikasi, e-tiket terbit otomatis. Customer bisa lihat tiket, 
              download sebagai gambar, dan scan QR code saat check-in di lokasi. 
              Tidak perlu cetak tiket fisik.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { title: 'Auto Generate', desc: 'Tiket terbit otomatis setelah admin konfirmasi pembayaran' },
                { title: 'QR Code Check-in', desc: 'Staff scan QR di lokasi untuk verifikasi kehadiran' },
                { title: 'Download Offline', desc: 'Customer bisa download tiket sebagai gambar PNG' },
                { title: 'Rincian Lengkap', desc: 'Info destinasi, jadwal, peserta, dan payment breakdown' },
                { title: 'Status Tracking', desc: 'Status tiket: aktif, check-in, selesai, dibatalkan' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Ticket Mockup */}
          <div className="flex justify-center lg:justify-end">
            <TicketMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== TICKET MOCKUP ========== */
function TicketMockup() {
  return (
    <div className="relative w-full max-w-[360px]">
      <div className="absolute -inset-4 rounded-[36px] bg-gradient-to-br from-blue-100 to-indigo-100 opacity-60 blur-2xl" />
      <div className="relative overflow-hidden rounded-[28px] bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0c1929] via-[#143052] to-[#1d4ed8] px-6 pt-5 pb-7">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                <svg className="h-5 w-5 text-white" viewBox="0 0 32 32" fill="none">
                  <path d="M5 16L11 10.5L16 16L21 10.5L27 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 22L11 16.5L16 22L21 16.5L27 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Octaf Kreasi</p>
                <p className="text-[9px] font-medium tracking-wider text-blue-300/80 uppercase">Travel E-Ticket</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 ring-1 ring-emerald-400/25">
              <svg className="h-3 w-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              <span className="text-[10px] font-bold text-emerald-300">Lunas</span>
            </div>
          </div>
          <div className="relative mt-5">
            <p className="text-xl font-bold text-white">Raja Ampat</p>
            <p className="text-xs text-blue-200/70">Paket Snorkeling 3D2N</p>
          </div>
          <div className="relative mt-3">
            <div className="inline-flex rounded-lg bg-white/10 px-2.5 py-1 backdrop-blur-sm">
              <span className="font-mono text-[11px] font-bold tracking-wider text-white/90">OC-2025-84721</span>
            </div>
          </div>
        </div>

        {/* Notch */}
        <div className="relative flex items-center">
          <div className="absolute -left-2.5 h-5 w-5 rounded-full bg-slate-50" />
          <div className="w-full border-t-2 border-dashed border-gray-150" />
          <div className="absolute -right-2.5 h-5 w-5 rounded-full bg-slate-50" />
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Tanggal</p>
              <p className="mt-1 text-xs font-bold text-slate-900">15 Mar 2025</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Peserta</p>
              <p className="mt-1 text-xs font-bold text-slate-900">2 Dewasa, 1 Anak</p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-100">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Nama Pemesan</p>
            <p className="mt-0.5 text-xs font-bold text-slate-900">Ahmad Rizky</p>
          </div>

          <div className="rounded-xl border border-slate-100 p-3">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Rincian Pembayaran</p>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between"><span className="text-slate-500">Paket Wisata</span><span className="font-medium text-slate-800">Rp 4.500.000</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Biaya Layanan</span><span className="font-medium text-slate-800">Rp 100.000</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Asuransi</span><span className="font-medium text-slate-800">Rp 150.000</span></div>
            </div>
            <div className="mt-2 border-t border-dashed border-slate-200 pt-2 flex justify-between">
              <span className="text-xs font-bold text-slate-900">Total</span>
              <span className="text-sm font-bold text-blue-600">Rp 4.750.000</span>
            </div>
          </div>

          {/* QR */}
          <div className="flex flex-col items-center pt-1">
            <div className="rounded-xl border border-slate-100 p-2.5 shadow-sm">
              <div className="h-[80px] w-[80px] rounded-lg bg-slate-900 p-2">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <rect x="0" y="0" width="30" height="30" fill="white" rx="4"/><rect x="5" y="5" width="20" height="20" fill="#0f172a" rx="2"/><rect x="9" y="9" width="12" height="12" fill="white" rx="1"/>
                  <rect x="70" y="0" width="30" height="30" fill="white" rx="4"/><rect x="75" y="5" width="20" height="20" fill="#0f172a" rx="2"/><rect x="79" y="9" width="12" height="12" fill="white" rx="1"/>
                  <rect x="0" y="70" width="30" height="30" fill="white" rx="4"/><rect x="5" y="75" width="20" height="20" fill="#0f172a" rx="2"/><rect x="9" y="79" width="12" height="12" fill="white" rx="1"/>
                  <rect x="35" y="35" width="8" height="8" fill="white" rx="1"/><rect x="47" y="35" width="8" height="8" fill="white" rx="1"/>
                  <rect x="59" y="35" width="8" height="8" fill="white" rx="1"/><rect x="35" y="47" width="8" height="8" fill="white" rx="1"/>
                  <rect x="55" y="47" width="8" height="8" fill="white" rx="1"/><rect x="35" y="59" width="8" height="8" fill="white" rx="1"/>
                  <rect x="67" y="55" width="8" height="8" fill="white" rx="1"/><rect x="75" y="67" width="8" height="8" fill="white" rx="1"/>
                  <rect x="85" y="75" width="8" height="8" fill="white" rx="1"/><rect x="67" y="85" width="8" height="8" fill="white" rx="1"/>
                </svg>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-slate-400">Scan untuk check-in di lokasi</p>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-3 text-center">
          <p className="text-[9px] font-medium tracking-wide text-slate-400">Official Travel E-Ticket · Powered by Octaf Kreasi</p>
        </div>
      </div>
    </div>
  );
}

/* ========== BOOKING SYSTEM ========== */
function BookingSystem() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-app">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Mockup */}
          <div className="order-2 lg:order-1">
            <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
              {/* Booking step indicator */}
              <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  {['Pilih Paket', 'Data Diri', 'Pembayaran', 'Selesai'].map((step, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${i <= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {i + 1}
                      </div>
                      <span className="mt-1 text-[9px] text-gray-500">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Form preview */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Destinasi</label>
                  <div className="mt-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-900">Raja Ampat - Snorkeling 3D2N</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Tanggal</label>
                    <div className="mt-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900">15 Mar 2025</div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Peserta</label>
                    <div className="mt-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900">2 Dewasa</div>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Kode Promo</label>
                  <div className="mt-1 flex gap-2">
                    <div className="flex-1 rounded-lg border border-dashed border-orange-300 bg-orange-50 px-3 py-2.5 text-sm font-mono font-semibold text-orange-600">HEMAT20</div>
                    <div className="rounded-lg bg-emerald-100 px-3 py-2.5 text-xs font-bold text-emerald-700">-20%</div>
                  </div>
                </div>
                <div className="rounded-lg bg-blue-50 px-4 py-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Bayar</span>
                    <span className="font-bold text-primary">Rp 3.600.000</span>
                  </div>
                </div>
                <div className="rounded-xl bg-primary px-4 py-3 text-center text-sm font-bold text-white">
                  Lanjut ke Pembayaran
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <span className="inline-flex rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700">
              Sistem Booking
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-gray-900 sm:text-4xl">
              Alur pemesanan yang <span className="text-primary">sudah teruji</span>
            </h2>
            <p className="mt-4 text-gray-500 leading-relaxed">
              Multi-step booking form yang didesain untuk konversi tinggi. 
              Customer tinggal pilih paket, isi data, apply promo, dan bayar. Semua responsive dan mobile-first.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Multi-step form (UX terbukti meningkatkan konversi)',
                'Apply kode promo dengan validasi otomatis',
                'Pilih metode bayar: transfer bank / e-wallet',
                'Order summary real-time dengan kalkulasi harga',
                'Validasi form pakai Zod (data selalu valid)',
              ].map((t, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-4 w-4 flex-shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== ADMIN DASHBOARD ========== */
function AdminDashboardShowcase() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 py-20 lg:py-28">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
            Admin Panel
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold text-white sm:text-4xl">
            Dashboard admin yang powerful
          </h2>
          <p className="mt-4 text-slate-400">
            Kelola seluruh bisnis tour travel dari satu panel. Tanpa coding, tanpa ribet.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-sm">
            <div className="rounded-xl bg-slate-800 p-6">
              <div className="flex items-center justify-between pb-6 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600" />
                  <span className="text-sm font-bold text-white">Admin Panel — Octaf Kreasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-400">Online</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  { label: 'Total Pesanan', value: '1,247', change: '+12% bulan ini', color: 'text-blue-400' },
                  { label: 'Revenue', value: 'Rp 2.8M', change: '+8% bulan ini', color: 'text-emerald-400' },
                  { label: 'Customer', value: '856', change: '+15 minggu ini', color: 'text-purple-400' },
                  { label: 'Rating', value: '4.9/5', change: '128 ulasan', color: 'text-yellow-400' },
                ].map((stat, i) => (
                  <div key={i} className="rounded-xl bg-slate-700/50 p-4">
                    <p className="text-xs text-slate-400">{stat.label}</p>
                    <p className={`mt-1 text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="mt-1 text-[10px] text-emerald-400">{stat.change}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold text-slate-400 mb-3">Menu Admin</p>
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                  {[
                    'Kelola Destinasi', 'Kelola Paket', 'Pesanan Masuk', 'Verifikasi Bayar',
                    'Terbitkan Tiket', 'Kirim Notif WA', 'Blog Editor', 'Kode Promo',
                    'Kelola Ulasan', 'Data Customer', 'Rekening Bank', 'Pengaturan',
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg bg-slate-700/30 px-3 py-2.5">
                      <div className="h-2 w-2 rounded-full bg-blue-400" />
                      <span className="text-[11px] font-medium text-slate-300">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== WHATSAPP NOTIF ========== */
function WhatsAppNotif() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-app">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-1.5 text-xs font-semibold text-green-700">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Integration
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-gray-900 sm:text-4xl">
              Notifikasi otomatis via <span className="text-green-600">WhatsApp</span>
            </h2>
            <p className="mt-4 text-gray-500 leading-relaxed">
              Integrasi Fonnte API untuk kirim pesan WhatsApp otomatis ke customer. 
              Tanpa login WhatsApp Web, tanpa scan QR berulang.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Konfirmasi booking otomatis setelah order masuk',
                'Notifikasi pembayaran diterima',
                'Kirim e-tiket langsung ke WA customer',
                'Reminder H-1 keberangkatan',
                'Custom message dari admin dashboard',
              ].map((t, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-4 w-4 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* WA Chat mockup */}
          <div className="flex justify-center">
            <div className="w-full max-w-xs">
              <div className="rounded-2xl bg-[#e5ddd5] p-4 shadow-lg">
                <div className="space-y-3">
                  {[
                    { msg: 'Halo Ahmad! Booking kamu untuk Raja Ampat - Snorkeling 3D2N sudah kami terima. Total: Rp 4.750.000. Silakan transfer ke rekening yang tertera.', time: '10:30' },
                    { msg: 'Pembayaran kamu sudah dikonfirmasi! E-tiket sudah terbit. Cek di akun kamu atau klik link berikut: octafkreasi.com/akun/tiket', time: '14:15' },
                    { msg: 'Reminder: Perjalanan kamu ke Raja Ampat besok! Jangan lupa bawa perlengkapan snorkeling. Selamat berlibur!', time: '08:00' },
                  ].map((chat, i) => (
                    <div key={i} className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-[#dcf8c6] px-3 py-2 shadow-sm">
                      <p className="text-[11px] leading-relaxed text-gray-800">{chat.msg}</p>
                      <p className="mt-1 text-right text-[9px] text-gray-500">{chat.time}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-gray-400">Contoh notifikasi WA otomatis</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== TECH STACK ========== */
function TechStack() {
  return (
    <section id="tech" className="bg-gradient-to-b from-slate-50 to-white py-20 lg:py-28">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-700">
            Teknologi
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold text-gray-900 sm:text-4xl">
            Dibangun dengan teknologi modern
          </h2>
          <p className="mt-4 text-gray-500">
            Stack yang cepat, scalable, dan mudah di-maintain. Bukan WordPress, bukan template murahan.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Next.js 14', desc: 'React framework dengan App Router. SSR, SSG, dan API routes.', tag: 'Framework' },
            { name: 'TypeScript', desc: 'Type-safe code. Lebih sedikit bug, lebih mudah maintenance.', tag: 'Language' },
            { name: 'Tailwind CSS', desc: 'Utility-first CSS. Design pixel-perfect dan fully responsive.', tag: 'Styling' },
            { name: 'Supabase', desc: 'PostgreSQL database + Auth + Storage. Scalable dan gratis tier.', tag: 'Backend' },
            { name: 'Vercel', desc: 'Auto deploy dari GitHub. CDN global, SSL gratis, zero config.', tag: 'Hosting' },
            { name: 'Fonnte API', desc: 'WhatsApp Business API. Kirim pesan otomatis tanpa scan QR.', tag: 'Integration' },
          ].map((tech, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-600">{tech.tag}</span>
              <h3 className="mt-3 text-base font-bold text-gray-900">{tech.name}</h3>
              <p className="mt-1.5 text-sm text-gray-500">{tech.desc}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-blue-100 bg-blue-50/50 p-6 text-center">
          <p className="text-sm font-semibold text-gray-900">Kenapa bukan WordPress?</p>
          <p className="mt-2 text-sm text-gray-600">
            Website custom Next.js jauh lebih cepat (skor Lighthouse 95+), lebih aman (no plugin vulnerabilities), 
            SEO-friendly, dan tidak perlu bayar hosting mahal. Cocok untuk bisnis yang serius.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ========== PRICING CTA ========== */
function PricingCTA() {
  return (
    <section id="harga" className="py-20 lg:py-28">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-primary-50 px-4 py-1.5 text-xs font-semibold text-primary">
            Harga
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold text-gray-900 sm:text-4xl">
            Investasi untuk bisnis tour travel kamu
          </h2>
          <p className="mt-4 text-gray-500">
            Satu kali bayar, website langsung jadi. Tanpa biaya bulanan untuk fitur.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-lg">
          <div className="relative overflow-hidden rounded-3xl border-2 border-primary bg-white shadow-xl">
            <div className="absolute right-4 top-4">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">Recommended</span>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-900">Paket Website Tour Travel</h3>
              <p className="mt-2 text-sm text-gray-500">Website lengkap siap pakai untuk bisnis tour & travel kamu</p>

              <div className="mt-6">
                <p className="text-sm text-gray-500">Mulai dari</p>
                <p className="mt-1 font-heading text-4xl font-bold text-gray-900">
                  Hubungi Kami
                </p>
                <p className="mt-1 text-sm text-gray-500">Harga disesuaikan dengan kebutuhan & custom fitur</p>
              </div>

              <ul className="mt-8 space-y-3">
                {[
                  'Website tour travel full fitur (seperti demo)',
                  'E-Tiket digital dengan QR code',
                  'Admin dashboard lengkap',
                  'Notifikasi WhatsApp otomatis (Fonnte)',
                  'Blog editor (TipTap rich text)',
                  'Sistem promo & diskon',
                  'Customer management',
                  'SEO optimized (Lighthouse 95+)',
                  'Mobile responsive (mobile-first)',
                  'Deploy ke Vercel + custom domain',
                  'Source code & dokumentasi',
                  'Free konsultasi & revisi',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="h-5 w-5 flex-shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <a href="#kontak" className="mt-8 block rounded-xl bg-primary px-6 py-4 text-center text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-primary-700 hover:shadow-xl">
                Konsultasi Sekarang
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== FAQ ========== */
function FAQ() {
  const faqs = [
    { q: 'Berapa lama pengerjaan website?', a: 'Untuk website dengan fitur standar seperti demo, estimasi 2-4 minggu tergantung tingkat custom yang dibutuhkan.' },
    { q: 'Apakah bisa custom fitur tambahan?', a: 'Tentu! Fitur bisa ditambah atau dikurangi sesuai kebutuhan bisnis kamu. Harga menyesuaikan.' },
    { q: 'Apakah dapat source code?', a: 'Ya, kamu mendapatkan full source code. Bisa di-develop sendiri atau kami bantu maintenance.' },
    { q: 'Hosting dan domain bagaimana?', a: 'Kami deploy ke Vercel (gratis). Domain bisa pakai yang sudah ada atau kami bantu beli domain baru.' },
    { q: 'Ada biaya bulanan?', a: 'Tidak ada biaya bulanan untuk fitur. Hanya biaya hosting jika traffic sangat besar (Vercel free tier cukup untuk sebagian besar bisnis) dan biaya Fonnte untuk WhatsApp API.' },
    { q: 'Bisa lihat demo live?', a: 'Bisa! Website octafkreasi.com adalah demo live yang sudah dipakai bisnis aktif. Semua fitur bisa kamu coba.' },
  ];

  return (
    <section id="faq" className="bg-gradient-to-b from-white to-slate-50 py-20 lg:py-28">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-gray-100 px-4 py-1.5 text-xs font-semibold text-gray-700">
            FAQ
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold text-gray-900 sm:text-4xl">
            Pertanyaan yang sering ditanyakan
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900">{faq.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== CONTACT CTA ========== */
function ContactCTA() {
  return (
    <section id="kontak" className="py-20 lg:py-28">
      <div className="container-app">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-indigo-700 px-8 py-16 sm:px-16 lg:py-20">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5 blur-2xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
              Siap punya website tour travel profesional?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-blue-100">
              Konsultasi gratis, tanpa commitment. Ceritakan kebutuhan bisnis kamu 
              dan kami akan berikan solusi terbaik.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="https://wa.me/6281234567890?text=Halo%2C%20saya%20tertarik%20dengan%20jasa%20pembuatan%20website%20tour%20travel"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-green-600 hover:shadow-xl hover:scale-[1.02]"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat via WhatsApp
              </a>
              <a href="https://www.octafkreasi.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10">
                Lihat Demo Live
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== FOOTER ========== */
function LandingFooter() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 py-10">
      <div className="container-app">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
              <svg className="h-4 w-4 text-white" viewBox="0 0 32 32" fill="none">
                <path d="M5 16L11 10.5L16 16L21 10.5L27 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 22L11 16.5L16 22L21 16.5L27 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
              </svg>
            </div>
            <span className="text-sm font-bold text-gray-900">Octaf Kreasi</span>
          </div>
          <p className="text-sm text-gray-500">
            Jasa pembuatan website tour & travel profesional
          </p>
          <p className="text-xs text-gray-400">
            &copy; 2025 Octaf Kreasi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
