'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { DestinationCard } from '@/components/ui/DestinationCard';
import type { Destination } from '@/types';

interface PopularDestinationsProps {
  destinations: Destination[];
}

const BADGES: Record<number, string> = {
  0: 'BEST SELLER',
  1: 'POPULER',
  2: 'POPULER',
};

export function PopularDestinations({ destinations }: PopularDestinationsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-14">
      <div className="container-app">
        {/* Section Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-3xl font-bold text-gray-900">
              Destinasi Terbaik Indonesia
            </h2>
            <div className="mt-2 h-1 w-20 rounded-full bg-gradient-to-r from-primary to-primary-400" />
            <p className="mt-3 text-gray-500">
              Jelajahi keindahan alam dan budaya Indonesia yang menakjubkan
            </p>
          </div>
          <Link
            href="/destinasi"
            className="hidden items-center gap-1 rounded-full border border-primary/20 bg-primary-50 px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white sm:inline-flex"
          >
            Lihat Semua
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {destinations.map((destination, index) => (
              <div key={destination.id} style={{ scrollSnapAlign: 'start' }}>
                <DestinationCard
                  destination={destination}
                  badge={BADGES[index]}
                />
              </div>
            ))}
          </div>

          {/* Left Arrow */}
          <button
            type="button"
            onClick={scrollLeft}
            className="absolute -left-4 top-[40%] z-10 hidden h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-lg transition-all hover:bg-primary hover:text-white sm:flex"
            aria-label="Scroll kiri"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={scrollRight}
            className="absolute -right-4 top-[40%] z-10 hidden h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-lg transition-all hover:bg-primary hover:text-white sm:flex"
            aria-label="Scroll kanan"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Mobile "Lihat Semua" */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/destinasi"
            className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary-50 px-5 py-2.5 text-sm font-semibold text-primary"
          >
            Lihat Semua Destinasi →
          </Link>
        </div>
      </div>
    </section>
  );
}
