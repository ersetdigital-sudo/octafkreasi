'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Review {
  id: string;
  author: string;
  content: string;
  rating: number;
  status: string;
  date: string;
  created_at: string;
  destination_id: string;
  destination_name: string;
  destination_slug: string;
  user_id: string;
}

const statusFilters = [
  { value: 'all', label: 'Semua' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'rejected', label: 'Ditolak' },
];

export default function AdminUlasanPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => { loadData(); }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    setLoading(true);
    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (filter !== 'all') query = query.eq('status', filter);
    const { data } = await query;
    setReviews(data || []);
    setLoading(false);
  };

  const showNotif = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Sinkronisasi rating destinasi setelah review diubah
  const syncDestinationRating = async (destinationId: string) => {
    if (!destinationId) return;
    const { data: approvedReviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('destination_id', destinationId)
      .eq('status', 'approved');

    const reviews = approvedReviews || [];
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    await supabase.from('destinations').update({
      rating: Math.round(avgRating * 10) / 10,
      review_count: reviews.length,
    }).eq('id', destinationId);
  };

  const updateStatus = async (id: string, status: string) => {
    // Cari destination_id dari review ini
    const review = reviews.find(r => r.id === id);
    await supabase.from('reviews').update({ status }).eq('id', id);
    if (review?.destination_id) await syncDestinationRating(review.destination_id);
    showNotif('success', `Ulasan ${status === 'approved' ? 'disetujui' : 'ditolak'}`);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus ulasan ini?')) return;
    const review = reviews.find(r => r.id === id);
    await supabase.from('reviews').delete().eq('id', id);
    if (review?.destination_id) await syncDestinationRating(review.destination_id);
    showNotif('success', 'Ulasan dihapus');
    loadData();
  };

  return (
    <div className="space-y-4">
      {notification && <div className={`rounded-lg border px-4 py-3 text-sm font-medium ${notification.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>{notification.message}</div>}

      <div>
        <h1 className="text-xl font-bold text-gray-900">Kelola Ulasan</h1>
        <p className="text-xs text-gray-500">{reviews.length} ulasan</p>
      </div>

      {/* Filter */}
      <div className="flex gap-1.5">
        {statusFilters.map((f) => (
          <button key={f.value} type="button" onClick={() => setFilter(f.value)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filter === f.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-400">Memuat...</div>
        ) : reviews.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-400">Tidak ada ulasan</div>
        ) : reviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                  {review.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{review.author || 'Traveler'}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className={`h-3.5 w-3.5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-500">
                      {new Date(review.created_at || review.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {review.destination_name && (
                      <span className="text-[11px] font-medium text-blue-600">· {review.destination_name}</span>
                    )}
                  </div>
                </div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                review.status === 'approved' ? 'bg-green-50 text-green-700' :
                review.status === 'rejected' ? 'bg-red-50 text-red-700' :
                'bg-yellow-50 text-yellow-700'
              }`}>
                {review.status === 'approved' ? 'Disetujui' : review.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
              </span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-gray-700">{review.content}</p>

            {/* Actions */}
            <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
              {review.status !== 'approved' && (
                <button type="button" onClick={() => updateStatus(review.id, 'approved')} className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100">Setujui</button>
              )}
              {review.status !== 'rejected' && (
                <button type="button" onClick={() => updateStatus(review.id, 'rejected')} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100">Tolak</button>
              )}
              <button type="button" onClick={() => handleDelete(review.id)} className="ml-auto rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
