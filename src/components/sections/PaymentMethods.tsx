'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { paymentMethods } from '@/data/payment-methods';
import type { PaymentMethodGroup } from '@/types';

export interface PaymentMethodsProps {
  selectedGroupId: string | null;
  selectedProviderId: string | null;
  onSelect: (groupId: string, providerId: string) => void;
  className?: string;
}

function GroupIcon({ groupId }: { groupId: string }) {
  const cls = 'h-5 w-5';
  switch (groupId) {
    case 'transfer-bank':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
        </svg>
      );
    case 'e-wallet':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      );
    case 'credit-card':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      );
    case 'virtual-account':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      );
    case 'paylater':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
      );
  }
}

export function PaymentMethods({
  selectedGroupId,
  selectedProviderId,
  onSelect,
  className,
}: PaymentMethodsProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {paymentMethods.map((group: PaymentMethodGroup) => {
        const isSelected = selectedGroupId === group.id;
        const providerNames = group.providers.map((p) => p.name).join(', ');

        return (
          <button
            key={group.id}
            type="button"
            onClick={() => onSelect(group.id, group.providers[0]?.id || '')}
            className={cn(
              'flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-all',
              isSelected
                ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            )}
          >
            {/* Radio circle */}
            <div className={cn(
              'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors',
              isSelected ? 'border-blue-600' : 'border-gray-300'
            )}>
              {isSelected && (
                <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p className={cn(
                'text-sm font-semibold',
                isSelected ? 'text-blue-700' : 'text-gray-900'
              )}>
                {group.name}
              </p>
              <p className="mt-0.5 truncate text-xs text-gray-500">
                {providerNames}
              </p>
            </div>

            {/* Icon */}
            <span className={cn(
              'flex-shrink-0 transition-colors',
              isSelected ? 'text-blue-600' : 'text-gray-400'
            )}>
              <GroupIcon groupId={group.id} />
            </span>
          </button>
        );
      })}

      {/* Expanded provider selection for selected group */}
      {selectedGroupId && (
        <div className="mt-2 rounded-xl border border-blue-100 bg-blue-50/30 p-4">
          <p className="mb-3 text-xs font-medium text-gray-600">Pilih provider:</p>
          <div className="flex flex-wrap gap-2">
            {paymentMethods
              .find((g) => g.id === selectedGroupId)
              ?.providers.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => onSelect(selectedGroupId, provider.id)}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-xs font-semibold transition-all',
                    selectedProviderId === provider.id
                      ? 'border-blue-500 bg-blue-600 text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  )}
                >
                  {provider.name}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
