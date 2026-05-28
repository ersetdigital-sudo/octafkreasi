import type { TrustFeature } from '@/types';

// =============================================================================
// Trust Feature Indicators
// =============================================================================

export const trustFeatures: TrustFeature[] = [
  {
    id: 'harga-terbaik',
    icon: 'star',
    title: 'Harga Terbaik',
    description: 'Jaminan harga termurah',
  },
  {
    id: 'pembayaran-aman',
    icon: 'shield-check',
    title: 'Pembayaran Aman',
    description: 'Transaksi 100% aman',
  },
  {
    id: 'fleksibel',
    icon: 'calendar',
    title: 'Fleksibel',
    description: 'Bebas ubah jadwal',
  },
  {
    id: 'customer-247',
    icon: 'phone',
    title: 'Customer 24/7',
    description: 'Kami siap membantu',
  },
];
