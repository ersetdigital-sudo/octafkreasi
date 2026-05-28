import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Reviews } from '@/components/sections/Reviews';
import { AboutDestination } from '@/components/sections/AboutDestination';
import { RecommendedActivities } from '@/components/sections/RecommendedActivities';
import { PopularPackages } from '@/components/sections/PopularPackages';
import { BookingCard } from '@/components/sections/BookingCard';
import { getDestinationBySlug, getAllDestinationSlugs } from '@/data/destinations';
import { formatRupiah } from '@/lib/format';

interface PackagePageProps {
  params: Promise<{ slug: string; id: string }>;
}

const includedItems = [
  'Hotel 3 Hari 2 Malam (Twin Sharing)',
  'Sarapan di Hotel',
  'Transportasi selama perjalanan',
  'Tiket masuk objek wisata sesuai itinerary',
  'Tour Guide berpengalaman',
  'Dokumentasi selama perjalanan',
  'Air mineral selama perjalanan',
  'Penjemputan di Bandara / Pelabuhan',
];

const excludedItems = [
  'Tiket pesawat PP',
  'Makan siang & malam',
  'Pengeluaran pribadi',
  'Aktivitas tambahan di luar itinerary',
  'Upgrade hotel (jika ada)',
  'Tips guide & driver (optional)',
];

interface PackageData {
  title: string;
  badge: string;
  badgeColor: string;
  rating: number;
  reviews: string;
  duration: string;
  groupSize: string;
  type: string;
  price: number;
}

function getPackageData(destinationName: string, packageId: number, basePrice: number): PackageData | null {
  const packages: PackageData[] = [
    {
      title: `${destinationName} 4 Hari 3 Malam`,
      badge: 'Best Seller',
      badgeColor: 'bg-red-500',
      rating: 4.9,
      reviews: '2.1K',
      duration: '4 Hari 3 Malam',
      groupSize: '2-15 orang',
      type: 'Private & Group Tour',
      price: basePrice * 5,
    },
    {
      title: `${destinationName} Highlights 3 Hari`,
      badge: 'Populer',
      badgeColor: 'bg-orange-500',
      rating: 4.8,
      reviews: '1.5K',
      duration: '3 Hari 2 Malam',
      groupSize: '2-10 orang',
      type: 'Group Tour',
      price: basePrice * 4,
    },
    {
      title: `${destinationName} Adventure 5 Hari`,
      badge: 'Populer',
      badgeColor: 'bg-orange-500',
      rating: 4.7,
      reviews: '980',
      duration: '5 Hari 4 Malam',
      groupSize: '4-12 orang',
      type: 'Adventure Tour',
      price: basePrice * 6,
    },
  ];

  if (packageId < 1 || packageId > packages.length) return null;
  return packages[packageId - 1];
}

export function generateStaticParams() {
  const slugs = getAllDestinationSlugs();
  const params: { slug: string; id: string }[] = [];
  for (const slug of slugs) {
    for (let i = 1; i <= 3; i++) {
      params.push({ slug, id: String(i) });
    }
  }
  return params;
}

