import type {
  Participant,
  AdditionalOption,
  PromoCode,
  BookingPricing,
  PromoValidationResult,
} from '@/types';
import { formatRupiah } from './format';

/**
 * Calculate the total booking price based on package, participants, options, and promo.
 *
 * - Adults pay full package price
 * - Children pay 75% of package price
 * - Insurance is calculated per person (adults + children)
 * - Additional options: per-person multiplied by total participants, per-group charged once
 * - Promo: percentage discount is floored and capped by maxDiscount; fixed uses discountValue directly
 * - minPurchase requirement must be met for promo to apply
 * - Total is never negative
 *
 * @param packagePrice - Base price per adult
 * @param participants - Array of participants (adults and children)
 * @param additionalOptions - Selected additional options
 * @param promoCode - Optional validated promo code to apply
 * @returns BookingPricing breakdown
 *
 * Validates: Requirements 13.3, 13.4, 13.5, 13.6, 13.7
 */
export function calculateBookingPrice(
  packagePrice: number,
  participants: Participant[],
  additionalOptions: AdditionalOption[],
  promoCode?: PromoCode
): BookingPricing {
  const adultCount = participants.filter((p) => p.type === 'adult').length;
  const childCount = participants.filter((p) => p.type === 'child').length;

  // Package price: adults pay full, children pay 75%
  const packageTotal =
    adultCount * packagePrice + childCount * packagePrice * 0.75;

  // Insurance: find option with id 'insurance', calculate per person
  const insurance = additionalOptions.find((o) => o.id === 'insurance');
  const insuranceTotal = insurance
    ? (adultCount + childCount) * insurance.price
    : 0;

  // Additional options (excluding insurance): per-person or per-group
  const additionalTotal = additionalOptions
    .filter((o) => o.id !== 'insurance')
    .reduce((sum, option) => {
      if (option.priceUnit === 'per-person') {
        return sum + option.price * (adultCount + childCount);
      }
      return sum + option.price; // per-group
    }, 0);

  const subtotal = packageTotal + insuranceTotal + additionalTotal;

  // Apply promo code discount
  let promoDiscount = 0;
  if (promoCode && promoCode.isActive) {
    // Check minimum purchase requirement first
    if (!promoCode.minPurchase || subtotal >= promoCode.minPurchase) {
      if (promoCode.discountType === 'percentage') {
        promoDiscount = Math.floor(
          (subtotal * promoCode.discountValue) / 100
        );
        if (promoCode.maxDiscount) {
          promoDiscount = Math.min(promoDiscount, promoCode.maxDiscount);
        }
      } else {
        promoDiscount = promoCode.discountValue;
      }
    }
  }

  const total = Math.max(subtotal - promoDiscount, 0);

  return {
    packagePrice: packageTotal,
    insuranceTotal,
    additionalTotal,
    subtotal,
    promoDiscount,
    total,
  };
}

/**
 * Validate a promo code against available promos and subtotal.
 *
 * Checks (in order):
 * 1. Code exists (case-insensitive, trimmed)
 * 2. Code is active
 * 3. Code is not expired
 * 4. Minimum purchase requirement is met
 *
 * If valid, calculates the discount amount.
 *
 * @param code - User-entered promo code string
 * @param subtotal - Current booking subtotal
 * @param availablePromos - Array of all available promo codes
 * @returns PromoValidationResult with validity, error, or discount info
 *
 * Validates: Requirements 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9
 */
export function validatePromoCode(
  code: string,
  subtotal: number,
  availablePromos: PromoCode[]
): PromoValidationResult {
  const normalizedCode = code.trim().toUpperCase();

  // Find matching promo (case-insensitive)
  const promo = availablePromos.find((p) => p.code === normalizedCode);

  if (!promo) {
    return { isValid: false, error: 'Kode promo tidak ditemukan' };
  }

  if (!promo.isActive) {
    return { isValid: false, error: 'Kode promo sudah tidak aktif' };
  }

  const now = new Date();
  if (new Date(promo.validUntil) < now) {
    return { isValid: false, error: 'Kode promo sudah kadaluarsa' };
  }

  if (promo.minPurchase && subtotal < promo.minPurchase) {
    return {
      isValid: false,
      error: `Minimum pembelian ${formatRupiah(promo.minPurchase)}`,
    };
  }

  // Calculate discount
  let discount = 0;
  if (promo.discountType === 'percentage') {
    discount = Math.floor((subtotal * promo.discountValue) / 100);
    if (promo.maxDiscount) {
      discount = Math.min(discount, promo.maxDiscount);
    }
  } else {
    discount = promo.discountValue;
  }

  return {
    isValid: true,
    promo,
    discount,
    message: `Diskon ${formatRupiah(discount)} berhasil diterapkan!`,
  };
}
