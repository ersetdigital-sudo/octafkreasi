'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { PaymentProvider } from '@/types';

export interface PaymentInstructionsProps {
  provider: PaymentProvider | null;
  className?: string;
}

export function PaymentInstructions({ provider, className }: PaymentInstructionsProps) {
  const [copied, setCopied] = useState(false);

  if (!provider) {
    return (
      <div className={cn('rounded-xl border border-gray-200 bg-white p-6', className)}>
        <p className="text-center text-sm text-gray-500">
          Pilih metode pembayaran untuk melihat instruksi
        </p>
      </div>
    );
  }

  const handleCopy = async () => {
    if (provider.accountNumber) {
      try {
        await navigator.clipboard.writeText(provider.accountNumber.replace(/\s/g, ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback for older browsers
        setCopied(false);
      }
    }
  };

  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white p-6', className)}>
      <h3 className="mb-4 text-base font-semibold text-gray-900">
        Instruksi Pembayaran - {provider.name}
      </h3>

      {/* Account Number */}
      {provider.accountNumber && (
        <div className="mb-4 rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">Nomor Rekening</p>
          <div className="mt-1 flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900">{provider.accountNumber}</p>
              {provider.accountName && (
                <p className="text-sm text-gray-600">a.n {provider.accountName}</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              {copied ? (
                <>
                  <svg className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Tersalin
                </>
              ) : (
                <>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                  Salin
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-3">
        {provider.instructions.map((instruction, index) => (
          <div key={index} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {index + 1}
            </span>
            <p className="text-sm text-gray-700">{instruction}</p>
          </div>
        ))}
      </div>

      {/* Info Notice */}
      <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-3">
        <div className="flex gap-2">
          <svg className="h-4 w-4 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p className="text-xs text-blue-700">
            Setelah pembayaran berhasil, e-ticket akan dikirim ke email dan WhatsApp kamu.
          </p>
        </div>
      </div>
    </div>
  );
}
