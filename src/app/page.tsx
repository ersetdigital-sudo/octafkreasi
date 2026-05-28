'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { SearchBar } from '@/components/sections/SearchBar';
import { TrustBar } from '@/components/sections/TrustBar';
import { PopularDestinations } from '@/components/sections/PopularDestinations';
import { PromoBanner } from '@/components/sections/PromoBanner';
import { supabase } from '@/lib/supabase';
import type { Destination } from '@/types';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://octafkreasi.com/#website',
      name: 'octafkreasi',
      url: 'https://octafkreasi.com',
      description: 'Platform booking perjalanan wisata terpercaya di Indonesia',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://octafkreasi.com/destinasi?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://octafkreasi.com/#organization',
      name: 'octafkreasi',
      url: 'https://octafkreasi.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://octafkreasi.com/favicon.svg',
      },
      sameAs: [
        'https://www.facebook.com/octafkreasi',
        'https://www.instagram.com/octafkreasi',
        'https://twitter.com/octafkreasi',
        'https://www.youtube.com/@octafkreasi',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['Indonesian', 'English'],
      },
    },
  ],
};

export default function Home() {
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    supabase
      .from('destinations')
      .select('*')
      .eq('is_active', true)
      .order('review_count', { ascending: false })
      .limit(8)
      .then(({ data }) => {
        if (data) {
          setDestinations(data.map((d) => ({
            id: d.id,
            name: d.name,
            country: d.country,
            slug: d.slug,
            image: d.image || '',
            imageAlt: d.image_alt || d.name,
            rating: d.rating || 4.5,
            reviewCount: d.review_count || 0,
            priceStartFrom: d.price_start_from || 0,
            currency: 'IDR' as const,
            tags: [d.category || 'alam'],
            isWishlisted: false,
          })));
        }
      });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main>
        <HeroSection />
        <SearchBar />
        <TrustBar />
        <PopularDestinations destinations={destinations} />
        <PromoBanner />
      </main>

      <Footer />
    </div>
  );
}
