# Octaf Kreasi — Platform Tour Travel Indonesia

Website booking tour travel Indonesia dengan fitur lengkap: destinasi, pemesanan, e-tiket, blog, dan admin dashboard.

**Tech Stack**: Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase · TipTap · Fonnte (WhatsApp)

**Live**: [octafkreasi.com](https://www.octafkreasi.com)

---

## Setup & Development

### Prerequisites
- Node.js 18+
- npm atau yarn
- Akun Supabase (untuk database & auth)

### Instalasi

```bash
# Clone repository
git clone https://github.com/ersetdigital-sudo/octafkreasi.git
cd octafkreasi

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Development

```bash
npm run dev      # Jalankan development server (localhost:3000)
npm run build    # Build production
npm run lint     # Jalankan ESLint
npm run test     # Jalankan unit tests
```

---

## Struktur Folder

```
src/
├── app/                    # Halaman (Next.js App Router)
│   ├── admin/              # Admin dashboard (semua halaman admin)
│   │   ├── blog/           # Kelola blog & tulis artikel
│   │   ├── destinasi/      # Kelola destinasi
│   │   ├── paket/          # Kelola paket & aktivitas
│   │   ├── pesanan/        # Kelola pesanan
│   │   ├── tiket/          # Kelola tiket
│   │   ├── promo/          # Kelola promo
│   │   ├── user/           # Kelola user (customer management)
│   │   ├── ulasan/         # Kelola ulasan
│   │   ├── verifikasi/     # Verifikasi pembayaran
│   │   ├── pengaturan/     # Pengaturan website
│   │   └── login/          # Login admin
│   ├── akun/               # Halaman akun customer
│   │   ├── pesanan/[id]/   # Detail pesanan
│   │   └── tiket/          # E-Tiket customer
│   ├── api/                # API Routes
│   │   └── fonnte/         # WhatsApp API (send & test)
│   ├── auth/callback/      # OAuth callback handler
│   ├── blog/               # Blog publik
│   ├── booking/[step]/     # Multi-step booking
│   ├── destinasi/          # Daftar & detail destinasi
│   ├── login/              # Login customer
│   ├── register/           # Register customer
│   └── ...                 # Halaman statis lainnya
│
├── components/             # Komponen React
│   ├── layout/             # Header, Footer
│   ├── sections/           # Section-level components (Hero, Reviews, dll)
│   └── ui/                 # Reusable UI (Button, Badge, StarRating, dll)
│
├── data/                   # Data statis & mock
│   ├── destinations.ts     # Data destinasi hardcoded (fallback)
│   ├── navigation.ts       # Menu navigasi
│   ├── categories.ts       # Kategori travel
│   └── ...                 # Data lainnya
│
├── lib/                    # Core logic & utilities
│   ├── supabase.ts         # Supabase client
│   ├── auth-context.tsx    # Auth provider & hook
│   ├── wishlist-context.tsx # Wishlist provider & hook
│   ├── admin.ts            # Admin utilities & CRUD
│   ├── orders.ts           # Order operations
│   ├── settings.ts         # Business settings
│   ├── pricing.ts          # Kalkulasi harga & promo
│   ├── validation.ts       # Validasi form
│   ├── format.ts           # Format rupiah, rating, stars
│   ├── utils.ts            # Utility functions
│   ├── booking-store.ts    # Booking state (sessionStorage)
│   └── wishlist.ts         # Wishlist CRUD
│
├── types/                  # TypeScript type definitions
│   └── index.ts            # Semua interface & type
│
└── test/                   # Test configuration
    └── setup.ts
```

---

## Fitur Utama

### Customer
- 🏝️ Jelajahi destinasi wisata Indonesia
- 📦 Booking paket perjalanan (multi-step)
- 🎫 E-Tiket digital dengan QR code
- ❤️ Wishlist destinasi favorit
- ⭐ Tulis ulasan perjalanan
- 📱 Responsive (mobile-first)

### Admin Dashboard
- 📊 Overview statistik bisnis
- 🗺️ CRUD destinasi & paket
- 📋 Kelola pesanan & update status
- 🎫 Terbitkan tiket otomatis
- 📝 Blog editor (TipTap rich text)
- 👥 Customer management dengan insight
- 💬 Notifikasi WhatsApp otomatis (Fonnte)
- ⚙️ Pengaturan bisnis, pembayaran, promo

---

## Struktur Database

Dokumentasi lengkap database tersedia di [DATABASE.md](./DATABASE.md), termasuk:
- Daftar semua tabel & kolom
- Relasi antar tabel
- RLS policy
- Contoh query

---

## Deployment

Project di-deploy menggunakan **Vercel** dengan auto-deploy dari branch `main`.

```bash
# Build check sebelum push
npm run build

# Push ke main (auto-deploy)
git push origin main
```

---

## Kontak

- Website: [octafkreasi.com](https://www.octafkreasi.com)
- WhatsApp: Tersedia di halaman Bantuan
