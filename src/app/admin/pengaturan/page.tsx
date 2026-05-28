'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatRupiah } from '@/lib/format';

interface BankAccount { id: string; bank_name: string; account_number: string; account_name: string; is_active: boolean; }
interface EWallet { id: string; wallet_type: string; wallet_number: string; wallet_name: string; is_active: boolean; }

export default function AdminPengaturanPage() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);
  const [business, setBusiness] = useState({ name: '', description: '', email: '', whatsapp: '', address: '', hours_weekday: '', hours_weekend: '' });
  const [fees, setFees] = useState({ service_fee: 100000, insurance_fee: 150000 });
  const [social, setSocial] = useState({ facebook: '', instagram: '', twitter: '', youtube: '' });
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [ewallets, setEwallets] = useState<EWallet[]>([]);
  const [showBankForm, setShowBankForm] = useState(false);
  const [showWalletForm, setShowWalletForm] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [editingWallet, setEditingWallet] = useState<EWallet | null>(null);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    const [settingsRes, banksRes, ewalletsRes] = await Promise.all([
      supabase.from('settings').select('*'),
      supabase.from('bank_accounts').select('*').order('sort_order'),
      supabase.from('ewallets').select('*').order('sort_order'),
    ]);
    if (settingsRes.data) {
      for (const s of settingsRes.data) {
        const val = typeof s.value === 'string' ? JSON.parse(s.value) : s.value;
        if (s.id === 'business') setBusiness(val);
        if (s.id === 'fees') setFees(val);
        if (s.id === 'social') setSocial(val);
      }
    }
    setBanks(banksRes.data || []);
    setEwallets(ewalletsRes.data || []);
    setLoading(false);
  };

  const showToast = (ok: boolean, msg: string) => { setToast({ ok, msg }); setTimeout(() => setToast(null), 3000); };

  const saveSetting = async (id: string, value: unknown) => {
    await supabase.from('settings').upsert({ id, value, updated_at: new Date().toISOString() });
    showToast(true, 'Berhasil disimpan');
  };

  const saveBank = async (data: { bank_name: string; account_number: string; account_name: string }) => {
    if (editingBank) await supabase.from('bank_accounts').update(data).eq('id', editingBank.id);
    else await supabase.from('bank_accounts').insert(data);
    setShowBankForm(false); setEditingBank(null); showToast(true, 'Rekening disimpan'); loadAll();
  };

  const deleteBank = async (id: string) => { if (!confirm('Hapus?')) return; await supabase.from('bank_accounts').delete().eq('id', id); showToast(true, 'Dihapus'); loadAll(); };
  const toggleBank = async (id: string, cur: boolean) => { await supabase.from('bank_accounts').update({ is_active: !cur }).eq('id', id); loadAll(); };

  const saveWallet = async (data: { wallet_type: string; wallet_number: string; wallet_name: string }) => {
    if (editingWallet) await supabase.from('ewallets').update(data).eq('id', editingWallet.id);
    else await supabase.from('ewallets').insert(data);
    setShowWalletForm(false); setEditingWallet(null); showToast(true, 'E-Wallet disimpan'); loadAll();
  };
  const deleteWallet = async (id: string) => { if (!confirm('Hapus?')) return; await supabase.from('ewallets').delete().eq('id', id); showToast(true, 'Dihapus'); loadAll(); };
  const toggleWallet = async (id: string, cur: boolean) => { await supabase.from('ewallets').update({ is_active: !cur }).eq('id', id); loadAll(); };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed right-5 top-5 z-50 flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold shadow-xl animate-[slideUp_0.2s_ease-out] ${toast.ok ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.ok ? '✓' : '✕'} {toast.msg}
        </div>
      )}

      <div>
        <h1 className="text-xl font-bold text-gray-900">Pengaturan</h1>
        <p className="mt-0.5 text-xs text-gray-400">Kelola informasi bisnis dan metode pembayaran</p>
      </div>

      {/* ── Informasi Bisnis ── */}
      <Card title="Informasi Bisnis" icon="🏢">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nama Bisnis" value={business.name} onChange={(v) => setBusiness({ ...business, name: v })} full />
          <Input label="Deskripsi" value={business.description} onChange={(v) => setBusiness({ ...business, description: v })} full />
          <Input label="Email" value={business.email} onChange={(v) => setBusiness({ ...business, email: v })} type="email" />
          <Input label="Nomor WhatsApp" value={business.whatsapp} onChange={(v) => setBusiness({ ...business, whatsapp: v })} placeholder="6281234567890" />
          <Input label="Alamat" value={business.address} onChange={(v) => setBusiness({ ...business, address: v })} full />
          <Input label="Jam Operasional (Weekday)" value={business.hours_weekday} onChange={(v) => setBusiness({ ...business, hours_weekday: v })} placeholder="Senin - Jumat: 08:00 - 22:00" />
          <Input label="Jam Operasional (Weekend)" value={business.hours_weekend} onChange={(v) => setBusiness({ ...business, hours_weekend: v })} placeholder="Sabtu - Minggu: 09:00 - 21:00" />
        </div>
        <SaveBtn onClick={() => saveSetting('business', business)} />
      </Card>

      {/* ── Biaya Tambahan ── */}
      <Card title="Biaya Tambahan" icon="💰">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-gray-500">Biaya Layanan</label>
            <input type="number" value={fees.service_fee} onChange={(e) => setFees({ ...fees, service_fee: parseInt(e.target.value) || 0 })} className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            <p className="mt-1 text-[11px] text-gray-400">{formatRupiah(fees.service_fee)}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500">Asuransi Perjalanan</label>
            <input type="number" value={fees.insurance_fee} onChange={(e) => setFees({ ...fees, insurance_fee: parseInt(e.target.value) || 0 })} className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            <p className="mt-1 text-[11px] text-gray-400">{formatRupiah(fees.insurance_fee)}</p>
          </div>
        </div>
        <SaveBtn onClick={() => saveSetting('fees', fees)} />
      </Card>

      {/* ── Sosial Media ── */}
      <Card title="Sosial Media" icon="📱">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Facebook" value={social.facebook} onChange={(v) => setSocial({ ...social, facebook: v })} placeholder="https://facebook.com/..." />
          <Input label="Instagram" value={social.instagram} onChange={(v) => setSocial({ ...social, instagram: v })} placeholder="https://instagram.com/..." />
          <Input label="Twitter / X" value={social.twitter} onChange={(v) => setSocial({ ...social, twitter: v })} placeholder="https://x.com/..." />
          <Input label="YouTube" value={social.youtube} onChange={(v) => setSocial({ ...social, youtube: v })} placeholder="https://youtube.com/..." />
        </div>
        <SaveBtn onClick={() => saveSetting('social', social)} />
      </Card>

      {/* ── Rekening Bank ── */}
      <Card title="Rekening Bank" icon="🏦" action={<button type="button" onClick={() => { setEditingBank(null); setShowBankForm(true); }} className="text-xs font-semibold text-[#2563FF] hover:underline">+ Tambah</button>}>
        {banks.length === 0 ? <p className="text-sm text-gray-300">Belum ada rekening</p> : (
          <div className="space-y-2">
            {banks.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 transition-colors hover:bg-[#F8FAFF]">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{b.bank_name}</p>
                  <p className="text-xs text-gray-400">{b.account_number} · {b.account_name}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${b.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  <button type="button" onClick={() => { setEditingBank(b); setShowBankForm(true); }} className="rounded-lg p-1.5 text-gray-300 hover:text-blue-600"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg></button>
                  <button type="button" onClick={() => toggleBank(b.id, b.is_active)} className="rounded-lg p-1.5 text-gray-300 hover:text-amber-600"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" /></svg></button>
                  <button type="button" onClick={() => deleteBank(b.id)} className="rounded-lg p-1.5 text-gray-300 hover:text-red-500"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ── E-Wallet ── */}
      <Card title="E-Wallet" icon="💳" action={<button type="button" onClick={() => { setEditingWallet(null); setShowWalletForm(true); }} className="text-xs font-semibold text-[#2563FF] hover:underline">+ Tambah</button>}>
        {ewallets.length === 0 ? <p className="text-sm text-gray-300">Belum ada e-wallet</p> : (
          <div className="space-y-2">
            {ewallets.map((w) => (
              <div key={w.id} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 transition-colors hover:bg-[#F8FAFF]">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{w.wallet_type}</p>
                  <p className="text-xs text-gray-400">{w.wallet_number} · {w.wallet_name}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${w.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  <button type="button" onClick={() => { setEditingWallet(w); setShowWalletForm(true); }} className="rounded-lg p-1.5 text-gray-300 hover:text-blue-600"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg></button>
                  <button type="button" onClick={() => toggleWallet(w.id, w.is_active)} className="rounded-lg p-1.5 text-gray-300 hover:text-amber-600"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" /></svg></button>
                  <button type="button" onClick={() => deleteWallet(w.id)} className="rounded-lg p-1.5 text-gray-300 hover:text-red-500"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modals */}
      {showBankForm && <Modal title={editingBank ? 'Edit Rekening' : 'Tambah Rekening'} onClose={() => { setShowBankForm(false); setEditingBank(null); }}>
        <BankForm bank={editingBank} onSave={saveBank} />
      </Modal>}
      {showWalletForm && <Modal title={editingWallet ? 'Edit E-Wallet' : 'Tambah E-Wallet'} onClose={() => { setShowWalletForm(false); setEditingWallet(null); }}>
        <WalletForm wallet={editingWallet} onSave={saveWallet} />
      </Modal>}
    </div>
  );
}

// ── Components ─────────────────────────────────────────────────────────────
function Card({ title, icon, children, action }: { title: string; icon: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/[0.04]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{icon}</span>
          <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', placeholder, full }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; full?: boolean }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="text-xs font-semibold text-gray-500">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
    </div>
  );
}

function SaveBtn({ onClick }: { onClick: () => void }) {
  return (
    <div className="mt-5 flex justify-end">
      <button type="button" onClick={onClick}
        className="rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:shadow-lg"
        style={{ background: 'linear-gradient(135deg, #2563FF, #1E40AF)' }}>
        Simpan Perubahan
      </button>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm animate-[slideUp_0.25s_ease-out] rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function BankForm({ bank, onSave }: { bank: BankAccount | null; onSave: (d: { bank_name: string; account_number: string; account_name: string }) => void }) {
  const [f, setF] = useState({ bank_name: bank?.bank_name || '', account_number: bank?.account_number || '', account_name: bank?.account_name || '' });
  return (
    <div className="space-y-4">
      <Input label="Nama Bank" value={f.bank_name} onChange={(v) => setF({ ...f, bank_name: v })} placeholder="BCA" />
      <Input label="Nomor Rekening" value={f.account_number} onChange={(v) => setF({ ...f, account_number: v })} />
      <Input label="Nama Pemilik" value={f.account_name} onChange={(v) => setF({ ...f, account_name: v })} />
      <button type="button" onClick={() => onSave(f)}
        className="w-full rounded-xl py-2.5 text-sm font-bold text-white"
        style={{ background: 'linear-gradient(135deg, #2563FF, #1E40AF)' }}>Simpan</button>
    </div>
  );
}

function WalletForm({ wallet, onSave }: { wallet: EWallet | null; onSave: (d: { wallet_type: string; wallet_number: string; wallet_name: string }) => void }) {
  const [f, setF] = useState({ wallet_type: wallet?.wallet_type || '', wallet_number: wallet?.wallet_number || '', wallet_name: wallet?.wallet_name || '' });
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-gray-500">Jenis E-Wallet</label>
        <select value={f.wallet_type} onChange={(e) => setF({ ...f, wallet_type: e.target.value })}
          className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
          <option value="">Pilih...</option>
          <option>OVO</option><option>GoPay</option><option>Dana</option><option>ShopeePay</option>
        </select>
      </div>
      <Input label="Nomor Tujuan" value={f.wallet_number} onChange={(v) => setF({ ...f, wallet_number: v })} />
      <Input label="Nama Pemilik" value={f.wallet_name} onChange={(v) => setF({ ...f, wallet_name: v })} />
      <button type="button" onClick={() => onSave(f)}
        className="w-full rounded-xl py-2.5 text-sm font-bold text-white"
        style={{ background: 'linear-gradient(135deg, #2563FF, #1E40AF)' }}>Simpan</button>
    </div>
  );
}
