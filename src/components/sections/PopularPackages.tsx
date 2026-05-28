'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatRupiah } from '@/lib/format';
import type { Activity } from '@/types';

export interface PopularPackagesProps {
  activities: Activity[];
  destinationName: string;
  destinationSlug?: string;
}

interface PackageData {
  title: string;
  image: string;
  price: number;
  duration: string;
  badge: string;
  badgeColor: string;
  rating: number;
  reviews: string;
}

export function PopularPackages({ activities, destinationName, destinationSlug }: PopularPackagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate package data from activities
  const packages: PackageData[] = [
    {
      title: `${destinationName} 4 Hari 3 Malam`,
      image: activities[0]?.image || '',
      price: (activities[0]?.price || 500000) * 5,
      duration: '4 Hari 3 Malam',
      badge: 'Best Seller',
      badgeColor: 'bg-red-500',
      rating: 4.9,
      reviews: '2.1K',
    },
    {
      title: `${destinationName} Highlights 3 Hari`,
      image: activities[1]?.image || '',
      price: (activities[1]?.price || 400000) * 4,
      duration: '3 Hari 2 Malam',
      badge: 'Populer',
      badgeColor: 'bg-orange-500',
      rating: 4.8,
      reviews: '1.5K',
    },
    {
      title: `${destinationName} Adventure 5 Hari`,
      image: activities[2]?.image || '',
      price: (activities[2]?.price || 600000) * 6,
      duration: '5 Hari 4 Malam',
      badge: 'Populer',
      badgeColor: 'bg-orange-500',
      rating: 4.7,
      reviews: '980',
    },
  ];

  return (
    <section className="py-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-gray-900 sm:text-2xl">
          Paket Tour Populer di {destinationName}
        </h2>
      </div>

      <div
        ref={scrollRef}
        className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-hide lg:grid lg:grid-cols-3 lg:overflow-visible"
      >
        {packages.map((pkg, index) => (
          <div key={index} className="w-[280px] min-w-[280px] flex-shrink-0 snap-start lg:w-auto lg:min-w-0">
            <Link
              href={destinationSlug ? `/destinasi/${destinationSlug}/paket/${index + 1}` : `/booking/peserta?dest=${destinationName.toLowerCase().replace(/\s+/g, '-')}`}
              className="block h-full"
            >
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
                {/* Image - fixed height */}
                <div className="relative h-[160px] flex-shrink-0 overflow-hidden">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    sizes="(max-width: 1024px) 280px, 33vw"
                    className="object-cover"
                    loading="lazy"
                  />
                  {/* Badge */}
                  <div className="absolute left-3 top-3">
                    <span className={`rounded-full ${pkg.badgeColor} px-2.5 py-1 text-[10px] font-bold text-white`}>
                      {pkg.badge}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-sm font-bold text-gray-900">{pkg.title}</h3>

                  {/* Duration - single line */}
                  <div className="mt-2 flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span className="whitespace-nowrap text-xs text-gray-600">{pkg.duration}</span>
                  </div>

                  {/* Features - Makan & Transport only, inline */}
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12" />
                      </svg>
                      <span className="text-[10px] text-gray-500">Makan</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                      </svg>
                      <span className="text-[10px] text-gray-500">Transport</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-auto pt-3">
                    <span className="text-[11px] text-gray-500">Mulai dari</span>
                    <p className="text-lg font-bold text-primary">{formatRupiah(pkg.price)}</p>
                  </div>

                  {/* Rating */}
                  <div className="mt-2 flex items-center gap-1.5 border-t border-gray-50 pt-2">
                    <svg className="h-3.5 w-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                    </svg>
                    <span className="text-xs font-semibold text-gray-800">{pkg.rating}</span>
                    <span className="text-xs text-gray-500">({pkg.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
