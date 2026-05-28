import React from 'react';

const includedItems = [
  'Hotel 3 Hari 2 Malam (Twin Sharing)',
  'Sarapan di Hotel',
  'Transportasi selama perjalanan',
  'Tiket masuk objek wisata sesuai itinerary',
  'Tour Guide berpengalaman',
  'Dokumentasi selama perjalanan',
  'Air mineral selama perjalanan',
  'Penjemputan di Bandara / Pelabuhan',
];

const excludedItems = [
  'Tiket pesawat PP',
  'Makan siang & malam',
  'Pengeluaran pribadi',
  'Aktivitas tambahan di luar itinerary',
  'Upgrade hotel (jika ada)',
  'Tips guide & driver (optional)',
];

export function PackageIncludes() {
  return (
    <section className="py-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Paket Sudah Termasuk */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 sm:text-lg">Paket Sudah Termasuk</h3>
          <ul className="mt-4 space-y-3">
            {includedItems.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <svg
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Paket Belum Termasuk */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 sm:text-lg">Paket Belum Termasuk</h3>
          <ul className="mt-4 space-y-3">
            {excludedItems.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <svg
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
