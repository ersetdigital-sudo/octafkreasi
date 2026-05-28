import { describe, it, expect } from 'vitest';
import { validateSearchParams, validateParticipant, calculateAge } from './validation';
import type { SearchParams, Participant } from '@/types';

describe('validateSearchParams', () => {
  const validParams: SearchParams = {
    destination: 'Bali',
    checkIn: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
    checkOut: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // 3 days from now
    adults: 2,
    children: 1,
  };

  it('returns isValid true for valid params', () => {
    const result = validateSearchParams(validParams);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns error when destination is empty', () => {
    const result = validateSearchParams({ ...validParams, destination: '' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'destination',
      message: 'Tujuan harus diisi',
    });
  });

  it('returns error when destination is whitespace only', () => {
    const result = validateSearchParams({ ...validParams, destination: '   ' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'destination',
      message: 'Tujuan harus diisi',
    });
  });

  it('returns error when checkIn is in the past', () => {
    const result = validateSearchParams({
      ...validParams,
      checkIn: '2020-01-01',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'checkIn',
      message: 'Tanggal check-in tidak boleh di masa lalu',
    });
  });

  it('returns error when checkOut is before checkIn', () => {
    const result = validateSearchParams({
      ...validParams,
      checkIn: '2030-06-15',
      checkOut: '2030-06-10',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'checkOut',
      message: 'Tanggal check-out harus setelah check-in',
    });
  });

  it('returns error when checkOut equals checkIn', () => {
    const result = validateSearchParams({
      ...validParams,
      checkIn: '2030-06-15',
      checkOut: '2030-06-15',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'checkOut',
      message: 'Tanggal check-out harus setelah check-in',
    });
  });

  it('returns error when adults is 0', () => {
    const result = validateSearchParams({ ...validParams, adults: 0 });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'adults',
      message: 'Jumlah dewasa harus antara 1-9',
    });
  });

  it('returns error when adults is 10', () => {
    const result = validateSearchParams({ ...validParams, adults: 10 });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'adults',
      message: 'Jumlah dewasa harus antara 1-9',
    });
  });

  it('returns error when children is negative', () => {
    const result = validateSearchParams({ ...validParams, children: -1 });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'children',
      message: 'Jumlah anak harus antara 0-9',
    });
  });

  it('returns error when children is 10', () => {
    const result = validateSearchParams({ ...validParams, children: 10 });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'children',
      message: 'Jumlah anak harus antara 0-9',
    });
  });

  it('allows null checkIn and checkOut', () => {
    const result = validateSearchParams({
      ...validParams,
      checkIn: null,
      checkOut: null,
    });
    expect(result.isValid).toBe(true);
  });

  it('returns multiple errors for multiple violations', () => {
    const result = validateSearchParams({
      destination: '',
      checkIn: '2020-01-01',
      checkOut: '2019-12-31',
      adults: 0,
      children: -1,
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(4);
  });
});

describe('validateParticipant', () => {
  const validAdult: Participant = {
    id: '1',
    fullName: 'John Doe',
    dateOfBirth: '15/06/1990',
    nationality: 'Indonesia',
    idNumber: '1234567890123456', // 16-digit KTP
    email: 'john@example.com',
    whatsapp: '+628123456789',
    type: 'adult',
  };

  it('returns isValid true for valid adult participant', () => {
    const result = validateParticipant(validAdult);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns error when fullName is less than 3 characters', () => {
    const result = validateParticipant({ ...validAdult, fullName: 'AB' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'fullName',
      message: 'Nama lengkap minimal 3 karakter',
    });
  });

  it('returns error when fullName is empty', () => {
    const result = validateParticipant({ ...validAdult, fullName: '' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'fullName',
      message: 'Nama lengkap minimal 3 karakter',
    });
  });

  it('returns error for invalid dateOfBirth format', () => {
    const result = validateParticipant({ ...validAdult, dateOfBirth: '1990-06-15' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'dateOfBirth',
      message: 'Format tanggal lahir harus DD/MM/YYYY',
    });
  });

  it('returns error for invalid date values (e.g., 31/02/2000)', () => {
    const result = validateParticipant({ ...validAdult, dateOfBirth: '31/02/2000' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'dateOfBirth',
      message: 'Tanggal lahir tidak valid',
    });
  });

  it('accepts valid passport number (6-9 alphanumeric)', () => {
    const result = validateParticipant({ ...validAdult, idNumber: 'A1234567' });
    expect(result.isValid).toBe(true);
  });

  it('returns error for invalid idNumber', () => {
    const result = validateParticipant({ ...validAdult, idNumber: '12345' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'idNumber',
      message: 'Nomor KTP (16 digit) atau Paspor (6-9 karakter) tidak valid',
    });
  });

  it('returns error for invalid email format', () => {
    const result = validateParticipant({ ...validAdult, email: 'invalid-email' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'email',
      message: 'Format email tidak valid',
    });
  });

  it('returns error for invalid whatsapp format', () => {
    const result = validateParticipant({ ...validAdult, whatsapp: '08123456789' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'whatsapp',
      message: 'Nomor WhatsApp harus format +62XXXXXXXXXX',
    });
  });

  it('returns error when whatsapp has too few digits after +62', () => {
    const result = validateParticipant({ ...validAdult, whatsapp: '+6212345678' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'whatsapp',
      message: 'Nomor WhatsApp harus format +62XXXXXXXXXX',
    });
  });

  it('validates child age must be under 12', () => {
    const child: Participant = {
      ...validAdult,
      type: 'child',
      dateOfBirth: '15/06/2000', // would be over 12
    };
    const result = validateParticipant(child);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'dateOfBirth',
      message: 'Usia anak harus di bawah 12 tahun',
    });
  });

  it('accepts valid child under 12', () => {
    const today = new Date();
    const childYear = today.getFullYear() - 5;
    const child: Participant = {
      ...validAdult,
      type: 'child',
      dateOfBirth: `15/06/${childYear}`,
    };
    const result = validateParticipant(child);
    expect(result.isValid).toBe(true);
  });
});

describe('calculateAge', () => {
  it('calculates age correctly for a past date', () => {
    const today = new Date();
    const dob = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    expect(calculateAge(dob)).toBe(25);
  });

  it('returns age minus 1 if birthday has not occurred yet this year', () => {
    const today = new Date();
    const dob = new Date(today.getFullYear() - 30, today.getMonth() + 1, today.getDate());
    expect(calculateAge(dob)).toBe(29);
  });

  it('returns 0 for a newborn', () => {
    const today = new Date();
    expect(calculateAge(today)).toBe(0);
  });
});
