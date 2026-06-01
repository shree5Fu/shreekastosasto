-- ShreeSasto Shop PostgreSQL Database Schema
-- Run these migrations in your Supabase SQL editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (for Sellers)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  rating NUMERIC DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  badge TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  total NUMERIC NOT NULL CHECK (total >= 0),
  shipping_name TEXT,
  shipping_email TEXT,
  shipping_address TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'))
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC NOT NULL CHECK (price >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Products policies
-- Anyone can read products (public catalog)
CREATE POLICY "Products are publicly readable" ON products
  FOR SELECT TO public USING (true);

-- Only sellers can insert their own products
CREATE POLICY "Sellers can insert own products" ON products
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = seller_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
  );

-- Only sellers can update their own products
CREATE POLICY "Sellers can update own products" ON products
  FOR UPDATE TO authenticated
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

-- Only sellers can delete their own products
CREATE POLICY "Sellers can delete own products" ON products
  FOR DELETE TO authenticated
  USING (auth.uid() = seller_id);

-- Orders policies
-- Anyone can create an order (for checkout)
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT TO public
  WITH CHECK (true);

-- Users can view orders (in a real app, you'd restrict this more)
CREATE POLICY "Orders are readable" ON orders
  FOR SELECT TO public USING (true);

-- Allow updating order status
CREATE POLICY "Orders can be updated" ON orders
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Order items policies
-- Anyone can create order items (for checkout)
CREATE POLICY "Anyone can create order items" ON order_items
  FOR INSERT TO public
  WITH CHECK (true);

-- Order items are readable
CREATE POLICY "Order items are readable" ON order_items
  FOR SELECT TO public USING (true);

-- Insert some sample products (optional - remove in production)
-- INSERT INTO products (id, name, price, image_url, category, description, features, rating, stock, badge) VALUES
-- ('prod-sample-001', 'Sample Keyboard', 149.99, 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800', 'Electronics', 'A sample product', ARRAY['Feature 1', 'Feature 2'], 4.5, 50, 'New');
