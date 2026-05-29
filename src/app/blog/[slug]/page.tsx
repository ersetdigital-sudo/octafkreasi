'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
  author: string;
  category: string;
  status: string;
  created_at: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase.from('blog_posts').select('*').eq('slug', slug).eq('status', 'published').single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setPost(data as BlogPost);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container-app py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Artikel Tidak Ditemukan</h1>
          <p className="mt-2 text-gray-500">Artikel yang Anda cari tidak tersedia.</p>
          <Link href="/blog" className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            ← Kembali ke Blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container-app py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-1.5 text-xs text-gray-500">
            <li><Link href="/" className="hover:text-blue-600">Beranda</Link></li>
            <li><svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg></li>
            <li><Link href="/blog" className="hover:text-blue-600">Blog</Link></li>
            <li><svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg></li>
            <li className="font-medium text-gray-800 truncate max-w-[200px]">{post.title}</li>
          </ol>
        </nav>

        <article className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            {post.category && (
              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 mb-3">
                {post.category}
              </span>
            )}
            <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl leading-tight">{post.title}</h1>
            <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
              <span>{post.author || 'Tim Octafkreasi'}</span>
              <span>·</span>
              <span>{new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Featured Image */}
          {post.image && (
            <div className="mb-8 overflow-hidden rounded-2xl">
              <img src={post.image} alt={post.title} className="w-full h-auto object-cover" />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Back */}
          <div className="mt-12 border-t border-gray-100 pt-8">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Kembali ke Blog
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
