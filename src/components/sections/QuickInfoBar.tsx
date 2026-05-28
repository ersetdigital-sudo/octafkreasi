import React from 'react';
import type { DestinationQuickInfo } from '@/types';

export interface QuickInfoBarProps {
  quickInfo: DestinationQuickInfo;
  destinationName: string;
}

const infoItems = [
  { key: 'location', label: 'Lokasi', icon: 'map-pin' },
  { key: 'duration', label: 'Durasi Ideal', icon: 'clock' },
  { key: 'bestTime', label: 'Waktu Terbaik', icon: 'sun' },
  { key: 'currency', label: 'Mata Uang', icon: 'currency' },
  { key: 'language', label: 'Bahasa', icon: 'globe' },
] as const;

function getInfoValue(key: string, quickInfo: DestinationQuickInfo, destinationName: string): string {
  switch (key) {
    case 'location':
      return `${destinationName}, Indonesia`;
    case 'duration':
      return '3-5 Hari';
    case 'bestTime':
      return quickInfo.bestTime;
    case 'currency':
      return quickInfo.currency;
    case 'language':
      return quickInfo.language;
    default:
      return '';
  }
}

function InfoIcon({ type }: { type: string }) {
  const cls = "h-5 w-5 text-primary";
  switch (type) {
    case 'map-pin':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
      );
    case 'clock':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      );
    case 'sun':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      );
    case 'currency':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
        </svg>
      );
    case 'globe':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      );
    default:
      return null;
  }
}

export function QuickInfoBar({ quickInfo, destinationName }: QuickInfoBarProps) {
  return (
    <section className="container-app py-4 sm:py-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
        {infoItems.map((item) => (
          <div
            key={item.key}
            className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md sm:rounded-3xl sm:p-5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
              <InfoIcon type={item.icon} />
            </div>
            <span className="text-[11px] font-medium text-gray-500 sm:text-xs">{item.label}</span>
            <span className="text-xs font-semibold text-gray-900 sm:text-sm">
              {getInfoValue(item.key, quickInfo, destinationName)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
