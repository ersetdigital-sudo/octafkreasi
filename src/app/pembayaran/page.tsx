'use client';

import React, { useState, useMemo, useEffect, useCallback, Suspense } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { OrderSummary } from '@/components/sections/OrderSummary';
import { formatRupiah } from '@/lib/format';
import { getBookingState } from '@/lib/booking-store';
import { supabase } from '@/lib/supabase';
import { getFees } from '@/lib/settings';
import type { OrderDetails } from '@/types';

// ─── Payment Data ────────────────────────────────────────────────────────────
type PaymentType = 'transfer-bank' | 'e-wallet';

const bankAccounts = [
  { name: 'BCA', accountNumber: '1234 5678 9101', accountName: 'PT Octaf Kreasi Travel' },
  { name: 'Mandiri', accountNumber: '1234 5678 9102', accountName: 'PT Octaf Kreasi Travel' },
  { name: 'BNI', accountNumber: '1234 5678 9103', accountName: 'PT Octaf Kreasi Travel' },
  { name: 'BRI', accountNumber: '1234 5678 9104', accountName: 'PT Octaf Kreasi Travel' },
];

const eWallets = [
  { name: 'OVO', number: '0812-3456-7890', instruction: 'Transfer ke nomor OVO di atas' },
  { name: 'GoPay', number: '0812-3456-7890', instruction: 'Transfer ke nomor GoPay di atas' },
  { name: 'Dana', number: '0812-3456-7890', instruction: 'Transfer ke nomor Dana di atas' },
];

