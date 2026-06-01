-- Seller and Multi-Store Migration Script
-- Run this in your Supabase SQL Editor (https://supabase.com)

-- 1. CREATE PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    store_name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ALTER PRODUCTS TABLE TO LINK TO SELLER
ALTER TABLE products ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- 3. ALTER ORDER ITEMS TABLE TO LINK TO SELLER AND TRACK STATUS
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

-- 4. ENABLE RLS ON PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. PROFILES POLICIES
DROP POLICY IF EXISTS "Allow public read access on profiles" ON profiles;
CREATE POLICY "Allow public read access on profiles" 
ON profiles FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow user to insert their own profile" ON profiles;
CREATE POLICY "Allow user to insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Allow user to update their own profile" ON profiles;
CREATE POLICY "Allow user to update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- 6. PRODUCTS SELLER POLICIES
DROP POLICY IF EXISTS "Allow sellers to insert their own products" ON products;
CREATE POLICY "Allow sellers to insert their own products" 
ON products FOR INSERT 
WITH CHECK (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Allow sellers to update their own products" ON products;
CREATE POLICY "Allow sellers to update their own products" 
ON products FOR UPDATE 
USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Allow sellers to delete their own products" ON products;
CREATE POLICY "Allow sellers to delete their own products" 
ON products FOR DELETE 
USING (auth.uid() = seller_id);

-- 7. ORDER ITEMS SELLER POLICIES
DROP POLICY IF EXISTS "Allow sellers to update status of their order items" ON order_items;
CREATE POLICY "Allow sellers to update status of their order items" 
ON order_items FOR UPDATE 
USING (auth.uid() = seller_id);
