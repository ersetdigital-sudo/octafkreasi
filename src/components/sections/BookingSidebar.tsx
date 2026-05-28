/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { StarRating, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { formatRupiah } from '@/lib/format';
import type { BookingSummary } from '@/types';

export interface BookingSidebarProps {
  summary: BookingSummary;
  promoCode: string;
  onPromoCodeChange: (code: string) => void;
  onApplyPromo: () => void;
  promoMessage?: string;
  promoError?: string;
  className?: string;
}

export function BookingSidebar({
  summary,
  promoCode,
  onPromoCodeChange,
  onApplyPromo,
  promoMessage,
  promoError,
  className,
}: BookingSidebarProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Ringkasan Perjalanan */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="mb-4 text-base font-semibold text-gray-900">Ringkasan Perjalanan</h3>

        <div className="mb-4 flex gap-3">
          <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-200">
            {summary.destination.image ? (
              <img
                src={summary.destination.image}
                alt={summary.destination.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                Foto
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{summary.destination.name}</p>
            <p className="text-xs text-gray-500">{summary.destination.duration}</p>
            <div className="mt-1 flex items-center gap-1">
              <StarRating rating={summary.destination.hotelRating} size="sm" />
            </div>
          </div>
        </div>

        <div className="space-y-2 border-t border-gray-100 pt-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Tanggal</span>
            <span className="text-gray-900">{summary.dates.departure}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Peserta</span>
            <span className="text-gray-900">
              {summary.guests.adults} Dewasa
              {summary.guests.children > 0 && `, ${summary.guests.children} Anak`}
            </span>
          </div>
        </div>
      </div>

      {/* Rincian Harga */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="mb-4 text-base font-semibold text-gray-900">Rincian Harga</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Paket Tour</span>
            <span className="text-gray-900">{formatRupiah(summary.pricing.packagePrice)}</span>
          </div>
          {summary.pricing.insurance && summary.pricing.insurance > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Asuransi Perjalanan</span>
              <span className="text-gray-900">{formatRupiah(summary.pricing.insurance)}</span>
            </div>
          )}
          {summary.pricing.additionalOptions.map((opt) => (
            <div key={opt.name} className="flex justify-between">
              <span className="text-gray-600">{opt.name}</span>
              <span className="text-gray-900">{formatRupiah(opt.price)}</span>
            </div>
          ))}

          <div className="border-t border-gray-100 pt-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">{formatRupiah(summary.pricing.subtotal)}</span>
            </div>
          </div>
        </div>

        {/* Promo Code */}
        <div className="mt-4">
          <label htmlFor="promo-code" className="mb-1.5 block text-sm font-medium text-gray-700">
            Kode Promo
          </label>
          <div className="flex gap-2">
            <input
              id="promo-code"
              type="text"
              value={promoCode}
              onChange={(e) => onPromoCodeChange(e.target.value)}
              placeholder="Masukkan kode promo"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button variant="outline" size="sm" onClick={onApplyPromo}>
              Gunakan
            </Button>
          </div>
          {promoMessage && (
            <p className="mt-1.5 text-xs text-green-600">{promoMessage}</p>
          )}
          {promoError && (
            <p className="mt-1.5 text-xs text-red-500">{promoError}</p>
          )}
        </div>

        {/* Promo Discount */}
        {summary.pricing.promoDiscount && summary.pricing.promoDiscount > 0 && (
          <div className="mt-3 flex justify-between text-sm">
            <span className="text-green-600">Diskon Promo</span>
            <span className="font-medium text-green-600">
              -{formatRupiah(summary.pricing.promoDiscount)}
            </span>
          </div>
        )}

        {/* Total */}
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">Total Pembayaran</span>
            <span className="text-lg font-bold text-primary">
              {formatRupiah(summary.pricing.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-600">Pembatalan gratis</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="text-sm text-gray-600">Pembayaran aman</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-600">Booking aman &amp; terpercaya</span>
          </div>
        </div>
      </div>

      {/* Butuh Bantuan */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
        <p className="text-sm text-gray-600">Butuh Bantuan?</p>
        <a
          href="/kontak"
          className="mt-1 inline-block text-sm font-semibold text-primary hover:underline"
        >
          Hubungi Kami
        </a>
      </div>
    </div>
  );
}
