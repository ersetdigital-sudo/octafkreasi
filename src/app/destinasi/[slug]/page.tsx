import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DestinationHero } from '@/components/sections/DestinationHero';
import { AboutDestination } from '@/components/sections/AboutDestination';
import { RecommendedActivities } from '@/components/sections/RecommendedActivities';
import { PopularPackages } from '@/components/sections/PopularPackages';
import { PackageIncludes } from '@/components/sections/PackageIncludes';
import { PremiumCTA } from '@/components/sections/PremiumCTA';
import { Reviews } from '@/components/sections/Reviews';
import { BookingCard } from '@/components/sections/BookingCard';
import { StickyBottomBar } from '@/components/sections/StickyBottomBar';
import { getDestinationBySlug, getAllDestinationSlugs } from '@/data/destinations';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface DestinationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Fetch all active destination slugs from database
  const { data } = await supabase
    .from('destinations')
    .select('slug')
    .eq('is_active', true);

  const dbSlugs = (data || []).map((d: { slug: string }) => ({ slug: d.slug }));

  // Merge with hardcoded slugs as fallback
  const hardcodedSlugs = getAllDestinationSlugs().map((slug) => ({ slug }));
  const allSlugs = [...dbSlugs];
  hardcodedSlugs.forEach((h) => {
    if (!allSlugs.find((s) => s.slug === h.slug)) allSlugs.push(h);
  });

  return allSlugs;
}

