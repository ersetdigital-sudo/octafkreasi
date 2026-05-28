import { describe, it, expect } from 'vitest';
import { formatRupiah, calculateStars } from './format';

describe('formatRupiah', () => {
  it('formats zero correctly', () => {
    expect(formatRupiah(0)).toBe('Rp 0');
  });

  it('formats small amounts without separator', () => {
    expect(formatRupiah(500)).toBe('Rp 500');
  });

  it('formats thousands with dot separator', () => {
    expect(formatRupiah(1000)).toBe('Rp 1.000');
  });

  it('formats millions correctly', () => {
    expect(formatRupiah(3250000)).toBe('Rp 3.250.000');
  });

  it('formats large amounts correctly', () => {
    expect(formatRupiah(15000000)).toBe('Rp 15.000.000');
  });

  it('floors decimal amounts', () => {
    expect(formatRupiah(1500.99)).toBe('Rp 1.500');
  });

  it('throws error for negative amounts', () => {
    expect(() => formatRupiah(-1)).toThrow('Amount must not be negative');
    expect(() => formatRupiah(-100000)).toThrow('Amount must not be negative');
  });
});

describe('calculateStars', () => {
  it('returns 5 empty stars for rating 0', () => {
    const stars = calculateStars(0);
    expect(stars).toHaveLength(5);
    expect(stars.every((s) => s.type === 'empty')).toBe(true);
  });

  it('returns 5 full stars for rating 5', () => {
    const stars = calculateStars(5);
    expect(stars).toHaveLength(5);
    expect(stars.every((s) => s.type === 'full')).toBe(true);
  });

  it('returns correct stars for rating 3.0', () => {
    const stars = calculateStars(3.0);
    expect(stars).toEqual([
      { type: 'full', position: 1 },
      { type: 'full', position: 2 },
      { type: 'full', position: 3 },
      { type: 'empty', position: 4 },
      { type: 'empty', position: 5 },
    ]);
  });

  it('returns correct stars for rating 4.8 (half star)', () => {
    const stars = calculateStars(4.8);
    expect(stars).toEqual([
      { type: 'full', position: 1 },
      { type: 'full', position: 2 },
      { type: 'full', position: 3 },
      { type: 'full', position: 4 },
      { type: 'half', position: 5 },
    ]);
  });

  it('returns correct stars for rating 2.5', () => {
    const stars = calculateStars(2.5);
    expect(stars).toEqual([
      { type: 'full', position: 1 },
      { type: 'full', position: 2 },
      { type: 'half', position: 3 },
      { type: 'empty', position: 4 },
      { type: 'empty', position: 5 },
    ]);
  });

  it('returns correct stars for rating 0.5 (only half star)', () => {
    const stars = calculateStars(0.5);
    expect(stars).toEqual([
      { type: 'half', position: 1 },
      { type: 'empty', position: 2 },
      { type: 'empty', position: 3 },
      { type: 'empty', position: 4 },
      { type: 'empty', position: 5 },
    ]);
  });

  it('does not show half star for fractional < 0.5', () => {
    const stars = calculateStars(3.3);
    expect(stars).toEqual([
      { type: 'full', position: 1 },
      { type: 'full', position: 2 },
      { type: 'full', position: 3 },
      { type: 'empty', position: 4 },
      { type: 'empty', position: 5 },
    ]);
  });

  it('always returns exactly 5 elements', () => {
    for (const rating of [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]) {
      expect(calculateStars(rating)).toHaveLength(5);
    }
  });

  it('assigns correct position values 1-5', () => {
    const stars = calculateStars(3.5);
    stars.forEach((star, index) => {
      expect(star.position).toBe(index + 1);
    });
  });
});
