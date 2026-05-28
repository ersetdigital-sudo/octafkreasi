import React from 'react';
import Link from 'next/link';

export interface PremiumCTAProps {
  destinationName: string;
}

export function PremiumCTA({ destinationName }: PremiumCTAProps) {
  return (
    <section className="py-6">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-10 text-center sm:px-10 sm:py-14">
        <h2 className="font-heading text-xl font-bold text-white sm:text-2xl lg:text-3xl">
          Siap Memulai Petualanganmu di {destinationName}?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-blue-100 sm:text-base">
          Ribuan destinasi menanti. Pesan sekarang dan dapatkan harga terbaik.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/destinasi"
            className="inline-flex items-center justify-center rounded-xl border-2 border-white px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-blue-700"
          >
            Jelajahi Destinasi Lain
          </Link>
          <Link
            href="/booking/peserta"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-50"
          >
            Pesan Sekarang
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
