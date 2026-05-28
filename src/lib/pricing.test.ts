import { describe, it, expect } from 'vitest';
import { calculateBookingPrice, validatePromoCode } from './pricing';
import type { Participant, AdditionalOption, PromoCode } from '@/types';

// =============================================================================
// Test Helpers
// =============================================================================

function makeParticipant(type: 'adult' | 'child', id = '1'): Participant {
  return {
    id,
    fullName: 'Test User',
    dateOfBirth: '01/01/1990',
    nationality: 'Indonesia',
    idNumber: '1234567890123456',
    email: 'test@example.com',
    whatsapp: '+6281234567890',
    type,
  };
}

// =============================================================================
// calculateBookingPrice Tests
// =============================================================================

describe('calculateBookingPrice', () => {
  it('calculates package price for adults only', () => {
    const participants = [makeParticipant('adult', '1'), makeParticipant('adult', '2')];
    const result = calculateBookingPrice(1000000, participants, []);

    expect(result.packagePrice).toBe(2000000);
    expect(result.subtotal).toBe(2000000);
    expect(result.total).toBe(2000000);
  });

  it('calculates children at 75% of package price', () => {
    const participants = [
      makeParticipant('adult', '1'),
      makeParticipant('child', '2'),
    ];
    const result = calculateBookingPrice(1000000, participants, []);

    // 1 adult × 1,000,000 + 1 child × 750,000 = 1,750,000
    expect(result.packagePrice).toBe(1750000);
  });

  it('calculates insurance per person', () => {
    const participants = [
      makeParticipant('adult', '1'),
      makeParticipant('adult', '2'),
      makeParticipant('child', '3'),
    ];
    const options: AdditionalOption[] = [
      { id: 'insurance', name: 'Asuransi Perjalanan', price: 150000, priceUnit: 'per-person' },
    ];
    const result = calculateBookingPrice(1000000, participants, options);

    // Insurance: 3 persons × 150,000 = 450,000
    expect(result.insuranceTotal).toBe(450000);
  });

  it('calculates per-person additional options by participant count', () => {
    const participants = [
      makeParticipant('adult', '1'),
      makeParticipant('adult', '2'),
    ];
    const options: AdditionalOption[] = [
      { id: 'tour', name: 'Tour Tambahan', price: 350000, priceUnit: 'per-person' },
    ];
    const result = calculateBookingPrice(1000000, participants, options);

    // 2 persons × 350,000 = 700,000
    expect(result.additionalTotal).toBe(700000);
  });

  it('calculates per-group additional options once', () => {
    const participants = [
      makeParticipant('adult', '1'),
      makeParticipant('adult', '2'),
      makeParticipant('adult', '3'),
    ];
    const options: AdditionalOption[] = [
      { id: 'transfer', name: 'Airport Transfer', price: 250000, priceUnit: 'per-group' },
    ];
    const result = calculateBookingPrice(1000000, participants, options);

    // per-group: 250,000 (regardless of participant count)
    expect(result.additionalTotal).toBe(250000);
  });

  it('applies percentage promo discount with floor', () => {
    const participants = [makeParticipant('adult', '1')];
    const promo: PromoCode = {
      code: 'TEST10',
      discountType: 'percentage',
      discountValue: 10,
      validUntil: '2099-12-31',
      isActive: true,
    };
    const result = calculateBookingPrice(3333333, participants, [], promo);

    // 10% of 3,333,333 = 333,333.3 → floor = 333,333
    expect(result.promoDiscount).toBe(333333);
    expect(result.total).toBe(3333333 - 333333);
  });

  it('caps percentage discount at maxDiscount', () => {
    const participants = [makeParticipant('adult', '1')];
    const promo: PromoCode = {
      code: 'BIG50',
      discountType: 'percentage',
      discountValue: 50,
      maxDiscount: 500000,
      validUntil: '2099-12-31',
      isActive: true,
    };
    const result = calculateBookingPrice(5000000, participants, [], promo);

    // 50% of 5,000,000 = 2,500,000 but capped at 500,000
    expect(result.promoDiscount).toBe(500000);
    expect(result.total).toBe(4500000);
  });

  it('applies fixed promo discount directly', () => {
    const participants = [makeParticipant('adult', '1')];
    const promo: PromoCode = {
      code: 'FIXED',
      discountType: 'fixed',
      discountValue: 200000,
      validUntil: '2099-12-31',
      isActive: true,
    };
    const result = calculateBookingPrice(1000000, participants, [], promo);

    expect(result.promoDiscount).toBe(200000);
    expect(result.total).toBe(800000);
  });

  it('ensures total is never negative', () => {
    const participants = [makeParticipant('adult', '1')];
    const promo: PromoCode = {
      code: 'HUGE',
      discountType: 'fixed',
      discountValue: 99999999,
      validUntil: '2099-12-31',
      isActive: true,
    };
    const result = calculateBookingPrice(100000, participants, [], promo);

    expect(result.total).toBe(0);
  });

  it('does not apply promo if subtotal is below minPurchase', () => {
    const participants = [makeParticipant('adult', '1')];
    const promo: PromoCode = {
      code: 'MIN',
      discountType: 'percentage',
      discountValue: 10,
      minPurchase: 5000000,
      validUntil: '2099-12-31',
      isActive: true,
    };
    const result = calculateBookingPrice(1000000, participants, [], promo);

    expect(result.promoDiscount).toBe(0);
    expect(result.total).toBe(1000000);
  });

  it('does not apply promo if promo is inactive', () => {
    const participants = [makeParticipant('adult', '1')];
    const promo: PromoCode = {
      code: 'INACTIVE',
      discountType: 'percentage',
      discountValue: 50,
      validUntil: '2099-12-31',
      isActive: false,
    };
    const result = calculateBookingPrice(1000000, participants, [], promo);

    expect(result.promoDiscount).toBe(0);
    expect(result.total).toBe(1000000);
  });

  it('subtotal equals packagePrice + insuranceTotal + additionalTotal', () => {
    const participants = [
      makeParticipant('adult', '1'),
      makeParticipant('child', '2'),
    ];
    const options: AdditionalOption[] = [
      { id: 'insurance', name: 'Asuransi', price: 150000, priceUnit: 'per-person' },
      { id: 'transfer', name: 'Transfer', price: 250000, priceUnit: 'per-group' },
    ];
    const result = calculateBookingPrice(2000000, participants, options);

    expect(result.subtotal).toBe(result.packagePrice + result.insuranceTotal + result.additionalTotal);
  });
});

