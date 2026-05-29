import type { PaymentMethodGroup } from '@/types';

// =============================================================================
// Payment Method Groups
// =============================================================================

export const paymentMethods: PaymentMethodGroup[] = [
  {
    id: 'transfer_bank',
    name: 'Transfer Bank',
    icon: '/images/payment/bank.svg',
    providers: [
      {
        id: 'bca',
        name: 'BCA',
        logo: '/images/payment/bca.png',
        accountNumber: '1234 5678 9101',
        accountName: 'PT Octaf Kreasi Travel',
        instructions: [
          'Login ke BCA Mobile atau KlikBCA',
          'Pilih menu Transfer',
          'Masukkan nomor rekening: 1234 5678 9101',
          'Masukkan jumlah transfer sesuai total pembayaran',
          'Pastikan nama penerima: PT Octaf Kreasi Travel',
          'Konfirmasi dan selesaikan transfer',
          'Simpan bukti pembayaran dan unggah di halaman konfirmasi',
        ],
        isAvailable: true,
      },
      {
        id: 'mandiri',
        name: 'Mandiri',
        logo: '/images/payment/mandiri.png',
        accountNumber: '1234 5678 9101',
        accountName: 'PT Octaf Kreasi Travel',
        instructions: [
          'Login ke Livin by Mandiri atau Internet Banking',
          'Pilih menu Transfer',
          'Masukkan nomor rekening tujuan',
          'Masukkan jumlah transfer sesuai total pembayaran',
          'Pastikan nama penerima: PT Octaf Kreasi Travel',
          'Konfirmasi dan selesaikan transfer',
          'Simpan bukti pembayaran dan unggah di halaman konfirmasi',
        ],
        isAvailable: true,
      },
      {
        id: 'bni',
        name: 'BNI',
        logo: '/images/payment/bni.png',
        accountNumber: '1234 5678 9101',
        accountName: 'PT Octaf Kreasi Travel',
        instructions: [
          'Login ke BNI Mobile Banking atau Internet Banking',
          'Pilih menu Transfer',
          'Masukkan nomor rekening tujuan',
          'Masukkan jumlah transfer sesuai total pembayaran',
          'Pastikan nama penerima: PT Octaf Kreasi Travel',
          'Konfirmasi dan selesaikan transfer',
          'Simpan bukti pembayaran dan unggah di halaman konfirmasi',
        ],
        isAvailable: true,
      },
      {
        id: 'bri',
        name: 'BRI',
        logo: '/images/payment/bri.png',
        accountNumber: '1234 5678 9101',
        accountName: 'PT Octaf Kreasi Travel',
        instructions: [
          'Login ke BRImo atau Internet Banking BRI',
          'Pilih menu Transfer',
          'Masukkan nomor rekening tujuan',
          'Masukkan jumlah transfer sesuai total pembayaran',
          'Pastikan nama penerima: PT Octaf Kreasi Travel',
          'Konfirmasi dan selesaikan transfer',
          'Simpan bukti pembayaran dan unggah di halaman konfirmasi',
        ],
        isAvailable: true,
      },
    ],
  },
  {
    id: 'credit_card',
    name: 'Kartu Kredit/Debit',
    icon: '/images/payment/credit-card.svg',
    providers: [
      {
        id: 'visa',
        name: 'Visa',
        logo: '/images/payment/visa.png',
        instructions: [
          'Masukkan nomor kartu kredit Visa Anda',
          'Masukkan tanggal kadaluarsa dan CVV',
          'Verifikasi pembayaran melalui 3D Secure',
          'Pembayaran akan diproses secara otomatis',
        ],
        isAvailable: true,
      },
      {
        id: 'mastercard',
        name: 'Mastercard',
        logo: '/images/payment/mastercard.png',
        instructions: [
          'Masukkan nomor kartu kredit Mastercard Anda',
          'Masukkan tanggal kadaluarsa dan CVV',
          'Verifikasi pembayaran melalui 3D Secure',
          'Pembayaran akan diproses secara otomatis',
        ],
        isAvailable: true,
      },
      {
        id: 'jcb',
        name: 'JCB',
        logo: '/images/payment/jcb.png',
        instructions: [
          'Masukkan nomor kartu kredit JCB Anda',
          'Masukkan tanggal kadaluarsa dan CVV',
          'Verifikasi pembayaran melalui 3D Secure',
          'Pembayaran akan diproses secara otomatis',
        ],
        isAvailable: true,
      },
    ],
  },
  {
    id: 'e_wallet',
    name: 'E-Wallet',
    icon: '/images/payment/e-wallet.svg',
    providers: [
      {
        id: 'ovo',
        name: 'OVO',
        logo: '/images/payment/ovo.png',
        instructions: [
          'Buka aplikasi OVO di smartphone Anda',
          'Pastikan saldo OVO mencukupi',
          'Konfirmasi pembayaran melalui notifikasi OVO',
          'Pembayaran akan diverifikasi secara otomatis',
        ],
        isAvailable: true,
      },
      {
        id: 'gopay',
        name: 'GoPay',
        logo: '/images/payment/gopay.png',
        instructions: [
          'Buka aplikasi Gojek di smartphone Anda',
          'Pastikan saldo GoPay mencukupi',
          'Konfirmasi pembayaran melalui notifikasi Gojek',
          'Pembayaran akan diverifikasi secara otomatis',
        ],
        isAvailable: true,
      },
      {
        id: 'dana',
        name: 'Dana',
        logo: '/images/payment/dana.png',
        instructions: [
          'Buka aplikasi Dana di smartphone Anda',
          'Pastikan saldo Dana mencukupi',
          'Konfirmasi pembayaran melalui notifikasi Dana',
          'Pembayaran akan diverifikasi secara otomatis',
        ],
        isAvailable: true,
      },
    ],
  },
  {
    id: 'virtual_account',
    name: 'Virtual Account',
    icon: '/images/payment/virtual-account.svg',
    providers: [
      {
        id: 'va-bca',
        name: 'Virtual Account BCA',
        logo: '/images/payment/bca.png',
        instructions: [
          'Salin nomor Virtual Account yang diberikan',
          'Login ke BCA Mobile atau ATM BCA',
          'Pilih menu Pembayaran/Transfer ke Virtual Account',
          'Masukkan nomor Virtual Account',
          'Konfirmasi jumlah pembayaran dan selesaikan',
        ],
        isAvailable: true,
      },
      {
        id: 'va-mandiri',
        name: 'Virtual Account Mandiri',
        logo: '/images/payment/mandiri.png',
        instructions: [
          'Salin nomor Virtual Account yang diberikan',
          'Login ke Livin by Mandiri atau ATM Mandiri',
          'Pilih menu Pembayaran/Transfer ke Virtual Account',
          'Masukkan nomor Virtual Account',
          'Konfirmasi jumlah pembayaran dan selesaikan',
        ],
        isAvailable: true,
      },
    ],
  },
  {
    id: 'paylater',
    name: 'PayLater',
    icon: '/images/payment/paylater.svg',
    providers: [
      {
        id: 'traveloka-paylater',
        name: 'Traveloka PayLater',
        logo: '/images/payment/traveloka-paylater.png',
        instructions: [
          'Pilih tenor cicilan yang diinginkan',
          'Verifikasi identitas melalui aplikasi Traveloka',
          'Setujui syarat dan ketentuan PayLater',
          'Pembayaran akan diproses dan cicilan dimulai bulan depan',
        ],
        isAvailable: true,
      },
      {
        id: 'indodana',
        name: 'Indodana',
        logo: '/images/payment/indodana.png',
        instructions: [
          'Pilih tenor cicilan yang diinginkan',
          'Verifikasi identitas melalui aplikasi Indodana',
          'Setujui syarat dan ketentuan pinjaman',
          'Pembayaran akan diproses dan cicilan dimulai bulan depan',
        ],
        isAvailable: true,
      },
    ],
  },
];

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get a payment method group by its ID.
 */
export function getPaymentMethodById(id: string): PaymentMethodGroup | undefined {
  return paymentMethods.find((method) => method.id === id);
}

/**
 * Get a specific provider by group ID and provider ID.
 */
export function getProviderById(
  groupId: string,
  providerId: string
): { group: PaymentMethodGroup; provider: (typeof paymentMethods)[0]['providers'][0] } | undefined {
  const group = paymentMethods.find((m) => m.id === groupId);
  if (!group) return undefined;
  const provider = group.providers.find((p) => p.id === providerId);
  if (!provider) return undefined;
  return { group, provider };
}
