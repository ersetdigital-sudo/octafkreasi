'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Destination { id: string; name: string; slug: string; }
interface Activity {
  id: string;
  destination_id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  duration: string;
  rating: number;
  type: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

const TYPES = [
  { value: 'activity', label: 'Paket Tour' },
  { value: 'highlight', label: 'Highlight / Aktivitas' },
];

export default function AdminPaketPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [activities, setActivities]     = useState<Activity[]>([]);
  const [loading, setLoading]           = useState(true);
  const [selectedDest, setSelectedDest] = useState<string>('all');
  const [filterType, setFilterType]     = useState<string>('all');
  const [showForm, setShowForm]         = useState(false);
  const [editing, setEditing]           = useState<Activity | null>(null);
  const [toast, setToast]               = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [destRes, actRes] = await Promise.all([
      supabase.from('destinations').select('id, name, slug').eq('is_active', true).order('name'),
      supabase.from('activities').select('*').order('sort_order'),
    ]);
    setDestinations(destRes.data || []);
    setActivities(actRes.data || []);
    setLoading(false);
  };

  const showToast = (ok: boolean, msg: string) => {
    setToast({ ok, msg }); setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus item ini?')) return;
    await supabase.from('activities').delete().eq('id', id);
    showToast(true, 'Item dihapus');
    loadData();
  };

  const handleToggle = async (id: string, active: boolean) => {
    await supabase.from('activities').update({ is_active: !active }).eq('id', id);
    showToast(true, `Item ${!active ? 'diaktifkan' : 'dinonaktifkan'}`);
    loadData();
  };

  const filtered = activities.filter(a => {
    if (selectedDest !== 'all' && a.destination_id !== selectedDest) return false;
    if (filterType !== 'all' && a.type !== filterType) return false;
    return true;
  });

  const getDestName = (id: string) => destinations.find(d => d.id === id)?.name || '—';

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className={`fixed right-5 top-5 z-50 flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold shadow-xl animate-[slideUp_0.2s_ease-out] ${toast.ok ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Paket & Aktivitas</h1>
          <p className="text-xs text-gray-500">{activities.length} item</p>
        </div>
        <button type="button" onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #2563FF, #1E40AF)' }}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Tambah
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select value={selectedDest} onChange={(e) => setSelectedDest(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none">
          <option value="all">Semua Destinasi</option>
          {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none">
          <option value="all">Semua Tipe</option>
          {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#0F172A' }}>
                {['NAMA', 'DESTINASI', 'TIPE', 'HARGA', 'DURASI', 'STATUS', 'AKSI'].map((col, i) => (
                  <th key={i} className="px-4 text-left text-white"
                    style={{ height: '48px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', borderRight: i < 6 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} style={{ height: '52px', borderBottom: '1px solid #E2E8F0' }} className="animate-pulse">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-4"><div className="h-3 w-20 rounded bg-gray-100" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-16 text-center text-sm text-gray-400">Tidak ada data</td></tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="transition-colors duration-150 hover:bg-[#F8FAFF]"
                    style={{ height: '52px', borderBottom: '1px solid #E2E8F0' }}>
                    <td className="px-4" style={{ borderRight: '1px solid #F1F5F9' }}>
                      <p className="font-semibold text-[#0F172A]" style={{ fontSize: '13px' }}>{item.name}</p>
                      {item.description && <p className="truncate max-w-[200px] text-[11px] text-[#94A3B8]">{item.description}</p>}
                    </td>
                    <td className="px-4" style={{ borderRight: '1px solid #F1F5F9', fontSize: '13px', color: '#475569' }}>
                      {getDestName(item.destination_id)}
                    </td>
                    <td className="px-4" style={{ borderRight: '1px solid #F1F5F9' }}>
                      <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                        item.type === 'activity' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {item.type === 'activity' ? 'Paket Tour' : 'Highlight'}
                      </span>
                    </td>
                    <td className="px-4" style={{ borderRight: '1px solid #F1F5F9', fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                      {item.price > 0 ? `Rp ${item.price.toLocaleString('id-ID')}` : '—'}
                    </td>
                    <td className="px-4" style={{ borderRight: '1px solid #F1F5F9', fontSize: '13px', color: '#475569' }}>
                      {item.duration || '—'}
                    </td>
                    <td className="px-4" style={{ borderRight: '1px solid #F1F5F9' }}>
                      <button type="button" onClick={() => handleToggle(item.id, item.is_active)}
                        className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold cursor-pointer ${
                          item.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                        {item.is_active ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="px-4">
                      <div className="flex items-center gap-1.5">
                        <button type="button" onClick={() => { setEditing(item); setShowForm(true); }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                          </svg>
                        </button>
                        <button type="button" onClick={() => handleDelete(item.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <FormModal
          destinations={destinations}
          editing={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { setShowForm(false); setEditing(null); loadData(); showToast(true, editing ? 'Item diperbarui' : 'Item ditambahkan'); }}
        />
      )}
    </div>
  );
}

// ── Form Modal ─────────────────────────────────────────────────────────────
function FormModal({ destinations, editing, onClose, onSaved }: {
  destinations: { id: string; name: string }[];
  editing: Activity | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    destination_id: editing?.destination_id || '',
    name: editing?.name || '',
    description: editing?.description || '',
    image: editing?.image || '',
    price: editing?.price || 0,
    duration: editing?.duration || '',
    rating: editing?.rating || 4.5,
    type: editing?.type || 'activity',
    sort_order: editing?.sort_order || 1,
    is_active: editing?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!form.destination_id || !form.name) return;
    setSaving(true);

    if (editing) {
      await supabase.from('activities').update(form).eq('id', editing.id);
    } else {
      await supabase.from('activities').insert(form);
    }
    setSaving(false);
    onSaved();
  };

  const inputCls = "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg animate-[slideUp_0.25s_ease-out] rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-gray-900">{editing ? 'Edit' : 'Tambah'} Paket / Aktivitas</h3>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Destinasi */}
          <div>
            <label className="text-xs font-semibold text-gray-500">Destinasi *</label>
            <select value={form.destination_id} onChange={(e) => setForm({ ...form, destination_id: e.target.value })}
              className={inputCls + ' mt-1.5'}>
              <option value="">Pilih destinasi</option>
              {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          {/* Tipe */}
          <div>
            <label className="text-xs font-semibold text-gray-500">Tipe *</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className={inputCls + ' mt-1.5'}>
              <option value="activity">Paket Tour</option>
              <option value="highlight">Highlight / Aktivitas</option>
            </select>
          </div>

          {/* Nama */}
          <div>
            <label className="text-xs font-semibold text-gray-500">Nama *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Snorkeling Wakatobi" className={inputCls + ' mt-1.5'} />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="text-xs font-semibold text-gray-500">Deskripsi</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Deskripsi singkat..." rows={3} className={inputCls + ' mt-1.5 resize-none'} />
          </div>

          {/* Image URL */}
          <div>
            <label className="text-xs font-semibold text-gray-500">URL Gambar</label>
            <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://images.unsplash.com/..." className={inputCls + ' mt-1.5'} />
            {form.image && (
              <div className="mt-2 h-24 w-full overflow-hidden rounded-xl bg-gray-100">
                <img src={form.image} alt="Preview" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          {/* Price + Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500">Harga (Rp)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                placeholder="350000" className={inputCls + ' mt-1.5'} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Durasi</label>
              <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="4 Jam" className={inputCls + ' mt-1.5'} />
            </div>
          </div>

          {/* Rating + Sort */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500">Rating</label>
              <input type="number" step="0.1" min="1" max="5" value={form.rating}
                onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 4.5 })}
                className={inputCls + ' mt-1.5'} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Urutan</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 1 })}
                className={inputCls + ' mt-1.5'} />
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setForm({ ...form, is_active: !form.is_active })}
              className={`relative h-6 w-11 rounded-full transition-colors ${form.is_active ? 'bg-blue-600' : 'bg-gray-200'}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${form.is_active ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
            <span className="text-sm text-gray-600">{form.is_active ? 'Aktif' : 'Nonaktif'}</span>
          </div>

          {/* Submit */}
          <button type="button" onClick={handleSubmit} disabled={saving || !form.destination_id || !form.name}
            className="w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #2563FF, #1E40AF)' }}>
            {saving ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Tambah Item'}
          </button>
        </div>
      </div>
    </div>
  );
}
