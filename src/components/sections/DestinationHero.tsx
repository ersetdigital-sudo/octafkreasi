'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { DestinationDetail } from '@/types';

export interface DestinationHeroProps {
  destination: DestinationDetail;
}

export function DestinationHero({ destination }: DestinationHeroProps) {
  const galleryImages = destination.gallery.slice(0, 4);
  const mainImage = destination.image;
  const sideImages = galleryImages.slice(0, 3);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const allImages = [
    { id: 'main', src: mainImage, alt: destination.imageAlt },
    ...destination.gallery.map((g) => ({ id: g.id, src: g.src, alt: g.alt })),
  ];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="container-app py-4 sm:py-6">
      <div className="grid h-[280px] grid-cols-1 gap-2 sm:h-[360px] md:h-[420px] lg:h-[480px] lg:grid-cols-3 lg:gap-3">
        {/* Main large image (left ~65%) */}
        <div className="relative col-span-1 cursor-pointer overflow-hidden rounded-2xl lg:col-span-2 lg:rounded-3xl" onClick={() => openLightbox(0)}>
          <Image
            src={mainImage}
            alt={destination.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 65vw"
            className="object-cover"
            priority
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Populer badge */}
          {destination.badges.length > 0 && (
            <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
              <span className="inline-flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                </svg>
                {destination.badges[0]}
              </span>
            </div>
          )}

          {/* Bottom content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
            <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {destination.name}
            </h1>
            <p className="mt-1 line-clamp-2 text-sm text-white/80 sm:mt-2 sm:text-base lg:text-lg">
              {destination.name === 'Bali' ? 'Pulau Dewata, Surga Tropis di Indonesia' : destination.description}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 sm:mt-3 sm:gap-4">
              <span className="flex items-center gap-1 text-xs text-white/90 sm:text-sm">
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path fillRule="evenodd" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" clipRule="evenodd" />
                </svg>
                {destination.name}, Indonesia
              </span>
              <span className="flex items-center gap-1 text-xs text-white/90 sm:text-sm">
                <svg className="h-3.5 w-3.5 text-yellow-400 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                </svg>
                {destination.rating} ({destination.reviewCount} reviews)
              </span>
            </div>
            {/* Traveler avatars */}
            <div className="mt-3 hidden items-center gap-2 sm:flex">
              <div className="flex -space-x-2">
                <div className="h-7 w-7 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-purple-400" />
                <div className="h-7 w-7 rounded-full border-2 border-white bg-gradient-to-br from-green-400 to-teal-400" />
                <div className="h-7 w-7 rounded-full border-2 border-white bg-gradient-to-br from-orange-400 to-red-400" />
              </div>
              <span className="text-xs text-white/80">+{destination.reviewCount} traveler</span>
            </div>
          </div>
        </div>

        {/* Right: 3 stacked images (~35%) */}
        <div className="hidden grid-rows-3 gap-2 lg:grid lg:gap-3">
          {sideImages.map((img, index) => (
            <div key={img.id} className="relative overflow-hidden rounded-2xl lg:rounded-3xl">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="35vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
          {/* "Lihat Semua Foto" button on last image */}
          {sideImages.length >= 3 && (
            <button
              type="button"
              className="absolute bottom-4 right-4 z-10 hidden items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-800 shadow-lg transition-transform hover:scale-105 lg:inline-flex"
              style={{ position: 'relative', marginTop: '-48px', marginLeft: 'auto', marginRight: '16px' }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
              </svg>
              Lihat Semua Foto
            </button>
          )}
        </div>
      </div>

      {/* Mobile thumbnail strip (visible only on mobile/tablet) */}
      <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-hide lg:hidden">
        {sideImages.map((img, index) => (
          <button
            key={`mobile-${img.id}`}
            type="button"
            onClick={() => openLightbox(index + 1)}
            className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-28"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="100px"
              className="object-cover"
              loading="lazy"
            />
          </button>
        ))}
        {galleryImages.length > 3 && (
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="relative flex h-20 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 sm:h-24 sm:w-28"
          >
            <span className="text-xs font-semibold text-gray-600">+{galleryImages.length - 3} foto</span>
          </button>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={() => setLightboxOpen(false)}>
          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
            aria-label="Tutup"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute left-4 top-4 rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
            {lightboxIndex + 1} / {allImages.length}
          </div>

          {/* Image */}
          <div className="relative h-[80vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={allImages[lightboxIndex]?.src || mainImage}
              alt={allImages[lightboxIndex]?.alt || ''}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Prev button */}
          {lightboxIndex > 0 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => i - 1); }}
              className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
              aria-label="Sebelumnya"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          {/* Next button */}
          {lightboxIndex < allImages.length - 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => i + 1); }}
              className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
              aria-label="Selanjutnya"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>
      )}
    </section>
  );
}
