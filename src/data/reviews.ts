import type { RatingBreakdown, Review } from '@/types';

// =============================================================================
// Sample Review Data for Bali
// =============================================================================

export const baliReviews: Review[] = [
  {
    id: 'rev-1',
    author: 'Rizky Pratama',
    avatar: '/images/avatars/rizky.jpg',
    rating: 5,
    date: '2024-01-15',
    content:
      'Pengalaman liburan yang luar biasa! Pemandangan alam Bali sangat indah, terutama sawah terasering di Tegallalang. Pelayanan tour guide sangat ramah dan profesional.',
    helpful: 12,
    destinationSlug: 'bali-indonesia',
  },
  {
    id: 'rev-2',
    author: 'Sarah Aulia',
    avatar: '/images/avatars/sarah.jpg',
    rating: 5,
    date: '2024-02-20',
    content:
      'Bali memang surga dunia! Pantai-pantainya bersih, makanannya enak, dan budayanya sangat kaya. Pasti akan kembali lagi tahun depan.',
    helpful: 8,
    destinationSlug: 'bali-indonesia',
  },
  {
    id: 'rev-3',
    author: 'Dimas Setiawan',
    avatar: '/images/avatars/dimas.jpg',
    rating: 4,
    date: '2024-03-10',
    content:
      'Perjalanan yang menyenangkan. Snorkeling di Nusa Penida adalah highlight-nya. Sedikit ramai di beberapa tempat wisata populer, tapi overall sangat memuaskan.',
    helpful: 5,
    destinationSlug: 'bali-indonesia',
  },
  {
    id: 'rev-4',
    author: 'Anisa Rahma',
    avatar: '/images/avatars/anisa.jpg',
    rating: 5,
    date: '2024-04-05',
    content:
      'Liburan keluarga yang sempurna! Anak-anak sangat senang bermain di pantai dan melihat pertunjukan Tari Kecak. Akomodasi nyaman dan makanan lokal sangat lezat. Highly recommended!',
    helpful: 10,
    destinationSlug: 'bali-indonesia',
  },
];

// =============================================================================
// Rating Breakdown for Bali
// =============================================================================

export const baliRatingBreakdown: RatingBreakdown = {
  5: 65,
  4: 25,
  3: 7,
  2: 2,
  1: 1,
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get reviews for a specific destination by slug.
 */
export function getReviewsByDestination(slug: string): Review[] {
  return baliReviews.filter((review) => review.destinationSlug === slug);
}
