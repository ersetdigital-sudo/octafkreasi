'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  isExpanded: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  onToggle: (id: string) => void;
  className?: string;
}

export function Accordion({ items, onToggle, className }: AccordionProps) {
  return (
    <div className={cn('divide-y divide-gray-200 rounded-lg border border-gray-200', className)}>
      {items.map((item) => (
        <div key={item.id}>
          <button
            type="button"
            onClick={() => onToggle(item.id)}
            className="flex w-full items-center justify-between px-4 py-4 text-left transition-colors hover:bg-gray-50"
            aria-expanded={item.isExpanded}
            aria-controls={`accordion-content-${item.id}`}
          >
            <span className="text-sm font-medium text-gray-900">{item.title}</span>
            <svg
              className={cn(
                'h-5 w-5 shrink-0 text-gray-400 transition-transform',
                item.isExpanded && 'rotate-180'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {item.isExpanded && (
            <div
              id={`accordion-content-${item.id}`}
              role="region"
              className="px-4 pb-4 text-sm text-gray-600"
            >
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