// =============================================================================
// validatePromoCode Tests
// =============================================================================

describe('validatePromoCode', () => {
  const activePromos: PromoCode[] = [
    {
      code: 'WELCOME10',
      discountType: 'percentage',
      discountValue: 10,
      minPurchase: 2000000,
      maxDiscount: 730000,
      validUntil: '2099-12-31',
      isActive: true,
    },
    {
      code: 'EXPIRED',
      discountType: 'percentage',
      discountValue: 20,
      validUntil: '2020-01-01',
      isActive: true,
    },
    {
      code: 'INACTIVE',
      discountType: 'fixed',
      discountValue: 100000,
      validUntil: '2099-12-31',
      isActive: false,
    },
    {
      code: 'FIXED500K',
      discountType: 'fixed',
      discountValue: 500000,
      validUntil: '2099-12-31',
      isActive: true,
    },
  ];

  it('returns error for non-existent code', () => {
    const result = validatePromoCode('NOTEXIST', 5000000, activePromos);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Kode promo tidak ditemukan');
  });

  it('returns error for inactive code', () => {
    const result = validatePromoCode('INACTIVE', 5000000, activePromos);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Kode promo sudah tidak aktif');
  });

  it('returns error for expired code', () => {
    const result = validatePromoCode('EXPIRED', 5000000, activePromos);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Kode promo sudah kadaluarsa');
  });

  it('returns error for minimum purchase not met', () => {
    const result = validatePromoCode('WELCOME10', 1000000, activePromos);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Minimum pembelian Rp 2.000.000');
  });

  it('is case-insensitive (lowercase input)', () => {
    const result = validatePromoCode('welcome10', 5000000, activePromos);
    expect(result.isValid).toBe(true);
  });

  it('trims whitespace from code', () => {
    const result = validatePromoCode('  WELCOME10  ', 5000000, activePromos);
    expect(result.isValid).toBe(true);
  });

  it('calculates percentage discount with cap', () => {
    const result = validatePromoCode('WELCOME10', 10000000, activePromos);
    expect(result.isValid).toBe(true);
    // 10% of 10,000,000 = 1,000,000 but capped at 730,000
    expect(result.discount).toBe(730000);
    expect(result.promo?.code).toBe('WELCOME10');
  });

  it('calculates percentage discount without hitting cap', () => {
    const result = validatePromoCode('WELCOME10', 3000000, activePromos);
    expect(result.isValid).toBe(true);
    // 10% of 3,000,000 = 300,000 (below 730,000 cap)
    expect(result.discount).toBe(300000);
  });

  it('calculates fixed discount', () => {
    const result = validatePromoCode('FIXED500K', 5000000, activePromos);
    expect(result.isValid).toBe(true);
    expect(result.discount).toBe(500000);
  });

  it('returns success message with discount amount', () => {
    const result = validatePromoCode('FIXED500K', 5000000, activePromos);
    expect(result.isValid).toBe(true);
    expect(result.message).toBe('Diskon Rp 500.000 berhasil diterapkan!');
  });
});
