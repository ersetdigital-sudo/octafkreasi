import React from 'react';
import type { Highlight } from '@/types';

export interface HighlightsProps {
  highlights: Highlight[];
}

const iconColors = [
  'bg-blue-50 text-blue-600',
  'bg-emerald-50 text-emerald-600',
  'bg-orange-50 text-orange-600',
  'bg-purple-50 text-purple-600',
];

export function Highlights({ highlights }: HighlightsProps) {
  return (
    <section className="py-6">
      <h2 className="text-lg font-semibold text-gray-900">Highlight</h2>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {highlights.map((highlight, index) => (
          <div
            key={highlight.id}
            className="rounded-xl border border-gray-100 bg-white p-4 text-center transition-shadow hover:shadow-md"
          >
            {/* Icon/illustration placeholder */}
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${iconColors[index % iconColors.length]}`}>
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </div>

            {/* Name */}
            <h3 className="mt-3 text-sm font-bold text-gray-900">
              {highlight.name}
            </h3>

            {/* Description */}
            {highlight.description && (
              <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                {highlight.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
