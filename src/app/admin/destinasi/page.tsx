'use client';

import React, { useEffect, useState } from 'react';
import { getAdminDestinations, toggleDestinationStatus, deleteDestination, updateDestination } from '@/lib/admin';
import { supabase } from '@/lib/supabase';
import { formatRupiah } from '@/lib/format';

interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  description: string;
  image: string;
  images: string[];
  rating: number;
  review_count: number;
  price_start_from: number;
  duration: string;
  is_active: boolean;
  category: string;
  best_time: string;
  language: string;
  currency: string;
  timezone: string;
  trip_type: string;
  min_capacity: number;
  max_capacity: number;
  confirmation: string;
  included: string[];
  excluded: string[];
  schedule: string[];
}

export default function AdminDestinasiPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getAdminDestinations();
    setDestinations(data);
    setLoading(false);
  };

  const showNotif = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await toggleDestinationStatus(id, !currentStatus);
    showNotif('success', `Destinasi ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`);
    loadData();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus destinasi "${name}"? Aksi ini tidak bisa dibatalkan.`)) return;
    await deleteDestination(id);
    showNotif('success', 'Destinasi berhasil dihapus');
    loadData();
  };

  const handleSave = async (formData: Record<string, unknown>) => {
    if (editingDest) {
      await updateDestination(editingDest.id, formData);
      showNotif('success', 'Destinasi berhasil diupdate');
    } else {
      await supabase.from('destinations').insert(formData);
      showNotif('success', 'Destinasi berhasil ditambahkan');
    }
    setShowForm(false);
    setEditingDest(null);
    loadData();
  };

  const filtered = destinations.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {notification && (
        <div className={`animate-[fadeIn_0.2s_ease-out] rounded-lg px-4 py-3 text-sm font-medium ${notification.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {notification.message}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Kelola Destinasi</h1>
          <p className="text-xs text-gray-500">{destinations.length} destinasi terdaftar</p>
        </div>
        <button type="button" onClick={() => { setEditingDest(null); setShowForm(true); }} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Tambah Destinasi
        </button>
      </div>

      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari destinasi..." className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:max-w-xs" />

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Destinasi</th>
              <th className="hidden px-5 py-3 text-left text-xs font-semibold text-gray-500 md:table-cell">Lokasi</th>
              <th className="hidden px-5 py-3 text-left text-xs font-semibold text-gray-500 sm:table-cell">Harga</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">Memuat data...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">Tidak ada destinasi ditemukan</td></tr>
            ) : filtered.map((dest) => (
              <tr key={dest.id} className="transition-colors hover:bg-blue-50/30">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    {dest.image && <img src={dest.image} alt="" className="h-10 w-14 rounded-lg object-cover" />}
                    <div>
                      <p className="font-medium text-gray-900">{dest.name}</p>
                      <p className="text-[11px] text-gray-500 md:hidden">{dest.country}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-5 py-3.5 text-gray-600 md:table-cell">{dest.country}</td>
                <td className="hidden px-5 py-3.5 font-medium text-gray-900 sm:table-cell">{formatRupiah(dest.price_start_from)}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${dest.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${dest.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                    {dest.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => { setEditingDest(dest); setShowForm(true); }} className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600" title="Edit">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
                    </button>
                    <button type="button" onClick={() => handleToggleStatus(dest.id, dest.is_active)} className="rounded-lg p-2 text-gray-400 hover:bg-orange-50 hover:text-orange-600" title="Toggle">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                    <button type="button" onClick={() => handleDelete(dest.id, dest.name)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600" title="Hapus">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <DestinationForm destination={editingDest} onSave={handleSave} onClose={() => { setShowForm(false); setEditingDest(null); }} />
      )}
    </div>
  );
}

function DestinationForm({ destination, onSave, onClose }: { destination: Destination | null; onSave: (data: Record<string, unknown>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    name: destination?.name || '',
    slug: destination?.slug || '',
    country: destination?.country || '',
    description: destination?.description || '',
    image: destination?.image || '',
    images: destination?.images || [],
    price_start_from: destination?.price_start_from || 0,
    duration: destination?.duration || '',
    category: destination?.category || 'alam',
    badge: (destination as unknown as Record<string, string>)?.badge || '',
    best_time: destination?.best_time || '',
    language: destination?.language || 'Indonesia',
    currency: destination?.currency || 'IDR',
    timezone: destination?.timezone || 'WIB',
    trip_type: destination?.trip_type || 'Private Trip',
    min_capacity: destination?.min_capacity || 2,
    max_capacity: destination?.max_capacity || 12,
    confirmation: destination?.confirmation || 'Instan',
    included: destination?.included || [],
    excluded: destination?.excluded || [],
    schedule: destination?.schedule || [],
  });

  const [newImage, setNewImage] = useState('');
  const [newIncluded, setNewIncluded] = useState('');
  const [newExcluded, setNewExcluded] = useState('');
  const [newSchedule, setNewSchedule] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    onSave({ ...form, slug, image: form.images[0] || form.image });
  };

  const addImage = () => {
    if (!newImage.trim()) return;
    setForm({ ...form, images: [...form.images, newImage.trim()] });
    setNewImage('');
  };

  const removeImage = (idx: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
  };

  const addIncluded = () => {
    if (!newIncluded.trim()) return;
    setForm({ ...form, included: [...form.included, newIncluded.trim()] });
    setNewIncluded('');
  };

  const addExcluded = () => {
    if (!newExcluded.trim()) return;
    setForm({ ...form, excluded: [...form.excluded, newExcluded.trim()] });
    setNewExcluded('');
  };

  const addSchedule = () => {
    if (!newSchedule.trim()) return;
    setForm({ ...form, schedule: [...form.schedule, newSchedule.trim()] });
    setNewSchedule('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-10 pb-10">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">{destination ? 'Edit Destinasi' : 'Tambah Destinasi'}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto p-6 space-y-5">
          {/* Basic Info */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-bold text-gray-900">Informasi Dasar</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InputField label="Nama Destinasi" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <InputField label="Lokasi/Provinsi" value={form.country} onChange={(v) => setForm({ ...form, country: v })} required />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Deskripsi</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <InputField label="Harga Mulai (Rp)" value={String(form.price_start_from)} onChange={(v) => setForm({ ...form, price_start_from: parseInt(v.replace(/\D/g, '')) || 0 })} type="rupiah" />
              <InputField label="Durasi" value={form.duration} onChange={(v) => setForm({ ...form, duration: v })} placeholder="4 Hari 3 Malam" />
              <div>
                <label className="text-xs font-medium text-gray-700">Kategori</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                  <option value="alam">Alam</option>
                  <option value="pantai">Pantai</option>
                  <option value="gunung">Gunung</option>
                  <option value="budaya">Budaya</option>
                  <option value="diving">Diving</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Badge</label>
                <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                  <option value="">Tanpa Badge</option>
                  <option value="best-seller">Best Seller</option>
                  <option value="populer">Populer</option>
                  <option value="baru">Baru</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* Detail Info */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-bold text-gray-900">Detail Trip</legend>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <InputField label="Tipe Trip" value={form.trip_type} onChange={(v) => setForm({ ...form, trip_type: v })} />
              <InputField label="Min Kapasitas" value={String(form.min_capacity)} onChange={(v) => setForm({ ...form, min_capacity: parseInt(v) || 2 })} type="number" />
              <InputField label="Max Kapasitas" value={String(form.max_capacity)} onChange={(v) => setForm({ ...form, max_capacity: parseInt(v) || 12 })} type="number" />
              <InputField label="Konfirmasi" value={form.confirmation} onChange={(v) => setForm({ ...form, confirmation: v })} />
            </div>
          </fieldset>

          {/* Images */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-bold text-gray-900">Foto Destinasi</legend>
            {form.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.images.map((img, idx) => (
                  <div key={idx} className="group relative h-16 w-20 overflow-hidden rounded-lg border border-gray-200">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                    {idx === 0 && <span className="absolute left-0.5 top-0.5 rounded bg-blue-600 px-1 text-[8px] font-bold text-white">Utama</span>}
                    <button type="button" onClick={() => removeImage(idx)} className="absolute right-0.5 top-0.5 hidden rounded bg-red-500 p-0.5 text-white group-hover:block">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input type="url" value={newImage} onChange={(e) => setNewImage(e.target.value)} placeholder="Paste URL foto (Cloudinary/Unsplash)" className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              <button type="button" onClick={addImage} className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200">Tambah</button>
            </div>
          </fieldset>

          {/* Included */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-bold text-gray-900">Paket Sudah Termasuk</legend>
            {form.included.length > 0 && (
              <div className="space-y-1">
                {form.included.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5 text-xs text-green-800">
                    <svg className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    <span className="flex-1">{item}</span>
                    <button type="button" onClick={() => setForm({ ...form, included: form.included.filter((_, i) => i !== idx) })} className="text-green-600 hover:text-red-500">×</button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input type="text" value={newIncluded} onChange={(e) => setNewIncluded(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addIncluded(); } }} placeholder="Tambah item..." className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              <button type="button" onClick={addIncluded} className="rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-100">+</button>
            </div>
          </fieldset>

          {/* Excluded */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-bold text-gray-900">Paket Belum Termasuk</legend>
            {form.excluded.length > 0 && (
              <div className="space-y-1">
                {form.excluded.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-1.5 text-xs text-red-800">
                    <svg className="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    <span className="flex-1">{item}</span>
                    <button type="button" onClick={() => setForm({ ...form, excluded: form.excluded.filter((_, i) => i !== idx) })} className="text-red-600 hover:text-red-800">×</button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input type="text" value={newExcluded} onChange={(e) => setNewExcluded(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addExcluded(); } }} placeholder="Tambah item..." className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              <button type="button" onClick={addExcluded} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100">+</button>
            </div>
          </fieldset>

          {/* Schedule / Jadwal Tour */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-bold text-gray-900">Jadwal Tour</legend>
            {form.schedule.length > 0 && (
              <div className="space-y-1">
                {form.schedule.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-xs text-blue-800">
                    <svg className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="flex-1">{item}</span>
                    <button type="button" onClick={() => setForm({ ...form, schedule: form.schedule.filter((_: string, i: number) => i !== idx) })} className="text-blue-600 hover:text-red-500">×</button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input type="text" value={newSchedule} onChange={(e) => setNewSchedule(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSchedule(); } }} placeholder="08.00 WITA Penjemputan di hotel" className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              <button type="button" onClick={addSchedule} className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100">+</button>
            </div>
          </fieldset>
        </form>

        {/* Footer */}
        <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
          <button type="button" onClick={(e) => { e.preventDefault(); const formEl = document.querySelector('form'); if (formEl) formEl.requestSubmit(); }} className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{destination ? 'Update' : 'Simpan'}</button>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, type = 'text', placeholder, required }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean }) {
  const formatRupiah = (num: string) => {
    const clean = num.replace(/\D/g, '');
    return clean ? parseInt(clean).toLocaleString('id-ID') : '';
  };

  if (type === 'rupiah') {
    const display = value && value !== '0' ? formatRupiah(value) : '';
    return (
      <div>
        <label className="text-xs font-medium text-gray-700">{label}</label>
        <div className="relative mt-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rp</span>
          <input
            type="text"
            inputMode="numeric"
            value={display}
            onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
            placeholder="2.500.000"
            required={required}
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="text-xs font-medium text-gray-700">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
    </div>
  );
}
