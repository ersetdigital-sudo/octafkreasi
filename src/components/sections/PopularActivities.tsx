'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { Activity } from '@/types';
import { formatRupiah } from '@/lib/format';

export interface PopularActivitiesProps {
  activities: Activity[];
}

export function PopularActivities({ activities }: PopularActivitiesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);

    // Calculate active dot index based on scroll position
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 12
      : 200;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(index, activities.length - 1));
  }, [activities.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState]);

  const scrollTo = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 12
      : 280;
    el.scrollBy({ left: direction === 'right' ? cardWidth : -cardWidth, behavior: 'smooth' });
  };

  return (
    <section className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Aktivitas Populer</h2>
        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Lihat semua
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>

      {/* Cards Container */}
      <div className="relative mt-4">
        {/* Left Arrow (hint) */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollTo('left')}
            className="absolute -left-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md transition-all hover:bg-primary hover:text-white sm:flex lg:hidden"
            aria-label="Scroll kiri"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}

        {/* Right Arrow (hint) */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollTo('right')}
            className="absolute -right-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md transition-all hover:bg-primary hover:text-white sm:flex lg:hidden"
            aria-label="Scroll kanan"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )}

        {/* Mobile: Horizontal snap scroll | Desktop: 4-column grid */}
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 sm:gap-4 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0"
          style={{ scrollbarWidth: 'thin' }}
        >
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="w-[75vw] min-w-[260px] max-w-[300px] flex-shrink-0 snap-start sm:w-[280px] lg:w-auto lg:min-w-0 lg:max-w-none"
            >
              <div className="group h-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 lg:hover:-translate-y-1 lg:hover:shadow-lg">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={activity.image}
                    alt={activity.name}
                    fill
                    sizes="(max-width: 640px) 75vw, (max-width: 1024px) 280px, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 p-4">
                  <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">
                    {activity.name}
                  </h3>

                  {/* Description */}
                  {activity.description && (
                    <p className="line-clamp-1 text-xs text-gray-500">
                      {activity.description}
                    </p>
                  )}

                  {/* Price */}
                  <p className="text-sm font-bold text-primary">
                    {activity.price === 0
                      ? 'Gratis'
                      : `${formatRupiah(activity.price)} /orang`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator Dots (mobile only) */}
        <div className="mt-3 flex items-center justify-center gap-1.5 lg:hidden">
          {activities.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-4 bg-primary'
                  : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
