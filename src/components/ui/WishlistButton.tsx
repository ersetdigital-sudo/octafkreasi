'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface WishlistButtonProps {
  isActive: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export function WishlistButton({ isActive, onClick, className }: WishlistButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full bg-white/80 p-2 backdrop-blur-sm transition-colors hover:bg-white',
        className
      )}
      aria-label={isActive ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill={isActive ? '#EF4444' : 'none'}
        stroke={isActive ? '#EF4444' : 'currentColor'}
        strokeWidth={2}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}
