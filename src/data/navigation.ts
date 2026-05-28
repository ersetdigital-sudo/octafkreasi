import type { NavLink, UserAction } from '@/types';

// =============================================================================
// Navigation Links
// =============================================================================

export const navLinks: NavLink[] = [
  {
    label: 'Beranda',
    href: '/',
    isActive: true,
  },
  {
    label: 'Destinasi',
    href: '/destinasi',
  },
  {
    label: 'Bantuan',
    href: '/bantuan',
  },
];

// =============================================================================
// User Actions (Header Icons)
// =============================================================================

export const userActions: UserAction[] = [
  {
    icon: 'heart',
    label: 'Wishlist',
    href: '/wishlist',
    badge: 0,
  },

  {
    icon: 'user',
    label: 'Akun',
    href: '/akun',
  },
];
