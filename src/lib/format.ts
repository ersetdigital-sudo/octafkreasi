import { StarDisplay } from '@/types';

/**
 * Format a number as Indonesian Rupiah currency string.
 * Uses dot as thousands separator with no decimal places.
 *
 * @param amount - Non-negative number to format
 * @returns Formatted string in pattern "Rp X.XXX.XXX"
 * @throws Error if amount is negative
 *
 * @example
 * formatRupiah(3250000) // "Rp 3.250.000"
 * formatRupiah(0)       // "Rp 0"
 */
export function formatRupiah(amount: number): string {
  if (amount < 0) {
    throw new Error('Amount must not be negative');
  }

  const formatted = Math.floor(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `Rp ${formatted}`;
}

/**
 * Calculate star display array based on a numeric rating.
 * Returns exactly 5 StarDisplay elements representing full, half, or empty stars.
 *
 * - Full star for each whole number at or below the rating
 * - Half star if the fractional part is >= 0.5
 * - Empty for remaining positions
 *
 * @param rating - Rating value between 0 and 5
 * @returns Array of 5 StarDisplay objects
 *
 * @example
 * calculateStars(4.8) // [full, full, full, full, half]
 * calculateStars(3.0) // [full, full, full, empty, empty]
 */
export function calculateStars(rating: number): StarDisplay[] {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  const stars: StarDisplay[] = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push({ type: 'full', position: i });
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push({ type: 'half', position: i });
    } else {
      stars.push({ type: 'empty', position: i });
    }
  }

  return stars;
}

/**
 * Format a rating number to 1 decimal place.
 * Ensures consistent display across the site.
 *
 * @param rating - Rating value (e.g. 4.6666666667)
 * @returns Formatted string with 1 decimal (e.g. "4.7")
 *
 * @example
 * formatRating(4.6666666667) // "4.7"
 * formatRating(4.5)          // "4.5"
 * formatRating(4)            // "4.0"
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}
