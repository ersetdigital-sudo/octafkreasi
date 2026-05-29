'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const faqItems = [
  {
    question: 'Bagaimana cara memesan paket wisata?',
    answer:
      'Untuk memesan paket wisata, pilih destinasi yang Anda inginkan, tentukan tanggal keberangkatan dan jumlah peserta, lalu klik "Pesan Sekarang". Isi data diri Anda, pilih metode pembayaran, dan lakukan pembayaran. Setelah pembayaran dikonfirmasi, Anda akan menerima e-voucher melalui email.',
  },
  {
    question: 'Apa saja metode pembayaran yang tersedia?',
    answer:
      'Kami menyediakan berbagai metode pembayaran untuk kemudahan Anda, termasuk transfer bank (BCA, Mandiri, BNI, BRI), e-wallet (GoPay, OVO, DANA, ShopeePay), kartu kredit/debit (Visa, Mastercard), dan PayLater (Kredivo, Akulaku).',
  },
  {
    question: 'Apakah bisa membatalkan pesanan?',
    answer:
      'Ya, Anda dapat membatalkan pesanan secara gratis hingga 7 hari sebelum tanggal keberangkatan. Pembatalan dapat dilakukan melalui halaman "Pesanan Saya" atau dengan menghubungi customer service kami.',
  },
  {
    question: 'Bagaimana kebijakan refund?',
    answer:
      'Kebijakan refund kami: pembatalan 7 hari atau lebih sebelum keberangkatan mendapat refund 100%, pembatalan 3-7 hari sebelum keberangkatan mendapat refund 50%, dan pembatalan kurang dari 3 hari sebelum keberangkatan tidak mendapat refund. Untuk kondisi force majeure, refund penuh atau reschedule gratis.',
  },
  {
    question: 'Apakah harga sudah termasuk tiket pesawat?',
    answer:
      'Tergantung pada paket yang Anda pilih. Beberapa paket sudah termasuk tiket pesawat (ditandai dengan label "Include Flight"), sementara paket lainnya hanya mencakup akomodasi dan aktivitas. Detail lengkap selalu tercantum di halaman paket masing-masing.',
  },
  {
    question: 'Berapa minimal peserta untuk memesan?',
    answer:
      'Minimal pemesanan adalah 1 orang. Namun, beberapa paket group tour memiliki kuota minimum yang harus terpenuhi. Untuk private tour, Anda bisa memesan mulai dari 1 orang dengan harga yang disesuaikan.',
  },
  {
    question: 'Apakah ada asuransi perjalanan?',
    answer:
      'Ya, kami menyediakan asuransi perjalanan sebagai opsi tambahan saat proses pemesanan. Asuransi mencakup perlindungan kesehatan, kecelakaan, kehilangan bagasi, dan pembatalan perjalanan. Premi mulai dari Rp 50.000 per orang per trip.',
  },
  {
    question: 'Bagaimana jika terjadi perubahan jadwal?',
    answer:
      'Perubahan jadwal dapat dilakukan hingga 3 hari sebelum tanggal keberangkatan tanpa biaya tambahan (tergantung ketersediaan). Perubahan dapat dilakukan melalui halaman "Pesanan Saya" atau menghubungi customer service kami.',
  },
  {
    question: 'Apakah tersedia paket untuk keluarga?',
    answer:
      'Ya, kami menyediakan paket family yang dirancang khusus untuk keluarga dengan harga spesial. Paket ini mencakup aktivitas ramah anak, akomodasi family room, dan itinerary yang disesuaikan untuk semua usia.',
  },
  {
    question: 'Bagaimana cara menghubungi customer service?',
    answer:
      'Anda dapat menghubungi customer service kami melalui WhatsApp di +62 812-3456-7890 (tersedia 24/7), email di hello@octafkreasi.id, atau melalui form kontak di halaman Hubungi Kami. Tim kami siap membantu Anda kapan saja.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-12 md:py-16">
        <div className="container-app">
          {/* Page Header */}
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Pertanyaan yang Sering Ditanya
            </h1>
            <p className="mt-4 text-gray-600">
              Temukan jawaban untuk pertanyaan umum seputar pemesanan paket wisata di Octaf Kreasi
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="mx-auto mt-10 max-w-3xl space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-card"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                  onClick={() => toggleItem(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="pr-4 text-sm font-semibold text-gray-900 md:text-base">
                    {item.question}
                  </span>
                  <svg
                    className={`h-5 w-5 flex-shrink-0 text-gray-500 transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  className={`overflow-hidden transition-all duration-200 ${
                    openIndex === index ? 'max-h-96 pb-5' : 'max-h-0'
                  }`}
                >
                  <p className="px-6 text-sm leading-relaxed text-gray-600">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mx-auto mt-12 max-w-3xl text-center">
            <p className="text-gray-600">
              Masih punya pertanyaan?{' '}
              <a href="/kontak" className="font-semibold text-primary hover:underline">
                Hubungi kami
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
