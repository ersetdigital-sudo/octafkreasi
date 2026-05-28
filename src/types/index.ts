// =============================================================================
// Type Definitions for octafkreasi Travel Booking Platform
// =============================================================================

// -----------------------------------------------------------------------------
// Common / Shared Types
// -----------------------------------------------------------------------------

/**
 * Icon name type for Heroicons usage across the application.
 */
export type IconName =
  | 'search'
  | 'heart'
  | 'bell'
  | 'user'
  | 'map-pin'
  | 'calendar'
  | 'users'
  | 'arrow-right'
  | 'star'
  | 'clock'
  | 'shield-check'
  | 'credit-card'
  | 'phone'
  | 'globe'
  | 'sun'
  | 'mountain'
  | 'camera'
  | 'utensils'
  | 'compass'
  | 'waves'
  | 'tree'
  | 'building'
  | 'share'
  | 'chevron-left'
  | 'chevron-right'
  | 'check'
  | 'x'
  | 'plus'
  | 'minus'
  | 'copy'
  | 'info'
  | string;

// -----------------------------------------------------------------------------
// Navigation Types
// -----------------------------------------------------------------------------

export interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface UserAction {
  icon: IconName;
  label: string;
  href?: string;
  onClick?: () => void;
  badge?: number;
}

// -----------------------------------------------------------------------------
// Hero & Landing Page Types
// -----------------------------------------------------------------------------

export interface HeroContent {
  hashtag: string;
  heading: string;
  headingHighlight: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  backgroundImage: string;
}

// -----------------------------------------------------------------------------
// Search Types
// -----------------------------------------------------------------------------

export interface SearchParams {
  destination: string;
  checkIn: string | null;
  checkOut: string | null;
  adults: number;
  children: number;
}

export interface SearchFieldConfig {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'date' | 'guests';
  icon: IconName;
}

// -----------------------------------------------------------------------------
// Category Types
// -----------------------------------------------------------------------------

export interface Category {
  id: string;
  label: string;
  icon: IconName;
  href: string;
  isDefault?: boolean;
}

// -----------------------------------------------------------------------------
// Destination Types
// -----------------------------------------------------------------------------

export interface Destination {
  id: string;
  name: string;
  country: string;
  slug: string;
  image: string;
  imageAlt: string;
  rating: number;
  reviewCount: number;
  priceStartFrom: number;
  currency: 'IDR';
  tags: string[];
  isWishlisted: boolean;
}

export interface DestinationQuickInfo {
  country: string;
  capital: string;
  language: string;
  currency: string;
  bestTime: string;
  timeDifference: string;
  destinationType: string;
}

export interface DestinationDetail extends Destination {
  location: string;
  description: string;
  badges: string[];
  duration: string;
  tagChips: string[];
  quickInfo: DestinationQuickInfo;
  gallery: GalleryImage[];
  highlights: Highlight[];
  activities: Activity[];
  reviews: Review[];
  ratingBreakdown: RatingBreakdown;
  mapCoordinates: { lat: number; lng: number };
}

// -----------------------------------------------------------------------------
// Gallery Types
// -----------------------------------------------------------------------------

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  thumbnail: string;
}

export interface GalleryVideo {
  id: string;
  src: string;
  thumbnail: string;
  title: string;
  duration?: string;
}

// -----------------------------------------------------------------------------
// Highlight Types
// -----------------------------------------------------------------------------

export interface Highlight {
  id: string;
  name: string;
  image: string;
  description?: string;
}

// -----------------------------------------------------------------------------
// Activity Types
// -----------------------------------------------------------------------------

export interface Activity {
  id: string;
  name: string;
  image: string;
  price: number;
  duration?: string;
  rating?: number;
  destinationSlug: string;
  description?: string;
}

// -----------------------------------------------------------------------------
// Review Types
// -----------------------------------------------------------------------------

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  content: string;
  helpful?: number;
  destinationSlug: string;
}

