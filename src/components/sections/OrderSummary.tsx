/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { cn } from '@/lib/utils';
import { formatRupiah } from '@/lib/format';
import type { OrderDetails } from '@/types';

export interface OrderSummaryProps {
  order: OrderDetails;
  className?: string;
}

export function OrderSummary({ order, className }: OrderSummaryProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Destination Info */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="mb-4 text-base font-semibold text-gray-900">Detail Pesanan</h3>

        <div className="mb-4 flex gap-3">
          <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-200">
            {order.destination.image ? (
              <img
                src={order.destination.image}
                alt={order.destination.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                Foto
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{order.destination.name}</p>
            <p className="text-xs text-gray-500">{order.destination.duration}</p>
          </div>
        </div>

        <div className="space-y-2 border-t border-gray-100 pt-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Tanggal</span>
            <span className="text-gray-900">{order.dates.departure}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Peserta</span>
            <span className="text-gray-900">
              {order.guests.adults} Dewasa
              {order.guests.children > 0 && `, ${order.guests.children} Anak`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Hotel</span>
            <span className="text-gray-900">{order.hotel}</span>
          </div>
        </div>
      </div>

      {/* Rincian Harga */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="mb-3 text-base font-semibold text-gray-900">Rincian Harga</h3>

        <div className="space-y-2 text-sm">
          {order.pricing.items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-gray-600">{item.label}</span>
              <span className="text-gray-900">{formatRupiah(item.amount)}</span>
            </div>
          ))}

          {/* Promo Code Badge */}
          {order.pricing.promoCode && order.pricing.promoDiscount && (
            <div className="flex items-center justify-between border-t border-gray-100 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Diskon</span>
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  {order.pricing.promoCode}
                </span>
              </div>
              <span className="font-medium text-green-600">
                -{formatRupiah(order.pricing.promoDiscount)}
              </span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">Total Pembayaran</span>
            <span className="text-lg font-bold text-primary">
              {formatRupiah(order.pricing.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Butuh Bantuan */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
        <p className="text-sm text-gray-600">Butuh bantuan?</p>
        <a
          href="/kontak"
          className="mt-1 inline-block text-sm font-semibold text-primary hover:underline"
        >
          Hubungi Kami
        </a>
      </div>

      {/* Kebijakan Pembatalan */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h4 className="mb-2 text-sm font-semibold text-gray-900">Kebijakan Pembatalan</h4>
        <ul className="space-y-1 text-xs text-gray-600">
          <li>• Pembatalan gratis hingga 7 hari sebelum keberangkatan</li>
          <li>• Pembatalan 3-7 hari sebelum keberangkatan dikenakan biaya 50%</li>
          <li>• Pembatalan kurang dari 3 hari tidak dapat dikembalikan</li>
        </ul>
      </div>
    </div>
  );
}
