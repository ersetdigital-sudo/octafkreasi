'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { getWishlists, removeFromWishlist, type WishlistItem } from '@/lib/wishlist';

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [wishlists, setWishlists] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      loadWishlists();
    }
  }, [user, authLoading, router]);

  const loadWishlists = async () => {
    setLoading(true);
    const data = await getWishlists();
    setWishlists(data);
    setLoading(false);
  };

  const handleRemove = async (slug: string) => {
    const success = await removeFromWishlist(slug);
    if (success) {
      setWishlists((prev) => prev.filter((w) => w.destination_slug !== slug));
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <svg className="h-8 w-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container-app py-8 md:py-12">
        <h1 className="font-heading text-2xl font-bold text-gray-900 md:text-3xl">
          Wishlist Saya
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {wishlists.length > 0
            ? `${wishlists.length} destinasi tersimpan`
            : 'Belum ada destinasi favorit'}
        </p>

        {wishlists.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wishlists.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                {/* Image */}
                <div className="relative h-[180px]">
                  {item.destination_image && (
                    <Image
                      src={item.destination_image}
                      alt={item.destination_name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  )}
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(item.destination_slug)}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
                    aria-label="Hapus dari wishlist"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-900">{item.destination_name}</h3>
                  <p className="mt-0.5 text-xs text-gray-500">Indonesia</p>

                  <div className="mt-3 flex items-center justify-end">
                    <Link
                      href={`/destinasi/${item.destination_slug}`}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-700"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="mx-auto mt-16 max-w-md text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>
            <h2 className="mt-5 text-lg font-semibold text-gray-900">Belum ada destinasi favorit</h2>
            <p className="mt-2 text-sm text-gray-500">Jelajahi destinasi dan tap icon hati untuk menyimpan</p>
            <Link
              href="/destinasi"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Jelajahi Destinasi
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
