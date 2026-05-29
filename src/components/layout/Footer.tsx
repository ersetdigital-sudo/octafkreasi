'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const footerNavigation = {
  destinasi: [
    { label: 'Bali', href: '/destinasi/bali' },
    { label: 'Raja Ampat', href: '/destinasi/raja-ampat' },
    { label: 'Labuan Bajo', href: '/destinasi/labuan-bajo' },
    { label: 'Yogyakarta', href: '/destinasi/yogyakarta' },
  ],
  layanan: [
    { label: 'Paket Tour', href: '/destinasi' },
    { label: 'Aktivitas Wisata', href: '/destinasi' },
    { label: 'Private Trip', href: '/destinasi' },
    { label: 'Group Tour', href: '/destinasi' },
  ],
  perusahaan: [
    { label: 'Tentang Kami', href: '/tentang-kami' },
    { label: 'Blog', href: '/blog' },
  ],
  bantuan: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Hubungi Kami', href: '/kontak' },
    { label: 'Kebijakan Privasi', href: '/privasi' },
    { label: 'Syarat & Ketentuan', href: '/syarat-ketentuan' },
  ],
};

export function Footer() {
  const [social, setSocial] = useState({ facebook: '', instagram: '', twitter: '', youtube: '' });

  useEffect(() => {
    supabase.from('settings').select('*').eq('id', 'social').single()
      .then(({ data }) => {
        if (data?.value) {
          const val = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          setSocial(val);
        }
      });
  }, []);
  return (
    <footer className="border-t border-gray-100 bg-gray-50 pb-20 md:pb-0">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <img src="https://res.cloudinary.com/dqjh7utdb/image/upload/e_background_removal/f_png,w_120,q_auto,f_auto/v1779950494/owbbuyhkedcppgjiaeyo.jpg" alt="Octaf Kreasi" className="h-9 w-auto" />
              <span className="text-xl font-bold text-gray-900">
                octaf<span className="text-primary">kreasi</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              Jasa tour travel terpercaya di Indonesia. Temukan paket wisata terbaik ke destinasi impianmu dengan harga terjangkau. Liburan Murah, Liburan Ceria.
            </p>
          </div>

          {/* Navigation Columns */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Destinasi</h3>
            <ul className="mt-3 space-y-2">
              {footerNavigation.destinasi.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-gray-500 transition-colors hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Layanan</h3>
            <ul className="mt-3 space-y-2">
              {footerNavigation.layanan.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-gray-500 transition-colors hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Perusahaan</h3>
            <ul className="mt-3 space-y-2">
              {footerNavigation.perusahaan.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-gray-500 transition-colors hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Bantuan</h3>
            <ul className="mt-3 space-y-2">
              {footerNavigation.bantuan.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-gray-500 transition-colors hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="mt-10 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition-colors hover:bg-primary hover:text-white" aria-label="Facebook">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition-colors hover:bg-primary hover:text-white" aria-label="Instagram">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition-colors hover:bg-primary hover:text-white" aria-label="Twitter">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition-colors hover:bg-primary hover:text-white" aria-label="YouTube">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              )}
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-500">
              � 2024 Octaf Kreasi. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
