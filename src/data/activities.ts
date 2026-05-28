import type { Activity } from '@/types';

// =============================================================================
// Activity Data
// =============================================================================

export const activities: Activity[] = [
  {
    id: 'act-1',
    name: 'Snorkeling di Nusa Penida',
    image: '/images/activities/snorkeling-nusa-penida.jpg',
    price: 450000,
    duration: '4 Jam',
    rating: 4.9,
    destinationSlug: 'bali-indonesia',
    description: 'Snorkeling di perairan jernih Nusa Penida dengan terumbu karang yang indah',
  },
  {
    id: 'act-2',
    name: 'Sunset di Uluwatu',
    image: '/images/activities/sunset-uluwatu.jpg',
    price: 250000,
    duration: '3 Jam',
    rating: 4.8,
    destinationSlug: 'bali-indonesia',
    description: 'Menikmati matahari terbenam dari Pura Uluwatu dengan pertunjukan Tari Kecak',
  },
  {
    id: 'act-3',
    name: 'Bali Swing',
    image: '/images/activities/bali-swing.jpg',
    price: 350000,
    duration: '2 Jam',
    rating: 4.7,
    destinationSlug: 'bali-indonesia',
    description: 'Ayunan ikonik di atas lembah dengan pemandangan sawah terasering',
  },
  {
    id: 'act-4',
    name: 'Rafting di Ayung River',
    image: '/images/activities/rafting-ayung.jpg',
    price: 500000,
    duration: '5 Jam',
    rating: 4.6,
    destinationSlug: 'bali-indonesia',
    description: 'Arung jeram seru di Sungai Ayung melewati hutan tropis dan air terjun',
  },
];

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get activities for a specific destination by slug.
 */
export function getActivitiesByDestination(slug: string): Activity[] {
  return activities.filter((activity) => activity.destinationSlug === slug);
}
