'use client';

import React from 'react';
import { FormInput } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { Participant } from '@/types';

export interface ParticipantFormProps {
  participants: Participant[];
  onParticipantChange: (index: number, field: keyof Participant, value: string) => void;
  onAddChild: () => void;
  className?: string;
}

const nationalities = [
  'Indonesia',
  'Malaysia',
  'Singapore',
  'Thailand',
  'Philippines',
  'Vietnam',
  'Japan',
  'South Korea',
  'China',
  'India',
  'Australia',
  'United States',
  'United Kingdom',
  'Lainnya',
];

export function ParticipantForm({
  participants,
  onParticipantChange,
  onAddChild,
  className,
}: ParticipantFormProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <h2 className="text-lg font-semibold text-gray-900">Data Peserta</h2>

      {participants.map((participant, index) => {
        const label =
          participant.type === 'adult'
            ? `Dewasa ${participants.filter((p, i) => i <= index && p.type === 'adult').length}`
            : `Anak ${participants.filter((p, i) => i <= index && p.type === 'child').length}`;

        return (
          <div
            key={participant.id}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <h3 className="mb-4 text-base font-semibold text-gray-900">{label}</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label="Nama Lengkap"
                name={`participant-${index}-fullName`}
                placeholder="Masukkan nama lengkap"
                value={participant.fullName}
                onChange={(e) => onParticipantChange(index, 'fullName', e.target.value)}
                required
              />

              <FormInput
                label="Tanggal Lahir"
                name={`participant-${index}-dateOfBirth`}
                placeholder="DD/MM/YYYY"
                value={participant.dateOfBirth}
                onChange={(e) => onParticipantChange(index, 'dateOfBirth', e.target.value)}
                required
              />

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={`participant-${index}-nationality`}
                  className="text-sm font-medium text-gray-700"
                >
                  Kewarganegaraan<span className="ml-0.5 text-red-500">*</span>
                </label>
                <select
                  id={`participant-${index}-nationality`}
                  value={participant.nationality}
                  onChange={(e) => onParticipantChange(index, 'nationality', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Pilih kewarganegaraan</option>
                  {nationalities.map((nat) => (
                    <option key={nat} value={nat}>
                      {nat}
                    </option>
                  ))}
                </select>
              </div>

              <FormInput
                label="Nomor Paspor/KTP"
                name={`participant-${index}-idNumber`}
                placeholder="Masukkan nomor identitas"
                value={participant.idNumber}
                onChange={(e) => onParticipantChange(index, 'idNumber', e.target.value)}
                required
              />

              <FormInput
                label="Email"
                name={`participant-${index}-email`}
                type="email"
                placeholder="contoh@email.com"
                value={participant.email}
                onChange={(e) => onParticipantChange(index, 'email', e.target.value)}
                required
              />

              <FormInput
                label="Nomor WhatsApp"
                name={`participant-${index}-whatsapp`}
                type="tel"
                placeholder="812XXXXXXXX"
                prefix="+62"
                value={participant.whatsapp}
                onChange={(e) => onParticipantChange(index, 'whatsapp', e.target.value)}
                required
              />
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={onAddChild}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-primary hover:text-primary"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Tambah Peserta Anak
      </button>
    </div>
  );
}
