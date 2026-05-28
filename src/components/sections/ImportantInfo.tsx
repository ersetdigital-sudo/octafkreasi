import React from 'react';

export interface ImportantInfoProps {
  destinationName: string;
}

const infoItems = [
  {
    id: 'transportasi',
    title: 'Transportasi',
    description: 'Kendaraan nyaman ber-AC selama perjalanan',
    icon: 'transport',
    color: 'bg-green-50 text-green-600',
  },
  {
    id: 'cuaca',
    title: 'Cuaca',
    description: '24°C - 31°C, Cerah berawan',
    icon: 'weather',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    id: 'budaya',
    title: 'Budaya',
    description: 'Hormati adat istiadat dan budaya lokal',
    icon: 'culture',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    id: 'keamanan',
    title: 'Keamanan',
    description: 'Destinasi aman untuk semua pengunjung',
    icon: 'shield',
    color: 'bg-blue-50 text-blue-600',
  },
];

function InfoIcon({ type, className }: { type: string; className?: string }) {
  const cls = className || 'h-6 w-6';
  switch (type) {
    case 'transport':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      );
    case 'weather':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      );
    case 'culture':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21" />
        </svg>
      );
    case 'shield':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
      );
    default:
      return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ImportantInfo(_props: ImportantInfoProps) {
  return (
    <section className="py-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {infoItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md sm:p-5"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
              <InfoIcon type={item.icon} />
            </div>
            <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
            <p className="text-xs leading-relaxed text-gray-500">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
