import React from 'react';
import Link from 'next/link';

// =============================================================================
// Section A: Why Choose Us
// =============================================================================

function WhyChooseUs() {
  const features = [
    {
      id: 'harga',
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
        </svg>
      ),
      title: 'Harga Transparan',
      description: 'Tanpa biaya tersembunyi. Harga yang Anda lihat adalah harga yang Anda bayar.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'jaminan',
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
      ),
      title: 'Perjalanan Terjamin',
      description: 'Refund penuh jika perjalanan dibatalkan oleh kami. Uang Anda aman.',
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 'lokal',
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      ),
      title: 'Pengalaman Lokal',
      description: 'Dikurasi oleh ahli lokal yang mengenal Indonesia dengan baik.',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="container-app">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-bold text-gray-900">
            Kenapa Memilih Octaf Kreasi?
          </h2>
          <p className="mt-3 text-gray-500">
            Kami berkomitmen memberikan pengalaman perjalanan terbaik untuk Anda
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group rounded-2xl border border-gray-100 bg-white p-8 text-center transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
            >
              <span className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${feature.color}`}>
                {feature.icon}
              </span>
              <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Section B: Flash Sale Promo
// =============================================================================

function FlashSaleBanner() {
  return (
    <section className="py-14">
      <div className="container-app">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-700 via-primary to-blue-800 p-8 sm:p-12">
          {/* Decorative elements */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-8 lg:flex-row">
            {/* Left content */}
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
                ✨ Liburan Impianmu Dimulai di Sini
              </span>
              <h3 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                500+ Destinasi Terbaik Indonesia
              </h3>
              <p className="mt-2 text-lg text-white/80">
                Dari Raja Ampat sampai Labuan Bajo, semua bisa kamu jelajahi bersama Octaf Kreasi
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-sm text-white/90">Harga terbaik dijamin</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-sm text-white/90">Pembatalan gratis</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-sm text-white/90">Support 24/7</span>
                </div>
              </div>
            </div>

            {/* Right CTA */}
            <div className="shrink-0">
              <Link
                href="/destinasi"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-primary shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                Jelajahi Destinasi<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Section C: Testimonials
// =============================================================================

function Testimonials() {
  const testimonials = [
    {
      id: 'test-1',
      content: 'Pengalaman terbaik! Raja Ampat benar-benar surga dunia. Pelayanan dari awal sampai akhir sangat memuaskan.',
      author: 'Andi P.',
      city: 'Jakarta',
      rating: 5,
    },
    {
      id: 'test-2',
      content: 'Booking mudah, harga terjangkau, pelayanan luar biasa. Tidak perlu ribet urus ini itu, semua sudah dihandle.',
      author: 'Sari W.',
      city: 'Surabaya',
      rating: 5,
    },
    {
      id: 'test-3',
      content: 'Liburan keluarga yang sempurna berkat Octaf Kreasi. Anak-anak senang, orang tua tenang. Pasti repeat order!',
      author: 'Budi S.',
      city: 'Bandung',
      rating: 5,
    },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="container-app">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-bold text-gray-900">
            Apa Kata Mereka?
          </h2>
          <p className="mt-3 text-gray-500">
            Ribuan traveler telah mempercayakan perjalanan mereka kepada kami
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-2xl border-l-4 border-l-primary bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              {/* Quote icon */}
              <svg className="mb-3 h-8 w-8 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10H0z" />
              </svg>

              {/* Content */}
              <p className="text-sm leading-relaxed text-gray-600">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-xs text-gray-500">{testimonial.city}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Section D: CTA Banner
// =============================================================================

function CTABanner() {
  return (
    <section className="py-16">
      <div className="container-app">
        <div className="rounded-3xl bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 px-8 py-16 text-center">
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            Siap Memulai Petualanganmu?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Ribuan destinasi menanti. Pesan sekarang dan dapatkan harga terbaik.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/destinasi"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-primary shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              Jelajahi Destinasi
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/kontak"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all hover:border-white hover:bg-white/10"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Main PromoBanner Export — Combines all sections
// =============================================================================

export function PromoBanner() {
  return (
    <>
      <WhyChooseUs />
      <FlashSaleBanner />
      <Testimonials />
      <CTABanner />
    </>
  );
}
