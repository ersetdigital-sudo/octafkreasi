'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatRupiah } from '@/lib/format';
import { setBookingState } from '@/lib/booking-store';
import { useAuth } from '@/lib/auth-context';
import { addToWishlist, removeFromWishlist, isInWishlist } from '@/lib/wishlist';
import { supabase } from '@/lib/supabase';
import type { Review } from '@/types';

export interface BookingCardProps {
  price: number;
  destinationSlug: string;
  destinationName: string;
  rating: number;
  reviewCount: number;
  duration: string;
  reviews?: Review[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function BookingCard({ price, destinationSlug, destinationName, rating, reviewCount, duration }: BookingCardProps) {
  const router = useRouter();
  const [waNumber, setWaNumber] = useState('');

  useEffect(() => {
    supabase.from('settings').select('value').eq('id', 'business').single()
      .then(({ data }) => {
        if (data?.value) {
          const val = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          if (val.whatsapp) setWaNumber(val.whatsapp);
        }
      });
  }, []);
  const { user } = useAuth();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [date, setDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [dateError, setDateError] = useState(false);

  // Min date = tomorrow (local timezone)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  // Check wishlist status on mount
  useEffect(() => {
    if (user) {
      isInWishlist(destinationSlug).then(setIsWishlisted);
    }
  }, [user, destinationSlug]);

  const handleWishlistToggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (isWishlisted) {
      const success = await removeFromWishlist(destinationSlug);
      if (success) setIsWishlisted(false);
    } else {
      const success = await addToWishlist({
        destination_slug: destinationSlug,
        destination_name: destinationName,
        destination_image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
      });
      if (success) setIsWishlisted(true);
    }
  };

  const handleBookNow = async () => {
    // Validate date
    if (!date || date < minDate) {
      setDateError(true);
      setDate('');
      return;
    }

    // Check if user is logged in
    if (!user) {
      router.push('/login');
      return;
    }

    setBookingLoading(true);

    // Save booking state and navigate to checkout
    setBookingState({
      destinationName,
      destinationSlug,
      destinationImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
      duration,
      date,
      adults,
      children,
      pricePerPerson: price,
      packageTotal: price * adults,
      total: price * adults,
    });
    router.push(`/booking/peserta?dest=${destinationSlug}&date=${date}&adults=${adults}&children=${children}`);

    setBookingLoading(false);
  };

  return (
    <div className="sticky top-20 space-y-6">
      {/* Main Booking Card */}
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-lg">
        {/* Header with price and wishlist */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs text-gray-500">Paket dari</span>
            <p className="mt-0.5 text-2xl font-bold text-gray-900">
              {formatRupiah(price * adults)} <span className="text-sm font-normal text-gray-500">/{adults} orang</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleWishlistToggle}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 transition-colors hover:border-red-200 hover:bg-red-50"
            aria-label="Tambah ke wishlist"
          >
            <svg
              className={`h-5 w-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
              fill={isWishlisted ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
        </div>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-1.5">
          <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
          </svg>
          <span className="text-sm font-semibold text-gray-800">{rating.toFixed(1)}</span>
          <span className="text-xs text-gray-500">({reviewCount} reviews)</span>
        </div>

        {/* Info rows */}
        <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
          <InfoRow icon="clock" label="Durasi" value={duration} />
          <InfoRow icon="users" label="Tipe Trip" value="Private Trip" />
          <InfoRow icon="group" label="Kapasitas Trip" value="Min 2 - Maks 12 Orang" />
          <InfoRow icon="check" label="Konfirmasi" value="Instan" />
        </div>

        {/* Date picker */}
        <div className="mt-4">
          <label className="text-xs font-medium text-gray-700">Pilih Tanggal Keberangkatan</label>
          <input
            type="text"
            placeholder="Pilih tanggal"
            value={date}
            onChange={(e) => {
              const val = e.target.value;
              if (val && val < minDate) return; // block past dates
              setDate(val);
              setDateError(false);
            }}
            onFocus={(e) => { e.currentTarget.type = 'date'; e.currentTarget.min = minDate; }}
            min={minDate}
            className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm text-gray-700 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 ${
              dateError ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'
            }`}
          />
          {dateError && (
            <p className="mt-1.5 animate-[fadeIn_0.2s_ease-out] text-xs text-red-500">
              Pilih tanggal keberangkatan terlebih dahulu
            </p>
          )}
        </div>

        {/* Guest selector */}
        <div className="mt-4">
          <label className="text-xs font-medium text-gray-700">Jumlah Peserta</label>
          <div className="mt-1.5 space-y-2">
            <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-2.5">
              <span className="text-sm text-gray-700">Dewasa</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:border-primary hover:text-primary"
                  aria-label="Kurangi dewasa"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                  </svg>
                </button>
                <span className="w-4 text-center text-sm font-semibold">{adults}</span>
                <button
                  type="button"
                  onClick={() => setAdults(Math.min(12, adults + 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:border-primary hover:text-primary"
                  aria-label="Tambah dewasa"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-2.5">
              <span className="text-sm text-gray-700">Anak</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:border-primary hover:text-primary"
                  aria-label="Kurangi anak"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                  </svg>
                </button>
                <span className="w-4 text-center text-sm font-semibold">{children}</span>
                <button
                  type="button"
                  onClick={() => setChildren(Math.min(6, children + 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:border-primary hover:text-primary"
                  aria-label="Tambah anak"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-5 space-y-3">
          <button
            type="button"
            onClick={handleBookNow}
            disabled={bookingLoading}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all ${
              !date
                ? 'bg-primary/70 hover:bg-primary'
                : 'bg-primary hover:bg-primary-700'
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {bookingLoading ? (
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              'Pesan Sekarang'
            )}
          </button>
          <a
            href={`https://wa.me/${waNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Halo, saya tertarik dengan destinasi ${destinationName}, boleh konsultasi lebih lanjut?`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary py-3 text-sm font-bold text-primary transition-colors hover:bg-primary-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            </svg>
            Chat Konsultasi
          </a>
        </div>

      </div>

      {/* Butuh Bantuan */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-900">Butuh Bantuan?</p>
        <p className="mt-1 text-xs text-gray-500">Tim kami siap membantu merencanakan perjalanan ke {destinationName}</p>
        <Link
          href="/kontak"
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-700"
        >
          Hubungi Kami
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <InfoRowIcon type={icon} />
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

function InfoRowIcon({ type }: { type: string }) {
  const cls = "h-4 w-4 text-gray-400";
  switch (type) {
    case 'clock':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      );
    case 'users':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      );
    case 'group':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
      );
    case 'check':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      );
    default:
      return null;
  }
}

