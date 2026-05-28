'use client';

import React, { useState, useRef } from 'react';
import type { Review } from '@/types';

export interface ReviewsProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

// Fallback reviews for when real data is sparse
const FALLBACK_REVIEWS: Review[] = [
  { id: 'fb-1', author: 'Dian Permata', content: 'Perjalanan yang sangat berkesan! Pemandangan luar biasa dan guide sangat ramah. Pasti akan kembali lagi.', rating: 5, date: '2025-03-10', helpful: 12, destinationSlug: '' },
  { id: 'fb-2', author: 'Rizky Aditya', content: 'Pelayanan top, destinasi indah, dan harga sangat worth it. Recommended banget untuk liburan keluarga.', rating: 5, date: '2025-02-20', helpful: 8, destinationSlug: '' },
  { id: 'fb-3', author: 'Maya Sari', content: 'Pengalaman pertama booking di sini dan sangat puas. Semua terorganisir dengan baik dari awal sampai akhir.', rating: 4, date: '2025-01-15', helpful: 5, destinationSlug: '' },
];

export function Reviews({ reviews, rating, reviewCount }: ReviewsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Use real reviews only — no fallback for new destinations
  const displayReviews = reviews;

  if (displayReviews.length === 0) return null; // Don't render section if no real reviews

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="py-8">
      {/* Header + Rating Summary */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 md:text-2xl">Apa Kata Mereka?</h2>
          <div className="mt-2 flex items-center gap-2.5">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className={`h-4.5 w-4.5 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-lg font-bold text-gray-900">{rating}</span>
            <span className="text-sm text-gray-400">dari {reviewCount.toLocaleString('id-ID')} reviews</span>
          </div>
        </div>

        {/* Scroll arrows — desktop */}
        <div className="hidden items-center gap-2 md:flex">
          <button type="button" onClick={() => scroll('left')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:border-gray-300 hover:shadow-md">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button type="button" onClick={() => scroll('right')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:border-gray-300 hover:shadow-md">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayReviews.map((review) => (
          <ReviewCard key={review.id} review={review} isReal={reviews.some(r => r.id === review.id)} />
        ))}
      </div>
    </section>
  );
}

function ReviewCard({ review, isReal }: { review: Review; isReal: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const initial = review.author.charAt(0).toUpperCase();
  const isLong = review.content.length > 180;

  return (
    <div className="group flex-shrink-0 w-[300px] snap-start rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-900/[0.04] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg md:w-[340px]">
      {/* Author row */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
          <span className="text-sm font-bold text-white">{initial}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900 truncate">{review.author}</p>
            {isReal && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 ring-1 ring-emerald-200">
                <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-400">
            {new Date(review.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stars */}
      <div className="mt-3 flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} className={`h-4 w-4 ${star <= review.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Content */}
      <div className="relative mt-3">
        <p className={`text-sm leading-relaxed text-gray-600 ${!expanded && isLong ? 'line-clamp-4' : ''}`}>
          {review.content}
        </p>
        {isLong && !expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>
      {isLong && (
        <button type="button" onClick={() => setExpanded(!expanded)}
          className="mt-1.5 text-xs font-semibold text-[#2563FF] hover:underline">
          {expanded ? 'Tutup' : 'Lihat Selengkapnya'}
        </button>
      )}
    </div>
  );
}
