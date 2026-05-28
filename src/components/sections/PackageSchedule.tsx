/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { StarRating } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface PackageScheduleProps {
  destinationName: string;
  destinationImage: string;
  duration: string;
  hotelRating: number;
  departureDate: string;
  onDepartureDateChange: (date: string) => void;
  participantCount: number;
  onParticipantCountChange: (count: number) => void;
  className?: string;
}

const departureDates = [
  '15 Januari 2025',
  '22 Januari 2025',
  '5 Februari 2025',
  '12 Februari 2025',
  '19 Februari 2025',
  '5 Maret 2025',
];

export function PackageSchedule({
  destinationName,
  destinationImage,
  duration,
  hotelRating,
  departureDate,
  onDepartureDateChange,
  participantCount,
  onParticipantCountChange,
  className,
}: PackageScheduleProps) {
  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white p-6', className)}>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Paket Perjalanan</h2>

      {/* Selected Package Info */}
      <div className="mb-6 flex gap-4">
        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-200">
          {destinationImage && (
            <img
              src={destinationImage}
              alt={destinationName}
              className="h-full w-full object-cover"
            />
          )}
          {!destinationImage && (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              Foto
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="font-semibold text-gray-900">{destinationName}</h3>
          <p className="text-sm text-gray-500">{duration}</p>
          <div className="mt-1 flex items-center gap-1">
            <StarRating rating={hotelRating} size="sm" />
            <span className="text-xs text-gray-500">Hotel</span>
          </div>
        </div>
      </div>

      {/* Schedule Selection */}
      <div className="space-y-4">
        <div>
          <label htmlFor="departure-date" className="mb-1.5 block text-sm font-medium text-gray-700">
            Tanggal Berangkat
          </label>
          <select
            id="departure-date"
            value={departureDate}
            onChange={(e) => onDepartureDateChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Pilih tanggal keberangkatan</option>
            {departureDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="participant-count" className="mb-1.5 block text-sm font-medium text-gray-700">
            Jumlah Peserta
          </label>
          <select
            id="participant-count"
            value={participantCount}
            onChange={(e) => onParticipantCountChange(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Orang' : 'Orang'}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
