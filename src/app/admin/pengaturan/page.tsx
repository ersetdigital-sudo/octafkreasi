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
  const [fonnte, setFonnte] = useState({ api_key: '', template: 'Halo Kak {nama},\n\nPembayaran perjalanan Anda telah berhasil dikonfirmasi.\n\nDetail Perjalanan:\nDestinasi: {destinasi}\nTanggal: {tanggal}\nPeserta: {peserta}\nKode Tiket: {kode_tiket}\n\nE-ticket: {link_tiket}\n\nTerima kasih telah memilih Octaf Kreasi. Selamat mempersiapkan perjalanan Anda!' });
  const [showApiKey, setShowApiKey] = useState(false);
  const [testingFonnte, setTestingFonnte] = useState(false);
  const [fonnteStatus, setFonnteStatus] = useState<'idle' | 'connected' | 'failed'>('idle');
  const [waLogs, setWaLogs] = useState<{ id: string; target: string; status: string; created_at: string }[]>([]);

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
        if (s.id === 'fonnte') setFonnte(prev => ({ ...prev, ...val }));
      }
    }
    setBanks(banksRes.data || []);
    setEwallets(ewalletsRes.data || []);

    // Load WA logs
    const { data: logs } = await supabase.from('wa_logs').select('id, target, status, created_at').order('created_at', { ascending: false }).limit(10);
    setWaLogs(logs || []);

    setLoading(false);
  };

  const showToast = (ok: boolean, msg: string) => { setToast({ ok, msg }); setTimeout(() => setToast(null), 3000); };

  const saveSetting = async (id: string, value: unknown) => {
    await supabase.from('settings').upsert({ id, value, updated_at: new Date().toISOString() });
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

      {/* ── Integrasi WhatsApp Fonnte ── */}
      <Card title="Integrasi WhatsApp (Fonnte)" icon="📲">
        <div className="space-y-4">
          {/* API Key */}
          <div>
            <label className="text-xs font-semibold text-gray-500">API Key Fonnte</label>
            <div className="mt-1.5 flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={fonnte.api_key}
                  onChange={(e) => setFonnte({ ...fonnte, api_key: e.target.value })}
                  placeholder="Masukkan API Key dari dashboard Fonnte"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-10 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button type="button" onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {showApiKey
                      ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      : <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>
                    }
                  </svg>
                </button>
              </div>
              <button type="button" onClick={async () => {
                if (!fonnte.api_key) { showToast(false, 'Masukkan API Key dulu'); return; }
                setTestingFonnte(true);
                try {
                  const res = await fetch('/api/fonnte/test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ apiKey: fonnte.api_key }) });
                  const data = await res.json();
                  setFonnteStatus(data.success ? 'connected' : 'failed');
                  showToast(data.success, data.success ? 'Terhubung ke Fonnte!' : data.error);
                } catch { setFonnteStatus('failed'); showToast(false, 'Gagal test koneksi'); }
                setTestingFonnte(false);
              }} disabled={testingFonnte}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 whitespace-nowrap">
                {testingFonnte ? '...' : 'Test Koneksi'}
              </button>
            </div>
            {fonnteStatus === 'connected' && <p className="mt-1.5 text-xs text-emerald-600 font-medium">✓ Terhubung</p>}
            {fonnteStatus === 'failed' && <p className="mt-1.5 text-xs text-red-500 font-medium">✕ Gagal terhubung</p>}
          </div>

          {/* Template */}
          <div>
            <label className="text-xs font-semibold text-gray-500">Template Pesan WhatsApp</label>
            <textarea
              value={fonnte.template}
              onChange={(e) => setFonnte({ ...fonnte, template: e.target.value })}
              rows={8}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-mono leading-relaxed focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
            <p className="mt-2 text-[11px] text-gray-400">
              Variabel: <code className="bg-gray-100 px-1 rounded">{'{nama}'}</code> <code className="bg-gray-100 px-1 rounded">{'{destinasi}'}</code> <code className="bg-gray-100 px-1 rounded">{'{tanggal}'}</code> <code className="bg-gray-100 px-1 rounded">{'{peserta}'}</code> <code className="bg-gray-100 px-1 rounded">{'{kode_tiket}'}</code> <code className="bg-gray-100 px-1 rounded">{'{link_tiket}'}</code>
            </p>
          </div>

          <SaveBtn onClick={() => saveSetting('fonnte', fonnte)} />
        </div>
      </Card>

      {/* ── Log Pengiriman WA ── */}
      {waLogs.length > 0 && (
        <Card title="Log Pengiriman WhatsApp" icon="📋">
          <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
            {waLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                <div>
                  <p className="text-xs font-mono text-gray-700">{log.target}</p>
                  <p className="text-[10px] text-gray-400">{new Date(log.created_at).toLocaleString('id-ID')}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${log.status === 'sent' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                  {log.status === 'sent' ? 'Terkirim' : 'Gagal'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

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
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleClick = async () => {
    setState('saving');
    await onClick();
    setState('saved');
    setTimeout(() => setState('idle'), 2500);
  };

  return (
    <div className="mt-5 flex justify-end">
      <button type="button" onClick={handleClick} disabled={state !== 'idle'}
        className={`relative overflow-hidden rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-300 disabled:cursor-not-allowed ${
          state === 'saved'
            ? 'bg-emerald-500 shadow-emerald-500/20'
            : state === 'saving'
            ? 'bg-blue-400 shadow-blue-400/20'
            : 'shadow-blue-600/20 hover:-translate-y-0.5 hover:shadow-lg'
        }`}
        style={state === 'idle' ? { background: 'linear-gradient(135deg, #2563FF, #1E40AF)' } : {}}>
        <span className={`inline-flex items-center gap-2 transition-all duration-200 ${state !== 'idle' ? 'opacity-0' : 'opacity-100'}`}>
          Simpan Perubahan
        </span>
        {state === 'saving' && (
          <span className="absolute inset-0 flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Menyimpan...
          </span>
        )}
        {state === 'saved' && (
          <span className="absolute inset-0 flex items-center justify-center gap-1.5 animate-[fadeIn_0.2s_ease-out]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Tersimpan
          </span>
        )}
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
