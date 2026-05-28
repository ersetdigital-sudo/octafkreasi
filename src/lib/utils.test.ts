import { describe, it, expect } from 'vitest';
import { filterDestinations, calculateTimeRemaining, cn } from './utils';
import type { Destination } from '@/types';

const mockDestinations: Destination[] = [
  {
    id: '1',
    name: 'Bali',
    country: 'Indonesia',
    slug: 'bali-indonesia',
    image: '/images/bali.jpg',
    imageAlt: 'Bali beach',
    rating: 4.8,
    reviewCount: 120,
    priceStartFrom: 3250000,
    currency: 'IDR',
    tags: ['pantai', 'budaya'],
    isWishlisted: false,
  },
  {
    id: '2',
    name: 'Raja Ampat',
    country: 'Indonesia',
    slug: 'raja-ampat',
    image: '/images/raja-ampat.jpg',
    imageAlt: 'Raja Ampat islands',
    rating: 4.9,
    reviewCount: 85,
    priceStartFrom: 5500000,
    currency: 'IDR',
    tags: ['pantai', 'alam'],
    isWishlisted: true,
  },
  {
    id: '3',
    name: 'Mount Fuji',
    country: 'Japan',
    slug: 'mount-fuji',
    image: '/images/fuji.jpg',
    imageAlt: 'Mount Fuji',
    rating: 4.7,
    reviewCount: 200,
    priceStartFrom: 8000000,
    currency: 'IDR',
    tags: ['gunung', 'alam'],
    isWishlisted: false,
  },
];

describe('filterDestinations', () => {
  it('returns all destinations when no filters applied', () => {
    const result = filterDestinations(mockDestinations, null, '');
    expect(result).toHaveLength(3);
  });

  it('returns all destinations when categoryId is "semua"', () => {
    const result = filterDestinations(mockDestinations, 'semua', '');
    expect(result).toHaveLength(3);
  });

  it('filters by category tag', () => {
    const result = filterDestinations(mockDestinations, 'pantai', '');
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Bali');
    expect(result[1].name).toBe('Raja Ampat');
  });

  it('filters by search query matching name', () => {
    const result = filterDestinations(mockDestinations, null, 'bali');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Bali');
  });

  it('filters by search query matching country', () => {
    const result = filterDestinations(mockDestinations, null, 'japan');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Mount Fuji');
  });

  it('applies both filters as intersection', () => {
    const result = filterDestinations(mockDestinations, 'alam', 'indonesia');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Raja Ampat');
  });

  it('is case-insensitive for category', () => {
    const result = filterDestinations(mockDestinations, 'PANTAI', '');
    expect(result).toHaveLength(2);
  });

  it('is case-insensitive for search query', () => {
    const result = filterDestinations(mockDestinations, null, 'BALI');
    expect(result).toHaveLength(1);
  });

  it('does not mutate the original array', () => {
    const original = [...mockDestinations];
    filterDestinations(mockDestinations, 'pantai', 'bali');
    expect(mockDestinations).toEqual(original);
  });

  it('returns empty array when no matches', () => {
    const result = filterDestinations(mockDestinations, 'kuliner', '');
    expect(result).toHaveLength(0);
  });
});

describe('calculateTimeRemaining', () => {
  it('returns null when expired', () => {
    const pastDate = new Date(Date.now() - 1000);
    expect(calculateTimeRemaining(pastDate)).toBeNull();
  });

  it('returns correct time remaining', () => {
    const futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000 + 30 * 60 * 1000 + 15 * 1000);
    const result = calculateTimeRemaining(futureDate);
    expect(result).not.toBeNull();
    expect(result!.hours).toBe(2);
    expect(result!.minutes).toBe(30);
    expect(result!.seconds).toBeGreaterThanOrEqual(14);
    expect(result!.seconds).toBeLessThanOrEqual(15);
    expect(result!.isUrgent).toBe(false);
    expect(result!.formatted).toBe('02:30');
  });

  it('sets isUrgent to true when less than 5 minutes remain', () => {
    const futureDate = new Date(Date.now() + 3 * 60 * 1000);
    const result = calculateTimeRemaining(futureDate);
    expect(result).not.toBeNull();
    expect(result!.isUrgent).toBe(true);
  });

  it('sets isUrgent to false when 5 or more minutes remain', () => {
    const futureDate = new Date(Date.now() + 10 * 60 * 1000);
    const result = calculateTimeRemaining(futureDate);
    expect(result).not.toBeNull();
    expect(result!.isUrgent).toBe(false);
  });

  it('formats with zero-padding', () => {
    const futureDate = new Date(Date.now() + 1 * 60 * 60 * 1000 + 5 * 60 * 1000);
    const result = calculateTimeRemaining(futureDate);
    expect(result).not.toBeNull();
    expect(result!.formatted).toBe('01:05');
  });
});

describe('cn', () => {
  it('joins class names with space', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('filters out falsy values', () => {
    expect(cn('foo', undefined, null, false, 'bar')).toBe('foo bar');
  });

  it('returns empty string when all values are falsy', () => {
    expect(cn(undefined, null, false)).toBe('');
  });

  it('handles single class', () => {
    expect(cn('foo')).toBe('foo');
  });
});
