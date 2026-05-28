import type { Destination, TimeRemaining } from '@/types';

/**
 * Filter destinations by category and/or search query.
 * Returns a new array without mutating the input.
 */
export function filterDestinations(
  destinations: Destination[],
  categoryId: string | null,
  searchQuery: string
): Destination[] {
  let result = [...destinations];

  // Filter by category tag (skip if null or "semua")
  if (categoryId !== null && categoryId.toLowerCase() !== 'semua') {
    result = result.filter((dest) =>
      dest.tags.some((tag) => tag.toLowerCase() === categoryId.toLowerCase())
    );
  }

  // Filter by search query matching name or country (case-insensitive)
  const query = searchQuery.trim().toLowerCase();
  if (query.length > 0) {
    result = result.filter(
      (dest) =>
        dest.name.toLowerCase().includes(query) ||
        dest.country.toLowerCase().includes(query)
    );
  }

  return result;
}

/**
 * Calculate time remaining until expiration.
 * Returns null if already expired.
 */
export function calculateTimeRemaining(expiresAt: Date): TimeRemaining | null {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();

  if (diff <= 0) {
    return null;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const isUrgent = diff < 5 * 60 * 1000;

  const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  return {
    hours,
    minutes,
    seconds,
    isUrgent,
    formatted,
  };
}

/**
 * Simple className utility that filters falsy values and joins with space.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