export interface RatingBreakdown {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

// -----------------------------------------------------------------------------
// Booking Types
// -----------------------------------------------------------------------------

export type BookingStatus = 'draft' | 'pending_payment' | 'paid' | 'confirmed' | 'cancelled';

export interface Participant {
  id: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  idNumber: string;
  email: string;
  whatsapp: string;
  type: 'adult' | 'child';
}

export interface BookingPricing {
  packagePrice: number;
  insuranceTotal: number;
  additionalTotal: number;
  subtotal: number;
  promoDiscount: number;
  total: number;
}

export interface Booking {
  id: string;
  destinationSlug: string;
  packageId: string;
  status: BookingStatus;
  schedule: {
    departureDate: string;
    duration: string;
    hotelRating: number;
  };
  participants: Participant[];
  additionalOptions: string[];
  pricing: BookingPricing;
  promoCode?: string;
  createdAt: string;
  expiresAt: string;
}

export interface BookingSummary {
  destination: {
    name: string;
    image: string;
    duration: string;
    hotelRating: number;
  };
  dates: {
    departure: string;
    return?: string;
  };
  guests: {
    adults: number;
    children: number;
  };
  pricing: {
    packagePrice: number;
    insurance?: number;
    additionalOptions: { name: string; price: number }[];
    subtotal: number;
    promoDiscount?: number;
    total: number;
  };
}

// -----------------------------------------------------------------------------
// Additional Options Types
// -----------------------------------------------------------------------------

export interface AdditionalOption {
  id: string;
  name: string;
  price: number;
  priceUnit: 'per-person' | 'per-group';
  description?: string;
  isRecommended?: boolean;
  isChecked?: boolean;
}

// -----------------------------------------------------------------------------
// Promo Code Types
// -----------------------------------------------------------------------------

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  validUntil: string;
  isActive: boolean;
}

export interface PromoValidationResult {
  isValid: boolean;
  error?: string;
  promo?: PromoCode;
  discount?: number;
  message?: string;
}

// -----------------------------------------------------------------------------
// Promo Banner Types
// -----------------------------------------------------------------------------

export interface PromoData {
  label: string;
  heading: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  illustration: string;
  discountPercentage: number;
}

// -----------------------------------------------------------------------------
// Payment Types
// -----------------------------------------------------------------------------

export interface PaymentMethodGroup {
  id: string;
  name: string;
  icon?: string;
  providers: PaymentProvider[];
}

export interface PaymentProvider {
  id: string;
  name: string;
  logo: string;
  accountNumber?: string;
  accountName?: string;
  instructions: string[];
  isAvailable: boolean;
}

export type PaymentMethodType =
  | 'transfer_bank'
  | 'credit_card'
  | 'e_wallet'
  | 'virtual_account'
  | 'paylater';

// -----------------------------------------------------------------------------
// Order Details Types
// -----------------------------------------------------------------------------

export interface OrderDetails {
  destination: {
    name: string;
    image: string;
    duration: string;
  };
  dates: { departure: string; return?: string };
  guests: { adults: number; children: number };
  hotel: string;
  pricing: {
    items: { label: string; amount: number }[];
    promoCode?: string;
    promoDiscount?: number;
    total: number;
  };
}

// -----------------------------------------------------------------------------
// Timer Types
// -----------------------------------------------------------------------------

export interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  isUrgent: boolean;
  formatted: string;
}

// -----------------------------------------------------------------------------
// Star Rating Types
// -----------------------------------------------------------------------------

export interface StarDisplay {
  type: 'full' | 'half' | 'empty';
  position: number;
}

// -----------------------------------------------------------------------------
// Validation Types
// -----------------------------------------------------------------------------

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// -----------------------------------------------------------------------------
// Trust Feature Types
// -----------------------------------------------------------------------------

export interface TrustFeature {
  id: string;
  icon: IconName;
  title: string;
  description: string;
}

// -----------------------------------------------------------------------------
// Step Config Types
// -----------------------------------------------------------------------------

export interface StepConfig {
  number: number;
  label: string;
  status: 'completed' | 'active' | 'upcoming';
}
