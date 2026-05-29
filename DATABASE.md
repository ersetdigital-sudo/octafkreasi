# Dokumentasi Database - Octaf Kreasi

Platform tour travel Indonesia menggunakan **Supabase (PostgreSQL)** sebagai database utama.

---

## Daftar Tabel

### 1. `profiles` — Data Profil User
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid (PK, FK → auth.users) | ID user dari Supabase Auth |
| full_name | text | Nama lengkap |
| role | text | `admin` atau `user` (customer) |
| phone | text | Nomor WhatsApp |
| status | text | `active` atau `inactive` |
| created_at | timestamptz | Tanggal daftar |

### 2. `destinations` — Data Destinasi Wisata
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid (PK) | ID destinasi |
| name | text | Nama destinasi |
| slug | text (unique) | URL slug |
| country | text | Provinsi/negara |
| description | text | Deskripsi lengkap |
| image | text | URL gambar utama |
| image_alt | text | Alt text gambar |
| price_start_from | integer | Harga mulai dari |
| duration | text | Durasi perjalanan |
| rating | numeric | Rating rata-rata |
| review_count | integer | Jumlah review |
| is_active | boolean | Status aktif/nonaktif |
| created_at | timestamptz | Tanggal dibuat |
| updated_at | timestamptz | Terakhir diupdate |

### 3. `activities` — Paket & Aktivitas per Destinasi
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid (PK) | ID aktivitas |
| destination_id | uuid (FK → destinations) | Destinasi terkait |
| name | text | Nama paket/aktivitas |
| description | text | Deskripsi |
| image | text | URL gambar |
| price | integer | Harga |
| duration | text | Durasi |
| rating | numeric | Rating |
| type | text | `package` atau `activity` |
| sort_order | integer | Urutan tampil |
| created_at | timestamptz | Tanggal dibuat |

### 4. `orders` — Data Pesanan
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid (PK) | ID pesanan |
| user_id | uuid (FK → auth.users) | User yang memesan |
| destination_slug | text | Slug destinasi |
| destination_name | text | Nama destinasi |
| package_name | text | Nama paket |
| package_duration | text | Durasi paket |
| date | text | Tanggal berangkat |
| adults | integer | Jumlah dewasa |
| children | integer | Jumlah anak |
| total_price | integer | Total harga |
| status | text | `pending`, `paid`, `confirmed`, `completed`, `cancelled` |
| payment_method | text | Metode pembayaran |
| customer_name | text | Nama pemesan |
| customer_email | text | Email pemesan |
| customer_phone | text | Telepon pemesan |
| created_at | timestamptz | Tanggal pesan |

### 5. `tickets` — E-Tiket Perjalanan
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid (PK) | ID tiket |
| order_id | uuid (FK → orders) | Pesanan terkait |
| user_id | uuid (FK → auth.users) | Pemilik tiket |
| booking_number | text | Nomor booking (OC-XXXX-XXXXX) |
| destination_name | text | Nama destinasi |
| ticket_status | text | `active`, `upcoming`, `checked_in`, `used`, `cancelled` |
| created_at | timestamptz | Tanggal terbit |

### 6. `reviews` — Ulasan Customer
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid (PK) | ID ulasan |
| user_id | uuid (FK → auth.users) | User yang review |
| destination_id | uuid (FK → destinations) | Destinasi yang direview |
| author | text | Nama penulis |
| rating | integer | Rating 1-5 |
| content | text | Isi ulasan |
| status | text | `pending`, `approved`, `rejected` |
| date | text | Tanggal review |
| helpful | integer | Jumlah helpful vote |
| created_at | timestamptz | Tanggal dibuat |

### 7. `blog_posts` — Artikel Blog
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid (PK) | ID artikel |
| title | text | Judul artikel |
| slug | text (unique) | URL slug |
| excerpt | text | Ringkasan singkat |
| content | text | Konten HTML (dari TipTap editor) |
| image | text | URL thumbnail (Cloudinary) |
| author | text | Nama penulis |
| category | text | Kategori artikel |
| status | text | `draft` atau `published` |
| read_time | text | Estimasi waktu baca |
| created_at | timestamptz | Tanggal dibuat |
| updated_at | timestamptz | Terakhir diupdate |

### 8. `wishlists` — Wishlist User
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid (PK) | ID wishlist |
| user_id | uuid (FK → auth.users) | User pemilik |
| destination_slug | text | Slug destinasi |
| destination_name | text | Nama destinasi |
| destination_image | text | URL gambar |
| created_at | timestamptz | Tanggal ditambahkan |

