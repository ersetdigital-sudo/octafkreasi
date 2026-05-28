import React from 'react';
import { cn } from '@/lib/utils';

export interface IconProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Simple icon wrapper component.
 * Use heroicons directly in most cases; this provides a consistent wrapper when needed.
 */
export function Icon({ children, className }: IconProps) {
  return (
    <span className={cn('inline-flex shrink-0', className)} aria-hidden="true">
      {children}
    </span>
  );
}
