'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

interface WishlistContextType {
  wishlist: string[]; // array of destination slugs
  isWishlisted: (slug: string) => boolean;
  toggleWishlist: (slug: string, meta?: { name: string; image: string }) => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  isWishlisted: () => false,
  toggleWishlist: () => {},
  count: 0,
});

const STORAGE_KEY = 'octafkreasi_wishlist';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Load wishlist based on auth state
  useEffect(() => {
    if (user) {
      // Load from Supabase
      loadFromSupabase();
    } else {
      // Load from localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setWishlist(JSON.parse(stored));
        }
      } catch {
        // ignore
      }
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadFromSupabase = async () => {
    const { data } = await supabase
      .from('wishlists')
      .select('destination_slug')
      .order('created_at', { ascending: false });

    if (data) {
      const slugs = data.map((item) => item.destination_slug);
      setWishlist(slugs);
    }
  };

  // Save to localStorage when not logged in
  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
      } catch {
        // ignore
      }
    }
  }, [wishlist, user]);

  const isWishlisted = useCallback((slug: string) => {
    return wishlist.includes(slug);
  }, [wishlist]);

  const toggleWishlist = useCallback((slug: string, meta?: { name: string; image: string }) => {
    if (user) {
      // Sync with Supabase
      if (wishlist.includes(slug)) {
        // Remove
        supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('destination_slug', slug)
          .then(() => {
            setWishlist((prev) => prev.filter((s) => s !== slug));
          });
      } else {
        // Add
        supabase
          .from('wishlists')
          .insert({
            user_id: user.id,
            destination_slug: slug,
            destination_name: meta?.name || slug,
            destination_image: meta?.image || null,
          })
          .then(() => {
            setWishlist((prev) => [...prev, slug]);
          });
      }
    } else {
      // localStorage only (not logged in)
      setWishlist((prev) =>
        prev.includes(slug)
          ? prev.filter((s) => s !== slug)
          : [...prev, slug]
      );
    }
  }, [wishlist, user]);

  return (
    <WishlistContext.Provider value={{ wishlist, isWishlisted, toggleWishlist, count: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
