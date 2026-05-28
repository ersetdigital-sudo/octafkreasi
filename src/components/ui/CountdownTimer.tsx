'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { calculateTimeRemaining } from '@/lib/utils';

export interface CountdownTimerProps {
  expiresAt: Date;
  onExpired: () => void;
  className?: string;
}

export function CountdownTimer({ expiresAt, onExpired, className }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(() => calculateTimeRemaining(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(expiresAt);
      if (!remaining) {
        clearInterval(interval);
        onExpired();
        setTimeRemaining(null);
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpired]);

  if (!timeRemaining) {
    return (
      <div className={cn('text-center', className)}>
        <p className="text-lg font-bold text-red-600">Waktu habis</p>
      </div>
    );
  }

  const { hours, minutes, seconds, isUrgent } = timeRemaining;
  const displayMinutes = hours * 60 + minutes;

  return (
    <div className={cn('text-center', className)}>
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center">
          <span
            className={cn(
              'text-3xl font-bold tabular-nums',
              isUrgent ? 'text-red-600' : 'text-gray-900'
            )}
          >
            {String(displayMinutes).padStart(2, '0')}
          </span>
          <span className="text-xs text-gray-500">Menit</span>
        </div>
        <span
          className={cn(
            'text-3xl font-bold',
            isUrgent ? 'text-red-600' : 'text-gray-900'
          )}
        >
          :
        </span>
        <div className="flex flex-col items-center">
          <span
            className={cn(
              'text-3xl font-bold tabular-nums',
              isUrgent ? 'text-red-600' : 'text-gray-900'
            )}
          >
            {String(seconds).padStart(2, '0')}
          </span>
          <span className="text-xs text-gray-500">Detik</span>
        </div>
      </div>
      <p className={cn('mt-2 text-xs', isUrgent ? 'text-red-500' : 'text-gray-500')}>
        Pesanan akan otomatis dibatalkan jika waktu habis
      </p>
    </div>
  );
}
