import React from 'react';
import Link from 'next/link';
import { formatRupiah } from '@/lib/format';

export interface StickyBottomBarProps {
  name: string;
  duration: string;
  rating: number;
  reviewCount: number;
  price: number;
  destinationSlug: string;
  image: string;
}

export function StickyBottomBar({ name, duration, rating, price, destinationSlug, image }: StickyBottomBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white px-3 py-2.5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] sm:px-4 sm:py-3 lg:hidden">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Thumbnail */}
        <div
          className="h-10 w-10 flex-shrink-0 rounded-lg bg-cover bg-center sm:h-12 sm:w-12"
          style={{ backgroundImage: `url(${image})` }}
          aria-hidden="true"
        />

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-gray-900 sm:text-sm">{name}</p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="text-[10px] text-gray-500 sm:text-xs">{duration}</span>
            <span className="text-[10px] text-gray-300">•</span>
            <span className="flex items-center gap-0.5">
              <svg className="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
              </svg>
              <span className="text-[10px] font-medium text-gray-600 sm:text-xs">{rating.toFixed(1)}</span>
            </span>
          </div>
          <p className="mt-0.5 text-[10px] text-gray-500 sm:text-xs">
            <span className="font-bold text-gray-900">{formatRupiah(price)}</span> /orang
          </p>
        </div>

        {/* CTA button */}
        <Link
          href={`/destinasi/${destinationSlug}/booking`}
          className="flex-shrink-0 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 sm:px-4 sm:py-2.5 sm:text-sm"
        >
          Lihat Paket
        </Link>
      </div>
    </div>
  );
}