// ─── Copy Helper ─────────────────────────────────────────────────────────────
function CopyButton({ text, label = 'Salin' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text.replace(/\s/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Tersalin
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENT ACCORDION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
function PaymentAccordion({ title, subtitle, defaultOpen = false, children }: { title: string; subtitle: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
            {title.slice(0, 3)}
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">{title}</p>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
        <svg className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {isOpen && (
        <div className="animate-[fadeIn_0.2s_ease-out] border-t border-gray-100 px-5 pb-5 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function PembayaranPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>}>
      <PembayaranContent />
    </Suspense>
  );
}

function PembayaranContent() {
  const searchParams = useSearchParams();
  const existingOrderId = searchParams.get('order');
  const [selectedMethod, setSelectedMethod] = useState<PaymentType | null>(null);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [orderId, setOrderId] = useState<string | null>(existingOrderId);
  const [savingOrder, setSavingOrder] = useState(false);
  const [dynamicFees, setDynamicFees] = useState({ service_fee: 100000, insurance_fee: 150000 });

  // Load fees from admin settings
  useEffect(() => {
    getFees().then(setDynamicFees);
  }, []);

  // Save order to database and proceed to confirmation
  const handlePayNow = useCallback(async () => {
    if (!selectedMethod) return;
    setSavingOrder(true);

    try {
      // If paying for an existing order, just update payment method
      if (existingOrderId) {
        await supabase
          .from('orders')
          .update({ payment_method: selectedMethod })
          .eq('id', existingOrderId);
        setPaymentInitiated(true);
        setSavingOrder(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      const stored = getBookingState();

      const orderData = {
        user_id: user?.id || null,
        destination_slug: stored?.destinationSlug || '',
        destination_name: stored?.destinationName || '',
        package_name: `${stored?.destinationName || ''} - ${stored?.duration || ''}`,
        package_duration: stored?.duration || '',
        date: stored?.date || null,
        adults: stored?.adults || 1,
        children: stored?.children || 0,
        total_price: stored?.total || 0,
        customer_name: user?.user_metadata?.full_name || '',
        customer_email: user?.email || '',
        customer_phone: user?.user_metadata?.phone || user?.phone || '',
        addons: stored?.addons || [],
        payment_method: selectedMethod,
        status: 'pending',
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select('id')
        .single();

      if (!error && data) {
        setOrderId(data.id);
      }

      setPaymentInitiated(true);
    } catch (err) {
      console.error('Error saving order:', err);
    }

    setSavingOrder(false);
  }, [selectedMethod, existingOrderId]);

  // Build order details from sessionStorage
  const [orderDetails, setOrderDetails] = useState<OrderDetails>(() => {
    const fallbackAdults = 1;
    const fallbackPrice = 3250000;
    const fallbackServiceFee = 100000;
    const fallbackInsuranceFee = 150000;
    const fallbackTotal = fallbackAdults * fallbackPrice + fallbackServiceFee + fallbackInsuranceFee;
    return {
      destination: {
        name: 'Bali, Indonesia',
        image: '/images/destinations/bali.jpg',
        duration: '5 Hari 4 Malam',
      },
      dates: { departure: '-' },
      guests: { adults: fallbackAdults, children: 0 },
      hotel: 'Bintang 4',
      pricing: {
        items: [
          { label: `Paket Tour (${fallbackAdults} Dewasa)`, amount: fallbackAdults * fallbackPrice },
          { label: 'Biaya Layanan', amount: fallbackServiceFee },
          { label: 'Asuransi Perjalanan', amount: fallbackInsuranceFee },
        ],
        total: fallbackTotal,
      },
    };
  });

  useEffect(() => {
    const serviceFee = dynamicFees.service_fee;
    const insuranceFee = dynamicFees.insurance_fee;

    // If coming from profile page with existing order, load from DB
    if (existingOrderId) {
      supabase
        .from('orders')
        .select('*')
        .eq('id', existingOrderId)
        .single()
        .then(({ data }) => {
          if (data) {
            setOrderDetails({
              destination: {
                name: data.destination_name || 'Destinasi',
                image: '',
                duration: data.package_duration || '',
              },
              dates: { departure: data.date || '-' },
              guests: { adults: data.adults || 1, children: data.children || 0 },
              hotel: 'Bintang 4',
              pricing: {
                items: [
                  { label: `Paket Tour (${data.adults || 1} Dewasa)`, amount: (data.total_price || 0) - serviceFee - insuranceFee },
                  { label: 'Biaya Layanan', amount: serviceFee },
                  { label: 'Asuransi Perjalanan', amount: insuranceFee },
                ],
                total: data.total_price || 0,
              },
            });
          }
        });
      return;
    }

    const stored = getBookingState();
    if (stored) {
      const adults = stored.adults || 1;
      const children = stored.children || 0;
      const pricePerPerson = stored.pricePerPerson || 3250000;
      const addonsTotal = stored.addonsTotal || 0;
      const total = stored.total || (adults * pricePerPerson + serviceFee + insuranceFee + addonsTotal);

      const pricingItems: { label: string; amount: number }[] = [
        { label: `Paket Tour (${adults} Dewasa)`, amount: adults * pricePerPerson },
        { label: 'Biaya Layanan', amount: serviceFee },
        { label: 'Asuransi Perjalanan', amount: insuranceFee },
      ];
      if (addonsTotal > 0) {
        pricingItems.push({ label: 'Add-ons Activity', amount: addonsTotal });
      }

      setOrderDetails({
        destination: {
          name: stored.destinationName || 'Bali, Indonesia',
          image: stored.destinationImage || '/images/destinations/bali.jpg',
          duration: stored.duration || '5 Hari 4 Malam',
        },
        dates: {
          departure: stored.date || '-',
        },
        guests: {
          adults,
          children,
        },
        hotel: 'Bintang 4',
        pricing: {
          items: pricingItems,
          total,
        },
      });
    }
  }, [existingOrderId, dynamicFees]);

  const steps = useMemo(() => [
    { num: 1, label: 'Pilih Paket', desc: 'Paket perjalanan dipilih', status: 'completed' as const },
    { num: 2, label: 'Informasi Pemesanan', desc: 'Data peserta lengkap', status: 'completed' as const },
    {
      num: 3,
      label: 'Pembayaran',
      desc: 'Pilih metode pembayaran',
      status: paymentInitiated ? ('completed' as const) : ('active' as const),
    },
    {
      num: 4,
      label: 'Konfirmasi',
      desc: 'Selesai & dapatkan e-tiket',
      status: paymentInitiated ? ('active' as const) : ('upcoming' as const),
    },
  ], [paymentInitiated]);

  return (
    <div className="min-h-screen bg-gray-50 pb-32 lg:pb-24 animate-[fadeIn_0.3s_ease-out]">
      {/* ─── HEADER ──────────────────────────────────────────────────────── */}
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
            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="hidden sm:inline">Transaksi aman &amp; terpercaya</span>
          </div>
        </div>
      </header>

      {/* ─── MOBILE STEP INDICATOR ─────────────────────────────────────────────── */}
      <div className="lg:hidden border-b border-gray-200 bg-white px-4 py-3">
        <p className="text-sm font-medium text-gray-700">
          Step {paymentInitiated ? '4' : '3'} dari 4 — <span className="text-blue-600">{paymentInitiated ? 'Konfirmasi' : 'Pembayaran'}</span>
        </p>
      </div>

      {/* ─── DESKTOP PROGRESS STEPPER ──────────────────────────────────────────── */}
      <div className="hidden lg:block border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <nav aria-label="Progress" className="w-full">
            <ol className="flex items-center justify-between">
              {steps.map((step, idx, arr) => (
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

      {/* ─── MAIN CONTENT ──────────────────────────────────────────────────── */}
      {!paymentInitiated ? (
        /* ═══════════════════════════════════════════════════════════════════════
           STEP 3 — Payment Method Selection (2 options only)
           ═══════════════════════════════════════════════════════════════════════ */
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* LEFT COLUMN — Payment Methods */}
            <div className="space-y-6 lg:col-span-2">
              <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="p-5 sm:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                      </svg>
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Pilih Metode Pembayaran</h2>
                      <p className="text-sm text-gray-500">Pilih metode pembayaran yang paling nyaman untuk Anda</p>
                    </div>
                  </div>

                  {/* 2 Payment Method Radio Cards */}
                  <div className="space-y-3">
                    {/* Transfer Bank */}
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('transfer-bank')}
                      className={`flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-5 text-left transition-all ${
                        selectedMethod === 'transfer-bank'
                          ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        selectedMethod === 'transfer-bank' ? 'border-blue-600' : 'border-gray-300'
                      }`}>
                        {selectedMethod === 'transfer-bank' && (
                          <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-semibold ${selectedMethod === 'transfer-bank' ? 'text-blue-700' : 'text-gray-900'}`}>
                          Transfer Bank
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">BCA, Mandiri, BNI, BRI</p>
                      </div>
                      <span className={`flex-shrink-0 ${selectedMethod === 'transfer-bank' ? 'text-blue-600' : 'text-gray-400'}`}>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                        </svg>
                      </span>
                    </button>

                    {/* E-Wallet */}
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('e-wallet')}
                      className={`flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-5 text-left transition-all ${
                        selectedMethod === 'e-wallet'
                          ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        selectedMethod === 'e-wallet' ? 'border-blue-600' : 'border-gray-300'
                      }`}>
                        {selectedMethod === 'e-wallet' && (
                          <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-semibold ${selectedMethod === 'e-wallet' ? 'text-blue-700' : 'text-gray-900'}`}>
                          E-Wallet
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">OVO, GoPay, Dana</p>
                      </div>
                      <span className={`flex-shrink-0 ${selectedMethod === 'e-wallet' ? 'text-blue-600' : 'text-gray-400'}`}>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN — Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <OrderSummary order={orderDetails} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ═══════════════════════════════════════════════════════════════════════
           STEP 4 — Thank You / Confirmation Page (Premium Redesign)
           ═══════════════════════════════════════════════════════════════════════ */
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <div className="space-y-6">
            {/* 1. Success Header with animated checkmark */}
            <div className="animate-[fadeIn_0.5s_ease-out] text-center">
              <div className="mx-auto mb-5 flex h-24 w-24 animate-[bounceIn_0.6s_ease-out] items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/30">
                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h1 className="font-heading text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                Pesanan Berhasil Dibuat! 🎉
              </h1>
              <p className="mt-3 text-sm text-gray-600 sm:text-base">
                Hore, perjalananmu ke <span className="font-semibold text-primary">{orderDetails.destination.name}</span> sudah menanti!
              </p>
            </div>

            {/* 2. Order Detail Card - Premium */}
            <div className="animate-[fadeIn_0.5s_ease-out_0.1s_both] overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg">
              {/* Destination Image */}
              {orderDetails.destination.image && (
                <div className="relative h-[140px] sm:h-[180px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={orderDetails.destination.image}
                    alt={orderDetails.destination.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-5">
                    <h3 className="text-lg font-bold text-white">{orderDetails.destination.name}</h3>
                    <p className="text-xs text-white/80">{orderDetails.destination.duration}</p>
                  </div>
                  {/* Status Badge */}
                  <div className="absolute right-4 top-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5" />
                      </svg>
                      Menunggu Pembayaran
                    </span>
                  </div>
                </div>
              )}

              {/* Detail Info */}
              <div className="p-5 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                      <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-[11px] text-gray-500">Tanggal Berangkat</p>
                      <p className="text-sm font-semibold text-gray-900">{orderDetails.dates.departure}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                      <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-[11px] text-gray-500">Peserta</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {orderDetails.guests.adults} Dewasa{orderDetails.guests.children > 0 && `, ${orderDetails.guests.children} Anak`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="mt-4 flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3">
                  <span className="text-sm font-medium text-gray-700">Total Pembayaran</span>
                  <span className="text-xl font-bold text-blue-600">{formatRupiah(orderDetails.pricing.total)}</span>
                </div>
              </div>
            </div>

            {/* 3. Payment Instructions — Accordion Style */}
            <div className="animate-[fadeIn_0.5s_ease-out_0.2s_both]">
              {selectedMethod === 'transfer-bank' && (
                <div className="space-y-3">
                  <h2 className="text-base font-bold text-gray-900">Instruksi Pembayaran — Transfer Bank</h2>
                  {bankAccounts.map((bank, idx) => (
                    <PaymentAccordion key={bank.name} title={bank.name} subtitle={`a.n. ${bank.accountName}`} defaultOpen={idx === 0}>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                          <div>
                            <p className="text-[11px] text-gray-500">Nomor Rekening</p>
                            <p className="text-lg font-bold text-gray-900">{bank.accountNumber}</p>
                          </div>
                          <CopyButton text={bank.accountNumber} label="Salin" />
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3">
                          <div>
                            <p className="text-[11px] text-gray-500">Nominal Transfer</p>
                            <p className="text-lg font-bold text-blue-600">{formatRupiah(orderDetails.pricing.total)}</p>
                          </div>
                          <CopyButton text={String(orderDetails.pricing.total)} label="Salin" />
                        </div>
                      </div>
                    </PaymentAccordion>
                  ))}
                </div>
              )}

              {selectedMethod === 'e-wallet' && (
                <div className="space-y-3">
                  <h2 className="text-base font-bold text-gray-900">Instruksi Pembayaran — E-Wallet</h2>
                  {eWallets.map((wallet, idx) => (
                    <PaymentAccordion key={wallet.name} title={wallet.name} subtitle={wallet.instruction} defaultOpen={idx === 0}>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                          <div>
                            <p className="text-[11px] text-gray-500">Nomor Tujuan</p>
                            <p className="text-lg font-bold text-gray-900">{wallet.number}</p>
                          </div>
                          <CopyButton text={wallet.number} label="Salin" />
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3">
                          <div>
                            <p className="text-[11px] text-gray-500">Nominal Transfer</p>
                            <p className="text-lg font-bold text-blue-600">{formatRupiah(orderDetails.pricing.total)}</p>
                          </div>
                          <CopyButton text={String(orderDetails.pricing.total)} label="Salin" />
                        </div>
                      </div>
                    </PaymentAccordion>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Deadline with progress bar */}
            <div className="animate-[fadeIn_0.5s_ease-out_0.3s_both] overflow-hidden rounded-2xl border border-orange-200 bg-orange-50">
              <div className="h-1 bg-orange-200">
                <div className="h-full w-[75%] bg-gradient-to-r from-orange-400 to-orange-500 transition-all" />
              </div>
              <div className="flex items-center gap-3 px-5 py-4">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
                  <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-orange-800">Batas Waktu Pembayaran</p>
                  <p className="text-xs text-orange-600">Selesaikan pembayaran dalam 24 jam untuk mengamankan pesananmu</p>
                </div>
              </div>
            </div>

            {/* 5. E-ticket Info */}
            <div className="animate-[fadeIn_0.5s_ease-out_0.4s_both] rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                    </svg>
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-blue-700">
                  Setelah pembayaran berhasil, <strong>e-ticket</strong> akan dikirim ke <strong>email</strong> dan <strong>WhatsApp</strong> kamu.
                </p>
              </div>
            </div>

            {/* 6. Action Buttons */}
            <div className="animate-[fadeIn_0.5s_ease-out_0.5s_both] flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Kembali ke Beranda
              </Link>
              <Link
                href="/akun"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700 hover:shadow-xl"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cek Status Pembayaran
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ─── BOTTOM STICKY BAR (only in Step 3) ────────────────────────────── */}
      {!paymentInitiated && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
            {/* Mobile layout */}
            <div className="flex items-center justify-between gap-2 lg:hidden">
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Total Pembayaran</p>
                <p className="text-lg font-bold text-blue-600">{formatRupiah(orderDetails.pricing.total)}</p>
              </div>
              <button
                type="button"
                disabled={!selectedMethod || savingOrder}
                onClick={handlePayNow}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 min-h-[52px] text-sm font-bold text-white shadow-md shadow-blue-600/30 transition-all hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                {savingOrder ? 'Memproses...' : 'Bayar Sekarang'}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>

            {/* Desktop layout */}
            <div className="hidden lg:flex items-center justify-between gap-4">
              {/* Left: Total */}
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Total Pembayaran</p>
                <p className="text-lg font-bold text-blue-600 sm:text-xl">{formatRupiah(orderDetails.pricing.total)}</p>
              </div>

              {/* Center: Trust badges (desktop only) */}
              <div className="flex flex-1 items-center justify-center gap-4">
                <div className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span className="text-xs text-gray-600">Keamanan Terjamin</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                  <span className="text-xs text-gray-600">Pembayaran 100% Aman</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                  <span className="text-xs text-gray-600">Layanan 24/7</span>
                </div>
              </div>

              {/* Right: Buttons */}
              <div className="flex items-center gap-3">
                <Link
                  href="/booking/2"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  Kembali
                </Link>
                <button
                  type="button"
                  disabled={!selectedMethod || savingOrder}
                  onClick={handlePayNow}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/30 transition-all hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:px-8"
                >
                  {savingOrder ? 'Memproses...' : 'Bayar Sekarang'}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
