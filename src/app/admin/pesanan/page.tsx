'use client';

import React, { useEffect, useState, useRef } from 'react';
import { getAdminOrders, updateOrderStatus } from '@/lib/admin';
import { formatRupiah } from '@/lib/format';
import { supabase } from '@/lib/supabase';

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface Order {
  id: string;
  user_id: string;
  destination_slug: string;
  destination_name: string;
  package_name: string | null;
  package_duration: string | null;
  date: string | null;
  adults: number;
  children: number;
  total_price: number;
  status: string;
  payment_method: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  created_at: string;
}

interface Ticket {
  id: string;
  booking_number: string;
  ticket_status: string;
  destination_name: string;
}

// â”€â”€ Config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const STATUS_CONFIG: Record<string, { label: string; bg: string }> = {
  pending:   { label: 'Menunggu',     bg: 'bg-[#EAB308]' },
  paid:      { label: 'Lunas',        bg: 'bg-[#22C55E]' },
  confirmed: { label: 'Dikonfirmasi', bg: 'bg-[#3B82F6]' },
  completed: { label: 'Selesai',      bg: 'bg-[#64748B]' },
  cancelled: { label: 'Dibatalkan',   bg: 'bg-[#EF4444]' },
};

const STATUS_ACTIONS: Record<string, { value: string; label: string; icon: 'check' | 'x'; color: string }[]> = {
  pending:   [
    { value: 'paid',      label: 'Tandai Lunas', icon: 'check', color: '#16A34A' },
    { value: 'cancelled', label: 'Batalkan',     icon: 'x',     color: '#DC2626' },
  ],
  paid:      [
    { value: 'confirmed', label: 'Konfirmasi',   icon: 'check', color: '#2563EB' },
    { value: 'cancelled', label: 'Batalkan',     icon: 'x',     color: '#DC2626' },
  ],
  confirmed: [
    { value: 'completed', label: 'Selesai',      icon: 'check', color: '#475569' },
    { value: 'cancelled', label: 'Batalkan',     icon: 'x',     color: '#DC2626' },
  ],
};

const FILTER_TABS = [
  { value: 'all',       label: 'Semua' },
  { value: 'pending',   label: 'Menunggu' },
  { value: 'paid',      label: 'Lunas' },
  { value: 'confirmed', label: 'Dikonfirmasi' },
  { value: 'completed', label: 'Selesai' },
  { value: 'cancelled', label: 'Dibatalkan' },
];

// Mask phone number: 081573059442 → 0815****9442
function maskPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.length <= 6) return clean;
  return clean.slice(0, 4) + '****' + clean.slice(-4);
}