export default async function PackageDetailPage({ params }: PackagePageProps) {
  const { slug, id } = await params;
  const destination = getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  const packageId = parseInt(id, 10);
  const basePrice = destination.activities[0]?.price || 500000;
  const pkg = getPackageData(destination.name, packageId, basePrice);

  if (!pkg) {
    notFound();
  }

  const galleryImages = destination.gallery.slice(0, 4);
  const sideImages = galleryImages.slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pkg.title,
    description: `Paket tour ${pkg.title} - ${pkg.duration}, ${pkg.type}. Jelajahi ${destination.name} bersama octafkreasi.`,
    image: destination.image,
    url: `https://octafkreasi.com/destinasi/${destination.slug}/paket/${id}`,
    brand: {
      '@type': 'Organization',
      name: 'octafkreasi',
    },
    offers: {
      '@type': 'Offer',
      price: pkg.price,
      priceCurrency: 'IDR',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'octafkreasi',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: pkg.rating,
      reviewCount: parseInt(pkg.reviews.replace(/[^0-9]/g, '')) * (pkg.reviews.includes('K') ? 1000 : 1),
      bestRating: 5,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <nav className="container-app py-3" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500 sm:text-sm">
          <li>
            <Link href="/" className="transition-colors hover:text-primary">Beranda</Link>
          </li>
          <BreadcrumbSeparator />
          <li>
            <Link href="/destinasi" className="transition-colors hover:text-primary">Destinasi</Link>
          </li>
          <BreadcrumbSeparator />
          <li>
            <Link href={`/destinasi/${destination.slug}`} className="transition-colors hover:text-primary">
              {destination.name}
            </Link>
          </li>
          <BreadcrumbSeparator />
          <li>
            <span className="text-gray-400">Paket Tour</span>
          </li>
          <BreadcrumbSeparator />
          <li>
            <span className="font-medium text-gray-800">{pkg.title}</span>
          </li>
        </ol>
      </nav>

      {/* Gallery Hero */}
      <section className="container-app py-4 sm:py-6">
        <div className="grid h-[280px] grid-cols-1 gap-2 sm:h-[360px] md:h-[420px] lg:h-[480px] lg:grid-cols-3 lg:gap-3">
          {/* Main large image */}
          <div className="relative col-span-1 overflow-hidden rounded-2xl lg:col-span-2 lg:rounded-3xl">
            <Image
              src={destination.image}
              alt={destination.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 65vw"
              className="object-cover"
              priority
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Package badge */}
            <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
              <span className={`inline-flex items-center gap-1 rounded-full ${pkg.badgeColor} px-3 py-1 text-xs font-bold text-white shadow-lg`}>
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                </svg>
                {pkg.badge}
              </span>
            </div>

            {/* Bottom content overlay - package title */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
              <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {pkg.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 sm:mt-3 sm:gap-4">
                <span className="flex items-center gap-1 text-xs text-white/90 sm:text-sm">
                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path fillRule="evenodd" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" clipRule="evenodd" />
                  </svg>
                  {destination.name}, Indonesia
                </span>
                <span className="flex items-center gap-1 text-xs text-white/90 sm:text-sm">
                  <svg className="h-3.5 w-3.5 text-yellow-400 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                  </svg>
                  {pkg.rating} ({pkg.reviews} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Right: 3 stacked images (desktop only) */}
          <div className="hidden grid-rows-3 gap-2 lg:grid lg:gap-3">
            {sideImages.map((img, index) => (
              <div key={img.id} className="relative overflow-hidden rounded-2xl lg:rounded-3xl">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="35vw"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="container-app py-4 sm:py-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
          <QuickInfoCard icon="clock" label="Durasi" value={pkg.duration} />
          <QuickInfoCard icon="users" label="Group Size" value={pkg.groupSize} />
          <QuickInfoCard icon="tag" label="Tipe" value={pkg.type} />
          <QuickInfoCard icon="star" label="Rating" value={`${pkg.rating} (${pkg.reviews})`} />
          <QuickInfoCard icon="check" label="Konfirmasi" value="Instan" />
        </div>
      </section>

      {/* Main Content */}
      <div className="container-app pb-24 lg:pb-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left Column */}
          <div className="lg:col-span-3">
            {/* Tentang Destinasi */}
            <div className="mt-6">
              <AboutDestination
                description={destination.description}
                tagChips={destination.tagChips}
                destinationName={destination.name}
              />
            </div>

            {/* Rekomendasi Aktivitas */}
            <RecommendedActivities highlights={destination.highlights} />

            {/* Fasilitas */}
            <FasilitasSection />

            {/* Paket Tour Populer */}
            <PopularPackages
              activities={destination.activities}
              destinationName={destination.name}
              destinationSlug={destination.slug}
            />

            {/* Reviews */}
            <Reviews
              reviews={destination.reviews}
              rating={destination.rating}
              reviewCount={destination.reviewCount}
            />
          </div>

          {/* Right Column - Sidebar (desktop) */}
          <div className="hidden lg:col-span-2 lg:block">
            <BookingCard
              price={pkg.price}
              destinationSlug={destination.slug}
              destinationName={destination.name}
              rating={pkg.rating}
              reviewCount={destination.reviewCount}
              duration={pkg.duration}
              reviews={destination.reviews}
            />
          </div>
        </div>

        {/* Mobile Sidebar (below content) */}
        <div className="mt-8 lg:hidden">
          <BookingCard
            price={pkg.price}
            destinationSlug={destination.slug}
            destinationName={destination.name}
            rating={pkg.rating}
            reviewCount={destination.reviewCount}
            duration={pkg.duration}
            reviews={destination.reviews}
          />
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <MobileStickyBar price={pkg.price} destinationSlug={destination.slug} />

      <Footer />
    </div>
  );
}

function BreadcrumbSeparator() {
  return (
    <li aria-hidden="true">
      <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </li>
  );
}

function QuickInfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md sm:rounded-3xl sm:p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
        <QuickInfoIcon type={icon} />
      </div>
      <span className="text-[11px] font-medium text-gray-500 sm:text-xs">{label}</span>
      <span className="text-xs font-semibold text-gray-900 sm:text-sm">{value}</span>
    </div>
  );
}

function QuickInfoIcon({ type }: { type: string }) {
  const cls = "h-5 w-5 text-primary";
  switch (type) {
    case 'clock':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      );
    case 'users':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
      );
    case 'tag':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
        </svg>
      );
    case 'star':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      );
    case 'check':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      );
    default:
      return null;
  }
}

function FasilitasSection() {
  return (
    <section className="mt-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Paket Sudah Termasuk */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 sm:text-lg">Paket Sudah Termasuk</h3>
          <ul className="mt-4 space-y-3">
            {includedItems.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Paket Belum Termasuk */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 sm:text-lg">Paket Belum Termasuk</h3>
          <ul className="mt-4 space-y-3">
            {excludedItems.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function MobileStickyBar({ price, destinationSlug }: { price: number; destinationSlug: string }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-gray-500">Mulai dari</span>
          <p className="text-sm font-bold text-gray-900">{formatRupiah(price)}<span className="text-xs font-normal text-gray-500"> /orang</span></p>
        </div>
        <Link
          href={`/booking/peserta?dest=${destinationSlug}`}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
        >
          Pesan
        </Link>
      </div>
    </div>
  );
}