### 9. `promo_codes` — Kode Promo
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid (PK) | ID promo |
| code | text (unique) | Kode promo |
| discount_type | text | `percentage` atau `fixed` |
| discount_value | integer | Nilai diskon |
| min_purchase | integer | Minimum pembelian |
| max_discount | integer | Maksimum diskon |
| valid_until | timestamptz | Berlaku sampai |
| is_active | boolean | Status aktif |
| created_at | timestamptz | Tanggal dibuat |

### 10. `settings` — Pengaturan Website
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | text (PK) | Key pengaturan (`business`, `fees`, `fonnte`, `social`) |
| value | jsonb | Nilai pengaturan dalam format JSON |

### 11. `bank_accounts` — Rekening Bank
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid (PK) | ID rekening |
| bank_name | text | Nama bank |
| account_number | text | Nomor rekening |
| account_name | text | Nama pemilik |
| is_active | boolean | Status aktif |
| sort_order | integer | Urutan tampil |

### 12. `ewallets` — E-Wallet
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid (PK) | ID e-wallet |
| wallet_type | text | Jenis (GoPay, OVO, dll) |
| wallet_number | text | Nomor e-wallet |
| wallet_name | text | Nama pemilik |
| is_active | boolean | Status aktif |
| sort_order | integer | Urutan tampil |

### 13. `wa_logs` — Log Pengiriman WhatsApp
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid (PK) | ID log |
| target | text | Nomor tujuan |
| message | text | Isi pesan |
| order_id | uuid | Pesanan terkait |
| status | text | `sent` atau `failed` |
| response | text | Response dari Fonnte API |
| created_at | timestamptz | Tanggal kirim |

---

## Relasi Antar Tabel

```
auth.users (Supabase Auth)
    │
    ├── profiles (1:1) ─── role menentukan akses admin
    ├── orders (1:N) ─── pesanan milik user
    │       └── tickets (1:N) ─── tiket dari pesanan
    ├── wishlists (1:N) ─── destinasi favorit
    └── reviews (1:N) ─── ulasan user

destinations
    ├── activities (1:N) ─── paket & aktivitas
    └── reviews (1:N) ─── ulasan per destinasi

settings ─── konfigurasi global (JSON)
bank_accounts ─── metode pembayaran transfer
ewallets ─── metode pembayaran e-wallet
promo_codes ─── kode diskon
blog_posts ─── artikel blog
wa_logs ─── log notifikasi WhatsApp
```

---

## RLS (Row Level Security) Policy

| Tabel | Policy | Keterangan |
|-------|--------|------------|
| profiles | Users bisa baca/update profil sendiri | Admin bisa baca semua |
| orders | Users bisa baca pesanan sendiri | Admin bisa baca/update semua |
| tickets | Users bisa baca tiket sendiri | Admin bisa baca semua |
| wishlists | Users bisa CRUD wishlist sendiri | - |
| reviews | Semua bisa baca (approved) | Users bisa insert sendiri |
| destinations | Semua bisa baca (is_active) | Admin bisa CRUD |
| activities | Semua bisa baca | Admin bisa CRUD |
| blog_posts | Semua bisa baca (published) | Admin bisa CRUD |
| settings | Admin only | - |
| bank_accounts | Semua bisa baca (is_active) | Admin bisa CRUD |
| ewallets | Semua bisa baca (is_active) | Admin bisa CRUD |

> **Catatan**: Tabel `profiles` dan `tickets` saat ini menggunakan policy UNRESTRICTED di Supabase. Untuk production, sebaiknya ditambahkan RLS yang lebih ketat.

---

## Contoh Query yang Sering Digunakan

```sql
-- Ambil semua pesanan user tertentu
SELECT * FROM orders WHERE user_id = 'uuid-user' ORDER BY created_at DESC;

-- Hitung total revenue (pesanan lunas)
SELECT SUM(total_price) FROM orders WHERE status IN ('paid', 'confirmed', 'completed');

-- Ambil destinasi aktif dengan rating
SELECT * FROM destinations WHERE is_active = true ORDER BY rating DESC;

-- Ambil review yang sudah approved untuk destinasi tertentu
SELECT * FROM reviews WHERE destination_id = 'uuid-dest' AND status = 'approved' ORDER BY created_at DESC;

-- Ambil blog yang published
SELECT * FROM blog_posts WHERE status = 'published' ORDER BY created_at DESC;

-- Hitung rata-rata rating destinasi dari reviews
SELECT AVG(rating) FROM reviews WHERE destination_id = 'uuid-dest' AND status = 'approved';

-- Ambil tiket aktif user
SELECT * FROM tickets WHERE user_id = 'uuid-user' AND ticket_status NOT IN ('used', 'cancelled');
```


