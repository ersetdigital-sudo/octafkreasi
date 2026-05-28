import type { PromoCode, PromoData } from '@/types';

// =============================================================================
// Promo Banner Data
// =============================================================================

export const promoBanner: PromoData = {
  label: 'Promo Spesial',
  heading: 'Diskon hingga 30% untuk Liburan Impianmu!',
  subtitle:
    'Gunakan kode promo dan dapatkan potongan harga spesial untuk semua paket tour pilihan.',
  ctaText: 'Gunakan Promo',
  ctaHref: '/promo',
  illustration: '/images/promo/promo-illustration.png',
  discountPercentage: 30,
};

// =============================================================================
// Promo Codes
// =============================================================================

export const promoCodes: PromoCode[] = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 2000000,
    maxDiscount: 730000,
    validUntil: '2025-12-31',
    isActive: true,
  },
  {
    code: 'LIBURAN25',
    discountType: 'percentage',
    discountValue: 25,
    minPurchase: 5000000,
    maxDiscount: 1500000,
    validUntil: '2025-12-31',
    isActive: true,
  },
];
