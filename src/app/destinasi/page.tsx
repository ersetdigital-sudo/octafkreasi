'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DestinationCard } from '@/components/ui/DestinationCard';
import { supabase } from '@/lib/supabase';
import type { Destination } from '@/types';

export default function DestinasiPage() {
  const [search, setSearch] = useState('');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    const { data } = await supabase
      .from('destinations')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (data) {
      const mapped: Destination[] = data.map((d) => ({
        id: d.id,
        name: d.name,
        country: d.country,
        slug: d.slug,
        image: d.image || '',
        imageAlt: d.image_alt || d.name,
        rating: d.review_count > 0 ? (d.rating || 0) : 0,
        reviewCount: d.review_count || 0,
        priceStartFrom: d.price_start_from || 0,
        currency: 'IDR' as const,
        tags: [d.category || 'alam'],
        isWishlisted: false,
        badge: d.badge || '',
      }));
      setDestinations(mapped);
    }
    setLoading(false);
  };

  const filtered = destinations.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-12 md:py-16">
        <div className="container-app">
          {/* Page Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Semua Destinasi
            </h1>
            <p className="mt-4 text-gray-600">
              Jelajahi destinasi wisata terbaik di Indonesia
            </p>
          </div>

          {/* Search Input */}
          <div className="mx-auto mt-8 max-w-md">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input
                type="text"
                placeholder="Cari destinasi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Destinations Grid */}
          {loading ? (
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-200" />
              ))}
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  badge={destination.badge ? ({'best-seller': 'BEST SELLER', 'populer': 'POPULER', 'baru': 'BARU'}[destination.badge] || '') : undefined}
                  className="w-full"
                />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="mt-12 text-center">
              <p className="text-gray-500">
                Tidak ada destinasi yang cocok dengan pencarian Anda.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
