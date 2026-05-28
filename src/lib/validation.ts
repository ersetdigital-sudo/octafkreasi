import type { SearchParams, ValidationResult, ValidationError, Participant } from '@/types';

/**
 * Calculates age from a Date of Birth.
 */
export function calculateAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

/**
 * Validates search parameters for the booking search form.
 * Returns descriptive error messages in Bahasa Indonesia.
 */
export function validateSearchParams(params: SearchParams): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate destination
  if (!params.destination || params.destination.trim().length === 0) {
    errors.push({ field: 'destination', message: 'Tujuan harus diisi' });
  }

  // Validate date range
  if (params.checkIn) {
    const checkInDate = new Date(params.checkIn);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      errors.push({ field: 'checkIn', message: 'Tanggal check-in tidak boleh di masa lalu' });
    }
  }

  if (params.checkIn && params.checkOut) {
    const checkInDate = new Date(params.checkIn);
    const checkOutDate = new Date(params.checkOut);

    if (checkOutDate <= checkInDate) {
      errors.push({ field: 'checkOut', message: 'Tanggal check-out harus setelah check-in' });
    }
  }

  // Validate guests
  if (params.adults < 1 || params.adults > 9) {
    errors.push({ field: 'adults', message: 'Jumlah dewasa harus antara 1-9' });
  }

  if (params.children < 0 || params.children > 9) {
    errors.push({ field: 'children', message: 'Jumlah anak harus antara 0-9' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates participant data for the booking form.
 * Returns descriptive error messages in Bahasa Indonesia.
 */
export function validateParticipant(participant: Participant): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate full name
  if (!participant.fullName || participant.fullName.trim().length < 3) {
    errors.push({ field: 'fullName', message: 'Nama lengkap minimal 3 karakter' });
  }

  // Validate date of birth format (DD/MM/YYYY)
  const dobRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dobRegex.test(participant.dateOfBirth)) {
    errors.push({ field: 'dateOfBirth', message: 'Format tanggal lahir harus DD/MM/YYYY' });
  } else {
    const [day, month, year] = participant.dateOfBirth.split('/').map(Number);
    const dob = new Date(year, month - 1, day);

    // Verify the date is actually valid (e.g., not 31/02/2000)
    if (
      isNaN(dob.getTime()) ||
      dob.getDate() !== day ||
      dob.getMonth() !== month - 1 ||
      dob.getFullYear() !== year
    ) {
      errors.push({ field: 'dateOfBirth', message: 'Tanggal lahir tidak valid' });
    } else if (participant.type === 'child') {
      // Validate child age < 12
      const age = calculateAge(dob);
      if (age >= 12) {
        errors.push({ field: 'dateOfBirth', message: 'Usia anak harus di bawah 12 tahun' });
      }
    }
  }

  // Validate ID number (KTP: 16 digits, Paspor: 6-9 alphanumeric)
  const ktpRegex = /^\d{16}$/;
  const passportRegex = /^[A-Z0-9]{6,9}$/;
  if (!ktpRegex.test(participant.idNumber) && !passportRegex.test(participant.idNumber)) {
    errors.push({ field: 'idNumber', message: 'Nomor KTP (16 digit) atau Paspor (6-9 karakter) tidak valid' });
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(participant.email)) {
    errors.push({ field: 'email', message: 'Format email tidak valid' });
  }

  // Validate WhatsApp number (+62 followed by 9-12 digits)
  const waRegex = /^\+62\d{9,12}$/;
  if (!waRegex.test(participant.whatsapp)) {
    errors.push({ field: 'whatsapp', message: 'Nomor WhatsApp harus format +62XXXXXXXXXX' });
  }

  return { isValid: errors.length === 0, errors };
}
