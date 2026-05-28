'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Destination } from '@/types';
import { formatRupiah } from '@/lib/format';

interface DestinationPopularMiniProps {
  destinations: Destination[];
}

export function DestinationPopularMini({ destinations }: DestinationPopularMiniProps) {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Destinasi Populer</h2>
        <Link
          href="/"
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Lihat semua
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>

      <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide sm:gap-4">
        {destinations.slice(0, 4).map((dest) => (
          <Link
            key={dest.id}
            href={`/destinasi/${dest.slug}`}
            className="group min-w-[160px] flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md sm:min-w-[200px]"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={dest.image}
                alt={dest.imageAlt}
                fill
                sizes="200px"
                className="object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
              {/* Wishlist */}
              <button
                type="button"
                className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm"
                aria-label="Tambah ke wishlist"
                onClick={(e) => e.preventDefault()}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-3">
              <h3 className="text-sm font-semibold text-gray-900">{dest.name}</h3>
              <div className="mt-1 flex items-center gap-1">
                <svg className="h-3.5 w-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                </svg>
                <span className="text-xs font-medium text-gray-700">{dest.rating}</span>
              </div>
              <p className="mt-1.5 text-sm font-bold text-primary">
                {formatRupiah(dest.priceStartFrom)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
