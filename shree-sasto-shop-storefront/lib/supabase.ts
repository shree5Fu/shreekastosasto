import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if both env vars are provided
export const supabase: SupabaseClient | null = 
  supabaseUrl && supabaseAnonKey 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : null

export const isSupabaseConfigured = !!supabase

export type Product = {
  id: string
  name: string
  price: number
  image_url: string
  category: string
  description: string | null
  features: string[]
  rating: number
  stock: number
  seller_id: string | null
  badge?: string
}

export type Profile = {
  id: string
  store_name: string
  email: string | null
}

export type Order = {
  id: string
  created_at: string
  total: number
  shipping_name: string | null
  shipping_email: string | null
  shipping_address: string | null
  status: string
}

export type OrderItem = {
  id: number
  order_id: string
  product_id: string | null
  quantity: number
  price: number
}

// Check if Supabase is configured
export async function checkSupabaseConnection(): Promise<boolean> {
  if (!supabase) {
    return false
  }
  
  try {
    const { error } = await supabase.from('products').select('id').limit(1)
    return !error
  } catch {
    return false
  }
}
