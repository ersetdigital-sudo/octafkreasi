import { supabase } from '@/lib/supabase';

export interface WishlistItem {
  id: string;
  user_id: string;
  destination_slug: string;
  destination_name: string;
  destination_image: string | null;
  created_at: string;
}

export async function getWishlists(): Promise<WishlistItem[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('wishlists')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching wishlists:', error);
    return [];
  }
  return data || [];
}

export async function addToWishlist(item: {
  destination_slug: string;
  destination_name: string;
  destination_image: string;
}): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase.from('wishlists').insert({
    user_id: user.id,
    destination_slug: item.destination_slug,
    destination_name: item.destination_name,
    destination_image: item.destination_image,
  });

  if (error) {
    console.error('Error adding to wishlist:', error);
    return false;
  }
  return true;
}

export async function removeFromWishlist(destinationSlug: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', user.id)
    .eq('destination_slug', destinationSlug);

  if (error) {
    console.error('Error removing from wishlist:', error);
    return false;
  }
  return true;
}

export async function isInWishlist(destinationSlug: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('destination_slug', destinationSlug)
    .maybeSingle();

  if (error) return false;
  return !!data;
}
