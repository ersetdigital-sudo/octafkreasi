import type { Category } from '@/types';

// =============================================================================
// Category Icons Data
// =============================================================================

export const categories: Category[] = [
  {
    id: 'semua',
    label: 'Semua',
    icon: 'globe',
    href: '/',
    isDefault: true,
  },
  {
    id: 'pesawat',
    label: 'Pesawat',
    icon: 'globe',
    href: '/kategori/pesawat',
  },
  {
    id: 'hotel',
    label: 'Hotel',
    icon: 'building',
    href: '/kategori/hotel',
  },
  {
    id: 'paket-tour',
    label: 'Paket Tour',
    icon: 'compass',
    href: '/kategori/paket-tour',
  },
  {
    id: 'kereta',
    label: 'Kereta',
    icon: 'compass',
    href: '/kategori/kereta',
  },
  {
    id: 'cruise',
    label: 'Cruise',
    icon: 'waves',
    href: '/kategori/cruise',
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: 'compass',
    href: '/kategori/activity',
  },
  {
    id: 'visa',
    label: 'Visa',
    icon: 'credit-card',
    href: '/kategori/visa',
  },
];
