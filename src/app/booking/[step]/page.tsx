/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { formatRupiah } from '@/lib/format';
import { calculateBookingPrice, validatePromoCode } from '@/lib/pricing';
import { promoCodes } from '@/data/promos';
import { getBookingState, setBookingState } from '@/lib/booking-store';
import { getFees } from '@/lib/settings';
import type { Participant, AdditionalOption, BookingSummary } from '@/types';

// ─── Mobile-friendly input class ─────────────────────────────────────────────
const inputClass = "w-full rounded-xl border border-gray-300 px-4 py-3 text-base min-h-[48px] text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

// ─── Add-ons Activity Data ───────────────────────────────────────────────────
const addOnActivities = [
  {
    id: 'addon-snorkeling',
    name: 'Snorkeling Nusa Penida',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
    price: 250000,
    duration: '4 Jam',
    rating: 4.9,
    isPopular: true,
  },
  {
    id: 'addon-atv',
    name: 'ATV Ubud Adventure',
    image: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=600&q=80',
    price: 350000,
    duration: '2 Jam',
    rating: 4.7,
    isPopular: false,
  },
  {
    id: 'addon-dinner',
    name: 'Sunset Dinner Jimbaran',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    price: 500000,
    duration: '3 Jam',
    rating: 4.8,
    isPopular: false,
  },
  {
    id: 'addon-rafting',
    name: 'Rafting Ayung Ubud',
    image: 'https://images.unsplash.com/photo-1472745433479-4556f22e32c2?w=600&q=80',
    price: 300000,
    duration: '5 Jam',
    rating: 4.6,
    isPopular: false,
  },
  {
    id: 'addon-photo',
    name: 'Private Photoshoot',
    image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=600&q=80',
    price: 450000,
    duration: '2 Jam',
    rating: 4.8,
    isPopular: false,
  },
];

// ─── Nationalities ───────────────────────────────────────────────────────────
const nationalities = [
  'Indonesia', 'Malaysia', 'Singapore', 'Thailand', 'Philippines',
  'Vietnam', 'Japan', 'South Korea', 'China', 'India',
  'Australia', 'United States', 'United Kingdom', 'Lainnya',
];

// ─── Default Additional Options (for pricing calc) ───────────────────────────
const defaultAdditionalOptions: AdditionalOption[] = [
  {
    id: 'insurance',
    name: 'Asuransi Perjalanan',
    price: 150000,
    priceUnit: 'per-person',
    description: 'Perlindungan selama perjalanan',
    isRecommended: true,
    isChecked: true,
  },
];

