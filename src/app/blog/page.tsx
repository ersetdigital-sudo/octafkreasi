import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { blogPosts } from '@/data/blog';

export const metadata = {
  title: 'Blog Travel Indonesia - Tips & Panduan Wisata | octafkreasi',
  description: 'Temukan tips traveling, panduan destinasi, dan inspirasi liburan di Indonesia. Artikel lengkap dari tim octafkreasi untuk perjalanan terbaikmu.',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-12 md:py-16">
        <div className="container-app">
          {/* Page Header */}
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold text-gray-900 md:text-4xl">
              Blog & Artikel
            </h1>
            <p className="mt-3 text-gray-600">
              Tips traveling, panduan destinasi, dan inspirasi untuk liburanmu
            </p>
          </div>

          {/* Featured Post */}
          <div className="mt-10">
            <Link href={`/blog/${blogPosts[0].slug}`} className="group block">
              <div className="relative h-[300px] overflow-hidden rounded-3xl md:h-[400px]">
                <Image
                  src={blogPosts[0].image}
                  alt={blogPosts[0].imageAlt}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                    {blogPosts[0].category}
                  </span>
                  <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
                    {blogPosts[0].title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-white/80 md:text-base">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-white/70">
                    <span>{blogPosts[0].date}</span>
                    <span>·</span>
                    <span>{blogPosts[0].readTime} baca</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Blog Grid */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(1).map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <div className="relative h-[200px]">
                    <Image
                      src={post.image}
                      alt={post.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <span className="inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                      {post.category}
                    </span>
                    <h3 className="mt-2 line-clamp-2 text-base font-bold text-gray-900 group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.readTime} baca</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