export const dynamicParams = true; // Allow new slugs not in generateStaticParams
export const revalidate = 60;

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { slug } = await params;

  // Fetch from Supabase
  const { data: dbDest } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  // Fallback to hardcoded data
  const hardcodedDest = getDestinationBySlug(slug);

  if (!dbDest && !hardcodedDest) {
    notFound();
  }

  // Fetch activities and reviews from Supabase
  const destId = dbDest?.id;
  let dbHighlights: { id: string; name: string; description: string; image: string }[] = [];
  let dbActivities: { id: string; name: string; description: string; image: string; price: number; duration: string; rating: number; destinationSlug: string }[] = [];
  let dbReviews: { id: string; author: string; content: string; rating: number; date: string; helpful: number; destinationSlug: string }[] = [];

  if (destId) {
    const [highlightsRes, activitiesRes, reviewsRes] = await Promise.all([
      supabase.from('activities').select('*').eq('destination_id', destId).eq('type', 'highlight').eq('is_active', true).order('sort_order'),
      supabase.from('activities').select('*').eq('destination_id', destId).eq('type', 'activity').eq('is_active', true).order('sort_order'),
      supabase.from('reviews').select('*').eq('destination_id', destId).eq('status', 'approved').order('created_at', { ascending: false }),
    ]);

    if (highlightsRes.data && highlightsRes.data.length > 0) {
      dbHighlights = highlightsRes.data.map((h) => ({
        id: h.id, name: h.name, description: h.description || '', image: h.image || '',
      }));
    }
    if (activitiesRes.data && activitiesRes.data.length > 0) {
      dbActivities = activitiesRes.data.map((a) => ({
        id: a.id, name: a.name, description: a.description || '', image: a.image || '',
        price: a.price || 0, duration: a.duration || '', rating: a.rating || 4.5, destinationSlug: slug,
      }));
    }
    if (reviewsRes.data && reviewsRes.data.length > 0) {
      dbReviews = reviewsRes.data.map((r) => ({
        id: r.id, author: r.author, content: r.content, rating: r.rating,
        date: r.date || r.created_at, helpful: r.helpful || 0, destinationSlug: slug,
      }));
    }
  }

  // Merge: DB data takes priority, hardcoded as fallback
  const destination = {
    ...hardcodedDest,
    name: dbDest?.name || hardcodedDest?.name || '',
    slug: dbDest?.slug || hardcodedDest?.slug || slug,
    country: dbDest?.country || hardcodedDest?.country || '',
    description: dbDest?.description || hardcodedDest?.description || '',
    image: dbDest?.image || hardcodedDest?.image || '',
    imageAlt: dbDest?.image_alt || hardcodedDest?.imageAlt || '',
    rating: dbReviews.length > 0
      ? dbReviews.reduce((sum, r) => sum + r.rating, 0) / dbReviews.length
      : (dbDest?.rating && dbDest?.review_count > 0 ? dbDest.rating : (hardcodedDest?.reviewCount ? hardcodedDest?.rating || 0 : 0)),
    reviewCount: dbReviews.length > 0 ? dbReviews.length : (dbDest?.review_count || hardcodedDest?.reviewCount || 0),
    priceStartFrom: dbDest?.price_start_from || hardcodedDest?.priceStartFrom || 0,
    duration: dbDest?.duration || hardcodedDest?.duration || '3 Hari 2 Malam',
    gallery: dbDest?.images && dbDest.images.length > 1
      ? dbDest.images.map((img: string, idx: number) => ({ id: `img-${idx}`, src: img, alt: `${dbDest.name} ${idx + 1}` }))
      : hardcodedDest?.gallery || [],
    highlights: dbHighlights.length > 0 ? dbHighlights : (hardcodedDest?.highlights || []),
    activities: dbActivities.length > 0 ? dbActivities : (hardcodedDest?.activities || []),
    reviews: dbReviews.length > 0 ? dbReviews : (hardcodedDest?.reviews || []),
    tagChips: hardcodedDest?.tagChips || [],
    badges: hardcodedDest?.badges || [],
    included: dbDest?.included || [],
    excluded: dbDest?.excluded || [],
    schedule: dbDest?.schedule || [],
  };

  if (!destination.name) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: destination.name,
    description: destination.description,
    url: `https://www.octafkreasi.com/destinasi/${destination.slug}`,
    image: destination.image,
    touristType: 'Adventure travelers',
    geo: { '@type': 'GeoCoordinates', addressCountry: 'ID' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: destination.rating,
      reviewCount: destination.reviewCount,
      bestRating: 5,
    },
    containedInPlace: { '@type': 'Country', name: 'Indonesia' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      {/* Breadcrumb */}
      <nav className="container-app py-3" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-xs text-gray-500 sm:text-sm">
          <li><Link href="/" className="transition-colors hover:text-primary">Beranda</Link></li>
          <li aria-hidden="true"><svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg></li>
          <li><Link href="/destinasi" className="transition-colors hover:text-primary">Destinasi</Link></li>
          <li aria-hidden="true"><svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg></li>
          <li><span className="font-medium text-gray-800">{destination.name}</span></li>
        </ol>
      </nav>

      {/* Gallery Hero */}
      <DestinationHero destination={destination as never} />

      {/* Main Content */}
      <div className="container-app pb-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left Column */}
          <div className="lg:col-span-3">
            <AboutDestination
              description={destination.description}
              destinationName={destination.name}
            />

            {destination.highlights.length > 0 && (
              <RecommendedActivities highlights={destination.highlights} />
            )}

            {/* Paket Sudah/Belum Termasuk - from DB */}
            {(destination.included.length > 0 || destination.excluded.length > 0) ? (
              <PackageIncludesDB included={destination.included} excluded={destination.excluded} />
            ) : (
              <PackageIncludes />
            )}

            {/* Jadwal Tour */}
            {destination.schedule && destination.schedule.length > 0 && (
              <section className="mt-6">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900 sm:text-lg">Jadwal Tour</h3>
                  <div className="mt-4 space-y-2.5">
                    {destination.schedule.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 mt-0.5">
                          <svg className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {destination.activities.length > 0 && (
              <PopularPackages
                activities={destination.activities}
                destinationName={destination.name}
                destinationSlug={destination.slug}
              />
            )}

            {destination.reviews.length > 0 && (
              <Reviews
                reviews={destination.reviews}
                rating={destination.rating}
                reviewCount={destination.reviewCount}
              />
            )}

            <PremiumCTA destinationName={destination.name} />
          </div>

          {/* Right Column */}
          <div className="hidden lg:col-span-2 lg:block">
            <BookingCard
              price={destination.priceStartFrom}
              destinationSlug={destination.slug}
              destinationName={destination.name}
              rating={destination.rating}
              reviewCount={destination.reviewCount}
              duration={destination.duration}
              reviews={destination.reviews}
            />
          </div>
        </div>

        <div className="mt-8 lg:hidden">
          <BookingCard
            price={destination.priceStartFrom}
            destinationSlug={destination.slug}
            destinationName={destination.name}
            rating={destination.rating}
            reviewCount={destination.reviewCount}
            duration={destination.duration}
            reviews={destination.reviews}
          />
        </div>
      </div>

      <StickyBottomBar
        name={`${destination.name}, Indonesia`}
        duration={destination.duration}
        rating={destination.rating}
        reviewCount={destination.reviewCount}
        price={destination.priceStartFrom}
        destinationSlug={destination.slug}
        image={destination.image}
      />

      <Footer />
    </div>
  );
}

// Dynamic PackageIncludes from database
function PackageIncludesDB({ included, excluded }: { included: string[]; excluded: string[] }) {
  return (
    <section className="mt-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {included.length > 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 sm:text-lg">Paket Sudah Termasuk</h3>
            <ul className="mt-4 space-y-3">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {excluded.length > 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 sm:text-lg">Paket Belum Termasuk</h3>
            <ul className="mt-4 space-y-3">
              {excluded.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