---

## SQL Script — Buat Semua Tabel dari Awal

Jalankan script ini di **Supabase SQL Editor** untuk membuat semua tabel yang dibutuhkan.

```sql
-- ============================================================
-- 1. PROFILES — Profil user (terhubung ke Supabase Auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. DESTINATIONS — Destinasi wisata
-- ============================================================
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  country TEXT,
  description TEXT,
  image TEXT,
  image_alt TEXT,
  price_start_from INTEGER DEFAULT 0,
  duration TEXT,
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. ACTIVITIES — Paket & aktivitas per destinasi
-- ============================================================
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  price INTEGER DEFAULT 0,
  duration TEXT,
  rating NUMERIC(3,2) DEFAULT 4.5,
  type TEXT DEFAULT 'activity' CHECK (type IN ('package', 'activity')),
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. ORDERS — Pesanan customer
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  destination_slug TEXT,
  destination_name TEXT NOT NULL,
  package_name TEXT,
  package_duration TEXT,
  date TEXT,
  adults INTEGER DEFAULT 1,
  children INTEGER DEFAULT 0,
  total_price INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'confirmed', 'completed', 'cancelled')),
  payment_method TEXT,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. TICKETS — E-Tiket perjalanan
-- ============================================================
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  booking_number TEXT NOT NULL,
  destination_name TEXT,
  ticket_status TEXT DEFAULT 'active' CHECK (ticket_status IN ('active', 'upcoming', 'checked_in', 'used', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. REVIEWS — Ulasan customer
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  author TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  date TEXT,
  helpful INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. BLOG_POSTS — Artikel blog
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  image TEXT,
  author TEXT DEFAULT 'Tim Octafkreasi',
  category TEXT DEFAULT 'Tips Travel',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  read_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. WISHLISTS — Wishlist destinasi favorit
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  destination_slug TEXT NOT NULL,
  destination_name TEXT,
  destination_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, destination_slug)
);

-- ============================================================
-- 9. PROMO_CODES — Kode promo diskon
-- ============================================================
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INTEGER DEFAULT 0,
  min_purchase INTEGER DEFAULT 0,
  max_discount INTEGER,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. SETTINGS — Pengaturan website (key-value JSON)
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  value JSONB
);

-- Insert default settings
INSERT INTO settings (id, value) VALUES
  ('business', '{"name": "Octaf Kreasi", "description": "Jasa Tour Travel Terpercaya", "email": "", "whatsapp": "", "address": ""}'),
  ('fees', '{"service_fee": 100000, "insurance_fee": 150000}'),
  ('social', '{"facebook": "", "instagram": "", "twitter": "", "youtube": ""}'),
  ('fonnte', '{"api_key": "", "template": ""}')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 11. BANK_ACCOUNTS — Rekening bank untuk pembayaran
-- ============================================================
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 1
);

-- ============================================================
-- 12. EWALLETS — E-Wallet untuk pembayaran
-- ============================================================
CREATE TABLE IF NOT EXISTS ewallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_type TEXT NOT NULL,
  wallet_number TEXT NOT NULL,
  wallet_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 1
);

-- ============================================================
-- 13. WA_LOGS — Log pengiriman WhatsApp
-- ============================================================
CREATE TABLE IF NOT EXISTS wa_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target TEXT,
  message TEXT,
  order_id UUID,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed')),
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## RLS Policy Script

```sql
-- Aktifkan RLS di semua tabel
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- PROFILES: User bisa baca & update profil sendiri
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ORDERS: User bisa baca pesanan sendiri
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- TICKETS: User bisa baca tiket sendiri
CREATE POLICY "Users can view own tickets" ON tickets FOR SELECT USING (auth.uid() = user_id);

-- WISHLISTS: User bisa CRUD wishlist sendiri
CREATE POLICY "Users can manage own wishlists" ON wishlists FOR ALL USING (auth.uid() = user_id);

-- REVIEWS: Semua bisa baca, user bisa insert sendiri
CREATE POLICY "Anyone can read approved reviews" ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can create own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tabel publik (tanpa RLS ketat): destinations, activities, blog_posts, settings, bank_accounts, ewallets
-- Bisa diakses semua orang untuk read, admin untuk write
```
