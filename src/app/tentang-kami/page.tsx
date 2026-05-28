import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Tentang Kami - Octafkreasi | Jasa Tour Travel Terpercaya di Indonesia',
  description:
    'Octafkreasi adalah jasa tour travel terpercaya di Indonesia yang menyediakan paket wisata terbaik ke berbagai destinasi. Kenali lebih dekat tim dan layanan kami.',
  keywords: ['jasa tour travel terpercaya', 'jasa tour travel Indonesia', 'tentang octafkreasi', 'tour travel Indonesia'],
};

const keunggulan = [
  {
    icon: '💰',
    title: 'Harga Transparan',
    description: 'Sebagai jasa tour travel terpercaya, kami menjamin harga yang Anda lihat adalah harga final tanpa biaya tersembunyi.',
  },
  {
    icon: '🛡️',
    title: 'Perjalanan Terjamin',
    description: 'Setiap paket wisata dilindungi garansi. Refund penuh jika perjalanan dibatalkan oleh kami.',
  },
  {
    icon: '🌏',
    title: 'Pengalaman Lokal',
    description: 'Tim kami terdiri dari ahli perjalanan lokal yang mengenal setiap destinasi di Indonesia dengan baik.',
  },
  {
    icon: '📞',
    title: 'Support 24/7',
    description: 'Customer service kami siap membantu kapan saja, sebelum, selama, dan setelah perjalanan Anda.',
  },
];

const stats = [
  { value: '500+', label: 'Destinasi Wisata' },
  { value: '100K+', label: 'Traveler Puas' },
  { value: '4.9/5', label: 'Rating Pengguna' },
  { value: '5+', label: 'Tahun Pengalaman' },
];

const team = [
  { name: 'Ahmad Fauzi', role: 'CEO & Founder', initial: 'AF' },
  { name: 'Sari Dewi', role: 'Head of Operations', initial: 'SD' },
  { name: 'Budi Hartono', role: 'Head of Marketing', initial: 'BH' },
  { name: 'Rina Kusuma', role: 'Customer Experience Lead', initial: 'RK' },
];

export default function TentangKamiPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 via-white to-blue-50 py-16 md:py-24">
          <div className="container-app text-center">
            <h1 className="font-heading text-3xl font-bold text-gray-900 md:text-5xl">
              Jasa Tour Travel Terpercaya di Indonesia
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-gray-600 md:text-lg">
              Octafkreasi adalah <strong>jasa tour travel terpercaya</strong> yang telah melayani ribuan traveler Indonesia
              sejak 2019. Kami berkomitmen menghadirkan pengalaman perjalanan wisata terbaik dengan harga terjangkau
              ke berbagai destinasi menakjubkan di seluruh Indonesia, mulai dari Raja Ampat, Bali, Labuan Bajo,
              hingga destinasi tersembunyi yang belum banyak diketahui.
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-gray-600 md:text-lg">
              Sebagai <strong>jasa tour travel Indonesia</strong> yang berpengalaman, kami memahami bahwa setiap
              perjalanan adalah cerita unik. Itulah mengapa kami merancang setiap paket wisata dengan penuh perhatian,
              memastikan setiap detail — dari akomodasi, transportasi, hingga aktivitas — memberikan pengalaman
              yang tak terlupakan bagi Anda dan keluarga.
            </p>
          </div>
        </section>

        {/* Mengapa Memilih Kami */}
        <section className="py-16">
          <div className="container-app">
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold text-gray-900 md:text-3xl">
                Mengapa Memilih Octafkreasi?
              </h2>
              <p className="mt-3 text-gray-600">
                Keunggulan kami sebagai jasa tour travel terpercaya di Indonesia
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {keunggulan.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all hover:shadow-md"
                >
                  <span className="text-4xl">{item.icon}</span>
                  <h3 className="mt-4 text-base font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visi & Misi */}
        <section className="bg-gray-50 py-16">
          <div className="container-app">
            <div className="mx-auto max-w-4xl">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-8 shadow-sm">
                  <h2 className="font-heading text-xl font-bold text-primary">Visi Kami</h2>
                  <p className="mt-4 text-sm leading-relaxed text-gray-600">
                    Menjadi jasa tour travel Indonesia nomor satu yang menghubungkan setiap orang dengan
                    keindahan alam dan budaya Nusantara, serta menjadikan perjalanan wisata yang berkualitas
                    dapat diakses oleh semua kalangan.
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-8 shadow-sm">
                  <h2 className="font-heading text-xl font-bold text-primary">Misi Kami</h2>
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-primary">•</span>
                      Menyediakan paket wisata berkualitas dengan harga terjangkau
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-primary">•</span>
                      Mengutamakan keamanan dan kenyamanan setiap traveler
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-primary">•</span>
                      Mendukung pariwisata berkelanjutan dan ekonomi lokal
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-primary">•</span>
                      Memberikan pelayanan terbaik dengan customer support 24/7
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pencapaian */}
        <section className="py-16">
          <div className="container-app">
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold text-gray-900 md:text-3xl">
                Pencapaian Kami
              </h2>
              <p className="mt-3 text-gray-600">
                Angka-angka yang membuktikan kepercayaan traveler Indonesia
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-primary md:text-4xl">{stat.value}</p>
                  <p className="mt-2 text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tim Kami */}
        <section className="bg-gray-50 py-16">
          <div className="container-app">
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold text-gray-900 md:text-3xl">
                Tim Kami
              </h2>
              <p className="mt-3 text-gray-600">
                Orang-orang di balik jasa tour travel terpercaya Octafkreasi
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
              {team.map((member) => (
                <div key={member.name} className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-700 text-2xl font-bold text-white shadow-lg md:h-24 md:w-24">
                    {member.initial}
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-gray-900">{member.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container-app">
            <div className="rounded-3xl bg-gradient-to-br from-primary-700 via-primary to-primary-800 px-8 py-14 text-center md:px-16">
              <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
                Siap Memulai Petualangan Bersama Kami?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-white/80">
                Percayakan perjalanan wisata Anda kepada Octafkreasi — jasa tour travel Indonesia yang
                mengutamakan kualitas, keamanan, dan kepuasan Anda. Pesan paket wisata sekarang!
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-primary shadow-lg transition-all hover:scale-105"
                >
                  Pesan Paket Wisata
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
      </main>

      <Footer />
    </div>
  );
}
