-- ============================================================
-- Row Level Security (RLS) untuk Octafkreasi
-- Jalankan script ini di Supabase SQL Editor
-- ============================================================

-- ─── ORDERS ─────────────────────────────────────────────────
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Admin can access all orders" ON orders;

CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
ON orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
ON orders FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admin can access all orders"
ON orders FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- ─── WISHLISTS ──────────────────────────────────────────────
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own wishlists" ON wishlists;
DROP POLICY IF EXISTS "Users can insert own wishlists" ON wishlists;
DROP POLICY IF EXISTS "Users can delete own wishlists" ON wishlists;

CREATE POLICY "Users can view own wishlists"
ON wishlists FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wishlists"
ON wishlists FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishlists"
ON wishlists FOR DELETE
USING (auth.uid() = user_id);

-- ─── REVIEWS ────────────────────────────────────────────────
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can insert own reviews" ON reviews;
DROP POLICY IF EXISTS "Admin can access all reviews" ON reviews;

CREATE POLICY "Users can view own reviews"
ON reviews FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reviews"
ON reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can access all reviews"
ON reviews FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- ─── TICKETS ────────────────────────────────────────────────
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tickets" ON tickets;
DROP POLICY IF EXISTS "Admin can access all tickets" ON tickets;
DROP POLICY IF EXISTS "Public can verify tickets by booking number" ON tickets;

CREATE POLICY "Users can view own tickets"
ON tickets FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admin can access all tickets"
ON tickets FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Public can verify tickets by booking number"
ON tickets FOR SELECT
USING (true);

-- ─── SETTINGS (public read, admin write) ────────────────────
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read settings" ON settings;
DROP POLICY IF EXISTS "Admin can manage settings" ON settings;

CREATE POLICY "Anyone can read settings"
ON settings FOR SELECT
USING (true);

CREATE POLICY "Admin can manage settings"
ON settings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- ─── BANK ACCOUNTS & EWALLETS (public read, admin write) ────
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read bank accounts" ON bank_accounts;
DROP POLICY IF EXISTS "Admin can manage bank accounts" ON bank_accounts;

CREATE POLICY "Anyone can read bank accounts"
ON bank_accounts FOR SELECT
USING (true);

CREATE POLICY "Admin can manage bank accounts"
ON bank_accounts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

ALTER TABLE ewallets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read ewallets" ON ewallets;
DROP POLICY IF EXISTS "Admin can manage ewallets" ON ewallets;

CREATE POLICY "Anyone can read ewallets"
ON ewallets FOR SELECT
USING (true);

CREATE POLICY "Admin can manage ewallets"
ON ewallets FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- ─── PROFILES ───────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;

CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- ============================================================
-- TAMBAH KOLOM verified_at (jika belum ada)
-- ============================================================
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ DEFAULT NULL;

-- ============================================================
-- CATATAN:
-- 1. Jalankan script ini di Supabase Dashboard > SQL Editor
-- 2. Kalau ada error "policy already exists", hapus dulu:
--    DROP POLICY "nama_policy" ON nama_tabel;
-- 3. Setelah RLS aktif, pastikan admin tetap bisa akses data
-- 4. Untuk data lama yang kecampur (user_id null), fix manual:
--    UPDATE orders SET user_id = 'uuid-user' WHERE customer_email = 'email@user.com' AND user_id IS NULL;
-- ============================================================
