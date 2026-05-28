'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/data/blog';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface BlogArticleClientProps {
  post: BlogPost;
  headings: Heading[];
  relatedPosts: BlogPost[];
}

export function BlogArticleClient({ post, headings, relatedPosts }: BlogArticleClientProps) {
  const [progress, setProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState('');

  // Progress bar
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    setProgress(Math.min(scrollPercent, 100));
  }, []);

  // Active heading tracking
  const handleHeadingTracking = useCallback(() => {
    const headingElements = headings.map((h) => document.getElementById(h.id));
    let current = '';
    for (let i = headingElements.length - 1; i >= 0; i--) {
      const el = headingElements[i];
      if (el && el.getBoundingClientRect().top <= 120) {
        current = headings[i].id;
        break;
      }
    }
    if (current) setActiveHeading(current);
  }, [headings]);

  useEffect(() => {
    const onScroll = () => {
      handleScroll();
      handleHeadingTracking();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [handleScroll, handleHeadingTracking]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post.title;
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        return;
    }
    if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // Parse content into blocks
  const contentBlocks = post.content.split('\n\n');
  let headingIndex = -1;

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed left-0 right-0 top-0 z-[60] h-1 bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary-700 transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content Area */}
      <main className="container-app pb-16 pt-10">
        <div className="mx-auto flex max-w-[1100px] gap-10">
          {/* Article Content */}
          <article className="min-w-0 flex-1">
            <div className="mx-auto max-w-[720px] px-4 md:px-0">
              {/* Breadcrumb */}
              <nav className="mb-6" aria-label="Breadcrumb">
                <ol className="flex items-center gap-1.5 text-xs text-gray-500">
                  <li>
                    <Link href="/" className="hover:text-primary">Beranda</Link>
                  </li>
                  <li aria-hidden="true">
                    <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </li>
                  <li>
                    <Link href="/blog" className="hover:text-primary">Blog</Link>
                  </li>
                  <li aria-hidden="true">
                    <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </li>
                  <li>
                    <span className="font-medium text-gray-700">{post.category}</span>
                  </li>
                </ol>
              </nav>

              {/* Article Body */}
              <div className="article-content">
                {contentBlocks.map((block, index) => {
                  // H2
                  if (block.startsWith('## ')) {
                    headingIndex++;
                    const hId = `section-${headingIndex}`;
                    const text = block.replace('## ', '');
                    return (
                      <React.Fragment key={index}>
                        {index > 0 && <hr className="my-8 border-gray-100" />}
                        <h2
                          id={hId}
                          className="mb-4 mt-8 scroll-mt-24 font-heading text-xl font-bold text-primary md:text-2xl"
                        >
                          {text}
                        </h2>
                      </React.Fragment>
                    );
                  }
                  // H3
                  if (block.startsWith('### ')) {
                    headingIndex++;
                    const hId = `section-${headingIndex}`;
                    const text = block.replace('### ', '');
                    return (
                      <h3
                        key={index}
                        id={hId}
                        className="mb-3 mt-6 scroll-mt-24 font-heading text-lg font-semibold text-primary-700"
                      >
                        {text}
                      </h3>
                    );
                  }
                  // Unordered list (checklist style)
                  if (block.includes('\n- ') || block.startsWith('- ')) {
                    const items = block.split('\n').filter((line) => line.startsWith('- '));
                    return (
                      <ul key={index} className="my-4 space-y-2.5">
                        {items.map((item, i) => {
                          const text = item.replace('- ', '');
                          return (
                            <li key={i} className="flex items-start gap-3">
                              <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                              </svg>
                              <span className="text-[17px] leading-[1.8] text-gray-700">{text}</span>
                            </li>
                          );
                        })}
                      </ul>
                    );
                  }
                  // Ordered list
                  if (block.match(/^\d+\./)) {
                    const items = block.split('\n').filter((line) => line.match(/^\d+\./));
                    return (
                      <ol key={index} className="my-4 space-y-2.5">
                        {items.map((item, i) => {
                          const text = item.replace(/^\d+\.\s*/, '');
                          // Handle bold text like **Pianemo** - description
                          const parts = text.match(/^\*\*(.+?)\*\*\s*[-–]\s*(.+)$/);
                          return (
                            <li key={i} className="flex items-start gap-3">
                              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary">
                                {i + 1}
                              </span>
                              <span className="text-[17px] leading-[1.8] text-gray-700">
                                {parts ? (
                                  <>
                                    <strong className="font-semibold text-gray-900">{parts[1]}</strong>
                                    {' — '}{parts[2]}
                                  </>
                                ) : text}
                              </span>
                            </li>
                          );
                        })}
                      </ol>
                    );
                  }
                  // Lead paragraph (first paragraph)
                  if (index === 0) {
                    return (
                      <p key={index} className="mb-6 text-lg leading-[1.9] text-gray-700 md:text-xl">
                        {block}
                      </p>
                    );
                  }
                  // Regular paragraph
                  return (
                    <p key={index} className="mb-5 text-[17px] leading-[1.8] text-gray-700">
                      {block}
                    </p>
                  );
                })}
              </div>

              {/* Share Section */}
              <div className="mt-10 rounded-2xl border border-gray-100 bg-gray-50 p-5 md:p-6">
                <p className="text-sm font-semibold text-gray-900">Bagikan Artikel ini</p>
                <div className="mt-3 flex items-center gap-2">
                  <button type="button" onClick={() => handleShare('facebook')} className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600" aria-label="Share ke Facebook">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </button>
                  <button type="button" onClick={() => handleShare('twitter')} className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:border-sky-500 hover:bg-sky-50 hover:text-sky-500" aria-label="Share ke Twitter">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  </button>
                  <button type="button" onClick={() => handleShare('whatsapp')} className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:border-green-500 hover:bg-green-50 hover:text-green-500" aria-label="Share ke WhatsApp">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </button>
                  <button type="button" onClick={() => handleShare('copy')} className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:border-primary hover:bg-primary-50 hover:text-primary" aria-label="Salin link">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* CTA */}
              <ArticleCTA category={post.category} title={post.title} />
            </div>
          </article>

          {/* Desktop Sidebar */}
          <aside className="hidden w-[280px] flex-shrink-0 lg:block">
            <div className="sticky top-20 space-y-6">
              {/* Table of Contents */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900">Daftar Isi</h4>
                <nav className="mt-3">
                  <ul className="space-y-1.5">
                    {headings.map((heading) => (
                      <li key={heading.id}>
                        <button
                          type="button"
                          onClick={() => scrollToSection(heading.id)}
                          className={`block w-full text-left text-xs leading-relaxed transition-colors ${
                            heading.level === 3 ? 'pl-3' : ''
                          } ${
                            activeHeading === heading.id
                              ? 'font-semibold text-primary'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <span className={`inline-block rounded px-2 py-1 ${
                            activeHeading === heading.id ? 'bg-primary-50' : ''
                          }`}>
                            {heading.text}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h4 className="text-sm font-bold text-gray-900">Artikel Terkait</h4>
                  <div className="mt-3 space-y-4">
                    {relatedPosts.map((related) => (
                      <Link key={related.id} href={`/blog/${related.slug}`} className="group flex gap-3">
                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={related.image}
                            alt={related.imageAlt}
                            fill
                            sizes="56px"
                            className="object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="line-clamp-2 text-xs font-semibold text-gray-800 group-hover:text-primary">
                            {related.title}
                          </h5>
                          <span className="mt-1 block text-[10px] text-gray-500">{related.readTime} baca</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Mobile Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mx-auto mt-12 max-w-[720px] px-4 lg:hidden md:px-0">
            <h2 className="font-heading text-xl font-bold text-gray-900">Artikel Terkait</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {relatedPosts.map((related) => (
                <Link key={related.id} href={`/blog/${related.slug}`} className="group block">
                  <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
                    <div className="relative h-[160px]">
                      <Image
                        src={related.image}
                        alt={related.imageAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-medium text-primary-700">{related.category}</span>
                      <h3 className="mt-1 line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-primary">
                        {related.title}
                      </h3>
                      <span className="mt-2 block text-xs text-gray-500">{related.readTime} baca</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

// =============================================================================
// Dynamic CTA Component
// =============================================================================

const destinationMap: Record<string, { name: string; slug: string }> = {
  'bali': { name: 'Bali', slug: 'bali' },
  'raja ampat': { name: 'Raja Ampat', slug: 'raja-ampat' },
  'labuan bajo': { name: 'Labuan Bajo', slug: 'labuan-bajo' },
  'bromo': { name: 'Bromo', slug: 'bromo' },
  'nusa penida': { name: 'Nusa Penida', slug: 'nusa-penida' },
  'danau toba': { name: 'Danau Toba', slug: 'danau-toba' },
  'yogyakarta': { name: 'Yogyakarta', slug: 'yogyakarta' },
  'wakatobi': { name: 'Wakatobi', slug: 'wakatobi' },
  'komodo': { name: 'Labuan Bajo', slug: 'labuan-bajo' },
};

function detectDestination(title: string): { name: string; slug: string } | null {
  const lowerTitle = title.toLowerCase();
  for (const [keyword, dest] of Object.entries(destinationMap)) {
    if (lowerTitle.includes(keyword)) {
      return dest;
    }
  }
  return null;
}

function ArticleCTA({ category, title }: { category: string; title: string }) {
  const destination = detectDestination(title);

  let ctaTitle = '';
  let ctaDescription = '';
  let ctaButton = '';
  let ctaHref = '/destinasi';

  if (category === 'Destinasi' && destination) {
    ctaTitle = `Tertarik Liburan ke ${destination.name}?`;
    ctaDescription = `Kami siap membantu merencanakan perjalanan terbaikmu ke ${destination.name}`;
    ctaButton = `Lihat Paket ${destination.name}`;
    ctaHref = `/destinasi/${destination.slug}`;
  } else if (category === 'Tips Travel') {
    ctaTitle = 'Siap Memulai Perjalananmu?';
    ctaDescription = 'Temukan paket wisata terbaik di Indonesia dengan harga terjangkau';
    ctaButton = 'Lihat Semua Destinasi';
    ctaHref = '/destinasi';
  } else if (category === 'Promo') {
    ctaTitle = 'Jangan Sampai Ketinggalan Promo Ini!';
    ctaDescription = 'Pesan sekarang sebelum promo habis';
    ctaButton = 'Lihat Semua Promo';
    ctaHref = '/destinasi';
  } else if (category === 'Kuliner' || category === 'Budaya') {
    ctaTitle = 'Rasakan Langsung Pengalamannya!';
    ctaDescription = 'Jelajahi destinasi wisata kuliner dan budaya terbaik di Indonesia';
    ctaButton = 'Eksplorasi Destinasi';
    ctaHref = '/destinasi';
  } else {
    // Fallback
    ctaTitle = 'Siap Memulai Perjalananmu?';
    ctaDescription = 'Temukan paket wisata terbaik di Indonesia dengan harga terjangkau';
    ctaButton = 'Lihat Semua Destinasi';
    ctaHref = '/destinasi';
  }

  return (
    <div className="mt-10 rounded-2xl bg-primary-50 p-6 text-center md:p-8">
      <h3 className="text-lg font-bold text-gray-900">{ctaTitle}</h3>
      <p className="mt-2 text-sm text-gray-600">{ctaDescription}</p>
      <Link
        href={ctaHref}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
      >
        {ctaButton}
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </Link>
    </div>
  );
}
