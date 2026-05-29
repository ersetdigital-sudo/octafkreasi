'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  image_alt?: string;
  author: string;
  category: string;
  status: string;
  created_at: string;
  read_time?: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPosts(data || []);
        setLoading(false);
      });
  }, []);

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

          {/* Loading */}
          {loading && (
            <div className="mt-16 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          )}

          {/* Empty State */}
          {!loading && posts.length === 0 && (
            <div className="mt-16 text-center">
              <p className="text-gray-500">Belum ada artikel yang dipublikasikan.</p>
            </div>
          )}

          {/* Featured Post */}
          {!loading && posts.length > 0 && (
            <div className="mt-10">
              <Link href={`/blog/${posts[0].slug}`} className="group block">
                <div className="relative h-[300px] overflow-hidden rounded-3xl md:h-[400px]">
                  {posts[0].image && (
                    <Image
                      src={posts[0].image}
                      alt={posts[0].image_alt || posts[0].title}
                      fill
                      sizes="100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                      {posts[0].category}
                    </span>
                    <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
                      {posts[0].title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm text-white/80 md:text-base">
                      {posts[0].excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-white/70">
                      <span>{new Date(posts[0].created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      {posts[0].read_time && (
                        <>
                          <span>·</span>
                          <span>{posts[0].read_time} baca</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Blog Grid */}
          {!loading && posts.length > 1 && (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.slice(1).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
                    <div className="relative h-[200px]">
                      {post.image && (
                        <Image
                          src={post.image}
                          alt={post.image_alt || post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      )}
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
                        <span>{new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        {post.read_time && (
                          <>
                            <span>·</span>
                            <span>{post.read_time} baca</span>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