function createParticipant(type: 'adult' | 'child', index: number): Participant {
  return {
    id: `${type}-${index}-${Date.now()}`,
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    idNumber: '',
    email: '',
    whatsapp: '',
    type,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// INFO TOOLTIP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setShow(!show)}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="inline-flex text-gray-400 transition-colors hover:text-gray-600"
        aria-label="Info"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
      </button>
      {show && (
        <span className="absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 animate-[fadeIn_0.15s_ease-out] rounded-lg bg-gray-900 px-3 py-2 text-[11px] leading-relaxed text-white shadow-lg">
          {text}
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </span>
      )}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const urlAdults = parseInt(searchParams.get('adults') || '2', 10);
  const urlChildren = parseInt(searchParams.get('children') || '0', 10);

  // Booking state from sessionStorage
  const [bookingData, setBookingData] = useState<{
    destinationName: string;
    destinationImage: string;
    duration: string;
    date: string;
    pricePerPerson: number;
  }>({
    destinationName: 'Bali, Indonesia',
    destinationImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    duration: '5 Hari 4 Malam',
    date: '12 Jun 2025',
    pricePerPerson: 3250000,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const stored = getBookingState();
    if (stored) {
      setBookingData({
        destinationName: stored.destinationName || 'Bali, Indonesia',
        destinationImage: stored.destinationImage || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
        duration: stored.duration || '5 Hari 4 Malam',
        date: stored.date || '12 Jun 2025',
        pricePerPerson: stored.pricePerPerson || 3250000,
      });
    }
  }, []);

  const [participants, setParticipants] = useState<Participant[]>(() => {
    const adultParticipants = Array.from({ length: urlAdults }, (_, i) => createParticipant('adult', i + 1));
    const childParticipants = Array.from({ length: urlChildren }, (_, i) => createParticipant('child', i + 1));
    return [...adultParticipants, ...childParticipants];
  });
  const [expandedParticipant, setExpandedParticipant] = useState<number>(0);
  const [additionalOptions] = useState<AdditionalOption[]>(defaultAdditionalOptions);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [promoError, setPromoError] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<typeof promoCodes[0] | undefined>(undefined);
  const [contactName, setContactName] = useState('');
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [bookingForOther, setBookingForOther] = useState(false);
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [serviceFee, setServiceFee] = useState(100000);
  const [insuranceFee, setInsuranceFee] = useState(150000);

  // Load fees from admin settings
  useEffect(() => {
    getFees().then((fees) => {
      setServiceFee(fees.service_fee);
      setInsuranceFee(fees.insurance_fee);
    });
  }, []);

  // Auto-fill contact from logged-in user
  useEffect(() => {
    if (user && !bookingForOther) {
      setContactName(user.user_metadata?.full_name || '');
      setContactEmail(user.email || '');
      // Strip leading 62 or +62 for WA field (karena prefix +62 sudah ada di UI)
      const rawPhone = user.user_metadata?.phone || user.phone || '';
      const cleanPhone = rawPhone.replace(/^\+?62/, '').replace(/\D/g, '');
      setContactWhatsapp(cleanPhone);
    }
  }, [user, bookingForOther]);

  // Auto-fill first participant name from user
  useEffect(() => {
    if (user && participants.length > 0 && !participants[0].fullName) {
      const name = user.user_metadata?.full_name || '';
      if (name) {
        handleParticipantChange(0, 'fullName', name);
      }
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleParticipantChange = useCallback(
    (index: number, field: keyof Participant, value: string) => {
      // NIK validation: only allow numbers, max 16 digits
      if (field === 'idNumber') {
        const numericOnly = value.replace(/\D/g, '').slice(0, 16);
        setParticipants((prev) =>
          prev.map((p, i) => (i === index ? { ...p, [field]: numericOnly } : p))
        );
        return;
      }
      setParticipants((prev) =>
        prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
      );
    },
    []
  );

  const handleParticipantCountChange = useCallback((delta: number) => {
    setParticipants((prev) => {
      const adults = prev.filter((p) => p.type === 'adult');
      const children = prev.filter((p) => p.type === 'child');
      const newCount = Math.max(1, Math.min(10, adults.length + delta));
      if (newCount > adults.length) {
        const newAdults = Array.from(
          { length: newCount - adults.length },
          (_, i) => createParticipant('adult', adults.length + i + 1)
        );
        return [...adults, ...newAdults, ...children];
      } else if (newCount < adults.length) {
        return [...adults.slice(0, newCount), ...children];
      }
      return prev;
    });
  }, []);

  const toggleAddon = useCallback((id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }, []);

  const handleApplyPromo = useCallback(() => {
    const selectedOptions = additionalOptions.filter((o) => o.isChecked);
    const pricing = calculateBookingPrice(bookingData.pricePerPerson, participants, selectedOptions);
    const result = validatePromoCode(promoCode, pricing.subtotal, promoCodes);
    if (result.isValid && result.promo) {
      setAppliedPromo(result.promo);
      setPromoMessage(result.message || 'Promo berhasil diterapkan!');
      setPromoError('');
    } else {
      setAppliedPromo(undefined);
      setPromoError(result.error || 'Kode promo tidak valid');
      setPromoMessage('');
    }
  }, [promoCode, participants, additionalOptions, bookingData.pricePerPerson]);

  // ─── Pricing Calculation ─────────────────────────────────────────────────────
  const selectedOptions = additionalOptions.filter((o) => o.isChecked);
  const pricing = calculateBookingPrice(bookingData.pricePerPerson, participants, selectedOptions, appliedPromo);
  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const addon = addOnActivities.find((a) => a.id === id);
    return sum + (addon?.price || 0);
  }, 0);

  // Fees loaded from admin settings
  const totalPayment = pricing.packagePrice + serviceFee + insuranceFee + addonsTotal - pricing.promoDiscount;

  const adultsCount = participants.filter((p) => p.type === 'adult').length;

  // Persist addons/total to sessionStorage when they change
  useEffect(() => {
    setBookingState({
      addons: selectedAddons,
      addonsTotal,
      insuranceTotal: pricing.insuranceTotal,
      adults: adultsCount,
      children: participants.filter((p) => p.type === 'child').length,
      packageTotal: pricing.packagePrice,
      total: totalPayment,
    });
  }, [selectedAddons, addonsTotal, pricing.insuranceTotal, pricing.packagePrice, totalPayment, adultsCount, participants]);

  const summary: BookingSummary = {
    destination: { name: bookingData.destinationName, image: bookingData.destinationImage, duration: bookingData.duration, hotelRating: 4 },
    dates: { departure: bookingData.date },
    guests: { adults: adultsCount, children: participants.filter((p) => p.type === 'child').length },
    pricing: { packagePrice: pricing.packagePrice, insurance: pricing.insuranceTotal, additionalOptions: [], subtotal: pricing.subtotal, promoDiscount: pricing.promoDiscount, total: totalPayment },
  };

  void summary; // used for type-check only

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════════
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32 lg:pb-24 animate-[fadeIn_0.3s_ease-out]">
      {/* ─── SIMPLIFIED HEADER ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-md shadow-blue-600/30">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M3 12L7.5 7.5L12 12L16.5 7.5L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 17L7.5 12.5L12 17L16.5 12.5L21 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
              </svg>
            </span>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              octaf<span className="text-blue-600">kreasi</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-600">
          </div>
        </div>
      </header>

      {/* ─── MOBILE STEP INDICATOR ─────────────────────────────────────────────── */}
      <div className="lg:hidden border-b border-gray-200 bg-white px-4 py-3">
        <p className="text-sm font-medium text-gray-700">Step 2 dari 4 — <span className="text-blue-600">Informasi Pemesanan</span></p>
      </div>

      {/* ─── DESKTOP PROGRESS STEPPER ──────────────────────────────────────────── */}
      <div className="hidden lg:block border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <nav aria-label="Progress" className="w-full">
            <ol className="flex items-center justify-between">
              {[
                { num: 1, label: 'Pilih Paket', desc: 'Paket perjalanan dipilih', status: 'completed' as const },
                { num: 2, label: 'Informasi Pemesanan', desc: 'Lengkapi data & add-ons', status: 'active' as const },
                { num: 3, label: 'Pembayaran', desc: 'Pilih metode pembayaran', status: 'upcoming' as const },
                { num: 4, label: 'Konfirmasi', desc: 'Selesai & dapatkan e-tiket', status: 'upcoming' as const },
              ].map((step, idx, arr) => (
                <li key={step.num} className={`flex items-center ${idx < arr.length - 1 ? 'flex-1' : 'flex-none'}`}>
                  <div className="flex flex-col items-center text-center">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                      step.status === 'completed' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' :
                      step.status === 'active' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' :
                      'border-2 border-gray-300 text-gray-400'
                    }`}>
                      {step.status === 'completed' ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : step.num}
                    </div>
                    <span className={`mt-2 text-xs font-semibold sm:text-sm ${
                      step.status === 'completed' || step.status === 'active' ? 'text-blue-600' : 'text-gray-400'
                    }`}>{step.label}</span>
                    <span className="mt-0.5 hidden text-[11px] text-gray-400 sm:block">{step.desc}</span>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className={`mx-2 h-0.5 flex-1 sm:mx-4 ${step.status === 'completed' ? 'bg-blue-600' : 'bg-gray-200'}`} />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      {/* ─── MAIN CONTENT ──────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6">

        {/* ─── MOBILE COLLAPSIBLE SUMMARY ────────────────────────────────────────── */}
        <div className="lg:hidden mb-6">
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setSummaryExpanded(!summaryExpanded)}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left"
            >
              <span className="text-sm font-semibold text-gray-900">Ringkasan Pesanan — {formatRupiah(totalPayment)}</span>
              <svg className={`h-5 w-5 text-gray-400 transition-transform ${summaryExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {summaryExpanded && (
              <div className="border-t border-gray-100 px-4 pb-4 pt-3">
                <div className="mb-3 flex gap-3">
                  <div className="h-14 w-18 shrink-0 overflow-hidden rounded-lg bg-gray-200">
                    <img src={bookingData.destinationImage} alt={bookingData.destinationName} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{bookingData.destinationName}</p>
                    <p className="text-xs text-gray-500">{bookingData.duration}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tanggal</span>
                    <span className="font-medium text-gray-900">{bookingData.date || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Peserta</span>
                    <span className="font-medium text-gray-900">{adultsCount} Dewasa</span>
                  </div>
                  <div className="border-t border-gray-100 pt-2 flex justify-between">
                    <span className="text-gray-600">Paket Tour</span>
                    <span className="font-medium text-gray-900">{formatRupiah(pricing.packagePrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biaya Layanan</span>
                    <span className="font-medium text-gray-900">{formatRupiah(serviceFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Asuransi</span>
                    <span className="font-medium text-gray-900">{formatRupiah(insuranceFee)}</span>
                  </div>
                  {addonsTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Add-ons</span>
                      <span className="font-medium text-gray-900">{formatRupiah(addonsTotal)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-blue-600">{formatRupiah(totalPayment)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ═══ LEFT COLUMN ═══ */}
          <div className="space-y-6 lg:col-span-2">

            {/* ─── Section 1: Informasi Pemesanan Utama ─────────────────────────── */}
            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="p-5 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Informasi Pemesanan Utama</h2>
                    <p className="text-sm text-gray-500">Masukkan data pemesan untuk konfirmasi perjalanan</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Toggle booking untuk orang lain */}
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <button type="button" onClick={() => {
                        setBookingForOther(!bookingForOther);
                        if (bookingForOther && user) {
                          setContactName(user.user_metadata?.full_name || '');
                          setContactEmail(user.email || '');
                          setContactWhatsapp(user.user_metadata?.phone || user.phone || '');
                        } else {
                          setContactName(''); setContactEmail(''); setContactWhatsapp('');
                        }
                      }}
                        className={`relative h-5 w-9 rounded-full transition-colors ${bookingForOther ? 'bg-blue-600' : 'bg-gray-200'}`}>
                        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${bookingForOther ? 'left-[18px]' : 'left-0.5'}`} />
                      </button>
                      <span className="text-sm text-gray-600">Booking untuk orang lain</span>
                    </label>
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label htmlFor="contact-name" className="text-sm font-medium text-gray-700">Nama Lengkap<span className="ml-0.5 text-red-500">*</span></label>
                    <input id="contact-name" type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Masukkan nama lengkap" className={inputClass} readOnly={!bookingForOther} style={!bookingForOther ? { backgroundColor: '#F8FAFC' } : {}} />
                    {!bookingForOther && <p className="text-[11px] text-gray-400">Otomatis dari akun Anda</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-wa" className="text-sm font-medium text-gray-700">Nomor WhatsApp<span className="ml-0.5 text-red-500">*</span></label>
                    <div className="flex">
                      <span className="inline-flex items-center rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">+62</span>
                      <input id="contact-wa" type="tel" inputMode="numeric" value={contactWhatsapp} onChange={(e) => setContactWhatsapp(e.target.value)} placeholder="812XXXXXXXX" className="w-full rounded-r-xl border border-gray-300 px-4 py-3 text-base min-h-[48px] text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-email" className="text-sm font-medium text-gray-700">Email<span className="ml-0.5 text-red-500">*</span></label>
                    <input id="contact-email" type="email" inputMode="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="contoh@email.com" className={inputClass} readOnly={!bookingForOther} style={!bookingForOther ? { backgroundColor: '#F8FAFC' } : {}} />
                  </div>
                </div>
              </div>
            </section>

            {/* ─── Section 2: Detail Peserta Perjalanan ─────────────────────────── */}
            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="p-5 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Detail Peserta Perjalanan</h2>
                    <p className="text-sm text-gray-500">Informasi untuk semua peserta yang akan ikut dalam perjalanan</p>
                  </div>
                </div>

                {/* Participant Count */}
                <div className="mb-5 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <span className="text-sm font-medium text-gray-700">Jumlah Peserta</span>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => handleParticipantCountChange(-1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition hover:border-blue-400 hover:text-blue-600 disabled:opacity-40" disabled={adultsCount <= 1}>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>
                    </button>
                    <span className="min-w-[2rem] text-center text-base font-bold text-gray-900">{adultsCount}</span>
                    <button type="button" onClick={() => handleParticipantCountChange(1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition hover:border-blue-400 hover:text-blue-600 disabled:opacity-40" disabled={adultsCount >= 10}>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    </button>
                  </div>
                </div>

                {/* Participant Accordions */}
                <div className="space-y-3">
                  {participants.map((participant, index) => {
                    const isExpanded = expandedParticipant === index;
                    const label = index === 0 ? 'Peserta 1 — Pemesan (Utama)' : `Peserta ${index + 1}`;
                    return (
                      <div key={participant.id} className="overflow-hidden rounded-xl border border-gray-200">
                        <button
                          type="button"
                          onClick={() => setExpandedParticipant(isExpanded ? -1 : index)}
                          className="flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-gray-50"
                        >
                          <span className="text-sm font-semibold text-gray-900">{label}</span>
                          <svg className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                        {isExpanded && (
                          <div className="border-t border-gray-100 px-4 pb-4 pt-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="flex flex-col gap-1.5 sm:col-span-2">
                                <label htmlFor={`p-${index}-name`} className="text-sm font-medium text-gray-700">Nama Lengkap<span className="ml-0.5 text-red-500">*</span></label>
                                <input id={`p-${index}-name`} type="text" value={participant.fullName} onChange={(e) => handleParticipantChange(index, 'fullName', e.target.value)} placeholder="Sesuai KTP/Paspor" className={inputClass} />
                              </div>
                              <div className="flex flex-col gap-1.5 sm:col-span-2">
                                <label htmlFor={`p-${index}-id`} className="text-sm font-medium text-gray-700">No. KTP<span className="ml-0.5 text-red-500">*</span></label>
                                <input id={`p-${index}-id`} type="text" inputMode="numeric" value={participant.idNumber} onChange={(e) => handleParticipantChange(index, 'idNumber', e.target.value)} placeholder="16 digit NIK" maxLength={16} className={inputClass} />
                                {participant.idNumber.length > 0 && participant.idNumber.length < 16 && (
                                  <span className="text-xs text-red-500">{participant.idNumber.length}/16 digit — harus 16 digit</span>
                                )}
                                {participant.idNumber.length === 16 && (
                                  <span className="text-xs text-green-600">✓ NIK valid</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ─── Section 3: Add-ons Activity ──────────────────────────────────── */}
            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="p-5 sm:p-6">
                <div className="mb-1 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Add-ons Activity (Opsional)</h2>
                    <p className="text-sm text-gray-500">Pilih aktivitas tambahan untuk melengkapi perjalananmu</p>
                  </div>
                </div>

                <div className="mb-4 mt-3 flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">{selectedAddons.length} aktivitas dipilih</span>
                  <button type="button" className="text-sm font-medium text-blue-600 hover:underline">Lihat semua</button>
                </div>

                {/* Horizontal Scrollable Cards */}
                <div className="">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {addOnActivities.map((addon) => {
                      const isSelected = selectedAddons.includes(addon.id);
                      return (
                        <button
                          key={addon.id}
                          type="button"
                          onClick={() => toggleAddon(addon.id)}
                          className={`group relative flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                            isSelected ? 'border-blue-500 shadow-md shadow-blue-500/20' : 'border-transparent shadow-sm hover:shadow-md'
                          }`}
                          
                        >
                          <div className="relative h-28 w-full overflow-hidden">
                            <img src={addon.image} alt={addon.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                            {/* Checkbox overlay */}
                            <div className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full shadow-sm transition-all ${isSelected ? 'bg-blue-600 scale-110' : 'bg-white border border-gray-300'}`}>{isSelected ? (<svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>) : (<svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>)}</div>
                            {addon.isPopular && (
                              <span className="absolute left-2 top-2 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">Paling Populer</span>
                            )}
                          </div>
                          <div className="bg-white p-3 text-left">
                            <p className="text-xs font-semibold text-gray-900 leading-tight">{addon.name}</p>
                            <div className="mt-1 flex items-center gap-1">
                              <span className="text-[10px] text-gray-500">{addon.duration}</span>
                              <span className="text-[10px] text-gray-300">•</span>
                              <span className="text-[10px] text-yellow-500">★ {addon.rating}</span>
                            </div>
                            <p className="mt-1.5 text-xs font-bold text-blue-600">{formatRupiah(addon.price)}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p className="mt-2 text-xs text-gray-400">Add-ons dapat ditambahkan atau diubah setelah pemesanan</p>
              </div>
            </section>

          </div>

          {/* ═══ RIGHT COLUMN (Sidebar) ═══ */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="space-y-4">

              {/* Ringkasan Perjalanan */}
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="p-5">
                  <h3 className="mb-4 text-base font-bold text-gray-900">Ringkasan Perjalanan</h3>
                  <div className="mb-4 flex gap-3">
                    <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-200">
                      <img src={bookingData.destinationImage} alt={bookingData.destinationName} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{bookingData.destinationName}</p>
                      <p className="text-xs text-gray-500">{bookingData.duration}</p>
                      <div className="mt-1 flex items-center gap-1">
                        <svg className="h-3.5 w-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        <span className="text-xs text-gray-600">4.6 (128 review)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 border-t border-gray-100 pt-3 text-sm">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 flex-shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                      <span className="text-gray-500">Tanggal Berangkat:</span>
                      <span className="ml-auto font-medium text-gray-900">{bookingData.date || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 flex-shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" /></svg>
                      <span className="text-gray-500">Peserta:</span>
                      <span className="ml-auto font-medium text-gray-900">{adultsCount} Dewasa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 flex-shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><circle cx="7" cy="7" r="1" fill="currentColor" /></svg>
                      <span className="text-gray-500">Tipe Perjalanan:</span>
                      <span className="ml-auto font-medium text-gray-900">Private Tour</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rincian Harga */}
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900">Rincian Harga</h3>
                    <button type="button" className="text-sm font-medium text-blue-600 hover:underline">Ubah</button>
                  </div>

                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paket Tour ({adultsCount} x {formatRupiah(bookingData.pricePerPerson)})</span>
                      <span className="font-medium text-gray-900">{formatRupiah(pricing.packagePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1 text-gray-600">
                        Biaya Layanan
                        <InfoTooltip text="Biaya layanan digunakan untuk mendukung operasional platform dan memastikan pengalaman pemesanan terbaik untuk kamu." />
                      </span>
                      <span className="font-medium text-gray-900">{formatRupiah(serviceFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1 text-gray-600">
                        Asuransi Perjalanan
                        <InfoTooltip text="Asuransi perjalanan melindungi kamu dari risiko pembatalan mendadak, kecelakaan, dan kehilangan barang selama perjalanan." />
                      </span>
                      <span className="font-medium text-gray-900">{formatRupiah(insuranceFee)}</span>
                    </div>
                    {selectedAddons.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Add-ons Activity ({selectedAddons.length})</span>
                        <span className="font-medium text-gray-900">{formatRupiah(addonsTotal)}</span>
                      </div>
                    )}
                    {pricing.promoDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Diskon Promo</span>
                        <span className="font-medium">-{formatRupiah(pricing.promoDiscount)}</span>
                      </div>
                    )}
                  </div>

                  {/* Promo Code */}
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <div className="flex gap-2">
                      <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Kode promo" className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      <button type="button" onClick={handleApplyPromo} className="rounded-xl border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50">Gunakan</button>
                    </div>
                    {promoMessage && <p className="mt-1.5 text-xs text-green-600">{promoMessage}</p>}
                    {promoError && <p className="mt-1.5 text-xs text-red-500">{promoError}</p>}
                  </div>

                  {/* Total */}
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900">Total Pembayaran</span>
                      <span className="text-xl font-bold text-blue-600">{formatRupiah(totalPayment)}</span>
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Harga sudah termasuk pajak
                    </p>
                  </div>
                </div>
              </div>

              {/* Pembayaran Aman Trust Badge */}
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-start gap-3 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Pembayaran Aman</p>
                    <p className="mt-0.5 text-xs text-gray-500">Transaksi kamu dilindungi sistem keamanan berstandar internasional.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM STICKY BAR ─────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-sm shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
          {/* Mobile layout: stacked */}
          <div className="flex items-center justify-between gap-2 lg:hidden">
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Total Pembayaran</p>
              <p className="text-lg font-bold text-blue-600">{formatRupiah(totalPayment)}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setBookingState({
                  addons: selectedAddons,
                  addonsTotal,
                  insuranceTotal: pricing.insuranceTotal,
                  adults: adultsCount,
                  children: participants.filter((p) => p.type === 'child').length,
                  packageTotal: pricing.packagePrice,
                  total: totalPayment,
                });
                router.push(`/pembayaran?total=${totalPayment}&addons=${selectedAddons.join(',')}&adults=${adultsCount}`);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-3 min-h-[52px] text-sm font-bold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700"
            >
              Lanjut ke Pembayaran
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </button>
          </div>

          {/* Desktop layout: full bar */}
          <div className="hidden lg:flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <p className="text-xs text-gray-500">Total Pembayaran</p>
                <p className="text-lg font-bold text-blue-600 sm:text-xl">{formatRupiah(totalPayment)}</p>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div>
                  <p className="text-xs font-medium text-gray-700">Harga terbaik</p>
                  <p className="text-[10px] text-gray-400">Jaminan harga termurah</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div>
                  <p className="text-xs font-medium text-gray-700">Pembatalan fleksibel</p>
                  <p className="text-[10px] text-gray-400">Syarat &amp; ketentuan berlaku</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                <div>
                  <p className="text-xs font-medium text-gray-700">Transaksi aman</p>
                  <p className="text-[10px] text-gray-400">Pembayaran terenkripsi</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" className="inline-flex items-center gap-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                Kembali
              </Link>
              <button
                type="button"
                onClick={() => {
                  setBookingState({
                    addons: selectedAddons,
                    addonsTotal,
                    insuranceTotal: pricing.insuranceTotal,
                    adults: adultsCount,
                    children: participants.filter((p) => p.type === 'child').length,
                    packageTotal: pricing.packagePrice,
                    total: totalPayment,
                  });
                  router.push(`/pembayaran?total=${totalPayment}&addons=${selectedAddons.join(',')}&adults=${adultsCount}`);
                }}
                className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700"
              >
                Lanjut ke Pembayaran
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
