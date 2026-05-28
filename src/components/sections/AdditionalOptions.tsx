'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatRupiah } from '@/lib/format';
import type { AdditionalOption } from '@/types';

export interface AdditionalOptionsProps {
  options: AdditionalOption[];
  onToggle: (id: string) => void;
  className?: string;
}

export function AdditionalOptions({ options, onToggle, className }: AdditionalOptionsProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="text-lg font-semibold text-gray-900">Opsi Tambahan</h2>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="space-y-4">
          {options.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={option.isChecked || false}
                onChange={() => onToggle(option.id)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{option.name}</span>
                  {option.isRecommended && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Direkomendasikan
                    </span>
                  )}
                </div>
                {option.description && (
                  <p className="mt-0.5 text-xs text-gray-500">{option.description}</p>
                )}
              </div>
              <span className="shrink-0 text-sm font-semibold text-primary">
                {formatRupiah(option.price)}
                <span className="text-xs font-normal text-gray-500">
                  /{option.priceUnit === 'per-person' ? 'orang' : 'grup'}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Informasi Penting */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex gap-3">
          <svg
            className="h-5 w-5 shrink-0 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-800">Informasi Penting</h4>
            <ul className="mt-1 space-y-1 text-xs text-blue-700">
              <li>• Asuransi perjalanan sangat direkomendasikan untuk perlindungan selama perjalanan</li>
              <li>• Airport transfer tersedia untuk penjemputan dan pengantaran dari/ke bandara</li>
              <li>• Tour tambahan dapat dibatalkan hingga 24 jam sebelum keberangkatan</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