const TICKET_STATUS: Record<string, { label: string; color: string }> = {
  active:     { label: 'Aktif',      color: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  upcoming:   { label: 'Upcoming',   color: 'bg-blue-50 text-blue-700 ring-blue-200' },
  checked_in: { label: 'Check-in',   color: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
  used:       { label: 'Digunakan',  color: 'bg-slate-50 text-slate-600 ring-slate-200' },
  cancelled:  { label: 'Dibatalkan', color: 'bg-red-50 text-red-600 ring-red-200' },
};

// â”€â”€ Row helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Row({ label, value, bold, capitalize, badge, badgeBg }: {
  label: string; value: string;
  bold?: boolean; capitalize?: boolean;
  badge?: boolean; badgeBg?: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-[#F8FAFF]">
      <span style={{ fontSize: '13px', color: '#94A3B8' }}>{label}</span>
      {badge && badgeBg ? (
        <span className={`inline-block text-white text-xs font-bold ${badgeBg}`}
          style={{ borderRadius: '6px', padding: '3px 10px' }}>{value}</span>
      ) : (
        <span style={{
          fontSize: '14px', color: '#0F172A',
          fontWeight: bold ? 600 : 400,
          textTransform: capitalize ? 'capitalize' : 'none',
          maxWidth: '260px', textAlign: 'right',
        }}>{value}</span>
      )}
    </div>
  );
}

// â”€â”€ Status Dropdown â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function StatusDropdown({ order, onUpdate, isUpdating }: {
  order: Order;
  onUpdate: (id: string, status: string) => void;
  isUpdating: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const actions = STATUS_ACTIONS[order.status] || [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node) && btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleOpen = () => {
    if (actions.length === 0) return;
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 6, left: rect.left });
    }
    setOpen((v) => !v);
  };

  const handleSelect = (value: string) => {
    setOpen(false);
    if (value === 'cancelled' && !confirm('Batalkan pesanan ini?')) return;
    onUpdate(order.id, value);
  };

  return (
    <>
      <div className="relative">
        <button type="button" ref={btnRef}
          onClick={handleOpen}
          disabled={isUpdating || actions.length === 0}
          className={`inline-flex items-center gap-1.5 text-white transition-all ${cfg.bg} ${actions.length > 0 ? 'cursor-pointer hover:opacity-90' : 'cursor-default'} disabled:opacity-60`}
          style={{ borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 600 }}>
          {isUpdating ? (
            <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : cfg.label}
          {actions.length > 0 && !isUpdating && (
            <svg className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Desktop dropdown — fixed position */}
      {open && (
        <>
          {/* Desktop */}
          <div ref={ref} className="hidden md:block fixed z-[100] w-44 animate-[fadeIn_0.15s_ease-out] rounded-xl bg-white py-1"
            style={{ top: pos.top, left: pos.left, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #F1F5F9' }}>
            {actions.map((action, i) => (
              <React.Fragment key={action.value}>
                {action.icon === 'x' && i > 0 && <div className="my-1 border-t border-gray-100" />}
                <button type="button" onClick={() => handleSelect(action.value)}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] font-medium transition-colors hover:bg-[#F8FAFF]"
                  style={{ color: action.color }}>
                  {action.icon === 'check' ? (
                    <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {action.label}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Mobile bottom sheet */}
          <div className="md:hidden fixed inset-0 z-[100]">
            <div className="absolute inset-0 bg-black/30 animate-[fadeIn_0.15s_ease-out]" onClick={() => setOpen(false)} />
            <div className="absolute bottom-0 left-0 right-0 animate-[slideUp_0.2s_ease-out] rounded-t-2xl bg-white pb-8 pt-3">
              <div className="flex justify-center mb-3"><div className="h-1 w-10 rounded-full bg-gray-200" /></div>
              <p className="px-5 pb-3 text-sm font-bold text-gray-800">Ubah Status Pesanan</p>
              {actions.map((action, i) => (
                <React.Fragment key={action.value}>
                  {action.icon === 'x' && i > 0 && <div className="mx-5 my-1 border-t border-gray-100" />}
                  <button type="button" onClick={() => handleSelect(action.value)}
                    className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-[15px] font-medium transition-colors active:bg-gray-50"
                    style={{ color: action.color }}>
                    {action.icon === 'check' ? (
                      <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {action.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

// â”€â”€ Order Detail Drawer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function OrderDrawer({ order, onClose }: { order: Order; onClose: () => void }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  useEffect(() => {
    supabase.from('tickets').select('*').eq('order_id', order.id)
      .then(({ data }) => { setTickets(data || []); setLoadingTickets(false); });
  }, [order.id]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 animate-[fadeIn_0.2s_ease-out]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white shadow-2xl animate-[slideInRight_0.25s_ease-out] md:w-[480px]"
        style={{ overflowY: 'auto' }}>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F1F5F9] px-6 py-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div>
              <p className="font-mono text-sm font-bold text-[#0F172A]">#{order.id.slice(0, 8)}</p>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <span className={`inline-block text-white text-xs font-bold ${cfg.bg}`}
              style={{ borderRadius: '6px', padding: '3px 10px' }}>{cfg.label}</span>
          </div>
          <button type="button" onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 px-6 py-5 space-y-6">

          {/* Informasi Perjalanan */}
          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">Informasi Perjalanan</p>
            <div className="rounded-xl border border-[#F1F5F9] overflow-hidden divide-y divide-[#F8FAFF]">
              <Row label="Destinasi" value={order.destination_name} bold />
              {order.package_name && <Row label="Paket" value={order.package_name} />}
              <Row label="Tanggal Berangkat" value={order.date
                ? new Date(order.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                : 'â€”'} />
              {order.package_duration && <Row label="Durasi" value={order.package_duration} />}
              <Row label="Peserta" value={`${order.adults} Dewasa${order.children > 0 ? `, ${order.children} Anak` : ''}`} />
            </div>
          </section>

          {/* Informasi Pembayaran */}
          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">Informasi Pembayaran</p>
            <div className="rounded-xl border border-[#F1F5F9] overflow-hidden divide-y divide-[#F8FAFF]">
              <Row label="Total Harga" value={formatRupiah(order.total_price)} bold />
              <Row label="Status" value={cfg.label} badge badgeBg={cfg.bg} />
              {order.payment_method && <Row label="Metode Bayar" value={order.payment_method.replace(/-/g, ' ')} capitalize />}
              <Row label="Tanggal Order" value={new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} />
            </div>
          </section>

          {/* Informasi Customer */}
          {(order.customer_name || order.customer_email || order.customer_phone) && (
            <section>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">Informasi Customer</p>
              <div className="rounded-xl border border-[#F1F5F9] overflow-hidden divide-y divide-[#F8FAFF]">
                {order.customer_name && <Row label="Nama" value={order.customer_name} bold />}
                {order.customer_email && <Row label="Email" value={order.customer_email} />}
                {order.customer_phone && <Row label="Telepon" value={maskPhone(order.customer_phone)} />}
              </div>
            </section>
          )}

          {/* Tiket */}
          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">Tiket</p>
            {loadingTickets ? (
              <div className="space-y-2">
                {[1, 2].map(i => <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-50" />)}
              </div>
            ) : tickets.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#E2E8F0] px-4 py-6 text-center">
                <p className="text-sm text-[#94A3B8]">Belum ada tiket untuk pesanan ini</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tickets.map((ticket) => {
                  const ts = TICKET_STATUS[ticket.ticket_status] || TICKET_STATUS.active;
                  return (
                    <div key={ticket.id}
                      className="flex items-center justify-between rounded-xl border border-[#F1F5F9] px-4 py-3 transition-colors hover:bg-[#F8FAFF]">
                      <div>
                        <p className="font-mono text-sm font-bold text-[#0F172A]">{ticket.booking_number}</p>
                        <p className="text-xs text-[#94A3B8] mt-0.5">{ticket.destination_name}</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${ts.color}`}>
                        {ts.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

// â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function AdminPesananPage() {
  const [orders, setOrders]               = useState<Order[]>([]);
  const [loading, setLoading]             = useState(true);
  const [filter, setFilter]               = useState('all');
  const [search, setSearch]               = useState('');
  const [updatingId, setUpdatingId]       = useState<string | null>(null);
  const [toast, setToast]                 = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => { loadData(); }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    setLoading(true);
    const data = await getAdminOrders(filter);
    setOrders(data);
    setLoading(false);
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    const { error } = await updateOrderStatus(id, newStatus);
    setUpdatingId(null);
    if (error) { showToast('error', 'Gagal mengubah status'); return; }
    showToast('success', `Status diubah ke ${STATUS_CONFIG[newStatus]?.label}`);

    // Auto-send WhatsApp when status changed to "paid"
    if (newStatus === 'paid') {
      const order = orders.find(o => o.id === id);
      if (order && order.customer_phone) {
        try {
          // Get template from settings
          const { data: fonnteSettings } = await supabase.from('settings').select('value').eq('id', 'fonnte').single();
          if (fonnteSettings?.value) {
            const val = typeof fonnteSettings.value === 'string' ? JSON.parse(fonnteSettings.value) : fonnteSettings.value;
            if (val.api_key && val.template) {
              const peserta = `${order.adults} Dewasa${order.children > 0 ? `, ${order.children} Anak` : ''}`;

              // Fetch booking_number dari tiket terkait
              const { data: ticketData } = await supabase.from('tickets').select('booking_number').eq('order_id', id).limit(1).single();
              const kodeTicket = ticketData?.booking_number || `OC-${id.slice(0, 8).toUpperCase()}`;

              const message = val.template
                .replace('{nama}', order.customer_name || 'Pelanggan')
                .replace('{destinasi}', order.destination_name)
                .replace('{tanggal}', order.date || '-')
                .replace('{peserta}', peserta)
                .replace('{kode_tiket}', kodeTicket)
                .replace('{link_tiket}', `https://www.octafkreasi.com/akun/tiket`);

              await fetch('/api/fonnte/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target: order.customer_phone, message, orderId: id }),
              });
              showToast('success', 'Notifikasi WhatsApp terkirim');
            }
          }
        } catch { /* silent fail — WA is bonus, not critical */ }
      }
    }

    loadData();
  };

  const filtered = orders.filter((o) =>
    o.destination_name.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase())
  );

  const counts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'â€”';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-4">

      {/* Toast */}
      {toast && (
        <div className={`fixed right-5 top-5 z-50 flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold shadow-xl animate-[slideUp_0.2s_ease-out] ${
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success'
            ? <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            : <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          }
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Kelola Pesanan</h1>
        <button type="button" onClick={loadData}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 shadow-sm transition hover:bg-gray-50">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-72">
        <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari ID atau destinasi..."
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* Filter Tabs */}
        <div className="flex gap-0 overflow-x-auto border-b border-gray-200 px-1">
          {FILTER_TABS.map((tab) => {
            const count = tab.value === 'all' ? orders.length : (counts[tab.value] || 0);
            const isActive = filter === tab.value;
            return (
              <button key={tab.value} type="button" onClick={() => setFilter(tab.value)}
                className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-3.5 text-[13px] font-medium transition-colors ${
                  isActive ? 'text-[#2563FF]' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {tab.label}
                {count > 0 && (
                  <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                    isActive ? 'bg-[#2563FF] text-white' : 'bg-gray-100 text-gray-500'
                  }`}>{count}</span>
                )}
                {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#2563FF]" />}
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#0F172A' }}>
                {[
                  { label: 'ID PESANAN', cls: 'w-[150px]' },
                  { label: 'DESTINASI', cls: '' },
                  { label: 'TANGGAL', cls: 'hidden md:table-cell' },
                  { label: 'PESERTA', cls: 'hidden sm:table-cell' },
                  { label: 'TOTAL', cls: 'hidden sm:table-cell' },
                  { label: 'STATUS', cls: '' },
                  { label: 'AKSI', cls: 'text-right' },
                ].map((col, i) => (
                  <th key={i} className={`px-4 text-left text-white ${col.cls}`}
                    style={{ height: '48px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', borderRight: i < 6 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} style={{ height: '52px', borderBottom: '1px solid #E2E8F0' }} className="animate-pulse">
                    <td className="px-4"><div className="h-3 w-20 rounded bg-gray-100" /></td>
                    <td className="px-4"><div className="h-3 w-32 rounded bg-gray-100" /></td>
                    <td className="hidden px-4 md:table-cell"><div className="h-3 w-24 rounded bg-gray-100" /></td>
                    <td className="hidden px-4 sm:table-cell"><div className="h-3 w-16 rounded bg-gray-100" /></td>
                    <td className="hidden px-4 sm:table-cell"><div className="h-3 w-20 rounded bg-gray-100" /></td>
                    <td className="px-4"><div className="h-6 w-20 rounded bg-gray-100" /></td>
                    <td className="px-4"><div className="h-6 w-6 rounded bg-gray-100 ml-auto" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-16 text-center text-sm text-gray-400">Tidak ada pesanan ditemukan</td></tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="transition-colors duration-150 hover:bg-[#F8FAFF]"
                    style={{ height: '52px', borderBottom: '1px solid #E2E8F0' }}>

                    <td className="px-4" style={{ borderRight: '1px solid #F1F5F9' }}>
                      <p className="font-mono font-bold text-[#0F172A]" style={{ fontSize: '13px' }}>#{order.id.slice(0, 8)}</p>
                      <p style={{ fontSize: '11px', color: '#94A3B8' }}>
                        {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </p>
                    </td>

                    <td className="px-4" style={{ borderRight: '1px solid #F1F5F9' }}>
                      <p className="font-bold text-[#0F172A]" style={{ fontSize: '13px' }}>{order.destination_name}</p>
                      {order.package_name && (
                        <p className="truncate max-w-[200px]" style={{ fontSize: '12px', color: '#94A3B8' }}>{order.package_name}</p>
                      )}
                    </td>

                    <td className="hidden px-4 md:table-cell" style={{ borderRight: '1px solid #F1F5F9', fontSize: '13px', color: '#475569' }}>
                      {formatDate(order.date)}
                    </td>

                    <td className="hidden px-4 sm:table-cell" style={{ borderRight: '1px solid #F1F5F9', fontSize: '13px', color: '#475569' }}>
                      {order.adults}D{order.children > 0 ? ` ${order.children}A` : ''}
                    </td>

                    <td className="hidden px-4 sm:table-cell" style={{ borderRight: '1px solid #F1F5F9', fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                      {formatRupiah(order.total_price)}
                    </td>

                    <td className="px-4" style={{ borderRight: '1px solid #F1F5F9' }}>
                      <StatusDropdown order={order} onUpdate={handleUpdateStatus} isUpdating={updatingId === order.id} />
                    </td>

                    <td className="px-4">
                      <div className="flex justify-end">
                        <button type="button" onClick={() => setSelectedOrder(order)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          title="Lihat detail">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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

        {!loading && filtered.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-2.5">
            <p className="text-xs text-gray-400">
              Menampilkan <span className="font-semibold text-gray-600">{filtered.length}</span> dari <span className="font-semibold text-gray-600">{orders.length}</span> pesanan
            </p>
          </div>
        )}
      </div>

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <OrderDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
