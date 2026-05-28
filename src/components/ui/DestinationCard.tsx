'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Destination } from '@/types';
import { cn } from '@/lib/utils';
import { formatRupiah } from '@/lib/format';
import { useWishlist } from '@/lib/wishlist-context';

export interface DestinationCardProps {
  destination: Destination;
  onWishlistToggle?: (id: string) => void;
  className?: string;
  badge?: string;
}

export function DestinationCard({
  destination,
  className,
  badge,
}: DestinationCardProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(destination.slug);
  const formattedReviews = destination.reviewCount.toString();

  return (
    <article className={cn('w-72 shrink-0 [.grid_&]:w-full', className)}>
      <Link href={`/destinasi/${destination.slug}`} className="group block">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-card transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
          <Image
            src={destination.image}
            alt={destination.imageAlt}
            fill
            sizes="288px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Badge */}
          {badge && (
            <span className="absolute left-3 top-3 z-10 rounded-md bg-gradient-to-r from-red-500 to-orange-500 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
              {badge}
            </span>
          )}

          {/* Wishlist button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(destination.slug, { name: destination.name, image: destination.image });
            }}
            className={cn(
              'absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-all hover:scale-110',
              wishlisted ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-600 hover:text-red-500'
            )}
            aria-label={wishlisted ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
          >
            <svg className="h-4.5 w-4.5" fill={wishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>

          {/* Bottom gradient overlay — stronger and more dramatic */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Bottom text overlay */}
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3 className="text-xl font-bold text-white">{destination.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-white/85">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path fillRule="evenodd" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" clipRule="evenodd" />
              </svg>
              {destination.country}
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-sm">
              <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>
              <span className="font-semibold text-white">{destination.rating}</span>
              <span className="text-white/70">({formattedReviews} reviews)</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Price below card */}
      <div className="mt-3 px-1">
        <p className="text-xs text-gray-500">Mulai dari</p>
        <p className="text-lg font-bold text-primary">
          {formatRupiah(destination.priceStartFrom)}
        </p>
      </div>
    </article>
  );
}
