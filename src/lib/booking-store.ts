// Booking state that persists across pages via sessionStorage

export interface BookingState {
  destinationName: string;
  destinationSlug: string;
  destinationImage: string;
  duration: string;
  date: string;
  adults: number;
  children: number;
  pricePerPerson: number;
  addons: string[];
  addonsTotal: number;
  insuranceTotal: number;
  packageTotal: number;
  total: number;
}

const STORAGE_KEY = 'octafkreasi_booking';

export function getBookingState(): BookingState | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = sessionStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setBookingState(state: Partial<BookingState>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getBookingState() || getDefaultState();
    const updated = { ...current, ...state };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // silently fail
  }
}

export function clearBookingState(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY);
}

function getDefaultState(): BookingState {
  return {
    destinationName: 'Bali, Indonesia',
    destinationSlug: 'bali',
    destinationImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    duration: '5 Hari 4 Malam',
    date: '',
    adults: 1,
    children: 0,
    pricePerPerson: 3250000,
    addons: [],
    addonsTotal: 0,
    insuranceTotal: 0,
    packageTotal: 3250000,
    total: 3250000,
  };
}
