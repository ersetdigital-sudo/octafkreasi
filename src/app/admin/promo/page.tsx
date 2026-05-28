'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatRupiah } from '@/lib/format';

interface Promo {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_purchase: number;
  max_discount: number | null;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminPromoPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Promo | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false });
    setPromos(data || []);
    setLoading(false);
  };

  const showNotif = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = async (form: Record<string, unknown>) => {
    if (editing) {
      await supabase.from('promo_codes').update(form).eq('id', editing.id);
      showNotif('success', 'Promo berhasil diupdate');
    } else {
      await supabase.from('promo_codes').insert(form);
      showNotif('success', 'Promo berhasil ditambahkan');
    }
    setShowForm(false);
    setEditing(null);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus promo ini?')) return;
    await supabase.from('promo_codes').delete().eq('id', id);
    showNotif('success', 'Promo dihapus');
    loadData();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('promo_codes').update({ is_active: !current }).eq('id', id);
    showNotif('success', `Promo ${!current ? 'diaktifkan' : 'dinonaktifkan'}`);
    loadData();
  };

  return (
    <div className="space-y-4">
      {notification && <div className={`rounded-lg border px-4 py-3 text-sm font-medium ${notification.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>{notification.message}</div>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-xl font-bold text-gray-900">Kelola Promo</h1><p className="text-xs text-gray-500">{promos.length} kode promo</p></div>
        <button type="button" onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Tambah Promo
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Kode</th>
              <th className="hidden px-5 py-3 text-left text-xs font-semibold text-gray-500 sm:table-cell">Diskon</th>
              <th className="hidden px-5 py-3 text-left text-xs font-semibold text-gray-500 md:table-cell">Berlaku Sampai</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">Memuat...</td></tr> :
            promos.length === 0 ? <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">Belum ada promo</td></tr> :
            promos.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-5 py-3.5"><span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs font-bold text-gray-800">{p.code}</span></td>
                <td className="hidden px-5 py-3.5 sm:table-cell">{p.discount_type === 'percentage' ? `${p.discount_value}%` : formatRupiah(p.discount_value)}</td>
                <td className="hidden px-5 py-3.5 text-gray-600 md:table-cell">{p.valid_until ? new Date(p.valid_until).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${p.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${p.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />{p.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => { setEditing(p); setShowForm(true); }} className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg></button>
                    <button type="button" onClick={() => toggleActive(p.id, p.is_active)} className="rounded-lg p-2 text-gray-400 hover:bg-orange-50 hover:text-orange-600"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" /></svg></button>
                    <button type="button" onClick={() => handleDelete(p.id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && <PromoForm promo={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}

function PromoForm({ promo, onSave, onClose }: { promo: Promo | null; onSave: (data: Record<string, unknown>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    code: promo?.code || '',
    discount_type: promo?.discount_type || 'percentage',
    discount_value: promo?.discount_value || 10,
    min_purchase: promo?.min_purchase || 0,
    max_discount: promo?.max_discount || null,
    valid_until: promo?.valid_until ? promo.valid_until.split('T')[0] : '',
    is_active: promo?.is_active ?? true,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-gray-900">{promo ? 'Edit Promo' : 'Tambah Promo'}</h2>
        <div className="mt-4 space-y-3">
          <div><label className="text-xs font-medium text-gray-700">Kode Promo</label><input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono uppercase focus:border-blue-500 focus:outline-none" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-gray-700">Tipe Diskon</label><select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"><option value="percentage">Persen (%)</option><option value="fixed">Nominal (Rp)</option></select></div>
            <div><label className="text-xs font-medium text-gray-700">Nilai Diskon</label><input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: parseInt(e.target.value) || 0 })} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-gray-700">Min. Pembelian (Rp)</label><input type="number" value={form.min_purchase} onChange={(e) => setForm({ ...form, min_purchase: parseInt(e.target.value) || 0 })} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" /></div>
            <div><label className="text-xs font-medium text-gray-700">Berlaku Sampai</label><input type="date" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" /></div>
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
          <button type="button" onClick={() => onSave({ ...form, valid_until: form.valid_until ? new Date(form.valid_until).toISOString() : null })} className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{promo ? 'Update' : 'Simpan'}</button>
        </div>
      </div>
    </div>
  );
}
