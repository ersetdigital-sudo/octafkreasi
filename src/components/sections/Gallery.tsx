import React from 'react';
import Image from 'next/image';
import type { GalleryImage } from '@/types';

export interface GalleryProps {
  images: GalleryImage[];
}

export function Gallery({ images }: GalleryProps) {
  const topImages = images.slice(0, 2);
  const bottomImages = images.slice(2, 6);

  return (
    <section className="py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Galeri</h2>
        <button
          type="button"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Lihat semua
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {/* Top row: 2 large images */}
        <div className="grid grid-cols-2 gap-2">
          {topImages.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-[4/3] overflow-hidden rounded-xl"
            >
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 50vw, 400px" className="object-cover" loading="lazy" />{index === 0 && (<div className="absolute inset-0 flex items-center justify-center"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm sm:h-14 sm:w-14"><svg className="ml-1 h-5 w-5 text-gray-800 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div></div>)}
            </div>
          ))}
        </div>

        {/* Bottom row: 4 small thumbnails */}
        <div className="grid grid-cols-4 gap-2">
          {bottomImages.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square overflow-hidden rounded-lg"
            >
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 25vw, 150px" className="object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
