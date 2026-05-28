'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';

export default function BantuanPage() {
  const [business, setBusiness] = useState({ name: 'Octafkreasi', email: '', whatsapp: '', address: '', hours_weekday: '', hours_weekend: '' });
  const [social, setSocial] = useState({ facebook: '', instagram: '', twitter: '', youtube: '' });

  useEffect(() => {
    Promise.all([
      supabase.from('settings').select('*').eq('id', 'business').single(),
      supabase.from('settings').select('*').eq('id', 'social').single(),
    ]).then(([bizRes, socRes]) => {
      if (bizRes.data?.value) {
        const val = typeof bizRes.data.value === 'string' ? JSON.parse(bizRes.data.value) : bizRes.data.value;
        setBusiness({ name: val.name || 'Octafkreasi', email: val.email || '', whatsapp: val.whatsapp || '', address: val.address || '', hours_weekday: val.hours_weekday || 'Senin - Jumat: 08:00 - 22:00', hours_weekend: val.hours_weekend || 'Sabtu - Minggu: 09:00 - 21:00' });
      }
      if (socRes.data?.value) {
        const val = typeof socRes.data.value === 'string' ? JSON.parse(socRes.data.value) : socRes.data.value;
        setSocial(val);
      }
    });
  }, []);

  const waLink = `https://wa.me/${business.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Halo Octafkreasi! Saya ingin bertanya tentang paket wisata.')}`;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background depth */}
      <div className="fixed inset-0 -z-10 bg-[#f8f9fb]" />
      <div className="fixed -top-40 -right-40 -z-10 h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-3xl" />
      <div className="fixed -bottom-40 -left-40 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-100/30 blur-3xl" />
      <div className="fixed inset-0 -z-10 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.65%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")' }} />

      <Header />

      <main className="container-app py-12 md:py-20">

        {/* ── Hero ── */}
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 shadow-sm ring-1 ring-slate-900/[0.06]">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-600">Tim support aktif</span>
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl" style={{ lineHeight: 1.15 }}>
            Ada yang bisa<br className="hidden sm:block" /> kami bantu?
          </h1>
          <p className="mt-4 text-base text-slate-400 max-w-md mx-auto leading-relaxed">
            Kami di sini untuk memastikan perjalananmu berjalan sempurna. Hubungi kapan saja.
          </p>
        </div>

        {/* ── WhatsApp CTA — Primary Focus ── */}
        <div className="mt-10 flex justify-center">
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-4 rounded-3xl px-8 py-5 text-white shadow-2xl shadow-green-600/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-3xl hover:shadow-green-600/30 active:scale-[0.97]"
            style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 50%, #15803D 100%)' }}>
            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div className="relative text-left">
              <p className="text-lg font-bold">Chat via WhatsApp</p>
              <p className="text-sm text-white/70">Biasanya membalas dalam 5 menit</p>
            </div>
            <svg className="relative h-5 w-5 text-white/50 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
        <p className="mt-3 text-center text-xs text-slate-300">{business.whatsapp || ''}</p>

        {/* ── Quick Links ── */}
        <div className="mt-14">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-300 mb-6">Bantuan Cepat</p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { title: 'FAQ', desc: 'Pertanyaan populer', href: '/faq', icon: 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z', bg: 'from-blue-500 to-indigo-600' },
              { title: 'Tentang Kami', desc: 'Kenali Octafkreasi', href: '/tentang-kami', icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z', bg: 'from-indigo-500 to-purple-600' },
              { title: 'Syarat & Ketentuan', desc: 'Ketentuan layanan', href: '/syarat-ketentuan', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', bg: 'from-amber-500 to-orange-600' },
              { title: 'Kebijakan Privasi', desc: 'Perlindungan data', href: '/privasi', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z', bg: 'from-emerald-500 to-teal-600' },
            ].map((item) => (
              <Link key={item.href} href={item.href}
                className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-900/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-blue-200/50">
                {/* Hover glow */}
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity group-hover:opacity-20" style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }} />
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.bg} shadow-sm transition-transform group-hover:scale-110`}>
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h3 className="mt-3.5 text-sm font-bold text-slate-800">{item.title}</h3>
                <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Contact Info ── */}
        <div className="mt-14">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-300 mb-6">Informasi Kontak</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Email */}
            <a href={`mailto:${business.email}`}
              className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.04] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563FF] transition-colors group-hover:bg-[#2563FF] group-hover:text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-700">Email</p>
                <p className="text-[11px] text-slate-400 truncate">{business.email || '—'}</p>
              </div>
            </a>

            {/* Jam */}
            <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.04]">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-700">Jam Operasional</p>
                <p className="text-[11px] text-slate-400">{business.hours_weekday}</p>
              </div>
            </div>

            {/* Alamat */}
            <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.04]">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-700">Alamat</p>
                <p className="text-[11px] text-slate-400 truncate">{business.address || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Social ── */}
        {(social.facebook || social.instagram || social.twitter || social.youtube) && (
          <div className="mt-12 text-center">
            <p className="text-xs text-slate-400 mb-4">Ikuti perjalanan kami</p>
            <div className="flex items-center justify-center gap-3">
              {social.facebook && <SocialIcon href={social.facebook} label="Facebook" hoverColor="hover:text-[#1877F2] hover:ring-blue-200" path="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />}
              {social.instagram && <SocialIcon href={social.instagram} label="Instagram" hoverColor="hover:text-pink-500 hover:ring-pink-200" path="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />}
              {social.twitter && <SocialIcon href={social.twitter} label="Twitter" hoverColor="hover:text-sky-500 hover:ring-sky-200" path="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />}
              {social.youtube && <SocialIcon href={social.youtube} label="YouTube" hoverColor="hover:text-red-500 hover:ring-red-200" path="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function SocialIcon({ href, label, hoverColor, path }: { href: string; label: string; hoverColor: string; path: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
      className={`flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-900/[0.06] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:scale-110 ${hoverColor}`}>
      <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24"><path d={path}/></svg>
    </a>
  );
}
