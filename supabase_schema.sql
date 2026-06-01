-- Setup SQL script for ShreeSasto Supabase Database
-- Run this in your Supabase SQL Editor (https://supabase.com)

-- 1. DROP TABLES (for clean setup if they already exist, in reverse order of foreign keys)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;

-- 2. CREATE PRODUCTS TABLE
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    features TEXT[] NOT NULL DEFAULT '{}',
    rating NUMERIC(3, 2) NOT NULL DEFAULT 0.0,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE ORDERS TABLE
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    total NUMERIC(10, 2) NOT NULL,
    shipping_name TEXT NOT NULL,
    shipping_email TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
);

-- 4. CREATE ORDER ITEMS TABLE
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price NUMERIC(10, 2) NOT NULL
);

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 6. CREATE RLS POLICIES

-- Products Policies: Anyone can view, only authenticated/service role can write
CREATE POLICY "Allow public select on products" 
ON products FOR SELECT 
USING (true);

-- Orders Policies: Anyone can insert an order, anyone can read an order if they know the UUID
CREATE POLICY "Allow public insert on orders" 
ON orders FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public select on orders" 
ON orders FOR SELECT 
USING (true);

-- Order Items Policies: Anyone can insert items, anyone can select items
CREATE POLICY "Allow public insert on order_items" 
ON order_items FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public select on order_items" 
ON order_items FOR SELECT 
USING (true);

-- 7. SEED PRODUCTS DATA
INSERT INTO products (id, name, price, image_url, category, description, features, rating, stock)
VALUES 
(
  '1', 
  'ShreeSasto H1', 
  299.99, 
  '/assets/headphones.png', 
  'Electronics', 
  'Premium wireless over-ear headphones with custom hybrid active noise cancellation, high-resolution audio drivers, and 45-hour battery life. Designed for seamless comfort and studio-quality sound.', 
  ARRAY[
    'Hybrid Active Noise Cancellation (up to 42dB)',
    'Custom 40mm Dynamic Hi-Res Drivers',
    '45-Hour Battery Life with Fast Charge',
    'Bluetooth 5.3 with Multipoint connectivity',
    'Plush Protein Leather and Memory Foam Earcups'
  ], 
  4.8, 
  12
),
(
  '2', 
  'KeebStudio K65', 
  189.99, 
  '/assets/keyboard.png', 
  'Electronics', 
  'A premium 65% mechanical keyboard featuring hot-swappable linear switches, double-shot dye-sub keycaps, and a solid oak-accented casing. Tuned sound dampening foam provides a deep, signature ''thock'' acoustics.', 
  ARRAY[
    '65% Compact Space-Saving Layout',
    'Hot-Swappable Switch Sockets',
    'Durable PBT Dye-Sub Keycaps',
    'Gasket Mounted Design',
    'Dual Connection (USB-C & Bluetooth 5.1)'
  ], 
  4.9, 
  5
),
(
  '3', 
  'Nomad Roll-Top Pack', 
  145.00, 
  '/assets/backpack.png', 
  'Lifestyle', 
  'The ultimate daily commuter backpack crafted from ultra-durable, weather-resistant ballistic nylon. Features an expandable roll-top main compartment, dedicated laptop pocket, and ergonomic back support.', 
  ARRAY[
    'Waterproof Ballistic Nylon & YKK Zippers',
    'Expandable Volume (20L to 30L)',
    'Dedicated Padded 16-inch Laptop Pocket',
    'Ergonomic Back Panel & Shoulder Straps',
    'Quick-Access Front Pocket & Key Loop'
  ], 
  4.7, 
  20
),
(
  '4', 
  'Luminal Ambient Lamp', 
  79.00, 
  '/assets/lamp.png', 
  'Desk Setup', 
  'A modern desk lamp featuring a solid wood base, sandblasted aluminum arm, and adjustable warm ambient light control. Dimmable LED bulb creates the perfect cozy environment for late-night focus sessions.', 
  ARRAY[
    'Premium FSC-Certified Solid Oak Base',
    'Adjustable Sandblasted Aluminum Arm',
    'Touch-Sensitive Stepless Dimming Control',
    'Energy-Efficient 2700K Warm LED Bulb',
    'Woven Fabric Power Cable'
  ], 
  4.6, 
  8
);
