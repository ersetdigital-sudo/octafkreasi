'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroLanding />
        <FeaturesOverview />
        <ETicketShowcase />
        <BookingFlowSection />
        <DestinationSection />
        <WishlistSection />
        <PromoSection />
        <BlogSection />
        <AdminDashboardPreview />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

/* ========== HERO SECTION ========== */
function HeroLanding() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0c1929] via-[#143052] to-[#1d4ed8] py-20 lg:py-32">
      {/* Decorative elements */}
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
            Platform Tour Travel #1 Indonesia
          </span>
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Semua yang kamu butuhkan untuk{' '}
            <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              perjalanan sempurna
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-200/80">
            Dari booking destinasi hingga e-tiket digital dengan QR code. 
            Nikmati pengalaman travel modern yang aman, mudah, dan terpercaya.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/destinasi" className="btn-primary rounded-xl px-8 py-4 text-base shadow-lg shadow-blue-500/30">
              Jelajahi Destinasi
            </Link>
            <a href="#fitur" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10">
              Lihat Fitur
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== FEATURES OVERVIEW ========== */
function FeaturesOverview() {
  const features = [
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
      ),
      title: '500+ Destinasi',
      desc: 'Jelajahi ratusan destinasi wisata terbaik Indonesia',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
        </svg>
      ),
      title: 'E-Tiket Digital',
      desc: 'Tiket perjalanan digital dengan QR code untuk check-in',
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      ),
      title: 'Pembayaran Aman',
      desc: 'Transfer bank dengan verifikasi otomatis dan invoice digital',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      ),
      title: 'Notifikasi WhatsApp',
      desc: 'Update status pesanan langsung ke WhatsApp kamu',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
      title: 'Wishlist',
      desc: 'Simpan destinasi favorit dan rencanakan perjalanan impian',
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      ),
      title: 'Kode Promo',
      desc: 'Dapatkan diskon menarik dengan kode promo eksklusif',
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <section id="fitur" className="py-20 lg:py-28">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-primary-50 px-4 py-1.5 text-xs font-semibold text-primary">
            Fitur Lengkap
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold text-gray-900 sm:text-4xl">
            Semua fitur untuk pengalaman travel terbaik
          </h2>
          <p className="mt-4 text-gray-500">
            Platform all-in-one yang memudahkan perjalananmu dari awal hingga akhir
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.color}`}>
                {f.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== E-TIKET DIGITAL SHOWCASE ========== */
function ETicketShowcase() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20 lg:py-28">
      <div className="container-app">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left — Description */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
              </svg>
              E-Tiket Digital
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-gray-900 sm:text-4xl">
              Tiket perjalanan digital yang{' '}
              <span className="text-primary">premium & modern</span>
            </h2>
            <p className="mt-4 text-gray-500 leading-relaxed">
              Setelah pembayaran dikonfirmasi, e-tiket langsung terbit otomatis. 
              Lengkap dengan QR code untuk check-in tanpa ribet di lokasi.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                { title: 'QR Code Check-in', desc: 'Scan langsung di lokasi, tanpa cetak tiket fisik' },
                { title: 'Download & Simpan', desc: 'Unduh tiket sebagai gambar untuk offline akses' },
                { title: 'Rincian Lengkap', desc: 'Info destinasi, peserta, harga, dan payment breakdown' },
                { title: 'Status Real-time', desc: 'Pantau status tiket: aktif, sudah check-in, atau selesai' },
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

          {/* Right — E-Ticket Mockup */}
          <div className="flex justify-center lg:justify-end">
            <TicketMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== TICKET MOCKUP COMPONENT ========== */
function TicketMockup() {
  return (
    <div className="relative w-full max-w-[360px]">
      {/* Glow effect */}
      <div className="absolute -inset-4 rounded-[36px] bg-gradient-to-br from-blue-100 to-indigo-100 opacity-60 blur-2xl" />

      {/* Ticket Card */}
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
          {/* Quick Info */}
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

          {/* Customer */}
          <div className="rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Nama Pemesan</p>
                <p className="mt-0.5 text-xs font-bold text-slate-900">Ahmad Rizky</p>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
                <svg className="h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                </svg>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-xl border border-slate-100 p-3">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Rincian Pembayaran</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Paket Wisata</span>
                <span className="font-medium text-slate-800">Rp 4.500.000</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Biaya Layanan</span>
                <span className="font-medium text-slate-800">Rp 100.000</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Asuransi</span>
                <span className="font-medium text-slate-800">Rp 150.000</span>
              </div>
            </div>
            <div className="mt-2 border-t border-dashed border-slate-200 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Total</span>
                <span className="text-sm font-bold text-blue-600">Rp 4.750.000</span>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center pt-1">
            <div className="rounded-xl border border-slate-100 p-2.5 shadow-sm">
              <div className="h-[80px] w-[80px] rounded-lg bg-slate-900 p-2">
                {/* Simulated QR pattern */}
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <rect x="0" y="0" width="30" height="30" fill="white" rx="4"/>
                  <rect x="5" y="5" width="20" height="20" fill="#0f172a" rx="2"/>
                  <rect x="9" y="9" width="12" height="12" fill="white" rx="1"/>
                  <rect x="70" y="0" width="30" height="30" fill="white" rx="4"/>
                  <rect x="75" y="5" width="20" height="20" fill="#0f172a" rx="2"/>
                  <rect x="79" y="9" width="12" height="12" fill="white" rx="1"/>
                  <rect x="0" y="70" width="30" height="30" fill="white" rx="4"/>
                  <rect x="5" y="75" width="20" height="20" fill="#0f172a" rx="2"/>
                  <rect x="9" y="79" width="12" height="12" fill="white" rx="1"/>
                  <rect x="35" y="35" width="8" height="8" fill="white" rx="1"/>
                  <rect x="47" y="35" width="8" height="8" fill="white" rx="1"/>
                  <rect x="59" y="35" width="8" height="8" fill="white" rx="1"/>
                  <rect x="35" y="47" width="8" height="8" fill="white" rx="1"/>
                  <rect x="55" y="47" width="8" height="8" fill="white" rx="1"/>
                  <rect x="35" y="59" width="8" height="8" fill="white" rx="1"/>
                  <rect x="47" y="59" width="8" height="8" fill="white" rx="1"/>
                  <rect x="67" y="55" width="8" height="8" fill="white" rx="1"/>
                  <rect x="75" y="67" width="8" height="8" fill="white" rx="1"/>
                  <rect x="85" y="75" width="8" height="8" fill="white" rx="1"/>
                  <rect x="67" y="85" width="8" height="8" fill="white" rx="1"/>
                </svg>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-slate-400">Scan untuk check-in di lokasi</p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-3 text-center">
          <p className="text-[9px] font-medium tracking-wide text-slate-400">
            Official Travel E-Ticket · Powered by Octaf Kreasi
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========== BOOKING FLOW SECTION ========== */
function BookingFlowSection() {
  const steps = [
    {
      step: '01',
      title: 'Pilih Destinasi & Paket',
      desc: 'Browse ratusan destinasi, bandingkan paket, pilih yang sesuai budget dan jadwal',
      color: 'from-blue-500 to-blue-600',
    },
    {
      step: '02',
      title: 'Isi Data & Pilih Tanggal',
      desc: 'Lengkapi data peserta, pilih tanggal keberangkatan, dan apply kode promo',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      step: '03',
      title: 'Bayar & Konfirmasi',
      desc: 'Transfer ke rekening resmi, upload bukti bayar, dan tunggu verifikasi',
      color: 'from-purple-500 to-purple-600',
    },
    {
      step: '04',
      title: 'Terima E-Tiket',
      desc: 'E-tiket digital otomatis terbit setelah pembayaran dikonfirmasi admin',
      color: 'from-emerald-500 to-emerald-600',
    },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-700">
            Cara Kerja
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold text-gray-900 sm:text-4xl">
            Booking semudah 4 langkah
          </h2>
          <p className="mt-4 text-gray-500">
            Dari memilih destinasi hingga menerima e-tiket, semua bisa dilakukan dari HP kamu
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={i} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-10 hidden h-0.5 w-full translate-x-1/2 bg-gradient-to-r from-gray-200 to-transparent lg:block" />
              )}
              <div className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} shadow-lg`}>
                  <span className="text-sm font-bold text-white">{s.step}</span>
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== DESTINATION SECTION ========== */
function DestinationSection() {
  const destinations = [
    { name: 'Raja Ampat', location: 'Papua Barat', price: 'Rp 3.5jt', rating: '4.9', image: 'from-cyan-400 to-blue-600' },
    { name: 'Bali', location: 'Bali', price: 'Rp 1.8jt', rating: '4.8', image: 'from-orange-400 to-pink-600' },
    { name: 'Labuan Bajo', location: 'NTT', price: 'Rp 4.2jt', rating: '4.9', image: 'from-emerald-400 to-teal-600' },
    { name: 'Yogyakarta', location: 'D.I. Yogyakarta', price: 'Rp 1.2jt', rating: '4.7', image: 'from-purple-400 to-indigo-600' },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-slate-50 py-20 lg:py-28">
      <div className="container-app">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700">
              Destinasi Populer
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-gray-900 sm:text-4xl">
              Destinasi wisata terfavorit
            </h2>
            <p className="mt-2 text-gray-500">Ribuan traveler sudah membuktikan keseruan perjalanan mereka</p>
          </div>
          <Link href="/destinasi" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-700">
            Lihat Semua
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((d, i) => (
            <div key={i} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
              <div className={`relative h-44 bg-gradient-to-br ${d.image}`}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-gray-900 backdrop-blur-sm">
                  <svg className="h-3 w-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {d.rating}
                </div>
                <div className="absolute bottom-3 left-3">
                  <p className="text-lg font-bold text-white drop-shadow-md">{d.name}</p>
                  <p className="text-xs text-white/80">{d.location}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Mulai dari</p>
                    <p className="text-base font-bold text-primary">{d.price}</p>
                  </div>
                  <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:border-red-200 hover:text-red-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== WISHLIST SECTION ========== */
function WishlistSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-app">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Mockup */}
          <div className="order-2 lg:order-1">
            <div className="mx-auto max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">Wishlist Saya</h3>
                <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">3 destinasi</span>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { name: 'Raja Ampat', loc: 'Papua Barat', color: 'from-cyan-400 to-blue-500' },
                  { name: 'Labuan Bajo', loc: 'NTT', color: 'from-emerald-400 to-teal-500' },
                  { name: 'Bromo', loc: 'Jawa Timur', color: 'from-orange-400 to-red-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <div className={`h-12 w-12 flex-shrink-0 rounded-lg bg-gradient-to-br ${item.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.loc}</p>
                    </div>
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-700">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              Wishlist
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-gray-900 sm:text-4xl">
              Simpan destinasi <span className="text-red-500">favorit</span> kamu
            </h2>
            <p className="mt-4 text-gray-500 leading-relaxed">
              Belum siap booking? Simpan dulu ke wishlist. Rencanakan perjalanan 
              impianmu dan booking kapanpun kamu siap.
            </p>
            <ul className="mt-6 space-y-3">
              {['Satu klik untuk simpan destinasi favorit', 'Akses wishlist dari device manapun', 'Langsung booking dari wishlist'].map((t, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
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

/* ========== PROMO SECTION ========== */
function PromoSection() {
  return (
    <section className="bg-gradient-to-br from-orange-50 via-yellow-50 to-white py-20 lg:py-28">
      <div className="container-app">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-xs font-semibold text-orange-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              </svg>
              Promo & Diskon
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-gray-900 sm:text-4xl">
              Hemat lebih banyak dengan <span className="text-orange-500">kode promo</span>
            </h2>
            <p className="mt-4 text-gray-500 leading-relaxed">
              Masukkan kode promo saat checkout dan nikmati diskon hingga ratusan ribu rupiah. 
              Follow media sosial kami untuk info promo terbaru.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex-1 rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Contoh kode promo</p>
                    <p className="mt-0.5 font-mono text-lg font-bold tracking-wider text-orange-600">HEMAT20</p>
                  </div>
                  <span className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-bold text-white">-20%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Promo Card Visual */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-xs">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-orange-200/40 to-yellow-200/40 blur-2xl" />
              <div className="relative space-y-4">
                {[
                  { code: 'LIBURAN30', disc: '30%', max: 'Max Rp 500rb', color: 'from-orange-500 to-red-500' },
                  { code: 'HEMAT50K', disc: 'Rp 50rb', max: 'Min order Rp 1jt', color: 'from-emerald-500 to-teal-500' },
                  { code: 'NEWUSER', disc: '15%', max: 'User baru', color: 'from-purple-500 to-indigo-500' },
                ].map((p, i) => (
                  <div key={i} className="flex items-center overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100">
                    <div className={`flex h-full w-20 flex-shrink-0 items-center justify-center bg-gradient-to-br ${p.color} px-4 py-5`}>
                      <span className="text-sm font-bold text-white">{p.disc}</span>
                    </div>
                    <div className="flex-1 px-4 py-3">
                      <p className="font-mono text-sm font-bold text-gray-900">{p.code}</p>
                      <p className="text-xs text-gray-500">{p.max}</p>
                    </div>
                    <div className="pr-4">
                      <div className="rounded-lg border border-dashed border-gray-300 px-2.5 py-1.5 text-[10px] font-semibold text-gray-500">
                        COPY
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== BLOG SECTION ========== */
function BlogSection() {
  const articles = [
    { title: '10 Tips Liburan Hemat ke Raja Ampat', category: 'Tips Travel', readTime: '5 min', color: 'from-cyan-400 to-blue-500' },
    { title: 'Guide Lengkap: Labuan Bajo untuk Pemula', category: 'Destinasi', readTime: '8 min', color: 'from-emerald-400 to-green-500' },
    { title: 'Packing List untuk Trip 3 Hari', category: 'Tips Travel', readTime: '4 min', color: 'from-purple-400 to-indigo-500' },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="container-app">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex rounded-full bg-purple-50 px-4 py-1.5 text-xs font-semibold text-purple-700">
              Blog & Artikel
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-gray-900 sm:text-4xl">
              Inspirasi untuk perjalananmu
            </h2>
            <p className="mt-2 text-gray-500">Tips, guide, dan cerita perjalanan dari tim kami</p>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-700">
            Baca Semua Artikel
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <div key={i} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
              <div className={`h-44 bg-gradient-to-br ${a.color} p-6`}>
                <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {a.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors">{a.title}</h3>
                <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {a.readTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== ADMIN DASHBOARD PREVIEW ========== */
function AdminDashboardPreview() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 py-20 lg:py-28">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
            Admin Dashboard
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold text-white sm:text-4xl">
            Kelola bisnis travel dari satu dashboard
          </h2>
          <p className="mt-4 text-slate-400">
            Dashboard admin yang powerful untuk mengelola destinasi, pesanan, tiket, blog, promo, dan semua kebutuhan bisnis travel
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-sm">
            <div className="rounded-xl bg-slate-800 p-6">
              {/* Top bar */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600" />
                  <span className="text-sm font-bold text-white">Admin Panel</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-400">Online</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  { label: 'Total Pesanan', value: '1,247', change: '+12%', color: 'text-blue-400' },
                  { label: 'Revenue', value: 'Rp 2.8M', change: '+8%', color: 'text-emerald-400' },
                  { label: 'Customer', value: '856', change: '+15%', color: 'text-purple-400' },
                  { label: 'Rating', value: '4.9/5', change: '+0.2', color: 'text-yellow-400' },
                ].map((stat, i) => (
                  <div key={i} className="rounded-xl bg-slate-700/50 p-4">
                    <p className="text-xs text-slate-400">{stat.label}</p>
                    <p className={`mt-1 text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="mt-1 text-[10px] text-emerald-400">{stat.change}</p>
                  </div>
                ))}
              </div>

              {/* Feature list */}
              <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {['Kelola Destinasi', 'Verifikasi Bayar', 'Terbitkan Tiket', 'Kirim Notif WA', 'Blog Editor', 'Kode Promo', 'Ulasan', 'Pengaturan'].map((f, i) => (
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
    </section>
  );
}

/* ========== CTA SECTION ========== */
function CTASection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-app">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-indigo-700 px-8 py-16 sm:px-16 lg:py-20">
          {/* Decorative */}
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5 blur-2xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
              Siap memulai perjalanan impianmu?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-blue-100">
              Bergabung dengan 100.000+ traveler yang sudah mempercayakan perjalanan mereka bersama Octaf Kreasi
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/destinasi" className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-primary shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]">
                Mulai Jelajahi
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link href="/register" className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10">
                Daftar Gratis
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
              {[
                { value: '500+', label: 'Destinasi' },
                { value: '100K+', label: 'Traveler' },
                { value: '4.9/5', label: 'Rating' },
                { value: '24/7', label: 'Support' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-blue-200">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
